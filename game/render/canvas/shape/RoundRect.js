(function  () {
    RoundRect=yhge.core.Class(Shape,{
        classname:"RoundRect",
        /**
         * radius {topLeft:{x:0,y:0},topRight:{x:0,y:0},bottomRight:{x:0,y:0},bottomLeft:{x:0,y:0}}
         */
        
        initialize:function(){
            this._radius={topLeft:{x:0,y:0},topRight:{x:0,y:0},bottomRight:{x:0,y:0},bottomLeft:{x:0,y:0}};
            RoundRect._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            var width=this._width,
                height=this._height,
                tl=this._radius.topLeft,
                tr=this._radius.topRight,
                bl=this._radius.bottomLeft,
                br=this._radius.bottomRight;
                                
            context.strokeStyle=this._color;
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
            context.stroke();
        },
        setRadius:function(radius) {
            if(typeof radius=="number"){
                this._radius={topLeft:{x:radius,y:radius},topRight:{x:radius,y:radius},bottomRight:{x:radius,y:radius},bottomLeft:{x:radius,y:radius}};
            }else if(radius instanceof Array){
                switch(radius.length){
                    case 1:
                        radius=radius[0];
                        this._radius={
                            topLeft:{x:radius,y:radius},
                            topRight:{x:radius,y:radius},
                            bottomRight:{x:radius,y:radius},
                            bottomLeft:{x:radius,y:radius}
                        };
                        break;
                    case 2:
                        this._radius={
                            topLeft:{x:radius[0],y:radius[0]},
                            topRight:{x:radius[1],y:radius[1]},
                            bottomRight:{x:radius[0],y:radius[0]},
                            bottomLeft:{x:radius[1],y:radius[1]}
                        };
                        break;
                    case 3:
                        this._radius={
                            topLeft:{x:radius[0],y:radius[0]},
                            topRight:{x:radius[1],y:radius[1]},
                            bottomRight:{x:radius[2],y:radius[2]},
                            bottomLeft:{x:radius[1],y:radius[1]}
                        };
                        break;
                    case 4:
                    default:
                        this._radius={
                            topLeft:{x:radius[0],y:radius[0]},
                            topRight:{x:radius[1],y:radius[1]},
                            bottomRight:{x:radius[2],y:radius[2]},
                            bottomLeft:{x:radius[3],y:radius[3]}
                        };
                        break;
                }
            }else{
                for(var i in radius){
                    for(var j in radius[i]){
                        this._radius[i][j]=radius[i][j];
                    }
                }
            }
            return this;
        },
        getRadius:function() {
            return this._radius;
        }
    });
})();