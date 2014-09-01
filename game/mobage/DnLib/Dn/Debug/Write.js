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

//========================================================================================
exports.Write = Core.MessageListener.singleton({
	
	//--------------------------------------------------------------------------
	initialize: function() {
		Core.UpdateEmitter.addListener( this, this.onUpdate );
		this.nodes = {};
		this.unusedNodes = [];
		this.shadowPos = {x:2, y:2};
		this.scale = 1.0;
		this.originalFontSize = 15;
	},
	
	// In the current SDK version (0.9.2s), we should use a fixed font size
	//--------------------------------------------------------------------------
	setOriginalFontSize: function( fontSize ) {
		this.originalFontSize = fontSize;
	},
	
	//--------------------------------------------------------------------------
	fitToScreen: function( originalShortSideLength ) {
		
		var scale  = 1.0;
		var width  = Core.Capabilities.getScreenWidth();
		var height = Core.Capabilities.getScreenHeight();
		
		if (width < height) {
			scale = width / originalShortSideLength;
		} else {
			scale = height / originalShortSideLength;
		}
		this.scale = scale;
	},
	
	setOriginalScale: function() { this.scale = 1.0; },
	
	//--------------------------------------------------------------------------
	getTextNode: function( index ) {
		if (! this.nodes[ index ]) {
			var t = new GL2.Text();
			t.setDepth( index );
			t.setAnchor( 0, 0 );
			t.setFontSize( this.originalFontSize );
			
			t.s = new GL2.Text(); //----- shadow
			t.s.setColor( 0, 0, 0 );
			t.s.setDepth( index-1 );
			t.s.setAnchor( 0, 0 );
			t.s.setFontSize( this.originalFontSize );
			
			GL2.Root.addChild( t );
			GL2.Root.addChild( t.s );
			
			this.nodes[ index ] = t;
			this._setPosition( index, 0, 0 );
			this._setFontSize( index, this.originalFontSize );
		}
		return this.nodes[ index ];
	},
	
	// private field
	//--------------------------------------------------------------------------
	_setPosition: function( index, x, y ) {
		x *= this.scale;
		y *= this.scale;
		var t = this.getTextNode( index );
		t.setPosition( x, y );
		t.s.setPosition( x + this.shadowPos.x, y + this.shadowPos.y );
	},
	_setFontSize: function( index, size ) {
		/*
        size = Math.floor( size * this.scale );
        var t = this.getTextNode( index );
        if (t.getFontSize() !== size) {
                t.setFontSize( size );
                t.s.setFontSize( size );
		}
		*/
		//----- ngCore のバグ対応のため、font size 固定で Node の scale を変化させるように変更
		var nodeScale = size / this.originalFontSize;
		var scale     = nodeScale * this.scale;
		var t = this.getTextNode( index );
		t.  setScale( scale, scale );
		t.s.setScale( scale, scale );
	},
	_setText: function( index, text ) {
		var t = this.getTextNode( index );
		if (t.getText() !== text) {
			t.setText( text );
			t.s.setText( text );
		}
		t.setAlpha( 1 );
		t.s.setAlpha( 1 );
	},
	_setColor: function( index, color ) {
		var t = this.getTextNode( index );
		if (t.getColor() !== color) {
			t.setColor( color );
		}
	},
	//--------------------------------------------------------------------------
	// end private field	
	
	//--------------------------------------------------------------------------
	setPosition: function( index, x, y ) {
		this._setPosition( index, x, y );
	},
	
	//--------------------------------------------------------------------------
	setFontSize: function( index, size ) {
		this._setFontSize( index, size );
	},
	
	//--------------------------------------------------------------------------
	setText: function( index, text ) {
		this._setText( index, text );
	},
	
	//--------------------------------------------------------------------------
	setColor: function( index, color ) {
		this._setColor( index, color );
	},
	
	// Maybe this function should be named "setTextParametersAtOnce",
	// but it is too long to debugging.
	//--------------------------------------------------------------------------
	go: function( index, x, y, size, text, color, vola ) {
		this._setPosition( index, x, y );
		this._setFontSize( index, size );
		this._setText( index, text );
		if (color) { this._setColor( index, color ); }
		if (vola) { this.getTextNode( index ).vola = true; }
	},
	
	//--------------------------------------------------------------------------
	purge: function() {
		for (var i in this.nodes) {
			if (this.nodes[i] !== undefined) {
				this.nodes[i].destroy();
				this.nodes[i].s.destroy();
			}
		}
		this.nodes = {};
	},

	// The text start fade out if it is not updated.
	//--------------------------------------------------------------------------
	onUpdate: function( delta ) {
		for (var i in this.nodes) {
			var t = this.nodes[i];
			if (t === undefined) {
				continue;
			}
			var alpha = t.getAlpha() - 0.008;
			if (alpha > 0) {
				t.setVisible( true );
				t.setAlpha( alpha );
				t.s.setVisible( true );
				t.s.setAlpha( alpha );
			} else {
				if (t.vola) {
					GL2.Root.removeChild(t);
					GL2.Root.removeChild(t.s);
					t.destroy();
					t.s.destroy();
					this.nodes[i] = undefined;
				} else {
					t.setVisible( false );
					t.s.setVisible( false );
				}
			}
		}
	}
});

