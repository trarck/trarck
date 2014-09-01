var Class = require('../../../NGCore/Client/Core/Class').Class;
var NGUI = require('../../../NGCore/Client/UI').UI;


exports.Window = Class.subclass(
/** @lends Window.prototype */
{
	classname: 'Window',
	/**
	 * @class Common methods for window class.
	 *		This class is derived to use.
	 */
	initialize: function(type) {
		this.winObj = undefined;
		this.winOpenFlag = false;
		this.width = undefined;
		this.height = undefined;
		this.originX = undefined;
		this.originY = undefined;
		this.action = undefined;	// slide or popup
	},

	/**
	 *
	 */
	open: function() {
		if (this.winOpenFlag === true) { return; }
		
		this.drawWindow();
		this.winOpenFlag = true;
	},

	/**
	 *
	 */
	close: function() {
		if (this.winOpenFlag === false) { return; }
		
		this.removeElement(this.winObj);
		this.winOpenFlag = false;
	},
	
	/**
	 *
	 */
	drawWindow: function() {},

	/**
	 *
	 */
	createElement: function(parent, type, attrs) {
		var elm = NGWindow.document.createElement(type);
		
		for (var key in attrs) {
			elm.setAttribute(key, attrs[key]);
		}
		parent.addChild(elm);
		return elm;
	},
	/**
	 *
	 */
	removeElement: function(elm) {
		return NGWindow.document.removeChild(elm);
	},
	/**
	 *
	 */
	moveTo: function(newOriginX, newOriginY) {
		var that = this;
		this.winObj.animate(function() {
			that.winObj.setAttribute('frame', [newOriginX, newOriginY, that.width, that.height]);
		});
	},

	/**
	 *
	 */
	centerScale: function(newWidth, newHeight) {
		var that = this;
		var centerWidth = (NGWindow.outerWidth - newWidth) / 2;
		var centerHeight = (NGWindow.outerHeight - newHeight) / 2;
		this.winObj.animate(function() {
			that.winObj.setAttribute('frame', [centerWidth, centerHeight, newWidth, newHeight]);
		});
	}
});


exports.WindowManager = Class.singleton(
/** @lends WindowManager */
{
	classname: 'WindowManager',
	/** 
	 * @class Manage windows in the game.
	 */
	initialize: function() {
		this._windows = [];
	},
	/**
	 *
	 */
	pushWindow: function(dnWin) {
		this.windows.push(dnWin);
		dnWin.open();
	},
	/**
	 *
	 */
	popWindow: function(dnWin) {
		this.windows.pop(dnWin);
		dnWin.close();
	}
});
