var Core = require('../NGCore/Client/Core').Core;
var UI = require('../NGCore/Client/UI').UI;

exports.Overlay=UI.View.subclass({

    initialize: function($super,properties) {
        properties=properties||{};
        properties.backgroundColor=properties.backgroundColor||"7FCC";
        properties.frame=properties.frame||this._getScreenFrame();
        properties.visible=properties.visible==null?false:properties.visible;
        $super(properties);
    },
    show:function(){
        this.setVisible(true);
    },
    hide:function(){
        this.setVisible(false);
    },
    render:function  (container) {
        if(container){
            container.addChild(this);
        }else{
            UI.Window.getLayer(UI.Window.Layer.Overlay).addChild(this);
        }
    },
    _getScreenFrame:function(){
        var w,h;
        if(Device.OrientationEmitter.getInterfaceOrientation()==Device.OrientationEmitter.Orientation.LandscapeLeft){
            h=Core.Capabilities.getScreenWidth();
            w=Core.Capabilities.getScreenHeight();
        }else{
            w=Core.Capabilities.getScreenWidth();
            h=Core.Capabilities.getScreenHeight();
        }
        return [0,0,w,h];
    }
});