(function  () {

    var ColorPrototype = yhge.renderer.ColorPrototype;

    /**
     * Sprite 的接口
     */
    var Sprite=yhge.core.Class([yhge.core.Accessor,ColorPrototype],{

        classname:"Sprite",

        initialize:function(props){
            this._color = {r:255, g:255, b:255};
            this._colorString = "rgb(255,255,255)";
            
            //rect都为正数. texture的显示矩形。
            this._flipX=false;
            this._flipY=false;

        },

        initWithTexture:function(texture,rect){
            this.setTexture(texture);
            rect && this.setTextureRect(rect);
        },
        initWithFile:function(file,rect){
            this.setImageFile(file);
            rect && this.setTextureRect(rect);
        },

        setTexture:function(texture) {
            this._texture = texture;
            return this;
        },
        getTexture:function() {
            return this._texture;
        },

        /**
         * rect都为正数，可以用uvs来扩展rect接口。
         */
        setTextureRect:function(rect){
            this._rect=rect;
            rect && this.setContentSize(rect.width,rect.height);
            return this;
        },
        getTextureRect:function(){
            return this._rect;
        },

        setImageFile:function(file){
            this._imageFilename=file;
            return this;
        },
        getImageFile:function(){
            return this._imageFilename;
        },

        setFlipX:function(flipX) {
            this._flipX = flipX;
            return this;
        },
        isFlipX:function() {
            return this._flipX;
        },
        
        setFlipY:function(flipY) {
            this._flipY = flipY;
            return this;
        },
        isFlipY:function() {
            return this._flipY;
        },
        
        setFlip:function(flipX,flipY){
            this._flipX=flipX;
            this._flipY=flipY;
            return this;
        },
        
        clone:function () {
            var newObj=Sprite._super_.clone.apply(this,arguments);
            newObj._texture=this._texture;
            newObj._rect=this._rect;
            newObj._imageFilename=this._imageFilename;
            return newObj;
        }
    });
    yhge.renderer.Sprite=Sprite;
})();