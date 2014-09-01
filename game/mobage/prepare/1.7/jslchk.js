// invoke the command-line tool 'jsl' to perform lint check
// jsl binary comes from JavascriptLint.com

var fs = require('fs');
var spawn = require('child_process').spawn;
var File = require('./file');

/*
 * These files are checked by default if no jsl option is specified.
 */
var defaultJSLintFiles = [
	"NGCore/Client/Plus/AddressBookScan.js",
	"NGCore/Client/Plus/ContactsScanBase.js",
	"NGCore/Client/Plus/ContactSearch.js",
	"NGCore/Client/Plus/DataModel.js",
	"NGCore/Client/Plus/PlusRequest.js",
	"NGCore/Client/Plus/RegistrationRecord.js",
	"NGCore/Client/Plus/ResultSet.js",
	"NGCore/Client/Plus/User.js",
	"NGCore/Client/Plus/UserData.js",
	"NGCore/Client/Plus/UserList.js",
	"NGCore/Client/Plus/UserSearch.js",
	"NGCore/Client/Plus/oauth.js",
	"NGCore/Client/Plus/sha1.js",
	"NGCore/Client/UI/SystemBinding.js"
];

exports.checkfiles = function(options, cb) {
	var warningsOK = false;
	if ((typeof options != 'undefined') &&
	    (typeof options.jslintWarningsOK != 'undefined')) {
		warningsOK = (options.jslintWarningsOK == 'true');
	}

	var jsLintFiles = [];
	if ((typeof options == 'undefined') ||
       	(typeof options.jslint == 'undefined')) {
		// no jslint option, use default list of files
		var resBase = __dirname + "/../../";
		var defaultLen = defaultJSLintFiles.length;
		for (var idx=0; idx < defaultLen; idx++) {
			var filepath = resBase + defaultJSLintFiles[idx];
			jsLintFiles.push(filepath);
		}
	} else if (options.jslint != 'false') {
		if (options.jslint == 'true') {
			// check all js files in current directory, don't recurse down
			// subdirs.  Therefore, library files may not be checked
			var dir_files = fs.readdirSync(".");
			for(var i in dir_files){
				var dir_file = dir_files[i];
				if(dir_file.match(/\.js$/)) {
					jsLintFiles.push(dir_file);
				}
			}
		} else {
			// only check specified files, separated by ','
			jsLintFiles = options.jslint.split(',');
		}
	}
	checkFileAsync(warningsOK, jsLintFiles, true, cb);
};

/*
 * checkFileAsync --
 *    If there are remaining files in list, shift one out and check it.
 *    If no remaining file in list, call back.
 */
function checkFileAsync(warningsOK, filelist, successSoFar, cb){
	// Termination condition
	if (filelist.length <= 0) {
		cb(successSoFar);
		return;
	}

	// Process one file then async call to do next one
	var file = filelist.shift();
    var input = File.readFileSyncSafe(file);
    if (!input) {
        console.log("jslchk: Couldn't open file '" + file + "'.\n");
		cb(false);
		return;
    } else {
        input = input.toString("utf8");
    }

    // remove shebang (lifted from node.js)
    input = input.replace(/^\#\!.*/, "");

	// path of jsl executable and config file is relative to this script path
	var jslpath = __dirname + "/../jsl-0.3.0-mac/jsl";
	var jslconfpath = __dirname + "/../jsl-0.3.0-mac/nggame.conf";
	var jsl = spawn(jslpath, ['-conf', jslconfpath, '-stdin']);
	jsl.stdin.write(input);
	jsl.stdin.end();
//console.log("Checking " + file + "   (using jsl)\n");

	var outdata = "";
	var errdata = "";
	jsl.stdout.on('data', function (data) {
	  outdata += data;
	});

	jsl.stderr.on('data', function (data) {
	  errdata += data;
	});

	jsl.on('exit', function (code) {
		var checkOK = warningsOK ? (code <= 1) : (code == 0);
		var successNx = successSoFar && checkOK;
		if (code !== 0) {
		    console.log('------ jsl exit code: ' + code + '\n');
			console.log("------ jsl stderr:\n");
			console.log(errdata + "\n");
			console.log("------ jsl stdout:\n");
			console.log(outdata + "\n");
		}

		// Proceed to next file
		checkFileAsync(warningsOK, filelist, successNx, cb);
	});
}
