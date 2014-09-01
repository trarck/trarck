var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;

var Util = require('../Util').Util;

exports.Panel=Component.subclass({

    classname:"Panel",

    initialize: function(properties) {
        this.setAttributes(properties);
    },
});