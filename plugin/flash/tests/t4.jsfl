var doc=fl.getDocumentDOM();
var lib=doc.library;

var timeline=doc.getTimeline();

var layerCount=timeline.layerCount;

fl.trace("layer size:"+layerCount);

var frames=timeline.layers[timeline.currentLayer].frames;
fl.trace("frame size:"+frames.length);

for(var i in frames){
    var frame=frames[i];

    if(i==frame.startFrame){
        var frameInfo="frame:"+i+","
            +"name:"+frame.name+","
            +"duration:"+frame.duration+","
            +"startFrame:"+frame.startFrame+","
            +"labelType:"+frame.labelType+","
            +"elementsCount:"+frame.elements.length+","
            +"isMotionObject:"+(frame.isMotionObject()?"true":"false")+","
            +"tweenType:"+frame.tweenType+","
            +"\n";
        fl.trace(frameInfo);
    }else{
        fl.trace("not key frame :"+i);
    }
}

//timeline.convertToKeyframes(9);

var isKeyFrame=function(layerObject,frameIndex){
    fl.trace("frame:"+frameIndex);
    fl.trace((layerObject.frameCount>frameIndex) +","+( layerObject.frames[frameIndex].startFrame==frameIndex))
    return layerObject.frameCount>frameIndex && layerObject.frames[frameIndex].startFrame==frameIndex;
};

//if(!isKeyFrame(timeline.layers[timeline.currentLayer],9)){
//    fl.trace("convert to key frames");
    timeline.convertToBlankKeyframes(9);
//}
