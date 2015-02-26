var currentFolder=getFolder(fl.scriptURI);
var libFolder=currentFolder+"/../libs/";

fl.runScript(libFolder+"json2.jsfl");
fl.runScript(libFolder+"Path.jsfl");

fl.runScript(currentFolder+"/MovieClip.jsfl");
fl.runScript(currentFolder+"/AnimationExport.jsfl");

var animationExport=new AnimationExport(fl.getDocumentDOM());
animationExport.start("file:///E|/tt/aa/fl.json","file:///E|/tt/aa");




function getFolder(file){
    var dotPos=file.lastIndexOf("/");
    return file.substr(0,dotPos);
}