var doc=fl.getDocumentDOM();
var lib=doc.library;
var timeline=doc.getTimeline();

timeline.layers[0].frames[0].soundName="AM_ULT.mp3";


//fl.trace(timeline.layers[0].frames[0].soundLibraryItem.name);

//timeline.layers[0].frames[0].soundLibraryItem=lib.items[21];
var indx=lib.findItemIndex("am");
fl.trace(indx=="");