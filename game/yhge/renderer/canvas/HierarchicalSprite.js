(function  () {
    var AnimateSprite=yhge.renderer.canvas.AnimateSprite;

    var HierarchicalSprite=yhge.core.Class(AnimateSprite,{

        classname:"HierarchicalSprite",

        initialize:function(){
            HierarchicalSprite._super_.initialize.apply(this,arguments);
        },
//        render: function (context) {
//            if (!this._visible) {
//                return;
//            }
//
//            context.save();
//
//            this.transform(context);
//
//            // Set alpha value (global only for now)
//            context.globalAlpha = this._opacity;
//            
//            this.draw(context);
//
//            // Draw child 
//            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
//                this._children[i].render(context);
//            }
//
//            //draw frame
//            this.drawFrame(context);
//
//            context.restore();
//        },
        draw: function (context) {
        	var ele,
                frame=this._animation.getCureentFrame(),
                elements=frame.elements;
            for(var zOrder in elements){
                ele=elements[zOrder];
                //为了保持对像的数量最少，这里把属性的改变保存在frame中。
                //如果内存够大，把每一帧的对象建立一个拷贝，属性变化直接设置到拷贝的对象中。
                ele.transform && ele.character.setTransformMatrix(ele.transform);
                ele.character.render(context);
            }
        }
    });
    yhge.renderer.canvas.HierarchicalSprite=HierarchicalSprite;
})();