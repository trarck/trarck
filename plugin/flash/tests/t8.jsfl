var doc=fl.getDocumentDOM();
var lib=doc.library;
var timeline=doc.getTimeline();

//timeline.layers[0].frames[0].soundName="AM_ULT.mp3";
//
//
////fl.trace(timeline.layers[0].frames[0].soundLibraryItem.name);
//
////timeline.layers[0].frames[0].soundLibraryItem=lib.items[21];
//var indx=lib.findItemIndex("am");
//fl.trace(indx=="");
//
//timeline.clearFrames(1,9);
//fl.trace(timeline.layers[1].frames[13].startFrame);
//timeline.convertToKeyframes(7);
//timeline.clearFrames(7,7);
//lib.addItemToDocument({x:0,y:0})
//timeline.currentFrame=6;
//var selects=timeline.layers[0].frames[6].elements;
//doc.selection=selects;
//doc.deleteSelection();
timeline.insertFrames(2,true,6);