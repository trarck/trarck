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

/**
 * Dn.utils package.
 *
 * @name Dn.utils
 * @namespace
 */
 
exports.utils = {
	AutoReloader: require('./utils/AutoReloader').AutoReloader,

	/**
	 * Helper function to call visitor function with all element in the array.
	 * 
	 * @param {Array} a target array
	 * @param {Function} fn function object to process the element
	 */ 
	each: function (a, fn) {
		for(var i = 0; i < a.length; ++i) {
			fn(a[i], i);
		}
	},

	/**
	 * Helper function to apply the function to element and create.
	 *
	 * @param {Array} a target array
	 * @param {Function} fn function object to process the element
	 * @returns {Array} new array
	 */ 
	map: function (a, fn) {
		var out = [];
		exports.utils.each(a, function(i) {
			out.push( fn(i) );
		});
		return out;
	},

	/**
	 * Find value the function returns true.
	 * 
	 * @param {Array} a target array
	 * @param {Function} fn function it checks the element
	 * @returns return found object or 'undefined'(when missing)
	 */ 
	find: function(a, fn) {
		for (var i = 0; i < a.length; ++i) {
			if(fn( a[i] )) {
				return a[i];
			}
		}
		return undefined;
	},

	/**
	 * Bind object with method. It is used for callback.
	 * In fn function, this == context.
	 *
	 * @param context object
	 * @param {Function} fn method.
	 * @returns {Function} binded method.
	 */ 

	bind: function(context, fn) {
		return function () {
			var args = Array.prototype.slice.call(arguments, 0);
			return fn.apply(context, args);
		};
	},

	/**
	 * Scan the object tree and apply function in each value.
	 *
	 * @param obj target object
	 * @param {Function(key,value)} func function to handle data 
	 */ 

	traverse: function( obj, func ) {
		for (var i in obj) {
			func.apply( this, [i, obj[i]] );
			if (typeof( obj[i] ) === "object" ) {
				exports.utils.traverse( obj[i], func );
			}
		}
	},

	/**
	 * get random number
	 * It returns [0-max).
	 *
	 * @param {Number} max max number
	 * @param {NUmber} random value 
	 */ 

	rand: function( max ) {
		return Math.random() * max;
	},

	/**
	 * Get sin value with degree.
	 *
	 * @param {Number} degree
	 * @returns {Number} result
	 */ 

	sin: function( degree ) {
		return Math.sin( degree / 180 * Math.PI );
	},

	/**
	 * Get cos value with degree.
	 *
	 * @param {Number} degree
	 * @returns {Number} result
	 */ 

	cos: function( degree ) {
		return Math.cos( degree / 180 * Math.PI );
	},
	
	destroyIfAlive: function(obj) {
		if(Core.ObjectRegistry.isObjectRegistered(obj)) {
			obj.destroy();
		}
	}
};
