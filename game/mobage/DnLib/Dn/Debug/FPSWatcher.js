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
var GL2  = require('../../../NGCore/Client/GL2').GL2;
var Write = require('./Write').Write;
var utils = require('../utils').utils;

// ver. 1.0 by Tatsuya Koyama
// Hello anyone, please correct my poor English!
// --------------------------------------------------------------------------------
// FPSWatcher is a tool to monitor changes of the Frame Per Second.
// To use this functions, insert following line to your source code:
//
//     FPSWatcher.activate();
//
// If you don't like the default monitoring format, you can customize
// the format and update frequency like this:
//
//     FPSWatcher.setUpdateHandler( function() {
//         Write.go( depth, x, y, size, "FPS:" + this.getFPS(), [0,1,0] );
//     });
//     FPSWatcher.setUpdateInterval( 1/60 );
//
// enjoy performance tuning!

//========================================================================================
exports.FPSWatcher = Core.MessageListener.singleton({
	
	//--------------------------------------------------------------------------
	initialize: function() {
		
		var now = +new Date();
		this.startOneSec      = now;
		this.fpsCount         = 0;
		this.fpsResult        = 0;
		this.startTime        = now;
		this.startSectionTime = now;
		this.isActivated      = false;
		this.defaultViewMode  = true;
		
		this.startInterval    = now;
		this.updateInterval   = 1.0; //[sec]
		this.updateHandler    = function() {
			var logline = "FPS: " + this.getFPS()
				+ "  Time: " + this.getPlaySectionTime()
				+ " (" + this.getPlayTime() + ")";
			Write.go(
				99, 10, 150, 15, logline
			);
			NgLogD( "FPSWatcher: "+logline);
		}
	},
	
	// function / setter
	//--------------------------------------------------------------------------
	activate: function() {
		if (! this.isActivated) {
			this.isActivated = true;
			Core.UpdateEmitter.addListener( this, this.onUpdate );
		}
	},
	
	deactivate: function() {
		if (this.isActivated) {
			this.isActivated = false;
			Core.UpdateEmitter.removeListener( this );
		}
	},
	
	startSection: function() {
		this.startSectionTime = +new Date();
	},
	
	setUpdateHandler: function( handler ) {
		this.updateHandler = handler;
	},
	
	setUpdateInterval: function( interval ) {
		if (interval <= 0) { interval = 1; }
		this.updateInterval = interval;
	},
	
	// getter
	//--------------------------------------------------------------------------
	getFPS: function() {
		return this.fpsResult;
	},
	
	getPlayTime: function() {
		return (+new Date() - this.startTime) / 1000;
	},
	
	getPlaySectionTime: function() {
		return (+new Date() - this.startSectionTime) / 1000;
	},
	
	//--------------------------------------------------------------------------
	onUpdate: function() {
		var now = +new Date();
		
		//----- count the number of frame
		this.fpsCount++;
		if (now - this.startOneSec > 1000) {
			this.fpsResult = this.fpsCount;
			this.fpsCount  = 0;
			this.startOneSec = now;
		}
		
		//----- display result fps
		if ((now - this.startInterval)/1000 > this.updateInterval) {
			this.startInterval = now;
			this.updateHandler.apply( this );
		}
	}
});

