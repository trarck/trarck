tb.tile.BaseTile=yhge.core.extend(yhge.isometric.Tile, {

    initialize: function  (props) {

        tb.tile.BaseTile._super_.initialize.call(this,props);

        this._view=$('<div />').css({
            position:"absolute",
            background:"url(../images/"+this._path+"/"+this._code+".png) no-repeat 0 -26px",
            zIndex:this.mx+this.my,
            width:this._width,
            height:this._height
        });
    },

    render: function() {
        
    },

    setId: function(id) {
        this._id=id;
        return this;
    },

    getId: function() {
        return this.id;
    },

    setCode: function(code) {
        this._code=code;
        return this;
    },

    getCode: function() {
        return this._code;
    },

    setPath: function(path) {
        this._path=path;
        return this;
    },

    getPath: function() {
        return this._path;
    },

    setPosition: function(x,y) {
        this._positionDirty=true;
        tb.tile.BaseTile._super_.setPosition.call(this,x,y);
       
        this._view.css({
            left:this._position.x,
            top:this._position.y
        });
        return this;
    },
    setOriginalPosition:function(x,y){
        tb.tile.BaseTile._super_.setOriginalPosition.call(this,x,y);
        this._view.css({
            left:this._position.x,
            top:this._position.y
        });
        return this;
    },
    setZIndex: function(zIndex) {
        this._zIndex=zIndex;
        this._view.css("z-index",zIndex);
        return this;
    },

    getZIndex: function() {
        return this._zIndex;
    },

    setCoord: function(x,y,z) {
        tb.tile.BaseTile._super_.setCoord.apply(this,arguments);
        return this.update();;
    },

    setMx: function(x) {
        this.mx=x;
        return this.update();
    },

    getMx: function() {
        if(this._positionDirty) {
            this.positionToCoord();
        }
        return this.mx;
    },

    setMy: function(y) {
        this.my=y;
        return this.update();
    },

    getMy: function() {
        if(this._positionDirty) {
            this.positionToCoord();
        }
        return this.my;
    },

    setMz: function(z) {
        this.mz=z;
        return this.update();
    },

    getMz: function() {
        return this.mz;
    },

    positionToCoord: function() {
        var position=this.getPosition();
        var coord=tb.isoUtil.screenToMapCoord(position.x,position.y+this.mz*tb.unit.z);
        this.mx=coord.x;
        this.my=coord.y;
        this._positionDirty=false;
    },

    update: function() {
        var pos=tb.isoUtil.mapToScreenPosition(this.mx,this.my,this.mz);
        this.setPosition(pos.x,pos.y);
        this._positionDirty=false;
        this.setZIndex(this.mx+this.my);
        return this;
    },

    _path:"",

    _calcOrigin: function(width,height) {
        //return {x:-size.y*tb.unit.x,y:(size.x+size.y)*tb.unit.y-this._width};
        //the tile's size is {x:1,y:1,z:n}.becase this is tile base
        return {
            x:tb.unit.x,
            y:height-2*tb.unit.y
        };
    }

});