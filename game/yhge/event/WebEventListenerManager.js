(function(){
    var core=yhge.core;

    var EventListenerManager  =yhge.event.EventListenerManager;
    var EventObject  = yhge.event.EventObject;
    var TouchHandler  = yhge.event.TouchHandler;

    var WebEventListenerManager=yhge.event.WebEventListenerManager=core.Class(EventListenerManager,{
        
        classname:"WebEventListenerManager",
        
        addTrigger:function(obj,type,eventHandle,params){
            var cat=this._getTypeCategory(type);
            switch (cat) {
                case "touch":
                    var touchTarget=params;
                    if(core.isPlainObject(params)){
                       
                    }
                    break;
                case "update":
                    if(!obj._updateListener_){
                        obj._updateListener_=new Core.MessageListener();
                        //Core.UpdateEmitter.addListener(obj._updateListener_,eventHandle);
                    }
                    break;
                case "localization":
                    if(!obj._localizationListener_){
                        obj._localizationListener_=new Core.MessageListener();
                        //Core.Localization.addListener(obj._localizationListener_,eventHandle);
                    }
                    break;
                case "device":
                    var listenerAttr="_"+type+"Listener_";
                    if(!obj[listenerAttr]){
                        obj[listenerAttr]=new Core.MessageListener();
                        //Device[Util.ucfirst(type)+"Emitter"].addListener(obj[listenerAttr],eventHandle);
                    }
                    break;
                default:
                    console.log("###event "+type+" not defined###");
                    break;
            }
        },
        removeTrigger:function  (obj,type,eventHandle) {
            var cat=this._getTypeCategory(type);
            switch (type) {
                case "touch":
                    obj._touchTarget_.getEmitter().removeListener(this,eventHandle);
                    break;
                case "update":
                    if(obj._updateListener_){
                        //Core.UpdateEmitter.removeListener(obj._updateListener_,eventHandle);
                        delete obj._updateListener_;
                    }
                    break;
                case "localization":
                    if(obj._localizationListener_){
                        //Core.Localization.removeListener(obj._localizationListener_,eventHandle);
                        delete obj._localizationListener_;
                    }
                    break;
                case "device":
                    var listenerAttr="_"+type+"Listener_";
                    if(obj[listenerAttr]){
                        //Device[Util.ucfirst(type)+"Emitter"].removeListener(obj[listenerAttr],eventHandle);
                        delete obj[listenerAttr];
                    }
                    break;
                default:
                    break;
            }
        },
     
        /**
         *系统中的事件传的参数不一样，要做相应的接口对接。
         *注：eventHandle和type的关系可以优化，使用一个HashMap保存type与eventHandle的对应关系，直接取得。
         *     至于eventHandle的this,可以通过外部bind obj，这样在eventHandle内就this就指向obj，self直接调用EventListenerManager。
         *     这种方法可以性能还是一样，如果没有原生bind，则每个bind的时候还要生成一个function。
         */
        getEventHandle:function(type,obj,params){
            var self=this,eventHandle,cat=this._getTypeCategory(type);

            switch (type) {
                case "touch":
                    //touch actions
                    var th=new TouchHandler(this,obj,params.actions);//["base","longTouch"]
                    eventHandle=function  (touch) {
                        return th.onTouch(touch);
                    };
                    break;
                case "update":
                    eventHandle=function  (delta) {
                        var event=new EventObject("update",true,true);
                        event.delta=delta;
                        event.target=obj;
                        self.dispatchEvent(obj,event);
                    };
                    break;
                case "localization":
                    eventHandle=function  () {
                        var event=new EventObject("localization",true,true);
                        event.target=obj;
                        self.dispatchEvent(obj,event);
                    };
                    break;
                default:
                    eventHandle=function(event){
                        event=event instanceof EventObject?event:new EventObject(event,true,true);
                        event.target=event.target||obj;
                        self.dispatchEvent(obj,event);
                    };
                    break;
            }
            return eventHandle;
        },
        _getTypeCategory:function  (type) {
            switch (type) {
                case "touch":
                case "touchStart":
                case "touchMove":
                case "touchEnd":
                case "touchExit":
                case "longTouch":
                case "longTouchStart":
                case "longTouchEnd":
                case "touchComplex":
                    type="touch";
                    break;
                case "update":
                    type="update";
                    break;
                case "localization":
                    type="localization";
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
                    type="device";
                    break;
                default:
                    break;
            }
            return type;
        }
    });
})();