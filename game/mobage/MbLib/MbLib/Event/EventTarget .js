var Core  = require('../../NGCore/Client/Core').Core;

var EventObject  = require('./EventObject').EventObject;

//EventTarget 做为object(GL2中的node，UI中的view,自定义的javascript对像)的父类
var EventTarget=exports.EventTarget=Core.MessageListener.subclass({
    
    classname:"EventTarget",
    
    initialize:function  () {
        
    },
    addEventListener: function  (type,handler,data,scope,params) {

        this._eventListener=this._eventListener||{};//这样做，而不是放在initialize里，可以使EventTarget被混合进其它对象。

        var listener= {
            handler:handler,
            scope:scope||this,
            data:data||[]
        };

        //get listeners
        var listeners;

        if(this._eventListener[type]){
            listeners=this._eventListener[type].listeners;
        }else{
            this._eventListener[type]={};
        }
        //is listened. one type event only have a  handle ,have multi-processor function
        //一个事件只有一个触发点，但有很多处理该事件的函数
        if(listeners){
            if(!this.isListened(listeners,handler)) {
                listeners.push(listener);
            }
        }else{
            //add event handle to listene
            this._eventListener[type].listeners=[listener];

             //add to framework listener systerm,trigger by framework automatic. user defined event trigger by user program manual.
            //事件处理函数。系统中的事件传的参数不一样，要做相应的接口对接，全部转成EventObject。
            this._eventListener[type].handle=this._getEventHandle(type);
            //设置系统触发点。平台事件由系统自动触发。自定义事件要手动触发。
            this.addTrigger(type,this._eventListener[type].handle,params);
        }
    },
    
    removeEventListener: function  (type,handler) {
        if(this._eventListener) {
            //有对应的事件
            if(type) {
                var listeners=this._eventListener[type].listeners;
                if(listeners) {
                    //某事件有listeners
                    if(handler) {
                        //删除事件中的handler
                        var i=this.getHandlerIndex(listeners,handler);
                        if(i>0) {
                            listeners.splice(i,1);
                        }
                        if(listeners.length==0){
                            this.removeTrigger(type,this._eventListener[type].handle);
                            delete this._eventListener[type];
                        }
                    } else {
                        //删除事件的所有handler，即删除obj的type事件。
                        this.removeTrigger(type,this._eventListener[type].handle);
                        delete this._eventListener[type];
                    }
                }
            } else {
                // remove all object events
                for(var i in this._eventListener){
                    //remove trigger
                    this.removeTrigger(i,this._eventListener[i].handle);
                }
                this._eventListener={};
            }
        }
    },
    
    dispatchEvent: function(event) {
        // Capture no
        
        // Target
        this.handleEvent(event);
        // Bubble
        var parent=this.getParent && this.getParent();
        while(parent && !event.isDispatchStopped){
            this.handleEvent(parent,event);
            parent=parent.getParent && parent.getParent();
        }
    },

    handleEvent: function(event) {
        if(this._eventListener) {
            var listeners=this._eventListener[event.type].listeners;
            if(listeners) {
                var listener;
                for(var i=0,l=listeners.length;i<l;i++) {
                   listener=listeners[i];
                   listener.handler.apply(listener.scope,[event].concat(listener.data));
                }
            }
        }
    },

    addTrigger:function(type,eventHandle,params){
        switch (type) {
            case "touch":
                var touchTarget=params;

                if(Util.isPlainObject(params)){
                    var touchConf=params;
                    touchTarget=new GL2.TouchTarget();
                    touchTarget.setSize(touchConf.size).setAnchor(touchConf.anchor).setPosition(touchConf.position).setDepth(touchConf.depth);
                    this.addChild(touchTarget);
                    this._touchTarget=touchTarget;
                }
                touchTarget && touchTarget.getTouchEmitter().addListener(this,function(touch){
                    eventHandle(touch);
                    if(touch.getAction()==touch.Action.Start){
                        return true;
                    }
                });
                break;
            case "update":
                Core.UpdateEmitter.addListener(this,eventHandle);
                break;
            case "memory":
            case "key":
            case "ipc":
            case "lifecycle":
            case "location":
            case "motion":
            case "network":
            case "orientation":
            case "lifecycle":
            case "location":
                Device[Util.ucfirst(type)+"Emitter"].addListener(this,eventHandle);
                break;
        }
    },
    removeTrigger:function  (type,eventHandle) {
        switch (type) {
            case "touch":
                this._touchTarget.getEmitter().removeListener(this,eventHandle);
                break;
            case "update":
                Core.UpdateEmitter.removeListener(this,eventHandle);
                break;
        }
    },
 
    /**
     *系统中的事件传的参数不一样，要做相应的接口对接。
     *注：eventHandle和type的关系可以优化，使用一个HashMap保存type与eventHandle的对应关系，直接取得。至于eventHandle的self可以通过bind this，这样在eventHandle内就可以不用闭包传来的self。
     *    这种方法可以性能还是一样，如果没有原生bind，则每个bind的时候还要生成一个function。
     */
    _getEventHandle:function(type){
        var self=this,eventHandle;

        switch (type) {
            case "update":
                eventHandle=function  (delta) {
                    var event=new EventObject("update");
                    event.delta=delta;
                    self.dispatchEvent(event);
                };
                break;
            default:
                eventHandle=function(event){
                    event=event instanceof EventObject?event:new EventObject(event);
                    self.dispatchEvent(event);
                };
                break;
        }
        return eventHandle;
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
    }

});