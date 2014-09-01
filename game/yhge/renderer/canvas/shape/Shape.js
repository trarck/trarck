(function  () {
    var Node=yhge.renderer.Node;
    var ColorPrototype=yhge.renderer.ColorPrototype;

    var Shape=yhge.core.Class([Node,ColorPrototype,yhge.core.Accessor],{
        /**
         * width
           height
           color
         */
        classname:"Shape",

        initialize:function(props){
            this._anchor={x:0,y:0};
            this._colorObject={};
            this._color={r:0,g:0,b:0};
            this._colorString="rgb(0,0,0)";
            //实际画面的起点像对坐标原点的位置。
            this._originOffset={x:0,y:0};
            Shape._super_.initialize.apply(this,arguments);
            //TODO  取消在库中的类使用setAttributes，如果子类再调用setAttributes则会执行二次
            this.setAttributes(props);
        },
        clone:function () {
            var newObj=Shape._super_.clone.apply(this,arguments);
            newObj._color=this._color;
            newObj._colorString=this._colorString;
            newObj._solid=this._solid;
            newObj._originOffset=this._originOffset;
            return newObj;
        },

        setSolid:function(solid) {
            this._solid = solid;
            return this;
        },
        getSolid:function() {
            return this._solid;
        },
        
        setOriginOffset:function(originOffset) {
            this._originOffset = originOffset;
            return this;
        },
        getOriginOffset:function() {
            return this._originOffset;
        },
        worldBoundingRect:function () {
            return this.nodeToWorldTransform().rectApply(this._originOffset.x,this._originOffset.y,this._contentSize.width,this._contentSize.height);
        }
    });

    yhge.renderer.canvas.shape.Shape=Shape;
})();