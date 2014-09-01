(function(){
    var core=yhge.core;
    var QuatNode=yhge.math.QuatNode;
    var QuatTree=yhge.math.QuatTree;

    /**
     * QuatNode的children是具体的range，这样与外界具体什么对像解偶，而通过range的一个属性保持到具体对像的引用。
     */
    var TransformQuatNode=core.Class(QuatNode,{
        
        split:function  () {
            var left=this._range.left,
                right=this._range.right,
                center=this._center.x,
                top=this._range.top,
                bottom=this._range.bottom,
                middle=this._center.y;
            
            //top left
            this._branches.push(new TransformQuatNode({left:left,top:top,right:center,bottom:middle},this));
            //top right
            this._branches.push(new TransformQuatNode({left:center,top:top,right:right,bottom:middle},this));
            //bottom left
            this._branches.push(new TransformQuatNode({left:left,top:middle,right:center,bottom:bottom},this));
            //top right
            this._branches.push(new TransformQuatNode({left:center,top:middle,right:right,bottom:bottom},this));
            
            this._type=1;
        },
        getChildrenInRange:function  (range) {
            var ret=[];
            for(var i=0,obj,objRange,l=this._children.length;i<l;i++){
                obj=this._children[i].obj;
                objRange=obj.worldToNodeTransform().boundingApply(range);
                if(objRange.left<=0 && objRange.right>=obj._width && objRange.top<=0 && objRange.bottom>=obj._height){
                    ret.push(obj);
                }
            }
            return ret;
        },
        getChildrenContainPoint:function  (x,y) {
            var ret=[];
            for(var i=0,obj,p,l=this._children.length;i<l;i++){
                obj=this._children[i].obj;
                p=obj.screenToLocal(x,y);
                if(p.x>=0 && p.x<=obj._width && p.y>=0 && p.y<=obj._height){
                    ret.push(obj);
                }
            }
            return ret;
        }
    });
    
    var TransformQuatTree=core.Class(QuatTree,{
    
        initialize:function  (rect) {
            console.log("init TransformQuatTree");
            var range={
                    left:rect.x,
                    top:rect.y,
                    right:rect.x+rect.width,
                    bottom:rect.y+rect.height};
            this._bounding=range;
            this._root=new TransformQuatNode(range,null);
        },
        
        /**
         * 对于静态语言可以使用hash保存obj与range的对应关系。
         */
        add:function  (obj) {
            var range;
            if(obj.worldBoundingRect){
                var rect=obj.worldBoundingRect();
                range={
                    left:rect.x,
                    top:rect.y,
                    right:rect.x+rect.width,
                    bottom:rect.y+rect.height
                };
            }else{
                range={
                    left:obj._position.x,
                    top:obj._position.y,
                    right:obj._position.x+obj._width,
                    bottom:obj._position.y+obj._height
                };
            }
            range=this.cutBounding(range);
            if(range){
                range.obj=obj;
                var node=this.search(range);
                if(node){
                    node.add(range);
                    range.parentNode=node;
                    obj.__range=range;
                }
            }
        }
    });
    
    
    //srcRange是否包含descRange
    function ContainRange(srcRange,descRange) {
        return descRange.left>=srcRange.left && descRange.right<=srcRange.right && descRange.top>=srcRange.top && descRange.bottom<=srcRange.bottom;
    }
    //range是否包含point
    function ContainPoint (range,x,y) {
        return x>=range.left && x<=range.right && y>=range.top && y<=range.bottom;
    }
    
    yhge.math.TransformQuatNode=TransformQuatNode;
    yhge.math.TransformQuatTree=TransformQuatTree;
})();