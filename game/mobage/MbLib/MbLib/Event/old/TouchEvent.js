var Core  = require('../../NGCore/Client/Core').Core;
var Util  = require('../Util').Util;

var uuid=0,events={};

var TouchEvent=exports.TouchEvent=Core.MessageListener.singleton({

    add:function  (node,handler,touchTarget,scope,params) {
        var id=node._touchEventId;
        if(!id){id=node._touchEventId=++uuid};
        var event=events[id];
        if(event) return;
        
        if(Util.isPlainObject(touchTarget)){
            var touchConf=touchTarget;
            touchTarget=new GL2.TouchTarget();
            touchTarget.setSize(touchConf.size).setAnchor(touchConf.anchor).setPosition(touchConf.position).setDepth(touchConf.depth);
            node.addChild(touchTarget);
        }

        event={
            handler:handler,
            scope:scope,
            touchTarget:touchTarget,
            params:params
        };
        events[id]=event;
        
        touchTarget && touchTarget.getTouchEmitter().addListener(this,function(touch){
            touch.bubbles=true;
            touch.stopPropagation=stopPropagation;
            // //handle target event
            // event.handler.apply(event.scope,[touch,event.params]);
            //bubble
            var parent=node,event;//node.getParent();
            while(touch.bubbles && parent){
                if(parent._touchEventId){
                    event=events[parent._touchEventId];
                    event.handler.apply(event.scope,[touch,event.params]);
                }
                parent=parent.getParent && parent.getParent();
            }
            if(touch.getAction()==touch.Action.Start){
                return true;
            }
        });
    },

    remove:function  (node) {
        if(node._touchEventId){
            delete events[node._touchEventId];
            delete node._touchEventId;
        }
    },
    handle:function(touch){
        var event=events[this._touchEventId];
        touch.bubbles=true;
        event.handler.apply(event.scope,[touch,event.params]);
    },
    dispatch:function(event){
        
    },
    _fixTouch:function(touch){
        touch.bubbles=true;
        touch.stopPropagation=stopPropagation;
        return touch;
    }
});
function fixTouch(touch){
    touch.bubbles=true;
    touch.stopPropagation=stopPropagation;
    return touch;
}
function stopPropagation() {
    this.bubbles= false;
}