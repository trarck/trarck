var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var exec = require('child_process').exec;

var File = require('./file');
var Async = require('./async');
var Combiner = require('./combiner');
var Assets = require('./assets');
var utils = require('./utils');


// Base item. This is what we transmit, but it gets modified on device
NgManifestItem = function (fname, isCode)
{
	this.hash = md5(fname);
	this.size = fs.statSync(fname).size;

	if(!isCode && fname.slice(fname.length - 3) == '.js')
	{
		this.is_code = false;
	}
};

exports.create_manifest = function(manifest_file, output_root, fname, base_path, options, callback, request){
//	utils.info("Creating manifest file");
	
	//default true
	var COMBINE_MODE = typeof options.combine == 'undefined' || options.combine == 'true';
	//default false
	var COMPRESS_MODE = typeof options.compress != 'undefined' && options.compress == 'true';
	//default true
	var CONVERT_MODE = false; //typeof options.suppressUCS2 == 'undefined' || options.suppressUCS2 != 'true';
	var settings = {COMBINE_MODE:COMBINE_MODE,COMPRESS_MODE:COMPRESS_MODE,CONVERT_MODE:CONVERT_MODE};
	
	var manifest;
	if(typeof manifest_file == 'string'){
		manifest = JSON.parse(File.readFileSyncSafe(manifest_file));
	}
	else {
		manifest = manifest_file;
	}
	
	var dependencyGraph = null;
	try {
		dependencyGraph = Combiner.getDependencyGraphForSettings(base_path,settings);
	} catch (e){
		//Secondary Manifests can't really have code right now. Update this when they can!
	}
	
	fname = fname ? fname : "webgame.ngmanifest";
	var mainManifest = Boolean(manifest.code) || Boolean(manifest.code_encrypted);
	
	var version_tasks = new Async.WorkPool();
	var versions = null;
	if (utils.isAllBuild(request, options)) {
		versions = ['', 'ios', 'android'];
	}else if(utils.isFlash(request, options)){
		versions = [''];
	}else if(utils.isIOS(request, options)){
		versions = ['ios'];
	}else if(utils.isAndroid(request, options)){
		versions = ['android'];
	}
	for(var i in versions){
		(function(){
			var version = versions[i];
			version_tasks.enqueue(function(done){
				var i;
				var buffer = {};
				if(!base_path) base_path = '';

				var output_dir = path.join(output_root, version, '/').replace(/\/$/, '');
				//console.log("Output dir: " + output_dir)

				File.mkdirp(output_dir, 0777);

				// GL Images / Textures
				buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.textures));
			        buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.textures_encrypted), File.ENCRYPTION_XOR55_WITHHEADER());

				// music
				buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.audio));
				buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.audio_encrypted), File.ENCRYPTION_XOR55_WITHHEADER());

				// other
				buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.other));
			        buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.other_encrypted), File.ENCRYPTION_XOR55_WITHHEADER());

                //sub modules
                var subModule=version && manifest[version];
                if(subModule){
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.textures));
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.textures_encrypted), File.ENCRYPTION_XOR55_WITHHEADER());

                    // music
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.audio));
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.audio_encrypted), File.ENCRYPTION_XOR55_WITHHEADER());

                    // other
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.other));
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.other_encrypted), File.ENCRYPTION_XOR55_WITHHEADER());
                }
				// javascript
			        // TODO add support for "code_encrypted"
				var scripts = [];
				var scriptsEncrypted = [];
				var ts = new Async.TaskSet();
				if(COMBINE_MODE){
					scripts = js_include_list(manifest, dependencyGraph, COMBINE_MODE, mainManifest);
					for (var i in scripts)
						if (dependencyGraph.encryptedFiles.indexOf(scripts[i].replace(/^(?:\.\/|)(.*)\.js$/, "$1")) != -1)
							scriptsEncrypted.push(scripts[i]);
				} else {
					console.log("create_manifest NO_COMBINE_MODE");
					ts.task(function(){
						for(var i in dependencyGraph.map){
							if(dependencyGraph.map[i]){
								scripts.push(dependencyGraph.map[i] + ".js");
								if(dependencyGraph.encryptedFiles.indexOf(dependencyGraph.map[i]) != -1)
									scriptsEncrypted.push(dependencyGraph.map[i] + ".js");
							}
						}
						
						buffer["deps.js"] = new NgManifestItem(File.join(output_dir,"deps.js"), true);
					})();
				}

				ts.join(function(){
					if(!COMBINE_MODE){
						// Add module handling code
						var helperfile = fs.openSync(path.join(output_dir,"ngDebugModeHelper.js"), 'w');
						fs.writeSync(helperfile, File.readFileSyncSafe(path.join(__dirname, 'templates/header.js')).toString());
						fs.closeSync(helperfile);
						scripts.unshift('ngDebugModeHelper.js');
					}

					for(i in scripts){
						buffer[scripts[i]] = new NgManifestItem(File.join(output_dir, scripts[i]), true);
						if (scriptsEncrypted.indexOf(scripts[i]) != -1)
							buffer[scripts[i]].encryption = File.ENCRYPTION_XOR55_NOHEADER(); // use integer so that we can add other algorithms
					}

					// add the index.html (!android only)
					if(version != 'android' && mainManifest){
						utils.info("manifest : create_manifest output=%s", output_dir);
						buffer["index.html"] = new NgManifestItem(File.join(output_dir, "index.html"));
					}

					if ((version == 'android' || version == 'ios') && mainManifest) {
						// KAZUHO MOB-3163,MOB-3893 update the hash values in index.json (this is a hack but doing this way would have minimal impact on the soon-retiring old bake tool)
						var index_json = JSON.parse(File.readFileSyncSafe(output_dir + "/index.json"));
						for (var i in index_json.scripts) {
							var fn = index_json.scripts[i].name;
							index_json.scripts[i].hash = buffer[fn].hash;
							if (typeof buffer[fn].encryption != "undefined")
								index_json.scripts[i].encryption = buffer[fn].encryption;
						}
						fs.writeFileSync(output_dir + "/index.json", JSON.stringify(index_json));
						buffer['index.json'] = new NgManifestItem(File.join(output_dir, 'index.json'));
					}
					
					generateArchives(fname, output_dir, buffer, options.generateArchives, function()
					{
						// Change the buffer to a string of data
						buffer = JSON.stringify(buffer) + '\n';
						
						utils.info("fname: ",fname);
						var mpath = path.join(output_dir, fname);
						var file = fs.openSync(mpath, 'w');
						
						utils.info("manifest : create_manifest file=" + mpath);

						fs.writeSync(file, buffer);
						fs.closeSync(file);

						if(done) done();
					});
				});
			});
		})();
	}

	version_tasks.join(callback);
};

function generateArchives(fname, output_dir, buffer, enabled, cb)
{
	// Options come in from Jake as strings.  Need a bool here.
	enabled = Boolean ( JSON.parse( enabled || false ) );

	if(!enabled)
	{
		cb();
		return;
	}
	
	var ignoreSuffixes = [
		// Images.
		'.png', '.PNG',
		'.jpg', '.JPG',
		'.jpeg', '.jpeg',
		
		// Sounds.
		'.mp3', '.MP3',
		'.zip', '.ZIP',
		'.caf', '.CAF'
	];
	ignoreSuffixes = ignoreSuffixes.join(':');
	
	var alwaysCompressSuffixes = [
		'.html', '.HTML',
		'.htm',  '.HTM',
		'.js',   '.JS',
		'.css',  '.CSS',
		'.json', '.JSON',
		'.xml',  '.XML',
		'.txt',  '.TXT',
		'.jpg',  '.JPG',
		'.jpeg', '.JPEG'
	];
	
	var includeSuffixesArray = [
		'.js', '.JS',
		'.json', '.JSON'
	];
	var includeSuffixesString = '';
	for(var l=0; l < includeSuffixesArray.length; ++l)
	{
		if(l != 0)
			includeSuffixesString += '|';
		includeSuffixesString += includeSuffixesArray[l] + '$';
	}
	includeSuffixesReg = new RegExp(includeSuffixesString);
	
	// Maximum size of file to compress.
	var sizeTolerance = 32 * 1024;
	
	// Maximum size of each archive.
	var archiveSize = 128 * 1024;
	
	var filesTally = []; // List of files to be zipped.
	var sizeTally = 0; // Current # of bytes in filesTally
	var archiveNumber = 1; // Unique index for zip file.
	var files = {}; // Output array zip records.
	var queue = new Async.WorkPool(2);
	
	// Forms a zip file for a list of input files and stuffs into files array.
	function enqueueZip(number, inputFiles)
	{
		// Build up cmd line command to zip the files.
		var zipName = fname + '.' + number + '.zip';
		var zipPath = path.join(output_dir, zipName);
		var zipExpSize = 0;

		var class_path = path.join(__dirname, 'lib/java');
		var cmd = 'java -cp "%s" GenerateArchives "%s" "%s" "%s" ' ;
		cmd = utils.stringf(cmd, [class_path, output_dir.replace(/\\/g, "/"), zipName, ignoreSuffixes]);

		for(var i = 0; i < inputFiles.length; ++i)
		{
			var file = inputFiles[i];
			cmd += ' ' + file;
			buffer[file].arcn = number;
			zipExpSize += buffer[file].size;
		}
		
		// Execute command.
		queue.enqueue(function(done)
		{
		
			exec(cmd, function(err, stdout, stderr)
			{
				if(err)
				{
					utils.info(number + ': err ' + err);
					utils.info(number + ': stdout ' + stdout);
					utils.info(number + ': stderr ' + stderr);
					utils.info(number + ': cmd ' + cmd);
				}
				var zipHash = md5(zipPath);
				utils.info("manifest : GenerateArchives %s \n%s", cmd , stdout);

				var zipSize = fs.statSync(zipPath).size;
				files[number] = {name: zipName, arcSize: zipSize, expSize: zipExpSize, hash: zipHash};
				done();
			});
		});
	}
	
	// Creates a duplicate, name mangled version of the file and marks its existance in teh manfiest.
	function mangleFile(file)
	{
		queue.enqueue(function(done)
		{
			
			File.copy(path.join(output_dir, file), path.join(output_dir, File.mangle(file)));
			buffer[file].mangled = true;
			done();

//			var cmd = 'cp ' + output_dir + '/' + file + ' ' + output_dir + '/' + File.mangle(file);
//			utils.debug("manifest : mangleFile cmd=%s", cmd);
//			exec(cmd, function(err, stdout, stderr)
//			{
//				if(err)
//				{
//					utils.info(file + ': err ' + err);
//					utils.info(file + ': stdout ' + stdout);
//					utils.info(file + ': stderr ' + stderr);
//					utils.info(file + ': cmd ' + cmd);
//				}
//				buffer[file].mangled = true;
//				done();
//			});
		});
	}
	
	function alwaysCompress(name)
	{
		// Must prevent issue of carriers re-writing
		// content in-flight and breaking MD5 verification.
		return true;
	
		/*
		for(var i=0; i < alwaysCompressSuffixes.length; ++i)
		{
			var includeSuffix = alwaysCompressSuffixes[i];
			var actualSuffix = name.slice(name.length - includeSuffix.length);
			if(actualSuffix == includeSuffix)
				return true;
		}
		return false;
		*/
	}
	
	// Iterate over buffer and dispatch each file into a zip.
	for(var file in buffer)
	{
		var props = buffer[file];
		var size = props.size;
		
		var force = alwaysCompress(file);
		if(force)
		{
			props.arcForce = true;
		}

		// If this file is larger than our tolerance, ignore it, except if in the whitelist suffixes.
		if(size < sizeTolerance || file.search(includeSuffixesReg) != -1)
		{
			// Increase counters.
			sizeTally += size;
			filesTally.push(file);
			
			// If the current tally is above our tolerance, dispatch a zip.
			if(sizeTally >= archiveSize)
			{
				// Zip it, zip it real good.
				enqueueZip(archiveNumber, filesTally);
				
				// Now reset counters.
				filesTally = [];
				sizeTally = 0;
				archiveNumber += 1;
			}
		}
		else if(force)
		{
			enqueueZip(archiveNumber, [file]);
			archiveNumber += 1;
		}
		else
		{
			mangleFile(file);
		}
	}
	
	// If there are ny files left over, also stuff them into a zip.
	if(filesTally.length)
	{
		enqueueZip(archiveNumber, filesTally);
	}
	
	// Now way for them all to finish.
	queue.join(function()
	{
		buffer['__archives'] = {
			hash: '00000000000000000000000000000000',
			size: 0,
			archive: true,
			files: files
		};
		
		cb();
	});
}

function chain_gen_manifest(fname, cb, output_root, base_path, server_options, request) {
	
	var options = server_options;
	//default true
	var COMBINE_MODE = typeof options.combine == 'undefined' || options.combine == 'true';
	//default false
	var COMPRESS_MODE = typeof options.compress != 'undefined' && options.compress == 'true';
	//default true
	var CONVERT_MODE = false; //typeof options.suppressUCS2 == 'undefined' || options.suppressUCS2 != 'true';
	var settings = {COMBINE_MODE:COMBINE_MODE,COMPRESS_MODE:COMPRESS_MODE,CONVERT_MODE:CONVERT_MODE};
	
	return function() {
		if (utils.enableDebug())
			utils.debug("manifest : generating manifest for " + fname );
		try
		{
			console.log("***** Warning: this codepath may be busted due to FastBoot");
			var manifest = JSON.parse( File.readFileSyncSafe( fname ) );
			
			var dstKey = fname.match(/manifest\.(.*?)\.json/)[ 1 ];
			if ( dstKey )
			{
				var dst = "webgame." + dstKey + ".ngmanifest";
				
				Assets.process_assets(fname, output_root, base_path, server_options, function()
				{
					//utils.info([manifest, dependencyGraph, output_root, dst,base_path,server_options].join(" - "));
					exports.create_manifest(manifest, output_root, dst, base_path, server_options, cb, request);
				}, request);
			}
			else
			{
				throw new Error ( "dstKey not set, regexp failed on " + fname );
			}
		}
		catch( ex )
		{
			utils.info( "manifest : Could not generate secondary manifest for " + fname + "\n" + ex );
			throw ex;
		}
	}
}

exports.genSecondaryManifests = function(output_root, base_path, server_options, callback, request)
{
	utils.info( "manifest : output_root=%s base_path=%s options=%s", output_root, base_path, JSON.stringify( server_options ));

	if( base_path )
	{
		var spath = path.join(base_path,"Manifests/manifest.*.json");
		var files = File.glob(spath, "./", false);
		utils.info("manifest : generating secondary manifests for " + files.length + " files" );
		
		var cb = function(){};
		if (callback) cb = callback;

        var configBuildTarget=getConfigBuildTarget(server_options,request);

		for( var ind = files.length -1; ind >= 0 ; --ind )
		{
            buildTarget=getBuildTarget(files[ ind ],configBuildTarget);

            if(buildTarget){
                var newOptions={};
                for(var name in server_options){
                    newOptions[name]=server_options[name];
                }
                newOptions.buildtarget=buildTarget;
                cb = chain_gen_manifest(files[ ind ], cb, output_root, base_path, newOptions, request);
            }
		}
		
		cb();
	}
};


exports.getBasePath = function(uri){
	// utils.info("URI: " + uri)
	// utils.info("CWD:" + process.cwd())
	var parts = uri.split('/');
	parts.shift();
	while(parts.length){
		var base = parts.join('/');
		if(base == '') base = '.';
		var p = path.join(base, 'manifest.json');
		// utils.info("Looking for manifest in : "+p);
		if(File.exists(p)){
			return base;
		}
		else {
			parts.pop();
		}
	}
	utils.warn("manifest : Manifest file not found for uri = " + uri);
	return null;
};

exports.create_index = function(manifest_file, output_dir, base_path, options, callback, request){
	console.log("create_index: ",JSON.stringify(options));
	
	//default true
	var COMBINE_MODE = typeof options.combine == 'undefined' || options.combine == 'true';
	//default false
	var COMPRESS_MODE = typeof options.compress != 'undefined' && options.compress == 'true';
	//default true
	var CONVERT_MODE = false; //typeof options.suppressUCS2 == 'undefined' || options.suppressUCS2 != 'true';
	var settings = {COMBINE_MODE:COMBINE_MODE,COMPRESS_MODE:COMPRESS_MODE,CONVERT_MODE:CONVERT_MODE};

	if(typeof manifest_file == 'string'){
		var manifest = JSON.parse(File.readFileSyncSafe(manifest_file));
	}
	else {
		var manifest = manifest_file;
	}
	var dependencyGraph = Combiner.getDependencyGraphForSettings(base_path,settings);
	
	//FIXME: use better templating
	var replace_string = '<!--!! SCRIPTS !!!-->';
	var buffer = '';

	// Scripts list
	var scripts = [];
	var manifested = [];

	// Using a taskset because I'm lazy.  Tasksets even work for 0 tasks!
	// This way, you don't have to code around maybe going async.
	var ts = new Async.TaskSet();
	if(COMBINE_MODE){
		//console.log("create_index: COMBINE_MODE");
		scripts = js_include_list(manifest, dependencyGraph, COMBINE_MODE, true);
	} else {
		//console.log("create_index: NO_COMBINE_MODE");
		// dependencyGraph [multi-phase-boot] way of creating the index
		var file_header = File.readFileSyncSafe(path.join(__dirname, 'templates/header.js')).toString();
		buffer += '<script>'+file_header+"</script>\n\t";
		
		ts.task(function(){
			var files = Object.keys(dependencyGraph.entryPoints.boot.requiredFiles);
			var filesInManifest = Array.prototype.concat(manifest.code || [], manifest.code_encrypted || []);
			for(var i = 0; i < files.length; i++){
				if(files[i]){
					if(filesInManifest.indexOf("./"+Combiner.toRelativePath(files[i], base_path)) != -1){
						//console.log("Manifested: "+ files[i]);
						manifested.push(dependencyGraph.getOutputPath(files[i]) + ".js");
					} else {
						//console.log("moop",files[i]);
						scripts.push(dependencyGraph.getOutputPath(files[i]) + ".js");
					}
				}
			}
			scripts.unshift("deps.js");

			// Add module handling code

			var os = utils.getDeviceDir(request, options);
			var helperfile = fs.openSync(path.join(output_dir, os, "ngDebugModeHelper.js"), 'w');
			fs.writeSync(helperfile, File.readFileSyncSafe(path.join(__dirname, 'templates/header.js')).toString());
			fs.closeSync(helperfile);
			scripts.unshift('ngDebugModeHelper.js');
		})();
	}

	ts.join(function(){
		var jss = [];

		// Create script tags
		for(var i = 0; i < scripts.length; i++) {
			// JMarr append the md5 of the file to the script name with a '?'.
			// This works around an issue in WebKit where it won't reload
			// a cached javascript file from disk, even if its changed.
			// Adding the ? parameter prevents this caching.
			
			var hash = md5(File.join(output_dir, utils.getDeviceDir(request, options) , scripts[i]));
			buffer += '<script src="'+scripts[i]+'?h='+ hash +'" charset="UTF-8"></script>\n\t';

			var jsObject = {name: scripts[i], hash: hash};
			if (COMBINE_MODE && scripts.length == 1 && manifest.code_encrypted)
				jsObject.encryption = 1;
			jss.push(jsObject);
		}

		manifested.map(function(script) {
			var hash = md5(File.join(output_dir, utils.getDeviceDir(request, options) , script));
			buffer += '<script src="'+script+'?h='+ hash +'" charset="UTF-8"></script>\n\t';

			var jsObject = {name: script, hash: hash};
			if (manifest.code_encrypted) {
				jsObject.encryption = 1;
			}
			jss.push(jsObject);
		});

		// Read template
		var template = File.readFileSyncSafe(path.join(__dirname, 'templates/index.html')).toString();
		buffer = template.replace(replace_string, buffer);

		// Write file
//		utils.info("writing " + output_dir+"/index.html");
		fs.writeFileSync(output_dir+"/index.html", buffer);
		fs.writeFileSync(output_dir+"/ios/index.html", buffer);

		// Write index.json
		var index_json = { scripts: jss };
		fs.writeFileSync(output_dir+"/android/index.json", JSON.stringify(index_json));
		fs.writeFileSync(output_dir+"/ios/index.json", JSON.stringify(index_json));

		if(callback) callback();
	});
};

function join_content(baseObject, newStuff, encryption_algo)
{
	for (i in newStuff)
	{
		baseObject[i] = new NgManifestItem(newStuff[i]);
   	        if (encryption_algo)
		    baseObject[i].encryption = encryption_algo;
	}
	return baseObject;
}

function generate_content_chunk(base_path, pattern_list) {
//	utils.debug("manifest : *** generate_content_chunk base_path=%s, pattern_list=%s", base_path, pattern_list);

	if (utils.isWin()) {
		// windows drive name. search with a current pass. 
		var currentPath = process.cwd() + File.separator;
		base_path = base_path.replace(currentPath, '');
		base_path = utils.replacePathToSlash(base_path);
	}
	
	var buffer = new Object();
	for(var i in pattern_list){
		var search_path = path.join(base_path, pattern_list[i]);
		
		var file_list = File.glob(search_path, undefined, false);
//		utils.debug("manifest : *** base_path=%s , search_path=%s, file_list=%s",base_path, search_path, JSON.stringify(file_list));

		if (base_path == './') {
			var base_size = 0;
		}
		else {
			var base_size = base_path.split('/').length;
			if (utils.isWin()) {	 
				base_size = base_size - 1;	// Because the top of the pass is not Slash
			}
		}
		
//		utils.info("Search returned " + file_list + "\n");
		
		for(var j in file_list){
			buffer[file_list[j].split('/').slice(base_size).join('/')] = file_list[j];
		}
	}
	
	return buffer;
}

function all_js_files(p, base){
	var files = [];
	
	// utils.info('all_js_files', p, base);
	
	var dir_files = fs.readdirSync(p);
	for(var i in dir_files){
		var dir_file = dir_files[i];
		if(dir_file.match(/\.js$/) && dir_file != 'application.js'){
			// utils.info('all_js_files found ' + dir_file)
			if(base) files.push(path.join(base, dir_file));
			else files.push(dir_file);
		}
		else{
			var stats = fs.statSync(path.join(p, dir_file));
			if( stats.isDirectory() ){
				var b = typeof base == 'undefined' ? dir_file : path.join(base, dir_file);
				files = files.concat(all_js_files(path.join(p, dir_file), b));
			}
		}
	}
	
	// utils.info("all_js_files files " + files)
	
	return files;
}

function js_include_list(manifest, dependencyGraph, combine, mainManifest){
	// Used by COMBINE_MODE
	var includes = [];
	if(combine){
		for(var i in manifest.libraries){
			includes.push(i+'.js');
		}
	} else {
		console.log("DEAD CODEPATH???");
		for(var i in dependencyGraph.map){
			if(dependencyGraph.map[i]){
				includes.push(dependencyGraph.map[i] + ".js");
			}
		}
	}
	if( mainManifest )
		includes.push('application.js');
	return includes;
}

function md5(fname){
	// utils.info("MD5: " + fname);
	var hash = crypto.createHash ( "md5" );
	var data = hash.update ( File.readFileSyncSafe ( fname, "binary" ) );
	var out = hash.digest ( "hex" );
	return out;
}

//===========以下内容是对区分文件名的buildtarget的区分========//

var TargetMapping={
    1:"ios",
    2:"android",
    4:"flash",
    7:"all",
    "IOS":1,
    "ANDROID":2,
    "FLASH":4,
    "ALL":7
};

/**
 * 取得文件名中包含的manifest文件类型
 * 和配置的buildtarget比较获得最终需要生成的manifest类型
 * 例：
 * Manigests文件夹下有以下内容
 * manifest.common.json
 * manifest.test_android.json
 * manifest.test_ios.json
 * 则当使用默认配置build时候，
 *      android下生成：manifest.common.json manifest.test_android.json
 *      ios下生成：manifest.common.json， manifest.test_ios.json
 *      content(flashs)下生成：manifest.common.json
 * 如果在build时候，使用buildtarget=android,
 *      android下则会忽略manifest.test_ios.json
 *      ios,flash整个被忽略
 * 同理buildtarget换成其它的也成立
 * @param manifestFile
 * @param configBuildtarget
 */
function getBuildTarget(manifestFile,configBuildtarget){
    var buildTarget=TargetMapping.ALL,//文件名带有的target.default is all
        optionBuildtarget,//参数中的
        destBuildTarget;//最终结果

    if(manifestFile.indexOf("_android")>-1){
        buildTarget=TargetMapping.ANDROID;
    }else if(manifestFile.indexOf("_ios")>-1){
        buildTarget=TargetMapping.IOS;
    }else if(manifestFile.indexOf("_flash")>-1){
        buildTarget=TargetMapping.FLASH;
    }
    destBuildTarget=buildTarget & configBuildtarget;
    return TargetMapping[destBuildTarget];
}

function getConfigBuildTarget(options,request){
    var configBuildtarget=0;
    if (utils.isAllBuild(request, options)) {
        configBuildtarget=TargetMapping.ALL;
    }else if(utils.isFlash(request, options)){
        configBuildtarget=TargetMapping.FLASH;
    }else if(utils.isIOS(request, options)){
        configBuildtarget=TargetMapping.IOS;
    }else if(utils.isAndroid(request, options)){
        configBuildtarget=TargetMapping.ANDROID;
    }
    return configBuildtarget;
}