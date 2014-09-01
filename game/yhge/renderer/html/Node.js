(function  ($) {
    var Node=yhge.renderer.Node;

    /**
     * 即时生效。
     * 利用浏览器的渲染时钟，无需一个渲染主循环。
     * 关于transform。由于在画图系统(canvas)中，坐标原点在(0,0)，canvas是左上角，opengl是左下角。
     * 而transform变换都相对于原点进行，即(0,0)点。
     * html中，的transform-origin为物体的中心点，所以再进行旋转，缩放结果和画图系统不一致。
     * 所以把transform-origin设置为(0,0).
     */
    var HTMLNode=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"Node",

        initialize:function(props){
            HTMLNode._super_.initialize.apply(this,arguments);
            this.initView(props);

        },
        setPositionX:function  (x) {
            HTMLNode._super_.setPositionX.apply(this,arguments);
            this.transform();
            return this;
        },
        setPositionY:function  (y) {
            HTMLNode._super_.setPositionY.apply(this,arguments);
            this.transform();
            return this;
        },
        setPosition:function  (x,y) {
            HTMLNode._super_.setPosition.apply(this,arguments);
            this.transform();
            return this;
        },
        setScaleX:function  (x) {
            HTMLNode._super_.setScaleX.apply(this,arguments);
            this.transform();
            return this;
        },
        setScaleY:function  (y) {
            HTMLNode._super_.setScaleY.apply(this,arguments);
            this.transform();
            return this;
        },
        setScale:function  (scaleX,scaleY) {
            HTMLNode._super_.setScale.apply(this,arguments);
            this.transform();
            return this;
        },
        setRotation:function  (rotation) {
            HTMLNode._super_.setRotation.apply(this,arguments);
            this.transform();
            return this;
        },

        setAnchorPoint:function  (x,y) {
            HTMLNode._super_.setAnchorPoint.apply(this,arguments);
            this.transform();
            return this
        },

        setAnchorPointX:function  (x) {
            HTMLNode._super_.setAnchorPointX.apply(this,arguments);
            this.transform();
            return this
        },
        setAnchorPointY:function  (y) {
            HTMLNode._super_.setAnchorPointY.apply(this,arguments);
            this.transform();
            return this
        },

        setTransformMatrix:function(transformMatrix) {
            HTMLNode._super_.setTransformMatrix.apply(this,arguments);
            this.transform();
            return this;
        },

        setContentSize:function(contentSize) {
            HTMLNode._super_.setContentSize.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            this._view.css(this._contentSize);
            return this;
        },

        setWidth:function(width) {
            HTMLNode._super_.setWidth.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            this._view.css({
                width:width
            });
            return this;
        },

        setHeight:function(height) {
            HTMLNode._super_.setHeight.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            this._view.css({
                height:height
            });
            return this;
        },

        setAnchorX:function(x){
            HTMLNode._super_.setAnchorX.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            return this;
        },

        setAnchorY:function(y){
            HTMLNode._super_.setAnchorY.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            return this;
        },

        setAnchor:function(x,y) {
            HTMLNode._super_.setAnchor.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
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
                display:this._visible?this._visibleType:"none"
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

        setRelativeTransformOrigin:function(relativeTransformOrigin) {
            this._isRelativeTransformOrigin = relativeTransformOrigin;
            return this;
        },
        isRelativeTransformOrigin:function() {
            return this._isRelativeTransformOrigin;
        },


        draw:function(context){
//            console.log("node draw:",this._contentSize.width+"px "+this._contentSize.height+"px");
            this._view.css({
                zIndex:this._zOrder,
                opacity:this._opacity,
                display:this._visible?this._visibleType:"none"
            });
            return this;
        },

        /**
         * no save and restore
         * @param context
         */
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
//            console.log(matrix.a.toFixed(8),matrix.b.toFixed(8),matrix.c.toFixed(8),matrix.d.toFixed(8));
            var matrixCss="matrix("+matrix.a.toFixed(8)+","+matrix.b.toFixed(8)+","+matrix.c.toFixed(8)+","+matrix.d.toFixed(8)+","+matrix.tx+","+matrix.ty+")";
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

        _updateTransformOriginCss:function(){
            if(this._isRelativeTransformOrigin){
                this.setTransformOriginByAnchor(this._anchor);
            }else{
                this._setTransformOriginCss("0 0");
            }
        },

        setTransformOriginByAnchor:function(anchor){
            var originX=anchor.x*100,
                originY=anchor.y*100

            var css=originX+"% "+originY+"%";
            this._setTransformOriginCss(css);
        },

        _setTransformOriginCss:function(css){
            this._view.css({
                transformOrigin:css,
                WebkitTransformOrigin:css,
                MozTransformOrigin:css,
                OTransformOrigin:css
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
            console.log("initView:",this.classname)
            this._view=$('<div/>').addClass(this.classname);
            //关联
            this._view.data("_node_",this);
            this._setTransformOriginCss("0 0");
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
            this._setTransformOriginCss("0 0");
            return this;
        },
        getView:function(){
            return this._view;
        },
        _visibleType:"block"
    },{
       setTransformCss:function(view,transformCss){
            view && view.css({
                transform:transformCss,
                WebkitTransform:transformCss,
                MozTransform:transformCss,
                OTransform:transformCss
            });
        }
    });
    yhge.renderer.html.Node=HTMLNode;
})(jQuery);