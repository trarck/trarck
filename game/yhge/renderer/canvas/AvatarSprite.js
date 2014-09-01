(function  () {
    var AnimateSprite=yhge.renderer.canvas.AnimateSprite;

    var AvatarSprite=yhge.core.Class(AnimateSprite,{

        classname:"AvatarSprite",

        initialize:function(){
            AvatarSprite._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
        	var components=this._animation.getCureentFrame();
            var component,rect,offset,size;
        	if(components!=null){
	        	for(var i=0,l=components.length;i<l;i++){
	        		component=components[i],
                    rect=component._rect,
	                offset=component._offset||{x:0,y:0};
                    //TODO transform matrix or radio,scale.translate可以通过offset实现
                    if(component.transform){
                        context.save();
                        context.transform(component.transform.a,component.transform.b,component.transform.c,component.transform.d,component.transform.tx,component.transform.ty);
                        if(rect){
                            size=component._size||{width:this._contentSize.width,height:this._contentSize.height};
                            context.drawImage(component._texture,
                                rect.origin.x,rect.origin.y,
                                rect.size.width,rect.size.height,
                                offset.x,offset.y,
                                size.width,size.height);
                        }else{
                            context.drawImage(component._texture, offset.x,offset.y,this._contentSize.width,this._contentSize.height);
                        }
                        context.restore();
                    }else{
                        if(rect){
                            size=component._size||{width:this._contentSize.width,height:this._contentSize.height};
                            context.drawImage(component._texture,
                                rect.origin.x,rect.origin.y,
                                rect.size.width,rect.size.height,
                                offset.x,offset.y,
                                size.width,size.height);
                        }else{
                            context.drawImage(component._texture, offset.x,offset.y,this._contentSize.width,this._contentSize.height);
                        }
                    }
//		            ctx.drawImage(component._texture,
//	                       rect.origin.x,rect.origin.y,
//		                    rect.size.width,rect.size.height,
//	                        offset.x,offset.y,
//	                        rect.size.width,rect.size.height);
	        	}
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
    yhge.renderer.canvas.AvatarSprite=AvatarSprite;
})();