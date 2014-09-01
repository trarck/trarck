function UnitManage () {

}
UnitManage.prototype={
    setUnit:function (unit,coord,animate) {
        var pos=this.map2ScreenPosition(coord);
        pos.zIndex=coord.y+pos.top;
        pos.top-=unit.originPosition.top;
        pos.left-=unit.originPosition.left;
        if(!this.unitsData[coord.y]){
            this.unitsData[coord.y]=[];
        }
        this.unitsData[coord.y][coord.x]=unit;

        unit._x=coord.x;
        unit._y=coord.y;
        if(animate){
            var z=pos.zIndex;
            delete pos.zIndex;
            $(unit._view).animate(pos).css("zIndex",z);
        }else{
            $(unit._view).css(pos);
        }
    },
    addUnit:function (coord) {
        var unit=new Box(this.TILES[1]);//this.createTile(1);
        unit.calcOrginSimple(this.xUnit,this.zUnit);
        this.setUnit(unit,coord);
        this.units.append(unit._view);
        return unit;
    },
    removeUnit:function (coord) {
       var unit=this.unitsData[coord.y][coord.x];
       $(unit.shandow).remove();
       $(unit).remove();
    },
    clearUnit:function (coord) {
       if(this.unitsData[coord.y])this.unitsData[coord.y][coord.x]=null;
    },
    getUnit:function (coord) {
        return this.unitsData[coord.y]&&this.unitsData[coord.y][coord.x];
    },
    hasUnit:function (coord) {
        return this.unitsData[coord.y]&&this.unitsData[coord.y][coord.x];
    }
}