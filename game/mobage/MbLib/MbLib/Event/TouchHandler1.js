var Core  = require('../../NGCore/Client/Core').Core;

var Util  = require('../Util').Util;

var EventObject  = require('./EventObject').EventObject;
var NgEventListenerManager  = require('./NgEventListenerManager').NgEventListenerManager;

var TouchHandler=Core.Class.subclass({

    classname:"TouchHandler",
    
    duration:3000,

    distance:10,

    initialize: function(obj) {
		this._obj=obj;
        this._fingerIndex=0;
        //this._fingerNumber=0;
        this._trackingId=[];
        this._touchStart={};
        this._touchEnd={};
	},
    baseActionStart:function  (touch) {
        var id=touch.getId();
        //this._fingerNumber++;
        this._trackingId[this._fingerIndex++] = id;
        this._touchStart[id]={position:touch.getPosition(),timeStamp:Core.Time.getRealTime()};
        this._moved=false;
        if(this._fingerIndex==1){
            //1st Finger 
            //TODO fire begin event
        }
        //TODO fire start event
    },
    baseActionMove:function  (touch) {
        //TODO fire move event
    },
    baseActionEnd:function  (touch) {
        var id=touch.getId();
        this._touchEnd[id]={position:touch.getPosition(),timeStamp:Core.Time.getRealTime()};
        //TODO fire end event
    },
    baseActionExit:function  (touch) {
        var id=touch.getId(),i=this._trackingId.indexOf(id);
        if(i>-1){
            this._trackingId.splice(i,1);
            delete this._touchStart[id];
            delete this._touchEnd[id];
        }
        
        this._fingerIndex--;

        if(this._fingerIndex==0){
            //all finger removed
            //TODO fire exit event
        }
    },
    longTouchActionStart:function  (touch) {
        var self=this;
        this._longTouchTimer=setTimeout(function(){
            self._longTouchTimer=null;
            //long touch begin
            var event=new EventObject("longTouchStart",true,true);
            event.target=touch;
            NgEventListenerManager.dispatchEvent(self._obj,event);
        },this.duration);
    },
    longTouchActionMove:function  (touch) {
        var id=touch.getId();
        //first finger
        if(id==this._trackingId[0]){
            var p1=this._touchStart[id].position,p2=touch.getPosition();
            var distX = p1.getX() - p2.getX();
            var distY =p1.getY() - p2.getY();
            if(Math.abs(distX)>this.distance || Math.abs(distY)>this.distance){
                clearTimeout(this._longTouchTimer);
                this._longTouchTimer=null;
                this._moved=true;
            }
        }
    },
    longTouchActionEnd:function  (touch) {
        var id=touch.getId();
        if(id==this._trackingId[0]){
            if(this._longTouchTimer!=null){
                clearTimeout(this._longTouchTimer);
                this._longTouchTimer=null;
            }
            if(!this._moved){
                if(this.duration < this._touchEnd[id].timeStamp-this._touchStart[id].timeStamp){
                    //long touch end
                    var event=new EventObject("longTouchEnd",true,true);
                    event.target=touch;
                    NgEventListenerManager.dispatchEvent(this._obj,event);
                }
            }
        }
    },
    //origenal 
    onTouchLevel1:function  (touch) {
        var event=new EventObject("touch",true,true);
        event.target=touch;
        NgEventListenerManager.dispatchEvent(this._obj,event);
        if(touch.getAction() ==touch.Action.Start) return true;
    },
    //base
    onTouchLevel2:function  (touch) {
        var event=new EventObject("touch",true,true);
        event.target=touch;
        NgEventListenerManager.dispatchEvent(this._obj,event);
        switch(touch.getAction()){
            case touch.Action.Start:
                this.baseActionStart(touch);
                return true;
                break;
            case touch.Action.End:
                this.baseActionEnd(touch);
                this.baseActionExit(touch);
                break;
            case touch.Action.Move:
                this.baseActionMove(touch);
                break;
        }
    },
    //long touch
    onTouchLevel3:function  (touch) {
        var event=new EventObject("touch",true,true);
        event.target=touch;
        NgEventListenerManager.dispatchEvent(this._obj,event);
        switch(touch.getAction()){
            case touch.Action.Start:
                this.baseActionStart(touch);
                this.longTouchActionStart(touch);
                return true;
                break;
            case touch.Action.End:
                this.baseActionEnd(touch);
                this.longTouchActionEnd(touch);
                this.baseActionExit(touch);
                break;
            case touch.Action.Move:
                this.baseActionMove(touch);
                this.longTouchActionMove(touch);
                break;
        }
    },
    onTouchAction:function  (touch) {

        switch(touch.getAction()){
            case touch.Action.Start:
                for(var i in this._actions){
                    if(this._actions[i].start){
                        this._actions[i].start(touch);
                    }
                }
                this.baseActionStart();
                this.longTouchActionStart();
                return true;
                break;
            case touch.Action.End:
                for(var i in this._actions){
                    if(this._actions[i].end){
                        this._actions[i].end(touch);
                    }
                }
                this.baseActionExit();
                break;
            case touch.Action.Move:
                for(var i in this._actions){
                    if(this._actions[i].move){
                        this._actions[i].move(touch);
                    }
                }
                break;
        }
    },
    onTouch:function(touch){
        switch(touch.getAction()){
            case touch.Action.Start:
                if(!this._trackingId){
                    this._trackingId = touch.getId();
                    this._touchStart={position:touch.getPosition(),timeStamp:Core.Time.getRealTime()};
                    this._moved=false;

                    this._timer=setTimeout(function(){
                        this._timer=null;
                        //long touch begin
                        var event=new EventObject("longTouchStart",true,true);
                        event.target=touch;
                        NgEventListenerManager.dispatchEvent(this._obj,event);
                    },this.duration);
                }
                return true;
                break;
            case touch.Action.End:
                if(this._trackingId != touch.getId()) return false;
                this._touchEnd={position:touch.getPosition(),timeStamp:Core.Time.getRealTime()};
                
                if(this._timer!=null) clearTimeout(this._timer);
                if(!this._moved){
                    if(this.duration < this._touchEnd.timeStamp-this._touchStart.timeStamp){
                        //long touch end
                        var event=new EventObject("longTouchEnd",true,true);
                        event.target=touch;
                        NgEventListenerManager.dispatchEvent(this._obj,event);
                    }
                }
                this._trackingId=NaN;
                break;
            case touch.Action.Move:
                if(this._trackingId != touch.getId()) return false;
                var p1=this._touchStart.position,p2=touch.getPosition();
                var distX = p1.getX() - p2.getX();
                var distY =p1.getY() - p2.getY();
                if(Math.abs(distX)>this.distance || Math.abs(distY)>this.distance){
                    clearTimeout(this._timer);
                    this._timer=null;
                    this._moved=true;
                }
                break;
        }
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
	},
});