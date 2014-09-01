(function () {
    var Path=yhge.renderer.canvas.shape.Path;
    var ASObject=yhge.renderer.canvas.swf.ASObject;

    var Clip=yhge.core.Class([ASObject,Path],{

        classname:"Clip",

        render:function(context){
            if (!this._visible) {
                return;
            }

//            context.save();
            this.transform(context);

            this.draw(context);
            var invertMatrix=this.parentToNodeTransform();
            context.transform(invertMatrix.a,invertMatrix.b,invertMatrix.c,invertMatrix.d,invertMatrix.tx,invertMatrix.ty);
        },
        
        draw:function (context) {
            Clip._super_.draw.call(this,context);
        },

        clone:function () {
            var newObj=Clip._super_.clone.apply(this,arguments);
            newObj._characterId=this._characterId;
            return newObj;
            var newClip=new Clip();
            newClip._records=this._records;
            newClip._pathFunc=this._pathFunc;
            newClip._pathFuncArgs=this._pathFuncArgs;
            return newClip;
        },
        
        setShape:function(shape) {
            this._shape = shape;
            return this;
        },
        getShape:function() {
            return this._shape;
        },

		setClipDepth:function(clipDepth) {
            this._clipDepth = clipDepth;
            return this;
        },
        getClipDepth:function() {
            return this._clipDepth;
        }
        


        
    });

    yhge.renderer.canvas.swf.Clip=Clip;
     
})();