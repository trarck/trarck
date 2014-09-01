(function  () {
    var LinearGradient=function  (x,y,width,height,context) {
        return context.createLinearGradient(x,y,x+width,y+height);
    };
    yhge.renderer.canvas.LinearGradient=LinearGradient;
})();