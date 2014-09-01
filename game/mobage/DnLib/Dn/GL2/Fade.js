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
var LightCurtain = require('./_FadeLightCurtain').LightCurtain;


// Dn.Fade ver. 1.0 by Tatsuya Koyama
// Hello anyone, please correct my poor English.
// -----------------------------------------------------------------------------
// - dn.Fade is a utility to occur fade in/out transition effects.
// The simplest usage is here:
//
//     Fade.whiteIn();
//     Fade.whiteOut();
//     Fade.blackIn();
//     Fade.blackOut();
//
// these methods use default settings. To customize effect preferences
// (for instance, color, duration, delay time, on complete handler,)
// you should pass the arguments to fadeIn() or fadeOut():
//
//     dn.Fade.fadeIn( [r,g,b], duration_time, delay_time, listener, handler );
//
// time is second, and any argument is optional. If you want to specify
// default value, give the false value (i.e. null.)
// Default value setter is here:
//
//     Fade.setDepth( depth );
//     Fade.setBlendMode( blendMode ); //----- Sorry, ngCore is not compatible yet!
//     Fade.setDefaultTransTime( second );
//
// - On complete handler is useful at the end of the scene:
//
//     Fade.blackOut( this, function() {
//         this.exitScene();
//     });
//
// - If you think that giving global depth is not smart, you can occur the
// effects on the specific node:
//
//     Fade.setNextTargetNode( target_node );
//     Fade.blackOut();


//
// in this case, black out screen will be added target_node just one time.
//
// - FYI: High speed fade in looks like the flushing.
//
//     Fade.flash( [r,g,b], duration_time, max_alpha );
//
// flash() can applies max alpha value.

exports.Fade = Core.Class.singleton(
/** @lends Fade */
{
	classname: 'Fade',
	/** 
	 * @class
	 */
	initialize: function() {
		
		this.isActivated = false;
		this.depth = 65535;
		this.blendMode = 0; //----- ngCore 待ち
		this.defaultTransTime = 0.5;
		this.nextTargetNode = null;
		this.portrait = false;
	},
	setPortrait: function(portrait) {
		this.portrait = portrait;
	},
	// setter
	//--------------------------------------------------------------------------
	setDepth: function( depth ) { 
		this.depth = depth; 
	},
	setBlendMode: function( mode ) { 
		this.blendMode = mode; 
	},
	setDefaultTransTime: function( time ) { 
		this.defaultTransTime = time; 
	},
	setNextTargetNode: function( node ) { 
		this.nextTargetNode = node; 
	},
	
	// private method
	//--------------------------------------------------------------------------
	startFade: function( isFadein, color, _lifetime, delay, listener, handler ) {
		var lifetime = _lifetime || this.defaultTransTime;
		var light = new LightCurtain(
			this.portrait, isFadein, color, lifetime, delay, 1.0,
			this.depth, this.blendMode, this.nextTargetNode
		);
		if (listener  &&  handler) {
			light.addListener( listener, handler );
		}
		this.nextTargetNode = null;
	},

	//--------------------------------------------------------------------------
	getFade: function( isFadein, color, _lifetime, delay, listener, handler ) {
		var lifetime = _lifetime || this.defaultTransTime;
		var light = new LightCurtain(
			this.portrait, isFadein, color, lifetime, delay, 1.0,
			this.depth, this.blendMode, null, true
		);
		if (listener  &&  handler) {
			light.addListener( listener, handler );
		}
		return light;
	},

	// public method
	//--------------------------------------------------------------------------
	fadeIn: function( color, lifetime, delay, listener, handler ) {
		this.startFade( true, color, lifetime, delay, listener, handler );
	},
	getFadeIn: function( color, lifetime, delay, listener, handler ) {
		return this.getFade( true, color, lifetime, delay, listener, handler );
	},
	
	//--------------------------------------------------------------------------
	fadeOut: function( color, lifetime, delay, listener, handler ) {
		this.startFade( false, color, lifetime, delay, listener, handler );
	},
	getFadeOut: function( color, lifetime, delay, listener, handler ) {
		return this.getFade( false, color, lifetime, delay, listener, handler );
	},
	
	//--------------------------------------------------------------------------
	whiteIn: function( lifetime, delay, listener, handler ) {
		this.startFade( true, [1,1,1], lifetime, delay, listener, handler );
	},
	whiteOut: function( lifetime, delay, listener, handler ) {
		this.startFade( false, [1,1,1], lifetime, delay, listener, handler );
	},
	blackIn: function( lifetime, delay, listener, handler ) {
		this.startFade( true, [0,0,0], lifetime, delay, listener, handler );
	},
	blackOut: function( lifetime, delay, listener, handler ) {
		this.startFade( false, [0,0,0], lifetime, delay, listener, handler );
	},
	
	//--------------------------------------------------------------------------
	flash: function( color, _lifetime, baseAlpha, _depth, _blendMode, _delay ) {
		var lifetime  = _lifetime  || this.defaultTransTime;
		var depth     = _depth     || this.depth;
		var blendMode = _blendMode || this.blendMode;
		var delay = _delay || 0;
		var light = new LightCurtain(
			this.portrait, true, color, lifetime, 0, baseAlpha,
			depth, blendMode, this.nextTargetNode
		);
		this.nextTargetNode = null;
	},
	getFlash: function( color, _lifetime, baseAlpha, _depth, _blendMode, _delay ) {
		var lifetime  = _lifetime  || this.defaultTransTime;
		var depth     = _depth     || this.depth;
		var blendMode = _blendMode || this.blendMode;
		var delay = _delay || 0;
		var light = new LightCurtain(
			this.portrait, true, color, lifetime, delay, baseAlpha,
			depth, blendMode, null, true
		);
		return light;
	}
});

