tb.view=$("#map");

tb.isoUtil=new isometric.Util({
    xUnit:tb.unit.x,
    yUnit:tb.unit.y
});

tb.world=new World({
    world:"#map .world",
    isoUtil:tb.isoUtil
    //mapPosition:
});

tb.camera=new Camera({
    world:tb.world,
    size: {
        width:tb.view.width(),
        height:tb.view.height()
    }
});
tb.camera.moveTo(0,0);

tb.astar=new tb.AStar({
    barriers: [],//tb.world_map
    minX:0,
    minY:-50,
    maxX:100,
    maxY:50
});

var startPosition;

var gridHover=$('<img src="images/grid/coord_hover.png"/>').css({
    position:"absolute"
}).appendTo(tb.world.getWorld());

var editor= {
    active: function() {
        var self=this;
        this.moveable=false;
        $.event.add(tb.world,'click', function(e,position) {
            self.onClick(e,position);
        });

        $.event.add(tb.world,'mousedown', function(e,position) {
            self.moveable=true;
        });

        $.event.add(tb.world,'mouseup', function(e,position) {
            self.moveable=false;
        });

        $.event.add(tb.world,'mousemove', function(e,position) {
            self.onMousemove(e,position);
        });

        //world drag
        // tb.world._world.dragDrop({
            // start: function() {
                // startPosition=tb.camera.getPosition();
            // },
// 
            // drag: function(e,dis) {
                // tb.camera.moveTo(startPosition.x-dis.x,startPosition.y-dis.y);
            // }
// 
        // });
    },

    inactive: function() {
        $.event.remove(tb.world,'click');
        $.event.remove(tb.world,'mousedown');
        $.event.remove(tb.world,'mouseup');
        $.event.remove(tb.world,'mousemove');
    },

    onClick: function(e,position) {
        var grid=tb.isoUtil.positionToMapGrid(position.x,position.y);
        var tiles=tb.world.getForeground(grid.x,grid.y);
        console.log("tiles:",tiles);
        var z=tiles?tiles.length:0;
        //place box
        var box=new tb.tile.Box({
            code:1,
            width:64,
            height:64,
            origin: {
                x:32,
                y:32
            },
            barrier:1
        });
        box.setCoord(grid.x,grid.y,z);
        tb.world.addToForeground(box);
    },

    onMousedown: function(e,position) {
        
    },

    onMouseup: function(e,position) {

    },

    onMousemove: function(e,position) {
        //if(moveable) {
        var grid=tb.isoUtil.positionToMapGrid(position.x,position.y);
        var pos=  tb.isoUtil.mapToScreenPosition(grid.x,grid.y);
        pos.x-=tb.unit.x;
        
        gridHover.css({
            left:pos.x,
            top:pos.y
        });
        
        if(!this.moveable || this.lastGrid && this.lastGrid.x==grid.x && this.lastGrid.y==grid.y) return;
        this.lastGrid=grid;
        var box=new tb.tile.Box({
            code:1,
            width:64,
            height:64,
            origin: {
                x:32,
                y:32
            },
            barrier:1
        });
        box.setCoord(grid.x,grid.y,0);
        tb.world.addToForeground(box);

        //}
    }

};
var run= {
    active: function() {
        var self=this;
        this.moveable=false;
        this.lastClickTime=0;
        
        $.event.add(tb.world,'click', function(e,position) {
            //console.log("on click:",grid);
            self.onClick(e,position);
        });

        $.event.add(tb.world,'mousedown', function(e,position) {
            console.log("on mousedown:",position);
            self.moveable=true;
            self.onMousedown(e,position);
        });

        $.event.add(tb.world,'mouseup', function(e,position) {
            // console.log("on mouseup:",grid);
            self.moveable=false;
            self.onMouseup(e,position);
        });

        $.event.add(tb.world,'mousemove', function(e,position) {
            self.onMousemove(e,position);
        });

        var pos=tb.camera.getPosition();
        var size=tb.camera.getSize();
        var x=tb.camera._size.width/2+pos.x;
        var y=tb.camera._size.height/2+pos.y;

        var grid=tb.isoUtil.positionToMapGrid(x,y);

        // console.log(x,y);
        // var p=tb.isoUtil.mapToScreenPosition(grid.x,grid.y);
        // console.log(p.x,p.y);

        this.createPlayer(grid.x,grid.y);

        this.createBox(59,2);

        this.createBox(58,-2);

        this.createBox(64,3);

        this.createBox(64,-3);
    },

    inactive: function() {
        $.event.remove(tb.world,'click');
        $.event.remove(tb.world,'mousedown');
        $.event.remove(tb.world,'mouseup');
        $.event.remove(tb.world,'mousemove');
    },

    createPlayer: function(x,y) {
        tb.player=new tb.tile.Role({
            code:2,
            width:64,
            height:64,
            origin: {
                x:32,
                y:32
            },
            barrier:1,
            range: {
                minX:tb.camera.minX,
                minY:tb.camera.minY,
                maxX:tb.camera.maxX+tb.camera._size.width-64,
                maxY:tb.camera.maxY+tb.camera._size.height-64
            }
        });

        tb.player.setCoord(x,y,0);
        tb.player.onmove= function(sx,sy) {//move distance
            tb.camera.moveBy(sx,sy);

            var pos=tb.camera.getPosition();
            tb.camera.setXMoveable(pos.x!=tb.camera.minX && pos.x!=tb.camera.maxX);
            tb.camera.setYMoveable(pos.y!=tb.camera.minY && pos.y!=tb.camera.maxY);
        },

        tb.world.addToForeground(tb.player);
    },

    createBox: function(x,y) {
        var box=new tb.tile.Box({
            code:1,
            width:64,
            height:64,
            origin: {
                x:32,
                y:32
            },
            barrier:1
        });

        box.setCoord(x,y,0);
        box.onmove= function(sx,sy) {//move distance
            tb.camera.moveBy(sx,sy);
        },

        tb.world.addToForeground(box);
    },

    onClick: function(e,position) {
        console.log("on click");
        if(this.moved) return;
        
        var now=(new Date()).getTime();
        if(now-this.lastClickTime<400) return;
        this.lastClickTime=now;
        
        var grid=tb.isoUtil.positionToMapGrid(position)
        console.log("start path");

        var pos=tb.camera.getPosition();
        var size=tb.camera.getSize();

        var original=tb.isoUtil.positionToMapGrid(pos.x,pos.y);
        var gridCount=tb.camera.getGridCount();
        var left=original.x,
        top=original.y-gridCount.col,
        right=original.x+gridCount.col+gridCount.row,
        bottom=original.y+gridCount.row;

        //console.log(left,top,right,bottom);
        tb.astar.reset();
        tb.astar.setRange({
            minX:left,
            minY:top,
            maxX:right,
            maxY:bottom
        });

        tb.astar.setStart({
            x:tb.player.getMx(),
            y:tb.player.getMy()
        });

        tb.astar.setEnd(grid);

        if(tb.astar.search()) {
            var paths=tb.astar.getPath();
            //remove start node
            paths.pop();
            tb.player.movePath(paths);
        }
    },

    onMousedown: function(e,position) {
        var self=this;
        this.moving=false;
        self.moved=false;
        clearTimeout(this._moveDirectionTimer);
        this._moveDirectionTimer=setTimeout( function() {
            console.log("start move");

            self.moving=true;
            self.moved=true;
            var direction=isometric.calcDirection(tb.player.getPosition(),position);
            direction=isometric.toMapDirection(direction);
            self.lastDirection=direction;
            tb.player.moveDirection(direction);
        },200);

    },

    onMouseup: function(e,position) {
        if(this.moving) {
            this.moving=false;
            tb.player.stop(true);
        } else {
            console.log("stop move");
            clearTimeout(this._moveDirectionTimer);
        }
    },

    onMousemove: function(e,position) {
        if(this.moving) {
            var direction=isometric.calcDirection(tb.player.getPosition(),position);
            direction=isometric.toMapDirection(direction);
            if(this.lastDirection.x!=direction.x || this.lastDirection.y!=direction.y) {
                this.lastDirection=direction;
                tb.player.addDirection(direction);
            }
        }
    }

};