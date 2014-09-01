(function(){
    var core=yhge.core;

    var EventObject  = yhge.event.EventObject;
    var TouchActions  = yhge.event.TouchActions;

    var TouchHandler=exports.TouchHandler=core.Class({overrides:{

        classname:"TouchHandler",
        
        duration:3000,

        distance:10,

        initialize: function(eventListenerManager,obj,actions) {
            this._eventListenerManager=eventListenerManager;
            this._obj=obj;
            this._fingerIndex=0;
            //this._fingerNumber=0;
            this._trackingId=[];
            this._touchStart={};
            this._touchEnd={};

            this._actions=[];
            actions&&this.addActions(actions);
        },
        /**
         * base is first
         */
        addActions:function  (actions) {
            if(!actions) return;
            //transform
            if(typeof actions=="number"){
                actions=TouchActions.toActions(actions);
            }
            
            for(var i=0,l=actions.length;i<l;i++){
                if(typeof actions[i]=="string"){
                    this.addAction(TouchActions[actions[i]]);
                }else{
                    this.addAction(actions[i]);
                }
            }
        },

        addAction:function(action,i){
            if(!action || this._actions.indexOf(action)>-1) return;
            
            if(i==null){
                this._actions.push(action);
            }else{
                this._actions.splice(i,0,action);
            }
        },
        setAction:function(action,i){
            if(!action || i==null) return;
            var p=this._actions.indexOf(action);
            if(p>-1){
                this._actions.splice(p,1);
            }
            this._actions.splice(i,0,action);
        },
        actionExit:function  (touch) {
            var id=touch.getId(),i=this._trackingId.indexOf(id);
            if(i>-1){
                this._trackingId.splice(i,1);
                delete this._touchStart[id];
                delete this._touchEnd[id];
            
            
                this._fingerIndex--;

                if(this._fingerIndex==0){
                    //all finger removed
                    //TODO fire exit event
                }
            }
        },
      
        onTouch:function  (touch) {
            //base event
            var event=new EventObject("touch",true,true);
            event.target=touch;
            this._eventListenerManager.dispatchEvent(this._obj,event);
            
            switch(touch.getAction()){
                case touch.Action.Start:
                    for(var i in this._actions){
                        if(this._actions[i].start){
                            this._actions[i].start.call(this,touch);
                        }
                    }
                    return true;
                    break;
                case touch.Action.End:
                    for(var i in this._actions){
                        if(this._actions[i].end){
                            this._actions[i].end.call(this,touch);
                        }
                    }
                    this.actionExit(touch);
                    break;
                case touch.Action.Move:
                    for(var i in this._actions){
                        if(this._actions[i].move){
                            this._actions[i].move.call(this,touch);
                        }
                    }
                    break;
            }
            console.log(this);
        },
        
        getLongTouchEvent:function  (target) {
            var event=new EventObject("longTouch",true,true);
            event.target=target;
            return event;
        },

        _calcDist: function( p1, p2 ) {
            var distX = p1.getX() - p2.getX();
            var distY = p1.getY() - p2.getY();
            var dist = distX * distX + distY * distY;
            return Math.sqrt(dist);
        }
    }});
})();