(function(){

    var EventObject  = yhge.event.EventObject;
    
    var TouchEventObject=yhge.event.TouchEventObject=yhge.core.Class(EventObject,{
        
            classname:"TouchEventObject",
            
            x:0,
            y:0,

            initialize:function  () {
                TouchEventObject._super_.initialize.apply(this,arguments);
            },
            initEvent:function(type,canBubbles,cancelable,x,y){
                TouchEventObject._super_.initEvent.apply(this,arguments);
                this.x=x;
                this.y=y;
            }
        }
    );
})();