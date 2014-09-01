var fs = require('fs');
var http = require('http');
var url=require('url');
var path=require('path');

var existsSync=fs.existsSync||path.existsSync;

var MaxRetryTimes=10;

var Download={
    
    download:function (uri,callback,errCb) {
        console.log("start download "+uri);
		//不使用代理
        var urlOpt=url.parse(uri);
        var requestOption={
            host:urlOpt.hostname,
            port:urlOpt.port,
            path:urlOpt.path
        };
		//使用代理
		// var requestOption={
		//             host:"192.168.20.75",
		//             port:8080,
		//             path:uri,
		// 	method: 'GET'
		//         };

        var req=http.request(requestOption, function(res) {
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
					case 302:
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
        });
		req.on('error', function(e) {
          console.log("Got error: " + e.message);
          errCb && errCb(e);
        });
		req.end();
    },
    downloadFile:function (uri,name,encoding,callback) {
        Download.downloadRetry(Download.download,uri,function (data) {
            mkdirs(name);
            fs.writeFile(name, data, encoding,function (err) {
              if (err) throw err;
              console.log(uri+' saved to '+name);
              callback && callback(data);
            });
        },function(){
            console.log("download fail url="+uri);
        });
    },
    downloadRetry:function (fun,uri,successCb,errCb){
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
    },
    downloadRetry2:function (fun,options){
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
};

function mkdirs(file){
	var dir=path.basename(file).indexOf(".")>-1?path.dirname(file):file;
	var paths=[];
	while(!existsSync(dir)){
		paths.push(dir);
		dir=path.dirname(dir);
	}
	while(p=paths.pop()){
		fs.mkdirSync(p);
	}
}
exports.Download=Download;