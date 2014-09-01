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
var GLUI = require('../GLUI').GLUI;
var State = require('../../../NGCore/Client/UI').UI.State;
var Class = require('../../../NGCore/Shared/Class').Class;
var Capabilities = require('../../../NGCore/Client/Core/Capabilities').Capabilities;
var utils = require('../utils').utils;
var OrientationEmitter = require('../../../NGCore/Client/Device/OrientationEmitter').OrientationEmitter;


exports.GLUIBuilder = Class.singleton ({
	classname : 'GLUIBuilder',

	ORIGINAL_FONT_SIZE: 25,

	initialize: function() {
		this._basePath = "";
		this._defaultAnchor = [0, 0];
		this._defaultDepth = 20000;
		this._defaultFont = 'Arial';
	},

	buildWithJSONDef : function(controller, aJSONDef) {
		var root = new GL2.Node();
		root.setDepth(this._defaultDepth);

		var nodes = [];

		utils.each(aJSONDef, utils.bind(this, function (def) {
			var elem = this.buildUI(controller, def, nodes);
			root.addChild(elem);
		}));

		return [root, nodes];
	},
	buildUI :function(controller, def, nodes, parentElem) {
		var elem = this.createElement(controller, def, parentElem);

		nodes.push(elem);

		if (def.children) {
			for (var i in def.children) {
				var child = this.buildUI(controller, def.children[i], nodes, elem);
				elem.addChild(child);
			}
		}

		return elem;
	},
	createElement : function(controller, def, parentElem) {
		var elem = undefined;
		switch(def.type) {
		case "view":
			elem = this.createView(controller, def);
			break;
		case "image":
			elem = this.createView(controller, def);
			break;
		case "button":
			elem = this.createButton(controller, def);
			break;
		case "text":
			elem = this.createText(controller, def);
			break;
		case "node":
			elem = this.createNode(controller, def);
			break;
		case "multiline_text":
			elem = this.createMultiLineText(controller,def);
			break;
		case "image_text":
			elem = this.createImageText(controller,def);
			break;
		case "list_view":
			elem = this.createListView(controller,def);
			break;
		default:
			NgLogE("******* not found type");
			elem = undefined;
			break;
		}

		if(elem && def.name){
			controller["elem_" + def.name] = elem;
			elem.name = def.name;
			elem.controller = controller;
		}
		elem.type = def.type;
		elem.align = def.align;
		elem.marginRight = def.marginRight;
		elem.marginLeft = def.marginLeft;
		
		elem.valign = def.valign;
		elem.marginBottom = def.marginBottom;
		elem.marginTop = def.marginTop;
		if (this._isMulti) {
			try {
				this._calcLayout(elem, def.aspectRatio, parentElem);
			} catch(e) {dn.debugT(e)}
		}
		elem.layout = def.layout;
		if (!elem.layout && parentElem) {
			elem.layout = parentElem.layout;
		}

		return elem;
	},
	createView : function(controller, def) {
		var frame = def.attrs.frame;
		var img;
		if (def.type === "image" || def.attrs.image) {
			img = new GL2.Sprite();
		} else {
			img = new GL2.Node();
		}
		var anchor = def.attrs.anchor || this._defaultAnchor;
		img.getFrame = function() {
			return this._frame;
		};

		var self = this;
		img.setFrame = function(frame) {
			if (def.attrs.image) {
				img.setImage(self._basePath + def.attrs.image, [frame[2], frame[3]], anchor);
			}
			this.setPosition(frame[0], frame[1]);
			this._frame = frame;
		};
		img.setFrame(frame);
		if (def.attrs.depth) {
			img.setDepth(def.attrs.depth);
		}
		return img;
	},
	createButton : function(controller, def) {
		var GLUI = require('../GLUI').GLUI;
		var anchor = def.attrs.anchor || this._defaultAnchor;
		// standalone はデフォルトtrueで、GLListViewとは連携しないようにする
		var attrStandalone = def.attrs.standalone !== undefined ? def.attrs.standalone : true;
		var attrTouchfilter = def.attrs.touchfilter !== undefined ? def.attrs.touchfilter : false;
		var button = new GLUI.Button({standalone: attrStandalone, touchfilter: attrTouchfilter });
		button.setAnchor(anchor);
		if(def.attrs.image) {
			button.setImage(this._basePath + def.attrs.image);
		}
		if(def.attrs.normalImage) {
			button.setImage(this._basePath + def.attrs.normalImage,State.Normal);
		}
		if(def.attrs.highlightedImage) {
			button.setImage(this._basePath + def.attrs.highlightedImage, State.Pressed);
		}
		button.setFrame(def.attrs.frame);
		if(typeof(def.id) === 'number'){
			button.setEventData([controller, def.id]);
		}
		if(def.action) {
			var beforeActionFilter = this._beforeActionFilter;
			button.onclick = function () {
				try {
					if (!def.action) { return; }
					if (beforeActionFilter && !beforeActionFilter(this, def)) {
						return;
					}
					if (typeof def.action == 'string') {
						var fnByString = this.controller["action_" + def.action];
						fnByString.call(this.controller, button);
					} else if (typeof def.action == 'object') {
						var fnByObject = this.controller["action_" + def.action.name];
						fnByObject.call(this.controller, def.action.params);
					}
				} catch(e) {
					NgLogException(e);
				}
			};
		}
		if (def.attrs.depth) {
			button.setDepth(def.attrs.depth);
		}
		return button;
	},
	createListView : function(controller, def) {
		var GLUI = require('../GLUI').GLUI;
		var listView = new GLUI.ListView();
		if(def.attrs.frame) {
			listView.setFrame(def.attrs.frame);
		}
		if(def.attrs.scrollDirection) {
			listView.setScrollDirection(def.attrs.scrollDirection);
		}
		if(def.attrs.itemSize) {
			listView.setItemSize(def.attrs.itemSize);
		}
		if(def.attrs.scrollLock) {
			listView.setscrollLock(def.attrs.scrollLock);
		}
		return listView;
	},
	////////////////////////////////////////////////////////////////////////////////
	createText : function(controller, def) {
		var defaultFontSize = 15;
		var c_r = def.color_r !== undefined ? def.color_r : 0.0;
		var c_g = def.color_g !== undefined ? def.color_g : 0.0;
		var c_b = def.color_b !== undefined ? def.color_b : 0.0;
		var color = def.attrs.color || [c_r, c_g, c_b];
		var frame = def.attrs.frame;
		var overflowMode = def.attrs.overflowMode !== undefined ? def.attrs.overflowMode :  GL2.Text.OverflowMode.Multiline;
		var horizontalAlign = def.attrs.horizontalAlign !== undefined ? def.attrs.horizontalAlign : GL2.Text.HorizontalAlign.Left;
		var verticalAlign = def.attrs.verticalAlign !== undefined ? def.attrs.verticalAlign : GL2.Text.VerticalAlign.Top;
		var anchor = def.attrs.anchor || this._defaultAnchor;
		var label = new GL2.Text(def.attrs.normalText);
		var fontSize = def.attrs.fontSize || defaultFontSize;
		//var fontSize = defaultFontSize;
		var fontFamily = def.attrs.fontFamily || this._defaultFont;
		var scale = fontSize / this.ORIGINAL_FONT_SIZE;
		label.setAnchor(anchor);
		label.setFontFamily(fontFamily);
		//label.setFontSize(fontSize);
		if (Capabilities.getPlatformOS() == 'Android') {
		//	label.setFontSize( this.ORIGINAL_FONT_SIZE - 3);
			label.setFontSize( this.ORIGINAL_FONT_SIZE);
		} else {
			label.setFontSize( this.ORIGINAL_FONT_SIZE);
		}
		label.setScale(scale,scale);
		label.setColor(color);
		if (def.attrs.depth) {
			label.setDepth(def.attrs.depth);
		}
		label.getFrame = function() {
			return this._frame;
		};

		label.setFrame = function(frame) {
			this.setPosition(frame[0], frame[1]);
			//setSizeと文字の大きさによってアプリあ落ちるケース
			//あるので、いったん、以下の値がセットされている場合のみsetSizeするようにする。
			var scales = label.getScale();
			this.setSize( frame[2] / scales.getX() , frame[3] / scales.getY() );
			this._frame = frame;
		};
		label.setHorizontalAlign(horizontalAlign);
		label.setVerticalAlign(verticalAlign);
		label.setOverflowMode(overflowMode);
		label.setFrame(frame);
		return label;
	},
	createMultiLineText : function(controller, def) {
		var defaultFontSize = this.ORIGINAL_FONT_SIZE;
		var c_r = def.color_r !== undefined ? def.color_r : 0.0;
		var c_g = def.color_g !== undefined ? def.color_g : 0.0;
		var c_b = def.color_b !== undefined ? def.color_b : 0.0;
		var color = def.attrs.color || [c_r, c_g, c_b];
		var frame = def.attrs.frame;
		var anchor = def.attrs.anchor || this._defaultAnchor;
		var scale = def.attrs.fontSize / defaultFontSize;
		var fontSize = defaultFontSize;
		var fontFamily = def.attrs.fontFamily || 'Arial';
		//var fontFamily = def.attrs.font || "Arial";

		var label = new Dn.MultiLineText(def.attrs.lineLength, fontSize, def.attrs.lineHeight, def.attrs.maxLine);
		label.setAnchor(anchor[0],anchor[1]);
		label.setPosition(frame[0],frame[1]);
		label.setColor(color);
		label.setText(def.attrs.normalText);
		if (def.attrs.depth) {
			label.setDepth(def.attrs.depth);
		}
		return label;
	},
	createImageText : function(controller, def) {
		NgLogD("createImageText start");
		var defaultFontSize = 14;
		var gradColorTop = def.attrs.gradColorTop || [1,1,0.5];
		var gradColorBottom = def.attrs.gradColorBottom || [0.6,0.6,0.3];
		var anchor  = def.attrs.anchor || this._defaultAnchor;
		var imagePath = def.attrs.image || 'font/brush.png'
		var fontSize = def.attrs.fontSize || defaultFontSize;
		var spacing = def.attrs.spacing || fontSize * -0.1;
		var frame = def.attrs.frame;
		var text = def.attrs.normalText;
		var label = Dn.ImageFontFactory.create(
				imagePath, text, fontSize, spacing, gradColorTop, gradColorBottom
		);
		label.setPosition(frame[0],frame[1]);
		label.setAnchor(anchor[0],anchor[1]);
		if (def.attrs.depth) {
			label.setDepth(def.attrs.depth);
		}
		return label;
	},
	createNode : function(controller, def) {
		var frame = def.attrs.frame;
		var node = new GL2.Node();
		node.setPosition(frame[0], frame[1]);
		if (def.attrs.depth) {
			node.setDepth(def.attrs.depth);
		}
		if (def.attrs.alpha) {
			node.setAlpha(def.attrs.alpha);
		}
		if (def.attrs.rotation) {
			node.setRotation(def.attrs.rotation);
		}
		if (def.attrs.scale) {
			node.setScale(def.attrs.scale);
		}
		return node;
	},
	setBasePath: function(basePath) {
		this._basePath = basePath;
	},
	setDefaultAnchor: function(anchor) {
		this._defaultAnchor = anchor;
	},
	setDefaultFont: function(font) {
		this._defaultFont = font;
	},
	setDefaultDepth: function(depth) {
		this._defaultDepth = depth;
	},
	setMulti: function(isMulti) {
		this._isMulti = isMulti;
	},
	_calcLayout: function(elem, ar, parentElem) {
		var o = OrientationEmitter.getInterfaceOrientation();
		var w, h;
		if (o == OrientationEmitter.Orientation.LandscapeLeft ||
			o == OrientationEmitter.Orientation.LandscapeRight) {
			w  = NGWindow.outerHeight;
			h =  NGWindow.outerWidth;
		} else {
			w  = NGWindow.outerWidth;
			h =  NGWindow.outerHeight;
		}
		var scaleX, scaleY;
		if (w > h) {
			scaleX = w / 480;
			scaleY = h / 320;
		} else {
			scaleX = w / 320;
			scaleY = h / 480;
		}
		var scale = scaleX > scaleY ? scaleY : scaleX;
		var scaleS = scaleX <= scaleY ? scaleY : scaleX;
		if (elem.getFrame && elem.getFrame()) {
			var f = elem.getFrame().slice();

			var scaleW;
			var scaleH;
			if (ar == 1) {
				scaleW = scaleX;
				scaleH = scaleY;
			} else if (ar == 2) {
				var scaleW = scaleS;
				var scaleH = scaleS;
			} else {
				scaleW = scale;
				scaleH = scale;
			}

			var vw = f[2];
			var vh = f[3];

			// for align use
			var cw;
			var f2;

			if (parentElem && parentElem.layout == "solid") {
				f[2] *= scale;
				f[3] *= scale;
				f[0] *= scale;
				f[1] *= scale;
			} else {
				f[2] *= scaleW;
				f[3] *= scaleH;
				f[0] = (f[0] + vw) * scaleX - vw * scaleX;
				f[1] = (f[1] + vh) * scaleY - vh * scaleY;
			}
			if (elem.align == "center") {
				cw = w;
				if (parentElem) {
					f2 = parentElem.getFrame();
					cw = f2[2];
				}
				f[0] = cw / 2 - f[2] / 2;
			} else if (elem.align == "right") {
				cw = w;
				if (parentElem) {
					f2 = parentElem.getFrame();
					cw = f2[2];
				}
				f[0] = cw - f[2];
				if (elem.marginRight > 0) {
					f[0] -= elem.marginRight;
				}
			} else if (elem.align == "left") {
				// the left point should be 0
				// to the parentElem
				f[0] = 0;

				if (elem.marginLeft > 0) {
					f[0] += elem.marginLeft;
				}
			}
			// valign 
			if (elem.valign == "middle") {
				ch = h;
				if (parentElem) {
					f2 = parentElem.getFrame();
					ch = f2[3];
				}
				f[1] = ch / 2 - f[3] / 2;
			} else if (elem.valign == "bottom") {
				ch = h;
				if (parentElem) {
					f2 = parentElem.getFrame();
					ch = f2[3];
				}
				f[1] = ch - f[3];
				if (elem.marginBottom > 0) {
					f[1] -= elem.marginBottom;
				}
			} else if (elem.valign == "top") {
				// the top point should be 0		
				// to the parentElem
				f[1] = 0;

				if (elem.marginTop > 0) {
					f[1] += elem.marginTop;
				}
			}
			if ((elem.type == "text")) {
				var scales = elem.getScale();
				if (Capabilities.getPlatformOS() == 'Android') {
					var minus = 2 / this.ORIGINAL_FONT_SIZE;
					//var minus = 0.5;
					NgLogE("WJXDEBUG1: minus="+minus+"\tscaleX="+scales.getX()+"\tscaleY="+scales.getY());	
					NgLogE("WJXDEBUG2: scale="+scale+"\tscaleX="+scales.getX()+"\tscaleY="+scales.getY());	
					//elem.setScale(scale + scales.getX() - 1 - minus,scale + scales.getY() - 1 - minus);
					var alpha = 0.1;
					var sx = scale * alpha + scales.getX() * scale * 0.8;
					var sy = scale * alpha + scales.getY() * scale * 0.8;
					elem.setScale(sx,sy);
					NgLogE("WJXDEBUG3: scale="+scale+"\tscaleX="+scales.getX()+"\tscaleY="+scales.getY());	
					NgLogE("WJXDEBUG4: screenWidth="+Capabilities.getScreenWidth()+"\tscreenHeight="+Capabilities.getScreenHeight());	
					NgLogE("WJXDEBUG5: w="+w+"\th="+h);	
				} else {
					//elem.setScale(scale + scales.getX() - 1, scale + scales.getY() -1);
					var alpha = 0.1;
					var sx = scale * alpha + scales.getX() * scale * 0.8;
					var sy = scale * alpha + scales.getY() * scale * 0.8;
					elem.setScale(sx,sy);
				}
			}
			elem.setFrame(f);
		}
	},
	setBeforeActionFilter: function(filter) {
		this._beforeActionFilter = filter;
	}
});


