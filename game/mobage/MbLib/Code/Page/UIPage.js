var Device = require('../../NGCore/Client/Device').Device;
var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;
var UI = require('../../NGCore/Client/UI').UI;

var ButtonFactory = require('../ButtonFactory').ButtonFactory;
var PageBase = require('./PageBase').PageBase;

exports.UIPage=PageBase.subclass({
    
    initialize: function($super,propertis) {
        if (this.constructor._init) this.constructor._init();
        $super(propertis);
        this.createItems();
    },
    createItems:function  () {
    },
    createItems:function  () {
        var self=this;
        var h = Core.Capabilities.getScreenWidth();
        var w = Core.Capabilities.getScreenHeight();
        //back to root
        ButtonFactory.getButton("root",[w/2-32,10,64,64],function(){
            self._navController.backToView(self._root);
        },this);
        
        var view=new UI.View({
            frame:[100,100,200,200],
            gradient:{
                    'gradient': ["FF50 0.0", "FF00 1.0"],
                    'outerLine': 'FFFF 5.0',
                    'corners': '15',
                    'insets': "{5,5,5,5}",
                    'outerShadow': 'FF00 5.0 {0,-2}',
            }
        });
        this.addChild(view);
    }

});