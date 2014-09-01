/**
 *排序法
 *按物体与物体间的8方向(地图坐标)排序。
 *左，左上，上减小方向
 *右，右下，下为增大方向
 *左下，右上为相等方向或为增大。这里使用相等。
 * @param {Object} o config
 */
function ZIndex(o){
    this.options = o;
    this._init();
}

ZIndex.prototype = {
    /**
     * 默认的zIndex值
     */
    base: 0,
    /**
     * 偏移的搜索值
     * 通常的值:固定一个值。一般不会有问题。当地图格子多时，一般就不起作用了。
     * 安全的值:当前格子到地图最下方的格子数。
     * 有效的值：地图中tile占的最大格子数
     */
    offset: 10,
    _init: function(){
        this.map = [];
        this.items = [];
    },
    getItems: function() {
        return this._items;
    },
    get: function(mx, my, l, b){
        return {
            left: mx,
            right: mx + l,
            top: my,
            bottom: my + b
        };
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
    insertSort:function(item,items){
        var src,side,l=items.length,maxs=[],mins=[],hasMax=false;
        if(l>0){
            //判断是否小于最大值
            side=this.getSide(items[l-1],item);
            if (side > 0) {
                items.push(item);
            } else {
                //要从小到大依次检查
                for (var i = 0; i <l; i++) {
                    src = items[i];
                    side=this.getSide(items[i],item);

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
                mins.push(item);
                items=mins.concat(maxs);
            }
        }else{
            items.push(item);
        }
        return items;
    },
    insert:function(item,type){
        switch (type) {
            case 0://static
                this.statics=this.insertSort(item,this.statics);
                break;
            case 1://dynamic
            default:
                this.dynamics.push(item);
                break;
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
    update:function(){
        var items=this.sort();
        for(var i=0,l=items.length;i<l;i++){
            items[i].setDepth(i);
        }
    },
    //    find: function(desc){
    //        var src, side;
    //        if (this.items.length == 1) {
    //            src = this.items[0];
    //            side = this.getSide(src, desc);
    //          if(side<0){
    //              p=0;
    //          }else{
    //              p=1;
    //          }
    //        } else {
    //            var begin = 0, end = this.items.length - 1, p;//取大方向，方便使用splice函数
    //            while (end >=begin) {
    //                p = Math.round((begin + end) / 2);
    //                src = this.items[p];
    //                side = this.getSide(src, desc);
    //                if (side > 0) {
    //                    begin = p+1;
    //                } else if (side < 0) {
    //                    end = p-1;
    //                } else {
    //                    begin = p+1;
    //                }
    //            }
    //        }
    //        return p;
    //    },
}
