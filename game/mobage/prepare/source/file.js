var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var File = require('./file');
var utils = require('./utils');

var IgnoreList = require('./IgnoreList').IgnoreList;

exports.safe = false;

function glob_search(search_path, base, dbg)
{
	if ( dbg )
	{
		console.log("GLOB - Searching " + search_path + " within " + base );
	}

	var files = [];
	var recursiveFileResults = [];
	var parts = search_path.split('/');
	var i;
	
	if(base == undefined && search_path[0] == '/')
	{
		base = '/';
		search_path = search_path.substr(1);
	}

	// handle first part of search path
	var part = parts.shift();
	if(part == '') part = '/';
	var full_part = join(base, part);

	var exploded_parts = [];
	if( dbg ) 
	{
		console.log("GLOB - Matching on part ", part);
	}
	
	if(part.match(/^\*\*$/)){
		var r = getAllDirectories(base);
		for(i in r)
		{
			var p = r[i].split('/');
			p.splice(0, base.split('/').length)
			exploded_parts.push(p.join('/'));
		}
	}
	else if(part.match(/\*/))
	{
		if( dbg )
		{
			console.log("GLOB - Listing dir " + base );
		}

		try {
			var part_files = fs.readdirSync(base);
		
			var search = new RegExp('^' + part.replace(/\*/g, '[^/]*') + '$');
			for(i in part_files)
			{
				if(part_files[i].match(search))
				{
					var found = false;
					var travIgnore;
					for( travIgnore in IgnoreList.ignoreFiles )
					{
						if ( part_files[ i ].match( IgnoreList.ignoreFiles[ travIgnore ] ) )
						{
							found = true;
							if ( dbg )
								console.log( "GLOB - match " + part_files[ i ] + " found in ignore list" );
							break;
						}
					}
					if ( found == false )
					{
						if ( dbg )
							console.log("GLOB - match " + part_files[i]);
						exploded_parts.push(part_files[i]);
					}
				}
				else 
				{
					var results = glob_search(part, path.join(base, part_files[i]));
					recursiveFileResults = recursiveFileResults.concat(results);
				}
			}
		}
		catch (error) {
			// *most likely* not a directory which is fine
		}
	}
	else
	{
		exploded_parts = [part];
	}

	if ( dbg ) 
	{
		console.log("GLOB - exploded dirs ", exploded_parts);
	}

	// handle the rest of the search path
	for(i in exploded_parts)
	{
		var exploded_part = exploded_parts[i];
		var tpath = join(base, exploded_part);
		if(exists(tpath))
		{
			if(parts.length)
			{
				files = files.concat(glob_search(parts.join('/'), join(base, exploded_part)));
			}
			else
			{
				files.push(join(base, exploded_part));
			}
		}
		else 
		{
			if ( dbg ) 
			{
				console.log ( "GLOB - path does not exist: " + tpath );
			}
		}
	}

	return files.concat(recursiveFileResults);
};

function getAllDirectories(directory) {
	// console.log("GLOB - getAllDirectories("+directory+")")
	var files = [];
	var thisdir = fs.readdirSync(directory);

	for (item in thisdir) {
		var realitem = join(directory, thisdir[item]);
		
		if (thisdir[item].charAt(0) != '.') {
			if (fs.statSync(realitem).isDirectory()) {
				nextdir = getAllDirectories(realitem);
				files = files.concat(nextdir);
				files.push(realitem);
			}
		}
	}
	return files;
}

function getAllFiles(directory) {		
	var files = [];
	var thisdir = fs.readdirSync(directory);

	for (item in thisdir) {
		var realitem = join(directory, thisdir[item]);
		
		if (thisdir[item].charAt(0) != '.') {
			if (fs.statSync(realitem).isDirectory()) {
				nextdir = getAllFiles(realitem);
				files = files.concat(nextdir);
			}
			else {
				files.push(realitem);
			}
		}
	}
	return files;
}


// Recursively create directories.  Don't die if they already exist.
function mkdirp(path, permissions){
	var dirs = path.split('/');
	var parents = [];
	var d;
	while((d = dirs.shift()) != undefined){
		try{
			parents.push(d);
			fs.mkdirSync(parents.join('/'), permissions);
		} catch(e) {
			// console.log("Failed to create directory ", parents.join('/'), e);
		}
	}
}

// TODO: this exists in path.  use that instead
function exists(path){
	try{
		fs.statSync(path);
		return true;
	}
	catch(e){
		return false;
	}
}

// TODO: this exists in path.  use that instead
function join(){
	var segments = [];
	for(var i in arguments){
		var arg = arguments[i];
		if(arg && arg != ''){
			if(i != arguments.length -1){
				arg = arg.replace(/\/$/, '');
			}
			if(i != 0){
				arg = arg.replace(/^\//, '');
			}
			segments.push(arg);
		}
	}
	return segments.join('/');
}

// Mangles a file path.
function mangle(path)
{
	var extensionIndex = path.lastIndexOf('.');
	if(extensionIndex == -1)
		return path;
		
	return path.substr(0, extensionIndex) + '-' + path.substr(extensionIndex+1) + '.bin';
}
    
// Demangles a file path.
function demangle(path)
{
	if(path.substr(path.length-4) != '.bin')
		return path;
	
	var extensionIndex = path.lastIndexOf('-');
	return path.substr(0, extensionIndex) + '.' + path.substring(extensionIndex+1, path.length-4);
}

// This method should be used with every file read to make sure
// that the request is not being made outside of the server's sandbox.
function safePath(file)
{
	try
	{
		var rfile = path.resolve(file);
		
		var safe = ( rfile.indexOf(process.cwd()) == 0 ) || ! exports.safe;
		
		if ( ! safe )
			console.log ( "access to file denied: " + file );
		
		return safe ? file : "";
	}
	catch(ex)
	{
		return "";
	}
}

// This should be used as a replacement everywhere fs.readFileSync is used.
function readFileSyncSafe(file,encoding)
{
    try {
    	return fs.readFileSync(safePath(file),encoding);
    }
    catch(ex)
    {
        console.log(ex.message);
        return null;
    }
}

function encryptData(code, filename) {
    var encrypted = new Buffer(code.length);
    for (var i = 0; i < code.length; i++) {
        var ch = code[i];
        if (ch >= 0x100) {
            throw new Error("input code should be a byte array (not unicode)");
        }
        encrypted[i] = ch ^ 0x55;
    }
    return encrypted;
}

function encryptFile(fname, callback) {
    var mtime = (function () {
        var to2d = function (v) {
            return (v <= 9 ? '0' : '') + v;
        };
        var st = fs.statSync(fname);
        return (st.mtime.getYear() + 1900).toString()
            + to2d(st.mtime.getMonth() + 1)
            + to2d(st.mtime.getDate())
            + to2d(st.mtime.getHours())
            + to2d(st.mtime.getMinutes())
            + '.'
            + to2d(st.mtime.getSeconds());
    })();
    var code = File.readFileSyncSafe(fname);
    fs.writeFileSync(fname, encryptData(code));
    console.log('touch -t ' + mtime + ' ' + fname);
    child_process.exec('touch -t ' + mtime + ' ' + fname,
        function(err, stdout, stderr) {
            if (err !== null)
		utils.error('failed to modify mtime of file: ' + fname + ' to ' + mtime + ', ' + stderr);
            if (callback)
                callback();
        }
    );
}

function makeSameFileState(src, dest,callback) {
    var to2d = function (v) {
        return (v <= 9 ? '0' : '') + v;
    };
    var st = fs.statSync(src);
    var mtime=(st.mtime.getYear() + 1900).toString()
        + to2d(st.mtime.getMonth() + 1)
        + to2d(st.mtime.getDate())
        + to2d(st.mtime.getHours())
        + to2d(st.mtime.getMinutes())
        + '.'
        + to2d(st.mtime.getSeconds());

    child_process.exec('touch -t ' + mtime + ' ' + dest,
        function(err, stdout, stderr) {
            if (err !== null)
                utils.error('failed to modify mtime of file: ' + fname + ' to ' + mtime + ', ' + stderr);
            if (callback)
                callback();
        }
    );
}

exports.glob = glob_search;
exports.exists = exists;
exports.join = join;
exports.mkdirp = mkdirp;
exports.mangle = mangle;
exports.demangle = demangle;
exports.safePath = safePath;
exports.readFileSyncSafe = readFileSyncSafe;
exports.encryptFile = encryptFile;
exports.makeSameFileState = makeSameFileState;