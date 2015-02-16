var currentFolder=getFolder(fl.scriptURI);
var libFolder=currentFolder+"/../";
fl.runScript(libFolder+"json2.jsfl");
fl.runScript(libFolder+"Path.jsfl");

fl.runScript(currentFolder+"/MovieClip.jsfl");
fl.runScript(currentFolder+"/AnimationImport.jsfl");






function getFolder(file){
    var dotPos=file.lastIndexOf("/");
    return file.substr(0,dotPos);
}