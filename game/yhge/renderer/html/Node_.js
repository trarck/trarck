(function  ($) {
    var Node=yhge.renderer.Node;

    /**
     * 调用render函数重设置属性。
     * 对于没有改变的属性重复设置。
     * 像background-image这样的属性，重复设置某些浏览器会引起闪烁。
     */
    var HTMLNode=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"HTMLNode",
        
        initialize:function(props){
            HTMLNode._super_.initialize.apply(this,arguments);
            this.initView(props);
//            this.setAttributes(props);
        },
        draw:function(context){
            this._view.css({
                zIndex:this._zOrder,
                opacity:this._opacity,
                display:this._visible?this._visibleType:"none"
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
            this._view.css({
                transform:matrixCss,
                WebkitTransform:matrixCss,
                MozTransform:matrixCss,
                OTransform:matrixCss
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
            //关联
            this._view.data("_node_",this);
            return this;
        },
        setView:function(view){
            if(!view.jquery){
                view=$(view);
            }
            view.addClass(this.classname);
            this._view=view;
            //关联
            this._view.data("_node_",this);
            return this;
        },
        getView:function(){
            return this._view;
        },
        _visibleType:"block"
    });
    yhge.renderer.html.Node=HTMLNode;
})(jQuery);