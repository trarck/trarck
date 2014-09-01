var Core = require('../NGCore/Client/Core').Core;
var UI = require('../NGCore/Client/UI').UI;

var Panel=UI.View.subclass({

    initialize: function($super,properties) {
        if (Panel._init) Panel._init();
        properties=properties||{};
        properties.visible=properties.visible==null?false:properties.visible;
        $super(properties);
        this.setCloseButton();
    },
    destroy:function($super){
        $super();
    },
    show:function(){
        this._overlay && this._overlay.show();
        this.setVisible(true);
    },
    hide:function(){
        this.setVisible(false);
        this._overlay && this._overlay.hide()
    },
    setCloseButton:function(){
        var pFrame=this.getFrame(),self=this;
        this._closeButton=new UI.Button({
            image:'./Content/no.png',
            frame:[pFrame[2]-40,6,32,32],
            onClick:function(){
                self.hide();
            }
        });
        this.addChild(this._closeButton);
    }
});
// Properties
Panel._init = function() {
    delete Panel._init;
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
    Panel.registerAccessors('overlay', getOverlay, setOverlay);
};
