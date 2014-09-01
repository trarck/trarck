var UIBuilder = require('./UIBuilder').UIBuilder;
var Class = require('../../../NGCore/Client/Core/Class').Class;

exports.NGUIBuilder = Class.singleton({
	/** @lends UIBuilder.prototype */
	classname: 'NGUIBuilder',
	initialize: function() {
		console.log("@@@@ Dn.NGUIBuilder is deprecated. Please replace with Dn.UIBuilder @@@@");
	},
	buildWithJSONDef: function(controller, aJSONDef) {
		return UIBuilder.buildWithJSONDef(controller, aJSONDef);
	},
	buildUI: function(controller, aJSONDef, parentElem) {
		return UIBuilder.buildUI(controller, aJSONDef, parentElem);
	},
	createUI: function(controller, def, parentElem) {
		return UIBuilder.createUI(controller, def, parentElem);
	},
	setMulti: function(isMulti) {
		UIBuilder.setMulti(isMulti);
	},
	setMultiRightBand: function(bool) {
		UIBuilder.setMultiRightBand(bool);
	},
	createElement: function(tagName) {
		return UIBuilder.createElement(tagName);
	},
	setBeforeActionFilter: function(filter) {
		return UIBuilder.setBeforeActionFilter(filter);
	}
});
