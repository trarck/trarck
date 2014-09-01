(function(){

    var UIEventListenerManager  = yhge.event.UIEventListenerManager;

    //UIEventTarget 要被混合(mixin)进需要事件的对象(任意)中。
    var UIEventTarget=function(){

    };
    UIEventTarget.prototype={
        
        classname:"UIEventTarget",

        addEventListener: function  (type,handler,data,scope,params) {
            return UIEventListenerManager.addEventListener(this,type,handler,data,scope,params);
        },
        
        removeEventListener: function  (type,handler) {
            return UIEventListenerManager.removeEventListener(this,type,handler);
        },
        getEventListeners:function(type){
            return UIEventListenerManager.getEventListeners(this,type);
        },
        dispatchEvent: function(event) {
            return UIEventListenerManager.dispatchEvent(this,event);
        },
        trigger:function(type,data,bubbles){
            return UIEventListenerManager.trigger(this,type,data,bubbles);
        }
    };
    yhge.ui.UIEventTarget=UIEventTarget;
})();