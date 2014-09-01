(function  () {
    /**
     * like image
     */
    Sprite=yhge.core.Class(Node,{

        classname:"Sprite",

        initialize:function(){
            console.log("init Sprite");
            Sprite._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            console.log("draw Sprite");
            context.drawImage(this._texture,0,0,this._width,this._height);
        },
        drawSlice:function  (context) {
            console.log("draw Sprite slice");
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
    });
})();