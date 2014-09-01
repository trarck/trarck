var fs = require('fs');
var path = require('path');
var util = require('util');
var File = require('./file');
var Async = require('./async');
var spawn = require("child_process").spawn;
var utils = require('./utils');

var EXTEND_DEBUG_LOG;
var EXTEND_EXCEPTION_INFO;

////////////////////////////////////////////////////////////////////////////////
// Run the legacy.js generation

function generateLegacy( options, callback )
{
	if (options.suppressLegacy) {
		callback();
		return;
	}

	var root = "";
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
	proc.stderr.on('data',function(data) { callback ( "generateLegacy error:\n" + data.toString() ); } );
}

////////////////////////////////////////////////////////////////////////////////

var allRequireRE = /(^|;|\n)[^\/]*[^\.]?require\s*\(\s*(\"|\')([^'"]+)(\'|\")\s*\)/gm;
var singleRequireRE = /require\s*\(\s*(\'|\")([^'"]+)/;

function escapeStringForRegexp(str) {
	var specials = new RegExp("[.*+?|()\\[\\]{}\\\\\\/]", "g"); // .*+?|()[]{}\
	return str.replace(specials, "\\$&");
}

function embedDebugInformation(file_path, content){
	var file_name = file_path.substr(file_path.lastIndexOf('/') + 1);
	if (file_path.indexOf("NGCore/Client") > 0 || file_path.indexOf("NGCore/Shared") > 0) {
		file_name = "(NGCore) " + file_name;
	}
	var contents = content.split("\n");
	var i;
	var converted_content = "";
	for (i = 0; i < contents.length; i++) {
		var line = contents[i];
		if (line.indexOf("NgLogD") > 0) {
			line = line.replace(/NgLogD[ \t]*\(/, 'NgLogD("[' + file_name + ' L' + (i + 1).toString() + '] " + ');
		}
		converted_content += line + "\n";
	}
	return converted_content;
}

function replaceLogException(content){
	var contents = content.split("\n");
	var i;
	var converted_content = "";
	for (i = 0; i < contents.length; i++) {
		var line = contents[i];
		if (line.indexOf("NgLogException") > 0 && line.indexOf("function") == -1 && line.indexOf("sourceDumper") == -1) {
			line = line.replace("NgLogException", "NgLogExceptionExt");
		}
		converted_content += line + "\n";
	}
	return converted_content;
}

function modulify(file_path,require_map){
	if (file_path.charAt(0) == '!') {
		file_path = file_path.substr(1);
	}
	file_path = utils.replacePathToSlash(file_path);

	var file_path_noext = file_path.replace(/\.js$/,'');
	var transformed_path_noext = require_map[file_path_noext];
	
	var f = "$MODULE_FACTORY_REGISTRY['"+ transformed_path_noext +"']";
	var g = "$MODULE_REGISTRY['"+ transformed_path_noext +"']";
	return f + " = function(){var exports = "+g+" || {}; "+g+" = exports;\n"+
		"var __filename = \"" + file_path +"\";\n" + 
		File.readFileSyncSafe(file_path)+"\n; return exports;};\n";
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

			correctPath = utils.replacePathToSlash(correctPath);
			var str = '/require\\s*\\(\\s*(\'|")' + escapeStringForRegexp(originalPath) + '(\'|\")\\s*\\)/';
			content = content.replace(eval(str), "require('" + correctPath + "')");
		}
	}
	
	var allNGJSPathRE = /(^|;|\n)[^\/]*[^\.]?NGJSPath\s*\(\s*(\"|\')([^'"]+)(\'|\")\s*\)/gm;
	matches = content.match(allNGJSPathRE);
	if(matches){
		for(var i = 0; i < matches.length; ++i){
			var singleNGJSPathRE = /NGJSPath\s*\(\s*(\'|\")([^'"]+)/;
			var originalPath = matches[i].match(singleNGJSPathRE)[2];
			var correctPath = originalPath;
			if (originalPath.charAt(0) != '.')
				correctPath = originalPath;
			else
				correctPath = path.join(dir, originalPath);

			if(process_func){
				correctPath = process_func(correctPath);
			}

			var str = '/NGJSPath\\s*\\(\\s*(\'|")' + escapeStringForRegexp(originalPath) + '(\'|\")\\s*\\)/';
			content = content.replace(eval(str), "NGJSPath('" + correctPath + "')");
		}
	}

	if(EXTEND_DEBUG_LOG)
	{
		content = embedDebugInformation(file_path, content);
	}
	if(EXTEND_EXCEPTION_INFO)
	{
		content = replaceLogException(content);
	}

	return content;
}

function toRelativePath(path, base_path) {
	var ret = path;
	ret = ret.replace(new RegExp("^./"), "");
	if(base_path) {
		if(base_path[base_path.length-1] != '/') {
			base_path = base_path + "/";
		}
		ret = ret.replace(new RegExp("^" + base_path), "");
	}
    return ret;
}

function parseRequiresForFile(state, require_tree, basePath, filePath, /*opt passed-in during recurse*/callerPath) {
	if(filePath.indexOf("FeaturedGamesList.js") != -1){
		//throw new Error("Required! "+callerPath);
	}

	var require_cache = state.requiredFiles;

	var dir = path.dirname(filePath);
	var platformAbsolutePath = path.normalize(path.join(basePath, filePath));
	var absolutePath = platformAbsolutePath.replace(/\\/g, '/');
	
	if (! path.existsSync(platformAbsolutePath))
		throw new Error('path does not exist: ' + platformAbsolutePath);

	if (require_cache[absolutePath]) {
		require_tree[absolutePath] = require_cache[absolutePath];
		return;
	}
	if (state.global_cache[absolutePath]){
	// cache busted right now, don't know why.
		require_tree[absolutePath] = require_cache[absolutePath] = state.global_cache[absolutePath];
		return;
	}

	var file;
	try {
		file = File.readFileSyncSafe(platformAbsolutePath) + '';
	}
	catch(ex) {
		util.debug("Failed to load file for require: " + absolutePath);
		throw ex;
	}
	
	state.global_cache[absolutePath] = require_cache[absolutePath] = require_tree[absolutePath] = {};
	
	var matches = file.match(allRequireRE);
	if (matches) {
		for (var i = 0; i < matches.length; ++i) {
			var name = matches[i].match(singleRequireRE)[2] + '.js';
			var platformFp = path.normalize(path.join(basePath, dir, name));
			var fp = platformFp.replace(/\\/g, '/');
			//Recurse!
			try {
				parseRequiresForFile(state, require_tree[absolutePath], path.join(basePath, dir), name, absolutePath);
			} catch(e) {
				console.log("File that required with bad path:",absolutePath);
				throw e;
			}
			
			var subTree = require_tree[absolutePath][fp];
		}
	}
}
function processEntryPoint(phaseName, manifest, entryPoints, processedPhases, phasesInFlight, global_require_cache, basePath) {
    var require_cache = {};
	
    if(!processedPhases[phaseName]){
		phasesInFlight[phaseName] = {
			requiredFiles: require_cache,
			tree: {},
			global_cache: global_require_cache
		};
	}
	
    for (var i = 0; i < entryPoints[phaseName].files.length; i++) {
        var filePath = entryPoints[phaseName].files[i];
        try {
			parseRequiresForFile(phasesInFlight[phaseName], phasesInFlight[phaseName].tree, basePath, filePath);
		} catch(e) {
			console.log("BAD REQUIRE STATEMENT IN FILE:", filePath);
			process.exit(2);
			throw e;
		}
		
		var ourState = phasesInFlight[phaseName];
    }
		
	util.debug("Files Processed:");
    var uniqueFiles = Object.keys(require_cache).sort();
    for (var i = 0; i < uniqueFiles.length; i++) {
		var relPath = toRelativePath(uniqueFiles[i], basePath);
    }
    util.debug("Total:",uniqueFiles.length,"files required");

	processedPhases[phaseName] = phasesInFlight[phaseName];
	delete phasesInFlight[phaseName];
	return uniqueFiles.length;
}

function buildJS(manifest_file, output_path, base_path, options, callback, request){

	if(!options){
		options = {};
	}

	//default false
	EXTEND_DEBUG_LOG = typeof options.extendDebugLog != 'undefined' && options.extendDebugLog == 'true';
	//default false
	EXTEND_EXCEPTION_INFO = typeof options.extendExceptionInfo != 'undefined' && options.extendExceptionInfo == 'true';

	generateLegacy(options, function(err)
	{
		//Ignore error, this happens all the time in SDK builds.  Should probably prevent it but this is how it used to be
		//if (err) {
			//callback(err);
			//return;
		//}

		//default true
		var COMBINE_MODE = typeof options.combine == 'undefined' || options.combine == 'true';
		//default false
		var COMPRESS_MODE = typeof options.compress != 'undefined' && options.compress == 'true';
		//default true
		var CONVERT_MODE = false; //typeof options.suppressUCS2 == 'undefined' || options.suppressUCS2 != 'true';
		
		var RECEIPT = typeof options.receipt != 'undefined' && options.receipt == 'true';
		
		var settings = {COMBINE_MODE:COMBINE_MODE,COMPRESS_MODE:COMPRESS_MODE,CONVERT_MODE:CONVERT_MODE,RECEIPT:RECEIPT};

		if(!base_path){
			base_path = './';
		}
		
		utils.debug("combiner : " + base_path + " COMBINE_MODE=" + COMBINE_MODE + " COMPRESS_MODE=" + COMPRESS_MODE + " CONVERT_MODE=" + CONVERT_MODE);
		
		var manifest;
		if(typeof manifest_file == 'string'){
			manifest = JSON.parse(File.readFileSyncSafe(path.join(base_path, manifest_file)));
		}
		else {
			manifest = manifest_file;
		}
		if (typeof manifest.code == 'undefined') {
		    manifest.code = [];
		}
				
		buildJSWithDependencyTracking(manifest,output_path,base_path,options,callback,request,settings);
	});
}

function buildJSWithDependencyTracking(manifest, output_path, base_path, options, callback, request, settings) {
    /**
     * Require Tree structure
	 * {
	 *      requiredFiles: {
	 *			filename: 1
	 * 		},
	 *      require_weakFiles: {
	 *			filename: 1
	 * 		},
	 * }
	 */
	
	var entryPoint = function(file){
		var files = [];
		if(file){
			files.push(file);
		}
	
		return {
			files:files
		};
	};
	
	// 0. clean up a bit first
	var processed = {};
	var inFlight = {};
	
	var receipt = {
		map:{},
		dependencyTable:[],
		validEntryPoints:[],
		paths:[],
		logs:[],

		log: function () {
			var args = Array.prototype.slice.call(arguments);
			this.logs.push(args.join(" "));
			console.log(this.logs[this.logs.length-1]);
		}
	};
	
	var entryPoints = {boot:entryPoint()};

	if(!manifest.code){
		throw new Error("Illegal manifest.json format: must have a \"code\" section");
	} else if(!manifest.loadable){
		manifest.loadable = [];
	}
	
	// 1.a. the files in manifest.code are inherently part of the boot phase
	var codeFiles = manifest.code.concat(manifest.code_encrypted || []);
	for (var i = 0; i < codeFiles.length; i++) {
		if(entryPoints.boot.files.indexOf(codeFiles[i]) == -1){
			entryPoints.boot.files.push(codeFiles[i]);
		}
	}
	// 1.b. the files in manifest.loadable are other entry_points
	for (var i = 0; i < manifest.loadable.length; i++) {
		entryPoints[manifest.loadable[i]] = entryPoint(manifest.loadable[i]);
	}
	
	var global_require_cache = {};
	var phaseName = "boot";
	try {
    	// 2.a 
    	receipt.log("Verifying EntryPoint:", phaseName);
    	var j = processEntryPoint(phaseName,manifest,entryPoints,processed,inFlight,global_require_cache,base_path);
    	receipt.log("Files:", j);
    	// 2.b.
		for(phaseName in entryPoints) {
			if(phaseName == "boot"){continue;}
			
			receipt.log("Verifying EntryPoint:", phaseName);
			var j = processEntryPoint(phaseName,manifest,entryPoints,processed,inFlight,global_require_cache,base_path);
			receipt.log("Files:", j);
		}
	} catch (e) {
		callback(e);
		if(!e.errors){
			//Rethrow if it's not our custom class to get teh proper error handling.
			throw e;
		}
		console.log(e.message);
		for(var i = 0; i < e.errors.length; i++){
			console.log("\t"+e.errors[i])
		}
		throw new Error("Failed Verifying Entry Point "+phaseName);
	}
	
	// 3. After verifying the entryPoints we will render all of their JS files into the output directory with all appropriate require path manipulation
	
	//  Build search and output file tables
	
	var application_js_info = [];
	var application_js_lines = 0;


    console.log("header:",path.join(__dirname, 'templates/header.js'),File.readFileSyncSafe(path.join(__dirname, 'templates/header.js')));
	var file_header = File.readFileSyncSafe(path.join(__dirname, 'templates/header.js')).toString();
		if(options.extendExceptionInfo){
			application_js_info.push({line:application_js_lines + 1, file:"header"});
			var lines = file_header.split("\n").length;
			if(file_header.charAt(file_header.length - 1) != "\n"){
				lines--;
			}
			application_js_lines += lines;
		}
	var output_files = {
	    "application": file_header
	};
	
	var output_files_encrypted = {};
	var encrypt_application_js = false;
	var searches = [];
	
	if (settings.COMBINE_MODE && manifest.libraries) {
	    for (var lib in manifest.libraries) {
	        output_files[lib] = file_header;
	        var lib_paths = manifest.libraries[lib];
	        for (var i in lib_paths) {
	            searches.push([lib_paths[i], lib]);
	        }
	    }
	}

	var unique_all = {};
	var immediate_requires = {};
	var idGenerator = 0;
	// Collate all required files and caches:
	for(var phaseName in entryPoints){
		for(var file_path in processed[phaseName].requiredFiles){
			unique_all[file_path] = 1;
			
			var file_path_noext = file_path.replace(/\.js$/,'');
			if(!receipt.map[file_path_noext]){
				receipt.map[file_path_noext] = (++idGenerator).toString(36);
			}
			if(!immediate_requires[file_path]){
			    immediate_requires[file_path] = processed[phaseName].requiredFiles[file_path] || {};
			}
		}		
	}
	receipt.paths = Object.keys(unique_all);
	receipt.paths.sort(function(a,b){
		var result = 0;
		try {
			result = (Object.keys(immediate_requires[b])).length - (Object.keys(immediate_requires[a])).length;
			//console.log(a,(Object.keys(immediate_requires[a])).length,b,(Object.keys(immediate_requires[b])).length," sort: ",result);
		} catch (e) {
			console.log("Error Sorting",e);
		}
		return result;
	});
	for(var i = 0; i < receipt.paths.length; i++){
		var file_path = receipt.paths[i];
		var file_path_noext = file_path.replace(/\.js$/,'');
		receipt.paths[i] = receipt.map[file_path_noext];
		try {
			receipt.dependencyTable[i] = Object.keys(immediate_requires[file_path]);
		} catch (e){
			console.log("Failed on: ",file_path);
		}
	}
	
	// Convert the dependency table into indexes into the paths table
	var lookupIndex = function(target){
		if(target.indexOf(".js") != -1){
			target = target.replace(/\.js$/,'');
		}
		if(target[0] == "." && target[1] == '/'){
			target = target.substr(2);
		}
		if(target in receipt.map){
			target = receipt.map[target];
		}
		return receipt.paths.indexOf(target);
	};
	
	var emptyDependencyIndex = receipt.dependencyTable.length;
	for(var i = 0; i < receipt.dependencyTable.length; i++){
		for(var j = 0; j < receipt.dependencyTable[i].length; j++){
			receipt.dependencyTable[i][j] = lookupIndex(receipt.dependencyTable[i][j]);
		}
		
		// Mark the first entry with no dependencies
		if(receipt.dependencyTable[i].length === 0 &&  emptyDependencyIndex == receipt.dependencyTable.length){
			emptyDependencyIndex = i;
		}
	}
	// Truncate the dependencyTable at the first empty index
	receipt.dependencyTable = receipt.dependencyTable.slice(0,emptyDependencyIndex);
	
	var normalizePathByLookupTable = function(path){
		var tmp = path.replace(/\.js$/,'');
		if(tmp[0] == "." && tmp[1] == '/'){
			tmp = tmp.substr(2);
		}
		tmp = tmp.replace(/\\/g, '/');

		if(receipt.map[tmp]){
			return receipt.map[tmp];
		}
		return tmp;
	};
	
	receipt.global_cache = global_require_cache;
	receipt.entryPoints = processed;
	receipt.getOutputPath = normalizePathByLookupTable;

	// Capture our dependencyGraph information!
	prepDependencyGraph(receipt, manifest, output_files, base_path, settings);

	application_js_lines = output_files.application.split('\n').length-1;

	// Load all the files and process their requires
	for(var file_path_noext in receipt.map){
		//Wraps the specific path in our module code
		var require_path = file_path_noext + ".js";
		if(codeFiles.indexOf("./"+toRelativePath(require_path, base_path)) != -1){
			console.log("Skipping Manifest.code file because it shouldn't be modulified:",require_path);
			continue;
		}
		//console.log("require_path:",require_path);
			
		var content = modulify(require_path,receipt.map);
	
		// Scans the content for requires and replaces them with paths that will resolve properly
		content = normalizeRequirePaths(require_path, content, normalizePathByLookupTable);
		
		if(settings.COMBINE_MODE){
			// Combined mode Combine files into libraries
			var in_library = false;
			for(var s in searches){
				if(require_path.match(new RegExp("^"+searches[s][0]+'.*'))){
					output_files[searches[s][1]] += content;
					in_library = true;
					break;
				}
			}
			if(!in_library)
			{
				if(options.extendExceptionInfo){
					var app_js_info = {line:application_js_lines + 1, file:path.join(dir, require_path)};
					console.log('app js info: ' + app_js_info.line + ',' + app_js_info.file);
					application_js_info.push(app_js_info);
					var lines = content.split("\n").length - 1;
					application_js_lines += lines + 1;
				}
				
				output_files.application += content;
				output_files.application += "/* end of file " + require_path + ", line number believed to be " + application_js_lines + "  */\n";
			}
		}
		else {
			// Non-combined processing.  Requires each get their own file
			
			//console.log("require_path:",require_path);
			var require_path_relative_noext = normalizePathByLookupTable(require_path);
			output_files[require_path_relative_noext] = content;
		}
	}
	
	// Add file unmodified from manifest.code to output buffers
	for(var i in codeFiles){
		var file_path = codeFiles[i];
		var dir = base_path;
		if (file_path.charAt(0) != '.'){
			dir = '.';
		}
		console.log("Including Manifest File:",file_path);
		content = File.readFileSyncSafe(path.join(dir, file_path)) + "\n";
		content = normalizeRequirePaths(path.join(dir, file_path), content, normalizePathByLookupTable);
		if(settings.COMBINE_MODE){
			if(options.extendExceptionInfo){
				var app_js_info = {line:application_js_lines + 1, file:path.join(dir, file_path)};
				console.log('app js info: ' + app_js_info.line + ',' + app_js_info.file);
				application_js_info.push(app_js_info);
				var lines = content.split("\n").length - 1;
				application_js_lines += lines;
			}
			output_files.application += content;
				
		}
		else {
			var require_path_relative_noext = normalizePathByLookupTable(path.join(dir, file_path));
			console.log("Manifest output name:",require_path_relative_noext);
			output_files[require_path_relative_noext] = content;
		}
	}
	
	if (options.extendExceptionInfo && settings.COMBINE_MODE)
	{
		content = '\n\n/* information of original source path */\nvar NgCoreOriginalSourceInfo = [\n';
		for (var i = 0; i < application_js_info.length; i++) {
			content += '\t{ line:' + application_js_info[i].line.toString() + ', file:"' + application_js_info[i].file + '" },\n';
		}

		content += '\t{ line:' + application_js_lines.toString() + ', file:"EndOfFile" }\n';
		content += '];\n\n';
		content += 'function NgLogExceptionExt( ex )\n';
		content += '{\n';
		content += '    NgLogException(ex);\n';
		content += '    var str = "\\n(Additional Exception Information by build tool)\\n";\n';
		content += '\n';
		content += '    var line = undefined;\n';
		content += '    var source = undefined;\n';
		content += '    var stack = undefined;\n';
		content += '    for( var prop in ex )\n';
		content += '    {\n';
		content += '        console.log("ex."+ prop+ ": " + ex[prop]);\n';
		content += '        if (prop == "line")\n';
		content += '        {\n';
		content += '            line = Core.Proc.parseInt( ex[prop] );\n';
		content += '        }\n';
		content += '        else if (prop == "sourceURL")\n';
		content += '        {\n';
		content += '            source = ex[prop];\n';
		content += '        }\n';
		content += '        else if (prop == "stack")\n';
		content += '        {\n';
		content += '            stack = ex[prop];\n';
		content += '        }\n';
		content += '    }\n';
		content += '    if (line && source)\n';
		content += '    {\n';
		content += '        /* for iOS */\n';
		content += '        str += ex.toString() + "\\n";\n';
		content += '        for( var i = 0; i < NgCoreOriginalSourceInfo.length - 1; i++ )\n';
		content += '        {\n';
		content += '            var info = NgCoreOriginalSourceInfo[i];\n';
		content += '            var info2 = NgCoreOriginalSourceInfo[i + 1];\n';
		content += '            if (info.line <= line && line <= info2.line)\n';
		content += '            {\n';
		content += '                str += "originalSourceFile: " + info.file + "\\n";\n';
		content += '                str += "originalSourceLine: " + (line - info.line + 1).toString() + "\\n";\n';
		content += '                break;\n';
		content += '            }\n';
		content += '        }\n';
		content += '    }\n';
		content += '    if (!stack)\n';
		content += '    {\n';
		content += '        /* for Flash */\n';
		content += '        stack = ex.stack;\n';
		content += '    }\n';
		content += '    if (stack)\n';
		content += '    {\n';
		content += '        /* for Android and Flash */\n';
		content += '        var stacks = stack.toString().split("\\n");\n';
		content += '        for( var j = 0; j < stacks.length; j++)\n';
		content += '        {\n';
		content += '            var s = stacks[j];\n';
		content += '            var a = s.split(":");\n';
		content += '            if( a.length >= 3)\n';
		content += '            {\n';
		content += '                var l = a[a.length - 2].toString();\n';
		content += '                for( var i = 0; i < NgCoreOriginalSourceInfo.length - 1; i++ )\n';
		content += '                {\n';
		content += '                    var info = NgCoreOriginalSourceInfo[i];\n';
		content += '                    var info2 = NgCoreOriginalSourceInfo[i + 1];\n';
		content += '                    if (info.line <= l && l <= info2.line)\n';
		content += '                    {\n';
		content += '                        s += " [" + info.file + ":" + (l - info.line + 1).toString() + "]";\n';
		content += '                        break;\n';
		content += '                    }\n';
		content += '                }\n';
		content += '            }\n';
		content += '            str += s + "\\n";\n';
		content += '        }\n';
		content += '    }\n';
		content += '\n';
		content += '    if (str.length > 1024) {\n';
		content += '        var log_array = str.split("\\n");\n';
		content += '        for( var k = 0; k < log_array.length; k++ )\n';
		content += '        {\n';
		content += '            NgLogD( log_array[k] );\n';
		content += '        }\n';
		content += '    }\n';
		content += '    else\n';
		content += '    {\n';
		content += '        NgLogD( str );\n';
		content += '    }\n';
		content += '}\n';
		output_files.application += content;
	}
	
	
	console.log("Warning: encryption not supported in dependencyGraph build process");
	
	var pool = new Async.WorkPool(4);
	var capturePathAndCompressJS = function(file_path){
		if (file_path instanceof Array) {
			var quotedPaths = new Array(compress_paths.length);
			for (var i = 0; i < compress_paths.length; i++) {
				quotedPaths[i] = '"' + compress_paths[i] + '"';
			}
			file_path = quotedPaths.join(' ');
		} else {
			file_path = '"' + file_path + '"';
		}
		return function(cb){
			compressJS(file_path,cb);
		}
	}
	
	var compress_paths = [];
	var encrypt_paths = [];
	var writeContent = function(name, content, shouldEncrypt) {
		if(!content){
			console.log("No Content For File",name);
			return;
		}
		var file_path;
		if (utils.isAllBuild(request, options) || utils.isFlash(request, options)) {
			file_path = path.join(output_path, name + '.js');
			writeFile(file_path, content);
			if(settings.COMPRESS_MODE) {
				compress_paths.push(file_path);
			}
			// flash does not support encripted js files.
			//if (shouldEncrypt)
			//	encrypt_paths.push(file_path);
		}

		if (utils.isAllBuild(request, options) || utils.isAndroid(request, options)) {
			file_path = path.join(output_path, 'android', name + '.js');
			writeFile(file_path, content);
			if(settings.COMPRESS_MODE) {
				compress_paths.push(file_path);
			}
			if (shouldEncrypt)
				encrypt_paths.push(file_path);
		}

		if (utils.isAllBuild(request, options) || utils.isIOS(request, options)) {
			file_path = path.join(output_path, 'ios', name + '.js');
			writeFile(file_path, content);
			if(settings.COMPRESS_MODE) {
				compress_paths.push(file_path);
			}
			if (shouldEncrypt)
				encrypt_paths.push(file_path);
		}
	};
	
	var SIMULTANEOUS_FILES_PER_COMPRESS = 60;
	//console.log("output_files:",JSON.stringify(Object.keys(output_files)));
	console.log("Writing JS Files to Disk:");
	receipt.encryptedFiles = [];
	if (manifest.code_encrypted) {
		if (settings.COMBINE_MODE) {
			receipt.encryptedFiles.push("application");
		} else {
			for (var i in manifest.code_encrypted) {
				var name = base_path + '/' + manifest.code_encrypted[i].replace(/^(?:\.\/|)(.*)\.js$/, "$1");
				name = name.replace(/\/\//g, "/");
				name = name.replace(/^\.\//, "");
				var id = receipt.map[name];
				if (typeof output_files[id] !== "undefined") {
					receipt.encryptedFiles.push(id);
				} else {
					throw new Error("internal error: failed to track file that needs to be encrypted (" + name + "," + id + "), files to be output are: "
						+ (function () {
							var a = [];
							for (var i in output_files)
								a.push(i);
							return a.join(',');
						})());
				}
			}
		}
	}
	for(var i in output_files){
		var encrypt = false;
		writeContent(i, output_files[i], receipt.encryptedFiles.indexOf(i) != -1);
		
		if(compress_paths.length && compress_paths.length % SIMULTANEOUS_FILES_PER_COMPRESS === 0) {
			pool.enqueue(capturePathAndCompressJS(compress_paths));
			compress_paths = [];
		}
	}
	// Remaining compress_paths:
	if(compress_paths.length) {
		pool.enqueue(capturePathAndCompressJS(compress_paths));
		compress_paths = [];
	}
	
	pool.join(function(){
		encryptScriptFiles(encrypt_paths, function () {
			console.log("Finished Writing the JS Files!");
			// LAST: Signal to the build system that we are done!
			callback();
		});
	});
}

function prepDependencyGraph(receipt, manifest, output_files, base_path, settings){
	var contentArr = File.readFileSyncSafe(path.join(__dirname, 'templates/dependencyGraph.js')).toString().split("\n");
	
	var index,tmp,i;
	if ((index = contentArr.indexOf("//ValidEntryPointsTemplateReplaceKey"))) {
		//Load the original paths as entry points
		var eps = Object.keys(receipt.entryPoints);
		eps.splice(eps.indexOf("boot"),1);
		
		//Load their transformed paths as entry points
		var stopPoint = eps.length;
		for(i = 0; i < stopPoint; i++){
			//console.log("eps: ",i,eps[i],receipt.getOutputPath(eps[i]));
			if ((tmp = receipt.getOutputPath(eps[i]))) {
				eps.push(tmp+".js");
			}
		}
		contentArr[index] = "\t" + (tmp = JSON.stringify(eps)).substr(1,tmp.length-2).replace(/,/g,",\n\t");
	}
	if ((index = contentArr.indexOf("//DependencyTableTemplateReplaceKey"))) {
		contentArr[index] = "\t" + (tmp = JSON.stringify(receipt.dependencyTable)).substr(1,tmp.length-2).replace(/\],/g,"],\n\t").replace(/\[\[/g,"[\n\t[").replace(/\]\]/g,"]\n]");
	}
	if ((index = contentArr.indexOf("//RequirePathsTemplateReplaceKey"))) {
		contentArr[index] = "\t" + (tmp = JSON.stringify(receipt.paths)).substr(1,tmp.length-2).replace(/,/g,",\n\t");
	}
	if ((index = contentArr.indexOf("//RequirePathMapTemplateReplaceKey"))) {
		contentArr[index] = "\t" + (tmp = JSON.stringify(receipt.map)).substr(1,tmp.length-2).replace(/",/g,"\",\n\t");
		//receipt.log.push("\nFile Map:");
		//receipt.log.push(contentArr[index]);
	}
	if ((index = contentArr.indexOf("//BootSetupTemplateReplaceKey"))) {
		contentArr[index] = "";
		var codes = Array.prototype.concat(manifest.code || [], manifest.code_encrypted || []);
		for(i = 0; i < codes.length; i++){
			tmp = base_path + "/" + codes[i].replace(/^\.\//, "");
			tmp = tmp.replace(/^\.\//, "");
			tmp = receipt.getOutputPath(tmp);
			//console.log("BootSetup Candidate:",tmp,"for",codes[i],receipt.paths.indexOf(tmp));
			contentArr[index] += "\t" + receipt.paths.indexOf(tmp);
			if(i < codes.length - 1) {
				contentArr[index] += ",\n";
			}
		}
		
	}
	
	var content = contentArr.join("\n");
	if(settings.COMBINE_MODE){
		output_files.application = content + output_files.application;
	}
	else {
		output_files["deps"] = content;
	}
	
	if(settings.RECEIPT){
		receipt.logs.unshift("This is only a build receipt. The contents are dynamic, and it's up to you to decide what changes are important.\n"+
			"Hint: you may want to look at the line immediately below \"Verifying EntryPoint: boot\"\n");
		writeFile(path.join(base_path,"receipt.log"),receipt.logs.join("\n"));
	}
	
	_cacheReceipt(receipt,base_path,settings);
}
var receiptCache = {};
function _receiptCacheKey(base_path,settings){
	// Determine all the variables that can manipulate the dependency graph:
	//	- COMBINE_MODE
	//	- base_path
	var p = base_path;
	if(p[p.length - 1] != '/'){
		p = p + '/';
	}
	var cacheKey = JSON.stringify([p,settings.COMBINE_MODE]);
	return cacheKey;
}
function _cacheReceipt(receipt,base_path,settings) {
	receiptCache[_receiptCacheKey(base_path,settings)] = receipt;
}
function getDependencyGraphForSettings(base_path,settings){
	var cacheKey = _receiptCacheKey(base_path,settings);
	
	if(!receiptCache.hasOwnProperty(cacheKey)){
		throw new Error("\n"+JSON.stringify([cacheKey])+"\n"+JSON.stringify(Object.keys(receiptCache)));
		//throw new Error("No Build for Properties:"+JSON.stringify(base_path)+ " "+JSON.stringify(settings));
	}
	return receiptCache[cacheKey];
}

// Utilities:

// added for performance improvement, but none seen, keep for future use
function patchBOM(output_path,files,bom){
    var p;
    util.debug("patchBOM");
    for (i in files) {
        p = path.join(output_path, i + ".js");
        var data = new Buffer(fs.readFileSyncSafe(p));
        var ofile = fs.openSync(p,"w");
        fs.writeSync(ofile, bom,0,bom.length,0);
        fs.writeSync(ofile, data,0,data.length,bom.length);
        fs.closeSync(ofile);
    }
}

function writeFile(p, contents){
	File.mkdirp(path.dirname(p), 0777);
	//Read only files may exist if you're using both bake tools.
	if (path.existsSync(p)) {
		fs.chmodSync(p, 0777);
	}
	var file = fs.openSync(p, 'w');
	fs.writeSync(file, contents);
	fs.closeSync(file);

	//utils.info("combiner : write " + p + " length=" +contents.length);
}

function compressJS(p_in, callback){
 	var path = process.argv[1].split(File.separator);
	while (path.pop() != 'Tools');
 	path.push('Tools', 'yuicompressor-2.4.6-modified', 'build-modified', 'yuicompressor-2.4.6-modified.jar');

	var exec = require("child_process").exec;
	util.debug("compressJS being called "+p_in);
	exec('java -jar "' + path.join('/') + '" ' + p_in + ' --charset utf-8',
		function(serror, stdout, stderr) {

            if (stdout && stderr) {
                util.debug('compress stdout: ' + stdout);
            }
            if (stderr) {
                util.debug('compress stderr: ' + stderr);
            }

            if(serror){
            	var msg = "COMPRESS ERROR! " + serror + " \nFor Files\n\t"+ p_in+" ";
            	util.debug(msg);
            	throw new Error(msg);//Give up the build?
            }
            if (callback)
                callback();
            }
	);
}

function convertJSEncoding(p_in, callback) {
	var code = "\uFEFF" + fs.readFileSyncSafe(p_in, 'utf8');
	fs.writeFileSync(p_in, code, 'ucs2');
	if(callback)
		callback();
}

function encryptScriptFiles(files, callback) {
	(function () {
		if (files.length == 0) {
			callback();
			return;
		}
		File.encryptFile(files.shift(), File.ENCRYPTION_XOR55_NOHEADER(), arguments.callee);
	})();
}

exports.combine = buildJS;
exports.generateLegacy = generateLegacy;
exports.toRelativePath = toRelativePath;
exports.getDependencyGraphForSettings = getDependencyGraphForSettings;
