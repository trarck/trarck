/**
 * 由于一个格子可以被多个物体遮挡。
 * 半遮挡加1，全遮挡加16.这样一个格子可以叠加最少15个，最多30个物体的遮挡。通常情况下够用了。
 * @param {Object} o
 */
function Cover (o) {
    this.options=o;
    this._init();
}
Cover.HALF=1;
Cover.FULL=16;
Cover.prototype={
    
	_init:function(){
        this.map=[];
    },
    set:function(mx,my,l,b,h){
        //直接计算遮盖格子法。
        for(var k=1;k<=h;k++){
            //横向半遮挡点
            this._set(mx-k+l,my-k,Cover.HALF);
            //横向全遮挡点
            for(var i=l-1;i>-1;i--){
                this._set(mx-k+i,my-k,Cover.FULL);
            }
            //纵向半遮挡点
            this._set(mx-k,my-k+b,Cover.HALF);
            //纵向全遮挡点
            for(var j=b-1;j>0;j--){
                this._set(mx-k,my-k+j,Cover.FULL);
            }
        }
    },
    _set:function(mx,my,v){
        if(!this.map[my]){
            this.map[my]=[];
        }
        var old=this.map[my][mx];
        //错位叠加遮盖值。全遮挡在高为，半遮挡在低位。
        this.map[my][mx]=old==null?v:v+old;
    },
    remove:function(mx,my,l,b,h){
        //直接计算遮盖格子法。
        for(var k=1;k<=h;k++){
            //横向半遮挡点
            this._remove(mx-k+l,my-k,Cover.HALF);
            //横向全遮挡点
            for(var i=l-1;i>-1;i--){
                this._remove(mx-k+i,my-k,Cover.FULL);
            }
            //纵向半遮挡点
            this._remove(mx-k,my-k+b,Cover.HALF);
            //纵向全遮挡点
            for(var j=b-1;j>0;j--){
                this._remove(mx-k,my-k+j,Cover.FULL);
            }
        }
    },
    _remove:function(mx,my,v){
        if(this.map[my]){
           var old=this.map[my][mx];
           this.map[my][mx]=old==null?old:old-v;
        }
    },
    get:function(mx,my,mz){
        mz=mz||0;
        return this.map[my-mz][mx-mz];
    },
    getMap:function(){
        return this.map;
    },
    isCover:function(mx,my,mz){
        var v=this.get(mx,my,mz);
        return v>0;
    },
    isHalf:function(mx,my,mz){
        var v=this.get(mx,my,mz);
        return v>0 && v<16;
    },
    isFull:function(mx,my,mz){
        var v=this.get(mx,my,mz);
        return v>=16;
    }
}