var doc=fl.getDocumentDOM();
var lib=doc.library;

var currentFolder=getFolder(fl.scriptURI);
fl.runScript(currentFolder+"/show_timeline.jsfl"); 

var timeline=fl.getDocumentDOM().getTimeline();

var mat={ a: 1,
  b: 0.9999999999999999,
  c: -0.5773502691896257,
  d: 1,
  tx: 0,
  ty: 0 };

var sel = fl.getDocumentDOM().selection[0];

sel.matrix=mat;
//sel.skewX=30;

showTimeline(fl.getDocumentDOM().getTimeline());

function getFolder(file){
	var dotPos=file.lastIndexOf("/");
	return file.substr(0,dotPos);
}

function degreesToRadians(angle) {
	return angle / 180.0 * Math.PI;
}

function radiansToDegrees(radians) {
	return radians * (180.0 / Math.PI);
}