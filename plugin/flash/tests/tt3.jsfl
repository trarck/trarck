var yh={};

var currentFolder=getFolder(fl.scriptURI);
fl.runScript(currentFolder+"/tt1.jsfl");
fl.runScript(currentFolder+"/tt2.jsfl");

fl.trace(yh.aaa);
fl.trace(yh.bbb);

function getFolder(file){
    var dotPos=file.lastIndexOf("/");
    return file.substr(0,dotPos);
}