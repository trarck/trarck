(function  () {
    Circle=yhge.core.Class(Shape,{
        classname:"Circle",
        initialize:function(){
            console.log("init Circle");
            this._radius=0;
            Circle._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            console.log("Circle draw:",this._color);
            context.strokeStyle=this._color;
            context.beginPath();
            context.arc(0,0,this._radius,0,Math.PI*2,true);
            context.stroke();
        },
        setRadius:function(radius) {
            this._radius=radius;
            return this;
        },
        getRadius:function() {
            return this._radius;
        }
    });
})();