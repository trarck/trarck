var currentFolder=getFolder(fl.scriptURI);
var libFolder=currentFolder+"/../libs/";

fl.runScript(libFolder+"json2.jsfl");
fl.runScript(libFolder+"Path.jsfl");
fl.runScript(libFolder+"geom/MatrixTransformer.jsfl");
fl.runScript(libFolder+"geom/MatrixInterpolation.jsfl");

fl.runScript(currentFolder+"/define.jsfl");

fl.runScript(currentFolder+"/ConvertFca.jsfl");
fl.runScript(currentFolder+"/MovieClip.jsfl");
fl.runScript(currentFolder+"/AnimationImport.jsfl");

var animationImport=new AnimationImport(fl.getDocumentDOM(),1.0,"top left");
//animationImport.start("file:///E|/lua/dtcqtool/fca/temp/cha/AM/fl.json","file:///E|/lua/dtcqtool/fca/temp/heroes/AM");

var data=animationImport.getConfigData("file:///E|/tt/aa/fl.json");

var convertFca=new ConvertFca(data);
var actions=convertFca.convertActions();
data.actions=actions;

var outFile="file:///E|/tt/aa/ff.json";
var jsonString=JSON.stringify(data,null,4);
var dirPath=yh.Path.dirname(outFile);
if(!FLfile.exists(dirPath)){
    FLfile.createFolder(dirPath);
}

FLfile.write(outFile,jsonString);

FLfile.write(dirPath+"/ff.js","var dd="+jsonString+";");

function getFolder(file){
    var dotPos=file.lastIndexOf("/");
    return file.substr(0,dotPos);
}