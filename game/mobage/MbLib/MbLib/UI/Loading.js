var Core = require('../../NGCore/Client/Core').Core;
var UI = require('../../NGCore/Client/UI').UI;


var Overlay=require('./Overlay').Overlay;

var Loading=exports.Loading=UI.Spinner.subclass({
    
    initialize: function($super,properties) {
        if (this.constructor._init) this.constructor._init();
        properties=properties||{};
        properties.visible=properties.visible==null?false:properties.visible;
        properties.overlay=properties.overlay==null?true:properties.overlay;
        //如果未设置，则居中
        properties.frame=this.fixPosition(properties.frame);
        
        $super(properties);
        
        this.addToParent(this._overlay.getParent());
    },
    destroy:function($super){
        this._overlay&&this._overlay.destroy();
        $super();
    },
    show:function(){
        this._overlay && this._overlay.show();
        this.setVisible(true);
        return this;
    },
    hide:function(){
        this.setVisible(false);
        this._overlay && this._overlay.hide();
        return this;
    },
    fixPosition:function(frame){
        var w=Core.Capabilities.getScreenWidth(),h=Core.Capabilities.getScreenHeight();
        frame=frame||[0,0,64,64];
        frame[0]=frame[0]==null?(h-frame[2])/2:frame[0];
        frame[1]=frame[1]==null?(w-frame[3])/2:frame[1];
        return frame;
    }
});
// Properties
Loading._init = function() {
    delete Loading._init;
    if (UI.Spinner._init) UI.Spinner._init();
    
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
    this.registerAccessors('overlay', getOverlay, setOverlay);
};