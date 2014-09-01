(function  () {
    var RadialGradient=function  (x1,y1,r1,x2,y2,r2,context) {
        return context.createRadialGradient(x1,y1,r1,x2,y2,r2);
    };
    yhge.renderer.canvas.RadialGradient=RadialGradient;
})();