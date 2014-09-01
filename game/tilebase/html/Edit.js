
var editor= {
    active: function() {
        var self=this;
        this.moveable=false;
        this.ismoved=false;

        $.event.add(tb.world,'click', function(e,position) {
            self.onClick(e,position);
        });

        $.event.add(tb.world,'mousedown', function(e,position) {
            self.moveable=true;
            self.ismoved=false;
        });

        $.event.add(tb.world,'mouseup', function(e,position) {
            self.moveable=false;
        });

        $.event.add(tb.world,'mousemove', function(e,position) {
            self.moveable && (self.ismoved=true);
            self.onMousemove(e,position);
        });
        

        //world drag
         tb.world._world.dragDrop({
             start: function() {
                 startPosition=tb.camera.getPosition();
             },
 
             drag: function(e,dis) {
                 tb.camera.moveTo(startPosition.x-dis.x,startPosition.y-dis.y);
             }
         });
         this.setType(1);
    },
    setType:function (type) {
        this.type=type;//1--barrier
        if(type==10){
            tb.world._world.dragDrop("enable");
        }else{
            tb.world._world.dragDrop("disable");
        }
    },
    inactive: function() {
        $.event.remove(tb.world,'click');
        $.event.remove(tb.world,'mousedown');
        $.event.remove(tb.world,'mouseup');
        $.event.remove(tb.world,'mousemove');
    },

    onClick: function(e,position) {
        if(this.ismoved) return;

        var grid=tb.isoUtil.positionToMapGrid(position.x,position.y);
        var tiles=tb.world.getForeground(grid.x,grid.y);

        console.log(grid.x,grid.y);
        if(tiles){
            tb.world.removeFromForeground(tiles[0]);
        }else{
            var z=tiles?tiles.length:0;
            //place box
            var box=new tb.tile.Grid({
                code:"barrier",
                width:160,
                height:80,
                origin: {
                    x:80,
                    y:0
                },
                barrier:1
            });
            box.setCoord(grid.x,grid.y,z);
            tb.world.addToForeground(box);
        }
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
        
        var tiles=tb.world.getForeground(grid.x,grid.y);

        switch (this.type) {
            case 1:
                if(!(tiles && tiles.length)){
                    var box=new tb.tile.Grid({
                        code:"barrier",
                        width:160,
                        height:80,
                        origin: {
                            x:80,
                            y:0
                        },
                        barrier:1
                    });
                    box.setCoord(grid.x,grid.y,0);
                    tb.world.addToForeground(box);
                }
                break;
            case 2:
                 if(tiles && tiles.length){
                    tb.world.removeFromForeground(tiles[0]);
                 }
                break;
        
        }
        

        //}
    }
};