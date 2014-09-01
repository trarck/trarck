function ShadowFactory () {

}
ShadowFactory.prototype={
    create:function(type){
        var title=document.createElement("img");
        title.className=this.types[type];
        title.src="images/"+this.typeImgs[type];
        return title;
    },
    setShadow:function (shadow,coord,animate) {
        coord.y--;
        var pos=this.map2ScreenPosition(coord);
        pos.top-=shadow.originPosition.top;
        pos.left-=shadow.originPosition.left;
        animate ?$(shadow._view).animate(pos):$(shadow._view).css(pos);
    },
    addShadow:function (unit,coord) {
        var shadow=new BoxShadow(this.TILES[2]);//this.createTile(2);
        shadow.calcOrginSimple(this.xUnit,this.zUnit);
        this.setShadow(shadow,coord);
        this.shadows.append(shadow._view);
        unit.shadow=shadow;
        return shadow;
    }
}