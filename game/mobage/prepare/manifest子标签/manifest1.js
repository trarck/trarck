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
NgManifestItem = function (fname)
{
	this.hash = md5(fname);
	this.size = fs.statSync(fname).size;
};

exports.create_manifest = function(manifest_file, output_root, fname, base_path, options, callback, request){
//	utils.info("Creating manifest file");
	
	var COMBINE_MODE = typeof options.combine == 'undefined' || options.combine == 'true';
	if(typeof manifest_file == 'string'){
		var manifest = JSON.parse(File.readFileSyncSafe(manifest_file));
	}
	else {
		var manifest = manifest_file;
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
			        buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.textures_encrypted), 1);

				// music
				buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.audio));
				buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.audio_encrypted), 1);

				// other
				buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.other));
			        buffer = join_content(buffer, generate_content_chunk(output_dir, manifest.other_encrypted), 1);

                //sub modules
                var subModule=version && manifest[version];
                if(subModule){
                    // GL Images / Textures
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.textures));
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.textures_encrypted), 1);

                    // music
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.audio));
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.audio_encrypted), 1);

                    // other
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.other));
                    buffer = join_content(buffer, generate_content_chunk(output_dir, subModule.other_encrypted), 1);
                }

				// javascript
			        // TODO add support for "code_encrypted"
				var scripts = [];
				var ts = new Async.TaskSet();
				if(COMBINE_MODE){
					scripts = js_include_list(manifest, COMBINE_MODE, mainManifest);
				}
				else{
					Combiner.getAllRequires(manifest, base_path, ts.task(function(requires){
						for(var i in requires){
							var require_path_relative = Combiner.getRelativePath(requires[i], base_path);
							scripts.push(require_path_relative);
						}
						if(manifest.code) {
							for(i in manifest.code){
								scripts.push(Combiner.getRelativePath(manifest.code[i]));
							}
						}
						if(manifest.code_encrypted) {
							for(i in manifest.code_encrypted){
								scripts.push(Combiner.getRelativePath(manifest.code_encrypted[i]));
							}
						}

                        //sub modules
                        if(subModule){
                            Combiner.getAllRequires(subModule, base_path,ts.task(function(requires){
                                for(var i in requires){
                                    var require_path_relative = Combiner.getRelativePath(requires[i], base_path);
                                    if(utils.indexOf(scripts,require_path_relative))
                                    scripts.push(require_path_relative);
                                }
                                if(manifest.code) {
                                    for(i in manifest.code){
                                        scripts.push(Combiner.getRelativePath(manifest.code[i]));
                                    }
                                }
                                if(manifest.code_encrypted) {
                                    for(i in manifest.code_encrypted){
                                        scripts.push(Combiner.getRelativePath(manifest.code_encrypted[i]));
                                    }
                                }
                            }));
                        }
					}));
				}

				ts.join(function(){
					if(!COMBINE_MODE){
						// Add module handling code
						var helperfile = fs.openSync(path.join(output_dir,"ngDebugModeHelper.js"), 'w');
						fs.writeSync(helperfile, File.readFileSyncSafe(path.join(__dirname, 'templates/header.js')).toString());
						fs.closeSync(helperfile);
						scripts.unshift('ngDebugModeHelper.js');
					}

					var has_encrypted = mainManifest && typeof manifest.code_encrypted != "undefined" && manifest.code_encrypted.length != 0;
					for(i in scripts){
						buffer[scripts[i]] = new NgManifestItem(File.join(output_dir, scripts[i]));
						if (has_encrypted && ((COMBINE_MODE && scripts[i] == "application.js") || !COMBINE_MODE))
							buffer[scripts[i]].encryption = 1; // use integer so that we can add other algorithms
					}

					// add the index.html (!android only)
					if(version != 'android' && mainManifest){
						utils.info("manifest : create_manifest output=%s", output_dir);
						buffer["index.html"] = new NgManifestItem(File.join(output_dir, "index.html"));
					}

					generateArchives(fname, output_dir, buffer, options.generateArchives, function()
					{
						// Change the buffer to a string of data
						buffer = JSON.stringify(buffer) + '\n';

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
		var cmd = 'cd ' + output_dir + '; rm -fr ' + zipName + '; zip -q -n ' + ignoreSuffixes + ' ' + zipName;
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
			var cmd = 'cp ' + output_dir + '/' + file + ' ' + output_dir + '/' + File.mangle(file);
			exec(cmd, function(err, stdout, stderr)
			{
				if(err)
				{
					utils.info(file + ': err ' + err);
					utils.info(file + ': stdout ' + stdout);
					utils.info(file + ': stderr ' + stderr);
					utils.info(file + ': cmd ' + cmd);
				}
				buffer[file].mangled = true;
				done();
			});
		});
	}
	
	function alwaysCompress(name)
	{
		for(var i=0; i < alwaysCompressSuffixes.length; ++i)
		{
			var includeSuffix = alwaysCompressSuffixes[i];
			var actualSuffix = name.slice(name.length - includeSuffix.length);
			if(actualSuffix == includeSuffix)
				return true;
		}
		return false;
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
	return function() {
		if (utils.enableDebug())
			utils.debug("manifest : generating manifest for " + fname );
		try
		{
			var manifest = JSON.parse( File.readFileSyncSafe( fname ) );
			var dstKey = fname.match(/manifest\.(.*?)\.json/)[ 1 ];
			if ( dstKey )
			{
				var dst = "webgame." + dstKey + ".ngmanifest";
				
				Assets.process_assets(manifest, output_root, base_path, server_options, function()
				{
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
		
		for( var ind = files.length -1; ind >= 0 ; --ind )
		{
			cb = chain_gen_manifest(files[ ind ], cb, output_root, base_path, server_options, request);
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
	
	if (utils.isAndroid(request, options)) {
		if(callback) callback();
		return;
	}
	
	var COMBINE_MODE = typeof options.combine == 'undefined' || options.combine == 'true';

	if(typeof manifest_file == 'string'){
		var manifest = JSON.parse(File.readFileSyncSafe(manifest_file));
	}
	else {
		var manifest = manifest_file;
	}

	//FIXME: use better templating
	var replace_string = '<!--!! SCRIPTS !!!-->';
	var buffer = '';

	// Scripts list
	var scripts = [];
	// Using a taskset because I'm lazy.  Tasksets even work for 0 tasks!
	// This way, you don't have to code around maybe going async.
	var ts = new Async.TaskSet();
	if(COMBINE_MODE){
		scripts = js_include_list(manifest, COMBINE_MODE, true);
	}
	else{
		var file_header = File.readFileSyncSafe(path.join(__dirname, 'templates/header.js')).toString();
		buffer += '<script>'+file_header+"</script>\n";

		Combiner.getAllRequires(manifest, base_path, ts.task(function(requires){
			for(var i in requires){
				var require_path_relative = Combiner.getRelativePath(requires[i], base_path);
				scripts.push(require_path_relative);
			}
			if(manifest.code) {
				for(i in manifest.code){
					scripts.push(Combiner.getRelativePath(manifest.code[i]));
				}
			}
			if(manifest.code_encrypted) {
				for(i in manifest.code_encrypted){
					scripts.push(Combiner.getRelativePath(manifest.code_encrypted[i]));
				}
			}
		}));
	}

	ts.join(function(){
		// Create script tags
		for(i in scripts){
			// JMarr append the md5 of the file to the script name with a '?'.
			// This works around an issue in WebKit where it won't reload
			// a cached javascript file from disk, even if its changed.
			// Adding the ? parameter prevents this caching.
			
			var hash = md5(File.join(output_dir, utils.getDeviceDir(request, options) , scripts[i]));
			buffer += '<script src="'+scripts[i]+'?h='+ hash +'" charset="utf-8"></script>';
		}
		// Read template
		var template = File.readFileSyncSafe(path.join(__dirname, 'templates/index.html')).toString();
		buffer = template.replace(replace_string, buffer);

		// Write file
//		utils.info("writing " + output_dir+"/index.html");
		fs.writeFileSync(output_dir+"/index.html", buffer);
		fs.writeFileSync(output_dir+"/ios/index.html", buffer);

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
	var buffer = new Object();
	for(var i in pattern_list){
		var search_path = path.join(base_path, pattern_list[i]);
		var file_list = File.glob(search_path, undefined, false);
		if (base_path == './') {
			var base_size = 0;
		}
		else {
			var base_size = base_path.split('/').length;
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

function js_include_list(manifest,combine,mainManifest){
	var includes = [];
	for(var i in manifest.libraries){
		includes.push(i+'.js');
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
