var Core 	= require('../../../NGCore/Client/Core').Core;
var UI 		= require('../../../NGCore/Client/UI').UI;
var Device 	= require('../../../NGCore/Client/Device').Device;
var Storage = require('../../../NGCore/Client/Storage').Storage;
var toMD5 	= require('../../../NGCore/Client/Core/toMD5').toMD5;
var OrientationEmitter 	= require('../../../NGCore/Client/Device/OrientationEmitter').OrientationEmitter;

var utils = require('../utils').utils;
var LifecycleEventSorter = require('../Core/LifecycleEventSorter').LifecycleEventSorter;

/**
 * イベント・メンテナンス告知機能
 * @see http://trac.mininat.com/trac/minination/wiki/EventNotifier
 */
exports.EventNotifier = Core.Class.subclass({
/** @lends Dn.Internal.EventNotifier.prototype */

	classname  : 'EventNotifier',

	JSON_NAME : '.dn_eventurl.json',

	/** 通知すべきデータがある場合、その通知前と通知後にCallBackを指定する */
	defaultNoticeCallBack : {
		before : function(){
			NgLogD("*** noticeCallBack.before");
		}, 
		after : function(){
			NgLogD("*** noticeCallBack.after");
		},
		none : function(){
			NgLogD("*** noticeCallBack.none notice");
		}
	},
	
	/** 右上に閉じるボタン、画面下へ「今後この通知を表示しない」checkbox を配置したWebViewを表示する画面JSON */
	defaultDialogJSON : {
		"EventDialog": [
			{
				"name": "base_view",
				"type": "view",
				"attrs": {
					"frame":[0,0,480,320]
				},
				"children": [
					{
						"name": "webview",
						"type": "webview",
						"attrs": {
							"frame": [40, 20, 440, 280]
						}
					},
					{
						"name": "checkbox_ev",
						"type": "checkbox",
						"attrs": {
							"frame": [80, 240, 35, 35]
						},
						"action": "lvl_checkbox"
					},
					{
						"name": "checkbox_lb",
						"type": "textarea",
						"attrs": {
							"frame": [120, 240, 200, 35],
							"textSize": "16",
							"text": "今後この通知を表示しない"
						}
					},
					{
						"name": "close",
						"type": "button",
						"attrs": {
							"text": "X",
							"gradient": {
								"corners"  : '7',
								"corners"  : '4 4 4 4',
								"gradient" : [ 'FFF0 0.0', 'FFA0 1.0' ],
								"innerShadow": '8000 2.0 {0,1}',
								"innerLine": 'FF80 2.0'
							},
							"frame": [440, 20, 40, 30]
						},
						"action": "close"
					}
				]
			}
		]
	},

	/**
	 * @constructs The default constructor.
	 * @augments Core.Class
	 * @param {Dn.Request} request
	 * @param {String}     srvAPIName
	 * @param {Array}      frame
	 * @param {Object}     JSONDef
	 */
	initialize : function(request, srvAPIName, aJSONDef, aNoticeCallBack) {
		this.request = request;
		this.srvAPIName = srvAPIName;
		this.JSONDef = aJSONDef || this.defaultDialogJSON;
		this._popupViews = {};
		this._noticeCallBack = aNoticeCallBack || this.defaultNoticeCallBack;
	},

	/**
	 * 
	 */
	startCheckNotice : function() {
		
		// if already start
		if (this._lifecycleListener) {
	        NgLogD("[EventNotifier] LifecycleListener already init");
			return;
		}
		
		this.confirmNotice();

		var self = this;
		LifecycleEventSorter.addListener({
			onResume : function(chain){
				self._chain = chain;
				self.confirmNotice();
			}
		});
		
	},

	/**
	 *
	 */
	confirmNotice : function(){
		var self = this;
		this.request.post(this.srvAPIName, {
			data : {
				device_name : Core.Capabilities.getPlatformOS()
			},
			success : function(req){
				Storage.FileSystem.readFile(self.JSON_NAME,
						false,
						self._readURLJSON.bind( self, req)
					);

			},
			failure : function(req) {
				NgLogE("[EventNotifier] failure = " + req.responseText);
				self._nextChain();
			}
		});
	},

	/**
	 * 
	 */
	_readURLJSON : function (req, error, value){
		NgLogD("[EventNotifier] ServerAPI response = \n" + req.responseText);
		var json;
		try {
			json = JSON.parse(req.responseText);
		} catch (e) {
			NgLogException(e);
			this._nextChain();
			return;
		}
		var NOTICES = json.NOTICES;
		if (!json.success || NOTICES.length == 0) {
			NgLogD("[EventNotifier] NOTICES.length ="+ NOTICES.length);
			this._nextChain();
			return;
		}

		NgLogD("[EventNotifier] NOTICES.value = " + value);
		if (error) {
			NgLogD("[EventNotifier] read error = " + error);
		}

		this.readURLs = [];
		if( value && !error ){
			try {
				this.readURLs = JSON.parse(value);
			} catch (e) {
				NgLogException(e);
				this.readURLs = [];
			}
		}

		var isShow = false;

		var self = this;
		utils.each(NOTICES, function(i) {
			var md5 = toMD5(i.start_date + i.notice_url);
			if (!self._isRead(self.readURLs, md5)) {
				var value = {
						update : self._updateDay(),
						url : md5
					};
				if (!isShow) {
					self._noticeCallBack.before();
				}
				self._showScene(i.notice_url, value);
				isShow = true;
			}
		});
		
		if (!isShow) {	// show した場合は「閉じる」際に
			self._noticeCallBack.none();
			this._nextChain();
		}
	},
	
	/**
	 * 
	 */
    _isRead : function(readURLs, key){
		var length = readURLs.length;
		for( var i=0; i<length; i++ ){
			if( readURLs[i].url == key){
				return true;
			}
		}
		return false;
    },

	/**
	 *
	 */
	_saveURL : function(){
		var length = this.readURLs.length;
		NgLogD("[EventNotifier] this.readURLs = " + JSON.stringify(this.readURLs));
		var lastYear = this._lastYear();
		NgLogD("[EventNotifier] lastYear = " + lastYear);
		
		var saveURLs = [];
		for( var i=0; i<length; i++ ){
			if( this.readURLs[i].update > lastYear){
				saveURLs.push(this.readURLs[i]);
			}else{
				NgLogD("[EventNotifier] delete =" +this.readURLs[i].update);
			}
		}
		var jsondata = JSON.stringify(saveURLs);
		Storage.FileSystem.writeFile(this.JSON_NAME,
			jsondata,
			false,
			function(error,key){
				NgLogD("[EventNotifier] write complate = " + jsondata);
			}
		);
	},

	/**
	 *
	 */
	_showScene : function (url, value){
		var dialog = new EventDialog(this, url, value);
		dialog.onEnter();
		this._popupViews[url] = dialog;
	},

	/**
	 * 
	 */
	destroy: function() {
		for (var i in this._popupViews) {
			this._popupViews[i].onExit();
		}
	},
	
	/**
	 * 
	 */
	_updateDay : function() {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		return this._getDay(year, month, day);
	},
	/**
	 * 
	 */
	_lastYear : function() {
		var date = new Date();
		var year = date.getFullYear() - 1;
		var month = date.getMonth() + 1;
		var day = date.getDate();
		return this._getDay(year, month, day);
	},
	/**
	 * 
	 */
	_getDay : function(year, month, day) {
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		var str = year + month + day;
		return str;
	},
	_nextChain : function() {
		if (this._chain) {
			this._chain.next();
		}
	}

});

var UIViewScene = require('../Scene/UIViewScene').UIViewScene;
var EventDialog = exports.EventDialog = UIViewScene.subclass({
	/** @lends Dn.Internal.EventDialog.prototype */

	classname: "EventDialog",
	
	/**
	 * @constructs The constructor.
	 */
	initialize : function(eventNotifier, _url, _value) {
		this.name    = "EventDialog";
		this.eventNotifier = eventNotifier;
		this.JSONDef = eventNotifier.JSONDef;
		this.url    = _url; 
		this.value  = _value;
	},
	
	viewDidLoad : function () {
		NgLogD("[EventNotifier] loadUrl " + this.url);
		if (this.elem_checkbox_ev) {
			this.elem_checkbox_ev.setChecked(true);
			this.elem_checkbox_ev.onclick = function() {
				NgLogD("[EventNotifier] Checked!!" + this.elem_checkbox_ev.getChecked());
			}.bind(this);
		}
		this.elem_webview.loadUrl(this.url);
		this.elem_webview.onpageevent = function(evt) {
			var data = evt.eventStream.split(";");
			if (data[0] != "close") {
				return;
			}
			this.action_close();
		}.bind(this);

	},
	action_close : function(){
		if(this.elem_checkbox_ev){
			if (this.elem_checkbox_ev.getChecked() == true) {
				NgLogD("[EventNotifier] this.elem_checkbox_ev.getChecked() = " + this.elem_checkbox_ev.getChecked());
				this.eventNotifier.readURLs.push(this.value);
			}
		}else{
			this.eventNotifier.readURLs.push(this.value);
		}
		
		delete(this.eventNotifier._popupViews[this.url]);
		this.onExit();
		if (this._isViewEmpty()) {
			this.eventNotifier._saveURL();
			this.eventNotifier._noticeCallBack.after();
			this.eventNotifier._nextChain();
		}else{
			NgLogD("[EventNotifier] not _isViewEmpty ");
		}
		
	},
	_isViewEmpty : function(){
		for (var i in this.eventNotifier._popupViews) {
			return false;
		}
		return true;
	}

});


