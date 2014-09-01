var Core = require('../../../NGCore/Client/Core').Core;
var GL2  = require('../../../NGCore/Client/GL2').GL2;
var utils = require('../utils').utils;

// ver. 0.9 by Tatsuya Koyama
// NGUI は信用ならないし GL2.Text.setOverflowMode はあるけどどこで表示領域のサイズを
// 指定できるか分からなかったので GL2.Text 複数組み合わせて multi line 実現した。
// 本当は frame size で指定できるべきだが実際の font の表示サイズとれないので文字数指定
//
// 追記：よく見てみたら GL2.Text.setSize() で普通にフレームサイズ指定できた。
//      普通に Multiline モード使えた。ごめん。
//
// --------------------------------------------------------------------------------
// required:
//     utils.each
// --------------------------------------------------------------------------------
// USAGE:
//     var node = new Dn.MultiLineText(
//         number_of_characters_of_line, font_size, line_height, max_number_of_line
//     );
//     //addChild node to anywhere
//
//     node.setText      ( text );
//     node.setPosition  ( x, y );
//     node.setAnchor    ( x, y );
//     node.setFontSize  ( size );
//     node.setLimits    ( maxChara, maxLine );
//     node.setLineHeight( lineHeight );
//

exports.MultiLineText = GL2.Node.subclass(
/** @lends MultiLineText.prototype */
{
	classname: 'MultiLineText',
	/**
	 * @param {Number} lineLength maximum number of character of 1 line
	 * @param {Number} fontSize font size of each line
	 * @param {Number} lineHeight ratio of line height to font size
	 * @param {Number} maxLine maximum number of the line you allow
	 *
	 * @class Multi line text for GL2
	 * @author Tatsuya Koyama
	 */
	initialize: function( lineLength, fontSize, lineHeight, maxLine ) {
		this.lineLength = lineLength || 32;
		this.fontSize   = fontSize   || 20;
		this.lineHeight = lineHeight || 1.2;
		if (lineHeight === 0) { this.lineHeight = 0; }
		this.maxLine = maxLine || 0;
		
		this.text = '';
		this.lineNodes = [];
		this.anchor = {
			x: 0,
			y: 0
		};
	},

	/**
	 * Set view text. If maxLine is not 0 and text is too long,
	 * overflowed characters are cut.
	 * 
	 * @param {String} text output text
	 */
	setText: function( text ) {
		
		this.text = text;
		var lines = [];
		
		//----- しょぼい word wrap
		while (text.length > this.lineLength) {
			var cutPos;
			var cutPosOffset = 0;
			
			cutPos = text.substring( 0, this.lineLength ).indexOf( '\n' );
			var foundNewLine = (cutPos !== -1);
			if (foundNewLine) { cutPosOffset = 1; }
			
			if (! foundNewLine) {
				cutPos = text.lastIndexOf( ' ', this.lineLength );
				var foundSpace = (cutPos !== -1);
				if (! foundSpace) { cutPos = this.lineLength; }
				if (foundSpace) { cutPosOffset = 1; }
			}
			
			lines.push( text.slice( 0, cutPos ) );
			text = text.slice( cutPos + cutPosOffset );
		}
		lines.push( text );
		
		//----- maxLine を超えたぶんは切る
		if (this.maxLine > 0  &&  lines.length > this.maxLine) {
			lines.length = this.maxLine;
		}
		
		//----- line の数だけ GL2.Text を生成して保持
		var textNode;
		while (this.lineNodes.length < lines.length) {
			textNode = new GL2.Text();
			textNode.setFontSize( this.fontSize );
			textNode.setAnchor( this.anchor.x, 0 );
			this.addChild( textNode );
			this.lineNodes.push( textNode );
		}
		while (this.lineNodes.length > lines.length) {
			textNode = this.lineNodes.pop();
			textNode.destroy();
		}
		
		//----- set splited text to each GL2.Text
		for (var i=0;  i < lines.length;  i++) {
			this.lineNodes[i].setText( lines[i] );
		}
		
		this._align();
	},
	
	_align: function() {
		
		var numLine = this.lineNodes.length;
		var originY = this.anchor.y * -(numLine * this.fontSize * this.lineHeight);
		
		for (var i=0;  i < this.lineNodes.length;  i++) {
			this.lineNodes[i].setPosition( 0, originY + i * this.fontSize * this.lineHeight );
		}
	},
	
	/**
	 * @see initialize
	 */
	setLimits: function( lineLength, maxLine ) {
		
		this.lineLength = lineLength || 32;
		this.maxLine    = maxLine    ||  0;
		this.setText( this.text );
	},
	
	/**
	 * @see initialize
	 */
	setLineHeight: function( height ) {
		
		this.lineHeight = height;
		this._align();
	},
	
	/**
	 *
	 */
	setAnchor: function( x, y ) {
		
		utils.each( this.lineNodes, function(i) {
			i.setAnchor( x, 0 );
		});
		this.anchor.x = x;
		this.anchor.y = y;
		this._align();
	},
	
	/**
	 * @see initialize
	 */
	setFontSize: function( size ) {
		
		utils.each( this.lineNodes, function(i) {
			i.setFontSize( size );
		});
		this.fontSize = size;
		this._align();
	}
	
});

