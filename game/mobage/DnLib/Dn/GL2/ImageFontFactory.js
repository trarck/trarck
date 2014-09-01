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

var Class = require('../../../NGCore/Client/Core/Class').Class;
var Node  = require('../../../NGCore/Client/GL2/Node').Node;
var Primitive  = require('../../../NGCore/Client/GL2/Primitive').Primitive;
var FileSystem  = require('../../../NGCore/Client/Storage/FileSystem').FileSystem;
var utils = require('../utils').utils;


// Dn.ImageFontFactory ver. 1.0 by Tatsuya Koyama
// -----------------------------------------------------------------------------
// USAGE:
//     ImageFontFactory.setBasePath( path ); // default is 'resources/images/'
//     ImageFontFactory.loadFontInfo( 'font/example.json' );
//
//     var node = dn.ImageFontFactory.create(
//         'image_file_path',
//         'text_you_want_to_display',
//         font_height,
//         spacing_size,
//         gradation_color_top,
//         gradation_color_bottom
//     );
//
//
// EXAMPLE:
//     var node = Dn.ImageFontFactory.create(
//         'font/example.png', 'test', 50, -1, [1,1,1], [0.5, 0.5, 0.5]
//     );
//     GL2.Root.addChild( node );
//
//
// JSON FILE FORMAT:
// * 文字の切り出し位置を定義
// * 作業コストを減らすため、font height は固定。何段目という指定をする
// * width と height に設定したピクセル数に対する比として扱うので、
//   画像を拡大縮小したものに入れ換えても json ファイルを更新する必要はない
//
// {
//     "path/image_file.png": { // basePath 以降のパス。これがそのまま画像指定のキーになる
//         "width" : 512,
//         "height": 512,
//         "lineHeight"   : 50, // height is fixed
//         "paddingLeft"  :  0, // 微調整用。切り出しを内側に何 pixel せばめるか
//         "paddingRight" :  0,
//         "paddingTop"   :  1.0,
//         "paddingBottom":  1.5,
//
//         "A": [1,  10,  44], // 何段目の、横 何px から 何px までか
//         "B": [1,  47,  81], // * 最上段は１と数える
//         "C": [1,  84, 115],
//         .....
//     }
// }


exports.imageFontFactory = {};
//========================================================================================
exports.imageFontFactory.LettersContainer = Node.subclass({
	
	initialize: function() {
		this.nodes = [];
	},
	destroy: function() {
		utils.each( this.nodes, function(i) { i.destroy(); } );
	},
	refresh: function() {
		utils.each( this.nodes, function(i) { i.destroy(); } );
		this.nodes = [];
	},
	addLetter: function( letter ) {
		this.addChild( letter );
		this.nodes.push( letter );
	}
});


//========================================================================================
exports.imageFontFactory.Letters = Node.subclass({
	
	initialize: function() {
		this.container = new exports.imageFontFactory.LettersContainer();
		this.addChild( this.container );
		this.anchorX = 0;
		this.anchorY = 0;
		this.width   = 0;
		this.height  = 0;
		this.spacing = 0;
		this.gradColorTop    = [1,1,1];
		this.gradColorBottom = [1,1,1];
	},
	destroy: function() {
		this.container.destroy();
	},
	refresh: function() {
		this.container.refresh();
	},
	addLetter: function( letter ) {
		this.container.addLetter( letter );
	},
	
	// 既存の ImageFont の Node を destroy せずに中身を変える
	//--------------------------------------------------------------------------
	recreate: function( text, _imgPath, _fontHeight, _spacing,
	                     _gradColorTop, _gradColorBottom ) {
		
		var imgPath    = _imgPath    || this.imgPath;
		var fontHeight = _fontHeight || this.fontHeight;
		var spacing    = _spacing    || this.spacing;
		var gradColorTop    = _gradColorTop    || this.gradColorTop;
		var gradColorBottom = _gradColorBottom || this.gradColorBottom;
		
		this.factory.create( imgPath, text, fontHeight, spacing, gradColorTop, gradColorBottom, this );
	},
	
	//--------------------------------------------------------------------------
	setAnchor: function( x, y ) {
		
		this.anchorX = x;
		this.anchorY = y;
		this.container.setPosition(
			0 - (this.width  * this.anchorX),
			0 - (this.height * this.anchorY)
		);
	},
	
	//--------------------------------------------------------------------------
	setContainerPosition: function( x, y ) {
		this.container.setPosition( x, y );
	}
});


//========================================================================================
exports.ImageFontFactory = Class.singleton({
	
	//--------------------------------------------------------------------------
	initialize: function() {
		
		this.basePath  = 'resources/images/';
		this.fontMap   = {};
		this.loadFiles = {};
	},
	
	setBasePath: function( path ) {
		this.basePath = path;
	},
	
	//--------------------------------------------------------------------------
	loadFontInfo: function( path, onCompleteHandler ) {
		
		//----- すでに読み込まれているなら何もしない
		if (this.loadFiles[ path ]) {
			NgLogD( 'Warning: Dn.ImageFontFactory: font-info file already loaded.' );
			return false;
		}
		this.loadFiles[ path ] = true;
		
		//----- font の切り出し情報が書かれた JSON ファイルをローカルから読み込む
		var that = this;
		var basePath = this.basePath || "";
		FileSystem.readFile( basePath + path, false, function( err, data ){
			if (err) {
				NgLogD( "Error: Dn.ImageFontFactory: failed to read font-info file." );
				NgLogD( "       --- " + this.basePath + path );
			}
			else {
				//var fontInfo = JSON.parse( data );
				var fontInfo = JSON.parse( data );
				for (var imagePath in fontInfo) {
					that.fontMap[ imagePath ] = fontInfo[ imagePath ];
				}
			}
			if (onCompleteHandler) {
				onCompleteHandler.apply();
			}
		});
	},
	
	//--------------------------------------------------------------------------
	create: function( imgPath, text, fontHeight, _spacing, _gradColorTop, _gradColorBottom, node ) {
		
		if (! this.fontMap[ imgPath ]) {
			NgLogD( 'Error: Dn.ImageFontFactory: image file not loaded.' );
			return false;
		}
		
		if (node) { node.refresh(); }
		var letters = node || new exports.imageFontFactory.Letters();
		
		var f = this.fontMap[ imgPath ];
		var V = Primitive.Vertex;
		var spacing = _spacing || 0;
		var gradColorTop    = _gradColorTop    || [1, 1, 1];
		var gradColorBottom = _gradColorBottom || [0.5, 0.5, 0.5];
		
		var xPos = 0;
		for (var i=0;  i < text.length;  i++) {
			var c = text.charAt( i );
			
			if (! f[c]) {
				//NgLogD( 'Error: Dn.ImageFontFactory: letter not found' );
				xPos += (fontHeight / 1.5 + spacing); //暫定
				continue;
			}
			var p = new Primitive();
			p.setType( Primitive.Type.TriangleFan );
			
			var scale  = fontHeight / f.lineHeight;
			var left   = (f[c][1] + f.paddingLeft);
			var right  = (f[c][2] - f.paddingRight);
			var top    = ((f[c][0] - 1) * f.lineHeight + f.paddingTop);
			var bottom = ((f[c][0] - 0) * f.lineHeight - f.paddingBottom);
			var w = scale * (right - left);
			var h = scale * (bottom - top);
			
			//----- normalize to [0,1] for uv mapping
			left   /= f.width;
			right  /= f.width;
			top    /= f.height;
			bottom /= f.height;
			
			p.pushVertex( new V( [xPos + 0, 0], [left , top   ], gradColorTop ) );
			p.pushVertex( new V( [xPos + w, 0], [right, top   ], gradColorTop ) );
			p.pushVertex( new V( [xPos + w, h], [right, bottom], gradColorBottom ) );
			p.pushVertex( new V( [xPos + 0, h], [left , bottom], gradColorBottom ) );
			xPos += (w + spacing);
			
			p.setImage(
				this.basePath + imgPath,
				[w, h], [0, 0], [0, 0, 1, 1]
			);
			letters.addLetter( p );
		}
		
		//----- remember parameters
		letters.imgPath    = imgPath;
		letters.fontHeight = fontHeight;
		letters.spacing    = spacing;
		letters.gradColorTop    = gradColorTop;
		letters.gradColorBottom = gradColorBottom;
		
		letters.width   = xPos;
		letters.height  = fontHeight;
		letters.setContainerPosition(
			0 - (letters.width  * letters.anchorX),
			0 - (letters.height * letters.anchorY)
		);
		letters.factory   = this;
		
		return letters;
	}
});

