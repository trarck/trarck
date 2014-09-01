var util = require ('util');
var fs = require('fs');
var path = require('path');

var isDecrypt=false;
var isMap=false;
//var decryptEncoding="gb2312";
var encoding="utf8";
var application="application.js";

var allRequireRE = /(^|;|\n)[^\/]*[^\.]?require\s*\(\s*(\"|\')([^'"]+)(\'|\")\s*\)/gm;
var singleRequireRE = /require\s*\(\s*(\'|\")([^'"]+)/g;

var headBegin="$MODULE_FACTORY_REGISTRY['",
    headEnd="']",
    contentBegin=isMap?"= exports;":"= exports; ",
    contentEnd="; return exports;};";

var content=isDecrypt ? decryptJS(application,encoding):fs.readFileSync(application,encoding);

if(isMap){
    var ret=parseMap(content,encoding);
    var requireMap=ret.map;
    parse(ret.content,encoding);
}else{
    parse(content,encoding);
}

function parse (content,encoding) {
    var module,nextPos=0,n=1;
    module=getModule(content,nextPos);
    var lastModule;
    while(module){
        lastModule=module;
        console.log(n++,":",module.name);
        createModule(module,encoding);
        nextPos=module.next;
        module=getModule(module.leftContent,nextPos);
    };
    if(lastModule){
        fs.writeFileSync("left.js", lastModule.leftContent,encoding);
    }
}

function parseMap(content,encoding) {
    var ret=getAppRequirePathMap(content,0);
    var newCnt=content.substring(ret.next);
    var map={};
    for(var path in ret.content) map[ret.content[path]]=path;
//    fs.writeFileSync("new.js", newCnt,encoding);
    return {map:map,content:newCnt};
}


function getAppRequirePathMap(content,from) {
    var beginToken="$APP_REQUIREPATHMAP = {",
        endToken="};";
    var posBegin=content.indexOf(beginToken,from);
    
    if(posBegin<0) return false;
    var posEnd=content.indexOf(endToken,posBegin+beginToken.length);
    //取得内容
    var cnt=content.substring(posBegin+beginToken.length,posEnd);
    
    var map=JSON.parse("{"+cnt+"}");

    return {content:map,next:posEnd+endToken.length};
}

function getModule(content,from) {
    //取得名称和路径
    var posHeadBegin=content.indexOf(headBegin,from);
    if(posHeadBegin<0) return false;
    var posHeadBeginNext=posHeadBegin+headBegin.length
    var posHeadEnd=content.indexOf(headEnd,posHeadBeginNext);
    var fullname=content.substring(posHeadBeginNext,posHeadEnd);
    fullname=isMap?requireMap[fullname]:fullname;
    //取得内容
    var posCntBegin=content.indexOf(contentBegin,posHeadEnd)+contentBegin.length;
    var posCntEnd=content.indexOf(contentEnd,posCntBegin);
    var cnt=content.substring(posCntBegin,posCntEnd);
    
    var headCnt=content.substring(0,posHeadBegin),
        endCnt=content.substring(posCntEnd+contentEnd.length);
    var newContent=headCnt+endCnt;
    //返回结果
    var ret={name:fullname,content:cnt,leftContent:newContent,next:posHeadBegin};
    //console.log(ret);
    return ret;
}

function createModule (module,encoding) {
    //建立路径
    var modulePath=path.dirname(module.name);
    mkdirp(modulePath);
    //替换require路径为相对路径
    var content=replaceRequirePath(module.content,modulePath);
    //生成文件
    fs.writeFileSync(module.name+".js",content,encoding);
}

function replaceRequirePath (content,modulePath) {
    content = content.replace(singleRequireRE,function () {
         var p=path.dirname(arguments[2]),file=path.basename(arguments[2]);
         p=getRelationPath(modulePath,p);
         p+=p.charAt(p.length-1)=="/"?"":"/";
         return "require("+arguments[1]+p+file;
    });
	return content;
}
function getRelationPath(src,desc) {
    
    var srcPaths=src.split("/"),
        descPaths=desc.split("/"),
        path="",
        i=0,
        m=srcPaths.length,
        n=descPaths.length;
    for(;i<m && i<n;i++){
        if(srcPaths[i]!=descPaths[i]){
            break;
        }
    }
    //console.log(i,m,n);
    if(i==m){
        path="./";
        if(i<n){
            path+=descPaths.slice(i).join("/");
        }
    }else{
        for(;i<m;m--) path+="../";
        if(i<n){
            path+=descPaths.slice(i).join("/");
        }
    }
    return path;
}
function mkdirp(path, permissions){
    permissions=permissions||"777";
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

function decryptJS(fname,encoding) {
    var code = fs.readFileSync(fname);
    var encryptedCode = decryptCode(code);
    var ext=path.extname(fname);
    var source=path.dirname(fname)+"/"+path.basename(fname,ext)+"_src"+ext;
    fs.writeFileSync(source, encryptedCode,encoding);
    return encryptedCode.toString(encoding);
}
function decryptCode(code) {
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
