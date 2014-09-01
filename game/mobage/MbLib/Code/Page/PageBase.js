var Device = require('../../NGCore/Client/Device').Device;
var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;
var UI = require('../../NGCore/Client/UI').UI;

var ButtonFactory = require('../ButtonFactory').ButtonFactory;

var PageBase=exports.PageBase=UI.View.subclass({
    
    initialize: function($super,properties) {
        if (this.constructor._init) this.constructor._init();
        $super(properties);
    },
    createItems:function () {
        
    }
    
});
// Properties
PageBase._init = function() {
    delete PageBase._init;
    if (UI.View._init) UI.View._init();
    
    //root
    PageBase.synthesizeProperty('root');
    PageBase.synthesizeProperty('navController');
};