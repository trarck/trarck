var fileLogging = require('./FileLogger').fileLogger;


// shared
var MessageType = {
	Text: 0,
	Log:  1,
	Cmd:  2,
	Dbg:  3
};

var MessageQueue = function () {
	this.messageArray = [];
	this.nextIndexToGet = 0;
	this.baseId = -1;
	this.endId = -1;
}

MessageQueue.prototype.isFinished = function () {
	return (this.endId == -1 ? this.baseId == -1 :
		    this.nextIndexToGet == (this.endId - this.baseId + 1));
};

MessageQueue.prototype.alreadyDequeued = function (id) {
	return (this.baseId + this.nextIndexToGet > id);
};

MessageQueue.prototype.getNextExpectedIndex = function () {
	return this.nextIndexToGet;
};

MessageQueue.prototype.getEndId = function () {
	return this.endId;
};

MessageQueue.prototype.add = function (message) {
	if(this.isFinished() || this.alreadyDequeued(message.id)) {
		return false;
	}
	
	var index = message.id - this.baseId;
	if(this.messageArray[index] === undefined 
	   && (this.endId == -1 || message.id <= this.endId)) {
		this.messageArray[index] = message;
		return true;
	}
	return false;
};

MessageQueue.prototype.start = function (message) {
	if(!this.isFinished()) {
		return false;
	}
	
	this.baseId = message.id;
	this.nextIndexToGet = 0;
	this.endId = -1;
	this.add(message);
	return true;
};

MessageQueue.prototype.end = function (message) {
	if(this.isFinished() || this.alreadyDequeued(message.id)) {
		return false;
	}
	this.endId = message.id
	this.add(message);
	return true;
};


MessageQueue.prototype.getItem = function () {
	
	if(this.isFinished()) {
		this.messageArray = [];
		return undefined;
	} 
	
	var item = this.messageArray[this.nextIndexToGet];
	if(item) {
		delete this.messageArray[this.nextIndexToGet];
		this.nextIndexToGet++;
	}
	return item;
}

// destructive getting
MessageQueue.prototype.getItemAndIncrement = function () {
	
	if(this.isFinished()) {
		this.messageArray = [];
		return "mq_finished";
	} 
	
	return this.messageArray[this.nextIndexToGet++];
}

MessageQueue.prototype.print = function () {
	console.log('** Message Queue **');
	console.log('nextIndexToGet:', this.nextIndexToGet);
	console.log('baseId:', this.baseId);
	console.log('endId:', this.endId);
	console.log('Message Array');
	console.log('\t' + JSON.stringify(this.messageArray));
}

var clientLogger = {};

clientLogger.parseMessageObject = function (clientConnection, message) {
	// jasmine test reporter
	if(JasmineMessages.isValidMessageObject(message))
	{
		return JasmineMessages.doAction[message.jazzOp](clientConnection,
		       message);
	}
	
	return '';
};


clientLogger.DebugLogStore = function () {
	this.messageArray = [];
};

clientLogger.addToDebugLog = function (message) {
	clientLogger.debugLog.getMessageArray().push(message);
};

// added to ConnectionState object
clientLogger.addToFileLog = function (message) {
	if(!this.fileId)
		this.fileId = this.files.createLog(this.testName, this.caps, this.connectionId);
	
	if(this.files.addToLog(this.fileId, message))
	{
		// TODO flush should be called from closeLog, which should call an appropriate close
		// in File
		if(this.files.getLog(this.fileId).readyToClose) {
			this.files.closeLog(this.fileId);
		}
	}
};

clientLogger.DebugLogStore.prototype.clear = function () {
	this.messageArray = [];
};

clientLogger.DebugLogStore.prototype.getMessageArray = function () {
	return this.messageArray;
};

clientLogger.debugLog = new clientLogger.DebugLogStore();

/// Constructor ConnectionState
clientLogger.ConnectionState = function (connectionId, outputFormat, files, reporter) {
	this.setOutputFormat(outputFormat);
	this.connectionId = connectionId || "UnknownID";
	this.messageQueue = new MessageQueue();
	
	
	// file info
	this.fileId = '';
	this.files = files;
	
	// test state
	this.testName = 'MyJazzTest';
	this.isTestDone = false;
	this.isNextTestReady = false;
	
	// client's capabilities -- device should have this.
	this.caps = {};
	
	// saved response for log_end
	this.delayedResponse = undefined;

	this.reporter = reporter;
};

clientLogger.ConnectionState.prototype.restart = function () {
	this.messageQueue = new MessageQueue();
	if(this.fileId) {
		this.files.closeLog(this.fileId);
	}
}

clientLogger.ConnectionState.prototype.setOutputFormat = function (outputFormat) {
	this.outputFormat = outputFormat;
	switch(this.outputFormat)
	{
		case clientLogger.OutputFormat.File:
			this.log = clientLogger.addToFileLog;
			break;
		case clientLogger.OutputFormat.Debug:
			this.log = clientLogger.addToDebugLog;
			break;
		case clientLogger.OutputFormat.Console:
		default:
			this.log = clientLogger.addToConsoleLog;
			this.outputFormat = clientLogger.OutputFormat.Console;
	}
};

clientLogger.addToConsoleLog = function (message) {
	console.log(this.createLogString(message));
};

clientLogger.ConnectionState.prototype.createLogString = function (message) {
	return '[Log](' + this.connectionId + ', ' + message.id + '): ' + message.text;
};

// TODO: change the name of this to parseMsg?
// Add console logging so no need to spam
clientLogger.ConnectionState.prototype.logIt = function (message) {
	//console.log('data rxd:' + message.data);
	
	var parsedMsg = JSON.parse(message.data);
	var logString;
	
	// TODO think about how to parse different types
	if(parsedMsg.type == MessageType.Cmd || parsedMsg.type == MessageType.Log) {
		logString = clientLogger.parseMessageObject(this, 
		                               parsedMsg.data);
	} else if(parsedMsg.type == MessageType.Dbg) {
		logString = parsedMsg.text;
	}
	else // prolly standard string
		logString = parsedMsg.data;

	// only truly log if there's something to log
	if(logString !== '')
	{
		if(parsedMsg.type == MessageType.Cmd || parsedMsg.type == MessageType.Log || parsedMsg.type == MessageType.Dbg) {
			this.log({id: message.id, text: logString});
		}
		else {
			console.log('--> ' + logString);
		}
	}
};

// TODO implement this
clientLogger.ConnectionState.prototype.flush = function () {
	var endId = this.messageQueue.getEndId();
	var item;
	if(endId != -1) {
		while((item = this.messageQueue.getItemAndIncrement()) !== 'mq_finished') {
			if(item) {
				this.logIt(item);
			}
		}
		
	}
};

// TODO all client message handling will happen here 
// TODO strip out message type here, pass only data further on
clientLogger.ConnectionState.prototype.addMsg = function (message, command) {

	switch(command) {
		case 'log_start':
			this.messageQueue.start(message);
			break;
		case 'log_end':
			this.messageQueue.end(message);
			break;
		case 'start':
			break;
		case 'continue':
			break;
		case 'device_ready':
			break;
		case 'task_finished':
			var resultPackage = JSON.parse(message.data).data;
			if(resultPackage.result === 'passed' && 
				resultPackage.data.type === 'caps') {
				this.files.createDeviceCapFile(this.connectionId,
					 resultPackage.data);
			}
			break;
		default:
			this.messageQueue.add(message);
			break;
	}

	// log out any available messages
	var item;
	while(item = this.messageQueue.getItem()) {
		this.logIt(item);
	}
	
	if(this.messageQueue.isFinished()) {
		if(this.delayedResponse !== undefined) {
			console.log('Yo!!!! going to send the delayed response!!!!');
			this.sendDelayedResponse();
		}
	}

};

clientLogger.ConnectionState.prototype.isLogFinished = function () {
	return this.messageQueue.isFinished();
};

clientLogger.ConnectionState.prototype.printMessageQueue = function () {
	this.messageQueue.print();
};

clientLogger.ConnectionState.prototype.sendDelayedResponse = function () {
	var jsonMessage = JSON.stringify({Op:'ok'});
	console.log('sending DELAYED response! ' + jsonMessage);
	this.delayedResponse.writeHead(200,
		{
			'Content-Length': jsonMessage.length,
			'Content-Type': 'text/plain'
		});
	this.delayedResponse.end(jsonMessage);
	this.delayedResponse = undefined;
};

clientLogger.ConnectionState.prototype.isDelayedResponseSet = function () {
	return this.delayedResponse !== undefined;
};

clientLogger.ConnectionState.prototype.setDelayedResponse = function (response) {
	this.delayedResponse = response;
};

clientLogger.ConnectionState.prototype.delete = function () {
	if(this.outputFormat == clientLogger.OutputFormat.File)
		this.files.deleteLog(this.fileId);
};

clientLogger.ConnectionState.prototype.print = function () {
	console.log('Output Format: ' + this.outputFormat);
	console.log('Connection ID: ' + this.connectionId);
	console.log('messageQueue: ' + JSON.stringify(this.messageQueue));
	console.log();
};
	
clientLogger.OutputFormat = {
	Console: 0,
	File: 1,
	Debug: 2
};

// all available client connections
// TODO file stuff shouldn't be here!!!
clientLogger.Connections = function (logRoot) {
	this.connections = {};
	this.files = new fileLogging.Files(logRoot);
};

// Remark: unique id should be client-side as requests from two
// different phones with the same id at the same time can cause
// confusion. 

// TODO: id is not sent back to client, so this will lose the connection
clientLogger.Connections.prototype.add = function (id, format, reporter) {
	if(this.connections[id])
		id = clientLogger.generateUniqueId(id);
	this.connections[id] = new clientLogger.ConnectionState(id, format,
	                                          this.files, reporter);
	// ignored for now
	return id;
};

clientLogger.Connections.prototype.doesExist = function (id) {
	return (this.connections[id] !== undefined);
};

clientLogger.Connections.prototype.delete = function (id) {
	this.connections[id].delete();
	delete this.connections[id];
};

clientLogger.Connections.prototype.restart = function (id) {
	this.connections[id].restart();
};

clientLogger.Connections.prototype.reset = function (id, reporter) {
	this.delete(id);
	this.add(id, 0, reporter);
}

clientLogger.Connections.prototype.close = function (id) {
	this.connections[id].flush();
	this.delete(id);
}

clientLogger.Connections.prototype.updateAll = function (property, value) {
	console.log('[updateAll] called');
	for(var connection in this.connections) {
		console.log('Updating ' + connection);
		console.log('Property', property, 'value', this.connections[connection][property]);
		this.connections[connection][property] = value;
		console.log('Property', property, 'value', this.connections[connection][property]);
	}
}

clientLogger.Connections.prototype.print = function () {
	console.log('*** All Connections ***');
	for(var connection in this.connections) {
		console.log('\t*Connection "' + connection + '"');
		this.connections[connection].print();
	}
	console.log('*** End Connections ***');
}

clientLogger.uniqueId = 0;

clientLogger.generateUniqueId = function (id) {
	return id + '-' + clientLogger.uniqueId++;
};

clientLogger.Connections.prototype.getConnection = function (id) {
	return this.connections[id];
};

exports.clientCom = clientLogger;

// TODO create a class for Actions and extend...
var JasmineMessages = {};

JasmineMessages.Op = {RunnerStarted: 0,
		  RunnerResults: 1,
		  SpecStarted: 2,
		  SpecResults: 3,
		  SuiteResults: 4,
		  Log: 5,
		  SpecData: 6
		  };

JasmineMessages.RunnerStarted = {
			   format: '', 
			   title: '',
			   caps: {},
			   date: ''
			   };
			   
JasmineMessages.RunnerResults = {
			   elapsed: '',
			   date: '',
			   numSpecs: 0,
			   passed: 0,
			   failed: 0,
			   total: 0
			   };
			   
JasmineMessages.SpecStarted = {
			   full_title: '',
			   title: '',
			   date: '',
			   };

JasmineMessages.SpecResults = {
			   full_title: '',
			   title: '',
			   status: '',
			   items: {},
			   date: ''
			   };
			   
JasmineMessages.SuiteResults = {
			   title: '',
			   status: ''
			   };
			   
JasmineMessages.Log = {
			   text: ''
			   };
			   
JasmineMessages.isValidMessageObject = function (message) {
	var messageType;
	
	if(typeof message == 'object' && 'jazzOp' in message)
	{
		switch(message.jazzOp) {
			case JasmineMessages.Op.RunnerStarted:
				messageType = JasmineMessages.RunnerStarted;
				break;
			case JasmineMessages.Op.RunnerResults:
				messageType = JasmineMessages.RunnerResults;
				break;
			case JasmineMessages.Op.SpecStarted:
				messageType = JasmineMessages.SpecStarted;
				break;
			case JasmineMessages.Op.SpecResults:
				messageType = JasmineMessages.SpecResults;
				break;
			case JasmineMessages.Op.SuiteResults:
				messageType = JasmineMessages.SuiteResults;
				break;
			case JasmineMessages.Op.Log:
				messageType = JasmineMessages.Log;
				break;
			case JasmineMessages.Op.SpecData:
				messageType = JasmineMessages.Op.SpecData;
				break;
			default:
				console.log('unknown jazzop');
				return false;
		
		}
		
		for(var prop in messageType) {
			//console.log('Prop ' + prop);
			if(!(prop in message)) {
				console.log('Property ' + prop + ' failed for ' + messageType.toString());
				return false;
			}
		}
		return true;
	}
	
	// console.log('missing jazzOp property: ' + JSON.stringify(message));
	return false;
};

JasmineMessages.doAction = [];
JasmineMessages.doAction[JasmineMessages.Op.RunnerStarted] = 
	function (clientConnection, message) {
		// update client connection
		clientConnection.setOutputFormat(message.format);
		
		// update test state
		clientConnection.isTestDone = false;
		clientConnection.caps = message.caps;
		clientConnection.testName = message.title;
		
		// create new log file if needed -- this is already done elsewhere
		if(message.format == clientLogger.OutputFormat.File)
			clientConnection.fileId = clientConnection.files.createLog(message.title, message.caps, 
				                      clientConnection.connectionId);
		
		//var resultLocation = clientConnection.reporter.getResultLocation();
		//resultLocation += '/' + clientConnection.caps.
		
		// create message text
		var text = 'Test "' + message.title + '" started on ' 
					+ message.date + '\n';
		text += 'Device ID: ' + clientConnection.connectionId + '\n\n';
		text += 'Device capabilities:\n';
		for(var cap in message.caps)
			text += '\t' + cap + ': ' + message.caps[cap] + '\n';
		
		return text;
};

JasmineMessages.doAction[JasmineMessages.Op.RunnerResults] = 
	function (clientConnection, message) {
		// update test state
		// clientConnection.isTestDone = true;
		
		// create message text
		var text = 'Test "' + clientConnection.testName
				   + '" finished at ' + message.date + '\n';
		text += '\tTest took ' + message.elapsed + ' to complete.\n\n';
		text += message.numSpecs + ' specs run. \n'
		text += 'Assertions:\n';
		text += '\t' + message.passed + ' passed, ' + message.failed + 
				' failed out of ' + message.total + ' total.\n';
				
		var didFail = false;
		if(message.failed > 0) {
			didFail = true;
		}
		
		if(clientConnection.outputFormat == clientLogger.OutputFormat.File) {
			clientConnection.files.getLog(clientConnection.fileId).readyToClose = true;
		}
		clientConnection.reporter.reportResult(clientConnection.testName, didFail);
		
		return text;
};

JasmineMessages.doAction[JasmineMessages.Op.SpecStarted] = function 
		(clientConnection, message) {
	var text = '"' + message.full_title + '" started at ' + message.date
			   + '.';
	return text;
};

JasmineMessages.doAction[JasmineMessages.Op.SpecResults] = function 
		(clientConnection, message) {
	var text = '"' + message.full_title + '" finished at ' + message.date
			   + '.\n';
	text += '\tSpec ' + message.status + '\n';
	
	for(var i =  0; i < message.items.length; i++)
	{
		var item = message.items[i];
		if(item.text !== undefined) {
			text += '\t> ' + item.text + '\n'; 
		} else if(message.status != 'passed') {
			text += '\t' + i + ': ';
			if(item.passed_ === false)
			{
				if(item.trace && item.trace.stack) {
					text += item.trace.stack + '\n';
				} else {
					text += item.message + '\n';
				}
			} else if(item.passed_ === true) {
				text += 'Expectation ' + item.message + '\n';
			}
		}
	}
	return text;

};

JasmineMessages.doAction[JasmineMessages.Op.SpecData] = function (clientConnection, message) {
	var text = "Spec Results\n";
	var validProperties = ["fullTitle", "startDate", "endDate", "duration", "expectations", "status"];
	var isValidData = function (specData) {
		for (var i=0, l=validProperties.length; i<l; ++i) {
			if (typeof specData[validProperties[i]] == "undefined") {
				return false;
			}
		}
		return true;
	};

	for (var key in message) {
		var specData = message[key];
		if (!isValidData(specData)) continue;
		text += '\n"' + specData.fullTitle + '"\n';
		text += "\tStarted:\t" + specData.startDate + "\n";
		text += "\tFinished:\t" + specData.endDate + "\n";
		text += "\tDuration:\t" + specData.duration.toFixed(3) + "s\n";
		text += '\tSpec ' + specData.status + '\n';
		var expectations = specData.expectations;
		for (var i=0, l=expectations.length; i < l; ++i) {
			var expectation = expectations[i];
			if(expectation.text !== undefined) {
				text += '\t> ' + expectation.text + '\n';
			} else if(specData.status !== 'passed') {
				text += '\t' + i + ': ';
				if (expectation.passed_ === false) {
					if (expectation.trace && expectation.trace.stack) {
						text += expectation.trace.stack + '\n';
					} else {
						text += expectation.message + '\n';
					}
				} else if (expectation.passed_ === true) {
					text += 'Expectation ' + expectation.message + '\n';
				}
			}
		}
	}

	return text;
};


JasmineMessages.doAction[JasmineMessages.Op.SuiteResults] = function 
		(clientConnection, message) {
	//var text = 'Suite "' + message.title + '" finished. Suite '
	//		   + message.status + '\n';
	// return text;
	return '';
};

JasmineMessages.doAction[JasmineMessages.Op.Log] = function
		(clientConnection, message) {
	return message.text;
};
