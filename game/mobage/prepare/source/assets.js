var fs = require('fs');
var util = require ('util');
var crypto = require('crypto');
var path = require('path');
var exec = require('child_process').exec;
var sys = require('sys');
var spawn = require('child_process').spawn;
var utils = require('./utils');

var File = require('./file');
var Async = require('./async');


exports.process_assets = function(manifest_file, output_dir, base_path, options, callback, request,buildTarget) {
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
        for(var i in submodule_categories){
            var subBuildTargetName=submodule_categories[i];
            var submodule=manifest[subBuildTargetName];
            if(submodule){
                exports.process_assets(submodule, output_dir, base_path, options, tsSub.task(), request,utils.DeviceType[subBuildTargetName.toUpperCase()]);
            }
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
				File.encryptFile(dest, function () {
					if (callback) callback();
				});
			} else {
//                File.makeSameFileState(source,dest,callback);
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
				if(resize){
					if (utils.enableDebug()) utils.debug("assets : resize_path " + source + " " + dest);
					var resize_path = path.join(__dirname, 'images.py');
					//Call images.py to convert images. images.py should be in the same directory as server code
					var sips = spawn(resize_path,[dest]);
					sips.stdout.on('data', util.print);
					sips.on('exit', encryptFunc);
				} else {
					encryptFunc();
				}
				// update file time  
				// fs.futimesSync(dest, sstat.atime, sstat.mtime);
			}
		);
	}
	else {
		if(callback) callback();
	}	
}