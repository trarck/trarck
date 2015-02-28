

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
        this.createEventLayers(eventLayers,true);
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
        }
    };

    //one layer only on element
    MovieClip.prototype.createElementLayer=function(layerIndex,data){
        var timeline=this.timeline;

        var layerObj=timeline.layers[layerIndex];

        var elementName=data.element;

        layerObj.name=data.name|| yh.Path.basename(elementName);

        var frames = data.frames;

        //place element in first frame
        var firstFrame=frames[0];

        this.placeElement(layerIndex,firstFrame.startFrame,elementName);

//        fl.trace("startFrame:"+firstFrame.startFrame+","+layerObj.frames[firstFrame.startFrame].elements[0]);
        this.setElementProperty(layerObj.frames[firstFrame.startFrame].elements[0],firstFrame);

        //other key frame
        for(var i=1;i<frames.length;++i){
            var frame=frames[i];
            var startFrame=frame.startFrame;
//            fl.trace(layerObj.name+" is key frame["+startFrame+"] "+ (this.isKeyFrame(layerObj,startFrame)?"true":"false"));
            if(!this.isKeyFrame(layerObj,startFrame)){
                //由于一个层的元素是一样的，这里直接使用前一个关键帧的数据。
                this.timeline.convertToKeyframes(startFrame);
            }
//            this.timeline.currentFrame=startFrame;

            //检查element是否为空，可能之前被清空
            if(layerObj.frames[startFrame].elements.length==0){
                this.placeElement(layerIndex,startFrame,elementName);
            }
            //set property
            this.setElementProperty(layerObj.frames[startFrame].elements[0],frame);

            //检查是否是空帧，如果是空帧，则删除
            if(i<frames.length-1){
                var nextFrame=frames[i+1];
                if(nextFrame.startFrame>startFrame+frame.continueCount){
//                    fl.trace("remove ["+layerObj.name+"] from:"+(startFrame+frame.continueCount)+"-"+nextFrame.startFrame);
                    timeline.clearFrames(startFrame+frame.continueCount,nextFrame.startFrame);
                }
            }
        }

        //remove the last not visible frame
        var lastFrame=frames[frames.length-1];
        var removeFrom=lastFrame.startFrame+lastFrame.continueCount;
//        fl.trace("remove ["+layerObj.name+"] from:"+removeFrom+","+lastFrame.startFrame+","+lastFrame.continueCount+",fc:"+layerObj.frameCount);
        if(removeFrom<layerObj.frameCount){
            timeline.removeFrames(removeFrom,layerObj.frameCount);
        }

        //create tween
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
            fl.trace("can't select element "+elementName);
            return;
        }

        this.timeline.currentLayer=layer;
        this.timeline.currentFrame=frame;

        //check is key frame
        var layerObj=this.timeline.layers[layer];

        if(this.isKeyFrame(layerObj,frame)){
            //clear frame data
            this.timeline.clearKeyframes(frame);
        }else{
            //convert to key frame
            this.timeline.convertToBlankKeyframes(frame);
        }

        this.lib.addItemToDocument({x:0,y:0});
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
