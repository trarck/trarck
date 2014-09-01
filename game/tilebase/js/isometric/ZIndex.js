var Core  = require('../../NGCore/Client/Core').Core;

var EventFactory=require('./EventFactory').EventFactory;

var Map=require('./Map').Map;
var Position=require('./Position').Position;

exports.ZIndex=Core.MessageListener.singleton({
    
    classname: 'ZIndex',
    
    base:10,//起始index
    $Type:{
        Static:0,
        Dynamic:1
    },
    initialize: function() {
        
    },

    getItems: function() {
        return this._items;
    },
    reset:function(){
        this._items=[];
        this.statics=[];
        this.dynamics=[];
        Core.UpdateEmitter.addListener(this,this.onUpdate);
    },
    exit:function(){
        Core.UpdateEmitter.removeListener(this);
        //清空排序数据
        this._items=[];
        this.statics=[];
        this.dynamics=[];
    },
    /**
     * desc在src的方向位置
     * @param {Object} src
     * @param {Object} desc
     */
    getSide: function(src, desc){
        var lr, tb;//如果要确切的知道8个方位。上下左右分别用1,4,2,8表示，中还是用0。这样二二之各就可以确定方位。
        if (desc.left >= src.right) {
            //右
            lr = 1;
        }else if(desc.right<=src.left){
            //左
            lr = -1;
        } else  {//desc.right<=src.right && desc.left>=src.left(内中),desc.right>=src.right && desc.left<=src.left(外中) 都算中
            //中
            lr = 0;
        }

        if (desc.top >= src.bottom) {
            //下
            tb = 1;
        } else if (desc.bottom <= src.top) {
            //上
            tb = -1;
        } else {
            //中
            tb = 0;
        }
        return lr + tb;
    },
    //插入一个元素的时候，可能会改变原来内容的序列。所以要重新排序。

    /**
     * 插入排序
     * 插入一个元素的时候，只确定相邻元素的关系还不够，有可能影响其它元素，要对整个数组扫描。
     */
    insertSort:function(rect,rects){
        var src,side,l=rects.length,maxs=[],mins=[],hasMax=false;
        if(l>0){
            //判断是否小于最大值
            side=this.getSide(rects[l-1],rect);
            if (side > 0) {
                rects.push(rect);
            } else {
                //要从小到大依次检查
                for (var i = 0; i <l; i++) {
                    src = rects[i];
                    side=this.getSide(rects[i],rect);

                    switch (side) {
                        case -1:
                        case -2:
                            maxs.push(src);
                            hasMax=true;
                            break;
                        case 1:
                        case 2:
                             mins.push(src);
                             break;
                        case 0:
                            if(hasMax){
                                maxs.push(src);
                            }else{
                                mins.push(src);
                            }
                            break;
                    }
                }
                mins.push(rect);
                rects=mins.concat(maxs);
            }
        }else{
            rects.push(rect);
        }
        return rects;
    },
    insert:function(rect,type){
        switch (type) {
            case this.Type.Static://static
                this.statics=this.insertSort(rect,this.statics);
                break;
            case this.Type.Dynamic://dynamic
            default:
                this.dynamics.push(rect);
                break;
        }
    },
    /**
     * tile的处理方式是按格子的
     */
    insertTile:function(tile,type){
        this.insert(this.updateRectOfTile(tile),type);
    },
    /**
     * node是按地图坐标。比如人物移动时，不是一格一格移动，而是有一定小数点
     */
    insertNode:function(node,l,b,type){
        this.insert(this.updateRect(this.nodeToRect(node,l,b)),type);
    },
    /**
     * 把node当tile处理，对于不是tile子类的兼容方法
     */
    insertNodeTile:function(node,l,b,type){
        this.insert(this.updateRectOfTile(this.nodeToTile(node,l,b)),type);
    },
    nodeToRect: function(node, l, b){
        if(!node.getSize) {
            node._size={x:l,y:b};
            node.getSize=getSize;
        }
        return node;
    },
    nodeToTile: function(node, l, b){
        if(!node.getSize) {
            node._size={x:l,y:b};
            node.getSize=getSize;
        }
        if(!node.getCell){
            node.getCell==getCell;
        }
        return node;
    },
    updateRect:function(rect){
        var position=rect.getPosition().clone(),size=rect.getSize();
        var coord=Position.GridCenterPositionToCoord(position);
        rect.left=coord.getX();
        rect.top=coord.getY();
        rect.right=rect.left+size.x;
        rect.bottom=rect.top+size.y;
        return rect;
    },
    updateRectOfTile:function(rect){
        var cell=rect.getCell(),size=rect.getSize();
        rect.left=cell.getX();
        rect.top=cell.getY();
        rect.right=rect.left+size.x;
        rect.bottom=rect.top+size.y;
        return rect;
    },
    removeStatic:function(node){
        var p=this.statics.indexOf(node);
        if(p>-1){
            this.statics.splice(p,1);
        }
    },
    removeDynamic:function(node){
        var p=this.dynamics.indexOf(node);
        if(p>-1){
            this.dynamics.splice(p,1);
        }
    },
    sort:function  () {
        var items=[];
        //copy static
        for(var i=0,l=this.statics.length;i<l;i++){
            items[i]=this.statics[i];
        }
        //sort dynamics
        for(var i=0,l=this.dynamics.length;i<l;i++){
            items=this.insertSort(this.dynamics[i],items);
        }
        this._itmes=items;
        return items;
    },
    sortStatics:function(){
        var items=[];
        for(var i=0,l=this.statics.length;i<l;i++){
            items=this.insertSort(this.statics[i],items);
        }
        this.statics=items;
        return items;
    },
    onUpdate:function(){
        //update dynamics
        for(var i=0,l=this.dynamics.length;i<l;i++){
            this.dynamics[i]=this.updateRect(this.dynamics[i]);
        }
       // var bt=Core.Time.getRealTime();
        var items=this.sort();
      //  var et=Core.Time.getRealTime();
        // if(!this._label){
            // this._label=new GL2.Text();
            // this._label.setDepth(65535).setFontSize(28).setPosition(100,100).setSize(100,60);
            // GL2.Root.addChild(this._label);
//             
        // }
        // this._label.setText("###:"+(et-bt));
        //update depth
        for(var i=0,l=items.length;i<l;i++){
            items[i].setDepth(i);
        }
    },
});
function getCell(){
    return Position.getCell(this.getPosition());
}
function getSize(){
    return this._size;
}
