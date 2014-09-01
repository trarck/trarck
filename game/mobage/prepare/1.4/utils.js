
// ----------------------------------------------------------------------
// device
// ----------------------------------------------------------------------
var DEVICE_iOS = 0;
var DEVICE_Android = 1;
var DEVICE_Flash   = 2;
var DEVICE_Curl    = 3;
var DEVICE_All     = 4;

/**
 * user-agent
 *  - Android	: ngcore-android/sdks_1.1-20110616-1.1.6 (mobage; c2599bac4747edeaa2fb110e55d97e9f... (length: 81)
 *
 *  - iOS       : 
 *      iOS1    : webgame/1.0 CFNetwork/485.12.7 Darwin/10.7.0
 *      iOS2    : user-agent : ngcore-ios/sdks_1.1-20110616-1.1.6 (mobage; f8a649779448aec69cf9215407f326ce)
 *
 *  - Flash     : 
 *      Chrome  : Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.30 (KHTML, like G... (length: 119)
 *      FireFox : Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; ja-JP-mac; rv:1.9.2.13) Gecko/20... (length: 108)
 *
 *  - curl      : curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8l zlib/1.2.... (length: 81)
 * @param request
 */
function getDevice(request, options) {
	
	// if cmdline option buildtarget=???
	if (options && options.buildtarget) {
		var target = options.buildtarget.toLowerCase();
		if (target === "ios") {
			return DEVICE_iOS;
		}
		if (target === "android") {
			return DEVICE_Android;
		}
		if (target === "all") {
			return DEVICE_All;
		}
	}
	
	if (!request || request == undefined || !request.headers || !request.headers["user-agent"]) {
		return DEVICE_All;
	}
	if (request.headers["user-agent"].match(/^(ngcore-ios|webgame)/)) {
		return DEVICE_iOS;
	}
	if (request.headers["user-agent"].match(/^ngcore-android/)) {
		return DEVICE_Android;
	}
	if (request.headers["user-agent"].match(/^curl/)) {
		return DEVICE_Curl;
	}
	if (request.headers["user-agent"]) {
		return DEVICE_Flash;
	}
	return DEVICE_All;
}

function isAllBuild(request, options) {
	return (getDevice(request, options) === DEVICE_All || getDevice(request, options) === DEVICE_Curl);
}

function isFlash(request, options) {
	return (getDevice(request, options) === DEVICE_Flash);
}
function isIOS(request, options) {
	return (getDevice(request, options) === DEVICE_iOS);
}
function isAndroid(request, options) {
	return (getDevice(request, options) === DEVICE_Android);
}
function isCurl(request, options) {
	return (getDevice(request, options) === DEVICE_Curl);
}

function getDeviceDir(request, options) {
	if(isIOS(request, options)){
		return  'ios';
	}else if(isAndroid(request, options)){
		return  'android';
	}
	return '';
}


//----------------------------------------------------------------------
//debug
//----------------------------------------------------------------------
/**
 * dump object
 */
function dump(obj) {
	var str = "\n ===== dump ================= ";
	info(str);

	var count_obj = 0;
	function _output(str) {
		info(str);
	}
	function _print_r(obj, name, level) {
		var s = "";
		if (obj == undefined || level > 4) {
			return;
		}
		for (var i = 0; i < level; i++) {
			s += " | ";
		}
		s += " - " + name + ":" + typeof(obj) + "=" + obj;
		_output(s);
		if (name == "document" || typeof(obj) != "object") {
			return;
		}
		for ( key in obj ) {
			if (count_obj++ > 150) return;
			_print_r(obj[key], key, level + 1);
		}
	}
	_print_r(obj, "*", 0);
}

// ----------------------------------------------------------------------
// LOG 
// ----------------------------------------------------------------------
var log_level = 2;

var log_level_trace = 0;
var log_level_debug = 1;
var log_level_info  = 2;
var log_level_error = 3;


function error(msg){
	msg = logf(msg, arguments);
	console.log(new Date().toLocaleTimeString() +  " : ERROR : " + msg);
}
function warn(msg){
	msg = logf(msg, arguments);
	console.log(new Date().toLocaleTimeString() +  " : WARN  : " + msg);
}

function info(msg){
	msg = logf(msg, arguments);
	console.log(new Date().toLocaleTimeString() +  " : INFO  : " + msg);
}

function debug(msg){
	if (enableDebug()){
		msg = logf(msg, arguments);
		console.log(new Date().toLocaleTimeString() +  " : DEBUG : " + msg);
	}
}

function enableDebug(){
	return log_level < 2;
}

function logf(str, callerArgs) {
	if (callerArgs.length == 1) {
		return str;
	}
	var args = Array.prototype.slice.call(callerArgs, 1);
    for(arg in args) {
    	str = str.replace("%s", args[arg]);
    }
    return str;
}

function indexOf(array, value, start){
    if(array.indexOf){
        return array.indexOf(value,start);
    }else{
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
    }
};
exports.error = error;
exports.info  = info;
exports.debug = debug;
exports.warn  = warn;
exports.enableDebug = enableDebug;
exports.getDevice = getDevice;
exports.isAllBuild = isAllBuild;
exports.isFlash   = isFlash;
exports.isIOS     = isIOS;
exports.isAndroid = isAndroid;
exports.isCurl    = isCurl;
exports.getDeviceDir = getDeviceDir;
exports.dump      = dump;

exports.DeviceType={
    IOS : 0,
    ANDROID : 1,
    FLASH   : 2,
    CURL    : 3,
    ALL     : 4
};
exports.indexOf=indexOf;


