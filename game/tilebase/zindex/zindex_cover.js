/**
 * 遮盖法。
 * 自身        zIndex相同。
 * 覆盖区，y轴方向，左下角的zIndex为定位点的zIndex-1,随着y轴的减少依次减少。x轴方向同y轴方向。
 * 查找时，向下查找一定范围的格子。如果找到zIndex值，定位点的值为，找到点的值减去，找到点和定位点的x，y差值的和。即zIndex-( (x1-x0)+(y1-y0) )
 *         如果未找到，向上查找，找到后是加上两点的x，y差值的和。即zIndex+((x1-x0)+(y1-y0))
 *         如果未ragc，反回默认值。
 * 如果一个运动物体，由于其大小不确定的。需要实时更新其产生的覆盖区的物体的zindex值。
 * 如果一个物体被移出，仅清空所占区的zIndex。
 * 可以优化
 *			 1.移动一个格子判断一次。 
 *			 2.覆盖区的物体的zindex变小再做更新。
 *			 3.设置一个缓冲值比如10，每个所在覆盖区的值都比产生覆盖的单位的zindex小于10。 
 *			 4.覆盖区相对于产生覆盖的单位的zIndex值，按x,y偏移量算覆盖区的zIndex大小。
 * @param {Object} o
 */
function ZIndex (o) {
    this.options=o;
    this._init();
}

ZIndex.prototype={
	/**
	 * 默认的zIndex值
	 */
    base:0,
	/**
	 * 偏移的搜索值
	 * 通常的值:固定一个值。一般不会有问题。当地图格子多时，一般就不起作用了。
	 * 安全的值:当前格子到地图最下方的格子数。
	 * 有效的值：地图中tile占的最大格子数
	 */
	offset:10,
	_init:function(){
        this.map=[];
    },
	getMap:function(){
        return this.map;
    },
	setMap:function(map){
		this.map=map;
	},
	setBase:function(base){
		this.base=base;
	},
	getBase:function(){
		return this.base;
	},
	setOffset:function(offset){
		this.offset=offset;
	},
	getOffset:function(){
		return this.offset;
	},
	/**
	 * 覆盖部分的zIndex心定位点对齐。
	 * @param {Number} mx
	 * @param {Number} my
	 * @param {Number} l
	 * @param {Number} b
	 * @param {Number} h
	 */
    set:function(mx,my,l,b,h){
        var zIndex=this.get(mx,my,l,b);
		//设置自身
		this.setSelf(mx,my,l,b,zIndex);
		//设置覆盖区
		this.setCover(mx,my,l,b,h,zIndex);
    },
	/**
	 * 所占位置的zIndex值
	 * @param {Number} mx	int
	 * @param {Number} my	int
	 * @param {Number} l	int
	 * @param {Number} b	int
	 * @param {Number} zIndex	int
	 */
	setSelf:function(mx,my,l,b,zIndex){
		for (var j = 0; j < b; j++) {
			for (var i = 0; i < l; i++) {
				this._set(mx + i,my,zIndex);
			}
			my++;
		}
	},
	/**
	 * 
	 * @param {Number} mx	int
	 * @param {Number} my	int
	 * @param {Number} l	int
	 * @param {Number} b	int
	 * @param {Number} h	int
	 * @param {Number} zIndex	int
	 */
	setCover:function(mx,my,l,b,h,zIndex){
		var omx,omy;
		zIndex=zIndex-Math.max(l,b);
        //直接计算被遮盖格子的zIndex值。
        for(var k=1;k<=h;k++){
			zIndex=zIndex-2*k+1;
			omx=mx-k;
			omy=my-k;
            //横向遮挡点
            for(var i=l;i>-1;i--){
                this._set(omx+i,omy,zIndex+i);
            }
            //纵向遮挡点
            for(var j=b;j>0;j--){
                this._set(omx,omy+j,zIndex+j);
            }
        }
	},
    _set:function(mx,my,v){
        if(!this.map[my]){
            this.map[my]=[];
        }
        var old=this.map[my][mx];
        //叠加的zIndex取最小值。注意old为null时与任何的数字比较结果都为false。
        this.map[my][mx]=old<v?old:v;
    },
    remove:function(mx,my,l,b,h){
		//只移出自身所占区域。
		for (var j = 0; j < b; j++) {
			for (var i = 0; i < l; i++) {
				this._remove(mx + i,my);
			}
			my++;
		}
    },
    _remove:function(mx,my){
	   this.map[my]&&this.map[my][mx]=null;
    },
	/**
	 * 突出边--与遮挡边相对的边。
	 * @param {int} mx
	 * @param {int} my
	 * @param {int} l
	 * @param {int} b
	 */
    get:function(mx,my,l,b){
		var zIndex;
		//自身占用格子的zIndex
		zIndex=this.getSelf(mx,my,l,b);
		if(zIndex!=null) return zIndex;
		zIndex=this.getRound(mx,my,l,b);
		if(zIndex) return zIndex;
		return this.base;//未找到，则反回默认值
    },
	getSelf:function(mx,my,l,b){
		var zIndex;
		for (var j = 0; j < b; j++) {
			for (var i = 0; i < l; i++) {
				zIndex = this._get(mx + i,my);
				if (zIndex != null)  return zIndex-(j+i);//加上偏移
			}
			my++;
		}
	},
	getRound:function(mx,my,l,b){
		var omx,omy,min;
		for (var offset = 1; offset < this.offset; offset++) {
			omy=my-offset;
			//上
			for (var i = -offset; i<l+k-1; i++) {
				zIndex = this._get(mx + i, omy);
				if (zIndex != null) {
					zIndex=zIndex-i+offset;
					min = this._min(zIndex, min);
				}
			}
			omx=mx+l;
			//右
			for (var i = -offset; i<b+k-1; i++) {
				zIndex = this._get(omx, my+i);
				if (zIndex != null) {
					zIndex=zIndex-i-l;
					min = this._min(zIndex, min);
				}
			}
			//下
			omy=mx+b;
			for (var i = k-1; i<l+k; i++) {
				zIndex = this._get(mx+i, omy);
				if (zIndex != null) {
					zIndex=zIndex-i-b;
					min = this._min(zIndex, min);
				}
			}
			//左
			omx=mx-offset;
			for (var i = k-1; i<b+k; i++) {
				zIndex = this._get(mx+i, omy);
				if (zIndex != null) {
					zIndex=zIndex-i+offset;
					min = this._min(zIndex, min);
				}
			}
			if(min!=null) return min;
		}
		return null;
	},
	//可以优化
	getDown:function(mx,my,l,b){
		var zIndex,crossZIndex,lineZIndex,omx,omy,mxBase,myBase;
		//则向下偏移搜索。
		for (var offset=1; offset < this.offset; offset++) {
			omx=mx+offset;
			omy=my+offset;
			mxBase=omx+l-1;
			myBase=omy+b-1;
			//对角向下
			//横向
			for (var i = l-1; i >=0; i--) {
				zIndex = this._get(omx + i, myBase);
				crossZIndex=this._min(zIndex,crossZIndex);
			}
			//纵向
			for (var j = b-2; j >=0; j--) {
				zIndex = this._get(mxBase, omy + j);
				crossZIndex=this._min(zIndex,crossZIndex);
			}
			//直线
			zIndex = this._get(omx -1, myBase);
			lineZIndex=this._min(zIndex,lineZIndex);
			zIndex = this._get(mxBase, omy -1);
			lineZIndex=this._min(zIndex,lineZIndex);
			if(crossZIndex!=null || lineZIndex!=null ){
				crossZIndex=crossZIndex==null?crossZIndex:crossZIndex-2*offset;
				lineZIndex=lineZIndex==null?lineZIndex:lineZIndex-offset;
				return this._min(crossZIndex,lineZIndex);
			}
		}
		return null;
	},
	getUp:function(mx,my,l,b){
		var zIndex,crossZIndex,lineZIndex,omx,omy,mxBase,myBase;
		//向上偏移搜索。
		for (var offset=1; offset < this.offset; offset++) {
			omx=mx-offset;
			omy=my-offset;
			mxBase=omx;
			myBase=omy;
			//横向
			for (var i = l-1; i >-1; i--) {
				zIndex = this._get(omx + i, myBase);
				crossZIndex=this._min(zIndex,crossZIndex);
			}
			//纵向
			for (var j = b-1; j >0; j--) {
				zIndex = this._get(mxBase, omy + j);
				crossZIndex=this._min(zIndex,crossZIndex);
			}
			//直线
			zIndex = this._get(omx +l, myBase);
			lineZIndex=this._min(zIndex,lineZIndex);
			zIndex = this._get(mxBase, omy +b);
			lineZIndex=this._min(zIndex,lineZIndex);
			if(crossZIndex!=null || lineZIndex!=null ){
				crossZIndex=crossZIndex==null?crossZIndex:crossZIndex+2*offset;
				lineZIndex=lineZIndex==null?lineZIndex:lineZIndex+offset;
				return this._min(crossZIndex,lineZIndex);
			}
		}
		return null;
	},
	_get:function(mx,my){
		return this.map[my] && this.map[my][mx];
	},
	_min:function(zIndex,min){
//		if(zIndex!=null){
//			min=zIndex>min?min:zIndex;
//		}
//		return min;
		return zIndex==null?min:(zIndex>min?min:zIndex);
	}
	
}