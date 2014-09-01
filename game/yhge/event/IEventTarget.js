(function(){

    var EventListenerManager  = yhge.event.EventListenerManager;

    //IEventTarget 要被混合(mixin)进需要事件的对象(任意)中。
    var IEventTarget=exports.IEventTarget=Core.MessageListener.subclass({
        
        classname:"IEventTarget",
        
       
        addEventListener: function  (type,handler,data,scope,params) {
            return EventListenerManager.addEventListener(this,type,handler,data,scope,params);
        },
        
        removeEventListener: function  (type,handler) {
            return EventListenerManager.removeEventListener(this,type,handler);
        },
        getEventListeners:function(type){
            return EventListenerManager.getEventListeners(this,type);
        },
        dispatchEvent: function(event) {
            return EventListenerManager.dispatchEvent(this,event);
        },
        trigger:function(type,data,bubbles){
            return EventListenerManager.trigger(this,type,data,bubbles);
        }

    });
})();