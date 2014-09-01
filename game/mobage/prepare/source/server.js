var http    = require("http");
var url     = require("url");
var path    = require("path");
var fs      = require("fs");
var net     = require('net');
var assert  = require("assert");
var exec = require("child_process").exec;
var log = require('util').debug;

var jasmine = require('./lib/jasmine');

var Manifest = require('./manifest');
var Combiner = require('./combiner');
var File = require('./file');
var Async = require('./async');
var Assets = require('./assets');
var JSLChk = require('./jslchk');

var DeviceModule = require('./DeviceManager').DeviceModule;
var TestModule = require('./DeviceManager').TestModule;
var fileLogging = require('./FileLogger').fileLogger;
var clientLogger = require('./ClientCom').clientCom;

var utils = require('./utils');

// flag to enable jasmine unit testing
var DEBUG = false;
var gServerPort = 8002;
var gLogRoot = './Logs';

// Possible test locations (this will disappear next test server release)
var AUTO_SOCIAL_TEST_LOC = 'Tests/Social/AutomatedTests/Tests';
var AUTO_SDK_SOCIAL_TEST_LOC = 'submodules/narwhal/Tests/AutomatedTests/Tests';
var END_GAME_LOCATION = 'Tests/AutomatedTests/EndGame';

////////////////////////////////////////////////////////////////////////////////

// if the url doesn't include some elements, set some reasonable defaults so
// we don't have too much conditional code.

url.parseAndFix = function( path )
{
	var pUrl = url.parse( path );
	if( pUrl.port == undefined ) { pUrl.port = 80; }
	if( pUrl.pathname == undefined ) { pUrl.pathname = "/"; }
	if( pUrl.search == undefined ) { pUrl.search = ""; }
	return pUrl;
};

var cpr = function(src, dst, cb)
{
	/*cb();
	/*/ utils.info("server : Copying " + src + " to " + dst);
	var sp = spawn('cp', ['-r', src, dst]);
	sp.on('exit',
		function (code)
		{
			if (cb)
				cb();
		}
	);//*/
}	

////////////////////////////////////////////////////////////////////////////////
function copyConfiguration(base_path, output_root, request)
{
//	utils.info("*** copyConfiguration ");
	
	var cName = "configuration.json";


	try
	{
		// KJ this normalization should really happen WAY earlier, (server vs jake build diff)
		base_path = (base_path.charAt(base_path.length - 1) == '/') ? base_path : base_path + '/';

		var data = File.readFileSyncSafe(base_path + cName);
		var value = JSON.parse(data);
		if(utils.isFlash(request) && value && !value.contentUrl){
			base_path = base_path.replace(/\/$/, '');
			value.contentUrl = "http://" + request.headers['host'] +"/" + base_path;
			data = JSON.stringify(value);
			utils.info("server : copyConfiguration "+data);
		}

		var writePath = output_root + "/" + cName;
		fs.writeFileSync(writePath, data);
		utils.info("server : copyConfiguration " + writePath);

		// Make android & iOS data
		var obj;
		aobj = JSON.parse(data);
		iobj = JSON.parse(data);
		if (aobj.contentUrl)
		{
			aobj.contentUrl += "/android";
			iobj.contentUrl += "/ios";
		}
			
		try {
			writePath = output_root +  "/ios/" + cName;
			fs.writeFileSync(writePath, JSON.stringify(iobj));
			utils.info("server : copyConfiguration " + writePath);
		} catch (e){
			// if make jake buildtarget, ignore
			utils.info("server : copyConfiguration can not copy configuration.json " + writePath);
		}
		try {
			writePath = output_root +  "/android/" + cName;
			fs.writeFileSync(writePath, JSON.stringify(aobj));
			utils.info("server : copyConfiguration " + writePath);
		} catch (e){
			// if make jake buildtarget, ignore
			utils.info("server : copyConfiguration can not copy configuration.json " + writePath);
		}
	}
	catch (e)
	{
		utils.info("server : No configuration.json found.");
		
		// clean up other configuration.json files if they existed prior
		fs.unlink(output_root + "/" + cName);
		fs.unlink(output_root + "/android/" + cName);
		fs.unlink(output_root + "/ios/" + cName);
		
//		throw e;
	}
}


exports.copyConfiguration = copyConfiguration;
////////////////////////////////////////////////////////////////////////////////
var requiredNodeVersion = "0.4.7";

function versionNum(version)
{
    var parts = version.split('.');
    var major      = parseInt(parts[0], 10),
        minor      = parseInt(parts[1], 10),
        patchLevel = parseInt(parts[2], 10);

    return major + minor/1000 + patchLevel/1000000;
}

exports.start = function(server_options){
	var manifests = {};

    if(versionNum(process.versions.node) < versionNum(requiredNodeVersion) ) {
		utils.warn("Update your node to v" +
                   requiredNodeVersion + " or higher");
    }

	if( server_options.serverPort )
		gServerPort = parseInt(server_options.serverPort);

	if ( server_options.logRoot )
		gLogRoot = server_options.logRoot;

	var testState = 0;
	var testGame = "werule-game";
	var linkLoc = "dltest";
	var testFunks = [];
	var doPerFile = function(base, list, cb)
	{
		for (i in list)
		{
			var file = base + "/Content/" + list[i];
			cb(file);
		}
	};

	var dlTests =
	{
		"addFiles" : function(dir)
		{
			var sources =
			[
				"villagerfemale_sprite_sheet_1.png",
				"villagerfemale_sprite_sheet_2.png",
				"villagerfemale_sprite_sheet_3.png",
			];
			var handle = function(file)
			{
				// Copy the file to a different name
				var newname = file + ".addCopy.png";
				var data = File.readFileSyncSafe(file);
				fs.writeFileSync(newname, "Data!!!!asdf asd fas dfas df", 'binary');
			}
			doPerFile(dir, sources, handle);
		},
		"removeFiles" : function(dir)
		{
			var sources =
			[
				"schoolboy_sprite_sheet_1.png",
				"schoolboy_sprite_sheet_2.png",
				"schoolboy_sprite_sheet_3.png",
			];
			var handle = function(file)
			{
				// rename files to make it seem like things were removed
				fs.renameSync(file, file + ".renamed.png");
			}
			doPerFile(dir, sources, handle);
		},
		"modifyFiles" : function(dir)
		{
			var sources =
			[
				"wizard_sprite_sheet_1.png",
				"wizard_sprite_sheet_2.png",
				"wizard_sprite_sheet_3.png",
			];
			var handle = function(file)
			{
				// Copy the file to a different name
				fs.writeFileSync(file,
					File.readFileSyncSafe(file) + "modified, and completely unreadable"
				);
			}
			doPerFile(dir, sources, handle);
		}
	};

	var createTestContent = function()
	{
		var run = 0;
		for (eye in dlTests)
		{
			for (jay in dlTests)
			{
				for (kay in dlTests)
				{
					var d = "dlt" + run++;

					var retFunction = function(r, i, j, k, dir)
					{
						var ifunk = dlTests[i];
						var jfunk = dlTests[j];
						var kfunk = dlTests[k];
            			return function()
            			{
							kfunk(dir);
							//log("kfunk");

							if (k != i)
							{
								ifunk(dir);
								//log("I funk'dir");
							}

							if ((k != j) && (j != i))
							{
								jfunk(dir);
								//log("jay funk'dir");
							}

							if (r == 10)
							{
								fs.symlinkSync('dlt0', linkLoc);
								log("You may now test downloding!");
							}
            			}
			        };

					cpr(testGame, d, retFunction(run, eye, jay, kay, d));
				}
			}
		}
	}

/*	if (linkLoc in server_options)
	{
		try
		{
			utils.info("Linking to number " + testState);
			fs.unlinkSync(linkLoc)
			fs.symlinkSync("dlt" + testState, linkLoc);
			utils.info("Linking to number " + testState);
		}
		catch (e)
		{
			// First run, create tests directory
			createTestContent();
		}
	}
*/

	var checkTest = function(url)
	{
		/*if (linkLoc in server_options)
		{
			parts = url.split('/')
			for (i in parts)
			{
				//utils.info("part[i="+i+"] = " + parts[i]);
				if (parts[i] == testGame)
				{
					parts[i] = linkLoc;
					utils.info("Returning folder " + linkLoc + " instead of " + testGame);
				}
				else if ((parts[i] == "webgame.ngmanifest") && (parts[1] == linkLoc))
				{
					try
					{
						fs.unlinkSync(linkLoc)
						fs.symlinkSync("dlt" + testState, linkLoc);
						utils.info("Linking to number " + testState);
					}
					catch (e)
					{
						utils.info("Failure making link!! possibly first run.");
					}
					testState++;
				}
			}
			return parts.join("/");
		}
		else*/
		{
			return url;
		}
	};

	var getManifest = function(base_path){
		if(base_path){
			if (manifests[base_path]) {
//				utils.info("server : getManifest  cache " + base_path);
				return manifests[base_path];
			}
			var p = path.join(base_path, 'manifest.json');
			if(File.exists(p)){
				var value = JSON.parse(File.readFileSyncSafe(p));
				manifests[base_path]= value;
				return value;
			}
		}
		return null;
	};

	
	// This function identifies a URL that contains a command from client
	//  then parses out the command and executes the appropriate action
	function parseLogCmd(request, response, parsedPath)
	{
		var TEST_REQUEST_PATH = '/logme';
		var rxJsonDataArray = [];
		var clientConnection;
		var device;
		
		var deviceId;
		var msgId;
		var message = '';
		var testGroup;
		
		var command = '';
		
		var outputFormat = clientLogger.OutputFormat.Console;
		
		// if it has the right path
		if(parsedPath.pathname == TEST_REQUEST_PATH)
		{
			// and the right vars
			if(parsedPath.query && parsedPath.query.deviceId && parsedPath.query.msgId)
			{
				deviceId = parsedPath.query.deviceId;
				msgId = parseInt(parsedPath.query.msgId);

				utils.info('server : msgId=' + msgId + ' deviceId=' + deviceId);

				if(parsedPath.query.cmd) {
					command = parsedPath.query.cmd;
					utils.info('server : rxd command: ' + command);
				} else { // no command
					command = '';
				}
				// client is not registered with server
				if(!clientConnections.doesExist(deviceId))
				{
					if(command == 'start' && msgId == 0) {
						device = new DeviceModule.Device(deviceId, '',
							"TestGroupResults", gLogRoot);
						deviceManager.addDevice(device);
						clientConnections.add(deviceId, outputFormat, device.getTaskGroup());
						       
						utils.info('server : received id for starting connection: ' 
							+ deviceId);

					}
					else // invalid msgId with device
					{
						// TODO build response to indicate to client it never registered
						utils.info("server : Received a msgId for a device that never connected (" + deviceId + " mid: " + msgId + ")");
						sendResponse(404, {Op:'error'});
						return true;
					}
				}
				else if(command == 'start' && msgId == 0)
				{
					utils.info('server : got a starting connection for an existing id ' + deviceId);
					device = deviceManager.getDevice(deviceId);
					device.getTaskGroup().restart();
					clientConnections.reset(deviceId, device.getTaskGroup());
				} 
				else if(command == 'continue' && msgId == 0) {
					utils.info('server : Restarting existing connection.');
					clientConnections.restart(deviceId);
				}
				
				clientConnection = clientConnections.getConnection(deviceId);
				device = deviceManager.getDevice(deviceId);
			}
			else // invalid log format
			{
				utils.info("server : Improper header for server log packet.");
				sendResponse(400, {Op:'error'});
				return true;
			}
			
			// Get is not used for test communication
			if(request.method == 'GET') {
				sendResponse(400, {Op:'error'});
				return true;
			}
			// POSTs may come in chunks
			else if(request.method == 'POST') {
				request.addListener('data', function(chunk){
					rxJsonDataArray.push(chunk);
				});
			
				// called when last chunk received
				request.addListener('end', function(){
					var jsonData = rxJsonDataArray.join("");

					utils.info('server : finished merging POST #' + msgId + ' from device',
					            deviceId);
					//utils.info('Adding to msg queue: ' + msgId);
					//utils.info('\tdata: ' + jsonData);
					//clientConnection.print();
					clientConnection.addMsg({id: msgId, data: jsonData}, command);
					
					// TODO refactor all of this--I don't want this here
					// this kills messages sent before close but rxd after close
					if(command === 'end') {
						clientConnections.close(deviceId);
					}
					sendPostResponse();
					
				});
				
				//utils.info('rxed POST #' + msgId + ' from device: ' + deviceId);

				function sendPostResponse() {
					
					var delaySend = false;
					// build appropriate response
					switch(command) {
						case 'end':
						case 'continue':
							utils.info('server : Building "continue" response');
						case 'start':
							message = {Op:'ok', id:deviceId};
							break;
						
						case 'device_ready':
							utils.info('server : Building "device_ready" response:');
							var task = device.taskGroup.getNextTest();
							if(task) {
								utils.info('\tSending next task: ' + task);
								message = {Op:'ok', test:task};
							} else { // no more tasks, report

								utils.info('server : Is test done: ' + clientConnection.isTestDone);
								if(!clientConnection.isTestDone) {
									utils.info('server : setting istestdone to true');
									clientConnection.isTestDone = true;
									clientConnection.reporter.createReport();
									if(File.exists(path.join(END_GAME_LOCATION, 'Code', 'Main.js'))) {
										utils.info('\tSending EndGame');
										message = {Op:'ok', test:'/' + END_GAME_LOCATION};
										break;
									}
								}
								
								utils.info('is the next test ready?',
								 clientConnection.isNextTestReady);
								if(clientConnection.isNextTestReady) {
									
									clientConnection.isTestDone = false;
									clientConnection.isNextTestReady = false;
									device.taskGroup.restart();
									
								} else {
									utils.info('\tNo more tasks.');
									message = {Op:'nada'};
								}
							}
							break;
						case 'sdk_social_test_start':
							utils.info('Adding US Social test set');
							device.addToTaskGroup(AUTO_SDK_SOCIAL_TEST_LOC);
							message = {Op:'ok'};
							break;
						case 'social_test_start':
							utils.info('setting tests to social_test_start');
							device.setTaskGroup('Social_Tests', AUTO_SOCIAL_TEST_LOC);
							message = {Op:'ok'};
							break;
						case 'task_finished':
						case 'log_start':
							message = {Op:'ok'};
							break;
						case 'log_end':
							// hold off on sending response if previous messages
							// have yet to be received
							if(clientConnection.isLogFinished()) {
								message = {Op:'ok'};
							} else {
								// if previous message never gets resent, we need to send
								//  the response after a timeout
								if(delaySend === false) {
									setTimeout(function () {
										if(clientConnection.isDelayedResponseSet() === true) {
											utils.info('Did not receive all past messages in 2 minutes --> sending response (' + deviceId + ')');
											clientConnection.flush();
											clientConnection.sendDelayedResponse();
										}
									}, 120000);
									delaySend = true;
									clientConnection.setDelayedResponse(response);
								}
							}
							break;
						default:
							message = '';
					}
				
					if(!delaySend) {
						sendResponse(200, message);
					}

				} // end function sendResponse
			} // end else if POST
			
			function sendResponse(status, message) {
				var jsonMessage = JSON.stringify(message);
				//utils.info('sending response! ' + jsonMessage);
				response.writeHead(status,
					{
						'Content-Length': jsonMessage.length,
						'Content-Type': 'text/plain'
					});
				response.end(jsonMessage);
			}
			
			
			return true;
		} // end if TEST_PATH
		return false;
	}
	

	function createTestRun(request, response, parsedPath) {
		TestModule.testPassName = 'Testpass_' + Date.now();
		TestModule.isTestPassManual = false;
		TestModule.isTestUnfinished = false;
	
	
		if(request.method == 'GET' )
		{
			if(parsedPath.query) {
				if(parsedPath.query.tpname) {
					TestModule.testPassName = parsedPath.query.tpname;
				}

				if(parsedPath.query.testtype 
				 && parsedPath.query.testtype == 'manual') {
					TestModule.isTestPassManual = true;
				}
				
				if(parsedPath.query.isunfinished
				 && parsedPath.query.isunfinished == 'true') {
					TestModule.isTestUnfinished = true;
				}
				utils.info('updating all "isNextTestReady" to true');
				clientConnections.updateAll('isNextTestReady', true);
			}
			
			utils.info('isTestPassManual: ' + TestModule.isTestPassManual);
			utils.info('isTestUnfinished: ' + TestModule.isTestUnfinished);
			
			sendServerResponse(response, 200, 'Test vars updated.', 'text/plain');
		}
		else // invalid log format
		{
			var message = 'Bad test pass request.';
			utils.info(message);
			sendServerResponse(response, 400, message, 'text/plain');
		}

	}

    // Echo posted data into its reponse
	function echoPostData(request, response, parsedPath) {
		if(request.method == 'POST' )
		{
            var body = '';
            request.on('data', function(data) {
                body += data;
            });
            request.on('end', function() {
                console.log('Cached post data: ' + body);
                sendServerResponse(response, 200, body, 'text/plain');
            });
		}
		else
		{
			var message = 'Method must be POST!';
			utils.info(message);
			sendServerResponse(response, 400, message, 'text/plain');
		}
	}

	function runJasmineSpecs() {
		
		// TODO putting everything in the nodejs's global namespace seems wrong
		for(var key in jasmine) {
		    global[key] = jasmine[key];
		}
		
		var isVerbose = true;
		var showColors = true;
		
		jasmine.executeSpecsInFolder(__dirname + '/spec',
		                             function(runner, log){},
		                             isVerbose, showColors);
		
	}


	var server = http.createServer(function(request, response)
	{
		var start = new Date().getTime();
		if (utils.enableDebug()) utils.debug("http start : " + request.url);
	    
		var urlPath = require('url').parse(request.url, true);
		var urlMatch = urlPath.pathname.match(/(^\/[^\/]+)/);
		if(urlMatch) {
			switch(urlMatch[0]) {
				case '/logme':
					parseLogCmd(request, response, urlPath);
					return;
				case '/logs':
					getLogView(request, response, urlPath);
					return;
				case '/test':
					displayTestForm(request, response, urlPath);
					return;
				case '/devices':
					displayDeviceManager(request, response, urlPath);
					return;
				case '/createtestrun':
					createTestRun(request, response, urlPath);
					return;
				case '/echo_post':
					echoPostData(request, response, urlPath);
					return;
			}
		}
		
	    var uri = checkTest(request.url);
		// utils.info('URI:  ' + uri);
	    if(uri == '/favicon.ico')
	    {
	    	returnFile(uri,response);
	    	return;
	    }
	    
	    if(uri == '/')
	    {
			exec('find . -type f -name \'manifest.json\' |sed \'s#\(.*\)/.*#\1#\'', function(serror, stdout, stderr)
			{
				var folders = stdout.split('\n');
				var contents = '';
				utils.info(folders.length);
				for( var i = 0; i < folders.length ; i++)
				{
					contents += '<a href="'+ folders[i].replace('./','').replace('manifest.json','') +'">' + folders[i].replace('./','').replace('manifest.json','') + '</a> <br/>'
				}
				contents = '<html><body>' + contents + '</body></html>';
				fs.writeFileSync('index.html', contents, 'binary');
				returnFile(uri+'index.html',response);
			});
			return;
	    }
		var base = Manifest.getBasePath(uri);
		// utils.info('BASE: ' + uri);
		var manifest = getManifest(base);
		// Rewrite URI to include 'build'
		if(manifest){
			parts = uri.split('/')
			parts.splice(base.split('/').length + (uri.slice(-1) == '/' ? 0 : 1), 0, 'build');
			uri = parts.join('/');
		}
		// Rewrite URI to remove other parameters
        var idx = uri.indexOf('?');
		if(idx != -1) {
			uri = uri.substr(0,idx);
        }
        
	    var filename = path.join(process.cwd(), uri);
	    var directory = path.join(process.cwd(), base, 'build');
		var androidDir = path.join(directory, 'android');
		var iosDir = path.join(directory, 'ios');
	    try {
			if (!File.exists(directory)) {
				fs.mkdirSync(directory, 0777);
				utils.info("making dir " + directory);
			}
			if (!File.exists(androidDir)) {
				fs.mkdirSync(androidDir, 0777);
				utils.info("making dir " + androidDir);
			}
			if (!File.exists(iosDir)) {
				fs.mkdirSync(iosDir, 0777);
				utils.info("making dir " + iosDir);
			}
	    } catch(e) {}

		try{
			var stats = fs.statSync(filename);

			if( stats.isDirectory() )
			{
				if(uri[uri.length-1] == '/')
				{
					uri = path.join(uri, 'index.html');
					filename = path.join(filename, 'index.html');
				}
				else
				{
					// Redirect client to include trailing '/' so that relative paths resolve correctly.
					response.writeHead(301, {'Location': 'http://' + request.headers.host + uri + '/'});
					response.end();
					return;
				}
			}
		}
		catch(e){} // file doesn't exist


		// Just an ordinary static asset request.
		try
		{
			assert.equal(request.method, 'GET');

			var idx = filename.indexOf('?');
			var ts;
			if(idx != -1)
				filename = filename.substr(0,idx);

			if(manifest && uri.match(/webgame\.ngmanifest$/)){
// 				JSLChk.checkfiles(server_options, function(allJSLintSuccess){
// 					if (!allJSLintSuccess) {
// 						console.log("ERROR: One or more JSLint check failed.\n");
// 						process.exit(1);
// 					}

				manifestQueue.enqueue(function (done) {
					Assets.process_assets(manifest, path.join(process.cwd(), base, 'build'), base, server_options, function(){
						// for Flash
						if (utils.isFlash(request) && !utils.isCurl(request)) {
								utils.debug("webgame.ngmanifes for flash");
								Manifest.create_index(manifest, path.join(process.cwd(), base, 'build'), base, server_options, function(){
									Manifest.create_manifest(manifest, path.join(process.cwd(), base, 'build'), "", base, server_options, function(){
										Manifest.genSecondaryManifests(path.join(process.cwd(), base, 'build'), base, server_options, function(){
											returnFile(uri, response, done);
										},request);
									},request);
								},request);
						}else{
							Combiner.combine(manifest, path.join(process.cwd(), base, 'build'), base, server_options, function(){
								Manifest.create_index(manifest, path.join(process.cwd(), base, 'build'), base, server_options, function(){
									Manifest.create_manifest(manifest, path.join(process.cwd(), base, 'build'), "", base, server_options, function(){
										Manifest.genSecondaryManifests(path.join(process.cwd(), base, 'build'), base, server_options, function(){
											returnFile(uri, response, done);
										},request);
									},request);
								},request);
							},request);
						}
					},request);
				});
			}
			else if(manifest && uri.match(/index\.html$/)){
				manifests = {}; // cache clear

				if (utils.isFlash(request) && request.url === "/" + base + "/index.html") {
					return; // for Flash Bug
				}
				if (utils.isIOS(request) && request.url.indexOf("/" + base + "/ios/index.html") != -1) {
						returnFile(path.join(base, 'build/ios/index.html'), response);
					return; 
				}
				manifestQueue.enqueue(function (done) {
					utils.info("");
					utils.info("server : creating index");

					Combiner.combine(manifest, path.join(process.cwd(), base, 'build'), base, server_options, function(){
						Manifest.create_index(manifest, path.join(process.cwd(), base, 'build'), base,
						  server_options, function () {
							returnFile(path.join(base, 'build/index.html'), response, done);
						});
					},request);
				});
			}
			else if(uri.match(/configuration\.json$/))
			{
				manifests = {}; // cache clear
				var fileBase = path.join(process.cwd(), base, 'build');
				copyConfiguration(base, fileBase, request);

				var file = 'build/configuration.json';
				if(uri.match(/android\/configuration\.json$/))
					file = 'build/android/configuration.json';
				if(uri.match(/ios\/configuration\.json$/))
					file = 'build/ios/configuration.json';
				returnFile(path.join(base, file), response);
			}
			else {
				//utils.info("Returning file " + uri + "\n");
				returnFile(uri, response);
			}
		}
		catch(e)
		{
			utils.info('Exception:');
			for(var i in e)
				utils.info(i + ': ' + e[i]);

			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write("Unknown request type" + "\n");
			response.end();
		}
		
		var end = new Date().getTime();
		var diff = end - start;
		utils.info("server : request done " + request.url + "  >>> " + diff / 1000 + " sec");

	});

	function returnFile(uri, response, done){
		uri = decodeURI(uri);
		var filename = path.join(process.cwd(), uri);
		path.exists(filename, function(exists)
		{
			// couldn't find file... 404!
			if(!exists)
			{
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
				utils.warn('server : Not found ' + filename + '\n');
				if(done) {done();}
			}
			else
			{
				try {
					var file = File.readFileSyncSafe(filename, "binary");
//					utils.info(" Returning file " + uri + "\n");
					if(filename.search("crossdomain.xml") < 0)
					{

						var headers = {};

						// Set proper content type if the tail of the file is .html.						
						if ( filename.match ( /\.html$/ ) ) headers[ "Content-Type" ] = "text/html";

						response.writeHead(200, headers);  
						response.write(file, "binary");  
						response.end();
						if(done) {done();}
					}
					else
					{
						response.writeHead(200, {"Content-Type" : "text/plain"});  
						response.write(file);  
						response.end();
						if(done) {done();}
					}
				} catch(e) {
					console.log ( "error reading existing file " + filename );
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(e.toString() + "\n");
					response.end();
					if(done) {done();}
				} 
			}
		});
	}

	
	// initialize device and test lists, along with client connections
	var clientConnections = new clientLogger.Connections(gLogRoot);
	var deviceManager = new DeviceModule.DeviceManager();

	var manifestQueue = new Async.WorkPool(1, 'manifestQueue');

	server.listen(gServerPort);

	server.addListener('connection',function(stream)
		{
			utils.debug( "*** new connection ***" );
			stream.addListener ( 'close', function (haderror)
				{
					utils.debug( "*** stream close event *** ( with error = " + haderror + " )" );
				}
			);
		}
	);

	server.addListener('close',function(errno)
		{
			utils.debug( "*** server close event = " + errno + " ***" );
		}
	);

	utils.info("Server running at http://localhost:" + gServerPort + "/" );
	
	if(!server_options.suppressLegacy)
		utils.info('Will regenerate legacy.js');
	if(server_options.generateArchives)
		utils.info('Will generate archives');
	
	// Create Flash socket policy file server if running as root.
	exec('id -G | sed -E "s/ .*//g"', function(serror, stdout, stderr)
	{
		var uid = parseInt(stdout);
		if(uid != 0) return;
		
		utils.info('Starting flash socket policy server');
		net.createServer(function(socket)
		{
			utils.info('Serving flash socket policy request');
			socket.write('\
<?xml version="1.0"?>\n\
<!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">\n\
<cross-domain-policy>\n\
<allow-access-from domain="*" to-ports="*" />\n\
</cross-domain-policy>\n');
			socket.end();
		}).listen(843);
	});

	// debug connections
	//setInterval(function () {clientConnections.print();}, 10000);
	
	if(DEBUG)
	{
		// export for test
		global.clientLogger = clientLogger;
		runJasmineSpecs();
		
	}
};

function getLogView(request, response, path) {
	
	var myPath  = path.pathname;
		
	if(myPath.charAt(0) == '/') {
		myPath = myPath.slice(1);
	}
	
	var length = myPath.length;
	if(length > 1 && myPath.charAt(length - 1) == '/') {
		myPath = myPath.slice(0, myPath.length - 1);
	}

	fs.stat(myPath, function (err, statObj) {
		if(err) {
			sendServerResponse(response, 404, 'File not found: '
			 + myPath, 'text/plain');
			return;
		}
		
		//utils.info('in stat callback...')
		
		if(statObj.isDirectory()) {
			//utils.info('is dir');
			loadDir(myPath, function (html) {
				sendServerResponse(response, 200, html, 'text/html');
			}); 
		} else if(statObj.isFile()) {
			//utils.info('is file');
			loadFile(myPath, function (data) {
				sendServerResponse(response, 200, data, 'text/plain');
			});
		} else  {// can't handle
			//utils.info('can\'t handle');
			sendServerResponse(response, 404, 'File not found.', 'text/plain');
		}
	});
	
}

function sendServerResponse(response, status, data, type) {
	utils.info('Sending Server Response:', status);
	response.writeHead(status, 
		{
			'Content-Length': data.length,
			'Content-Type': type
		});
	response.end(data);
}

function generateWebFileView(path, files, callback) {

	var fileCount = files.length;
	var fileResults = [];
	var fileInfo = [];
	var filesToRead = 0;


	if(fileCount == 0) {
		callback(createHtml(path, fileInfo));
	} else {

		// read each file for the test stats
		files.forEach(function (file, index) {
			fs.stat(path + '/' + file, function (err, statObj){
				if(err) {
					throw err;
				}
			
				fileCount--;
				fileInfo.push({name:file, isFile: statObj.isFile(), ctime:statObj.ctime});
				if(statObj.isFile()) {
					filesToRead++;
				}
			
				// finished collecting stats, now read files
				if(fileCount == 0) {
					
					// put newest results at top of file view
					fileInfo.sort(function (a,b) {
						if(a.ctime > b.ctime) return -1;
						if(a.ctime == b.ctime) return 0;
						if(a.ctime < b.ctime) return 1;
					});
						
					if(filesToRead == 0) {
						callback(createHtml(path, fileInfo));
					} else {
						fileInfo.forEach(function (file, index) {
							if(file.isFile) {
								fs.readFile(File.safePath(path) + '/' + file.name, 'utf8', function (err, fileData) {
									fileResults[index] = getResultsFromFile(fileData);
									filesToRead--;
					
									if(filesToRead == 0) {
										callback(createHtml(path, fileInfo, fileResults));
									}
								});
							}
						});
					}
				}
			
			});
		});
	}
}

function getResultsFromFile(fileData) {
	
	var result = {text:'', pass:0, fail:0, total:0};
	
	if(!fileData) {
		return {text:'No file data', pass:0, fail:0, total:0};
	}
	
	var resultArray = fileData.match(/[^\d]+(\d+)\spassed,\s(\d+)\sfailed[^\d]+(\d+)\stotal/);
	if(resultArray) {
		result.pass = parseInt(resultArray[1]);
		result.fail = parseInt(resultArray[2]);
		result.total = parseInt(resultArray[3]);
		
		if(result.pass + result.fail != result.total) {
			result.text = 'Investigate.';
		} else if(result.fail == 0) {
			result.text = 'Passed.';
		} else {
			result.text = 'Failed.';
		}
		
	} else {
		result.text = 'No result data found.';
	}
	return result;
}

function createBox(name, args) {
	var html = '#' + name + ' {\n\t';
	
	for(var element in args) {
		html += element + ':' + args[element] + ';\n';
	}
	
	html += '}\n'
	return html;
}

function createHtml(path, files, fileStats) {
	var html = '<html>\n';
	var colors = {'Passed.':'#99ff99', 'Failed.':'#ff99AA', 'Investigate.':'#99ffff'};

/*	html += '<head><style type="text/css"><!--';
	html += createBox('col1', {background:'#080', float:'left', width:'200px', padding:'10px'});
	html += createBox('col2', {background:'#080', float:'left', width:'200px', padding:'10px'});	
	html += '--></style><head>';
	
	html +=
*/	
	
	html += '<body>\n<h2>Directory path: ' + path + '</h2>\n';
	
	if(files.length > 0) {
		html += '<table border="1" cellspacing="0" cellpadding="5">';
		var bgcolor;
		var name;
		for(var i = 0; i < files.length; i++) {
			if(fileStats && fileStats[i] !== undefined) {
				name = fileStats[i].text + ' #passed: ' + fileStats[i].pass;
				name += ' #failed: ' + fileStats[i].fail + ' #total: ' + fileStats[i].total;
				bgcolor = colors[fileStats[i].text] ? colors[fileStats[i].text] : '#FFFFFF';
			} else {
				name = 'directory';
				bgcolor = '#FFFFFF';
			}
			
			html += '<tr><td>';
			html += '<a href=' + '/' + path + '/' + files[i].name + '>' + files[i].name + '</a>';
			html += '</td>\n';		
			html += '<td bgcolor="' + bgcolor + '">' + name + '</td>\n';
			html += '<td> ' + files[i].ctime + '</td></tr>\n';
		}
		html += '</table>';
	}	
	else {
		html += '<p>No files in this directory.</p>';
	}
	
	html += '</body></html>\n';
	return html;
}

function loadDir(path, callback) {
	fs.readdir(path, function (err, files) {
		if (err) {
			throw err;
		}
		generateWebFileView(path, files, callback);
	});
}

function loadFile(path, callback) {
	fs.readFile(File.safePath(path), 'utf8', function (err, fileData) {
		if(err) {
			utils.info('Server error!');
			utils.info(err);
			sendServerResponse(response, 404, 'Doh, unable to read index.html',
			 'text/plain');
		}
		else {
			callback(fileData);
		}	
	});	
}

var WEB_INTERFACE = 'Tools/prepare/web_interface';

function displayTestForm(request, response, urlPath) {
	loadFile(WEB_INTERFACE + '/index.html', function (fileData) {
		sendServerResponse(response, 200, fileData, 'text/html');
	});
}

