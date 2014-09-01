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

var Core = require('../../../NGCore/Client/Core').Core;
var utils = require('../utils').utils;

exports.UpdateProfiler = Core.Class.singleton({
	initialize: function() {
		this._addListenerOriginal = Core.UpdateEmitter.addListener;
		this._profiles = [];
	},
	init: function() {
		Core.UpdateEmitter.addListener = utils.bind(this, this._addListener);
	},
	_addListener: function(obj, func) {
		if (obj.classname) {
			this._profiles[obj.classname] = {sum: 0, cnt: 0};
		}
		var that = this;
		this._addListenerOriginal.apply(Core.UpdateEmitter, [obj, function(delta) {
			var start = Date.now();
			try {
				func.apply(obj, [delta]);
			} catch(e) {
				var callstack = [];
				var currentFunction = arguments.callee.caller;
				while (currentFunction) {
					var fn = currentFunction.toString();
					var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('('));
					if (fname.length > 1) {
						callstack.push(fname);
					}
					currentFunction = currentFunction.caller;
				}
				var message = this.classname + ":" + callstack.join('<') + "| " + e; 
				if (this._alert)
					alert(message);
				else
					dn.debugT(message);
			}
			if (this.classname) {
				var l = that._profiles[this.classname];
				l.sum += Date.now() - start;
				l.cnt++;
			}
		}]);
	},
	useAlert: function(use) {
		this._alert = use;
	},
	getAvgTime: function(classname) {
		var l = this._profiles[classname];
		return ~~(l.sum / l.cnt);
	}
});
