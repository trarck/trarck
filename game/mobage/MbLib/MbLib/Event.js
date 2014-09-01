var Core  = require('../NGCore/Client/Core').Core;

var uuid=0,events= {};
var Core  = require('../../NGCore/Client/Core').Core;

var uuid=0,events= {};

var Event=exports.Event=Core.MessageListener.singleton({

    add: function  (node,type,handler,scope,data) {
        var id=node._eventId;
        if(!id) {
            id=node._eventId=++uuid
        };

        var nodeEvents=events[id];

        var listeners=nodeEvents[type];

        if(listeners){
            if(!this.isListened(listeners,handler)) {
                var listener= {
                    handler:handler,
                    scope:scope,
                    params:data
                };
                listeners.push(listener);
            }
        }else{
            if(type=="touch"){
                var touchTarget=new GL2.TouchTarget();
                touchTarget.setSize(touchConf.size).setAnchor(touchConf.anchor).setPosition(touchConf.position).setDepth(touchConf.depth);
                node.addChild(touchTarget);
            }
        }
    },
    
    remove: function  (node,type,handler) {
        if(node._eventId) {
            var nodeEvents=events[node._eventId];
            if(nodeEvents) {
                //有node对应的事件
                if(type) {
                    var listeners=nodeEvents[type];
                    if(listeners) {
                        //某事件有listeners
                        if(handler) {
                            //删除事件中的handler
                            var i=this.getHandlerIndex(listeners,handler);
                            if(i>0) {
                                listeners.splice(i,1);
                            }
                        } else {
                            //删除事件的所有handler，即删除node的type事件。
                            delete nodeEvents[type]
                        }
                    }
                } else {
                    //TODO remove all
                }
            }

        }
    },

    handle: function(node,event) {
        args = Array.prototype.slice.call( arguments, 1 );
        var event=args[0];
        if(node._eventId) {
            var nodeEvents=events[node._eventId];
            if(nodeEvents && type) {
                var listeners=nodeEvents[type];
                if(listeners) {
                    var listener;
                    for(var i=0,l=listeners.length;i<l;i++) {
                       listener=listeners[i];
                       listener.handler.apply(listener.scope,listener.param);
                    }
                }
            }
        }
    },

    dispatch: function(node,event) {
        while(node){
            if(event.bubbles==false) break;
            this.handle(node,event);
            node=node.getParent && node.getParent();
        }
    },

    _fixEvent: function(event) {
        event.bubbles=true;
        event.stopPropagation=stopPropagation;
        return event;
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
function fixTouch(touch) {
    touch.bubbles=true;
    touch.stopPropagation=stopPropagation;
    return touch;
}

function stopPropagation() {
    this.bubbles= false;
}