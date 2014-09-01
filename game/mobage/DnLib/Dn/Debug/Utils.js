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
var UI   = require('../../../NGCore/Client/UI').UI;

//========================================================================================
exports.DebugUtils = Core.Class.singleton({
	
	//--------------------------------------------------------------------------
	initialize: function() {
		this.scale = 1.0;
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
	makeSpriteBase: function( src, w, h, x, y, depth, size_w, size_h ) {
		
		//----- simple scaling
		var sc = this.scale;
		x *= sc;
		y *= sc;
		w *= sc;
		h *= sc;
		size_w *= sc;
		size_h *= sc;
		
		var s = new GL2.Sprite();
		s.setImage( src, [w, h], [0.5, 0.5], [0, 0, 1, 1] );
		s.setPosition( x, y );
		s.setDepth( depth );
		s.setScale( size_w / w, size_h / h );
		GL2.Root.addChild( s );
		return s;
	},
	
	//--------------------------------------------------------------------------
	makeTextArea: function( text, textSize, x, y, w, h, fgColor, bgColor, align ) {
		
		//----- simple scaling
		var sc = this.scale;
		textSize *= sc;
		x *= sc;
		y *= sc;
		w *= sc;
		h *= sc;
		
		var align = align || 'Center';
		var t = new UI.Label();
		t.setFrame( [x, y, w, h] );
		t.setText( text );
		t.setTextSize( textSize );
		t.setTextColor( fgColor );
		t.setBackgroundColor( bgColor );
		t.setTextGravity( UI.ViewGeometry.Gravity[ align ] );
		NGWindow.document.addChild( t );
		return t;
	},
	
	//--------------------------------------------------------------------------
	makeButtonBase: function( text, textSize, x, y, w, h, grad1, grad2 ) {
		
		//----- simple scaling
		var sc = this.scale;
		textSize *= sc;
		x *= sc;
		y *= sc;
		w *= sc;
		h *= sc;
		
		var b = new UI.Button();
		b.setText( text );
		b.setTextSize( textSize );
		b.setTextGravity( UI.ViewGeometry.Gravity.Center );
		b.setFrame( [x, y, w, h] );
		
		b.setNormalGradient({
			corners  : '8 8 8 8',
			outerLine: "00 1.5",
			gradient : [ grad1 + " 0.0", grad2 + " 1.0" ]
		});
		b.setHighlightedGradient({
			corners  : '8 8 8 8',
			outerLine: "00 1.5",
			gradient : [ grad2 + " 0.0", grad1 + " 1.0" ]
		});
		NGWindow.document.addChild( b );
		return b;
	}
});

