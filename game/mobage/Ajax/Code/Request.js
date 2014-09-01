/* Copyright (c) 2011 DeNA Co., Ltd.
 * Permission is hereby granted, free of charge, to any person to obtain a copy of
 * this software and associated documentation files (collectively called
 * the "Software"), in order to exploit the Software without restriction, including
 * without limitation the permission to use, copy, modify, merge, publish,
 * distribute, and/or sublicense copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS LICENSED TO YOU "AS IS" AND WITHOUT
 * WARRANTY OF ANY KIND. DENA CO., LTD. DOES NOT AND CANNOT
 * WARRANT THE PERFORMANCE OR RESULTS YOU MAY OBTAIN BY
 * USING THE SOFTWARE. EXCEPT FOR ANY WARRANTY, CONDITION,
 * REPRESENTATION OR TERM TO THE EXTENT TO WHICH THE SAME
 * CANNOT OR MAY NOT BE EXCLUDED OR LIMITED BY LAW APPLICABLE
 * TO YOU IN YOUR JURISDICTION, DENA CO., LTD., MAKES NO
 * WARRANTIES, CONDITIONS, REPRESENTATIONS OR TERMS, EXPRESS
 * OR IMPLIED, WHETHER BY STATUTE, COMMON LAW, CUSTOM, USAGE,
 * OR OTHERWISE AS TO THE SOFTWARE OR ANY COMPONENT
 * THEREOF, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * INTEGRATION, MERCHANTABILITY,SATISFACTORY QUALITY, FITNESS
 * FOR ANY PARTICULAR PURPOSE OR NON-INFRINGEMENT OF THIRD
 * PARTY RIGHTS. IN NO EVENT SHALL DENA CO., LTD. BE LIABLE FOR
 * ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * EXPLOITATION OF THE SOFTWARE.
 */

var Class = require('../../../NGCore/Client/Core/Class').Class;
var XHR = require('../../../NGCore/Client/Network/XHR').XHR;
var MaintenancePage = require('./_MaintenancePage').MaintenancePage;
var ErrorDialog = require('../UI/ErrorDialog').ErrorDialog;

/** 
 * @fileoverview 各ゲーム内におけるサーバーへのリクエストをおこなうためのJavascript
 *
 * @author choi.daewoo
 * @version 0.2 
 */ 

exports.Request = Class.subclass(
/** @lends Request.prototype */
{
	classname: 'Request',
	/**
	 * Request to Game Server.
	 * @class This is the basic Server Request class.  
	 * @param {String} host リクエスト送信先の設定。
	 */
	initialize: function (host) {
		if (!host.match(/\/$/)) {
			host += "/";
		}
		this.host = host;
		this.opts = {
			isAsync: true
		};
	},
	/**
	 * リクエストを送信する
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
		var url = '';
		if (this.host) {
			url += this.host;
		}
		url += uri;

		var param = this.makeParam(opts.data);
		if (method === 'GET') {
			url += '?' + param;
		}

		request.onreadystatechange = function () {
			try {
				var success = request.readyState === 4;
			} catch (ex) {
				if (opts.error) {
					opts.error(request, ex);
					return;
				} else {
					NgLogException (ex);
				}
			}

			if (success) {
				if (request.status === 200) {
					if (opts.success) {
						opts.success(request);
					}
				} else if (request.status === 503 && request.responseText) {
					// サーバメンテナンスの表示
					MaintenancePage.showPage(request, opts);
				} else if (request.status === 0 && opts.errorDialog ){
					// Show Default Network Error Dialog
					var errdlg = new ErrorDialog(
						{
							type: ErrorDialog.TYPE.NETWORK_ERROR,
							buttontype: ErrorDialog.BUTTONTYPE.OK
						});
					errdlg.show(
						function(){
							if (opts.failure) {
								opts.failure(request);
							}
						}
					);
				} else {
					if (opts.failure) {
						opts.failure(request);
					}
				}
			}
			if (opts.onreadystatechange) {
				opts.onreadystatechange(request);
			}
		};

		request.open ( method, url, opts.isAsync );

		if (opts.headers) {
			for (var h in opts.headers) {
				request.setRequestHeader (h, headers[ h ]);
			}
		}

		if (method === 'POST') {
			// post JSON
			if (opts.isJson && param) {
				request.setRequestHeader ("Content-type", "application/json");
				param = JSON.stringify(opts.data);
			} else {
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			}
			request.send(param);
		} else {
			request.send (null);
		}
	},
	/**
	 * GETリクエストを送信する
	 * @param {String} uri Request uri
	 * @param {Hash} uri Options(data, success, failure, error, headers, isJson)
	 * @type void
	 */
	get: function(uri, opts) {
		this.doRequest('GET', uri, opts);
	},
	/**
	 * POSTリクエストを送信する
	 * @param {String} uri Request uri
	 * @param {Hash} uri Options(data, success, failure, error, headers, isJson)
	 * @type void
	 */
	post: function(uri, opts) {
		this.doRequest('POST', uri, opts);
	},
	/**
	 * HashからURIパラメータを生成する
	 * @param {Hash} data Options(data, success, failure, error, headers, isJson)
	 * @type void
	 */
	makeParam: function (data) {
		if (!data) {
			return '';
		}
		var params = [];
		for (key in data) {
			params.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
		}
		return params.join('&');
	},
	/**
	 * 
	 * @param {String} key Option key
	 * @param {Hash} value Option value
	 * @type void
	 */
	setOption: function(key, value) {
		this.opts[key] = value;
	},
	/**
	 * Show Error Dialog
	 * @param {Number} type Option alert type
	 * @param {} value Option value
	 * @type Boolean
	 */
	showDialog: function(type){

	}

});
