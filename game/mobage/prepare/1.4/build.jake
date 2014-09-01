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
		var inPath = Manifest.getBasePath('./');
		var outPath = File.join(inPath, 'build');
		require('./server').copyConfiguration(inPath, outPath);
		complete();
	}, true);

	task('process_assets', ['build:output_dir'], function(){
		var arglist = Array.prototype.slice.apply(arguments);
		var options = {};
		var base = Manifest.getBasePath('./');
		if(arglist && arglist.length){
			options = arglist.pop();
		}
		if(File.exists('./manifest.json')){
			Assets.process_assets('manifest.json', File.join(base, 'build'), base, options, function(){
				complete();
			});
		}
		else {
			console.log("ERROR: Manifest file does not exist in this path.\n");
			process.exit(1);
		}
	}, true);
	task('create_manifest', ['build:output_dir'], function(){
		var arglist = Array.prototype.slice.apply(arguments);
		var options = {};
		if(arglist && arglist.length){
			options = arglist.pop();
		}

		if(File.exists('./manifest.json')){
			var ts = new Async.TaskSet();
			Manifest.create_index('manifest.json', 'build', './', options, ts.task());
			Manifest.create_manifest('manifest.json', 'build', "", './', options, ts.task());
			Manifest.genSecondaryManifests('build', "./", options, null, ts );
			ts.join(function(){
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
task('build', ['legacy', 'build:output_dir', 'build:process_assets', 'build:jslcheck', 'build:compile_js', 'build:create_manifest', 'build:configuration'], function(){
	console.log("Running task 'build'\n");
});

desc("Start an app server");
task('server', [], function(){

	var options = Array.prototype.slice.apply(arguments)[0];
	if (!options)
		options = {};
	
/*

	var arglist = Array.prototype.slice.apply(arguments);
	var options = {};
	if(arglist && arglist.length) {
		options["serverPort"] = arglist.pop();
	}
	while (arglist && arglist.length > 0) {
		var option = arglist.pop();
		var value = "true";

		if (option.split('=').length > 1)
			value = option.split('=').pop();

		options[option] = value;
	}
//*/
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
		complete();
	});
}, true);

