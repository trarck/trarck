(function  () {
    var TransformMatrix=yhge.math.TransformMatrix;
    var geo=yhge.geo;

    var DIRTY_ALL=255,TRANSFORM_DIRTY=1,INVERSE_DIRTY=2;
    
    var Node=function  () {
        this.initialize.apply(this,arguments);
    };
    Node.prototype={
        initialize:function(){
            //this._isTransformDirty=true;
            this._dirty=DIRTY_ALL;//每位代表一个dirty位

            this._position={x:0,y:0};
            this._scaleX=1;
            this._scaleY=1;
            this._rotation=0;
            this._isRelativeAnchorPoint=true;
            this._anchorPoint={x:0,y:0};
            this._opacity=1;
            this._visible=true;
            this._zOrder=0;
            this._parent=null;
            this._children=[];
            this._retainCount=0;
        },
        setPosition:function  (x,y) {
            x!=null && (this._position.x=x);
            y!=null && (this._position.y=y);
            this._dirty=DIRTY_ALL;
            return this;
        },
        getPosition:function  () {
            return this._position;
        },
        setScaleX:function  (x) {
            this._scaleX=x;
            this._dirty=DIRTY_ALL;
            return this;
        },
        getScaleX:function  () {
            return this._scaleX;
        },
        setScaleY:function  (y) {
            this._scaleY=y;
            this._dirty=DIRTY_ALL;
            return this;
        },
        getScaleY:function  () {
            return this._scaleY;
        },
        //one or two parameters
        setScale:function  (scaleX,scaleY) {
            this._scaleX=scaleX
            this._scaleY=typeof scaleY=="undefined"?scaleX:scaleY;
            this._dirty=DIRTY_ALL;
            return this;
        },
        getScale:function  () {
            return this._scaleX==this._scaleY?this._scaleX:false;
        },
        setRotation:function  (rotation) {
            this._rotation=rotation;
            this._dirty=DIRTY_ALL;
            return this;
        },
        getRotation:function  () {
            return this._rotation;
        },
        setIsRelativeAnchorPoint:function  (isRelativeAnchorPoint) {
            this._isRelativeAnchorPoint=isRelativeAnchorPoint;
            return this;
        },
        getIsRelativeAnchorPoint:function  () {
            return this._isRelativeAnchorPoint;
        },
        setAnchorPoint:function  (x,y) {
            this._anchorPoint.x=x;
            this._anchorPoint.y=y;
            this._dirty=DIRTY_ALL;
            return this
        },
        getAnchorPoint:function  () {
            return this._anchorPoint;
        },
        setOpacity:function  (opacity) {
            this._opacity=opacity;
            return this;
        },
        getOpacity:function  () {
            return this._opacity;
        },
        setVisible:function  (visible) {
            this._visible=true;
            return this;
        },
        getVisible:function  () {
            return this._visible;
        },
        setZOrder:function  (z) {
            this._zOrder=z;
            return this;
        },
        getZOrder:function  () {
            return this._zOrder;
        },
       
        draw:function(context){

        },
        render: function (context) {
            if (!this._visible) {
                return;
            }

            context.save();

            this.transform(context);

            // Set alpha value (global only for now)
            context.globalAlpha = this._opacity;
            
            this.draw(context);

            // Draw child 
            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
                this._children[i].render(context);
            }

            context.restore();
        },
        //在设置变化矩阵的时候，先移动，再旋转，再缩放。
        //变化方时的anchorPoint
        //一、用于transform时的中心点。layer,scene等
        //二、满足一外，还是位置的定位点。spite
        transform: function (context) {
            // Translate
            //layer scene _isRelativeAnchorPoint=false
            if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                context.translate(Math.round(this._anchorPoint.x), Math.round(this._anchorPoint.y));
            }
            
            if(this._position.x!=0 || this._position.y!=0){
                //console.log("transform:translate:",this._position.x,this._position.y);
                context.translate(Math.round(this._position.x), Math.round(this._position.y));
            }
            

            // Rotate 顺时针
            if(this._rotation!=0){
                //console.log("transform:rotate:",this._rotation);
                context.rotate(geo.degreesToRadians(this._rotation));
            }
            // Scale
            if(this._scaleX!=1 || this._scaleY!=1){
                //console.log("transform:scale:",this._scaleX, this._scaleY);
                context.scale(this._scaleX, this._scaleY);
            }
            //anchor point
            if (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0) {
                //console.log("transform:translate:anchor:",this._anchorPoint.x, this._anchorPoint.y);
                context.translate(Math.round(-this._anchorPoint.x), Math.round(-this._anchorPoint.y));
            }
        },

        nodeToParentTransform: function () {
            if (this._dirty & TRANSFORM_DIRTY) {

                this.transformMatrix = TransformMatrix.getIdentity();

                if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                    this.transformMatrix.setTranslate(this._anchorPoint.x, this._anchorPoint.y);
                }

                if (this._position.x!=0 || this._position.y!=0) {
                    this.transformMatrix.setTranslate(this._position.x, this._position.y);
                }

                if (this._rotation !== 0) {
                    //由于canvas是顺时针，公式推导时使用逆时针，所以这里要用负值。
                    this.transformMatrix.setRotate(-geo.degreesToRadians(this._rotation));
                }
                if (!(this._scaleX == 1 && this._scaleY == 1)) {
                    this.transformMatrix.setScale(this._scaleX, this._scaleY);
                }

                if (this._anchorPoint.x!=0 || this._anchorPoint.y!=0) {
                    this.transformMatrix.setTranslate(-this._anchorPoint.x, -this._anchorPoint.y);
                }
                this._dirty &= ~TRANSFORM_DIRTY;
            }

            return this.transformMatrix;
        },

        parentToNodeTransform: function () {
            if(this._dirty & INVERSE_DIRTY){
                this._inverse=this.nodeToParentTransform().invert();
                this._dirty &= ~INVERSE_DIRTY;
            }
            return this._inverse;
        },

        nodeToWorldTransform: function () {
            var t = this.nodeToParentTransform().clone();

            var p=this._parent;
            while(p){
                t = t.concat(p.nodeToParentTransform());
                p=p._parent;
            }
            return t;
        },

        worldToNodeTransform: function () {
            return this.nodeToWorldTransform().invert();
        },
        screenToLocal: function(x,y){
            var parent = this._parent;
            if(!parent) return {x:x,y:y};
                
            var location = parent.screenToLocal(x,y);
            if(!location) return undefined;
            
            x = location.x;
            y = location.y;
            
            // Undo translation.
            var p = this._position;
            x -= p.x;
            y -= p.y;
            
            // Undo rotation.
            var r = this._rotation * Math.PI / 180;
            var cosr = Math.cos(r);
            var sinr = Math.sin(r);
            var tx = cosr*x + sinr*y;
            var ty = -sinr*x + cosr*y;
            x = tx;
            y = ty;
            
            // Undoe scale.
            var s = this._scale;
            x /= s.getX();
            y /= s.getY();
            
            return {x:x,y:y};
        },
//        screenToLocal: function(x,y){
//            var transformMatrix=this.worldToNodeTransform();
//            return transformMatrix.pointApply(x,y);
//        },
        /**
         * Convert a location within the local coordinate space for this Node  to a location within the screen coordinate
         * space.
         */
        localToScreen: function(x,y)
        {
            // Undoe scale.
            var s = this._scale;
            x *= s.x;
            y *= s.y;
            
            // Undoe rotation.
            var r = -this._rotation * Math.PI / 180;
            var cosr = Math.cos(r);
            var sinr = Math.sin(r);
            var tx = cosr*x + sinr*y;
            var ty = -sinr*x + cosr*y;
            x = tx;
            y = ty;
            
            // Undoe translation.
            var p = this._position;
            x += p.x;
            y += p.y;
            
            var parent = this._parent;
            if(!parent) return {x:x,y:y};
            
            var location = parent.localToScreen(x,y);
            if(!location) return undefined;
            return location;
        },
//        localToScreen: function(x,y){
//            var transformMatrix=this.nodeToWorldTransform();
//            return transformMatrix.pointApply(x,y);
//        },
        setParent:function  (parent) {
            if(this._parent)
                this._parent.removeChild(this);
            
            this._parent=parent;
            return this;
        },
        getParent:function(){
            return this._parent;
        },
        /**
         * Add a child Node
         *
         */
        addChild: function (child) {

            var z = child._zOrder;
            var added = false;

            for (var i = 0, childLen = this._children.length; i < childLen; i++) {
                var c = this._children[i];
                if (c._zOrder > z) {
                    added = true;
                    this._children.splice(i, 0, child);
                    break;
                }
            }

            if (!added) {
                this._children.push(child);
            }

            child.setParent(this);
            return this;
        },

        removeChild: function (child) {
            var index = this._children.indexOf(child);
            if(index > -1) {
                this._children.splice(index, 1);  
                child.setParent(null);
            }else{
                throw new Error('removeChild called for a node that is not a child');
            }
            return this;
        },
        getChildren:function  () {
            this._children.slice();
        },
        retain:function  () {
            this._retainCount++;
        },
        release:function  () {
            if(--this._retainCount==0){
                this.destroy();
            }
        },
        destroy:function  () {
            var children = this._children;
            while(children.length)
            {
                this.removeChild(children[0]);
            }
                
            if(this._parent)
            {
                this._parent.removeChild(this);
            }
        }
    };
    yhge.renderer.canvas.Node=Node;
})();