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
var UI = require('../../../NGCore/Client/UI').UI;
var OrientationEmitter = require('../../../NGCore/Client/Device/OrientationEmitter').OrientationEmitter;
var utils = require('../utils').utils;


exports.UIBuilder = Class.singleton(
/** @lends UIBuilder */
{
	classname: 'NGUIBuilder',
	documentTags: {
		'view': UI.View,
		'button': UI.Button,
		'textarea': UI.Label,
		'label': UI.Label,
		'image': UI.Image,
		'webview': UI.WebView,
		'scrollView': UI.ScrollView,
		'glview': UI.GLView,
		'listview': UI.ListView,
		'listview-section': UI.ListViewSection,
		'checkbox': UI.CheckBox,
		'edittext': UI.EditText,
		'datefield': UI.DateField,
		'alertdialog': UI.AlertDialog,
		'progressdialog': UI.ProgressDialog,
		'toast': UI.Toast,
		'adview': UI.AdView,
		'spinner': UI.Spinner
	},
	/**
	 * @class
	 */
	initialize: function() {
		this.basePath = "";
	},
	setBasePath: function(basePath) {
		this.basePath = basePath;
	},
	buildWithJSONDef: function(controller, aJSONDef) {
		if(!controller) { return []; }

		return utils.map(aJSONDef, utils.bind(this, function (def) {
			return this.buildUI(controller, def);
		}));
	},
	buildUI: function(controller, aJSONDef, parentElem) {
		var view = this.createUI(controller, aJSONDef, parentElem);

		if (aJSONDef.children) {
			for (var i in aJSONDef.children) {
				var elem = this.buildUI(controller, aJSONDef.children[i], view);
				view.addChild(elem);
			}
		}
		return view;
	},
	createUI: function(controller, def, parentElem) {
		var elem = this.createElement(def.type);
		elem.setAttributes(def.attrs);
		if (elem.classname == "label" && !def.attrs.textFont && this._defaultFont) {
			elem.setTextFont(this._defaultFont);
		}
		elem.controller = controller;
		
		elem.align = def.align;
		elem.marginRight = def.marginRight;
		elem.marginLeft = def.marginLeft;
		
		elem.valign = def.valign;
		elem.marginBottom = def.marginBottom;
		elem.marginTop = def.marginTop;
		
		
		if (this._isMulti) {
			this._calcLayout(elem, def.aspectRatio, parentElem);
		} else if (this._isMultiRightBand) {
			this._calcLayoutRightBand(elem);
        }

		if (elem && def.name) {
			controller["elem_" + def.name] = elem;
		}
		
		if (def.type == "view") {
			if (def.attrs.image) {
				elem.setImage(this.basePath + def.attrs.image);
			}
		}
		if (def.type == "image") {
			if (def.attrs.image) {
				elem.setImage(this.basePath + def.attrs.image);
			}
		}
		if (def.type == "button") {
			if (def.attrs.normalImage) {
				elem.setImage(this.basePath + def.attrs.normalImage, UI.State.Normal);
			}
			if (def.attrs.selectedImage) {
				elem.setImage(this.basePath + def.attrs.selectedImage, UI.State.Selected);
			}
			if (def.attrs.highlightedImage) {
				elem.setImage(this.basePath + def.attrs.highlightedImage, UI.State.Pressed);
			}
			var beforeActionFilter = this._beforeActionFilter;
			elem.onclick = function () {
				if (!def.action) { return; }
				if (beforeActionFilter && !beforeActionFilter(this, def)) {
					return;
				}
				if (typeof def.action == 'string') {
					var fnByString = this.controller["action_" + def.action];
					fnByString.call(this.controller, elem);
				} else if (typeof def.action == 'object') {
					var fnByObject = this.controller["action_" + def.action.name];
					fnByObject.call(this.controller, def.action.params);
				}
			};
		}
		elem.layout = def.layout;
		if (!elem.layout && parentElem) {
			elem.layout = parentElem.layout;
		}

		if (!controller.__elements) {
			controller.__elements = [];
		}
		controller.__elements.push(elem);

		return elem;
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
		var scale =  scaleX >  scaleY ? scaleY : scaleX;
		var scaleS = scaleX <= scaleY ? scaleY : scaleX;
		if (elem.getFrame()) {
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

			elem.setFrame(f);
		}
		if (elem.getGradient()) {
			var g = JSON.parse(JSON.stringify(elem.getGradient()));
			if (g.outerLine) {
				var ol = g.outerLine.split(" ");
				g.outerLine = ol[0] + " " + (ol[1] * scale);
			}
			if (g.innerLine) {
				var il = g.innerLine.split(" ");
				g.innerLine = il[0] + " " + (il[1] * scale);
			}
			if (g.corners) {
				var cn = g.corners.split(" ");			
				
				if (cn[0] && cn[1] && cn[2] && cn[3]) {
					g.corners = (cn[0] * scale) + " " + (cn[1] * scale) + " " + (cn[2] * scale) + " " + (cn[3] * scale);
				} else if(cn[0]) {
					g.corners = "" + (cn[0] * scale);	
				} 
			}

			elem.setGradient(g);
		}
		if ((elem.type == "textarea" || elem.type == "label") && elem.getTextSize()) {
			if (Core.Capabilities.getPlatformOS() == "android") {
				elem.setTextSize(~~(elem.getTextSize() * scale) - 2);
			}
		}
	},
	_calcLayoutRightBand: function(elem) {
		var w  = NGWindow.outerHeight;
		var h =  NGWindow.outerWidth;
		var scaleX, scaleY;
		if (w > h) {
			scaleX = w / 480;
			scaleY = h / 320;
		} else {
			scaleX = w / 320;
			scaleY = h / 480;
		}
		var scale = scaleX > scaleY ? scaleY : scaleX;
		if (elem.getFrame()) {
			var f = elem.getFrame().slice();

			var scaleW = scale;
			var scaleH = scale;
			if (elem.type == "view") {
				if (f[2] == 480) {
					scaleW = scaleX;
				}
				if (f[3] == 320) {
					scaleH = scaleY;
				}
			}

			f[2] *= scaleW;
			f[3] *= scaleH;

			f[0] = (f[0]) * scaleW ;
			f[1] = (f[1]) * scaleH ;
			elem.setFrame(f);
		}
		if (elem.getGradient()) {
			var g = JSON.parse(JSON.stringify(elem.getGradient()));
			if (g.outerLine) {
				var ol = g.outerLine.split(" ");
				g.outerLine = ol[0] + " " + (ol[1] * scale);
			}
			if (g.innerLine) {
				var il = g.innerLine.split(" ");
				g.innerLine = il[0] + " " + (il[1] * scale);
			}
			elem.setGradient(g);
		}
		if ((elem.type == "textarea" || elem.type == "label") && elem.getTextSize()) {
				if (Core.Capabilities.getPlatformOS() == "android") {
				elem.setTextSize(~~(elem.getTextSize() * scale) - 2);
			}
		}
	},

	setMulti: function(isMulti) {
		this._isMulti = isMulti;
	},
	
	setMultiRightBand: function(bool) {
		this._isMultiRightBand = bool;
	},
	createElement: function(tagName) {
		if (!this.documentTags[tagName]) {
			throw "DOMException: Unknown tag " + tagName;
		}
		return new this.documentTags[tagName];
	},
	setBeforeActionFilter: function(filter) {
		this._beforeActionFilter = filter;
	},
	setDefaultFont: function(font) {
		this._defaultFont = font;
	}
});
