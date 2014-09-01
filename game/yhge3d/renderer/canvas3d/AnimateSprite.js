(function  () {
    var Sprite=yhge.renderer.canvas.Sprite;

    var AnimateSprite=yhge.core.Class(Sprite,{

        classname:"AnimateSprite",

        initialize:function(){
            console.log("init AnimateSprite");
            AnimateSprite._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            var frame=this._animation.getCureentFrame(),
                uv=frame._uv,
                width=frame.width||this._width
                height=frame.height||this._height;
            if(uv){
                context.drawImage(frame._texture,
                    uv.x,uv.y,
                    uv.width,uv.height,
                    0,0,
                    width,height);
            }else{
                context.drawImage(frame._texture,0,0,width,height);
            }
        },
        setAnimation:function(animation) {
            this._animation = animation;
            return this;
        },
        getAnimation:function() {
            return this._animation;
        }
    });
    yhge.renderer.canvas.AnimateSprite=AnimateSprite;
})();