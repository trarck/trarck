/**
   把屏幕坐标向正方向移动一个单位
   设置元件left的时候，不需要减去一个x单位值
   但是在捕获鼠标事件的时候，x方向的偏移量要减去一个x单位大小
  */

function Angle45(o) {
    this.options=o;
    this._init();
}
Angle45.prototype={
    typeImgs:['g.gif','box4.gif','shandow.gif'],
    types:["","box","shandow"],
    TILES:[
        {cls:"",img:"g.gif",top:0,left:0},
        {cls:"box",img:"box.gif",size:{x:1,y:1,z:1}},
        {cls:"shandow",img:"shandow.gif",size:{x:1,y:1,z:0}}
    ],
    _init:function () {
       var o=this.options;
       this._coordUnit=new CoordUtil(o);
       
       this.initElements(this.options);
       this.setStagePosition();

       this._tiles=[];
        
       this.worldEvent();

    },
    initElements:function  (o) {
       this._world=$(o.world);
       this._background=$(o.background);
       this._intermediate=$(o.intermediate);
       this._foreground=$(o.foreground);
    },
    getWorld:function  () {
        return this._world;
    },
    setWorld:function  (world) {
        this._world=world;
    },
    getBackground:function  () {
        return this._background;
    },
    setBackground:function  (background) {
        this._background=background;
    },
    getIntermediate:function  () {
        return this._intermediate;
    },
    setIntermediate:function  (intermediate) {
        this._intermediate=intermediate
    },
    getForeground:function  () {
        return this._foreground;
    },
    setForeground:function  (foreground) {
        this._foreground=foreground;
    },
    setStagePosition:function (pos) {
        this._worldPosition=pos||this._world.offset();
        console.log(this._worldPosition);
    },
    getStagePosition:function () {
        return this._worldPosition;
    }, 
    worldEvent:function () {
        console.log(this._world);
        var self=this;
        this._world.click(function (e) {
            var x=e.pageX,y=e.pageY;
            x-=self._worldPosition.left;
            y-=self._worldPosition.top;
            console.log(x,y,self.position2MapCoord(x,y));

           // $.event.trigger('click',self.position2MapCoord(x,y),self);
            e.preventDefault();
            return false;
        });
    },
    map2ScreenCoord:function (x,y){
        return this._coordUnit.map2ScreenCoord(x,y);
    },
    map2ScreenPosition:function (x,y){
        return this._coordUnit.map2ScreenPosition(x,y);
    },
    screen2MapCoord:function (x,y){
         return this._coordUnit.screen2MapCoord(x,y);
    },
    position2MapCoord: function (left,top){
        return this._coordUnit.position2MapCoord(left,top);
    }
}
