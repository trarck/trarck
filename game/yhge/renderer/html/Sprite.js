(function ($) {
    /**
     * like image
     */
    var ColorPrototype = yhge.renderer.ColorPrototype;
    var ISprite = yhge.renderer.Sprite;
    var Node = yhge.renderer.html.Node;
    var TransformMatrix=yhge.math.TransformMatrix;
    var geo=yhge.geo;
    var Dirty=Node.Dirty;


    var Sprite = yhge.core.Class([Node, ISprite], {

        classname:"Sprite",

        initialize:function (props) {
            ISprite.prototype.initialize.apply(this, arguments);
            Sprite._super_.initialize.apply(this, arguments);
        },

        draw:function (context) {
            Sprite._super_.draw.apply(this, arguments);
            
            //如果设置了textureRect,则contentSize和textureRect的大小一致，即Sprite的大小，不用显示设置contentSize。
            //如果没有设置textureRect,则texture的大小为整个Sprite的大小，则设不设置contentSize没有关系。

//            if(this._contentSize && this._contentSize.width!=0 && this._contentSize.height!=0){
//                this._view.css({
//                    width:this._contentSize.width,
//                    height:this._contentSize.height
//                });
//            }

////            else{
////                this._view.css({
////                    overflow:"visible"
////                });
////            }
            if (this._flipX || this._flipY) {
                this.drawFlipCss();
            }

            this.drawTextureSize();

        },

        setTexture:function (texture) {
            texture=!texture.jquery?$(texture):texture;
            this._texture.remove();
            Sprite._super_.setTexture.apply(this, arguments);
            this._view.append(this._texture);
            return this;
        },

        setImageFile:function(file){
            Sprite._super_.setImageFile.apply(this, arguments);
            this._texture.attr("src",file);
        },
        setTextureRect:function(rect){
            Sprite._super_.setTextureRect.apply(this, arguments);
            this.drawTextureSize();
            return this;
        },
        //size 为texture的实际大小。
        setUvs:function (uvs,size) {
            this._uvs = uvs;
            
            var rect={};

            rect.x=uvs[0]*size.width;
            rect.y=uvs[1]*size.height;

            if (uvs[2] < 0){
                rect.width=-uvs[2]*size.width;
                this._flipX = true;
            }else{
                rect.width=uvs[2]*size.width;
            }
            if (uvs[3] < 0) {
                rect.height=-uvs[3]*size.height;
                this._flipY = true;
            }else{
                rect.height=uvs[3]*size.height;
            }
            
            this.setTextureRect(rect);

            return this;
        },

        getUvs:function () {
            return this._uvs;
        },

        setFlipX:function (flipX) {
            this._flipX = flipX;
            this.drawFlipCss();
            return this;
        },
        getFlipX:function () {
            return this._flipX;
        },

        setFlipY:function (flipY) {
            this._flipY = flipY;
            this.drawFlipCss();
            return this;
        },
        getFlipY:function () {
            return this._flipY;
        },

        setFlip:function(flipX,flipY){
            this._flipX=flipX;
            this._flipY=flipY;
            this.drawFlipCss();
            return this;
        },
        getFlip:function(){
            return {x:this._flipX,y:this._flipY};
        },

        setContentSize:function(){
            Sprite._super_.setContentSize.apply(this, arguments);
            this.drawTextureSize();
        },

        drawFlipCss:function(){
            var scaleX=this._flipX?-1:1;
            var scaleY=this._flipY?-1:1;

            var transformCss="scale("+scaleX+","+scaleY+")";
            Sprite.setTransformCss(this._texture,transformCss);
        },

        drawTextureSize:function(){
            //TODO add check dirty
            if(this._rect){
                this._texture.css({
                    left:this._rect.x,
                    top:this._rect.y
                });
                this._view.css({
                    width:this._contentSize.width,
                    height:this._contentSize.height,
                    overflow:"hidden"
                });
            }else{
//                this._view.css("overflow","visible");
//                if(this._contentSize && this._contentSize.width!=0 && this._contentSize.height!=0){
//                    this._texture.css({
//                        width:this._contentSize.width,
//                        height:this._contentSize.height
//                    });
//                }

                if(this._contentSize && this._contentSize.width!=0 && this._contentSize.height!=0){
                    this._view.css({
                        width:this._contentSize.width,
                        height:this._contentSize.height,
                        overflow:"visible"
                    });
                    this._texture.css({
                        width:"100%",
                        height:"100%"
                    });
                }else{
                    this._view.css("overflow","visible");
                }
            }
        },


        initView:function(){
            Sprite._super_.initView.apply(this, arguments);
            this._texture=$('<img/>').appendTo(this._view[0]);
            return this;
        }
    });
    yhge.renderer.html.Sprite = Sprite;
})(jQuery);