(function(){
    var core=yhge.core;

    var EventListenerManager  =yhge.event.EventListenerManager;
    var EventObject  = yhge.event.EventObject;

    var UIEventObjectManager=yhge.event.UIEventObjectManager=core.Class({
        overrides:{
        
            classname:"UIEventObjectManager",
            
            getEvent:function(type,data,bubbles){
                bubbles=typeof bubbles=='undefined'?true:bubbles;
                var e=new EventObject(type,bubbles,true);//cancelabled
                e.data=data;
                return e;
            },
            getClickEvent:function(data){
                var e=new EventObject("click",true,true);
                e.data=data;
                return e;
            }
        },
        content:{
            Type:{
                Show:"show"
            }
        }
    });
})();