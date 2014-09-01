(function() {
    Camera= function (){
        this.initialize.apply(this,arguments);
    }
    Camera.prototype={
        initialize: function(o) {
             this._world=o.world;
             this._xMoveable=true;
             this._yMoveable=true;
             this.setSize(o.size);
             this.initRange();
        },
        initRange: function () {
            var worldSize=this._world.getSize();
            var range={minX:0,minY:0,maxX:worldSize.width-this._size.width,maxY:worldSize.height-this._size.height};
            this.setRange(range);
        },
        setRange: function (range) {
            this.minX=range.minX==null?Number.NEGATIVE_INFINITY:range.minX;
            this.minY=range.minY==null?Number.NEGATIVE_INFINITY:range.minY;
            this.maxX=range.maxX==null?Number.POSITIVE_INFINITY:range.maxX;
            this.maxY=range.maxY==null?Number.POSITIVE_INFINITY:range.maxY;
            this._world.setRange({
                minX:-this.maxX,
                minY:-this.maxY,
                maxX:-this.minX,
                maxY:-this.minY
            });
        },
        /**
         * 不含边界
         */
        inSide:function(x,y){
            x=x>this.minX&&x<this.maxX;
            y=y>this.minY&&y<this.maxY;
            return {x:x,y:y};
        },
        /**
         * 含边界
         */
        inRange:function(x,y){
            x=x>=this.minX&&x<=this.maxX;
            y=y>=this.minY&&y<=this.maxY;
            return {x:x,y:y};
        },
        checkRange:function(x,y){
            x=x<this.minX?this.minX:x>this.maxX?this.maxX:x;
            y=y<this.minY?this.minY:y>this.maxY?this.maxY:y;
            return {x:x,y:y};
        },
        setPosition:function(x,y){
            return this._world.setPosition(-x,-y);
        },
        getPosition:function(){
            return {x:-this._world._position.x,y:-this._world._position.y}
        },
        setSize:function(size){
            this._size=size;
            this._gridCount={
                col:size.width/tb.tileWidth,
                row:size.height/tb.tileHeight
            };
            return this;
        },
        getSize:function(){
            return this._size;  
        },
        setGridCount:function(gridCount){
            this._gridCount=gridCount;
            this._size={
                width:gridCount.col*tb.tileWidth,
                height:gridCount.row*tb.tileHeight
            };
            return this;
        },
        getGridCount:function(){
            return this._gridCount;
        },
        setTraceable:function(traceable){
            this._traceable=traceable;
            return this;
        },
        getTraceable:function(){
            return this._traceable;
        },
        setXMoveable:function(moveable){
            this._xMoveable=moveable;
            return this;
        },
        getXMoveable:function(){
            return this._xMoveable;
        },
        setYMoveable:function(moveable){
            this._yMoveable=moveable;
            return this;
        },
        getYMoveable:function(){
            return this._yMoveable;
        },
        
        
        moveTo:function(x,y){
            return this._world.setPosition(-x,-y);
        },
        moveBy:function(x,y){
            var pos=this._world.getPosition();
            return this._world.setPosition(pos.x-x,pos.y-y);
            //return this._world.setPosition(this._xMoveable?pos.x-x:pos.x, this._yMoveable?pos.y-y:pox.y);
        },
        moveWidth:function(paths){
            
        },
        scale:function(x,y){
            this._world.setScale(x,y);
        }
    }
})();