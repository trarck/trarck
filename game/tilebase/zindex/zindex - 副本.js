/**
 * 由于一个格子可以被多个物体遮挡。
 * 半遮挡加1，全遮挡加16.这样一个格子可以叠加最少15个，最多30个物体的遮挡。通常情况下够用了。
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
    set:function(mx,my,l,b,h){
        var zIndex=this.get(mx,my,l,b),omx,omy;
        //直接计算被遮盖格子的zIndex值。
        for(var k=1;k<=h;k++){
            zIndex--;
			omx=mx-k;
			omy=my-k;
            //横向遮挡点
            for(var i=l;i>0;i--){
                this._set(omx+i,omy,zIndex);
            }
            //纵向遮挡点
            for(var j=b;j>0;j--){
                this._set(omx,omy+j,zIndex);
            }
			//折点
			this._set(omx,omy,zIndex-k);
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

    },
    _remove:function(mx,my,v){
     
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
		//向下搜索。
		zIndex=this.getDown(mx,my,l,b);
		if(zIndex) return zIndex;
		//向上搜索。
		zIndex=this.getUp(mx,my,l,b);
		if(zIndex) return zIndex;
		return this.base;//未找到，则反回默认值
    },
	getSelf:function(mx,my,l,b){
		var zIndex;
		for (var j = 0; j < b; j++) {
			for (var i = 0; i < l; i++) {
				zIndex = this._get(mx + i,my);
				if (zIndex != null)  return zIndex;
			}
			my++;
		}
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