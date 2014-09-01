var util = require ('util');
var fs = require('fs');
var path = require('path');

var decrypt = require('./decrypt');
var Parser=require("./parser").Parser;
var Decombine = require('./decombine').Decombine;
var DecombineMap = require('./decombine').DecombineMap;
var ArgParser = require('./ArgParser').ArgParser;

var opts= [
    {
        full: 'src',
        abbr: 's'
    },
    {
        full: 'decrypt',
        abbr: 'd',
        type:"boolean"
    },
    {
        full: 'type',
        abbr: 't',
        type:"number"
    },
    {
        full: 'encoding',
        abbr: 'e'
    }
];
var args=process.argv.slice(2);
var argParser=new ArgParser();
argParser.setOpts(opts);
var result=argParser.parse(args);
var opts=result.opts;
console.log(opts);
var application=opts.src||"application.js";
var isDecrypt=opts.decrypt;
var encoding=opts.encoding||"utf8";
var type=opts.type;

console.log(application,isDecrypt,encoding,type)   ;
var content=isDecrypt ? decrypt.decryptJS(application,encoding):fs.readFileSync(application,encoding);

switch (type){
    case 1:
        var parser=new Parser("v1");
        var decombine=new Decombine({},parser);
        decombine.startUseCut(content,encoding);
        break;
    case 2:
        var parser=new Parser("v2");
        var retData=parser.parseRequireMap(content,encoding);
        var decombine=new DecombineMap({},parser);
        decombine.setRequireMap(retData.map);
        decombine.startUseCut(retData.content,encoding);
        break;
    case 3:
        var parser=new Parser("v3");
        parser.getModuleDefinePositions=parser.getModuleDefinePositionsSpec;
        var retData=parser.parseRequireMap(content,encoding);
        var decombine=new DecombineMap({},parser);
        decombine.setRequireMap(retData.map);
        decombine.startUseCut(retData.content,encoding);
    case 4:
        var parser=new Parser("v4");
        parser.getModuleDefinePositions=parser.getModuleDefinePositionsSpec;
        var retData=parser.parseRequireMap(content,encoding);
        var decombine=new DecombineMap({},parser);
        decombine.setRequireMap(retData.map);
        decombine.startUseCut(retData.content,encoding);
        break;
}
