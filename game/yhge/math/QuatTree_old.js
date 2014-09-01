(function(){
    var QuatNode=yhge.math.QuatNode=function  () {
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
        searchPoint:function  (point) {
            //是否在自身的范围内
            if(point.x>=this._range.left && point.x<=this._range.right && point.y>=this._range.top && point.y<=this._range.bottom){
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
        searchChildrenContainPoint:function  (point) {
            //object in children
            var ret=this.getChildrenContainPoint(point);
    
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
    
                var x=point.x<cx?1:point.x>cx?4:2,
                    y=point.y<cy?8:point.y>cy?32:16;
    
                switch (x+y) {
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
                    result=branches[i].searchChildrenContainPoint(point);
                    ret=result?ret.concat(result):ret;
                }
            }
            return ret;
        },
        getChildrenInRange:function  (range) {
            var ret=[];
            for(var i=0,obj,objRange,l=this._children.length;i<l;i++){
                obj=this._children[i];
                objRange=obj.__range;
                if(objRange.left>=range.left && objRange.right<=range.right && objRange.top>=range.top && objRange.bottom<=range.bottom){
                    ret.push(obj);
                }
            }
            return ret;
        },
        getChildrenContainPoint:function  (point) {
            var ret=[];
            for(var i=0,obj,range,l=this._children.length;i<l;i++){
                obj=this._children[i];
                range=obj.__range;
                if(point.x>=range.left && point.x<=range.right && point.y>=range.top && point.y<=range.bottom){
                    ret.push(obj);
                }
            }
            return ret;
        },
        add:function  (obj) {
            this._children.push(obj);
        },
        remove:function(obj){
            var i=this._children.indexOf(obj);
            if(i>-1){
                this._children.splice(i,1);
            }
        }
    };
    
    var QuatTree=yhge.math.QuatTree=function  () {
        this.initialize.apply(this,arguments);
    };
    
    QuatTree.prototype={
        _root:null,
    
        initialize:function  (rect) {
            var range={
                    left:rect.x,
                    top:rect.y,
                    right:rect.x+rect.width,
                    bottom:rect.y+rect.height};
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
                   this.splitUntilGridSize(node._branches[i],size);
                }
            }
        },
        add:function  (obj) {
            var range=obj.__range;
            if(!range){
                obj.__range=range={
                    left:obj._position.x,
                    top:obj._position.y,
                    right:obj._position.x+obj._width,
                    bottom:obj._position.y+obj._height
                };
            };
            var node=this.search(range);
            if(node){
                node.add(obj);
                obj.__quatTreeParentNode=node;
            }
        },
        remove:function(obj){
            if(obj.__quatTreeParentNode){
                obj.__quatTreeParentNode.remove(obj);
                delete obj.__quatTreeParentNode;
                delete obj.__range;
            }
        },
        search:function  (range) {
            return this._root.search(range);
        },
        searchPoint:function  (point) {
            return this._root.searchPoint(point);
        },
        getObjsInRange:function  (range) {
            //check range
            return this._root.searchChildrenInRange(range);
        },
        getObjsContainPoint:function  (point) {
            return this._root.searchChildrenContainPoint(point);
        }
    };
    
    
    //srcRange是否包含descRange
    function ContainRange(srcRange,descRange) {
        return descRange.left>=srcRange.left && descRange.right<=srcRange.right && descRange.top>=srcRange.top && descRange.bottom<=srcRange.bottom;
    }
    //range是否包含point
    function ContainPoint (range,point) {
        return point.x>=range.left && point.x<=range.right && point.y>=range.top && point.y<=range.bottom;
    }
    
})();