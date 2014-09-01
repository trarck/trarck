/**
 * fix translation
 */

var fs = require('fs');
var JsonUtil = require('./JsonUtil').JsonUtil;
var ArgParser = require('./ArgParser').ArgParser;


var opts = [
    {
        full:'translationed',
        abbr:'tra',
        description:"old translationed json file"
    },
    {
        full:'original',
        abbr:'ori',
        description:"old translationed original json file for example en.json"
    },

    {
        full:"newOriginal",
        abbr:"new",
        description:"the new original json file contains new key name"
    },

    {
        full:"fixed",
        abbr:"fixed",
        description:"out put file name for fixed"
    },

    {
        full:'help',
        type:"boolean",
        defaultValue:true,
        description:"show this"
    }
];

var result=ArgParser.parse(opts);

var options = result.options;

if(options.help!=null || result.cmds[0]=="help"){
    showUsage(result.usage);
}else{

    if(options.translationed && options.original && options.newOriginal){
        var oldTranslateJson = JSON.parse(fs.readFileSync(options.translationed));
        var middleJson = JSON.parse(fs.readFileSync(options.original));
        var newJson = JSON.parse(fs.readFileSync( options.newOriginal));
        if(middleJson && oldTranslateJson && newJson){
            var fixedTranslation = fixTranslate(oldTranslateJson, middleJson, newJson);
            var outFile=options.fixed ||"zh_fixed.json";
            console.log("fix success to "+outFile);
            fs.writeFileSync(outFile, JSON.stringify(fixedTranslation, null, 4));

            var oldJson = toNewKey(middleJson, newJson);
            var outOldFile="en_fixed.json";
            console.log("original file to "+outOldFile);
            fs.writeFileSync(outOldFile, JSON.stringify(oldJson, null, 4));
        }
    }
}

function showUsage(optionsText){
    var head="Usage:node fix [options]\n";
    console.log(head+"\n"+optionsText);
}

function fixTranslate(oldTranslateJson, middleJson, newJson) {
    var usedMiddleMapKeyIndexs = {};
    var middleMap =JsonUtil.flip(middleJson,true);
    middleMap=keyToLowerCase(middleMap);

    var out = {};
    for (var key in newJson) {
        var middleKey = newJson[key];
        //value => old key
        var oldKey = middleMap[middleKey];
        if (oldKey instanceof Array) {
            if (usedMiddleMapKeyIndexs[middleKey] == null) usedMiddleMapKeyIndexs[middleKey] = 0;
            oldKey = oldKey[usedMiddleMapKeyIndexs[middleKey]];
            usedMiddleMapKeyIndexs[middleKey]++;
        }
        out[key] = oldTranslateJson[oldKey] == null ? newJson[key] : oldTranslateJson[oldKey];
    }
    return out;
}

function toNewKey(src, dest) {
    var usedMiddleMapKeyIndexs = {};
    var middleMap = JsonUtil.flip(src, true);
    middleMap=keyToLowerCase(middleMap);

    var out = JsonUtil.clone(src);
    for (var key in dest) {
        var middleKey = dest[key].toLowerCase();
        //value => old key
        var oldKey = middleMap[middleKey];
        if (oldKey instanceof Array) {
            if (usedMiddleMapKeyIndexs[middleKey] == null) usedMiddleMapKeyIndexs[middleKey] = 0;
            oldKey = oldKey[usedMiddleMapKeyIndexs[middleKey]];
            usedMiddleMapKeyIndexs[middleKey]++;
        }
        if (oldKey) {
            out[key] = dest[key];
        }
    }
    return out;
}

function keyToLowerCase(obj){
    var ret={};
    for(var k in obj){
        if(obj.hasOwnProperty(k)){
            ret[k.toLowerCase()]=obj[k];
        }
    }
    return ret;
}
