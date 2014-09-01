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

var MessageListener = require('../../../NGCore/Client/Core/MessageListener').MessageListener;
var UpdateEmitter = require('../../../NGCore/Client/Core/UpdateEmitter').UpdateEmitter;
var utils = require('../utils').utils;


exports.Timekeeper = MessageListener.singleton(
/** @lends Timekeeper.prototype */
{
	classname: 'Timekeeper',
	/** 
	 * @class Simple multi tasker
	 * @author Tatsuya Koyama
 	 */
	initialize: function() {
		UpdateEmitter.addListener( this, this.onUpdate );
		
		//----- frame skip を許す範囲
		this.frameRate      = 60;
		this.limitSkipSec   = 5 / this.frameRate;
		this.limitSkipFrame = 5;
		
		//-----
		this.currentTime = +new Date();
		this.prevTime    = this.currentTime;
		this.elapsedSec  = 0;
		this.passedSec   = 0;
		this.passedFrame = 0;
		this.tasks = [];
	},
													
	/**
	 * Set function it is called after specific time.
	 *
	 * @param {function} func call-back function
	 * @param {sec} sec time-out term(seconds)
	 * @see clearAlltimeout()
	 */
	setTimeout: function( func, sec ) {
		
		var task = {
			handler   : func,
			waitRemain: sec
		};
		this.tasks.push( task );
	},
	/**
	 * Clear all time-out functions.
	 */
	clearAllTimeout: function() {
		this.tasks = [];
	},
	/**
	 * 
	 */
	getDelta: function( _diff, _sec ) {
		
		var diff = _diff || (1 / this.frameRate);
		var sec  = _sec  || (1 / this.frameRate);
		var elapsedSec = (this.currentTime - this.prevTime) / 1000;
		if (elapsedSec > this.limitSkipSec) {
			elapsedSec = this.limitSkipSec;
		}
		return (diff * elapsedSec) / sec;
	},

													/**
	 * Return the passed second from last frame.
	 *
	 * @returns {Number} passed second.
	 */
	getPassedSec:   function() { return this.passedSec;   },

	/**
	 * Return the passed frame from last frame.
	 *
	 * @returns {Number} passed frame.
	 */
	getPassedFrame: function() { return this.passedFrame; },

	/**
	 * @event
	 */
	onUpdate: function( delta ) {
		
		//----- 前回のフレームから、実際に過ぎ去った時間を保持
		this.passedSec = delta / 1000;
		if (this.passedSec > this.limitSkipSec) {
			this.passedSec = this.limitSkipSec;
		}
		
		//----- 「本来過ぎ去るはずだったフレーム数」を計算
		this.prevTime    = this.currentTime;
		this.currentTime = +new Date();
		this.elapsedSec += (this.currentTime - this.prevTime) / 1000;
		
		this.passedFrame = 0;
		var frameSec = (1 / this.frameRate);
		if (this.passedSec >= frameSec) {
			this.passedFrame += Math.floor( this.elapsedSec / frameSec );
			this.elapsedSec   -= (frameSec * this.passedFrame);
		}
		if (this.passedFrame > this.limitSkipFrame) {
			this.passedFrame = this.limitSkipFrame;
		}
		var lazyTasks = [];
		//----- setTimeout で登録されたタスクを管理・実行
		for (var i=0;  i < this.tasks.length;  i++) {
			var t = this.tasks[i];
			t.waitRemain -= this.passedSec;
			if (t.waitRemain <= 0) {
				if (typeof( t.handler ) === 'function') {
					lazyTasks.push( t );
				}
				//----- 配列から消して詰めるのアレだからハッシュにした方がいいかな…
				this.tasks.splice( i, 1 );
				--i;
			}
		}
		utils.each(lazyTasks, function(t) {
			t.handler.apply();
		});
	}
	
});

