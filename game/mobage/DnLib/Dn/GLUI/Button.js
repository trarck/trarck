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
var State = require('../../../NGCore/Client/UI').UI.State;
var Core = require('../../../NGCore/Client/Core').Core;
var GLUIUtil  = require('./GLUIUtil').GLUIUtil;
var URLSprite = require('../GL2/URLSprite').URLSprite;


exports._unbindButtons = [];
exports._activeButton = undefined;


var ButtonListener = Core.MessageListener.subclass({
    classname: 'ButtonListener',
	initialize: function(button, touchTarget) {
		this._button = button;
		this._enable = false;
		this._useFilter = this._button._useTouchFilter;
		this._touchFilter = undefined;
		if (touchTarget) {
			touchTarget.getTouchEmitter().addListener(this, this.onTouch);
		}
	},
	reset: function() {
		this._trackingId = NaN;
		this._enable = false;
		if (this._touchFilter) {
			this._touchFilter.destroy();
			this._touchFilter = undefined;
		}
	} ,
	onTouch: function(touch) {
		if (exports._activeButton && exports._activeButton !== this) {
			return false;
		}
		if (this._button.getEnabled()) {
			switch(touch.getAction()) {
			case touch.Action.Start:
				this._trackingId = touch.getId();
				if (this._trackingId !== 1 && Core.Capabilities.getPlatformOS() === "android") {
					return false;
				}
				this._trackingCurrent = touch.getPosition();
				this._button._doTap(touch.getId());

				if (!this._button._multitouch) {
					exports._activeButton = this;
					if (this._useFilter) {
						this._touchFilter = new GLUIUtil.TouchFilter(this._trackingId);
					}
				}
				this._enable = true;

				return true;
			case touch.Action.End:
				if(!this._enable || (this._trackingId != touch.getId())) {
					return false;
				}
				this._trackingId = NaN;
				if (this._button.hitTest(this._button.screenToLocal(touch.getPosition()))){
					this._button._endTap(true);
				} else {
					this._button._endTap(false);
				}
				exports._activeButton = undefined;
				this._enable = false;
				if (this._touchFilter) {
					this._touchFilter.setDestroyFlag();
					this._touchFilter = undefined;
				}
				break;
			default:
				break;
			}
		}
		return false;
	}
});


exports.Button = URLSprite.subclass({
	classname: "Button",
    initialize: function(option) {
		this._images = {};
		this._enabled = true;
		this._pressed = false;
		this._checked = false;
		this._highlight = false;
		this._size = null;
		this._touchMargin = [0, 0];
		this._text = new GL2.Text();
		this._touchTarget = null;
		this._data = undefined;
		this._anchor = [0, 0];
		this.onclick = null;
		this.onpressdown = null;
		this.onpressup = null;
		this.addChild(this._text);
		option = option || {};
		this._standalone = option.standalone;
		if (!option.standalone) {
			exports._unbindButtons.push(this);
		}
		this._useTouchFilter = option.touchfilter;
		this._multitouch = option.multitouch;
	},
	destroy: function($super) {
		if (this._listener) {
			if (exports._activeButton === this._listener) {
				exports._activeButton = undefined;
			}
			this._listener.destroy();
		}
		this._text.destroy();
		if (this._touchTarget) {
			if (Core.ObjectRegistry.isObjectRegistered(this._touchTarget)) {
				this._touchTarget.destroy();
			}
		}
		$super();
	},
	setImage: function($super, filename, state, uvs) {
		if (typeof(state) == 'number') {
			uvs = uvs || [0, 0, 1, 1];
			this._images[state] = [filename, uvs];
			this._setImage();					
		} else if (state === undefined){
			uvs = uvs || [0, 0, 1, 1];
			this._images[State.Normal] = [filename, uvs];
			this._setImage();
		} else {
			$super(filename, this._size, this._anchor, state);
		}
	},
	setAnchor: function(anchor) {
		this._anchor = anchor;
		this._fixTextPosition();
	},
	setEventData: function(data) {
		this._data = data;
	},
	setText: function(text) {
		this._text.setText(text);
	},
	setTextColor: function(r, g, b) {
		this._text.setColor(r, g, b);
	},
	setSize: function(size) {
		this._size = new Core.Size(size);

		if (this._standalone) {
			this._initTouch();
		}
		this._fixTextPosition();
	},
	setFrame: function(frame) {
		this._frame = frame;
		var x = frame[0];
		var y = frame[1];
		var w = frame[2];
		var h = frame[3];
		this.setPosition(x, y);
		this._size = new Core.Size(w, h);
		
		if (this._standalone) {
			this._initTouch();
		}
		this._setImage();
		this._fixTextPosition();
		return this;
	},
	getFrame: function() {
		return this._frame;
	},
	setTouchMargin: function(marginX, marginY) {
		if (marginX === undefined || marginY === undefined)
		{
			NgLog("Invalid touchMargin is specified. ");
		}
		else
		{
			this._touchMargin = [marginX, marginY];
			this._updateTouchTargetArea();
		}
	},
	getTouchAreaSize: function() {
		return new Core.Size(this._size.getWidth() + this._touchMargin[0] * 2, this._size.getHeight() + this._touchMargin[1] * 2);
	},
	setEnabled: function(bool) {
		this._enabled = bool;
		this._setImage();
		return this;
	},
	getEnabled: function() {
		return this._enabled;
	},
	setVisible: function($super, visible) {
		if (!visible) {
			this.reset();
		}
		$super(visible);
		return this;
	},
	reset: function() {
		this._pressed = false;
		this._setImage();
		this._trackingId = NaN;
		if (this._listener) {
			this._listener.reset();
		}
	},
	_initTouch: function() {
		if (!this._touchTarget) {
			this._touchTarget = new GL2.TouchTarget();
			this.addChild(this._touchTarget);
			this._listener = new ButtonListener(this, this._touchTarget);
		}
		this._updateTouchTargetArea();
	},
	_fixTextPosition: function() {
		if (this._size) {
			var x = (0.5 - this._anchor[0]) * this._size.getWidth();
			var y = (0.5 - this._anchor[1]) * this._size.getHeight();
			this._text.setPosition([x, y]);			
		}
	},
	_setImage: function() {
		if (!this._images[State.Normal] || !this._size) {
			return;
		}
		var Normal = State.Normal;
		var isColorChange = false;
		if (this._checked) {
			if (this._images[State.Checked]) {
				Normal = State.Checked;
			} else {
				isColorChange = true;
			}
		}
		var setImage = function(self, imagetype) {
			var image = self._images[imagetype];
			self.setImage(image[0], image[1]);
		};
		
		if (!this._enabled) {
			if (this._images[State.Disabled]) {
				setImage(this, State.Disabled);
				this.setAlpha(1);
			} else {
				setImage(this, Normal);
				this.setAlpha(0.5);
				this.setColor(1, 1, 1);
			}
		} else if (this._pressed) {
			if (this._images[State.Pressed]) {
				setImage(this, State.Pressed);
				this.setAlpha(1);
				this.setColor(1, 1, 1);
			} else {
				setImage(this, Normal);
				this.setAlpha(1);
				if (isColorChange) {
					this.setColor(1.0, 0.4, 0.4);
				} else {
					this.setColor(0.4, 0.4, 0.4);
				}
			}
		} else {
			setImage(this, Normal);
			this.setAlpha(1);
			this.setColor(1.0, 1.0, 1.0);
		}
	},
	_updateTouchTargetArea: function()
	{
		this._touchTarget.setAnchor([0, 0]);
		this._touchTarget.setSize(this.getTouchAreaSize());
		this._touchTarget.setPosition(-this._size.getWidth() * this._anchor[0] - this._touchMargin[0], -this._size.getHeight() * this._anchor[1] - this._touchMargin[1]);
	},
	_startTap: function(point) {
		if (this._enabled && this.hitTest(this.screenToLocal(point))) {
			this._doTap();
			return true;
		}
		return false;
	},
	hitTest: function(point) {
		if (point) {
			var size;
			var sx;
			var sy;

			if (this._touchTarget)
			{
				size = this._touchTarget.getSize();
				sx = this._touchTarget.getPosition().getX();
				sy = this._touchTarget.getPosition().getY();
			}
			else
			{
				size = this._size;
				sx = -size.getWidth() * this._anchor[0];
				sy = -size.getHeight() * this._anchor[1];
			}

			var ex = sx + size.getWidth();
			var ey = sy + size.getHeight();	

			return ((sx < point.getX()) && (point.getX() < ex) && (sy < point.getY()) && (point.getY() < ey));
		}
	},
	_doTap: function(touchid) {
		this._pressed = true;
		this._setImage();
		if (this.onpressdown) {
			try {
				this.onpressdown();
			} catch(ex) {
				console.log("@@@@ Error at DnLib.GLUI.Button._doTap @@@@");
				NgLogException(ex);
			}
		}
	},
	_endTap: function(validPress) {
		if (this._pressed && validPress && this.onclick) {
			try {
				this.onclick.call(this, this._data);
			} catch(ex) {
				console.log("@@@@ Error at DnLib.GLUI.Button._endTap / call onclick @@@@");
				NgLogException(ex);
			}
		}
		this._pressed = false;
		this._setImage();
		if (this.onpressup) {
			try {
				this.onpressup();
			} catch(ex) {
				console.log("@@@@ Error at DnLib.GLUI.Button._endTap / call onpressup @@@@");
				NgLogException(ex);
			}
		}
	}
});


exports.ToggleButton = exports.Button.subclass({
	_endTap: function(validPress) {
		this._pressed = false;
		if (validPress) {
			if (this._checked) {
				this._checked = false;
				if (this.onturnoff) {
					try {
						this.onturnoff();
					} catch(ex) {
						console.log("@@@@ Error at DnLib.GLUI.Button._endTap / call onturnoff @@@@");
						NgLogException(ex);
					}
				}
			} else {
				this._checked = true;
				if (this.onturnon) {
					try {
						this.onturnon();
					} catch(ex) {
						console.log("@@@@ Error at DnLib.GLUI.Button._endTap / call onturnon @@@@");
						NgLogException(ex);
					}
				}			
			}			
		}
		this._setImage();
		if (this.onpressup) {
			try {
				this.onpressup();
			} catch(ex) {
				console.log("@@@@ Error at DnLib.GLUI.Button._endTap / call onpressup @@@@");
				NgLogException(ex);
			}
		}
	}
});
