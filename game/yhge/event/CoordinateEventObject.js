(function(){
    /**
     * 为了统一鼠标和单点触摸，使用单独坐标的事件。
     */
    var EventObject  = yhge.event.EventObject;
    
    var CoordinateEventObject=yhge.event.CoordinateEventObject=yhge.core.Class(EventObject,{
        
            classname:"CoordinateEventObject",
            
            x:0,
            y:0,

            initialize:function  () {
                CoordinateEventObject._super_.initialize.apply(this,arguments);
            },
            initEvent:function(type,canBubbles,cancelable,x,y){
                CoordinateEventObject._super_.initEvent.apply(this,arguments);
                this.x=x;
                this.y=y;
            }
        }
    );
})();