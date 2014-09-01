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
/**
 * 
 */
exports.Log = Core.Class.singleton({

	classname: 'Log',

	initialize: function(){
	},

	/**
	 * 呼び出し元から、この stackTrace 関数を仕掛けた場所までの関数スタックをログに出力する
	 * @examples 
	 * 	Dn.Debug.Log.stackTrace()
	 */
	stackTrace : function () {
		var ex = new Error();
		var str = "\n ===== Log.stackTrace ================= \n";
		for( var prop in ex ) {
			str += prop+ " value: ["+ ex[prop]+ "]\n";
		}
		str += "toString(): " + " value: [" + ex.toString() + "]\n\n";
		str = str.replace(/Error/i, "");
		str = str.replace(/    /i, "");
		str = str.replace(/at DebugX.trace.*\n/g, "");
		str = str.replace(/   at/g, "   -");
		console.log( str );
	},

	/**
	 * 引数のオブジェクト内の全ての function に対しログ出力をフックする
	 * 
	 * @examples 
	 * 	var friend = new nj.FriendListController(* JSON.parse(data));
	 * 	Dn.Debug.Log.trace(friend);
	 * 
	 */
	trace : function(o) {
		for ( var key in o) {
			switch (typeof o[key]) {
			case 'function':
				(function() {
					var name = key;
					var fn = o[name];
					var instance = o;
					o[name] = function() {
						var className = "AnonymousClass";
						if (instance.classname) {
							className = instance.classname;
						}
						var args = "";
						if (arguments.length > 0) {
							for ( var i = 0; i < arguments.length; i++) {
								if (arguments[i] == undefined) {
									continue;
								}
								args += arguments[i];
								if (i < arguments.length -1) {
									args += ",";
								}
							}
						}
						console.log(" ===== Call " + className + "." + name + "("+ args +")");
						var args = Array.prototype.slice.call(arguments);
						return fn.apply(instance, args);
					};
				})();
			break;
			case 'object':
				break;
			}
		}
	},

	/**
	 * 引数のオブジェクトの変数と値をログに出力する
	 */
	dump : function (obj) {
		var str = "\n ===== Log.dump ================= ";
		console.log(str);

		var count_obj = 0;
		function _output(str) {
			console.log(str);
		}
		function _print_r(obj, name, level) {
			var s = "";
			if (obj == undefined || level > 4) {
				return;
			}
			for (var i = 0; i < level; i++) {
				s += " | ";
			}
			s += " - " + name + ":" + typeof(obj) + "=" + obj;
			_output(s);
			if (name == "document" || typeof(obj) != "object") {
				return;
			}
			for ( key in obj ) {
				if (count_obj++ > 150) return;
				_print_r(obj[key], key, level + 1);
			}
		}
		_print_r(obj, "*", 0);
	},

	/**
	 * 
	 * @examples 
	 *  logf(str aaa=%s bbb=%s,"a","b");
	 */
	logf : function(str) {
		var args = Array.prototype.slice.call(arguments, 1);
	    for(arg in args) {
	    	str = str.replace("%s", args[arg]);
	    }
	    NgLogD(str);
	}
});
