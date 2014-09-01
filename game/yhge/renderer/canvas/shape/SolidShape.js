(function  () {
    var Shape=yhge.renderer.canvas.shape.Shape;

    var SolidShape=yhge.core.Class(Shape,{

        classname:"SolidShape"
    });
    yhge.renderer.canvas.shape.SolidShape=SolidShape;
})();