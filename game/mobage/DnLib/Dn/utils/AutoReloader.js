var Class = require('../../../NGCore/Client/Core/Class').Class;
var FileSystem = require('../../../NGCore/Client/Storage/FileSystem').FileSystem;


exports.AutoReloader = Class.subclass(
/** @lends AutoReloader.prototype */
{
	classname: 'AutoReloader',
	/**
	 * @class
	 */
	initialize: function(onReloadFunc, interval) {
		this._onReloadFunc = onReloadFunc;
		this._ongoing = true;
		this._interval = interval || 1000;
		this._path = "reload.txt";
		this._start();
	},
	/**
	 *
	 */
	_processReloadFile: function(filePath) {
		FileSystem.readFile(filePath, false, function(err, data) {
			if(err) { return; }

			NgLogD("readFile: success");
			this._ongoing = false;
			fileSys.deleteFile(filePath, function() {
				this._onReloadFunc(data);
				this._ongoing = true;
			}.bind(this));
		}.bind(this));
	},
	_start: function() {
		var update = function() {
			if(!this._ongoing) { return; }
			this._processReloadFile(this._path);
		}.bind(this);
		setInterval(update, this._interval);
	}
});
