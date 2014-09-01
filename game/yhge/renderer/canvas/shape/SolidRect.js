(function  () {
    var Rect=yhge.renderer.canvas.shape.Rect;

    var SolidRect=yhge.core.Class(Rect,{

        classname:"SolidRect",

        draw: function (context) {
            context.fillStyle=this._colorString;
            context.filleRect(0,0,this._contentSize.width,this._contentSize.height);
        }
    });
    yhge.renderer.canvas.shape.SolidRect=SolidRect;
})();