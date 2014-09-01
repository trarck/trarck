var fs = require('fs');
var http = require('http');
var url=require('url');
var path=require('path');

var WorkPool=require('./WorkPool').WorkPool;


function download(uri,callback,errCb) {
    var urlOpt=url.parse(uri);
    var requestOption={
        host:urlOpt.hostname,
        port:urlOpt.port,
        path:urlOpt.path
    };
    http.get(requestOption, function(res) {
      var buffers = [], size = 0;
      console.log('request STATUS: ' + res.statusCode+",url="+uri);
//      console.log('HEADERS: ' + JSON.stringify(res.headers));
      //res.setEncoding('utf8');
      
        res.on('data', function(buffer) {
            buffers.push(buffer);
            size += buffer.length;
        });
        res.on('end', function() {
            var buffer = new Buffer(size), pos = 0;
            for(var i = 0, l = buffers.length; i < l; i++) {
                buffers[i].copy(buffer, pos);
                pos += buffers[i].length;
            }
            switch(res.statusCode){
                case 200:
                    callback && callback(buffer);
                    break;
                case 404:
                    errCb && errCb(res);
                    break;
                case 0:
                    errCb && errCb(res);
                    break;
            }
        });
    }).on('error', function(e) {
      console.log("Got error: " + e.message+"\n uri="+uri);
      errCb && errCb(e);
    });
}

function downloadFile(uri,name,encoding,callback) {
    downloadRetry(download,uri,function (data) {
		mkdirs(name);
        fs.writeFile(name, data, encoding,function (err) {
          if (err) throw err;
          console.log(uri+' saved to '+name);
		  callback && callback(data);
        });
    },function(){
        console.log("download fail url="+uri);
    });
}

var MaxRetryTimes=10;
function downloadRetry(fun,uri,successCb,errCb){
    var retryTimes=0;
   
    var retry=function(){
        if(retryTimes++<MaxRetryTimes){
            console.log("retry:"+uri,'times:'+retryTimes);
            fun(uri,successCb,retry);
        }else{
            errCb && errCb();
        }
    }
    
    fun(uri,successCb,retry);
}

function downloadRetry2(fun,options){
    var retryTimes=0;
    
    var oldErrCb=options.errCb;

    options.errCb=function(){
        if(retryTimes++<MaxRetryTimes){
            console.log("retry:"+uri,'times:'+retryTimes);
            fun(options);
        }else{
            oldErrCb && oldErrCb();
        }
    }
    
    fun(options);
}

function downloadManifest(manifestUrl,name){
	name=name || path.basename(manifestUrl);
	download(manifestUrl,function(data){
		parseManifest(JSON.parse(data),name);
	});
//	downloadFile(manifestUrl,name,"binary",function(){
//		console.log("save ok");
//	});
}

function parseManifest(manifest,manifestName){
	delete manifest.__archives;

	var localManifest={};
	var wp=new WorkPool(10,"parseManifest");
	var item;
	for(var name in manifest){
		item=manifest[name];
		wp.add(function(task,name,item){
			var itemUrl=contentUrl+name;
			var outFile=outDir+name;
			downloadFile(itemUrl,outFile,"binary",function(){
			    console.log("save ok file:"+name);
				task.done();
				localManifest[name]={
					size:item.size,
					hash:item.hash
				}
			});
		},null,name,item);
	}
	wp.join(function(){
		fs.writeFile(outDir+name,JSON.stringify(localManifest),"binary");
	});
}

function mkdirs(file){
	var dir=path.basename(file).indexOf(".")>-1?path.dirname(file):file;
	var paths=[];
	while(!fs.existsSync(dir)){
		paths.push(dir);
		dir=path.dirname(dir);
	}
	while(p=paths.pop()){
		fs.mkdirSync(p);
	}
}

var gameUrl="http://app1.mobage.cn/12000006/android/b8ba22bedb2d699cfd599ade9ffdbba7/android/";
var configurationUrl=gameUrl+"configuration.json";
var contentUrl;
var outDir="build/";
//step 1 download configuration
 downloadRetry(download,configurationUrl,function (data) {
	console.log("download sucess url="+configurationUrl);
	console.log("configuration:"+data);
	var configuration=JSON.parse(data);
	contentUrl=configuration.contentUrl+"/";
	var mainManifest=configuration.contentUrl+"/webgame.ngmanifest";
	downloadManifest(mainManifest);
},function(){
	console.log("download fail url="+configurationUrl);
});

var serverUrl="http://putty-c.sp-app.mobage.cn/manifests/android/"
var manifests=[
    "webgame.event_001_android.ngmanifest"    
];

//download("http://www.baidu.com/index.html");
//downloadFile("http://app1.mobage.cn/12000006/android/b8ba22bedb2d699cfd599ade9ffdbba7/android/configuration.json","sina.html");
//downloadFile("http://images.sports.cn/olympic/cn/images/201103/img02ds.jpg","img03.jpg","binary",function(){
//    console.log("save ok");
//});
