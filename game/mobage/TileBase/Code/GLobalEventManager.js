var Core  = require('../../NGCore/Client/Core').Core;

exports.GLobalEventManager=
{
    classname:"GLobalEventManager",
    
    emitters:[],
    
    get:function (name){
        if(!this.emitters[name]){
            this.emitters[name]={};
        }
        return this.emitters[name];
    },
    /**
     * name,type,data,bubbles
     */
    trigger:function (){
       this.invoke('trigger',arguments);
    },
    /**
     * name,type,handler,data,scope,params
     */
    addListener:function(){
       this.invoke('addEventListener',arguments);
    },
    /**
     * name,type,handler
     */
    removeListener:function(){
        this.invoke('removeEventListener',arguments);
    },
    invoke:function(method,args){
       var name=args[0],emitter=this.emitters[name];
       if(!emitter){
           emitter=this.emitters[name]={};
       }
       args[0]=emitter;
       NgEventListenerManager[method]&& NgEventListenerManager[method].apply(NgEventListenerManager,args);
    },
    Building:{
        Event:'Building',
        Place:'Building.Place',
        Edit:'Edit',
        Pay:'Pay',
        Cancel:'Cancel',
        Produce:'Produce',
        StartProduce:'StartProduce',
        Defensive:'Defensive',
        Repair:'Repair',
        Die:'Die',
        Attack:'Attack',
        Touch:'Touch',
        LongTouch:'LongTouch',
        Remove:'Remove',
        Pray:'Pray',
        Move:{
            Event:'Building.Move',
            Start:'Start',
            End:'End'
        }
    }
};