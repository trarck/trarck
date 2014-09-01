(function  () {
    /**
     * like image
     */
    AnimateSprite=yhge.core.Class(Sprite,{

        classname:"AnimateSprite",

        initialize:function(){
            console.log("init AnimateSprite");
            AnimateSprite._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            console.log("draw AnimateSprite");
            var frame=this._animation.getFrame();
            var rect=frame._rect;
            context.drawImage(this._texture,rect.x,rect.y,rect.width,rect.height,0,0,frame.width,frame.height);
        },
        setTexture:function(texture) {
            this._texture = texture;
            return this;
        },
        getTexture:function() {
            return this._texture;
        },
        setWidth:function(width) {
            this._width = width;
            return this;
        },
        getWidth:function() {
            return this._width;
        },
        setHeight:function(height) {
            this._height = height;
            return this;
        },
        getHeight:function() {
            return this._height;
        },
        setAnimation:function(animation) {
            this._animation = animation;
            return this;
        },
        getAnimation:function() {
            return this._animation;
        }

        
    });
})();