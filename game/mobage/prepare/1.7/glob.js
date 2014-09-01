/**
 * @overview This module resolves wildcards in a filename
 */
"use strict";
var fs = require('fs');
var path = require('path');
var util = require('util');

var utils = require('./utils.js');

var GLOB_DEBUG = false; // to debug glob.js itself

var IgnoreList = {
    ignoreFiles: [".DS_Store"]
};

var GLOB_LOG, GLOB_ERROR;
if(GLOB_DEBUG) {
    
    GLOB_LOG = function(msg, level) {
        var indent = '';
        if(level) {
            for(var i = 0; i < level; ++i) {
                indent += '>';
            }
        }
        console.log('GLOB ' + indent + ' ' + msg);
    };
    GLOB_ERROR = GLOB_LOG;
}
else {
    GLOB_LOG = function() { /* nop */ };
    GLOB_ERROR = GLOB_LOG;
}

exports.glob = function(base_dir, search_path, leaveBaseDir) {
    GLOB_LOG('==== file glob started  ====');
    base_dir = utils.replacePathToSlash(base_dir);
    var path_array = glob_search(search_path, base_dir, 1);
    // make it unique (faster than BakeUtilities.uniqArray())
    var seen  = {};
    var array = [];

    var base_dir_rx = "^" + base_dir.split("").
                         map(function(c){
                            return c.match(/[a-zA-Z0-9_\/]/) ? c : "\\" + c
                         }).join("").replace(/(?:\.\/|\/)?$/, "/");
    base_dir_rx = new RegExp(base_dir_rx);

    for(var i = 0; i < path_array.length; ++i) {
        var file = path_array[i];
        if(!seen[file]) {
            array.push(leaveBaseDir ? file : file.replace(base_dir_rx, ""));
            seen[file] = true;
        }
    }
    GLOB_LOG('==== file glob finished ====');
    return array;
};

/** @private */
function glob_search(search_path, base, level)
{
    search_path = utils.replacePathToSlash(search_path);
    base = utils.replacePathToSlash(base);
    if (base === undefined && search_path[0] === "/") {
        base = "/";
        search_path = search_path.substr(1);
    }

    // handle first part of search path
    var parts = search_path.split("/");
    var part = parts.shift();
    if (part === "") {
        part = "/";
    }
    GLOB_LOG("Searching '" + search_path + "' within '" + base + "'", level);

    var i;
    var exploded_parts = [];
    var recursiveFileResults = [];
    if (part.match(/^\*\*$/)) {
        var dirs = getAllDirectories(base, level);
        for (i in dirs) {
            var p = dirs[i].split("/");
            p.splice(0, base.split("/").length);
            exploded_parts.push(p.join("/"));
        }
    } else if (part.match(/\*/)) {
        GLOB_LOG("Listing dir: '" + base + "'", level);
        try {
            var part_files = fs.readdirSync(base);
            var search = new RegExp("^" + part.replace(/\*/g, "[^/]*") + "$");
            for (i in part_files) {
                var f = part_files[i];
                if (f.match(search)) {
                    var ignore = false;
                    var travIgnore;
                    for (travIgnore in IgnoreList.ignoreFiles) {
                        if (f.match(IgnoreList.ignoreFiles[travIgnore])) {
                            ignore = true;
                            break;
                        }
                    }
                    if (!ignore) {
                        GLOB_LOG("MATCH '" + f + "'", level);
                        exploded_parts.push(f);
                    }
                } else {
                    var sub = path.join(base, f);
                    sub = utils.replacePathToSlash(sub);
                    var stat = fs.statSync(sub);
                    if (stat.isDirectory()) {
                        var results = glob_search(part, sub, level+1);
                        recursiveFileResults = recursiveFileResults.concat(results);
                    }
                }
            }
        } catch (e) {
            BAKE_LOG_EXCEPTION(e);
            // *most likely* not a directory which is fine
        }
    } else {
        exploded_parts = [part];
    }

    GLOB_LOG("Exploded dirs: " + exploded_parts, level);

    // handle the rest of the search path
    var files = [];
    for (i in exploded_parts) {
        var exploded_part = exploded_parts[i];
        var tpath = path.join(base, exploded_part);
        tpath = utils.replacePathToSlash(tpath);
        if (path.existsSync(tpath)) {
            if (parts.length) {
                files = files.concat(glob_search(parts.join("/"), tpath, level+1));
            } else {
                files.push(tpath);
            }
        } else  {
            GLOB_ERROR("not exist: " + JSON.stringify(tpath), level);
        }
    }

    return files.concat(recursiveFileResults);
}

/** @private */
function getAllDirectories(directory, level) {
    GLOB_LOG("getAllDirectories(" + directory + ")", level);
    var files = [];
    var thisdir = fs.readdirSync(directory);

    var item;
    for (item in thisdir) {
        var realitem = path.join(directory, thisdir[item]);
        realitem = utils.replacePathToSlash(realitem);

        if (thisdir[item].charAt(0) != ".") {
            if (fs.statSync(realitem).isDirectory()) {
                var nextdir = getAllDirectories(realitem, level+1);
                files = files.concat(nextdir);
                files.push(realitem);
            }
        }
    }
    return files;
}

if(process.argv[1] === __filename) {
    (function(glob) {
        var list = glob(process.argv[2], process.argv[3]);
        for(var i = 0; i < list.length; ++i) {
            console.log(list[i]);
        }
    })(exports.glob);
}
