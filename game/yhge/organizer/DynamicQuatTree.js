(function(){
    /**
     * QuatNode的children是具体的range，这样与外界具体什么对像解偶，而通过range的一个属性保持到具体对像的引用。
     * TODO
     * QuatNode 分为静态和动态二咱结点。
     */
    var QuatNode=function  () {
        this.initialize.apply(this,arguments);
    };
    QuatNode.prototype={
        _id:0,
        _type:0,//1--node,0-leaf
        _range:null,//{left:0,top:0,right:0,bottom:0},
        _center:null,//{x:0,y:0},
        _parent:null,
        _depth:0,//深度
        _children:null,////直接包含的结点，无法放入子结点中。或叶子结点包含的元素。
        _branches:null,//0--topLeft,1-topRight,2-bottomLeft,3--bottomRight
        
        initialize:function  (range,parent,type) {
            this._range=range;
            this._center={x:(this._range.left+this._range.right)/2,y:(this._range.top+this._range.bottom)/2};
            this._parent=parent;
            this._children=[];
            this._branches=[];
            //this._type=type;
    
            this._depth=parent?parent._depth+1:0;
        },
        setRange:function  (range) {
            this._range=range;
            this._center={x:(this._range.right+this._range.left)/2,y:(this._range.top+this._range.bottom)/2};
        },
        split:function  () {
            var left=this._range.left,
                right=this._range.right,
                center=this._center.x,
                top=this._range.top,
                bottom=this._range.bottom,
                middle=this._center.y;
            
            //top left
            this._branches.push(new QuatNode({left:left,top:top,right:center,bottom:middle},this));
            //top right
            this._branches.push(new QuatNode({left:center,top:top,right:right,bottom:middle},this));
            //bottom left
            this._branches.push(new QuatNode({left:left,top:middle,right:center,bottom:bottom},this));
            //top right
            this._branches.push(new QuatNode({left:center,top:middle,right:right,bottom:bottom},this));
            
            this._type=1;
        },
        splitUntilDepth:function  (depth) {
            if(this._depth<depth){
                this.split();
                for(var i=0,l=this._branches.length;i<l;i++){
                    this._branches[i].splitUntilDepth(depth);
                }
            }
        },
        splitUntilGridSize:function  (size) {
            var width=this._range.right-this._range.left,
                height=this._range.bottom-this._range.top;
    
            if(width>size.width || height>size.height){
                this.split();
                for(var i=0,l=this._branches.length;i<l;i++){
                    this._branches[i].splitUntilGridSize(size);
                }
            }
        },
        //search a node that contains the range
        //查找一个node，可以容纳一个范围
        search:function  (range) {
            //search range
            //是否在自身的范围内
            if(range.left>=this._range.left && range.right<=this._range.right && range.top>=this._range.top && range.bottom<=this._range.bottom){
                //check branche
                
                var result;
                for(var i=0,l=this._branches.length;i<l;i++){
                    result=this._branches[i].search(range);
                    if(result){
                        return result;
                    }
                }
                return this;
            }else{
                return false;
            }
        },
        //search a node that contains the point 
        //查长一个node，可以容纳一个点。通常这个node是叶子结点。如果这个点正好在中心，则为非叶子结点。
        searchPoint:function  (x,y) {
            //是否在自身的范围内
            if(x>=this._range.left && x<=this._range.right && y>=this._range.top && y<=this._range.bottom){
                //check branche
                var result;
                for(var i=0,l=this._branches.length;i<l;i++){
                    result=this._branches[i].searchPoint(range);
                    if(result){
                        return result;
                    }
                }
                return this;
            }else{
                return false;
            }
        },
        searchChildrenInRange:function  (range) {
            //object in children
            var ret=this.getChildrenInRange(range);
    
            //object in branche
            if(this._type){
                //split range
                var mRange=this._range,
                    left=mRange.left,
                    right=mRange.right,
                    top=mRange.top,
                    bottom=mRange.bottom,
                    center=this._center,
                    cx=center.x,
                    cy=center.y;
                
                var result;
                // top left
                if(range.left<cx && range.top<cy){
                    result=this._branches[0].searchChildrenInRange({
                        left:range.left,
                        top:range.top,
                        right:cx,
                        bottom:cy
                    });
                    ret=result?ret.concat(result):ret;
                }
                //top right
                if(range.right>cx && range.top<cy){
                    result=this._branches[1].searchChildrenInRange({
                        left:cx,
                        top:range.top,
                        right:range.right,
                        bottom:cy
                    });
                    ret=result?ret.concat(result):ret;
                }
                //bottom left
                if(range.left<cx && range.bottom>cy){
                    result=this._branches[2].searchChildrenInRange({
                        left:range.left,
                        top:cy,
                        right:cx,
                        bottom:range.bottom
                    });
                    ret=result?ret.concat(result):ret;
                }
                //bottom right
                if(range.right>cx && range.bottom>cy){
                    result=this._branches[3].searchChildrenInRange({
                        left:cx,
                        top:cy,
                        right:range.right,
                        bottom:range.bottom
                    });
                    ret=result?ret.concat(result):ret;
                }
            }
            return ret;
        },
        searchChildrenContainPoint:function  (x,y) {
            //object in children
            var ret=this.getChildrenContainPoint(x,y);
    
            //object in branches
            if(this._type){
                //point in branche
                var mRange=this._range,
                    left=mRange.left,
                    right=mRange.right,
                    top=mRange.top,
                    bottom=mRange.bottom,
                    center=this._center,
                    cx=center.x,
                    cy=center.y;
                
                var branches=[];
    
                var sx=x<cx?1:x>cx?4:2,
                    sy=y<cy?8:y>cy?32:16;
    
                switch (sx+sy) {
                    case 9://top left
                        branches.push(this._branches[0]);
                        break;
                    case 12://top right
                        branches.push(this._branches[1]);
                        break;
                    case 33://bottom left
                        branches.push(this._branches[2]);
                        break;
                    case 36://bottom right
                        branches.push(this._branches[3]);
                        break;
                    case 10://top left|right
                        branches.push(this._branches[0]);
                        branches.push(this._branches[1]);
                        break;
                    case 34://bottom left|right
                        branches.push(this._branches[2]);
                        branches.push(this._branches[3]);
                        break;
                    case 17://top|bottom left
                        branches.push(this._branches[0]);
                        branches.push(this._branches[2]);
                        break;
                    case 20://top|bottom right
                        branches.push(this._branches[1]);
                        branches.push(this._branches[3]);
                        break;
                    case 18:
                    default:
                        branches=this._branches;
                        break;
                }
                var result;
                for(var i=0,l=branches.length;i<l;i++){
                    result=branches[i].searchChildrenContainPoint(x,y);
                    ret=result?ret.concat(result):ret;
                }
            }
            return ret;
        },
        getChildrenInRange:function  (range) {
            var ret=[];
            for(var i=0,obj,objRange,l=this._children.length;i<l;i++){
                objRange=this._children[i];
                if(objRange.left>=range.left && objRange.right<=range.right && objRange.top>=range.top && objRange.bottom<=range.bottom){
                    ret.push(objRange.obj);
                }
            }
            return ret;
        },
        getChildrenContainPoint:function  (x,y) {
            var ret=[];
            for(var i=0,obj,range,l=this._children.length;i<l;i++){
                range=this._children[i];
                if(x>=range.left && x<=range.right && y>=range.top && y<=range.bottom){
                    ret.push(range.obj);
                }
            }
            return ret;
        },
        add:function  (range) {
            this._children.push(range);
        },
        remove:function(range){
            var i=this._children.indexOf(range);
            if(i>-1){
                this._children.splice(i,1);
            }
        }
    };
    
    var QuatTree=function  () {
        this.initialize.apply(this,arguments);
    };
    
    QuatTree.prototype={
        _root:null,
    
        initialize:function  (rect) {
            console.log("init quatree");
            var range={
                    left:rect.x,
                    top:rect.y,
                    right:rect.x+rect.width,
                    bottom:rect.y+rect.height};
           
            this._bounding=range;
            this._root=new QuatNode(range,null);
        },
        build:function  (depth) {
            if(typeof depth=="object"){
                this.splitUntilSize(this._root,depth);
            }else{
                this.splitUntilDepth(this._root,depth);
            }
        },
        splitUntilDepth:function  (node,depth) {
            if(node._depth<depth){
                node.split();
                for(var i=0,l=node._branches.length;i<l;i++){
                    this.splitUntilDepth(node._branches[i],depth);
                }
            }
        },
        splitUntilSize:function  (node,size) {
            var width=node._range.right-node._range.left,
                height=node._range.bottom-node._range.top;
    
            if(width>size.width || height>size.height){
                node.split();
                for(var i=0,l=node._branches.length;i<l;i++){
                   this.splitUntilSize(node._branches[i],size);
                }
            }
        },
        cutBounding:function (bounding) {
            if(bounding.left<this._bounding.right && bounding.right>this._bounding.left && bounding.top<this._bounding.bottom && bounding.bottom>this._bounding.top){
                bounding.left=bounding.left<this._bounding.left?this._bounding.left:bounding.left;
                bounding.right=bounding.right>this._bounding.right?this._bounding.right:bounding.right;
                bounding.top=bounding.top<this._bounding.top?this._bounding.top:bounding.top;
                bounding.bottom=bounding.bottom>this._bounding.bottom?this._bounding.bottom:bounding.bottom;
                return bounding;
            }else{
                return false;
            }
        },
        /**
         * 对于静态语言可以使用hash保存obj与range的对应关系。
         */
        add:function  (obj) {
            var range={
                left:obj._position.x,
                top:obj._position.y,
                right:obj._position.x+obj._width,
                bottom:obj._position.y+obj._height
            };
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
        },
        
        remove:function(obj){
            if(obj.__range){
                obj.__range.parentNode.remove(obj.__range);
                delete obj.__range.obj;
                delete obj.__range;
            }
        },
        search:function  (range) {
            return this._root.search(range);
        },
        searchPoint:function  (x,y) {
            return this._root.searchPoint(x,y);
        },
        getObjsInRange:function  (range) {
            //check range
            return this._root.searchChildrenInRange(range);
        },
        getObjsContainPoint:function  (x,y) {
            return this._root.searchChildrenContainPoint(x,y);
        }
    };
    
    
    //srcRange是否包含descRange
    function ContainRange(srcRange,descRange) {
        return descRange.left>=srcRange.left && descRange.right<=srcRange.right && descRange.top>=srcRange.top && descRange.bottom<=srcRange.bottom;
    }
    //range是否包含point
    function ContainPoint (range,x,y) {
        return x>=range.left && x<=range.right && y>=range.top && y<=range.bottom;
    }
    
    yhge.organizer.QuatNode=QuatNode;
    yhge.organizer.QuatTree=QuatTree;
})();