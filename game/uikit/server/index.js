var urlUtil=require("url");
var Server=require("./server").Server;
var fs=require("fs");
var path=require("path");
var ArgParser=require("./ArgParser").ArgParser;

//default config
var config={
    host:"localhost",
    port:8421,
    root:path.join(__dirname,"../"),
	serverConfig:{
		ContentType:"text/json"
	},
    staticMaps:{
		"/Content":"/Users/duanhouhai/Development/git/TF_Client/Transformers/Content",
		"/JSON":"/Users/duanhouhai/Development/git/TF_Client/Transformers/Code/Views/JSON",
        "/yhge":"/Users/duanhouhai/trarck/game/yhge",
        "/yh":"/Users/duanhouhai/trarck/yh/src"
    },
    routeMaps:{
        '/saveView':{
            action:saveView
		},
		'/listView':{
			action:listView
		}
    }
};

//config from cmd args
var opts = [
    {
        full:'host',
        abbr:'h',
        description:"host domain"
    },
    {
        full:'port',
        abbr:'p',
        type:"number",
        description:"which port to run"
    },
    {
        full:"wwwroot",//work path
        abbr:"wr",
        description:"workspace directory path"
    },
    {
        full:"transformers",//transformers project path
        abbr:"tf",
        description:"transformers project path"
    },
    {
        full:'help',
        type:"boolean",
        defaultValue:true,
        description:"show this"
    }
];

var result =ArgParser.parse(opts);
var opts = result.options;

if(opts.help!=null){
    showUsage(result.usage);
}else{
    if(opts.host) config.host=opts.host;
    if(opts.port) config.port=opts.port;
    if(opts.wwwroot) config.wwwroot=opts.wwwroot;

    if(opts.transformers){
        config.staticMaps['/Content']=path.join(opts.transformers,"Transformers/Content");
        config.staticMaps['/JSON']=path.join(opts.transformers,"Transformers/Code/Views/JSON");
    }

    console.log("start server "+config.host+" at "+config.port);
    console.log("Contet:"+config.staticMaps['/Content']);
    console.log("ViewDefine:"+config.staticMaps['/JSON']);

    var httpServer=Server.createServerWithConfig(config);
}


function saveView(request,response,callback,data){
	var queryString=urlUtil.parse(request.url,true);
	var _get=queryString.query;
	var realPath=config.staticMaps["/JSON"];
    var file=_get.filename;
    var ext=path.extname(file);
    if(!ext){
        file+=".js";
    }

    var filePath=path.join(realPath,file);
    console.log("save "+filePath);

	fs.writeFile(filePath,createViewDataContent(data,_get.filename),function(err){
		if(err){
			response.statusCode=500;
            response.write(JSON.stringify(err));
		}
		callback();
	});
	return true;
}

function listView(request,response,callback){
	
	var list=[];
	var realPath=config.staticMaps["/JSON"];
	console.log(realPath);
	fs.readdir(realPath,function (err,files) {
        if(err){
            response.statusCode=500;
        }else{
			var file;
            for(var i in files){
				file=files[i];
                if(file.charAt(0)!=".")
					list.push(file);
            }
			response.write(JSON.stringify(list));
        }
		callback();
    });
	return true;
}

function createViewDataContent(data,filename){
	var ext=path.extname(filename);
    filename=path.basename(filename,ext);
    return "exports."+filename+"="+data;
}

function showUsage(optionsText){
    var head="Usage:node server [options]\n";
    console.log(head+"\n"+optionsText);
}