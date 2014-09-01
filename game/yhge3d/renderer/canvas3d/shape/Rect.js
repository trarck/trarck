(function  () {
    var Shape=yhge.renderer.canvas.shape.Shape;

    var Rect=yhge.core.Class(Shape,{

        classname:"Rect",

        initialize:function(){
            Rect._super_.initialize.apply(this,arguments);
        },

        draw: function (context) {
            if(this._solid){
                context.fillStyle=this._color;
                context.fillRect(0,0,this._width,this._height);
            }else{
                context.strokeStyle=this._color;
                context.strokeRect(0,0,this._width,this._height);
            }
            
        }
    });
    yhge.renderer.canvas.shape.Rect=Rect;
})();