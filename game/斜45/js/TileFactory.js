function TileFactory () {

}
TileFactory.prototype={
    createTile:function(type){
        var title=document.createElement("img");
        title.className=this.types[type];
        title.src="images/"+this.typeImgs[type];
        return title;
    },
    setShandow:function (shandow,coord,animate) {
        coord.y--;
        var pos=this.map2ScreenPosition(coord);
        pos.top-=shandow.originPosition.top;
        pos.left-=shandow.originPosition.left;
        animate ?$(shandow._view).animate(pos):$(shandow._view).css(pos);
    },
    addShandow:function (unit,coord) {
        var shandow=new BoxShandow(this.TILES[2]);//this.createTile(2);
        shandow.calcOrginSimple(this.xUnit,this.zUnit);
        this.setShandow(shandow,coord);
        this.shandows.append(shandow._view);
        unit.shandow=shandow;
        return shandow;
    }
}