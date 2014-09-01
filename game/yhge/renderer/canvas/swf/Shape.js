(function () {
    var Path = yhge.renderer.canvas.shape.Path;
    var ASObject = yhge.renderer.canvas.swf.ASObject;
    var Clip = yhge.renderer.canvas.swf.Clip;

    var Shape = yhge.core.Class([ASObject, Path], {

        classname:"Shape",
        initialize:function (props) {
            this._colorTransformRecords={};
            Shape._super_.initialize.apply(this, arguments);
        },

        draw:function (context) {
            Shape._super_.draw.call(this, context);
            //context.strokeStyle="#F00";
            //context.strokeRect(-this._contentSize.width*this._anchorPoint.x,-this._contentSize.height*this._anchorPoint.y,this._contentSize.width,this._contentSize.height);
        },

        clone:function () {
            var newObj = Shape._super_.clone.apply(this, arguments);
            newObj._characterId = this._characterId;
            newObj._colorTransformRecords=this._colorTransformRecords;
            return newObj;
        },
        toClip:function (context,clipDepth) {
            var records = this._originalRecords;
            var newRecords = [];
            var record;
            for (var i = 0, l = records.length; i < l; i++) {
                record = records[i];
                switch (record[0]) {
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
            var clip = new Clip();
            clip._contentSize.width = this._contentSize.width;
            clip._contentSize.height = this._contentSize.height;

            if (this._pathFunc) {
                var pathScript = Path.pathRecordsToFunction(newRecords, context);
                clip.setPathScript(pathScript.func, pathScript.args);
            } else {
                clip.setRecords(newRecords);
            }
            clip.setShape(this);
			clip.setClipDepth(clipDepth);
            return clip;
        },
        setColorTransformKey:function (cxformKey) {

            if(this._lastCxformKey==cxformKey) return;
            
            this._lastCxformKey=cxformKey;

            if(this._drawPathType==Path.DrawPathType.Normal){
                this._records = this._colorTransformRecords[cxformKey];
            }else if(this._drawPathType==Path.DrawPathType.Script){
                var pathScript=this._colorTransformRecords[cxformKey]
                this._pathFunc = pathScript.func;
                this._pathFuncArgs = pathScript.args;
            }
        },
        createColorTransformKey:function(colorTransorm){
            return "cxform_"
                    +colorTransorm.redMultiplier+"_"+colorTransorm.redOffset+"_"
                    +colorTransorm.greenMultiplier+"_"+colorTransorm.greenOffset+"_"
                    +colorTransorm.blueMultiplier+"_"+colorTransorm.blueOffset;
        },
        
        addColorTransform:function (colorTransform, context, resMap, config) {
            //TODO check is identity
            var cxformKey=this.createColorTransformKey(colorTransform);
            if(this._colorTransformRecords[cxformKey]) return cxformKey;

            var records = Path.applyColorTransform(this._originalRecords, colorTransform);
            if (config.usePathScript) {
                var selfParameter = ["path"], selfParameterContent = [this];
                var pathScript = Path.pathRecordsToFunction(records, context, resMap, selfParameter, selfParameterContent);
                this._colorTransformRecords[cxformKey]=pathScript;
            } else {
                this._colorTransformRecords[cxformKey]=Path.parseShapeRecords(records, context, resMap);
            }
            return cxformKey;
        },
        //只对style color进行处理
        toColorTransformShape:function (colorTransform, context, resMap, config) {
            var records = Path.applyColorTransform(this._originalRecords, colorTransform);
            var definition = {
                characterId:this._characterId,
                width:this._contentSize.width,
                height:this._contentSize.height,
                originOffset:this._originOffset,
                records:records
            };
            return Shape.createShape(context, definition, resMap, config);
        }
    });

    Shape.createShape = function (context, definition, resMap, config) {
        var shape = new this();
        shape.setAttributes({
            characterId:definition.characterId,
            width:definition.width,
            height:definition.height,
            originOffset:definition.originOffset,
            originalRecords:definition.records
        });

        if (config.usePathScript) {
            var selfParameter = ["path"], selfParameterContent = [shape];
            var pathScript = Path.pathRecordsToFunction(definition.records, context, resMap, selfParameter, selfParameterContent);
            shape.setPathScript(pathScript.func, pathScript.args);
        } else {
            var records = Path.parseShapeRecords(definition.records, context, resMap);
            shape.setRecords(records);
        }
        return shape;
    };

    yhge.renderer.canvas.swf.Shape = Shape;

})();