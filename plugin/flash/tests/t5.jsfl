var doc=fl.getDocumentDOM();
var lib=doc.library;

var timeline=doc.getTimeline();

var layerCount=timeline.layerCount;

fl.trace("layer size:"+layerCount);

var frames=timeline.layers[timeline.currentLayer].frames;
fl.trace("frame size:"+frames.length);

var elements=[];

for(var i in frames){
    var frame=frames[i];

    if(i==frame.startFrame){
        elements.push(frame.elements[0]);
    }
}

for(var j=0;j<elements.length-1;j++){
    fl.trace(j+" "+(elements[j]==elements[j+1]));
}

