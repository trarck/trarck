var File = require('./file');
var fs = require("fs");
var ClientCom = require('./ClientCom').clientCom;

var DeviceModule = {};

DeviceModule.DeviceState = {
	Free: 0,
	Busy: 1,
	Dead: 2,
	DoesNotExist: 3
};

var AUTO_TEST_LOC   = 'Tests/AutomatedTests';
var MANUAL_TEST_LOC = 'Tests/ManualTests';
var UNFINISHED_TEST_LOC = 'Unfinished';

// TODO where to put this?
function getTestLocation() {
	var testLocation = AUTO_TEST_LOC;
	
	if(TestModule.isTestPassManual) {
		testLocation = MANUAL_TEST_LOC;
	}
	if(TestModule.isTestUnfinished) {
		testLocation = UNFINISHED_TEST_LOC + '/' 
		               + testLocation;
	}
	return testLocation;
}

DeviceModule.Device = function (id, name, taskGroupName, logRoot) {
	this.id = id;
	this.name = name;
	this.caps = {};
	this.connection = undefined;
	this.state = DeviceModule.DeviceState.Free;
	this.lastUpdateTime = '';
	this.currentTask = '';
	this.setTaskGroup(taskGroupName, undefined, logRoot);
	this.group = '';
};

DeviceModule.Device.prototype.updateDevice = function (id, name, caps) {
	if(caps)
		this.caps = caps;
	this.name = name;
	this.id = id;
};


DeviceModule.Device.prototype.setTaskGroup = function (taskGroupName, testLocation, testLogRoot) {
	this.taskGroup = new TestModule.TestGroup(taskGroupName,
	                 testLocation || getTestLocation(),
	                 (testLogRoot || 'Logs') + '/Results/' + this.id + '/');

};

DeviceModule.Device.prototype.addToTaskGroup = function (testLocation) {
	this.taskGroup.loadAndAddTests(testLocation);
};

DeviceModule.Device.prototype.getTaskGroup = function () {
	return this.taskGroup;
};

// TODO think how to manage connections
DeviceModule.Device.prototype.updateConnection = function (connection) {

	this.connection = connection;
};

DeviceModule.Device.prototype.getState = function () {
	return this.state;
};

DeviceModule.Device.prototype.setState = function (state) {
	this.state = state;
};

DeviceModule.Device.prototype.updateCheckinTime = function (time) {
	this.lastUpdateTime = time;
};

DeviceModule.Device.prototype.getCurrentTask = function () {
	return this.currentTask;
};

DeviceModule.Device.prototype.setCurrentTask = function (task) {
	this.currentTask = task;
};

DeviceModule.Device.prototype.setGroup = function (group) {
	this.group = group;
};

DeviceModule.Device.prototype.getGroup = function (task) {
	return this.group;
};

function printCaps(caps) {
	for(var item in caps)
	{
		console.log('\t' + item + ': ' + caps[item]);
	}
}

DeviceModule.printDeviceState = function (state) {
	var output = '';

	switch(state) {
		case DeviceModule.DeviceState.Free:
			output = 'Device free.';
			break;
		case DeviceModule.DeviceState.Busy:
			output = 'Device busy.';
			break;
		case DeviceModule.DeviceState.Dead:
			output = 'Device dead.';
			break;
		default:
			output = 'Device state unknown.';
	}
	return output;
}

DeviceModule.Device.prototype.print = function () {

	console.log('\tname: ' + this.name);
	console.log('\tid: ' + this.id);
	console.log('\tcaps: ');
	printCaps(this.caps);
	console.log('\tstate: ' + DeviceModule.printDeviceState(this.state));
	console.log('\tlastUpdateTime: ' + this.lastUpdateTime);
	console.log('\tcurrentTask: ' + this.currentTask);
	console.log('\tgroup: ' + this.group);
	console.log('\ttask group:', this.taskGroup.print());
	
}

DeviceModule.DeviceGroup = function (name) {
	this.group = {};
	this.numInGroup = 0;
	this.name = name;
	this.currentTask = '';
};

DeviceModule.DeviceGroup.prototype.add = function (device) {
	if(device)
	{
		if(!this.group[device.id])
		{
			this.group[device.id] = device;
			device.setGroup(this.name);
			this.numInGroup++;
			return true;
		}
		// else device is already in the group
	}
	return false;
};

DeviceModule.DeviceGroup.prototype.remove = function (deviceId) {
	if(deviceId && this.numInGroup > 0)
	{
		if(this.group[deviceId])
		{
			delete this.group[deviceId];
			this.numInGroup--;
			return true;
		}
	}
	return false;
};

DeviceModule.DeviceGroup.prototype.getDevice = function (deviceId) {
	return this.group[deviceId];
};

DeviceModule.DeviceGroup.prototype.print = function () {
	console.log('\tGroup: ' + this.name);
	console.log('\tNum in group: ' + this.numInGroup);
	console.log('\tCurrent Task: ' + this.currentTask);
	console.log('\tDevices: \n');
	var devices = '\t';
	for(var device in this.group)
		devices += this.group[device].id + ':' + this.group[device].name + ', ';
	console.log(devices + 'END');
};

DeviceModule.DeviceManager = function () {
	this.devices = {};
	this.deviceGroups = {};
	this.taskGroup = {};
	this.createDeviceGroup('base');
};

DeviceModule.DeviceManager.prototype.createDeviceGroup = function (name) {
	if(this.deviceGroups[name]) {
		// already exists
		return false;
	}
	
	this.deviceGroups[name] = new DeviceModule.DeviceGroup(name);
	return true;
};

DeviceModule.DeviceManager.prototype.deleteDeviceGroup = function (name) {
	if(this.deviceGroups[name])
	{
		delete this.deviceGroups[name];
		return true;
	}
	return false;
};

DeviceModule.DeviceManager.prototype.getDevice = function (deviceId) {
	return this.devices[deviceId];
};

DeviceModule.DeviceManager.prototype.addDevice = function (device, group) {
	
	if(!(device && device.id)) {
		console.log('Invalid device to add');
		return false;
	}
	
	if(this.devices[device.id]) {
		// device already exists
		console.log('Device already exists');
		return false;
	}
	
	if(!group)
		group = 'base';
		
	// create a new group if it doesn't exist
	if(!this.deviceGroups[group]) {
		console.log('deviceGroup ' + group + ' does not exist');
		this.deviceGroups[group] = new DeviceModule.DeviceGroup(group);
	}
	
	this.deviceGroups[group].add(device);
	this.devices[device.id] = device;
	return true;

};

DeviceModule.DeviceManager.prototype.removeDevice = function (deviceId) {
	if(!this.devices[deviceId])
		return false;
	this.deviceGroups[this.devices[deviceId].getGroup()].remove(deviceId);
	delete this.devices[deviceId];
	return true;
};

DeviceModule.DeviceManager.prototype.getDeviceState = function (deviceId) {
	if(!this.devices[deviceId])
		return DeviceModule.DeviceState.DoesNotExist;
	return this.devices[deviceId].getState();
};

DeviceModule.DeviceManager.prototype.print = function () {
	
	console.log('DeviceManager devices');
	console.log('');
	for(var device in this.devices) {
		this.devices[device].print();
		console.log('');
	}
	console.log('');
	console.log('DeviceManager device groups');	
	console.log('');
	for(var group in this.deviceGroups) {
		this.deviceGroups[group].print();
	}
	console.log('');
	console.log('DeviceManager task group');	
	console.log('');
	for(var task in this.taskGroup) {
		taskGroup[task].print();
	}
	console.log('');
};

DeviceModule.DeviceManager.prototype.sendToPersistantStorage = function () {
	
};

DeviceModule.DeviceManager.prototype.readFromPersistantStorage = function () {
	
};


var TestModule = {};


// vars for tests
TestModule.testPassName;
TestModule.isTestPassManual = false;
TestModule.isTestUnfinished = false;
TestModule.isTestAutomatedSocial = false;

TestModule.TestGroup = function (name, testLocation, resultLocation) {
	this.name = name;
	this.resultLocation = resultLocation;
	this.pass = 0;
	this.fail = 0;
	this.failList = [];
	this.testList = [];
	this.currentTest = -1;
	
	this.loadTests(testLocation);
};

TestModule.TestGroup.prototype.getNextTest = function () {
	if(this.testList.length > ++this.currentTest)
		return this.testList[this.currentTest];
	return null;
};

TestModule.TestGroup.prototype.getCurrentTest = function () {
	if(this.currentTest == -1)
		return null;
	return this.testList[this.currentTest];
};

TestModule.getFilenameFromPath = function (path) {
	
};

TestModule.readTestsFromFile = function (pathToFile) {
	var tests = '';
	try {
		tests = File.readFileSyncSafe(pathToFile, 'utf8');
	} catch (e) {
		console.log('Failed reading tests from file: ' + e.toString());
		return null;
	}
	
	return tests.split(/\s+/);
	
};

TestModule.getRunnableTests = function (testList, testLocation) {
	var regex;
	var runnableTests = [];
	var acceptableTests = [];
	
	// filter out files not in the whitelist
	if(File.exists(testLocation + '/whitelist.txt')) {
		runnableTests = TestModule.readTestsFromFile(testLocation + '/whitelist.txt');
		console.log('Whitelist tests: ' + runnableTests);
		if(runnableTests) {
			for(var i = 0; i < testList.length; i ++){
				for(var j = 0; j < runnableTests.length; j++) {
					regex = RegExp('^' + runnableTests[j] + '$', 'i');
					if(regex.test(testList[i])) {
						acceptableTests.push(testList[i]);
						break;
					}
					
				}
			}
		} else { // white list is empty, don't filter
			acceptableTests = testList;
		}
	} else { // white list file does not exist
		acceptableTests = testList;
	}
	
	return acceptableTests;
}

var testNum = 0;
TestModule.TestGroup.prototype.loadTests = function (testLocation) {

	
	this.testLocation = testLocation;
	console.log('Loading tests from ' + testLocation);
	
	if(!File.exists(testLocation)) {
		console.log('location "' + testLocation + '" does not exist.');
		return false;
	}
	
	this.testList = fs.readdirSync(testLocation);
	this.testList = this.testList.filter(function (x) {
		// ignore hidden dirs and anything not a directory
		try {
			return (fs.statSync(testLocation + '/' + x).isDirectory() && x[0] != '.');
		} catch (e) {
			console.log(x + ' is not a file or directory, skipping:', e.toString());
			return false;
		}
	});

	this.testList = TestModule.getRunnableTests(this.testList, testLocation);

// Diversify the ordering of tests to help the server handle so many devices
	for(var i = 0; i < testNum; ++i)
	{
		// twice so we have less overlap in tests for the first (test number/2) tests.
		this.testList.unshift(this.testList.pop());
		this.testList.unshift(this.testList.pop());
	}
	++testNum;

	for(var i = 0; i < this.testList.length; i++)
		this.testList[i] = '/' + this.testLocation + '/' + this.testList[i];

	console.log('\tFound these files: ');
	for(var i = 0; i < this.testList.length; i++)
		console.log('\t' + this.testList[i]);
	return true;
};

// adding this function because I don't want to test loadTests
// TODO get rid of this
TestModule.TestGroup.prototype.loadAndAddTests = function (testLocation) {
	var newTestList;
	var i = 0, oldLength = 0;
	
	console.log('Adding tests from ' + testLocation);
	if(!File.exists(testLocation)) {
		console.log('location ' + testLocation + ' does not exist.');
		return false;
	}
	
	newTestList = fs.readdirSync(testLocation);
	newTestList = newTestList.filter(function (x) {
		// ignore hidden dirs and anything not a directory
		try {
			return (fs.statSync(testLocation + '/' + x).isDirectory() && x[0] != '.');
		} catch (e) {
			console.log(x + ' is not a file or directory, skipping:', e.toString());
			return false;
		}
	});
	
	newTestList = TestModule.getRunnableTests(newTestList, testLocation);
		
	// append to end of test list if needed
	oldLength = this.testList.length;
	for(i = 0; i < newTestList.length; i++) {
		// ngCore uses web server html pathing, so add root to stop path from being appended
		this.testList[i + oldLength] = require('path').join('/', testLocation,
			newTestList[i]);
	}
	console.log('Added these files:');
	for(i = 0; i < newTestList.length; i++) {
		console.log('\t' + this.testList[i + oldLength]);
	}
	
};

// TODO Create directories (move this to a more appropriate place) (utils? and static)
TestModule.TestGroup.prototype.createResultDirectory = function (path) {
	var pathParts = '';
	if ('/' === path.charAt(0)) {
		pathParts = '/';
	}
	var pathArr = path.split('/');

	for (var i = 0; i < pathArr.length; i++ ) {
		pathParts += pathArr[i];
		if(!File.exists(pathParts)) {
			fs.mkdirSync(pathParts, 511);
		}
		pathParts += '/';
	} 

};


// TODO need to move fileLogging to its own file and use it for this.
TestModule.TestGroup.prototype.createReport = function () {

	this.createResultDirectory(this.resultLocation);
	
	var date = new Date();
	
	var fileName = this.name.replace(/(\s)/g, '_') + '_' + date.getFullYear() + (date.getMonth() + 1) 
	               + date.getDate() + '_' + date.getHours() + '_' + date.getMinutes();

	if(this.fail > 0)
		fileName += '_fail.txt';
	else if(this.testList.length == this.pass)
		fileName += '_pass.txt';
	else
		fileName += '_investigate.txt';
	
	console.log('\tCreating final result file: ' + this.resultLocation + '/' + fileName + '\n');
		
	var fd = fs.openSync(this.resultLocation + '/' + fileName, 'w');
	
	var bufString = 'Results for test group "' + this.name + '": ' + this.pass + ' passed, ' + this.fail 
	                + ' failed.\n\n';
	bufString += 'Tests that failed:\n\n';
	for(var i = 0; i < this.failList.length; i++) {
		bufString += '\t' + this.failList[i] + '\n';
	}
	
	fs.writeSync(fd, bufString, 0, 'utf8');
	fs.closeSync(fd);
}

TestModule.TestGroup.prototype.restart = function () {
	this.currentTest = -1;
	this.pass = 0;
	this.fail = 0;
	this.failList = [];
	this.testList = [];
	this.loadTests(getTestLocation());
};

TestModule.TestGroup.prototype.setResultLocation = function (resultLocation) {
	this.resultLocation = resultLocation;
};

TestModule.TestGroup.prototype.getResultLocation = function () {
	return this.resultLocation;
};

TestModule.TestGroup.prototype.reportResult = function (name, didFail) {
	if(didFail) {
		this.fail++;
		this.failList.push(name);
	} else {
		this.pass++;
	}
};

TestModule.TestGroup.prototype.print = function () {
	for(var prop in this)
	{
		if(typeof this[prop] != 'function')
			console.log('Prop: ' + prop + ', Value: ' + this[prop].toString());
	}
};


// TODO move into own file
exports.TestModule = TestModule;
exports.DeviceModule = DeviceModule;

/*
(function () { 
	var devManager = new DeviceModule.DeviceManager();
	devManager.createDeviceGroup('group1');
	devManager.createDeviceGroup('group2');
	devManager.createDeviceGroup('group3');
	
	var device = new DeviceModule.Device('trialPhone123', 'trialphone');
	device.print();
	
	// phones should only exist in one group
	devManager.addDevice('group2', new DeviceModule.Device('phone123','andyphone'));
	devManager.addDevice('group3', new DeviceModule.Device('phone123','andyphone'));
	
	// device group does not exist, will get created
	devManager.addDevice('group4', new DeviceModule.Device('phone321', 'iosphone'));
	devManager.print();
	console.log('*****');
	devManager.removeDevice('phone321');
	devManager.addDevice('group1', new DeviceModule.Device('123431', 'flash'));
	
	devManager.print();
	
	var testManager = new TestModule.TestGroup('TestGroup1!', '', 'Logs');
	testManager.reportResult('Test1', true);
	testManager.reportResult('Test2', false);
	testManager.print();
	testManager.createReport();
	
}());*/

