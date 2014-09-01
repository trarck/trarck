(function(){

    var EventObject  = yhge.event.EventObject;
    
    exports.UIEventObject=yhge.event.UIEventObject=yhge.core.Class(EventObject,{
        
            classname:"UIEventObject",
            
            view:null,
            detail:0,
            
            initialize:function  () {
                UIEventObject._super_.initialize.apply(this,arguments);
            },
            initEvent:function(type,canBubbles,cancelable,view,detail){
                UIEventObject._super_.initEvent.apply(this,arguments);
                this.view=view;
                this.detail=detail;
            }
        }
    );
})();