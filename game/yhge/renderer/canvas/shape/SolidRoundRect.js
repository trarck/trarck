(function  () {
    
    var RoundRect=yhge.renderer.canvas.shape.RoundRect;

    var SolidRoundRect=yhge.core.Class(RoundRect,{

        classname:"SolidRoundRect",
        /**
         * radius {topLeft:{x:0,y:0},topRight:{x:0,y:0},bottomRight:{x:0,y:0},bottomLeft:{x:0,y:0}}
         */
        draw: function (context) {
            var width=this._width,
                height=this._height,
                tl=this._radius.topLeft,
                tr=this._radius.topRight,
                bl=this._radius.bottomLeft,
                br=this._radius.bottomRight;
                                
            context.fillStyle=this._colorString;
            context.beginPath();
            context.moveTo(0,tl.y);
            context.lineTo(0,height-bl.y);
            context.quadraticCurveTo(0,height,bl.x,height);
            context.lineTo(width-br.x,height);
            context.quadraticCurveTo(width,height,width,height-br.y);
            context.lineTo(width,tr.y);
            context.quadraticCurveTo(width,0,width-tr.x,0);
            context.lineTo(tl.x,0);
            context.quadraticCurveTo(0,0,0,tl.y);
            context.fill();
        }
    });

    yhge.renderer.canvas.shape.SolidRoundRect=SolidRoundRect;
})();