(function  () {
    /**
     * like image
     */
    var Node=yhge.renderer.canvas.Node;

    var Sprite=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"Sprite",

        initialize:function(props){
            console.log("init Sprite");
            Sprite._super_.initialize.apply(this,arguments);

            this.setAttributes(props);
        },
//        draw: function (context) {
//            console.log("draw Sprite");
//            context.drawImage(this._texture,0,0,this._width,this._height);
//        },
        draw:function  (context) {
            if(this._uv){
                var uv=this._uv;
                context.drawImage(this._texture,uv.x,uv.y,uv.width,uv.height,0,0,this._width,this._height);
            }else{
                context.drawImage(this._texture,0,0,this._width,this._height);
            }
        },
        //sprite 直接支持animation,这样会影响效率
//       draw: function (context) {
//            var texture,uv,width,height;
//            if(this._animation){
//                var frame=this._animation.getCureentFrame(),
//                uv=frame._uv,
//                width=frame.width||this._width
//                height=frame.height||this._height;
//            }else{
//                texture=this._texture;
//                uv=this._uv;
//                width=this._width;
//                height=this._height;
//            }
//            
//            if(uv){
//                context.drawImage(frame._texture,
//                    uv.x,uv.y,
//                    uv.width,uv.height,
//                    0,0,
//                    width,height);
//            }else{
//                context.drawImage(frame._texture,0,0,width,height);
//            }
//        },
//        setAnimation:function(animation) {
//            this._animation = animation;
//            return this;
//        },
//        getAnimation:function() {
//            return this._animation;
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
        }
    });
    yhge.renderer.canvas.Sprite=Sprite;
})();