var Core  = require('../../NGCore/Client/Core').Core;

exports.EventManager = Core.Class.singleton(
{
    classname:"EventManager",
    
    emitters:[],
    
    get:function (name){
        if(!this.emitters[name]){
            this.emitters[name]=new Core.MessageEmitter();
        }
        return this.emitters[name];
    },
    /**
     * name,param1,param2
     */
    chain:function (){
       this.invoke('chain',arguments);
    },
    /**
     * emittername,listener,listen function
     */
    addListener:function(){
       this.invoke('addListener',arguments);
    },
    removeListener:function(){
        this.invoke('removeListener',arguments);
    },
    invoke:function(method,args){
       var name=args[0],emitter=this.emitters[name];
       if(!emitter){
           emitter=this.emitters[name]=new Core.MessageEmitter();
       }
       args = Array.prototype.slice.call(args, 1); 
       emitter[method]&& emitter[method].apply(emitter,args);
    },
    $Building:{
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
    },
    $Mining:{
        Event:'Mining',
        Create:'Mining.Create',
        Produce:'Mining.Produce'
    },
    $UI:{
        Show:'UI.Show',
        Hide:'UI.Hide'
    },
    $Data:{
        User:{
            Update:"Data.User.Update"
        }
    },
    $Monster:{
        MoveEnd:"Monster.MoveEnd",
        Disappear:"Monster.Disappear"
    }
});