(function  () {
    var Sprite=yhge.renderer.canvas.Sprite;

    var AnimateSprite=yhge.core.Class(Sprite,{

        classname:"AnimateSprite",

        initialize:function(){
            AnimateSprite._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            var frame=this._animation.getCureentFrame(),
                rect=frame._rect,
                offset=frame._offset,
                size=frame._size;
            if(rect){
                context.drawImage(frame._texture,
	                    rect.origin.x,rect.origin.y,
	                    rect.size.width,rect.size.height,
	                    offset.x,offset.y,
	                    size.width,size.height);
            }else{
                context.drawImage(frame._texture, offset.x,offset.y,this._contentSize.width,this._contentSize.height);
            }
        },
        setAnimation:function(animation) {
            if(this._animation) this._unregisterAnimation(this._animation);
            this._animation = animation;
            this._registerAnimation(animation);
            return this;
        },
        getAnimation:function() {
            return this._animation;
        },
        //animation 每帧回调的
        setFrame:function(frame){
            this._frame=frame;
            return this;
        },
        //具体游戏现实
        _registerAnimation:function (animation) {
            
        },
        _unregisterAnimation:function (animation) {
            
        }
    });
    yhge.renderer.canvas.AnimateSprite=AnimateSprite;
})();