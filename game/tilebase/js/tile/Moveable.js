tb.tile.Moveable=YH.extend(tb.tile.BaseTile, {

    initialize: function(props) {
        this._direction={x:0,y:0};
        props.direction=props.direction|| {
            x:0,
            y:0
        };
        props.speed=props.speed|| {
            x:8,
            y:4
        };
        tb.tile.Moveable._super_.initialize.call(this,props);
    },

    onmoveend: function() {
    },

    onmove: function() {
        
    },
    setDirection: function(direction) {
        if(this._direction.x==direction.x && this._direction.y==direction.y) return false;
        
        this._direction=direction;
        this._screenDirection=isometric.toScreenDirection(this._direction);
        if(this._view){
            this._directionIndex=isometric.DirectionIndex[direction.y][direction.x];
            var backPositionX=0,
            backPositionY=-this._directionIndex*124-26;
            this._view.css({
                background:"url(images/"+this._path+"/"+this._code+".png) no-repeat "+backPositionX+"px "+backPositionY+"px"
            });
            //console.log("directionIndex:",this._directionIndex,direction);
        }
        //create direction animation
        if(this._moving){
            //animation.play
        }
        return true;
    },
    
    getDirection: function() {
        return this._direction;
    },
   
    setSpeed: function(speed) {
        this._speed=speed;
        return this;
    },

    getSpeed: function() {
        return this._speed;
    },
    setMoveing:function(moving){
        //set animation
        if(moving){
            //animation.paly
        }else{
            //animation.stop
            //animation.gotoFrame(1)
        }
        this._moving=moving;
        return this;
    },
    getMoving:function(){
        return this._moving;
    },
    moveTo: function(x,y,z) {
        this._prepareToMove(x,y,z);
        this._moveNext= function() {
            clearInterval(this._moveTimer);
            this.onmoveend && this.onmoveend();
        };

        this.start();
    },

    movePath: function(paths) {
        var pathIndex=paths.length,path=paths[--pathIndex];

        this._moveNext= function() {
            if(pathIndex>0) {
                path=paths[--pathIndex];
                this._prepareToMove(path.x,path.y,0);
            } else {
                clearInterval(this._moveTimer);
                this._moving=false;
                this.onmoveend && this.onmoveend();
            }
        };

        this._prepareToMove(path.x,path.y,0);
        this.start();
    },

    moveDirection: function(direction) {
        this._directionSeque=[];
        this.setDirection(direction);
        this._prepareToMove(direction.x+this.mx,direction.y+this.my,this.mz,true);
        this._moveNext= function() {
            if(this._directionSeque.length){
                this.setDirection(this._directionSeque.shift()); 
            }
            this._prepareToMove(this._direction.x+this.mx,this._direction.y+this.my,this.mz,true);
        };

        this.start();
    },
    
    addDirection:function(direction){
        this._directionSeque.push(direction);
    },
    
    moveScreenDirection: function(direction) {
        this.setScreenDirection(direction);
        this._prepareToMove(direction.x+this.mx,direction.y+this.my,this.mz,true);
        this._moveNext= function() {
            this._prepareToMove(this._direction.x+this.mx,this._direction.y+this.my,this.mz,true);
        };
        this.start();
    },
    
    start: function() {
        var self=this;
        this._moving=true;
        this._moveTimer=setInterval( function() {
            var now=(new Date()).getTime();
            self._doMove(now-self._lastTime);
            self._lastTime=now;
        },50);

    },

    stop: function(toEnd) {
        clearInterval(this._moveTimer);
        this._moving=false;
        //move to end grid
        if(toEnd) {
            this.moveEnd();
        }
    },
    moveEnd:function(){
        this.setOriginalPosition(this._endPosition.x,this._endPosition.y);
    },
    _prepareToMove: function(x,y,z,hasDirection) {
        z=z==null?this.mz:z;
        y=y==null?this.my:y;
        x=x==null?this.mx:x;
        //console.log("move to:",x,y,z);
        this._end= {
            x:x,
            y:y,
            z:z
        };
        if(!hasDirection){
            this.setDirection(isometric.calcDirection({
                x:this.mx,
                y:this.my
            },this._end));
        }
        this._endPosition=tb.isoUtil.mapToScreenPosition(x,y,z);
        this._endPosition.x-=this._origin.x;
        this._endPosition.y-=this._origin.y;
        if(this._range) {
            var range=this.checkRange(this._endPosition.x,this._endPosition.y);
            this._endPosition.x=range.x;
            this._endPosition.y=range.y;
        }
    },

    _moveNext: function() {

    },

    _doMove: function(delta) {
        var direction=this._screenDirection,
        endPosition=this._endPosition,
        x=this._position.x,
        y=this._position.y,
        sx=this._speed.x*direction.x,
        sy=this._speed.y*direction.y;
        x+=sx;
        y+=sy;
        x=(direction.x>0?x>endPosition.x:x<endPosition.x)?endPosition.x:x;
        y=(direction.y>0?y>endPosition.y:y<endPosition.y)?endPosition.y:y;

        // if(this._range) {
            // var range=this.checkRange(x,y);
            // x=range.x;
            // y=range.y;
        // }
        this.setOriginalPosition(x,y);

        //do move next
        if(x==endPosition.x && y==endPosition.y) {
            this.mx=this._end.x;
            this.my=this._end.y;
            this.mz=this._end.z;
            this._moveNext();
        }
    },

    initRange: function() {
        this._range= {
            minX:tb.camera.minX,
            minY:tb.camera.minY,
            maxX:tb.camera.maxX+tb.camera._size.width-this._width,
            maxY:tb.camera.maxY+tb.camera._size.height-this._height
        };
        this.minX=range.minX;
        this.minY=range.minY;
        this.maxX=range.maxX;
        this.maxY=range.maxY;
    },

    setRange: function (range) {
        range.minX=range.minX==null?Number.NEGATIVE_INFINITY:range.minX;
        range.minY=range.minY==null?Number.NEGATIVE_INFINITY:range.minY;
        range.maxX=range.maxX==null?Number.POSITIVE_INFINITY:range.maxX;
        range.maxY=range.maxY==null?Number.POSITIVE_INFINITY:range.maxY;
        this._range=range;
        this.minX=range.minX;
        this.minY=range.minY;
        this.maxX=range.maxX;
        this.maxY=range.maxY;
    },

    getRange: function() {
        return this._range;
    },

    checkRange: function(x,y) {
        x=x<this.minX?this.minX:x>this.maxX?this.maxX:x;
        y=y<this.minY?this.minY:y>this.maxY?this.maxY:y;
        return {
            x:x,
            y:y
        };
    },

    inRange: function(x,y) {
        x=x>=this.minX&&x<=this.maxX;
        y=y>=this.minY&&y<=this.maxY;
        return {
            x:x,
            y:y
        };
    }

});