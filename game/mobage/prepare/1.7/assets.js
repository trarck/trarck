var fs = require('fs');
var util = require ('util');
var crypto = require('crypto');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var utils = require('./utils');

var File = require('./file');
var Async = require('./async');


exports.process_assets = function(manifest_file, output_dir, base_path, options, callback, request) {
	var useDirectManifestCopy = Boolean(options.directManifestCopy);

	if (useDirectManifestCopy) {
		var manifest = typeof manifest_file === 'string'
			? JSON.parse(File.readFileSyncSafe(manifest_file))
			: manifest_file
		for(var category in manifest) {
			if(/_encrypted$/.test(category)) {
				console.log("Encrypted section found in manifest; fallback to non-directManifestCopy");
				useDirectManifestCopy = false;
				break;
			}
		}
	}

	if (useDirectManifestCopy) {
		_process_manifest_cp(manifest_file, output_dir, base_path, options, callback, request);
	} else {
		_process_assets(manifest_file, output_dir, base_path, options, callback, request);
	}
	
};

/**
 * Only one Java process is executed by manifest unit.
 */
function _process_manifest_cp(manifest_file, output_dir, base_path, options, callback, request) {

	var execCp = 'java -Xmx256m -cp "%s%s%s" ManifestCopy "%s" "%s" buildtarget=%s';
	var classPathSep = utils.isWin() ? ';' : ':'; 
	execCp = utils.stringf(execCp, 
			[path.join(__dirname, 'lib/java'),  
			 classPathSep,
			 path.join(__dirname, 'lib/java/json_simple-1.1.jar'), 
			 manifest_file, base_path, utils.getDevice(request, options)]);

	exec(execCp, function (error, stdout, stderr) {
		utils.info("process_assets: ManifestCopy %s \n%s", execCp , stdout);

		if (error !== null) {
			throw new Error(execCp + "\n" + stdout + "\n" + stderr);
		}
		if(callback) {
			callback();
		}
	});
};

/**
 * Run existing processing for Mac or Linux
 */
function _process_assets(manifest_file, output_dir, base_path, options, callback, request,buildTarget) {
	
	if(typeof manifest_file == 'string'){
		var manifest = JSON.parse(File.readFileSyncSafe(manifest_file));
	}
	else {
		var manifest = manifest_file;
	}
    buildTarget=typeof buildTarget=="undefined"?utils.getDevice(request,options):buildTarget;

	var images = [];
	var ts = new Async.WorkPool();
	var asset_categories = ['textures', 'audio', 'other', 'textures_encrypted', 'audio_encrypted', 'other_encrypted'];
	for(var a in asset_categories){
		if(manifest[asset_categories[a]]){
			var asset_list = manifest[asset_categories[a]];

			for(var i in asset_list){
				var search_path = path.join(base_path, asset_list[i]);
				var file_list = File.glob(search_path);
				var base_size = base_path.split('/').length;
				if(base_path.replace('/', '') == '.') base_size = 0;
				for(var j in file_list){
					(function(){
						var rel_path = file_list[j].split('/').slice(base_size).join('/');
						var input_path = file_list[j];

						var copy_path = path.join(output_dir, rel_path);
						var android_copy_path = path.join(output_dir, 'android', rel_path);
						var ios_copy_path = path.join(output_dir, 'ios', rel_path);
						var flash_copy_path = copy_path;

						var catName = asset_categories[a];
					        var encrypt = /_encrypted$/.test(asset_categories[a]);
						//console.log('copy_image_file', input_path, copy_path, android_copy_path);
						ts.enqueue(function(done){
							// console.log("Copying ", input_path, copy_path);
							var ts2 = new Async.TaskSet();

							var versions = null;
                            //TODO handle mapping 使用函数映射处理各种情况
                            switch(buildTarget){
                                case utils.DeviceType.ALL:
                                    copy_asset(input_path, flash_copy_path, false, encrypt, ts2.task() ,request, options);
                                    copy_asset(input_path, ios_copy_path, false, encrypt, ts2.task() ,request);
                                    copy_asset(input_path, android_copy_path, (catName == 'other' ? false : true), encrypt, ts2.task(),request, options,true);
                                    break;
                                case utils.DeviceType.FLASH:
                                    copy_asset(input_path, flash_copy_path, false, encrypt, ts2.task() ,request, options);
                                    break;
                                case utils.DeviceType.IOS:
                                    copy_asset(input_path, ios_copy_path, false, encrypt, ts2.task() ,request, options);
                                    break;
                                case utils.DeviceType.ANDROID:
                                    copy_asset(input_path, android_copy_path, (catName == 'other' ? false : true), encrypt, ts2.task() ,request, options,true);
                                    break;
                            }
							ts2.join(done);
						});
					})();
				}
			}
		}
	}
	ts.join(function(){
        //sub modules
        var tsSub = new Async.TaskSet();
        var submodule_categories=["ios","android","flash"];
		//根据大类来生成
        switch(buildTarget){
            case utils.DeviceType.ALL:
                submodule_categories=["ios","android","flash"];
                break;
            case utils.DeviceType.FLASH:
                submodule_categories=["flash"];
                break;
            case utils.DeviceType.IOS:
                submodule_categories=["ios"];
                break;
            case utils.DeviceType.ANDROID:
                submodule_categories=["android"];
                break;
        }
        for(var i in submodule_categories){
            var subBuildTargetName=submodule_categories[i];
            var submodule=manifest[subBuildTargetName];
            //console.log("submodule:***{",submodule)
            if(submodule){
                _process_assets(submodule, output_dir, base_path, options, tsSub.task(), request,utils.DeviceType[subBuildTargetName.toUpperCase()]);
            }
            //console.log("}***")
        }
        tsSub.join(function(){
            if(callback) callback();
        });
	});
	
};


function copy_asset(source, dest, resize, encrypt, callback, request, options,isAndroid){
	var sstat = null;
	var dstat = null;
	var copy = false;
	if(!File.exists(dest)){
		copy = true;
	} else {
		sstat = fs.statSync(source);
		dstat = fs.statSync(dest);
		
		if (isAndroid) {
			if(sstat.mtime.getTime() > dstat.mtime.getTime()) {
				copy = true;
			}
		} else {
			if(sstat.mtime.getTime() != dstat.mtime.getTime() || sstat.size != dstat.size) {
				copy = true;
			}
		}
		if (utils.enableDebug()) utils.debug("assets : copy_asset " + source + " s:" +sstat.mtime.getTime() + ":"+ sstat.size +"  d:" + dstat.mtime.getTime() + ":" + dstat.size +  " -> " + copy);
	}

	var abort = function(err){
		utils.error('assets : Could not copy ' + source + ' to ' + dest, err);
		done();
	};

	if(copy) {
		File.mkdirp(path.dirname(dest), 0777);

		if (utils.enableDebug()) utils.debug("assets : process_assets " + source + " " + dest);
		
		var encryptFunc = function () {
			if (encrypt) {
				File.encryptFile(dest, File.ENCRYPTION_XOR55_WITHHEADER(), function () {
					if (callback) callback();
				});
			} else {
				if (callback) callback();
			}
		};

		exec('cp -p "' + source + '" "' + dest + '"',
			function (error, stdout, stderr)
			{
				if (error !== null)
				{
					utils.info('assets : stdout ' + stdout);
					utils.info('assets : stderr ' + stderr);
					utils.info('assets : exec error ' + error);
					abort(error);
					return;
				}
				
				if ( resize && dest.match(/\.jpe?g$|\.png$/i) ) {
					if (utils.enableDebug()) utils.debug("assets : resize_path " + source + " " + dest);
					var resize_path = path.join(__dirname, 'images.py');
					//Call images.py to convert images. images.py should be in the same directory as server code
					var sips = spawn(resize_path,[dest]);
					sips.stdout.on('data', util.print);
					sips.on('exit', function(code, signal) {
						if (code != 0) {
							throw new Error("Asset Resizing Failed: " + dest);
							process.exit(1);
						}
						encryptFunc();
					});
				} else {
					encryptFunc();
				}
				// update file time  
				// fs.futimesSync(dest, sstat.atime, sstat.mtime);
			}
		);
	}
	else {
		//This line was originally just "if (callback) callback();", but that was leading to a segmentation fault on 
		//VIP prepare.  This code change is a bit of a hack, but it makes the segfault go away.
		if(callback) setTimeout(callback, 0);
	}	
}
