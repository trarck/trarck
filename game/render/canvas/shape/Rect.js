(function  () {
    Rect=yhge.core.Class(Shape,{

        initialize:function(){
            console.log("init rect");
            Rect._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            console.log("rect draw:",this._color);
            context.strokeStyle=this._color;
            context.strokeRect(0,0,this._width,this._height);
        }
    });
    Rect.classname="Rect";
})();