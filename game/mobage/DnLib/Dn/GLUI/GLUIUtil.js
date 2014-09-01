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

var GL2 = require('../../../NGCore/Client/GL2').GL2;
var Core = require('../../../NGCore/Client/Core').Core;
var OrientationEmitter = require('../../../NGCore/Client/Device/OrientationEmitter').OrientationEmitter;


exports.GLUIUtil = {
	getAnchor: function(sprite) {
		return sprite._animation.getFrame(0).getAnchor();
	},
	
	TouchFilter: Core.MessageListener.subclass({
		classname: 'TouchFilter',
		initialize: function(touchId) {
			this.target = new GL2.TouchTarget();
			this.target.setAnchor( [0, 0] );
			this.trackingId = touchId;
			this.ignoreFingers = [];
			this.shouldDestroy = false;

			var orientation = OrientationEmitter.getInterfaceOrientation();
			var w = Core.Capabilities.getScreenWidth();
			var h = Core.Capabilities.getScreenHeight();
			
			if ((orientation == OrientationEmitter.Orientation.Portrait) || (orientation == OrientationEmitter.Orientation.PortraitUpsideDown)) {
				this.target.setSize(w, h);
			} else {
				this.target.setSize(h, w);
			}
			this.target.getTouchEmitter().addListener( this, this.onTouch );
			this.target.setDepth( 65535 );
			GL2.Root.addChild( this.target );
		},
		destroy: function($super) {
			GL2.Root.removeChild(this.target);
			this.target.destroy();
			$super();
		},
		setDestroyFlag: function() {
			this.shouldDestroy = true;
			if (this.isValidTouch()) {
				this.destroy();
			}
		},
		onTouch: function(touch) {
			var touchId = touch.getId();
			if (touchId === this.trackingId) {
				console.log("@@@@ Error: Invalid input at GLUIUtil.TouchFilter.onTouch()");
				console.log("@@@@ touchId: " + touchId);
				console.log("@@@@ this.trackingId: " + this.trackingId);
				this.destroy();
				return true;
			}
			switch (touch.getAction()) {
				case touch.Action.Start:
					if (!this.shouldDestroy) {
						this.ignoreFingers.push(touch.getId());						
					}
					break;
				case touch.Action.End:
					var index = this.ignoreFingers.indexOf(touch.getId());
					if (index !== -1) {
						this.ignoreFingers.splice(index, 1);
					}
					if (this.shouldDestroy) {
						this.destroy();
					}
					break;
				default:
					break;
			}
			return true;
		},
		isValidTouch: function() {
			if (this.ignoreFingers.length === 0) {
				return true;
			}
			return false;
		}
	}),
	
	Rectangle: GL2.Node.subclass({
		classname: 'Rectangle',
		
		initialize: function() {
			this.setChildrenDepthGrouped(true);
			this._color = null;
			this._size = null;
			this._primitive = null;
		},
		setFrame: function(frame) {
			frame = new Core.Rect(frame);
			this.setPosition(frame.getOrigin());			
			this._size = frame.getSize();
			this._updateBox();
		},
		destroy: function() {
			this._primitive = null;
		},
		setColor: function(color) {
			this._color = new Core.Color(color);
			this._updateBox();
		},
		_updateBox: function() {
			if (!this._size || !this._color) {
				return;
			}
			if (this._primitive !== null) {
				this.removeChild(this._primitive);
				this._primitive.destroy();
			}
			var p = new GL2.Primitive();
			p.setColor(this._color);
			var w = this._size.getWidth();
			var h = this._size.getHeight();
			
			p.setType(GL2.Primitive.Type.TriangleFan);
			
			v = [];
			v.push(new GL2.Primitive.Vertex([0,0],[0,0]));
			v.push(new GL2.Primitive.Vertex([w,0],[0,0]));
			v.push(new GL2.Primitive.Vertex([w,h],[0,0]));
			v.push(new GL2.Primitive.Vertex([0,h],[0,0]));
			p.spliceVertexes.apply(p, ([0,0]).concat(v));
			this._primitive = p;
			this.addChild(this._primitive);
		}
	}),
	makePrimitive: function( x, y, w, h, color1, color2, color3, color4 ) {
		if (arguments.length <= 6) {
			color3 = color2 || color1;
			color4 = color2 || color1;
			color2 = color1;
		}
		
		var p = new GL2.Primitive();
		p.setType( GL2.Primitive.Type.TriangleStrip );
		
		p.pushVertex( new GL2.Primitive.Vertex([0, 0], [0, 0], color1) );
		p.pushVertex( new GL2.Primitive.Vertex([w, 0], [1, 0], color2) );
		p.pushVertex( new GL2.Primitive.Vertex([0, h], [0, 1], color3) );
		p.pushVertex( new GL2.Primitive.Vertex([w, h], [1, 1], color4) );
		
		p.setPosition( x, y );
		return p;
	}
};
