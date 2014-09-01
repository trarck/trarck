var fs=require('fs');
var path=require('path');
var exec = require('child_process').exec;

var ArgParser = require('./ArgParser').ArgParser;

var opts= [
    {
        full: 'config',
        abbr: 'c'
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

if(!opts.config){
	console.error("no config file !");
}

var appConfig=opts.config;

var app=JSON.parse(fs.readFileSync(appConfig));

console.log(app)

if(!app){
	console.error("config file format error!");
}

app.dest=app.dest.replace("{version}",app.version);
app.dest=app.dest.charAt(app.dest.length-1)=="/"?app.dest:app.dest+"/";

app.beginRegexp=new RegExp(app.beginRegexp);
app.endRegexp=new RegExp(app.endRegexp);

var encode=app.encode || "utf8";

var header=fs.readFileSync(app.headerTemplate,encode);
header=header.replace("{appName}",app.name);
header=header.replace("{version}",app.version);


//目标目录不存在则建立
mkdirs(app.dest);
cleardir(app.dest);

var allCnt="";

//处理build
console.log("build modle");
var builds=app.builds;
var item,dir;
for(var modle in builds ){
	item=builds[modle];
    dir=item.dir?item.dir:app.src+"/"+modle+"/";
	allCnt+=build(modle,item.files,dir);
}

console.log("build all");
//所有分的组成一个文件
var srcAll=app.dest+app.name+'.js';
var minAll=app.dest+app.name+'.min.js';

fs.writeFileSync(srcAll,allCnt);

jsmin(srcAll,minAll);

//给文件加版本号
addVersionHeadToDir(app.dest);

function build(model,files,dir) {
	console.log("build "+model+" file count="+files.length);
    var min=app.prefix?app.dest+app.prefix+"."+model+".min.js":app.dest+model+".min.js";
    var src=app.prefix?app.dest+app.prefix+"."+model+".js":app.dest+model+".js";
    //先merge后min
    var content=merge(files,dir);
    fs.writeFileSync(src,content,encode);
    jsmin(src,min);
    return content;
}

function merge(files,dir) {
	var content="";
	var file;
    for(var i in files){
        file=files[i];
		if(file!=".." && file!="."){
			console.log("merge:"+dir+file)
            content+=fs.readFileSync(dir+file,encode);
        }
    }
    content=filterLog(content);
    return app.useFilter?filter(content):content;
}

function filter(cnt) {
	cnt=cnt.replace(app.beginRegexp,"");
	cnt=cnt.replace(app.endRegexp,"");
	return app.tagBegin+"\r\n"+cnt+app.tagEnd;
}

function filterLog (cnt) {
    return cnt.replace(/console\.log\(.*\);?/ig,"");
}

function jsmin(src,dec){
	console.log("java -jar compiler.jar --js "+src+" --js_output_file "+dec);
    exec("java -jar compiler.jar --js "+src+" --js_output_file "+dec); //--compilation_level ADVANCED_OPTIMIZATIONS
    //addVersionHeadToFile($src);
    //addVersionHeadToFile($dec);
}

function addVersionHeadToFile(file) {
	console.log("addVersionHeadToFile "+file);    
	var content=fs.readFileSync(file,encode);
    fs.writeFileSync(file,header+content,encode);
}

function addVersionHeadToDir(dir) {
	console.log("addVersionHeadToDir "+dir);
    var files=fs.readdirSync(dir);

	var file;
    for(var filename,i=0,l=files.length;i<l;i++){
		filename=files[i];
        if(filename!=".." && filename!="."){
            file=dir+filename;
            addVersionHeadToFile(file);
        }
    }
}



function mkdirs(dir){
	var paths=[];
	while(!fs.existsSync(dir)){
		paths.push(dir);
		dir=path.dirname(dir);
	}
	while(p=paths.pop()){
		fs.mkdirSync(p);
	}
}
function cleardir(dir){
	var files=fs.readdirSync(dir);

	var file;
    for(var filename,i=0,l=files.length;i<l;i++){
		filename=files[i];
        if(filename!=".." && filename!="."){
			file=dir+filename;
            fs.unlinkSync(file);
        }
    }
}