var ConvertFca;
(function (){
var MatrixInterpolation=yh.geom.MatrixInterpolation;

ConvertFca=function(fca,convertMotion){
    this.fca=fca;
    this.convertMotion=convertMotion;
};


ConvertFca.prototype={

    setConvertMotion:function(convertMotion){
        this.convertMotion=convertMotion;
        return this;
    },

    getConvertMotion:function(){
        return this.convertMotion;
    },


    convertActions:function (){
        var ret=[];
        var actions=this.fca.actions;
        for(var i in actions){
            var action=actions[i];
            ret.push(this.convertAction(action));
        }
        return ret;
    },

    convertAction:function (action){
        return {
            name:action.name,
            frameCount:action.frames.length,
            layers:this.convertActionElements(action),
            eventLayers:this.convertActionEvents(action)
        };
    },

    convertActionElements:function (action){
        var characters=this.fca.elements;
        var frames=action.frames;
        var baseLayers=this.makeBaseLayers(action);
        var layers=[];

        //处理element
        for(var i=0;i<baseLayers.length;++i){
            var elementIndex=baseLayers[i];
            var character=characters[elementIndex-1];
            var layer={
                element:character.name,
                frames:[]
            };

            var layerFrame;
            //分离出关键帧
            for(var k=0;k<frames.length;++k){
                var frame=frames[k];
                var ele=this.getElement(frame.elements,baseLayers[i]);
                if(ele){
                    //check the property.now is alpha and matrix;
                    if(layerFrame && this.isFramePropertySame(layerFrame,ele)){
                        ++layerFrame.continueCount;
                    }else{
                        layerFrame={
                            startFrame:k,
                            continueCount:1,
                            alpha:ele.alpha,
                            matrix:ele.matrix
                        };
                        layer.frames.push(layerFrame);
                    }
                }else{
                    //the frame is not visible
                    if(layerFrame){
                        layerFrame=null;
                    }
                }
            }

            //加个开关，是否使用补间
            if(this.convertMotion){
                //关键帧转成补间
                //如果一段连续的关键帧有相同的插值，则可以转换成补间
                var startFrame=-1;
                var prevFrame,nextFrame;
                for(var k=0;k<layer.frames.length-1;++k){
                    layerFrame=layer.frames[k];
                    //如果持续帧大于1，则后面不是关键帧，则不会转成补间。补间在被导出的时候，转成的帧前后值不一样。
                    if(layerFrame.continueCount==1){

                        if(startFrame==-1){
                            startFrame=k;
                            //跳过此帧
                        }else{
                            //补间已经开始
                            prevFrame=layer.frames[k-1];
                            nextFrame=layer.frames[k+1];
                            if(!MatrixInterpolation.haveSameInterpolation(prevFrame.matrix,layerFrame.matrix,nextFrame.matrix)){
                                //补间结束
                                if(k-startFrame>1){
                                    //2个以上才创建
                                    layer.frames[startFrame].tweenType="motion";
                                    layer.frames[startFrame].duration=k-startFrame;
                                }
                                startFrame=k;
                            }
                        }
                        //检查插值
                    }else{
                        //补间结束
                        if(startFrame!=-1){
                            //已经有补间
                            if(k-startFrame>1) {
                                //2个以上才创建
                                layer.frames[startFrame].tweenType = "motion";
                                layer.frames[startFrame].duration = k - startFrame;
                            }

                            startFrame=-1;
                        }
                    }
                }

                //结束处理
                if(startFrame!=-1){
                    var lastFrame=layer.frames.length-1;
                    if(lastFrame-startFrame>1) {
                        //2个以上才创建
                        layer.frames[startFrame].tweenType = "motion";
                        layer.frames[startFrame].duration = lastFrame - startFrame;
                    }
                }

                //删除被补间转换成的关键帧
                for(var k=0;k<layer.frames.length;++k) {
                    layerFrame = layer.frames[k];
                    if(layerFrame.tweenType){
                        //fl.trace("delete from "+(k+1)+" to "+ (k+layerFrame.duration-1));
                        layer.frames.splice(k+1,layerFrame.duration-1);
                    }
                }
            }

            layers.push(layer);
        }

        return layers;
    },

    convertActionEvents:function(action){
        //处理event.按类型分层。同一帧不能有重复的类型。
        var eventLayers=[];

        var eventType;
        var eventLayer;
        var layerFrame;

        var frames=action.frames;
        for(var k=0;k<frames.length;++k){
            var frame=frames[k];
            if(frame.events && frame.events.length){
                for(var j=0;j<frame.events.length;++j){
                    eventType=frame.events[j].type;

                    eventLayer=eventLayers[eventType];
                    //没有则创建
                    if(!eventLayer){
                        eventLayer={
                            name:EventLayerPrefix+EventTypeNames[eventType],
                            frames:[]
                        };

                        eventLayers[eventType]=eventLayer;
                    }

                    switch (eventType){
                        case EventType.Sound:
                            layerFrame={
                                startFrame:k,
                                type:eventType,
                                soundName:frame.events[j].arg
                            };
                            eventLayer.frames.push(layerFrame);
                            break;
                        case EventType.AddEffect:
                            break;
                        case EventType.RemoveEffect:
                            break;
                    }
                }
            }
        }

        //remove the None layer
        if(!eventLayers[EventType.None] || eventLayers[EventType.None].frames.length==0){
            eventLayers.shift();
        }
        return eventLayers;
    },

    isFramePropertySame:function (aFrame,bFrame){
        return aFrame.alpha==bFrame.alpha
            && aFrame.matrix.a==bFrame.matrix.a
            && aFrame.matrix.b==bFrame.matrix.b
            && aFrame.matrix.c==bFrame.matrix.c
            && aFrame.matrix.d==bFrame.matrix.d
            && aFrame.matrix.tx==bFrame.matrix.tx
            && aFrame.matrix.ty==bFrame.matrix.ty;
    },

    getElement:function (elements,index){
        for(var i in elements){
            if(elements[i].index==index){
                return elements[i];
            }
        }

        return null;
    },

    makeBaseLayers:function (action){
        var frames=action.frames;

        var layers=[];

        var before=-1,after=-1;

        for(var k=0;k<frames.length;++k){
            var frame=frames[k];

            for(var i=0;i<frame.elements.length;++i){
                var ele=frame.elements[i];

                //由于layer的顺序是一定的，一旦在某个frame中确定，在其它frame中不会改变。
                //首先确定是否在layer中。
                if(layers.indexOf(ele.index)!=-1){
                    //存在，则不比较
                    continue;
                }

                before=-1;
                after=-1;

                if(i>0){
                    before=frame.elements[i-1].index;
                }

                if(i<frame.elements.length-1){
                    after=frame.elements[i+1].index;
                }

                var pos=this.getPositionOfLayer(before,after,layers);

//			console.log(pos,ele.index);

                if(pos!=-1){
                    //检查是否存在
                    if(layers[pos]!=ele.index){
                        layers.splice(pos,0,ele.index);
                    }
                }else{
                    //console.log("can't find position put to first",action.name,k,i,ele.index);
                    layers.unshift(ele.index);
                }
            }
        }

        return layers;
    },
    getPositionOfLayer:function (before,after,layers){
        if(layers.length==0) return 0;

        var pos=-1;

        if(before!=-1){
            for(var i=0;i<layers.length;++i){
                if(before==layers[i]){
                    pos=i+1;
                    break;
                }
            }
        }

        if(after!=-1){
            for(var i=(pos==-1?0:pos);i<layers.length;++i){
                if(after==layers[i]){
                    pos=i;
                    break;
                }
            }
        }
        return pos;
    }
};
})();