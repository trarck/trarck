(function(){

    var EventObject  = yhge.event.EventObject;
    
    var MouseEventObject=yhge.event.MouseEventObject=yhge.core.Class(EventObject,{
        
            classname:"MouseEventObject",
            
            x:0,
            y:0,

            initialize:function  () {
                MouseEventObject._super_.initialize.apply(this,arguments);
            },
            initEvent:function(type,canBubbles,cancelable,x,y){
                MouseEventObject._super_.initEvent.apply(this,arguments);
                this.x=x;
                this.y=y;
            }
        }
    );
})();