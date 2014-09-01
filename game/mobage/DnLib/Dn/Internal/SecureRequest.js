var toMD5 = require('../../../NGCore/Client/Core/toMD5').toMD5;
var XHR = require('../../../NGCore/Client/Network/XHR').XHR;
var Request = require('../Network/Request').Request;
var MaintenancePage = require('../Network/_MaintenancePage').MaintenancePage;


exports.SecureRequest = Request.subclass(
/** @lends Request.prototype */
{
	classname: 'SecureRequest',

	initialize: function($super, host, apiVersion) {
		$super(host);
		this.opts.apiVersion = apiVersion || "";
		this._sessionId = "";
		this._numInProgress = 0;
	},

	/**
	 * SendRequest
	 * @param {String} method Request method
	 * @param {String} uri Request uri
	 * @param {Hash} uri Options(data, success, failure, error, headers, isJson, isAsync)
	 * @type void
	 */
	doRequest: function (method, uri, opts) {
		if (!opts) {
			opts = {};
		}
		for (o in this.opts) {
			if(opts[o] === undefined) {
				opts[o] = this.opts[o];
			}
		}

		var request = new XHR();
		var self = this;
		request.onreadystatechange = function () {
			var cookie = null;
			try {
				var success = request.readyState === 4;
			} catch (ex) {
				if (opts.error) {
					self._decInProgress();
					opts.error(request, ex);
					return;
				} else {
					NgLogException (ex);
				}
			}

			if (success) {
				if (request.status === 200) {
					if (opts.success) {
						cookie = request.getResponseHeader( 'Set-Cookie' );
						if( cookie && cookie.match( /session_id=(\w+)/ ) ) {
							self._sessionId = RegExp.$1;
						}
						NgLogD("### response header " +  self._sessionId);
						self._decInProgress();
						opts.success(request);
					}
				} else if (request.status === 503 && request.responseText) {
					// サーバメンテナンスの表示
					MaintenancePage.showPage(request, opts);
				} else {
					if (opts.failure) {
						self._decInProgress();
						opts.failure(request);
					}
				}
			}
		};

		// ----------------------
		if (!opts.data) {
			opts.data = {};
		}
		opts.data._DnApiVersion = opts.apiVersion;
		var reqURI = method === 'GET' ? uri + '?' + this.makeParam(opts.data) : uri;
		var headers = opts.headers || {};
		var sendData = null;

		// ----------------------
		if (method === 'POST') {
			if (opts.isJson && opts.data) {
				headers["Content-type"] = "application/json";
				sendData = JSON.stringify(opts.data);
			} else {
				headers["Content-type"] = "application/x-www-form-urlencoded";
				sendData = this.makeParam(opts.data);
			}
		}
		headers['X_MN_CHKKEY'] = this._createKey('/' + reqURI, this._sessionId, sendData);

		// ----------------------
		request.open ( method, this.host + reqURI, opts.isAsync );

		// make request header
		for (var h in headers) {
			request.setRequestHeader(h, headers[ h ]);
		}

		// ----------------------
		this._incInProgress();
		request.send(sendData);
	},

	numInProgress: function () {
		return this._numInProgress;
	},

	_incInProgress: function () {
		this._numInProgress++;
		NgLogD("### request in progress num: " + this._numInProgress);
	},

	_decInProgress: function () {
		this._numInProgress--;
		NgLogD("### request in progress num: " + this._numInProgress);
	},

	_createKey: function(url, sessionId, content) {
		var now = new Date().getTime();
		var data = "";
		if (content) {
			data = toMD5(content);
		}
		var seed = [now, sessionId, url, data];
		var hash = toMD5(seed.join(":") + ':');
		return [now, hash].join(":");
	}
});
