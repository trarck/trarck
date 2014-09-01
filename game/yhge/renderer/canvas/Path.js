var Path=yhge.core.Class({
    overrides:{
        initialize:function(context){
            this._context=context;
        },
        ellipse:function(x,y,a,b){
            
        },
        circle:function(x,y,r){
            
        }
    },
    content:{
        getInstance:function(context){
            if(!this.pathInstance) this.pathInstance=new Path(context);
            return this.pathInstance;
        },
        ellipse:function(context,x,y,a,b){
            
        },
        circle:function(context,x,y,r){
            
        },
        //按像限生成clip
        ellipseArc:function (ctx,x,y,a,b,from,to) {
             
        }
    }
});
