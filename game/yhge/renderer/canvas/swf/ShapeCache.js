(function () {
    var Path=yhge.renderer.canvas.shape.Path;
    var Shape=yhge.renderer.canvas.swf.Shape;

    var MaxScaleSize=2048,MinScaleSize=1;
    /**
     * 继承自Shape。所有使用Shape的地方都可以使用ShapeCache替代
     * @type {*}
     */
    var ShapeCache=yhge.core.Class(Shape,{

        classname:"ShapeCache",

        initialize: function(props) {
            this._cacheScale=1;
            ShapeCache._super_.initialize.apply(this,arguments);
        },

        cache:function(){

            var scale=this._cacheScale;
            var width=this._contentSize.width*scale;
            var height=this._contentSize.height*scale;

            //html dom size can't be too small;
            if(width<MinScaleSize||height<MinScaleSize){
                console.log("less:",width,height);
                scale=1;
                width=this._contentSize.width;
                height=this._contentSize.height
            }
            //parse too big
            if(width>MaxScaleSize||height>MaxScaleSize){
                console.log("big:",width,height);
                console.log("oldscale:",scale);
                if(width>height){
                    scale=MaxScaleSize/this._contentSize.width;
                }else{
                    scale=MaxScaleSize/this._contentSize.height;
                }
                console.log("newscale:",scale);
                width=this._contentSize.width*scale;
                height=this._contentSize.height*scale;
            }



            var canvas=document.createElement("canvas");
            canvas.width=width;
            canvas.height=height;
            var ctx=canvas.getContext("2d");
            //缓存最原始内容，不包括变换和平衡。
            if(scale!=1)
                ctx.scale(scale,scale);
            ctx.translate(-this._originOffset.x,-this._originOffset.y);
            this.draw(ctx);
            this._texture=canvas;
            this.draw=this.drawCache;
//            document.body.appendChild(canvas);
        },

        drawCache:function (context) {
            context.drawImage(this._texture,this._originOffset.x,this._originOffset.y,this._contentSize.width,this._contentSize.height);
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

        setCacheScale:function(cacheScale) {
            this._cacheScale = cacheScale||1;
            return this;
        },
        getCacheScale:function() {
            return this._cacheScale;
        },

        worldBoundingRect:function () {
            return this.nodeToWorldTransform().rectApply(0,0,this._contentSize.width,this._contentSize.height);
        },

        clone:function () {
            var newShape=ShapeCache._super_.clone.apply(this,arguments);
            newShape._texture=this._texture;
            newShape._uv=this._uv;
            return newShape;
        },
        addColorTransform:function (colorTransform, context, resMap, config) {
            //TODO 支持缓存
            return ShapeCache._super_.addColorTransform.apply(this,arguments);
        },
        toColorTransformShape:function(colorTransform,context,resMap,config){
            var records=Path.applyColorTransform(this._originalRecords,colorTransform);

            var definition={
                characterId:this._characterId,
                width:this._contentSize.width,
                height:this._contentSize.height,
                originOffset:this._originOffset,
                records:records
            };
            return ShapeCache.createShape(context,definition,resMap,config);
        },
        toColorTransformShape2:function(colorTransform,context,resMap,config){
            var texture=this._texture;
            var ctx=texture.getContext("2d");
            var imageData = ctx.getImageData(0, 0, texture.width, texture.height);
            var data=imageData.data;

            var outImageData=ctx.createImageData(texture.width,texture.height);
            var outData=outImageData.data;

            var x, y,offset,color;
            for(y = 0; y < imageData.height; y += 1) {
                for(x = 0; x < imageData.width; x += 1) {
                    offset = x * 4 + y * 4 * imageData.width;
                    color={
                        r:data[offset],
                        g:data[offset + 1],
                        b:data[offset + 2]
//                        ,
//                        a:data[offset + 3]/255
                    };
                    color=colorTransform.applyColor(color);
                    outData[offset]=color.r;
                    outData[offset + 1]=color.g;
                    outData[offset + 2]=color.b;
                    outData[offset+3]=data[offset+3]
//                    outData[offset + 3]=parseInt(color.a*255);
                }
            }

            var newTexture=document.createElement("canvas");
            newTexture.width=texture.width;
            newTexture.height=texture.height;
            newTexture.getContext("2d").putImageData(outImageData,0,0);

//            document.body.appendChild(newTexture);

            var shape=this.clone();
            shape._texture=newTexture;

            return shape;
        }
    });

    ShapeCache.createShape=function (context,definition,resMap,config) {
        var shape=Shape.createShape.apply(this,arguments);
        shape.setCacheScale(config.quality);
        shape.cache();
        return shape;
    };

    yhge.renderer.canvas.swf.ShapeCache=ShapeCache;
    
})();