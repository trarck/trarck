var File = require('./file');
var fs = require('fs');
var Path = require('path');
var Utility = require('./utility').Utility;

// Bugs: deleting file outside nodejs doesn't cause termination

var fileLogging = {};

// TODO need to implement async writes as writing out is slowing server

fileLogging.BUF_SIZE = 1024;
fileLogging.buffer = new Buffer(fileLogging.BUF_SIZE);

fileLogging.MSG_STORE = 10;

fileLogging.File = function (path, name, fd) {
	this.path = path;
	this.name = name;
	this.fd = fd;
	this.buffer = [];
	this.position = 0;
	this.readyToClose = false;
};

fileLogging.File.prototype.flush = function () {
	console.log('flushing to file');
	var bufString = this.buffer.join('\n') + '\n';
	this.buffer = [];
	
	var bytesWritten = fs.writeSync(this.fd, bufString, this.position, 'utf8');
	this.position = this.position + bytesWritten;
};

fileLogging.File.prototype.append = function (message) {
	console.log('appending to file');
	this.buffer.push(message);
	if(this.buffer.length == fileLogging.MSG_STORE)
		this.flush();
};


fileLogging.Files = function (directory) {
	this.fileListing = {};
	try {
		if(!Path.existsSync(directory))
		{
			fs.mkdirSync(directory, 0777);
		}
	} catch(e) {
		console.log('Could not create file directory', directory + '.', e.toString());
		directory = undefined;
	}
	
	this.homeDir = directory;
};

fileLogging.createLogPath = function (caps) {
	//if(!caps)
	return '';
	
};


fileLogging.Files.prototype.createLog = function (name, caps, id) {
	var date = new Date();
	var fileId = name + date.getTime();
	var fileName = name.replace(/(\s)/g, '_') +
	 Utility.sprintf('_%04d%02d%02d_%02d_%02d.txt',
	 date.getFullYear(), (date.getMonth() + 1), date.getDate(), date.getHours(),
	 date.getMinutes());
	
	var filePath = Path.join(this.homeDir, id);
	
	if(!File.exists(filePath)) {
		fs.mkdirSync(filePath, 0777);
	}
	
	if(this.fileListing[fileId]) {
		console.log('file already exists');
		return;
	}

	filePath = Path.join(filePath, fileName);
	try {
		var fd = fs.openSync(filePath, 'w', 0777);
	
		this.fileListing[fileId] = new fileLogging.File(filePath, name, fd);
	
		console.log('Created new file log object: ' +
	            JSON.stringify(this.fileListing[fileId]));
	} catch (e)
	{
		console.log('Error!!! Failed to create a file log at path', filePath, '\nException:', e.toString());
	}

	return fileId;
};

fileLogging.Files.prototype.getLog = function (fileId) {
	return this.fileListing[fileId];
}

fileLogging.Files.prototype.addToLog = function (fileId, message) {
	
	if(!this.fileListing[fileId]) {
		console.log('Unable to add to ' + fileId + ' as it was never created.');
		return false;
	}
	
	var packet = '[' + message.id + '] ' + message.text;
	//console.log('packet: ' + packet);

	this.fileListing[fileId].append(packet);
	
	return true;
	
	/**** !!!have to synch on my own... writes collide
	var bytesWritten = fileLogging.buffer.write(packet, 0, 'utf8');
	
	console.log();
	console.log('packet: ' + packet);
	console.log('byte len: ' + bytesWritten);
	console.log('buffer: ' + fileLogging.buffer.toString('utf8', 0, bytesWritten));
	console.log();
	
	fs.write(this.files[fileId].fd, fileLogging.buffer, 
	         0, bytesWritten,
	         this.files[fileId].position,
	         function (err) {
	         	if(err) {
	         		printError(err);
	         	} else {
	         		console.log('Wrote ' + message.id);
	         	}
	         });
	         //fileLogging.writeCallBack);
	             
	this.files[fileId].position += bytesWritten;
	*/
};

fileLogging.Files.prototype.closeLog = function (fileId) {
	console.log('Closing Log');
	if(!this.fileListing[fileId]) {
		console.log('File not found in listing.');
		return;
	}
	this.fileListing[fileId].flush();
	fs.closeSync(this.fileListing[fileId].fd);
	
	// MT growl test result hack
	// copy into growl message file.
	//fs.link(this.fileListing[fileId].path, 'Logs/done.txt');
	var data = File.readFileSyncSafe(this.fileListing[fileId].path, 'utf8');
	fs.writeFileSync(this.homeDir + '/done.txt', data);
	
	// remove it from the directory
	delete this.fileListing[fileId];
};

// TODO: can call external command
fileLogging.Files.prototype.deleteLog = function (fileId) {
	delete this.fileListing[fileId];
};

fileLogging.Files.prototype.clearStore = function () {
	for(var fileId in this.fileListing)
		this.deleteLog(fileId);
};

fileLogging.Files.prototype.createDeviceCapFile = function (id, caps) {
	var filePath = Path.join(this.homeDir, id);
	var deviceName = caps.deviceName;
	var fileName = Path.join(filePath, deviceName + '_' + id + '.json');
		
	if(!File.exists(filePath)) {
		fs.mkdirSync(filePath, 0777);
	}
	
	if(!File.exists(fileName)) {
		delete caps.type;
		caps = JSON.stringify(caps);
		fs.writeFile(fileName, caps, function (err) {
			if (err) {
				console.log('Error creating device caps file "' + fileName + '": '
				+ err);
			} else {
				console.log('Device caps file for device ' + id + ' saved.');
			}
		});
	}
};

exports.fileLogger = fileLogging;
