//提供全局方法和设置。
game={};
game.tileWidth=64;
game.tileHeight=32;
game.unit={x:32,y:16};//tile 64,32 ;unit=tile/2
game.isoUtil=new isometric.Util({xUnit:game.unit.x,yUnit:game.unit.y});
game.view=$("#map");
game.world=new World({
	world:"#map .world",
    isoUtil:game.isoUtil
	//mapPosition:
});
//game.camera=new Camera({
//    game:game
//});
$.event.add(game.world,'click',function(e,coord){
    console.log(arguments);
});
$.event.add(game.world,'mousemove',function(e,grid){
    var pos=  game.isoUtil.mapToScreenPosition(coord.x,coord.y);
    pos.left-=game.unit.x;
    gridHover.css(pos);
});

var gridHover=$('<img src="images/grid/coord_hover.png"/>').css({position:"absolute"}).appendTo(game.world.getWorld());

