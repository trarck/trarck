// jslint wrapper for nodejs and jake
// copied and modified from ../node-jslint/bin/jslint.js
// Adapted from rhino.js. Copyright 2002 Douglas Crockford

var fs = require('fs');
var JSLINT = require("../node-jslint/lib/fulljslint_export").JSLINT;
var File = require('./file');

exports.checkfile = function(file){
    var success, pad;
    var input = File.readFileSyncSafe(file);
    if (!input) {
        console.log("jslintchk: Couldn't open file '" + file + "'.\n");
		return false;
    } else {
        input = input.toString("utf8");
    }

    // remove shebang (lifted from node.js)
    input = input.replace(/^\#\!.*/, "");

    success = JSLINT(input, {
        adsafe     : false, // if ADsafe should be enforced
        browser    : false, // if the standard browser globals should be predefined
        evil       : false, // if eval should be allowed
        on         : false, // if HTML event handlers should be allowed
        rhino      : false, // if the Rhino environment globals should be predefined
        strict     : false, // require the "use strict";
        widget     : false,  // if the Yahoo Widgets globals should be predefined
        predef:   [ // CommonJS or Machete Shark
                    "exports",
                    // NodeJS or Machete Shark
                    "require" ]
    });

    if (!success) {
        var len = JSLINT.errors.length;
        for (var i=0; i<len; i++) {
            pad = '' + (i + 1);
            while (pad.length < 3) {
                pad = ' ' + pad;
            }
            var e = JSLINT.errors[i];
            if (e) {
                console.log(pad + ' ' + e.line + ',' + e.character + ': ' + e.reason + "\n");
                console.log( '    ' + (e.evidence || '').replace(/^\s+|\s+$/, "")  + "\n");
            }
        }
    }
	return success;
}

