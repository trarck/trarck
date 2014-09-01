var Core  = require('../../NGCore/Client/Core').Core;

var EventObject  = require('./EventObject').EventObject;

var TouchEvent=exports.TouchEvent=EventObject.subclass({
    
    classname:"TouchEvent",
    
    initialize:function  (touch,canBubbles,cancelable) {
        this.initTouchEvent(touch,true,true);
    },
    initEvent:function($super,type,canBubbles,cancelable){
        $super(type,canBubbles,cancelable);
    },
    initTouchEvent:function(touch,canBubbles,cancelable){
        this.initEvent("touch",canBubbles,cancelable);
        var positoin=touch.getPosition();
        this.screenX=positoin.getX();
        this.screenY=position.getY();
    }

});