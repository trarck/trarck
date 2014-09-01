(function  () {
    
    var Circle=yhge.renderer.canvas.shape.Circle;

    var SolidCircle=yhge.core.Class(Circle,{

        classname:"SolidCircle",

        draw: function (context) {
            context.fillStyle=this._color;
            context.beginPath();
            context.arc(0,0,this._radius,0,Math.PI*2,true);
            context.fill();
        }
    });
    yhge.renderer.canvas.shape.SolidCircle=SolidCircle;
})();