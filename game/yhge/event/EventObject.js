(function(){
    var EventObject=yhge.core.Class({
        overrides:{
            classname:"EventObject",
            
            $CAPTURING_PHASE:1,
            $AT_TARGET:2,
            $BUBBLING_PHASE:3,
            
            type:"",
            target:null,
            currentTarget:null,
            eventPhase:0,
            bubbles:true,
            cancelable:false,
            timeStamp:0,


            initialize:function  () {
                if(arguments.length){
                    this.initEvent.apply(this,arguments);
                }
            },
            initEvent:function(type,canBubbles,cancelable){
                if(typeof type=="string"){
                    this.type=type;
                    this.bubbles=canBubbles;
                    this.cancelable=cancelable;
                }else{
                    var event=type;
                    this.type=event.type;
                    this.bubbles=event.bubbles==null?canBubbles:event.bubbles;
                    this.cancelable=event.cancelable==null?cancelable:event.cancelable;
                }
                this.timeStamp=(new Date()).getTime();
                this.dispatchStopped=false;
                this.noDefault=false;
            },
            
            stopPropagation:function() {
                this.dispatchStopped=true;
            },
            preventDefault:function(){
                this.noDefault=true;
            },
            isDispatchStopped:function  () {
                return !this.bubbles || (this.bubbles & this.dispatchStopped);
            },
            getPreventDefault:function  () {
                return this.cancelable && this.noDefault;
            }
        },
        content:{
            create:function(type,data,bubbles){
                bubbles=typeof bubbles=='undefined'?true:bubbles;
                var e=new EventObject(type,bubbles,true);//cancelabled
                e.data=data;
                return e;
            }
        }
    });
    yhge.event.EventObject=EventObject;
})();