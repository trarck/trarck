(function(){
    if(typeof isometric=="undefined") isometric={};

	function Tile() {
		this.initialize.apply(this,arguments);
	}

	isometric.Tile=Tile;

	Tile.prototype={
		_size:{x:1,y:1,z:1},//物件大小,长、宽、高。占用的地图坐标。
		_width:0,_height:0,//显示的大小。屏幕坐标。
		_offset:{x:0,y:0},//显示点(坐标点)与定位点(左上角)的距离。x,y为屏幕坐标值，
									//根据宽、高计算得到 left=size.y*xUnit,top=size.z*zUnit  
        _origin:{x:0,y:0},//显示原点
		mx:0,my:0,mz:0,//在地图上的坐标。直接读取不需要get，set方法。
		
		initialize:function(props){
			this.setAttributes(props);
			//this.createView();
		},
		setSize:function  (size) {
			if(size instanceof Array){
				size={x:size[0],y:size[1],z:size[2]};
			}
			this._size=size;
			//caculate screen size width,height
		},
		getSize:function(){
		    return this._size;  
		},
		setCoord:function(x,y,z){
			if(y==null){
				y=x.y;
				z=x.z;
				x=x.x;
			}
			this.mx=x;
			this.my=y;
			this.mz=z||0;
		},
		setWidth:function(width){
		    this._width=width;
		    return this;
		},
		getWidth:function(){
            return this._width;
        },
        setHeight:function(height){
            this._height=height;
            return this;
        },
        getHeight:function(){
            return this._height;
        },
        setOrigin:function(origin){
            this._origin=origin;
            return this;
        },
        getOrigin:function(){
            return this._origin;
        },
        setOffset:function(offset){
            this._origin.x=-offset.x;
            this._origin.y=-offset.y;
            return this;
        },
        getOffset:function(){
            return {x:-this._offset.x,y:-this._offset.y};
        },
		setPosition:function(x,y){
            x-=this._origin.x;
            y-=this._origin.y;
            this._position={x:x,y:y};
            return this;
        },
		getPosition:function(){
            var x=this._position.x+this._origin.x;
            var y=this._position.y+this._origin.y;
            return {x:x,y:y};
        },
        setOriginalPosition:function(x,y){
            this._position={x:x,y:y};
            return this;
        },
        getOriginalPosition:function(){
            return this._position;
        },
        render:function(parent){},
	};	
	YH.accessor.mixinTo(Tile);
})();    