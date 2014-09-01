(function  () {
    var TransformMatrix=yhge.math.TransformMatrix;
    var geo=yhge.geo;

    var NodeTagInvalid=-1;

    var Dirty={
        ALL:0xFFFF,
        TRANSFORM:1,
        TRANSFORM_INVERSE:2,
        TRANSFORM_ALL:3
    };
    
	var idIndex=1;

    var Node=function  () {
        this.initialize.apply(this,arguments);
    };
    Node.prototype={
        
        classname:"Node",
        
        initialize:function(){
            console.log("init "+this.classname);
            //this._isTransformDirty=true;
            this._dirty=Dirty.ALL;//每位代表一个dirty位

            this._position={x:0,y:0};
            this._scaleX=1;
            this._scaleY=1;
            this._rotation=0;
            this._isRelativeAnchorPoint=true;
            this._anchorPoint={x:0,y:0};
            this._anchor={x:0,y:0};
            this._opacity=1;
            this._visible=true;
            this._zOrder=0;
            this._parent=null;
            this._children=[];
            this._retainCount=0;
            this._contentSize={width:0,height:0};
            this._tag=NodeTagInvalid;
            this._useAnchor=false;
			this._id=idIndex++;
        },
		getId:function(){
			return this._id;
		},
        setPosition:function  (x,y) {
            if(typeof x=="object"){
                y=x.y;
                x=x.x;
            }
            this._position.x=x;
            this._position.y=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getPosition:function  () {
            return this._position;
        },
        setPositionX:function  (x) {
            this._position.x=x;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getPositionX:function () {
            return this._position.x;
        },
        setPositionY:function  (y) {
            this._position.y=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getPositionY:function () {
            return this._position.y;
        },
        setScaleX:function  (x) {
            this._scaleX=x;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getScaleX:function  () {
            return this._scaleX;
        },
        setScaleY:function  (y) {
            this._scaleY=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getScaleY:function  () {
            return this._scaleY;
        },
        //one or two parameters
        setScale:function  (scaleX,scaleY) {
            this._scaleX=scaleX
            this._scaleY=typeof scaleY=="undefined"?scaleX:scaleY;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getScale:function  () {
            return {x:this._scaleX,y:this._scaleY};
        },
        setRotation:function  (rotation) {
            this._rotation=rotation;
            this._dirty|=Dirty.TRANSFORM_ALL;
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
            if(typeof x=="object"){
                y=x.y;
                x=x.x;
            }
            this._anchorPoint.x=x;
            this._anchorPoint.y=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this
        },
        setAnchorPointX:function  (x) {
            this._anchorPoint.x=x;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this
        },
        setAnchorPointY:function  (y) {
            this._anchorPoint.y=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
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
            this._visible=visible;
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
        setTransformMatrix:function(transformMatrix) {
           this._transformMatrix = transformMatrix;
           this._dirty &=~Dirty.TRANSFORM_ALL;
           return this;
        },
        getTransformMatrix:function() {
           return this._transformMatrix;
        },
        
        setTag:function(tag){
           this._tag=tag;
           return this;
        },
        getTag:function(){
            return this._tag;
        },

        setContentSize:function(contentSize) {
            this._contentSize = arguments.length==1?contentSize:{width:arguments[0],height:arguments[1]};
            if(this._useAnchor){
                this.setAnchorPoint(
                    this._anchor.x*this._contentSize.width,
                    this._anchor.y*this._contentSize.height
                );
            }
            return this;
        },
        getContentSize:function() {
            return this._contentSize;
        },
        setWidth:function(width) {
            this._contentSize.width = width;
            if(this._useAnchor){
                this.setAnchorPointX(this._anchor.x*this._contentSize.width);
            }
            return this;
        },
        getWidth:function() {
            return this._contentSize.width;
        },
        setHeight:function(height) {
            this._contentSize.height = height;
            if(this._useAnchor){
                this.setAnchorPointY(this._anchor.y*this._contentSize.height);
            }
            return this;
        },
        getHeight:function() {
            return this._contentSize.height;
        },

        setAnchorX:function(x){
            this._anchor.x=x;
            this._useAnchor=true;
            if(this._contentSize.width>0)
                this.setAnchorPointX(this._anchor.x*this._contentSize.width);
            return this;
        },

        setAnchorY:function(y){
            this._anchor.y=y;
            this._useAnchor=true;
            if(this._contentSize.height>0)
                this.setAnchorPointY(this._anchor.y*this._contentSize.height);
            return this;
        },

        setAnchor:function(x,y) {
            if(typeof x=="object"){
                y=x.y;
                x=x.x;
            }
            this._anchor.x=x;
            this._anchor.y=y;
            this._useAnchor=true;
            this.setAnchorPoint(
                this._anchor.x*this._contentSize.width,
                this._anchor.y*this._contentSize.height
            );
            return this;
        },
        getAnchor:function() {
            return this._anchor;
        },
        getAnchorX:function() {
            return this._anchor.x;
        },
        getAnchorY:function() {
            return this._anchor.y;
        },
		
		// setClip:function(clip) {
		//             this._clip = clip;
		//             return this;
		//         },
		//         getClip:function() {
		//             return this._clip;
		//         },

        draw:function(context){

        },
		
		// drawClip:function(context){
		// 	this._clip && this._clip.draw(context);
		// },
		
		
		//clip添加到children里
		
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
        //先旋转再缩放与先缩放再旋转的图形不一样，而先旋转再缩放符合人们的思考习惯。
        //变化方时的anchorPoint
        //一、用于transform时的中心点。layer,scene等
        //二、满足一外，还是位置的定位点。spite
        //直接使用transform matrix
        transform: function (context) {
            //transform matrix
            var matrix=this.nodeToParentTransform();
            context.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
        },
		// transform: function (context) {
            // // Translate
            // //layer scene _isRelativeAnchorPoint=false
            // if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                // context.translate(Math.round(this._anchorPoint.x), Math.round(this._anchorPoint.y));
            // }
//             
            // if(this._position.x!=0 || this._position.y!=0){
                // //console.log("transform:translate:",this._position.x,this._position.y);
                // context.translate(Math.round(this._position.x), Math.round(this._position.y));
            // }
//             
// 
            // // Rotate 顺时针.坐标原点在左上角，正方向为顺时针;坐标原点在左下角，正方向为逆时针。
            // if(this._rotation!=0){
                // //console.log("transform:rotate:",this._rotation);
                // context.rotate(geo.degreesToRadians(this._rotation));
            // }
            // // Scale
            // if(this._scaleX!=1 || this._scaleY!=1){
                // //console.log("transform:scale:",this._scaleX, this._scaleY);
                // context.scale(this._scaleX, this._scaleY);
            // }
            // //anchor point
            // if (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0) {
                // //console.log("transform:translate:anchor:",this._anchorPoint.x, this._anchorPoint.y);
                // context.translate(Math.round(-this._anchorPoint.x), Math.round(-this._anchorPoint.y));
            // }
        // },
        nodeToParentTransform: function () {
            if (this._dirty & Dirty.TRANSFORM) {

                this._transformMatrix = TransformMatrix.getIdentity();

                if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                    this._transformMatrix.setTranslate(this._anchorPoint.x, this._anchorPoint.y);
                }

                if (this._position.x!=0 || this._position.y!=0) {
                    this._transformMatrix.setTranslate(this._position.x, this._position.y);
                }

                if (this._rotation !== 0) {
                    //保持方向一致。由于canvas坐标原点在左上角，正方向为顺时针。我们的坐标系统和canvas坐标系统一致，所以方向保持一致。如果使用坐标原点在左下角，则此处为负。
                    this._transformMatrix.setRotate(geo.degreesToRadians(this._rotation));
                }
                if (!(this._scaleX == 1 && this._scaleY == 1)) {
                    this._transformMatrix.setScale(this._scaleX, this._scaleY);
                }

                if (this._anchorPoint.x!=0 || this._anchorPoint.y!=0) {
                    this._transformMatrix.setTranslate(-this._anchorPoint.x, -this._anchorPoint.y);
                }
                this._dirty &= ~Dirty.TRANSFORM;
            }

            return this._transformMatrix;
        },

        parentToNodeTransform: function () {
            if(this._dirty & Dirty.TRANSFORM_INVERSE){
                this._inverse=this.nodeToParentTransform().invert();
                this._dirty &= ~Dirty.TRANSFORM_INVERSE;
            }
            return this._inverse;
        },

        nodeToWorldTransform: function () {
            var t = this.nodeToParentTransform().clone();

            var p=this._parent,parentTransform;
            while(p){
                parentTransform=p.nodeToParentTransform();
                if(parentTransform) t = t.concat(parentTransform);
                p=p._parent;
            }
            return t;
        },

        worldToNodeTransform: function () {
            return this.nodeToWorldTransform().invert();
        },
//        screenToLocal: function(x,y){
//            var parent = this._parent;
//            if(!parent) return {x:x,y:y};
//                
//            var location = parent.screenToLocal(x,y);
//            if(!location) return undefined;
//            
//            x = location.x;
//            y = location.y;
//            
//            // Undo translation.
//            var p = this._position;
//            x -= p.x;
//            y -= p.y;
//            
//            // Undo rotation.
//            var r = this._rotation * Math.PI / 180;
//            var cosr = Math.cos(r);
//            var sinr = Math.sin(r);
//            var tx = cosr*x + sinr*y;
//            var ty = -sinr*x + cosr*y;
//            x = tx;
//            y = ty;
//            
//            // Undoe scale.
//            var s = this._scale;
//            x /= s.getX();
//            y /= s.getY();
//            
//            return {x:x,y:y};
//        },
        /**
         * Convert a location within the local coordinate space for this Node  to a location within the screen coordinate
         * space.
         */
//        localToScreen: function(x,y)
//        {
//            // Undoe scale.
//            var s = this._scale;
//            x *= s.x;
//            y *= s.y;
//            
//            // Undoe rotation.
//            var r = -this._rotation * Math.PI / 180;
//            var cosr = Math.cos(r);
//            var sinr = Math.sin(r);
//            var tx = cosr*x + sinr*y;
//            var ty = -sinr*x + cosr*y;
//            x = tx;
//            y = ty;
//            
//            // Undoe translation.
//            var p = this._position;
//            x += p.x;
//            y += p.y;
//            
//            var parent = this._parent;
//            if(!parent) return {x:x,y:y};
//            
//            var location = parent.localToScreen(x,y);
//            if(!location) return undefined;
//            return location;
//        },
        screenToLocal: function(x,y){
            return this.worldToNodeTransform().pointApply(x,y);
        },
        localToScreen: function(x,y){
            return this.nodeToWorldTransform().pointApply(x,y);
        },
        boundingRect:function () {
            return this.nodeToParentTransform().rectApply(0,0,this._contentSize.width,this._contentSize.height);
        },
        worldBoundingRect:function () {
            return this.nodeToWorldTransform().rectApply(0,0,this._contentSize.width,this._contentSize.height);
        },

        setParent:function  (parent) {
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
        addChild: function (child,tag) {
            child._willAddToParent(this);

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
				tag && (child._tag=tag);
                this._children.push(child);
            }

            child._addedToParent(this);
            return this;
        },

        removeChild: function (child) {
            var index = this._children.indexOf(child);
            if(index > -1) {
                child._willRemoveFromParent(this);
                this._children.splice(index, 1);
                child._removedFromParent(this);
            }else{
                throw new Error('removeChild called for a node that is not a child');
            }
            return this;
        },
        _willAddToParent:function(parent){
            if(this._parent)
                this._parent.removeChild(this);
            this._parent = parent;
        },
        _addedToParent:function (parent) {

        },
        _willRemoveFromParent:function (parent) {

        },
        _removedFromParent:function(parent){
            this._parent=null;
        },
        getChildren:function  () {
            return this._children.slice();
        },
        getChildByTag:function(tag){
            if(tag==NodeTagInvalid) return null;

            var children=this._children;
            for(var i=0,l=children.length;i<l;i++){
                if(children[i]._tag==tag) return children;
            }
            return null;
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
        },
        clone:function (newObj) {
            newObj=newObj?newObj:new this.constructor();
            newObj._dirty=this._dirty;
            newObj._position=yhge.core.mixin({},this._position);
            newObj._scaleX=this._scaleX;
            newObj._scaleY=this._scaleY;
            newObj._rotation=this._rotation;
            newObj._isRelativeAnchorPoint=this._isRelativeAnchorPoint;
            newObj._anchorPoint=yhge.core.mixin({},this._anchorPoint);
            newObj._opacity=this._opacity;
            newObj._visible=this._visible;
            newObj._zOrder=this._zOrder;
            newObj._retainCount=this._retainCount;
            newObj._transformMatrix=this._transformMatrix;

            newObj._anchor=yhge.core.mixin({},this._anchor);
            newObj._contentSize=yhge.core.mixin({},this._contentSize);
            return newObj;
        }
    };
    Node.Dirty=Dirty;
    yhge.renderer.Node=Node;
    yhge.renderer.Dirty=Dirty;
})();