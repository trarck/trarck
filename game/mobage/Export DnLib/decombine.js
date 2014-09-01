var util=require("util");
var fs=require("fs");
var path = require('path');

var Parser=require("./parser").Parser;

var allRequireRE = /(^|;|\n)[^\/]*[^\.]?require\s*\(\s*(\"|\')([^'"]+)(\'|\")\s*\)/gm;
var singleRequireRE = /require\s*\(\s*(\'|\")([^'"]+)/g;

var defaultConfig={
    parserVersion:"v1"
};

exports.Decombine=function(){
    this.init.apply(this,Array.prototype.slice.call(arguments));
};

exports.Decombine.prototype={
    init:function(config,parser){
        config=config||{};
        config.parserVersion=config.parserVersion||"v1";
        config.leftName=config.leftName||"Main.js";
        this._config=config;
        this._parser=parser;
    },
    start:function  (content,encoding) {
        var module,nextPos=0,n=1;
        module=this.getModule(content,nextPos);

        while(module){
            console.log(n++,":",module.name);
            this.createModule(module,encoding);
            nextPos=module.next;
            module=this.getModule(content,nextPos);
        }
    },
    startUseCut:function(content,encoding){
        var module,nextPos=0,n=1;
        module=this.getModuleUseCut(content,nextPos);
        var lastModule;
        while(module){
           // console.log(module);
            lastModule=module;
            console.log(n++,":",module.name);
            this.createModule(module,encoding);
            nextPos=module.next;
            module=this.getModuleUseCut(module.leftContent,nextPos);
        }
        if(lastModule){
            fs.writeFileSync(this._config.leftName, lastModule.leftContent,encoding);
        }
    },
    getModulet:function(content,nextPos){
        var module=this._parser.getModule(content,nextPos);
        return module;
    },
    getModuleUseCut:function(content,nextPos){
        var module=this._parser.getModuleUseCut(content,nextPos);
        return module;
    },
    createModule:function  (module,encoding) {
        //建立路径
        var modulePath=path.dirname(module.name);
        mkdirp(modulePath);
        //替换require路径为相对路径
        var content=this.replaceRequirePath(module.content,modulePath);
        //生成文件
        fs.writeFileSync(module.name+".js",content,encoding);
    },
    replaceRequirePath:function  (content,modulePath) {
        content = content.replace(singleRequireRE,function () {
            var p=path.dirname(arguments[2]),file=path.basename(arguments[2]);
            p=getRelationPath(modulePath,p);
            p+=p.charAt(p.length-1)=="/"?"":"/";
            return "require("+arguments[1]+p+file;
        });
        return content;
    },
    setParser:function(parser){
        this._parser=parser;
        return this;
    },
    getParser:function(){
        return  this._parser;
    }
};
//================1.6,1.7=================//
exports.DecombineMap=function(config,parser){
    this.init.apply(this,arguments);
};
for(var k in exports.Decombine.prototype){
    exports.DecombineMap.prototype[k]=exports.Decombine.prototype[k];
}

exports.DecombineMap.prototype.getModule=function(content,nextPos){
    var module=this._parser.getModule(content,nextPos);
    module.name=this._requireMap[module.name];
    return module;
};
exports.DecombineMap.prototype.getModuleUseCut=function(content,nextPos){
    var module=this._parser.getModuleUseCut(content,nextPos);
    module.name=this._requireMap[module.name];
    return module;
};
exports.DecombineMap.prototype.replaceRequirePath=function  (content,modulePath) {
    var self=this;
    content = content.replace(singleRequireRE,function () {
        var fullPath=self._requireMap ? self._requireMap[arguments[2]]:arguments[2];
        var p=path.dirname(fullPath),file=path.basename(fullPath);
        p=getRelationPath(modulePath,p);
        p+=p.charAt(p.length-1)=="/"?"":"/";
        return "require("+arguments[1]+p+file;
    });
    return content;
};
exports.DecombineMap.prototype.setRequireMap=function(requireMap){
    this._requireMap=requireMap;
    return this;
};

//=====common TODO move to util====//
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

function getRelationPath(src,desc) {
    //remove last /
    src=src.charAt(src.length-1)=="/"?src.substr(0,src.length-2):src;
    desc=desc.charAt(desc.length-1)=="/"?desc.substr(0,desc.length-2):desc;

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

    if(i==m){
        path="./"
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