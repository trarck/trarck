/*
 * 2010-10 - gerald@ngmoco:
 *
 * Notes on jslint mode:
 *
 * 1. by default, certain default js files are checked with jslint, look at
 *    jslchk.js for list of files checked
 *
 * 2. add jslint=true option to check all files in current directory, eg:
 *       jake build jslint=true
 *
 * 3. add jslint=<files separated by commas> to check only specified files, eg:
 *       jake build jslint=a.js,b.js,c.js
 *
 * 4. use jslintWarningsOK option to allow build to continue when there are
 *    warnings, eg:
 *       jake build jslintWarningsOK=true
 *
 * 5. above options apply to the 'server' target too.  For example, if server
 *    target is run as following example, server will continue to serve files
 *    when there are jslint warnings, but server will stop running when there
 *    are jslint errors:
 *       jake server jslintWarningsOK=true
 */

var Combiner = require('./combiner');
var Manifest = require('./manifest');
var Server = require('./server');
var File = require('./file');
var Async = require('./async');
var Assets = require('./assets');
var JSLChk = require('./jslchk');
var spawn = require("child_process").spawn;
var log = require('util').debug;

var fs = require('fs');

namespace('build', function(){
	task('output_dir', [], function(){
		console.log("Running task 'output_dir'\n");
		File.mkdirp('build', 0777);
	});
	task('jslcheck', [], function(){
		console.log("Running task 'jslcheck'\n");
		var arglist = Array.prototype.slice.apply(arguments);
		var options = {};
		if(arglist && arglist.length){
			options = arglist.pop();
		}
		JSLChk.checkfiles(options, function(allJSLintSuccess){
			if (!allJSLintSuccess) {
				console.log("ERROR: One or more JSLint check failed.\n");
				process.exit(1);
			}
            console.log("End task 'jslcheck'");
			complete();
		});
	}, true);

	//
	// Note that compile_js is an asynchronous jake task, complete()
	// is called when it is truly finished
	//
	task('compile_js', ['build:output_dir', 'build:jslcheck'], function(){
		console.log("Running task 'compile_js'\n");
		var arglist = Array.prototype.slice.apply(arguments);
		var options = {};
		if(arglist && arglist.length){
			options = arglist.pop();
		}

		if(File.exists('./manifest.json')){
			Combiner.combine('manifest.json', 'build', './', options, function(){
                console.log("End task 'compile_js'");
				complete();
			});
		}
		else {
			console.log("ERROR: Manifest file does not exist in this path.\n");
			process.exit(1);
		}

	}, true);

	task('configuration', ['build:output_dir'], function()
	{
        console.log("Running task 'configuration'");
		var inPath = Manifest.getBasePath('./');
		var outPath = File.join(inPath, 'build');
		require('./server').copyConfiguration(inPath, outPath);
        console.log("End task 'configuration'");
		complete();
	}, true);

	task('process_assets', ['build:output_dir'], function(){
        console.log("Running task 'process_assets'\n");
		var arglist = Array.prototype.slice.apply(arguments);
		var options = {};
		var base = Manifest.getBasePath('./');
		if(arglist && arglist.length){
			options = arglist.pop();
		}
		if(File.exists('./manifest.json')){
			Assets.process_assets('manifest.json', File.join(base, 'build'), base, options, function(){
                console.log("End task 'process_assets'");
				complete();
			});
		}
		else {
			console.log("ERROR: Manifest file does not exist in this path.\n");
			process.exit(1);
		}
	}, true);
	task('create_manifest', ['build:output_dir'], function(){
        console.log("Running task 'create_manifest'");
		var arglist = Array.prototype.slice.apply(arguments);
		var options = {};
		if(arglist && arglist.length){
			options = arglist.pop();
		}
		if(File.exists('./manifest.json')){
			var ts = new Async.TaskSet();
			
			Manifest.create_index('manifest.json','build', './', options, ts.task(function(){console.log("Done creating index.html");}));
			Manifest.create_manifest('manifest.json', 'build', "", './', options, ts.task(function(){console.log("Done creating manifest");}));
			Manifest.genSecondaryManifests('build', "./", options, null, ts );
			ts.join(function(){
				console.log("Done generatingSecondaryManifests");
                console.log("End task 'create_manifest'");
				complete();
			});
		}
		else {
			console.log("ERROR: Manifest file does not exist in this path.\n");
			process.exit(1);
		}
	}, true);
});

desc("Build the project");
task('build', ['legacy', 'build:process_assets', 'build:compile_js', 'build:create_manifest', 'build:configuration'], function(){
	console.log("Running task 'build'\n");
});

desc("Start an app server");
task('server', [], function(){
    var args = Array.prototype.slice.apply(arguments);

	var options = args[args.length - 1]; // the last is the option map
	if (!options)
		options = {};
    if(options.port) {
        options.serverPort = options.port; // remap
        delete options.port;
    }

	console.log("\n\nRunning task 'server' with options:");
	for (var key in options) {
		console.log("    " + key + " = " + options[key]);
	}
	console.log("\n");

	File.safe = true;
	
	// Options come in from Jake as strings.  Need a bool here.
	if( options[ 'safe' ] != undefined )
	{
		File.safe = Boolean( JSON.parse ( options[ 'safe' ] || false ) );
		console.log ( "Server safe mode = " + File.safe );
	}

	Server.start(options);
	complete();
}, true);

desc("Build the project");
task('default', ['build'], function(){
	console.log("Running task 'default'\n");
	complete();
}, true);

desc("Generate legacy files");
task('legacy', [], function()
{
	console.log("Generating Legacy Files");

	var proc = spawn('make', ['-C', './NGCore/Legacy']);
	proc.on('exit', function()
	{
        console.log("End task 'legacy'");
		complete();
	});
}, true);

desc("Start an app server");
task('new-server', [], function() { // TODO: change the task name to 'server' after full implementation done.
	var args = Array.prototype.slice.apply(arguments);
	var options = args[args.length - 1]; // the last is the option map
	if (!options) {
		options = {};
	}
	options.serverSafeFile = "true";
	if (options.port) {
		options.serverPort = options.port; // remap
		delete options.port;
	}
	if (options.safe) {
		options.serverSafeFile = options.safe; // remap
		delete options.safe;
	}

	var LocalDevelopmentServer = require('../BakeTool/server/LocalDevelopmentServer').LocalDevelopmentServer;
	LocalDevelopmentServer.getInstance().start(options);
	complete();
}, true);

desc("Bake the project");
task('bake', [], function(){ // TODO: change the task name to 'build' after full implementation done.
	var options = Array.prototype.slice.apply(arguments)[0];
	if (!options) {
		options = {};
	}
	var BakeTool = require('../BakeTool/controller/BakeTool').BakeTool;

	BakeTool.getInstance().bake(options, "./", "command-line-jake", undefined, undefined, function() {
		complete();
	});
}, true);

desc("Test the Bake Tool by Jasmine");
task('test', [], function(){
	var JasmineHelper = require('../BakeTool/helper/JasmineHelper').JasmineHelper;
	var options = Array.prototype.slice.apply(arguments)[0];
	JasmineHelper.getInstance().execute(options, function(failCount) {
		if(failCount > 0) {
			console.log('ERROR: Bake Tool failed its unit test check!');
			process.exit(1);
		}
		complete();
	});
}, true);

desc("Check the Bake Tool source code by JSHint");
task('jshint', [], function(){
	var JSHintHelper = require('../BakeTool/helper/JSHintHelper').JSHintHelper;
	var options = Array.prototype.slice.apply(arguments)[0];
	JSHintHelper.getInstance().execute(options, function() {
		complete();
	});
}, true);

desc("Create the document of Bake Tool");
task('jsdoc', [], function(){
	var JsDocHelper = require('../BakeTool/helper/JsDocHelper').JsDocHelper;
	var options = Array.prototype.slice.apply(arguments)[0];
	JsDocHelper.getInstance().execute(options, function() {
		complete();
	});
}, true);

desc("Print line count of Bake Tool");
task('linecount', [], function(){
	var LineCountHelper = require('../BakeTool/helper/LineCountHelper').LineCountHelper;
	var options = Array.prototype.slice.apply(arguments)[0];
	LineCountHelper.getInstance().execute(options, function() {
		complete();
	});
}, true);

desc("Check Bake Tool");
task('check', [], function(){
	var StateCheckHelper = require('../BakeTool/helper/StateCheckHelper').StateCheckHelper;
	var options = Array.prototype.slice.apply(arguments)[0];
	StateCheckHelper.getInstance().execute(options, function() {
		complete();
	});
}, true);

desc("Print stat of Bake Tool");
task('stat', ['linecount', 'test'], function(){
	complete();
}, true);
