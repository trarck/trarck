function Box(){
    this._super_.constructor.apply(this,arguments);
}
YH.extend(Box,Tile,{
    initialize:function(){
        var o=this.options;
        this.size=o.size;
        this.originPosition=o.originPosition||{};
        this.imgSrc=o.img;
        this.cls=o.cls;
        
        this.createView();
    }
});

function BoxShandow(){
    this._super_.constructor.apply(this,arguments);
}
YH.extend(BoxShandow,Box);