var doc=fl.getDocumentDOM();
var lib=doc.library;

var timeline=doc.getTimeline();

var layerCount=timeline.layerCount;

var frames=timeline.layers[timeline.currentLayer].frames;

timeline.currentLayer=0;
timeline.currentFrame=0;
timeline.convertToKeyframes(0,timeline.layers[0].frameCount);