(function  ($) {
    var Node=yhge.renderer.Node;

    /**
     * 即时生效。
     * 利用浏览器的渲染时钟，无需一个渲染主循环。
     */
    var HTMLNode=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"HTMLNode",

        initialize:function(props){
            HTMLNode._super_.initialize.apply(this,arguments);
            this.initView(props);
            this.setAttributes(props);
        },
        setPosition:function  (x,y) {
            HTMLNode._super_.setPosition.apply(this,arguments);
            this._view.css({
                left:x,
                top:y
            });
            this._setTransformCss("translate("+x+","+y+")");
            return this;
        },
        setScaleX:function  (x) {
            HTMLNode._super_.setScaleX.apply(this,arguments);
            this._setTransformCss("scaleX("+x+")");
            return this;
        },
        setScaleY:function  (y) {
            HTMLNode._super_.setScaleY.apply(this,arguments);
            this._setTransformCss("scaleY("+y+")");
            return this;
        },
        setScale:function  (scaleX,scaleY) {
            HTMLNode._super_.setScale.apply(this,arguments);
            this._setTransformCss("scale("+scaleX+","+scaleY+")");
            return this;
        },
        setRotation:function  (rotation) {
            HTMLNode._super_.setRotation.apply(this,arguments);
            this._setTransformCss("rotate("+rotation+")");
            return this;
        },
        setOpacity:function  (opacity) {
            HTMLNode._super_.setOpacity.apply(this,arguments);
            this._view.css({
                opacity:this._opacity
            });
            return this;
        },
        setVisible:function  (visible) {
            HTMLNode._super_.setVisible.apply(this,arguments);
            this._view.css({
                display:this._visible?"block":"none"
            });
            return this;
        },
        setZOrder:function  (z) {
            HTMLNode._super_.setZOrder.apply(this,arguments);
            this._view.css({
                zIndex:this._zOrder
            });
            return this;
        },
        draw:function(context){
            this._view.css({
                zIndex:this._zOrder,
                opacity:this._opacity,
                display:this._visible?"block":"none"
            });
            return this;
        },
        render: function (context) {
            if (!this._visible) {
                return this;
            }

            this.transform(context);

            this.draw(context);

            // Draw child
            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
                this._children[i].render(context);
            }
            return this;
        },
        transform: function (context) {
            //transform matrix
            var matrix=this.nodeToParentTransform();
            var matrixCss="matrix("+matrix.a+","+matrix.b+","+matrix.c+","+matrix.d+","+matrix.tx+","+matrix.ty+")";
            this._setTransformCss(matrixCss);
        },
        _setTransformCss:function(funCss){
            this._view.css({
                transform:funCss,
                WebkitTransform:funCss,
                MozTransform:funCss,
                OTransform:funCss
            });
        },
        _addedToParent:function (parent) {
            parent._view.append(this._view);
        },
        _willRemoveFromParent:function (parent) {
            //this._view.remove();
            this._view[0].parentNode.removeChild( this._view[0] )
        },
        initView:function(props){
            this._view=$('<div/>').addClass(this.classname);
            return this;
        },
        setView:function(view){
            if(!view.jquery){
                view=$(view);
            }
            view.addClass(this.classname);
            this._view=view;

            return this;
        },
        getView:function(){
            return this._view;
        }
    });
    yhge.renderer.html.Node=HTMLNode;
})(jQuery);