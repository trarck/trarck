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
    getMap: function(){
        return this.map;
    },
    setMap: function(map){
        this.map = map;
    },
    setBase: function(base){
        this.base = base;
    },
    getBase: function(){
        return this.base;
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
        } else if (desc.left > src.left) {//desc.right<src.right(内中),desc.right>src.right(外中) 都算中
            //中
            lr = 0;
        } else {
            //左
            lr = -1;
        }
        if (desc.top >= src.bottom) {
            //下
            tb = 1;
        } else if (desc.top >= src.top) {
            //中
            tb = 0;
        } else {
            //上
            tb = -1;
        }
        return lr + tb;
    },
    get: function(mx, my, l, b){
        var desc = {
            left: mx,
            right: mx + l,
            top: my,
            bottom: my + b
        };
        
    },
	insert:function(desc){
		this.lineInsert(desc);
	},
	/**
	 * 线性插入
	 * 插入一个元素的时候，可能会改变原来内容的排列。所以要重新排序。
	 */
	lineInsert:function(desc){
		var src,side,l=this.items.length,maxs=[],mins=[];
		if(l>=0){
			//判断是否小于最大值
			side=this.getSide(this.items[l-1],desc);
			if (side > 0) {
				this.items.push(desc);
			} else {
				for (var i = 0; i <l; i++) {
					src = this.items[i];
					side=this.getSide(this.items[i],desc);
					if(side <0){
						maxs.push(src);
					}else{//等于放在小的位置，否则会出错
						mins.push(src);
					}
				}
				mins.puhs(desc);
				this.items=mins.concat(maxs);
			}
		}else{
			this.items.push(desc);
		}
	},
//    find: function(desc){
//        var src, side;
//        if (this.items.length == 1) {
//            src = this.items[0];
//            side = this.getSide(src, desc);
//			if(side<0){
//				p=0;
//			}else{
//				p=1;
//			} 
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
    _get: function(mx, my){
        return this.map[my] && this.map[my][mx];
    }
}
