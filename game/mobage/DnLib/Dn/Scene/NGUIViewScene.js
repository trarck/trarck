var UIViewScene = require('./UIViewScene').UIViewScene;

exports.NGUIViewScene = UIViewScene.subclass(
/** @lends NGUIViewScene.prototype */
{
	classname: 'NGUIViewScene',
	initialize: function($super, aJSONDef) {
		console.log("@@@@@@@@ Dn.NGUIViewScene is deprecated. Please replace with Dn.NGUIViewScene @@@@@@@@");
		$super(aJSONDef);
	}
});

