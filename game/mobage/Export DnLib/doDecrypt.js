var util = require ('util');
var fs = require('fs');
var path = require('path');

var decrypt = require('./decrypt');


var args=process.argv.slice(2);

var file=args[0]||"application.js";
var out=args[1]
var content=decrypt.decryptJS(file,null);
if(out){
	fs.writeFileSync(out,content);	
}
