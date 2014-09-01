(function  () {
    var Shape=yhge.renderer.canvas.shape.Shape;

    var Rect=yhge.renderer.canvas.shape.Rect=yhge.core.Class(Shape,{

        classname:"Rect",

        initialize:function(){
            Rect._super_.initialize.apply(this,arguments);
        },

        draw: function (context) {
            if(this._solid){
                context.fillStyle=this._colorString;
                context.fillRect(0,0,this._contentSize.width,this._contentSize.height);
            }else{
                context.strokeStyle=this._colorString;
                context.strokeRect(0,0,this._contentSize.width,this._contentSize.height);
            }
            
        }
    });
})();