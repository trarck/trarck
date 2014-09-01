(function () {
    var Path=yhge.renderer.canvas.shape.Path;
    var ASObject=yhge.renderer.canvas.swf.ASObject;
    var Clip=yhge.renderer.canvas.swf.Clip;

    var Shape=yhge.core.Class([ASObject,Path],{

        classname:"Shape",

        draw:function (context) {
            Shape._super_.draw.call(this,context);
            //context.strokeStyle="#F00";
            //context.strokeRect(-this._contentSize.width*this._anchorPoint.x,-this._contentSize.height*this._anchorPoint.y,this._contentSize.width,this._contentSize.height);
        },
//        setRecords:function(records) {
//            //由于swf中的records记录的渐变不能直接用于canvas，则要进行处理。不再父类中处理，增加灵活
//            this._records=Path.parseShapeRecords(records);
//            return this;
//        },

        clone:function () {
            var newObj=Shape._super_.clone.apply(this,arguments);
            newObj._characterId=this._characterId;
            return newObj;
//            newShape._records=this._records;
//            newShape._contentSize.width=this._contentSize.width;
//            newShape._contentSize.height=this._contentSize.height;
//            newShape._color=this._color;
//            newShape._solid=this._solid;
//            newShape._pathFunc=this._pathFunc;
//            newShape._pathFuncArgs=this._pathFuncArgs;
//            newShape._originalRecords=this._originalRecords;
//            newShape.draw=this.draw;
//            return newShape;
        },
//        renderClip:function(context){
//            if (!this._visible) {
//                return;
//            }
//
//            this.transform(context);
//
//            // Set alpha value (global only for now)
//            context.globalAlpha = this._opacity;
//            
//            this.draw(context);
//
//            // Draw child 
//            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
//                this._children[i].render(context);
//            }
//        },
//        /**
//         * TODO 如果有纯路径的描述记录直接使用
//         * 去除beginPath,fill,stroke,fillStyle,lineStyle
//         * @param context
//         * @param resMap
//         */
//        toClipShape:function(context,resMap){
//            var records=this._originalRecords;
//            var newRecords=[];
//            var record;
//            for(var i= 0,l=records.length;i<l;i++){
//                record=records[i];
//                switch (record[0]){
//                    case "beginPath":
//                    case "fillStyle":
//                    case "lineStyle":
//                    case "fill":
//                    case "stroke":
//                        break;
//                    default :
//                        newRecords.push(record.slice());
//                        break;
//                }
//            }
//            newRecords.unshift(["beginPath"]);
//            newRecords.push(["clip"]);
//            var shape=this.clone();
//            if(this._pathFunc){
//                var pathScript=Path.pathRecordsToFunction(newRecords,context,resMap);
//                shape.setPathScript(pathScript.func,pathScript.args);
//            }else{
//                shape.setRecords(newRecords);
//            }
//            shape.render=shape.renderClip;
//            return shape;
//        }
          toClip:function(context){
            var records=this._originalRecords;
            var newRecords=[];
            var record;
            for(var i= 0,l=records.length;i<l;i++){
                record=records[i];
                switch (record[0]){
                    case "beginPath":
                    case "fillStyle":
                    case "lineStyle":
                    case "fill":
                    case "stroke":
                        break;
                    default :
                        newRecords.push(record.slice());
                        break;
                }
            }
//            newRecords.unshift(["strokeStyle","#F00"]);
            newRecords.unshift(["beginPath"]);
//            newRecords.push(["restore"]);
            newRecords.push(["clip"]);
            var clip=new Clip();
            clip._contentSize.width=this._contentSize.width;
            clip._contentSize.height=this._contentSize.height;
            
            if(this._pathFunc){
                var pathScript=Path.pathRecordsToFunction(newRecords,context);
                clip.setPathScript(pathScript.func,pathScript.args);
            }else{
                clip.setRecords(newRecords);
            }
            clip.setShape(this);
            return clip;
        },
        //只对style color进行处理
        toColorTransformShape:function(colorTransform,context,resMap,config){
            var records=Path.applyColorTransform(this._originalRecords,colorTransform);
            var definition={
                characterId:this._characterId,
                width:this._contentSize.width,
                height:this._contentSize.height,
                originOffset:this._originOffset,
                records:records
            };
            return Shape.createShape(context,definition,resMap,config);
        }
    });

    Shape.createShape=function (context,definition,resMap,config) {
        var shape=new this();
        shape.setAttributes({
            characterId:definition.characterId,
            width:definition.width,
            height:definition.height,
            originOffset:definition.originOffset,
            originalRecords:definition.records
        });

        if(config.usePathScript){
            var selfParameter=["path"],selfParameterContent=[shape];
            var pathScript=Path.pathRecordsToFunction(definition.records,context,resMap,selfParameter,selfParameterContent);
            shape.setPathScript(pathScript.func,pathScript.args);
        }else{
            var records=Path.parseShapeRecords(definition.records,context,resMap);
            shape.setRecords(records);
        }
        return shape;
    };

    yhge.renderer.canvas.swf.Shape=Shape;
    
})();