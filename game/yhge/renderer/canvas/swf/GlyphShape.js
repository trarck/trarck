(function () {
    var Path=yhge.renderer.canvas.shape.Path;

    var GlyphShape=yhge.core.Class(Path,{

        classname:"GlyphShape",
        

//        draw:function (context) {
//            GlyphShape._super_.draw.call(this,context);
//        },

        clone:function () {
            var newObj=GlyphShape._super_.clone.apply(this,arguments);
            return newObj;
        }
    });

    GlyphShape.create=function (context,definition,resMap,config) {
        var shape=new GlyphShape();
        shape.setAttributes({
            characterId:definition.characterId,
            width:definition.width,
            height:definition.height,
            originOffset:definition.originOffset,
            originalRecords:definition.records
        });
        if(true || config.usePathScript){
            var selfParameter=["path"],selfParameterContent=[shape];
            var pathScript=Path.pathRecordsToFunction(definition.records,context,resMap,selfParameter,selfParameterContent);
            shape.setPathScript(pathScript.func,pathScript.args);
        }else{
            var records=Path.parseShapeRecords(definition.records,context,resMap);
            shape.setRecords(records);
        }

        return shape;
    }

    yhge.renderer.canvas.swf.GlyphShape=GlyphShape;
    
})();