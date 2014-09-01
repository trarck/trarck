function Barrier (o) {
    this.options=o;
    this._init();
}
Barrier.prototype={
    _init:function(){
		this.map=[];
	},
	set:function(mx,my,l,b){
		for(var j=0;j<b;j++){
			for(var i=0;i<l;i++){
                this._set(mx+i,my+j,1);
            }
		}
	},
    clear:function(mx,my,l,b){
        for(var j=0;j<b;j++){
            for(var i=0;i<l;i++){
                this._set(mx+i,my+j,0);
            }
        }
    },
	_set:function(mx,my,v){
		if(!this.map[my]){
			this.map[my]=[];
		}
        this.map[my][mx]=v;
	},
	get:function(mx,my){
		return this.map[my] && this.map[my][mx];
	},
    getMap:function(){
        return this.map;
    }
}