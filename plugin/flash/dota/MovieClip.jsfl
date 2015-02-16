function MovieClip(doc,timeline){
    this.doc=doc;
    this.lib=doc.library;
    this.timeline=timeline;
}

MovieClip.prototype.createContent=function(data){
    var layers=data.layers;
    for(var i in layers){
        //first is exists,not need create
        if(i!=0){
            //create layer on top
            this.timeline.addNewLayer();
        }
        //新创建的layer在最上面
        this.createLayer(0,layers[i]);
    }
};

//one layer only on element
MovieClip.prototype.createLayer=function(layerIndex,data){
    var timeline=this.timeline;

    var layerObj=timeline.layers[layerIndex];

    var elementName=data.element;

    layerObj.name=data.layerName|| elementName;

    //place element in first frame
    this.placeElement(layerIndex,0,elementName);

    var frames = data.frames;

    //先创建关键帧
    for(var i in frames){
        var frame=frames[i];
        var startFrame=frame.startFrame;
        if(!this.isKeyFrame(layerObj,startFrame)){
            this.timeline.convertToBlankKeyframes(frame);
        }
        //设置属性
        this.setElementProperty(layerObj.frames[startFrame].elements[0],frame);
    }

    //创建补间
    for(var i in frames){
        var frame=frames[i];
        var startFrame=frame.startFrame;

        if(frame.tweenType=="motion"){
            //create a motion
            var duration=frame.duration;
            timeline.createMotionTween(startFrame,startFrame+duration);
        }
    }
};

MovieClip.prototype.placeElement=function(layer,frame,elementName){
    if(!this.lib.selectItem(elementName)){
        return;
    }

    this.timeline.currentLayer=layer;
    this.timeline.currentFrame=frame;

    //check is key frame
    var layerObj=this.timeline.layers[layer];

    if(this.isKeyFrame(layerObj,frame)){
        //clear frame data
        this.timeline.clearFrames(frame);
    }else{
        //convert to key frame
        this.timeline.convertToBlankKeyframes(frame);
    }

    this.lib.addItemToDocument({x:0,y:0});
    ////后面放置的会在上面，depth值就越小。也就是elements的第一个元素。
    //var addedElement=this.timeline.layers[layer].frames[frame].elements[0];
    //this.setElementProperty(addedElement,property);
    //return this.timeline.layers[layer].frames[frame].elements[0];
};

MovieClip.prototype.setElementProperty=function(element,property){

    var haveSelected=false;

    if(property.matrix){
        element.matrix=property.matrix;

        doc.selection = [element];
        doc.setTransformationPoint({x:0, y:0});
        haveSelected=true;
    }

    if(typeof(property.alpha)!="undefined"){
        if(!haveSelected){
            doc.selection=[element];
            haveSelected=true;
        }
        doc.setInstanceAlpha(property.alpha);
    }
};

MovieClip.prototype.isKeyFrame=function(layerObject,frameIndex){
   return layerObject.frameCount>frameIndex && layerObject.frames[frameIndex].startFrame==frameIndex;
};
