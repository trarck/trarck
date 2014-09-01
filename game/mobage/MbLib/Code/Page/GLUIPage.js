var Device = require('../../NGCore/Client/Device').Device;
var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;
var UI = require('../../NGCore/Client/UI').UI;

var ButtonFactory = require('../ButtonFactory').ButtonFactory;
var PageBase = require('./PageBase').PageBase;

exports.GLUIPage=PageBase.subclass({
    
    initialize: function($super,propertis) {
        if (this.constructor._init) this.constructor._init();
        $super(propertis);
        this.createItems();

    },
    createItems:function  () {
        var self=this;
        var h = Core.Capabilities.getScreenWidth();
        var w = Core.Capabilities.getScreenHeight();
        //back to root
        ButtonFactory.getButton("root",[w/2-32,10,64,64],function(){
            self._navController.backToView(self._root);
        },this);
        

        
    }


});