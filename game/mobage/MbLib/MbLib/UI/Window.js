var Core = require('../../NGCore/Client/Core').Core;
var UI = require('../../NGCore/Client/UI').UI;


var Overlay=require('./Overlay').Overlay;

var Window=exports.Window=UI.View.subclass({

    initialize: function($super,properties) {
        if (this.constructor._init) this.constructor._init();
        properties=properties||{};
        properties.visible=properties.visible==null?false:properties.visible;
        //如果未设置，则居中
        properties.frame=this.fixPosition(properties.frame);
        
        $super(properties);
        
        this.setCloseButton();

        if(this._overlay){
            this.addToParent(this._overlay.getParent());
        }else{
            this.addToParent(UI.Window.getLayer(UI.Window.Layer));
        }
    },
    destroy:function($super){
        $super();
    },
    fixPosition:function(frame){
        var w=Core.Capabilities.getScreenWidth(),h=Core.Capabilities.getScreenHeight();
        frame[0]=frame[0]==null?(h-frame[2])/2:frame[0];
        frame[1]=frame[1]==null?(w-frame[3])/2:frame[1];
        return frame;
    },
    show:function(){
        this._overlay && this._overlay.show();
        this.setVisible(true);
        //animate
        if(UIFx){
            var frame=this.getFrame(),y=frame[1];
            frame[1]-=100;
            this.setFrame(frame);
            UIFx.animate(this,{y:y},200,"easeOutQuint");
        }
    },
    hide:function(){
        if(UIFx){
            var frame=this.getFrame(),y=frame[1];
            UIFx.animate(this,{y:y-100},200,"easeInQuint",function(){
                this.setVisible(false);
                this._overlay && this._overlay.hide();
                frame[1]=y;
                this.setFrame(frame);
            }.bind(this));
        }else{
            this.setVisible(false);
            this._overlay && this._overlay.hide();
        }
    },
    setCloseButton:function(){
        var pFrame=this.getFrame(),self=this;
        this._closeButton=new UI.Button({
            image:'./Content/UI/Window/close.png',
            frame:[pFrame[2]-40,6,32,32],
            onClick:function(){
                self.hide();
            }
        });
        this.addChild(this._closeButton);
    }
});
// Properties
Window._init = function() {
    delete Window._init;
    if (UI.View._init) UI.View._init();
    
    //overlay
    var getOverlay=function(){
        return this._overlay;
    };
    var setOverlay=function(overlay){
        if(overlay instanceof Overlay){
            this._overlay=overlay;
        }else if(overlay==true && this._overlay==null){
            this._overlay=new Overlay();
        }else{
            this._overlay=null;
        }
    };
    Window.registerAccessors('overlay', getOverlay, setOverlay);
    //动画效果的偏移
    Window.synthesizeProperty('fxOffset');
};