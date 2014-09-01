var Device = require('../../NGCore/Client/Device').Device;
var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;
var UI = require('../../NGCore/Client/UI').UI;

var ButtonFactory = require('../ButtonFactory').ButtonFactory;
var PageBase = require('./PageBase').PageBase;

var MainPage=exports.MainPage=PageBase.subclass({
    
    initialize: function($super,propertis) {
        if (this.constructor._init) this.constructor._init();
        $super(propertis);
        this.createItems();
    },
    createItems:function  () {
        var h = Core.Capabilities.getScreenWidth();
        var w = Core.Capabilities.getScreenHeight();
       // back 
       ButtonFactory.getButton("X",[w-64,10,64,64],function(){
            var LGL = require('../../NGCore/Client/Core/LocalGameList').LocalGameList;
            LGL.runUpdatedGame('/Samples/Launcher');
       },this);
       //reload 
       ButtonFactory.getButton("R",[w-140,10,64,64],function(){
            var LGL = require('../../NGCore/Client/Core/LocalGameList').LocalGameList;
            LGL.runUpdatedGame('/Project/MbLib');
       },this);
    }
});
// Properties
MainPage._init = function() {
    delete MainPage._init;
    if (PageBase._init) PageBase._init();
};