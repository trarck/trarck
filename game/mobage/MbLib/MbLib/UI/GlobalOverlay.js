var Core = require('../../NGCore/Client/Core').Core;
var UI = require('../../NGCore/Client/UI').UI;

exports.Overlay=UI.View.subclass({

    _layer:UI.Window.Layer.Overlay,

    initialize: function($super,properties) {
        properties=properties||{};
        var w,h;
        if(Device.OrientationEmitter.getInterfaceOrientation()==Device.OrientationEmitter.Orientation.LandscapeLeft){
            h=Core.Capabilities.getScreenWidth();
            w=Core.Capabilities.getScreenHeight();
        }else{
            w=Core.Capabilities.getScreenWidth();
            h=Core.Capabilities.getScreenHeight();
        }
        properties.backgroundColor=properties.backgroundColor||"7FCC";
        properties.frame=[0,0,w,h];
        properties.visible=properties.visible==null?false:properties.visible;
        $super(properties);
        UI.Window.getLayer(this._layer).addChild(this);
    },
    show:function(){
        this.setVisible(true);
    },
    hide:function(){
        this.setVisible(false);
    }
});