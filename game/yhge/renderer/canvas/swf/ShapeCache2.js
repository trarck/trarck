(function () {
    var Sprite=yhge.renderer.canvas.Sprite;
    var Shape=yhge.renderer.canvas.swf.Shape;

    /**
     * 继承自Sprite。ShapeCache更多显示的是位图。
     * @type {*}
     */
    var ShapeCache=yhge.core.Class(Sprite,{

        classname:"ShapeCache",

        initialize: function(props) {

        },

        draw:function (context) {
            context.drawImage(this._texture,0,0,this.width,this._height);
        },
//        setRecords:function(records) {
//            //由于swf中的records记录的渐变不能直接用于canvas，则要进行处理。不再父类中处理，增加灵活
//            this._records=Path.parseShapeRecords(records);
//            return this;
//        },
        setTexture:function(texture) {
            this._texture = texture;
            return this;
        },
        getTexture:function() {
            return this._texture;
        },
        setUv:function(uv){
            this._uv=uv;
            return this;
        },
        getUv:function(){
            return this._uv;
        },

        worldBoundingRect:function () {
            return this.nodeToWorldTransform().rectApply(0,0,this._width,this._height);
        },

        clone:function () {
            var newShape=ShapeCache._super_.clone.apply(this,arguments);
            newShape._texture=this._texture;
            newShape._uv=this._uv;
            return newShape;
        }
    });

    Shape.createShape=function (context,definition,resMap,config) {
        var shape;
        if(config.usePathScript){
            definition.originalRecords=definition.records;
            var pathScript=Path.pathRecordsToFunction(definition.records,context,resMap);
            delete definition.records;
            shape=new Shape(definition);
            shape.setPathScript(pathScript.func,pathScript.args);
        }else{
            definition.originalRecords=definition.records;
            definition.records=Path.parseShapeRecords(definition.records,context,resMap);
            shape=new Shape(definition);
        }

        return shape;
    };

    yhge.renderer.canvas.swf.Shape=Shape;
    
})();