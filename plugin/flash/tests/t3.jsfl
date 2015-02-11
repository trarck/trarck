var doc=fl.getDocumentDOM();
var lib=doc.library;

var currentFolder=getFolder(fl.scriptURI);
fl.runScript(currentFolder+"/show_timeline.jsfl"); 

var longestLayer = fl.getDocumentDOM().getTimeline().frameCount;
fl.trace("The longest layer has" + longestLayer + "frames");
showTimeline(fl.getDocumentDOM().getTimeline());
//var testItemIndex=lib.findItemIndex("animations/idle");

//if(testItemIndex==""){
//    fl.trace("no item");
//}else{
//    var testItem=lib.items[testItemIndex];
//   var fc=testItem.timeline.frameCount;
//   fl.trace("frame count="+fc);
//
//	showTimeline(testItem.timeline);
// }

function getFolder(file){
	var dotPos=file.lastIndexOf("/");
	return file.substr(0,dotPos);
}