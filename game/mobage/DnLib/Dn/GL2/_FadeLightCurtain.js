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
var Capabilities = require('../../../NGCore/Client/Core/Capabilities').Capabilities;
var Primitive  = require('../../../NGCore/Client/GL2/Primitive').Primitive;
var GL2Root  = require('../../../NGCore/Client/GL2/Root').Root;


exports.LightCurtain = MessageListener.subclass({
	
	//--------------------------------------------------------------------------
	initialize: function( portrait, isFadeIn, color, lifetime, delay, baseAlpha, depth, blendMode,
						  targetNode, autoAddChildCancel ) {
		UpdateEmitter.addListener( this, this.onUpdate );
		
		this.isFadeIn  = isFadeIn  || false;
		this.color     = color     || [0, 0, 0];
		this.lifetime  = lifetime  || 0.5;
		this.delay     = delay     || 0;
		this.baseAlpha = baseAlpha || 1.0;
		this.depth     = depth     || 65535;
		this.blendMode = blendMode || 0; //----- ngCore 待ち
		
		this.elapsedTime = 0;
		this.listener = undefined;
		this.handler  = undefined;
		
		var w, h;
		if (portrait) {
			h = Capabilities.getScreenHeight();
			w = Capabilities.getScreenWidth();
		} else {
			w = Capabilities.getScreenHeight();
			h = Capabilities.getScreenWidth();
		}
		var p = new Primitive();
		p.setType(Primitive.Type.TriangleFan );
		//----- ToDo: ngCore が対応してくれたら blendMode 反映させる
		p.pushVertex( new Primitive.Vertex([0, 0], [0, 0], color) );
		p.pushVertex( new Primitive.Vertex([w, 0], [1, 0], color) );
		p.pushVertex( new Primitive.Vertex([w, h], [1, 1], color) );
		p.pushVertex( new Primitive.Vertex([0, h], [0, 1], color) );
		p.setDepth( this.depth );
		if (! this.isFadeIn) { p.setAlpha( 0 ); }
		if (! autoAddChildCancel) {
			if (targetNode) {
				targetNode.addChild( p );
			} else {
				GL2Root.addChild( p );
			}
		}
		this.node = p;
		this.doneCallBack = false;
	},

	//--------------------------------------------------------------------------
	destroy: function($super) {
		this.node.destroy();
		$super();
	},

	//--------------------------------------------------------------------------
	getNode: function() { return this.node; },

	//--------------------------------------------------------------------------
	addListener: function( listener, handler ) {
		
		if (typeof( handler ) !== 'function') {
			NgLogD( "dn.Fade.addListener - handler is not a function" );
			return false;
		}
		
		this.listener = listener;
		this.handler  = handler;
		return true;
	},

	//--------------------------------------------------------------------------
	onUpdate: function( delta ){
		
		if (this.doneCallBack) {
			this.destroy();
			return;
		}

		var progress = (delta / 1000);
		if (progress > 5/60) { progress = 5/60; }
		if (this.delay > 0) {
			this.delay -= progress;
			return;
		}
		
		this.elapsedTime += progress;
		if (this.elapsedTime >= this.lifetime) {
			//----- on complete handler
			if (this.listener  &&  this.handler) {
				this.handler.apply( this.listener );
			}
			this.doneCallBack = true;
			return;
		}
		
		var alpha = this.elapsedTime / this.lifetime;
		if (this.isFadeIn) { alpha = (1 - alpha); }
		this.node.setAlpha( alpha * this.baseAlpha );
	}
	
});
