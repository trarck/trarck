(function(){
    yhge.event.TouchActions= {
        
        actionMapping: {
            1:"base",
            2:"longTouch",
            4:"pinch"
        },
        
        base: {
            start: function  (touch) {
                var id=touch.getId();
                //this._fingerNumber++;
                this._trackingId[this._fingerIndex++] = id;
                this._touchStart[id]= {
                    position:touch.getPosition(),
                    timeStamp:Core.Time.getRealTime()
                };
                this._moved=false;
                if(this._fingerIndex==1) {
                    //1st Finger
                    //TODO fire begin event
                }
                //TODO fire start event
            },

            move: function  (touch) {
                //TODO fire move event
            },

            end: function  (touch) {
                var id=touch.getId();
                this._touchEnd[id]= {
                    position:touch.getPosition(),
                    timeStamp:Core.Time.getRealTime()
                };
                //TODO fire end event
            }

        },
        
        longTouch: {
            start: function  (touch) {
                var self=this;
                this._longTouchTimer=setTimeout( function() {
                    self._longTouchTimer=null;
                    //long touch begin
                    var event=new EventObject("longTouchStart",true,true);
                    event.target=touch;
                    self._eventListenerManager.dispatchEvent(self._obj,event);
                },this.duration);
            },

            move: function  (touch) {
                var id=touch.getId();
                //first finger
                if(id==this._trackingId[0]) {
                    var p1=this._touchStart[id].position,p2=touch.getPosition();
                    var distX = p1.getX() - p2.getX();
                    var distY =p1.getY() - p2.getY();
                    if(Math.abs(distX)>this.distance || Math.abs(distY)>this.distance) {
                        clearTimeout(this._longTouchTimer);
                        this._longTouchTimer=null;
                        this._moved=true;
                    }
                }
            },

            end: function  (touch) {
                console.log("end:",this._moved);
                var id=touch.getId();
                if(id==this._trackingId[0]) {
                    if(this._longTouchTimer!=null) {
                        clearTimeout(this._longTouchTimer);
                        this._longTouchTimer=null;
                    }
                    if(!this._moved) {
                        if(this.duration < this._touchEnd[id].timeStamp-this._touchStart[id].timeStamp) {
                            //long touch end
                            var event=new EventObject("longTouchEnd",true,true);
                            event.target=touch;
                            this._eventListenerManager.dispatchEvent(this._obj,event);
                        }
                    }
                }
            }
        },
        
        pinch:{
            start: function  (touch) {
            },

            move: function  (touch) {
                
            },

            end: function  (touch) {
                
            }
        },
        
        gesture:{
            start: function  (touch) {
                
            },

            move: function  (touch) {
                
            },

            end: function  (touch) {
                
            }
        },
        
        //function
        toActions: function (level) {
            var actions;
            if(level) {
                actions=["base"];
                if(level>1) {
                    for(var i in this.actionMapping) {
                        if(level & i) {
                            actions.push(this.actionMapping[i]);
                        }
                    }
                }
            }
            return actions;
        }

    };
})();