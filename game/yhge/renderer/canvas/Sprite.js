(function  () {
    /**
     * like image
     */
    var Node=yhge.renderer.Node;
    var ISprite=yhge.renderer.Sprite;

    var Sprite=yhge.core.Class([Node,ISprite],{

        classname:"Sprite",

        initialize:function(props){
            ISprite.prototype.initialize.apply(this, arguments);
            Sprite._super_.initialize.apply(this,arguments);
        },
//        draw: function (context) {
//            console.log("draw Sprite");
//            context.drawImage(this._texture,0,0,this._contentSize.width,this._contentSize.height);
//        },
        draw:function  (context) {
            var rect=this._rect;
            if(rect){
                context.drawImage(this._texture,rect.x,rect.y,rect.width,rect.height,0,0,this._contentSize.width,this._contentSize.height);
            }else{
                context.drawImage(this._texture,0,0,this._contentSize.width,this._contentSize.height);
            }
        }
        //sprite 直接支持animation,这样会影响效率
//       draw: function (context) {
//            var texture,rect,width,height;
//            if(this._animation){
//                var frame=this._animation.getCureentFrame(),
//                rect=frame._rect,
//                width=frame.width||this._contentSize.width
//                height=frame.height||this._contentSize.height;
//            }else{
//                texture=this._texture;
//                rect=this._rect;
//                width=this._contentSize.width;
//                height=this._contentSize.height;
//            }
//            
//            if(rect){
//                context.drawImage(frame._texture,
//                    rect.x,rect.y,
//                    rect.width,rect.height,
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
    });
    yhge.renderer.canvas.Sprite=Sprite;
})();