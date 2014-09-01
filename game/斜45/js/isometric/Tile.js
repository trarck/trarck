(function(){
    if(!isometric) isometric={};

	function Tile() {
		this.initialize.apply(this,arguments);
	}

	isometric.Tile=Tile;

	Tile.prototype={
		_size:{x:1,y:1,z:1},//物件大小,长、宽、高。由些计算实行图片的大小和定位点的距离。
		anchor:{left:0,top:0},//原点(对齐点)与左上角的距离。left,top为屏幕坐标值，
									//根据宽、高计算得到 left=y*xUnit,top=z*zUnit  
		x:0,y:0,z:0,//在地图在的坐标。一个z相当于二个Y
		_view:null,//显示tile的dom元素
		initialize:function(o){
			this._size=o.size||this._size;
			this._anchor=o.anchor||this.anchor;
			this._img=o.img;
			
			
			//this.createView();
		},
		setSize:function  (size) {
			if(size instanceof Array){
				size={x:size[0],y:size[1],z:size[2]};
			}
			this._size=size;
			//caculate screen size width,height
		},
		setCoord:function(x,y,z){
			if(y==null){
				y=x.y;
				z=x.z;
				x=x.x;
			}
			this.x=x;
			this.y=y;
			this.z=z;
		},
		render:function(parent){
			this._view=$('<img />').addClass(this.cls).attr("src",this._img).appendTo(parent);
		}
	}
})();    