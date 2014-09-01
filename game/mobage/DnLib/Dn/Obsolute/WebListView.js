var UI = require('../../../NGCore/Client/UI').UI;
var AbstractView = require('../../../NGCore/Client/UI/AbstractView').AbstractView;
var Element = require('../../../NGCore/Client/UI/Element').Element;
var Core = require('../../../NGCore/Client/Core').Core;
var utils = require('../utils').utils;

exports.WebListView = Core.Class.subclass(
/** @lends WebListView.prototype */
{
	classname:'WebListView',
	initialize: function(properties) {
	    this._webview = new UI.WebView();
		this._webview.onpageevent = utils.bind(this, function(evt) {
			var data = evt.eventStream;
			if (data == "_loadItems") {
				this._loadItems();
			} else {
			    var keys = data.split(";");
				if (keys.length > 1) {
					this[keys[0]](keys[1]);
				} else {
					this[keys[0]]();
				}
			}
		});
	    //this.addChild(this._webview);

	    var suburl = properties.url;
		this._items = properties.items;
		//relativePathを指定した場合、ローカルのhtmlから読む　
		this._relativePath = properties.relativePath;
		
		for (var key in properties) {
			if (key.indexOf("do") === 0) {
				this[key] = properties[key];
			}
		}
		
		var errors = [];

	    if (suburl === undefined) {
			errors.push("'url'");
	    }
		if (this._items === undefined) {
			errors.push("'items'");
		}
		if (errors.length !== 0) {
			throw "WebListView needs property:" + errors.join(" and ");
		}

		this._url = this._makeUrl(suburl);

		if(this._items) { 
			if(this._relativePath) {
				NgLogD("load local");
				this._webview.loadDocument(this._relativePath);
			} else {
				NgLogD("initial loadUrl");
				this._webview.loadUrl(this._url);
			}
		}
	},
	getItems: function() {
		return this._items;
	},
	updateItems: function(items, suburl) {
		this._url = suburl ? this._makeUrl(suburl) : this._url;
		this._items = items;
		if(this._relativePath) {
			NgLogD("load local");
			this._webview.loadDocument(this._relativePath);
		} else {
			NgLogD("update loadUrl");
			this._webview.loadUrl(this._url);
		}
	},
	getUrl: function() {
		return this._url;
	},
	getWebView: function() {
		return this._webview;
	},
	setFrame: function(rect) {
		this._webview.setFrame(rect);
	},
	_loadItems: function() {
		var json = JSON.stringify({"items":this._items});
		var escaped = json.replace(/'/g, "\\'").replace(/\?/g, "\\?").replace(/\\n/g, " ");
		this._webview.invoke("showItems('" + escaped + "')");
	},
	_makeUrl: function(suburl) {
		var server = Core.Capabilities.getServer();
		var gameurl = Core.Capabilities.getBootGame();
		if (suburl.charAt(0) == "/") {
			return server + "/" + gameurl + suburl;
		} else {
			return server + "/" + gameurl + "/" + suburl;
		}
	},
	destroy: function() {
		this._webview.destroy();
	}
});
