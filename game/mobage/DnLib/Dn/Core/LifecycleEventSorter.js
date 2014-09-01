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
var Device = require('../../../NGCore/Client/Device').Device;

/**
 * Lifecycleイベントの順序を制御する	
 */
var LifecycleEventSorter = exports.LifecycleEventSorter = Core.Class.singleton(
/** @lends Dn.Core.LifecycleEventSorter.prototype */
{
	classname: 'LifecycleEventSorter',

	/**
	 * @constructs The default constructor.
	 * @augments Dn.Core.LifecycleEventSorter
	 */
	initialize: function() {
		if (this.controller) {
			return;
		}
		
		this._listeners = [];
		this.controller = new exports.LifecycleController(this);
		Device.LifecycleEmitter.addListener(this.controller, this.controller.onCallBack);
		
	},
	
	/**
	 * onResume or onSuspend or onTerminated Func 
	 * @param listener
	 */
	addListener : function(listener){
		if (!this.controller) {
			LifecycleEventSorter.instantiate();
		}
		this._listeners.push(listener);
		NgLogI("[LifecycleController] addListener " + listener);
	} 

});

/**
 * 
 */
exports.LifecycleController = Core.MessageListener.subclass( {

	/**
	 * @constructs The default constructor.
	 * @augments Core.MessageListener
	 */
	initialize: function(mgr) {
		this._mgr = mgr; 
	},

	/**
	 *
	 */
	onCallBack : function(arg) {
		if (this._mgr._listeners.length == 0) {
			return;
		}
		var funcName = "on";
		switch (arg) {
		case Device.LifecycleEmitter.Event.Resume:
			funcName = funcName + "Resume";
			break;
		case Device.LifecycleEmitter.Event.Suspend:
			funcName = funcName + "Suspend";
			break;
		case Device.LifecycleEmitter.Event.terminated:
			funcName = funcName + "Terminated";
			break;
		}
		
		this._listeners = this._mgr._listeners.slice();
		
		var self = this;
		var chain = {
			listeners : self._listeners,
			func : funcName,
			next : function(){
				var obj = self._listeners.shift();
				if (obj) {
					var callBack = obj[this.func];
					if (callBack) {
						NgLogI("[LifecycleController] callBack " + this.func);
						callBack(chain);
					}
				}
			}
		};
		chain.next();
	}

});


