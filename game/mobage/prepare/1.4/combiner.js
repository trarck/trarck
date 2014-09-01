var util = require ('util');
var fs = require('fs');
var path = require('path');
var File = require('./file');
var Async = require('./async');
var spawn = require("child_process").spawn;
var utils = require('./utils');
var log = require('sys').debug;


function indexOf(array, value, start){
	var index = -1;
	if(start == undefined){
		start = 0;
	}
	for(var i = start; i < array.length; ++i){
		if(array[i] == value){
			index = i;
			break;
		}
	}
	return index;
};

////////////////////////////////////////////////////////////////////////////////
// Run the legacy.js generation

function generateLegacy( options, callback )
{
	if(!options.suppressLegacy)
	{
		var root = ""
		if (options.buildDepth)
		{
			var i = options.buildDepth;
			while (i--)
			{
				root +='./.';
			}
		}
		var proc = spawn('make', ['-C', root + './NGCore/Legacy']);
		proc.on('exit', function()
		{
			callback();
		});
		proc.stdout.on('data',function(data) { console.log ( data.toString() ); } );
		proc.stderr.on('data',function(data) { console.log ( "generateLegacy error:\n" + data.toString() ); } );
	}
	else
	{
		callback();
	}
}

////////////////////////////////////////////////////////////////////////////////

function uniq(array){
	var uniq_values = [];
	for(var i = 0 ; i < array.length; ++i){
		if(indexOf(uniq_values, array[i]) == -1){
			uniq_values.push(array[i]);
		}
	}
	return uniq_values;
};

var allRequireRE = /(^|;|\n)[^\/]*[^\.]?require\s*\(\s*(\"|\')([^'"]+)(\'|\")\s*\)/gm;
var singleRequireRE = /require\s*\(\s*(\'|\")([^'"]+)/;

function escapeStringForRegexp(str) {
	var specials = new RegExp("[.*+?|()\\[\\]{}\\\\\\/]", "g"); // .*+?|()[]{}\
	return str.replace(specials, "\\$&");
}

function modulify(file_path){
	if (file_path.charAt(0) == '!') {
		file_path = file_path.substr(1);
	}
	var f = "$MODULE_FACTORY_REGISTRY['"+file_path.replace(/\.js$/, '')+"']";
	var g = "$MODULE_REGISTRY['"+file_path.replace(/\.js$/, '')+"']";

	return f + " = function(){var exports = "+g+" || {}; "+g+" = exports; "+File.readFileSyncSafe(file_path)+"; return exports;};\n";
}

function normalizeRequirePaths(file_path, content, process_func){
	if (file_path.charAt(0) == '!') {
		file_path = file_path.substr(1);
	}
	var dir = path.dirname(file_path);
	var matches = content.match(allRequireRE);
	if(matches){
		for(var i = 0; i < matches.length; ++i){
			var originalPath = matches[i].match(singleRequireRE)[2];
			var correctPath = originalPath;
			if (originalPath.charAt(0) != '.')
				correctPath = originalPath;
			else
				correctPath = path.join(dir, originalPath);

			if(process_func){
				correctPath = process_func(correctPath);
			}
			
			var str = '/require\\s*\\(\\s*(\'|")' + escapeStringForRegexp(originalPath) + '(\'|\")\\s*\\)/';
			content = content.replace(eval(str), "require('" + correctPath + "')");
		}
	}
	return content;
}


function parseRequires(file_path, callback, require_graph, require_cache){
	var requires = [];
	if(!require_graph) require_graph = {};

	if (file_path.charAt(0) == '!') file_path = file_path.substr(1);
	file_path = path.normalize(file_path);
	
	if (require_cache[file_path]) {
		callback(require_cache[file_path]);
		return;
	}
	
	if(!require_graph[file_path]){
		var dir = path.dirname(file_path);
		var file;
		try
		{
			file = File.readFileSyncSafe(file_path) + '';
		}
		catch ( ex )
		{
			console.log( "Failed to load file for require: " + file_path );
			throw ex;
		}
		var matches = file.match(allRequireRE);
		if(matches){
			var reqs = [];
			for(var i = 0; i < matches.length; ++i){
					var name = matches[i].match(singleRequireRE)[2] + '.js';
					var fp = path.join(dir, name);
					if (!path.exists(fp) && name.charAt(0) != '.') {
						fp = '!' + name;
					}
					reqs.push(fp);
			}
			require_graph[file_path] = reqs;
			requires = reqs.concat(requires);
			var ts = new Async.TaskSet();
			for(i = 0; i < reqs.length; ++i){
				try
				{
					parseRequires(reqs[i], ts.task(function(new_r){
						// console.log("REQUIRES FOR " + reqs[i], JSON.stringify(requires));
						requires = requires.concat(new_r);
					}), require_graph, require_cache);
				}
				catch( ex )
				{
					console.log( "Failed while evaluating " + reqs[ i ] );
					throw( ex );
				}
			}
			ts.join(function(){
				// console.log("REQUIRES FOR " + file_path, JSON.stringify(requires));
				
				require_cache[file_path] = uniq(requires);
				callback(uniq(requires), require_graph);
			});
			return;
		}
	}else{
//		utils.info('true require_graph[file_path]=true' + file_path + " " + JSON.stringify(requires));
	}
	
	callback(requires, require_graph);
}

function getAllRequires(manifest, base_path, callback) {

	if (!base_path) {
		base_path = './';
	}

	var ts = new Async.TaskSet();
	var all_requires = [];
	// Process each input file into output file buffers
	var require_cache = {};
	var doit = function(file_path) {
		var dir = base_path;
		if (file_path.charAt(0) != '.')
			dir = '.';

		// Find requires
		try {
			parseRequires(path.join(dir, file_path), ts.task(function(requires) {
						all_requires = all_requires.concat(requires);
					}), null, require_cache);
		} catch (e) {
			console.log("Error parsing includes in "
					+ path.join(base_path, file_path));
			throw e;
		}
	}
	if (typeof manifest.code != "undefined")
		for ( var i = 0; i < manifest.code.length; ++i)
			doit(manifest.code[i]);
	if (typeof manifest.code_encrypted != "undefined")
		for ( var i = 0; i < manifest.code_encrypted.length; ++i)
			doit(manifest.code_encrypted[i]);

	ts.join(function() {
		callback(uniq(all_requires));
	});
}
 
function getRelativePath(path, base_path) {
	var ret = path
	ret = ret.replace(new RegExp("^./"), "");
	if(base_path) {
		if(base_path[base_path.length-1] != '/') {
			base_path = base_path + "/";
		}
		ret = ret.replace(new RegExp("^" + base_path), "");
	}

	return ret.replace('..', 'dotdot').split("/").join("__");
}

function buildJS(manifest_file, output_path, base_path, options, callback, request){

	if(!options){
		options = {};
	}

	generateLegacy(options, function()
	{	
		//default true
		var COMBINE_MODE = typeof options.combine == 'undefined' || options.combine == 'true';
		//default false
		var COMPRESS_MODE = typeof options.compress != 'undefined' && options.compress == 'true';

	        
		if(!base_path){
			base_path = './';
		}
		utils.info("combiner : " + base_path + " COMBINE_MODE=" + COMBINE_MODE + " COMPRESS_MODE=" + COMPRESS_MODE);		
		var manifest;
		if(typeof manifest_file == 'string'){
			manifest = JSON.parse(File.readFileSyncSafe(path.join(base_path, manifest_file)));
		}
		else {
			manifest = manifest_file;
		}
	        if (typeof manifest.code == 'undefined')
		    manifest.code = [];
		// sys.print("Generating JS file from:\n");
		// sys.print(JSON.stringify(manifest) + "\n");
	
		var file_header = File.readFileSyncSafe(path.join(__dirname, 'templates/header.js')).toString();
	
		//  Build search and output file tables
		var output_files = {"application": file_header};
	        var output_files_encrypted = {};
	        var encrypt_application_js = false;
		var searches = [];
		if(COMBINE_MODE && manifest.libraries){
			for(var lib in manifest.libraries){
				output_files[lib] = file_header;
				var lib_paths = manifest.libraries[lib];
				for(var i in lib_paths){
					searches.push([lib_paths[i], lib]);
				}
			}
		}
	
		// Process each input file into output file buffers
		getAllRequires(manifest, base_path, function(requires){
			// Add all requires to output buffers
			for(var i in requires){
				var require_path = requires[i];
				var content = modulify(require_path);
				if(COMBINE_MODE){
					// Regular processing.  Combine files into libraries
					content = normalizeRequirePaths(require_path, content);
					var in_library = false;
					for(var s in searches){
						if(require_path.match(new RegExp("^"+searches[s][0]+'.*'))){
							output_files[searches[s][1]] += content;
							in_library = true;
							break;
						}
					}
					if(!in_library){
						output_files.application += content;
					}
				}
				else {
					// Non-combined processing.  Requires each get their own file
					content = normalizeRequirePaths(require_path, content, function(p){return p.replace('..', 'dotdot');});
					var require_path_relative = getRelativePath(require_path, base_path);
					var require_path_relative_without_ext = require_path_relative.replace(/\.js$/, '');
					if(typeof manifest.code_encrypted != "undefined") {
						output_files_encrypted[require_path_relative_without_ext] = file_header + content;
					} else {
						output_files[require_path_relative_without_ext] = file_header + content;
					}
				}
			}
	
			// Add file unmodified from manifest.code to output buffers
			for(i in manifest.code){
				var file_path = manifest.code[i];
				var dir = base_path;
				if (file_path.charAt(0) != '.')
					dir = '.';
	
				content = File.readFileSyncSafe(path.join(dir, file_path)) + "\n";
				content = normalizeRequirePaths(path.join(dir, file_path), content);
				if(COMBINE_MODE){
					output_files.application += content;
				}
				else {
					output_files[getRelativePath(file_path).replace(/\.js$/, '')] = content;
				}
			}

			// Add encrypted code
			/* note: if code_encrypted was not empty and in COMBINE
			 * mode, all code goes into "application.js" which will
			 * then be encrypted
			 */
			var manifest_code_encrypted = typeof manifest.code_encrypted != "undefined" ? manifest.code_encrypted : [];
			for (i in manifest_code_encrypted) {
				var file_path = manifest.code_encrypted[i];
				var dir = base_path;
				if (file_path.charAt(0) != '.')
					dir = '.';
				
				content = File.readFileSyncSafe(path.join(dir, file_path)) + "\n";
				content = normalizeRequirePaths(path.join(dir, file_path), content);

				if (COMBINE_MODE) {
					output_files.application += content;
					encrypt_application_js = true;
				} else {
					output_files_encrypted[getRelativePath(file_path).replace(/\.js$/, '')] = content;
				}
			}
			// console.log("REQUIRE_GRAPH\n", JSON.stringify(require_graph));
			// console.log("REQUIRE_LIST\n", JSON.stringify(requires));
			// process.exit();
			// sys.print("Final JS: \n\n" + final_file + "\n\n");

			var ts = new Async.TaskSet();
			var filesToEncrypt = [];
			var filesToCompress = [];
			// Write output buffers to disk
			var writeContent = function(name, content, do_encrypt) {
				if (utils.isAllBuild(request, options) || utils.isFlash(request, options)) {
					var file = path.join(output_path, name + '.js');
					writeFile(file, content);
					if (COMPRESS_MODE)
						filesToCompress.push(file);
					if (do_encrypt)
						filesToEncrypt.push(file);
				}
				
				if (utils.isAllBuild(request, options) || utils.isAndroid(request, options)) {
					var file = path.join(output_path, 'android', name + '.js');
					writeFile(file, content);
					if (COMPRESS_MODE)
						filesToCompress.push(file);
					if (do_encrypt)
						filesToEncrypt.push(file);
				}

				if (utils.isAllBuild(request, options) || utils.isIOS(request, options)) {
					var file = path.join(output_path, 'ios', name + '.js');
					writeFile(file, content);
					if (COMPRESS_MODE)
						filesToCompress.push(file);
					if (do_encrypt)
						filesToEncrypt.push(file);
					
				}
			};

			for (i in output_files){
				writeContent(i, output_files[i], encrypt_application_js && i == "application");
			}
			for (i in output_files_encrypted){
				writeContent(i, output_files_encrypted[i], true);
			}

			var encryptor = (function () {
				var onComplete = ts.task();
				return function () {
					if (filesToEncrypt.length != 0) {
						var path = filesToEncrypt.pop();
						File.encryptFile(path, arguments.callee);
					} else
						onComplete();
				};
		    })();

			if (filesToCompress.length != 0) {
				compressJS(filesToCompress.join(' '), encryptor);
			} else {
				encryptor();
			}

			if(callback)
				ts.join(callback);

		});
	});
}

function writeFile(p, contents){
	File.mkdirp(path.dirname(p), 0777);
	var file = fs.openSync(p, 'w');
	fs.writeSync(file, contents);
	fs.closeSync(file);
	
	utils.info("combiner : write " + p + " length=" +contents.length);
}

function compressJS(p_in, callback){
 	var path = process.argv[1].split('/');
	while (path.pop() != 'Tools');
 	path.push('Tools', 'yuicompressor-2.4.6-modified', 'build-modified', 'yuicompressor-2.4.6-modified.jar');

	var exec = require("child_process").exec;
    log("compressJs being called ");
	exec('java -jar ' + path.join('/') + ' ' + p_in + ' --charset utf-8',
		function(serror, stdout, stderr) {

            if (stdout) {
                log('compress stdout: ' + stdout);
            }
            if (stderr) {
                log('compress stderr: ' + stderr);
            }

            log(serror ? "COMPRESS ERROR! " + serror : "No error!");
            if (callback)
                callback();
            }
	);
}

exports.combine = buildJS;
exports.getAllRequires = getAllRequires;
exports.getRelativePath = getRelativePath;
exports.generateLegacy = generateLegacy;
