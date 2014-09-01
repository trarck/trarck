(function  () {
    
    var Shape=yhge.renderer.canvas.shape.Shape;

    var Circle=yhge.core.Class(Shape,{

        classname:"Circle",

        initialize:function(){
            this._radius=0;
            Circle._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            if(this._solid){
                context.fillStyle=this._color;
                context.beginPath();
                context.arc(0,0,this._radius,0,Math.PI*2,true);
                context.fill();
            }else{
                context.strokeStyle=this._color;
                context.beginPath();
                context.arc(0,0,this._radius,0,Math.PI*2,true);
                context.stroke();
            }
        },
        setRadius:function(radius) {
            this._radius=radius;
            return this;
        },
        getRadius:function() {
            return this._radius;
        }
    });
    yhge.renderer.canvas.shape.Circle=Circle;
})();