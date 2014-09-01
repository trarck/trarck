var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;

var Util = require('../Util').Util;

exports.NineComponent=Component.subclass({

    classname:"NineComponent",

    initialize: function($super,properties) {
        $super(properties);
        
    },
    setBackground:function(background){
        if(background.image){
            this.setImage(background.image);
        }
    },
    setNineGrid:function(conf){
        
    }
    
});