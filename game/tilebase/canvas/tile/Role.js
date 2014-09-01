tb.tile.Role=YH.extend(tb.tile.Moveable, {

    initialize: function(props) {
        props.origin=props.origin||this._calcOrigin(props.width,props.height);
        tb.tile.Role._super_.initialize.call(this,props);
        this.initTraceRange();
    },
    
    initTraceRange: function() {
        var cameraHalfWidth=tb.camera._size.width/2,
        cameraHalfHeight=tb.camera._size.height/2;
        this._traceRange= {
            minX:tb.camera.minX+cameraHalfWidth-this._origin.x,
            minY:tb.camera.minY+cameraHalfHeight-this._origin.y,
            maxX:tb.camera.maxX+cameraHalfWidth-this._origin.x,
            maxY:tb.camera.maxY+cameraHalfHeight-this._origin.y
        }
    },

    inTraceRange: function(x,y) {
        x=x>=this._traceRange.minX&&x<=this._traceRange.maxX;
        y=y>=this._traceRange.minY&&y<=this._traceRange.maxY;

        return {
            x:x,
            y:y
        };
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
    
    moveEnd: function() {
        var sx=this._endPosition.x-this._position.x,
        sy=this._endPosition.y-this._position.y;
        var traceRange=this.inTraceRange(this._position.x,this._position.y);
        this.onmove(traceRange.x?sx:0,traceRange.y?sy:0);
        this.setOriginalPosition(this._endPosition.x,this._endPosition.y);
    },

    _doMove: function(delta) {
        var direction=this._screenDirection,
        endPosition=this._endPosition,
        x=this._position.x,
        y=this._position.y,
        traceRange=this.inTraceRange(x,y),
        sx=this._speed.x*direction.x,
        sy=this._speed.y*direction.y;

        x+=sx;
        y+=sy;
        x=(direction.x>0?x>endPosition.x:x<endPosition.x)?endPosition.x:x;
        y=(direction.y>0?y>endPosition.y:y<endPosition.y)?endPosition.y:y;

        this.onmove(traceRange.x?sx:0,traceRange.y?sy:0);

        this.setOriginalPosition(x,y);

        //do move next
        if(x==endPosition.x && y==endPosition.y) {
            this.mx=this._end.x;
            this.my=this._end.y;
            this.mz=this._end.z;
            this._moveNext();
        }
    },

    _path:'box'
});