var fs = require('fs');
var http = require('http');
var url=require('url');
var path=require('path');

var WorkPool=require('./WorkPool').WorkPool;
var Download=require('./Download').Download;

var DownloadAsset=function  () {

};
DownloadAsset.prototype={
    
    setup:function(options){
        this._options=options;
        this._remoteUrl=options.secureContentUrl||options.contentUrl;
        this._localRoot=options.localPath;
        this._remoteUrl=this._remoteUrl.charAt(this._remoteUrl.length-1)=="/"?this._remoteUrl:this._remoteUrl+"/";
        this._localRoot=this._localRoot.charAt(this._localRoot.length-1)=="/"?this._localRoot:this._localRoot+"/";
    },
    start:function(manifestName,cb){
        var self=this;
        var manifestUrl=this._remoteUrl+manifestName;
        Download.download(manifestUrl,function(data){
			//fs.writeFile(self._localRoot+manifestName+"_remote",data,"binary");
            self.downloadManifestContent(JSON.parse(data),manifestName,cb);
        });
    },
    downloadManifestContent:function(manifest,manifestName,cb){
        var self=this;
        var localManifest={};
        var wp=new WorkPool(10,"downloadManifestContent");
        var item;

        delete manifest.__archives;

        for(var name in manifest){
            item=manifest[name];
            wp.add(function(task,name,item){
                var itemUrl=self._remoteUrl+name;
                var outFile=self._localRoot+name;
                Download.downloadFile(itemUrl,outFile,"binary",function(){
                    console.log("save ok file:"+name);
                    localManifest[name]={
                        size:item.size,
                        hash:item.hash
                    }
					task.done();
                });
            },null,name,item);
        }
        wp.join(function(){
            fs.writeFile(self._localRoot+manifestName,JSON.stringify(localManifest),"binary");
            cb && cb();
        });
    }
};
exports.DownloadAsset=DownloadAsset;