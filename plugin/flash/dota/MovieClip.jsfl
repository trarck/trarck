

var MovieClip;

(function () {
    MovieClip=function (doc,timeline,fcaScale,alignType){
        this.doc=doc;
        this.lib=doc.library;
        this.timeline=timeline;
        this.fcaScale=fcaScale||0.111;
    };

    MovieClip.prototype.setFcaScale=function(fcaScale){
        this.fcaScale=fcaScale;
        return this;
    };

    MovieClip.prototype.getFcaScale=function(){
        return this.fcaScale;
    };

    MovieClip.prototype.createContent=function(layers,eventLayers){
        //由于timeline创建的时候会自动生成一个layer.第一个layer可以不用创建
        this.createElementLayers(layers,false);
        //this.createEventLayers(eventLayers,true);
    };

    MovieClip.prototype.createElementLayers=function(layers,needCreateFirst){
        //create elements layer
        for(var i in layers){
            //first is exists,not need create
            if(i!=0 || needCreateFirst){
                //create layer on top
                this.timeline.addNewLayer();
            }
            //the new is on the top
            this.createElementLayer(0,layers[i]);

            //if(i>1) return;
        }
    };

    //one layer only on element
    MovieClip.prototype.createElementLayer=function(layerIndex,data){
        var layerObj=this.timeline.layers[layerIndex];

        var elementName=data.element;

        layerObj.name=data.name|| yh.Path.basename(elementName);

        //clear all frames
        if(layerObj.frameCount){
            this.timeline.removeFrames(0,layerObj.frameCount);
        }

        var frames = data.frames;

        //key frames
        for(var i=0;i<frames.length;++i) {
            this.createLayerFrame(layerIndex,i,frames,elementName);
        }

        //create tween
        for(var i=0;i<frames.length;++i) {
            var frame=frames[i];
            if(frame.tweenType=="motion"){
                this.timeline.createMotionTween(frame.startFrame,frame.startFrame+frame.duration);
            }
        }
    };

    MovieClip.prototype.createLayerFrame=function(layerIndex,frameDataIndex,framesData,elementName){
        var currentFrameData=framesData[frameDataIndex];
        var startFrame=currentFrameData.startFrame;

        this.timeline.currentLayer=layerIndex;
        this.timeline.currentFrame=startFrame;
        var layerObj=this.timeline.layers[layerIndex];

        //fl.trace("start frame:"+startFrame);

        if(!this.isKeyFrame(layerObj,startFrame)){
            //fl.trace("convert key frame:"+startFrame);
            //由于一个层的元素是一样的，这里直接使用前一个关键帧的数据。
            this.timeline.convertToKeyframes(startFrame);
            //在创建新的关键帧，可能会延长上个关键帧的持续的帧数，在下面会修正。
        }

        //检查element是否为空，可能会为空
        if(layerObj.frames[startFrame].elements.length==0){
            //fl.trace("place element["+elementName+"]:"+startFrame);
            this.placeElement(layerIndex,startFrame,elementName);
        }

        //set property
        this.setElementProperty(layerObj.frames[startFrame].elements[0],currentFrameData);

        //补上非关键帧。虽然在下个关键帧插入的时候会自动补上，为了保险和处理最后一个的情况。
        if(currentFrameData.continueCount>1){
            this.timeline.insertFrames(currentFrameData.continueCount-1,false,startFrame);
        }

        //如果是补间动画，则补上后续帧
        if(currentFrameData.tweenType=="motion"){
            this.timeline.insertFrames(currentFrameData.duration-1,false,startFrame);
        }

        //检查上个关键帧是否被延长
        //这里有另外个解决方法，每次在处理结束插入一个空的关键帧。
        if(frameDataIndex>0){
            var prevFrameData=framesData[frameDataIndex-1];
            if(prevFrameData.tweenType=="motion"){
                if(currentFrameData.startFrame>prevFrameData.startFrame+prevFrameData.duration){

                    //fl.trace("remove ["+layerObj.name+"] from:"+(prevFrameData.startFrame+prevFrameData.duration)+"-"+currentFrameData.startFrame);
                    this.timeline.clearFrames(prevFrameData.startFrame+prevFrameData.duration,currentFrameData.startFrame);
                }
            }else{
                if(currentFrameData.startFrame>prevFrameData.startFrame+prevFrameData.continueCount){

                    //fl.trace("remove ["+layerObj.name+"] from:"+(prevFrameData.startFrame+prevFrameData.continueCount)+"-"+currentFrameData.startFrame);
                    this.timeline.clearFrames(prevFrameData.startFrame+prevFrameData.continueCount,currentFrameData.startFrame);
                }
            }
        }
    };

    MovieClip.prototype.placeElement=function(layer,frame,elementName){
        if(!this.lib.selectItem(elementName)){
            fl.trace("can't select element "+elementName);
            return;
        }

        this.timeline.currentLayer=layer;
        this.timeline.currentFrame=frame;

        //check is key frame
        var layerObj=this.timeline.layers[layer];

        if(this.isKeyFrame(layerObj,frame)){
            //clear frame data
            if(this.timeline.layers[layer].frames[frame].elements.length){
                //fl.trace("place element clear frame elements");
                this.clearFrameElements(layer,frame);
            }
        }else{
            //convert to key frame
            //fl.trace("place element convert to blank key frame");
            this.timeline.convertToBlankKeyframes(frame);
        }

        this.lib.addItemToDocument({x:0,y:0});
    };

    MovieClip.prototype.clearFrameElements=function(layerIndex,frameIndex){
        this.timeline.currentLayer=layerIndex;
        this.timeline.currentFrame=frameIndex;
        this.doc.selection=this.timeline.layers[layerIndex].frames[frameIndex].elements;
        this.doc.deleteSelection();
        this.doc.selectNone();
    };

    MovieClip.prototype.cloneObject=function(obj){
        var ret={};
        for(var k in obj){
            ret[k]=obj[k];
        }
        return ret;
    },

    MovieClip.prototype.setElementProperty=function(element,property){
        var doc=this.doc;

        var haveSelected=false;

//        fl.trace("element:"+element);

        if(property.matrix){
            var matrix=property.matrix;
            var width=element.width;
            var height=element.height;

//            var tx=-0.5*matrix.c*height - 0.5*matrix.a*width + matrix.tx*fcaScale;
//            var ty=-0.5*matrix.d*height - 0.5*matrix.b*width + matrix.ty*fcaScale;

            matrix=this.cloneObject(matrix);
//            matrix.tx=tx;
//            matrix.ty=ty;

            matrix.tx*=this.fcaScale;
            matrix.ty*=this.fcaScale;

            element.matrix=matrix;

            doc.selection = [element];
            doc.setTransformationPoint({x:0, y:0});
            haveSelected=true;
        }

        if(typeof(property.alpha)!="undefined" ){
            if(!haveSelected){
                doc.selection=[element];
                haveSelected=true;
            }

            if(property.alpha!=255){
                doc.setInstanceAlpha(Math.round(property.alpha*100/255));
            }
        }

        doc.selectNone();
    };


    MovieClip.prototype.createEventLayers=function(eventLayers,needCreateFirst){
        //create elements layer
        for(var i in eventLayers){
            //first is exists,not need create
            if(i!=0 || needCreateFirst){
                //create layer on top
                this.timeline.addNewLayer();
            }

            //the new is on the top
            this.createEventLayer(0,eventLayers[i]);
        }
    };

    MovieClip.prototype.createEventLayer=function(layerIndex,data){
        var timeline=this.timeline;

        var layerObj=timeline.layers[layerIndex];

        if(data.name.indexOf(EventLayerPrefix)==0){
            layerObj.name=data.name;
        }else{
            layerObj.name=EventLayerPrefix+data.name;
        }

        var frames = data.frames;

        for(var f=0;f<frames.length;++f){
            var frame=frames[f];
            var startFrame=frame.startFrame;
            if(!this.isKeyFrame(layerObj,startFrame)){
                this.timeline.convertToKeyframes(startFrame);
            }

            //设置声音
            var soundItemIndex=this.lib.findItemIndex(frame.soundName);
            if(soundItemIndex!=""){
                layerObj.frames[startFrame].soundLibraryItem=this.lib.items[soundItemIndex];
            }
        }
    };

    MovieClip.prototype.getFrameData=function(){
        //按帧的方式把层中的元素导出
        var timeline=this.timeline;
        var frames=[];
        var layerObj;
        var frameObj;
        var eleData;

        //convert layer tween frame to key frame
        for(var j=0;j<timeline.layerCount;++j){
            layerObj=timeline.layers[j];
            if(!this.isEventLayer(layerObj)){
                timeline.currentLayer=j;
                timeline.currentFrame=0;
                timeline.convertToKeyframes(0,layerObj.frameCount);
            }
        }

        for(var i=0;i<timeline.frameCount;++i){
            //generate base element
            var elements=this.getElementLayerFrameData(i);


            //generate events
            var events=this.getEventLayerFrameData(i);

            frames.push({
                elements:elements,
                events:events
            });
        }
        return frames;
    };

    MovieClip.prototype.getElementLayerFrameData=function(frameIndex){
        //按帧的方式把层中的元素导出
        var timeline=this.timeline;
        var layerObj;
        var frameObj;
        var eleData;

        var elements=[];
        for(var i=0;i<timeline.layerCount;++i){
            layerObj=timeline.layers[i];

            if(!this.isEventLayer(layerObj)) {
                frameObj = layerObj.frames[frameIndex];
                if (frameObj && frameObj.elements.length) {
                    eleData = this.getElementData(frameObj.elements[0]);
                    if (eleData.name == "") {
                        eleData.name = layerObj.name;
                    }
                    elements.push(eleData);
                }
            }
        }

        return elements;
    };

    MovieClip.prototype.getEventLayerFrameData=function(frameIndex){
        //按帧的方式把层中的元素导出
        var timeline=this.timeline;
        var layerObj;
        var frameObj;

        var events=[];
        for(var i=0;i<timeline.layerCount;++i){
            layerObj=timeline.layers[i];

            if(this.isEventLayer(layerObj)) {
                frameObj = layerObj.frames[frameIndex];
                if (frameObj && frameObj.startFrame==frameIndex){
                    switch (this.getEventLayerType(layerObj)){
                        case EventType.Sound:
                            events.push(this.getSoundEventData(frameObj));
                            break;
                        case EventType.AddEffect:
                            break;
                        case EventType.RemoveEffect:
                            break;
                    }
                }
            }
        }
        return events;
    };

    MovieClip.prototype.getElementData=function(element){
        var name=element.libraryItem? yh.Path.basename(element.libraryItem.name):"";
        return {
            matrix:element.matrix,
            alpha:element.colorAlphaPercent,
            name:name
        };
    };

    MovieClip.prototype.getSoundEventData=function(frameObj){
        return {
            type:EventType.Sound,
            arg:frameObj.soundName,
            anchor:{x:0,y:0},
            matrix:{a:1,b:0,c:0,d:1,tx:0,ty:0},
            zOrder:1
        };
    };

    MovieClip.prototype.isKeyFrame=function(layerObject,frameIndex){
        return layerObject.frameCount>frameIndex && layerObject.frames[frameIndex].startFrame==frameIndex;
    };

    MovieClip.prototype.isEventLayer=function(layerObject){
        return layerObject.name.indexOf(EventLayerPrefix)==0;
    };

    MovieClip.prototype.getEventLayerType=function(layerObject){
        var typeName=layerObject.name.replace(EventLayerPrefix,"");
        return EventType[typeName];
    };
})();
