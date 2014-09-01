var Core  = require('../../NGCore/Client/Core').Core;

var NgEventListenerManager  = require('./NgEventListenerManager').NgEventListenerManager;

//IEventTarget 要被混合(mixin)进需要事件的对象(任意)中。
var NgEventTarget=exports.NgEventTarget=Core.MessageListener.subclass({
    
    classname:"NgEventTarget",
    
   
    addEventListener: function  (type,handler,data,scope,params) {
//        var args=Array.prototype.slice.call(arguments,0);
//        args.unshift(this);
//        EventListenerManager.addEventListener.apply(EventListenerManager,args);
        return NgEventListenerManager.addEventListener(this,type,handler,data,scope,params);
    },
    
    removeEventListener: function  (type,handler) {
        return NgEventListenerManager.removeEventListener(this,type,handler);
    },
    getEventListeners:function(type){
        return NgEventListenerManager.getEventListeners(this,type);
    },
    dispatchEvent: function(event) {
        return NgEventListenerManager.dispatchEvent(this,event);
    },
    trigger:function(type,data,bubbles){
        return NgEventListenerManager.trigger(this,type,data,bubbles);
    },
});