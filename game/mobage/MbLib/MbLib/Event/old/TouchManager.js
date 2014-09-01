var Core  = require('../../NGCore/Client/Core').Core;
var Util  = require('../Util').Util;

var uuid=0,events={};

var TouchManager=exports.TouchManager=Core.MessageListener.singleton({

    add:function  (node,handler,touchTarget,params,scope) {
       
        
        if(Util.isPlainObject(touchTarget)){
            var touchConf=touchTarget;
            touchTarget=new GL2.TouchTarget();
            touchTarget.setSize(touchConf.size).setAnchor(touchConf.anchor).setPosition(touchConf.position).setDepth(touchConf.depth);
            node.addChild(touchTarget);
        }
        touchTarget && touchTarget.getTouchEmitter().addListener(this,function(touch){
            handler.apply(scope,[touch]);
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