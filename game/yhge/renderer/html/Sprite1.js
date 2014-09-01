(function ($) {
    /**
     * like image
     */
    var Node = yhge.renderer.html.Node;
    var ColorPrototype = yhge.renderer.ColorPrototype;
    var TransformMatrix=yhge.math.TransformMatrix;
    var geo=yhge.geo;
    var Dirty=Node.Dirty;


    var Sprite = yhge.core.Class([Node, yhge.core.Accessor, ColorPrototype], {

        classname:"Sprite",

        initialize:function (props) {
            this._color = {r:255, g:255, b:255};
            this._colorString = "rgb(255,255,255)";
            this._flipX = false;
            this._flipY = false;
            Sprite._super_.initialize.apply(this, arguments);
        },

        draw:function (context) {
            Sprite._super_.draw.apply(this, arguments);
//            console.log("sprite draw:",this._anchorPoint.x+"px "+this._anchorPoint.y+"px");
            this._view.css({
                width:this._contentSize.width,
                height:this._contentSize.height,
                backgroundImage:"url(" + this._texture + ")",
                backgroundSize:this._contentSize.width + "px " + this._contentSize.height + "px"
            });
        },

        nodeToParentTransform:function () {
            if (this._dirty & Dirty.TRANSFORM) {

                this._transformMatrix = TransformMatrix.getIdentity();

                if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                    this._transformMatrix.setTranslate(this._anchorPoint.x, this._anchorPoint.y);
                }

                if (this._position.x != 0 || this._position.y != 0) {
                    this._transformMatrix.setTranslate(this._position.x, this._position.y);
                }

                if (this._rotation !== 0) {
                    //保持方向一致。由于canvas坐标原点在左上角，正方向为顺时针。我们的坐标系统和canvas坐标系统一致，所以方向保持一致。如果使用坐标原点在左下角，则此处为负。
                    this._transformMatrix.setRotate(geo.degreesToRadians(this._rotation));
                }

                if(this._flipX || this._flipY){
                    this._transformMatrix.setScale(this._flipX?-this._scaleX:this._scaleX, this._flipY?-this._scaleY:this._scaleY);
                }else if (!(this._scaleX == 1 && this._scaleY == 1)) {
                    this._transformMatrix.setScale(this._scaleX, this._scaleY);
                }

                if (this._anchorPoint.x != 0 || this._anchorPoint.y != 0) {
                    var anchorX=-this._anchorPoint.x;
                    var anchorY=-this._anchorPoint.y;

                    //fix clip anchor
                    if(this._flipX){
                        anchorX=-anchorX;
                        anchorX=anchorX-this._contentSize.width;
                        console.log(this._type,this._texture,anchorX);
                    }

                    if(this._flipY){
                        anchorY=-anchorY;
                        anchorY=anchorY-this._contentSize.height;
                    }
                    this._transformMatrix.setTranslate(anchorX, anchorY);

                }else if(this._flipX||this._flipY){
                    this._transformMatrix.setTranslate(this._flipX?-this._contentSize.width:0, this._flipY?-this._contentSize.height:0);
                }

                this._dirty &= ~Dirty.TRANSFORM;
            }

            return this._transformMatrix;
        },

        setTexture:function (texture) {
            this._texture = texture;
            return this;
        },
        getTexture:function () {
            return this._texture;
        },
        setUv:function (uv) {
            this._uv = uv;
            return this;
        },
        getUv:function () {
            return this._uv;
        },

        setUvs:function (uvs) {
            this._uvs = uvs;

            if (uvs[2] < 0) this._flipX = true;
            if (uvs[3] < 0) this._flipY = true;

            return this;
        },

        getUvs:function () {
            return this._uvs;
        },

        setFlipX:function (flipX) {
            console.log("setFlipX");
            this._flipX = flipX;
            this._dirty|=Dirty.TRANSFORM_ALL;
            this.transform();
            return this;
        },
        getFlipX:function () {
            return this._flipX;
        },

        setFlipY:function (flipY) {
            this._flipY = flipY;
            this._dirty|=Dirty.TRANSFORM_ALL;
            this.transform();
            return this;
        },
        getFlipY:function () {
            return this._flipY;
        },
        setFlip:function(flipX,flipY){
            this._flipX=flipX;
            this._flipY=flipY;
            this._dirty|=Dirty.TRANSFORM_ALL;
            this.transform();
            return this;
        },
        getFlip:function(){
            return {x:this._flipX,y:this._flipY};
        }
    });
    yhge.renderer.html.Sprite = Sprite;
})(jQuery);