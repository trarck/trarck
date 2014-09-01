(function  () {
    var Arc=yhge.renderer.canvas.shape.Shape;

    var SolidArc=yhge.core.Class(Arc,{

        classname:"SolidArc",

        initialize:function(){
            Arc._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            context.fillStyle=this._color;
            context.beginPath();
            context.arc(0,0,this._radius,this._startAngle,this._endAngle,this._anticlockwise);
            context.fill();
        }
    });
    yhge.renderer.canvas.shape.SolidArc=SolidArc;
})();