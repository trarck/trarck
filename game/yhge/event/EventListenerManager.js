(function(){

    var EventObject  = yhge.event.EventObject;

    var uuid=1000,Events= {};
    
    var EventListenerManager=yhge.event.EventListenerManager=yhge.core.Class({
        overrides:{
        
        classname:"EventListenerManager",
        initialize:function(){
            
        },
        addEventListener: function  (obj,type,handler,data,scope,params) {
            
            var  id=obj._eventId_;
            
            if(id==null) {
                id=obj._eventId_=++uuid
            };
            
            var listener= {
                handler:handler,
                scope:scope||obj,
                data:data||[]
            };

            //get listeners
            var listeners,eventListeners=Events[id]||(Events[id]={});

            if(eventListeners[type]){
                listeners=eventListeners[type].listeners;
            }else{
                eventListeners[type]={};
            }
            //is listened. one type event only have a  handle ,have multi-processor function
            //一个事件只有一个触发点，但有很多处理该事件的函数
            if(listeners){
                if(!this.isListened(listeners,handler)) {
                    listeners.push(listener);
                }
            }else{
                //add event handle to listene
                eventListeners[type].listeners=[listener];

                // //add to framework listener systerm,trigger by framework automatic. user defined event trigger by user program manual.
                // //事件处理函数。系统中的事件传的参数不一样，要做相应的接口对接，全部转成EventObject。
                // eventListeners[type].handle=this.getEventHandle(type,obj,params);
                // //设置系统触发点。平台事件由系统自动触发。自定义事件要手动触发。
                // this.addTrigger(obj,type,eventListeners[type].handle,params);
            }
        },
        
        removeEventListener: function  (obj,type,handler) {
            if(obj._eventId_) {
                var eventListeners=Events[obj._eventId_];
                if(eventListeners) {
                    //有obj对应的事件
                    if(type) {
                        var listeners=eventListeners[type] && eventListeners[type].listeners;
                        if(listeners) {
                            //某事件有listeners
                            if(handler) {
                                //删除事件中的handler
                                var i=this.getHandlerIndex(listeners,handler);
                                if(i>-1) {
                                    listeners.splice(i,1);
                                }
                                if(listeners.length==0){
                                    // this.removeTrigger(obj,type,eventListeners[type].handle);
                                    delete eventListeners[type];
                                }
                            } else {
                                //删除事件的所有handler，即删除obj的type事件。
                                // this.removeTrigger(obj,type,eventListeners[type].handle);
                                delete eventListeners[type];
                            }
                        }
                    } else {
                        // remove all object events
                        
                        // for(var i in eventListeners){
                            // //remove trigger
                            // this.removeTrigger(obj,i,eventListeners[i].handle);
                        // }
                        delete Events[obj._eventId_];
                        //delete obj._eventId_;
                    }
                }
            }
        },
        
        dispatchEvent: function(obj,event) {
            // Capture no
            
            // Target
            //event.currentTarget=obj;
            this.handleEvent(obj,event);
            // Bubble
            var parent=obj.getParent && obj.getParent();
            while(parent && !event.isDispatchStopped()){
                //event.currentTarget=parent;
                this.handleEvent(parent,event);
                parent=parent.getParent && parent.getParent();
            }
        },

        handleEvent: function(obj,event) {
            if(obj._eventId_) {
                var eventListeners=Events[obj._eventId_];
                if(eventListeners) {
                    var listeners=eventListeners[event.type]&&eventListeners[event.type].listeners;
                    if(listeners) {
                        var listener;
                        for(var i=0,l=listeners.length;i<l;i++) {
                           listener=listeners[i];
                           listener.handler.apply(listener.scope,[event].concat(listener.data));
                        }
                    }
                }
            }
        },

        isListened: function(listeners,handler) {
            return this.getHandlerIndex(listeners,handler)>-1;
        },

        getHandlerIndex: function(listeners,handler) {
            var p=-1;
            for(var i=0,l=listeners.length;i<l;i++) {
                if(listeners[i].handler==handler) {
                    p=i;
                    break;
                }
            }
            return p;
        },
        getEventListeners:function  (obj,type) {
            var eventListeners=Events[obj._eventId_];
            if(eventListeners && type){
                eventListeners= eventListeners[type] && eventListeners[type].listeners;
            }
            return eventListeners;
        },
        //把new EventObject和dispatchEvent和起来，提供简便方法
        trigger:function(obj,type,data,bubbles){
            bubbles=typeof bubbles=='undefined'?true:bubbles;
            var e=new EventObject(type,bubbles,true);
            e.data=data;
            this.dispatchEvent(obj,e);
        }
        // ,
        // //以下根据不同平台进行扩展
        // addTrigger:function(obj,type,eventHandle,params){
           // throw "EventListenerManager's addTrigger not implement";
        // },
        // removeTrigger:function  (obj,type,eventHandle) {
            // throw "EventListenerManager's removeTrigger not implement"
        // },
        // /**
         // *系统中的事件传的参数不一样，要做相应的接口对接。
         // *注：eventHandle和type的关系可以优化，使用一个HashMap保存type与eventHandle的对应关系，直接取得。
         // *     至于eventHandle的this,可以通过外部bind obj，这样在eventHandle内就this就指向obj，self直接调用EventListenerManager。
         // *     这种方法可以性能还是一样，如果没有原生bind，则每个bind的时候还要生成一个function。
         // */
        // getEventHandle:function(type,obj,params){
            // var self=this;
            // return function(event){
                // event=event instanceof EventObject?event:new EventObject(event,true,true);
                // event.target=event.target||obj;
                // self.dispatchEvent(obj,event);
            // };
        // }
    }});
    var instance;
    EventListenerManager.defaultEventListenerManager=function () {
        if(!instance) instance=new EventListenerManager();
        return instance;
    }
})();