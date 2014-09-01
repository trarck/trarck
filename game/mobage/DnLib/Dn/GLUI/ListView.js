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
var unbindButtons = require('./Button')._unbindButtons;
var GLUIUtil = require('./GLUIUtil').GLUIUtil;


exports.ListView = GL2.Node.subclass(
/** @lends Dn.GLUI.ListView.prototype */
{
	classname: 'ListView',
	ScrollDirection: { 
		Horizontal: 1,
		Vertical: 2
	},
	/**
	 * @class ListView class on GL2 package.
	 * It supports vertical list and horizontal list. It assumes <i>GL2.Sprite</i> as list item.
	 * (of course, <i>GL2.Sprite</i> can have children (<i>Dn.GLUI.Button</i>, <i>GL2.Text</i>, <i>GL2.Sprite</i>... and so on).
 	 * 
 	 * @example
 	 * // Create List View; 
 	 * var listview = new GLUI.ListView();
	 * listview.setItemSize([200, 200]);
	 * listview.setFrame([0, 160, 240, 200]);
	 * listview.setScrollDirection(GLUI.ListView.ScrollDirection.Horizontal);
	 *
	 * // Create child 
	 * listitem = new GL2.Sprite();
	 * listitem.setImage("Content/list item.png", [200, 200]);
	 * var bus = new GL2.Sprite();
	 * bus.setImage(itemlist[i][1], [79, 33]);
	 * bus.setPosition(0, -20);
	 * listitem.addChild(bus);
	 *
	 * // Append child. Second parameter is composite object which is destroyed with list item.
	 * listview.addItem(listitem, [label]);
 	 * @constructs The default constructor.
	 * @augments GL2.Node
	 */
	initialize: function() {
		this._frame = undefined;
		this._itemSize = new Core.Size();
		this._contentSize = new Core.Size();
		this._content = new GL2.Node();
		this._content.setDepth(0);
		this.addChild(this._content);
		this._feeling = {
			friction: 0.9,
			smoothingFactor: 0.3,
			stretchDecay: 0.65,
			rangeFactor: 0.5
		};
		this.setScrollDirection(this.ScrollDirection.Horizontal);
		this._momentum = {
				x: 0,
				y: 0
		};
		this._listitems = [];
		this._buttons = [];
		this._scrollbar = new Scrollbar();
		this._dirty = false;
		this.setClickThreshold(1/20);
		this.addChild(this._scrollbar);
	},
	setClickThreshold: function(rate) {
		var w = Core.Capabilities.getScreenWidth();
		var h = Core.Capabilities.getScreenHeight();
		this._threshold = Math.sqrt(w*w + h*h) * rate;
	},
	setScrollFeeling: function(feeling) {
		for ( var key in this._feeling) {
			this._feeling[key] = feeling[key] || this._feeling[key];
		}
	},
	/**
	 * Set item size. You need set this parameter.
	 * @param {Array} itemSize The size of each items. It is two value array like <i>[200, 200]</i>.
	 */
	setItemSize: function(itemSize) {
		this._itemSize = new Core.Size(itemSize);		
	},
	setFrame: function(frame) {
		this._frame = new Core.Rect(frame);
		var origin = this._frame.getOrigin();
		var size = this._frame.getSize();
		this.setPosition(origin.getX() + size.getWidth() / 2, origin.getY() + size.getHeight() / 2);
		
		if (this._dragger) {
			this._dragger.destroy();
		}
		if (this._touchTarget) {
			this.removeChild(this._touchTarget);
			this._touchTarget.destroy();
		}
		this._dragger = new DragListener(this);
		this._touchTarget = this._dragger.getTarget();
		this._touchTarget.setSize(size);
		this._touchTarget.setPosition(-size.getWidth() / 2, -size.getHeight()/2);
		this._touchTarget.setDepth(1);
		this._scrollLock = false;
		
		this.addChild(this._touchTarget);
		this._dirty = true;
	},
	setScrollDirection: function(dir) {
		switch (dir) {
		case this.ScrollDirection.Horizontal:
		case this.ScrollDirection.Vertical:
			this._scroll = dir;
			this._dirty = true;
			this._content.setPosition(0, 0);
			break;
		default:
			console.log("at setScrollDirection() invalid value: " + dir);
		break;
		}
	},
	getScrollDirection: function() {
		return this._scroll;
	},
	setScrollLock: function(lock) {
		this._scrollLock = lock;
	},
	getScrollLock: function() {
		return this._scrollLock;
	},
	_setContentSize: function() {
		if (!this._dirty) {
			return;
		}
		this._dirty = false;
		var i, item, width, height, anchor, bias, anchorH, anchorV;
		if (this._scroll == this.ScrollDirection.Horizontal) {
			width = this._itemSize.getWidth();
			height = this._frame.getSize().getHeight();
			bias = - this._frame.getSize().getWidth() / 2;
			this._contentSize.setHeight(this._frame.getSize().getHeight());
			this._contentSize.setWidth(width * this._listitems.length);
			var left = 0;
			for ( i = 0; i < this._listitems.length; i++) {
				item = this._listitems[i][0];
				anchor = GLUIUtil.getAnchor(item);
				anchorH = - width * anchor.getX();
				anchorV = this._itemSize.getHeight() * (anchor.getY() - 0.5);
				item.setPosition(left + anchorH + bias, anchorV);
				left += width;
			}
		} else {
			width = this._frame.getSize().getWidth();
			height = this._itemSize.getHeight();
			bias = - this._frame.getSize().getHeight() / 2;
			this._contentSize.setWidth(this._frame.getSize().getWidth());
			this._contentSize.setHeight(height * this._listitems.length);
			var top = 0;
			for ( i = 0; i < this._listitems.length; i++) {
				item = this._listitems[i][0];
				anchor = GLUIUtil.getAnchor(item);
				anchorH = this._itemSize.getWidth() * (anchor.getX() - 0.5);
				anchorV = - height * (anchor.getY());
				item.setPosition(anchorH, top + anchorV + bias);
				top += height;
			}
		}
		this._scrollbar.updateSize(this._scroll, this._frame, this._contentSize);
		this._appendButton();
	},
	setScrollPosition: function(vector) {
		vector = new Core.Vector(vector);
		if (vector.getX() === undefined || vector.getY() === undefined) {
			return;
		}
		
		var h_upper = 0;
		var h_lower = this._frame.getSize().getWidth() - this._contentSize.getWidth();
		if (h_lower > -1) {
			h_lower = -1;
		}
		
		var v_upper = 0;
		var v_lower = this._frame.getSize().getHeight() - this._contentSize.getHeight();
		if (v_lower > -1) {
			v_lower = -1;
		}
		
		var new_x = this._content.getPosition().getX();
		var new_y = this._content.getPosition().getY();
		
		if (this._scroll == this.ScrollDirection.Horizontal) {
			new_x = h_lower/2 + (h_upper - h_lower) * vector.getX();
		} else {
			new_y = v_lower/2 + (v_upper - v_lower) * vector.getY();
		}
		this._content.setPosition(new_x,new_y);
	},
	addItem: function(childItem, associatedItems) {
		associatedItems = associatedItems || [];
		this._listitems.push([childItem, associatedItems]);
		this._content.addChild(childItem);
		this._dirty = true;
	},
	_appendButton: function() {
		var unused = [];
		while (unbindButtons.length !== 0) {
			var button = unbindButtons.pop();
			var parent = button.getParent();
			while(true) {
				if (parent == this) {
					this._buttons.push(button);
					break;
				} else if (parent === null) {
					unused.push(button);
					break;
				}
				parent = parent.getParent();
			}
		}
		for ( var k = 0; k < unused.length; k++) {
			var unusedElement = unused[k];
			unbindButtons.push(unusedElement);
		}
		this._buttons.sort(function(a, b) {
			return (b.getDepth() - a.getDepth());
		});
	},
	_startTap: function(point) {
		for ( var i = 0; i < this._buttons.length; i++) {
			var button = this._buttons[i];
			if(button._startTap(point)) {
				break;
			}
		}
	},
	_endTap: function(point) {
		var x = point.getX();
		var y = point.getY();
		var distance = Math.sqrt(x*x+y*y);
		var validClick = distance < this._threshold;
		for ( var i = 0; i < this._buttons.length; i++) {
			var button = this._buttons[i];
			button._endTap(validClick);
		}
	},
	getListSize: function() {
		return this._listitems.length;
	},
	removeItem : function(index) {
		function indexOf(array, o) {
			for ( var i = 0; i < array.length; i++) {
				if (array[i] == o) {
					return i;
				}
			}
			return -1;
		}
		var item = this._listitems[index];
		this._listitems.splice(index, 1);
		item[0].destroy();

		for ( var j = 0; j < item[1].length; j++) {
			var subitem = item[1][j];
			var btnIndex = indexOf(this._buttons, subitem);
			if (btnIndex >= 0) {
				this._buttons.splice(btnIndex, 1);
			}
			subitem.destroy();
		}
		this._dirty = true;
	},
	clearItems: function() {
		for ( var i = 0; i < this._listitems.length; i++) {
			var item = this._listitems[i];
			for ( var j = 0; j < item[1].length; j++) {
				item[1][j].destroy();
			}
			item[0].destroy();
		}
		this._dirty = true;
		this._listitems = [];
		this._buttons = [];
		this._contentSize = new Core.Size();
	},
	destroy: function($super) {
		this.clearItems();
		this._scrollbar.destroy();
		this._content.destroy();
		this._touchTarget.destroy();
		this._dragger.destroy();
		$super();
	},
	//This function calculates application of deltas over the range of positions.
	_applyRange: function(position, delta, lower, upper) {
		if (delta === 0) {
			return position;
		}
		
		//Handle positive delta
		if (delta > 0) {
			//If we're below our lower bound, only move by range factor.
			if (position < lower) {
				position += delta * this._feeling.rangeFactor;
				//If we've moved into range, apply the delta into range and save the remainder.
				if (position >= lower) {
					delta = (position - lower) / this._feeling.rangeFactor;
					position = lower;
				} else {
					return position;
				}
			}
			//If we're inside our bounds, apply the delta
			if (position < upper) {
				//if the delta will place us out of range, apply it and save the remainder.
				if (position + delta > upper) {
					delta -= (upper - position);
					position = upper;
					delta *= this._feeling.rangeFactor;
				}
			}
			//We're out of range, so only apply by range factor.
			else {
				delta *= this._feeling.rangeFactor;
			}
		}
		
		//Handle negative delta; same thing, just bounds reversed.
		else if (delta < 0) {
			if (position > upper) {
				position += delta * this._feeling.rangeFactor;
				if (position <= upper) {
					delta = (position - upper) / this._feeling.rangeFactor;
					position = upper;
				} else {
					return position;
				}
			} if (position > lower) {
				if (position + delta < lower) {
					delta -= (lower - position);
					position = lower;
					delta *= this._feeling.rangeFactor;
				}
			} else {
				delta *= this._feeling.rangeFactor;
			}
		}
		return position + delta;
	},
	_onUpdate: function(delta) {
		this._setContentSize();
		var sf = this._feeling.smoothingFactor;
		var hasTouch = this._dragger.hasTouch();
		
		//Our ranges are negative because we push the origin up/left from the start position.
		var h_upper = 0;
		var h_lower = this._frame.getSize().getWidth() - this._contentSize.getWidth();
		if (h_lower > -1) {
			h_lower = -1;
		}
		
		var v_upper = 0;
		var v_lower = this._frame.getSize().getHeight() - this._contentSize.getHeight();
		if (v_lower > -1) {
			v_lower = -1;
		}
		
		var new_x = this._content.getPosition().getX();
		var new_y = this._content.getPosition().getY();
		//if we're in bounds and we have no movement, don't bother updating
		if (delta.x === 0 && delta.y === 0) {
			if (this._momentum.x === 0 && this._momentum.y === 0) {
				if (hasTouch ||
					new_x >= h_lower && new_x <= h_upper &&
					new_y >= v_lower && new_y <= h_upper) {
					this._scrollbar.updateAlpha(this._momentum);
					return;
				}
			}
		}
		
		//If we have touches accumulate momentum
		if (hasTouch) {
			//Use exponential smoothing to approximate the current momentum
			this._momentum.x = sf * delta.x + (1 - sf) * this._momentum.x;
			this._momentum.y = sf * delta.y + (1 - sf) * this._momentum.y;			
		}
		//Otherwise, consume the momentum.
		else {
			delta.x += this._momentum.x;
			delta.y += this._momentum.y;
			
			//Apply friction, stop if we're below a small threshold.
			this._momentum.x *= this._feeling.friction;
			this._momentum.y *= this._feeling.friction;
			if (this._momentum.x < 1 && this._momentum.x > -1) {
				this._momentum.x = 0;
			}
			if (this._momentum.y < 1 && this._momentum.y > -1) {
				this._momentum.y = 0;
			}
		}
		
		//Handle any deltas
		if (this._scroll == this.ScrollDirection.Horizontal) {
			new_x = this._applyRange(new_x, delta.x, h_lower, h_upper);
		} else {
			new_y = this._applyRange(new_y, delta.y, v_lower, v_upper);
		}
		
		//Without touches to anchor us, we should slide back into range.
		if (!hasTouch) {
			if (new_x < h_lower) {
				new_x = h_lower - (h_lower - new_x) * this._feeling.stretchDecay;
				if (h_lower - new_x < 1) {
					new_x = h_lower;
				}
			} else if (new_x > h_upper) {
				new_x = h_upper + (new_x - h_upper) * this._feeling.stretchDecay;
				if (new_x - h_upper < 1) {
					new_x = h_upper;
				}
			} if (new_y < v_lower) {
				new_y = v_lower - (v_lower - new_y) * this._feeling.stretchDecay;
				if (v_lower - new_y < 1) {
					new_y = v_lower;
				}
			} else if (new_y > h_upper) {
				new_y = v_upper + (new_y - v_upper) * this._feeling.stretchDecay;
				if (new_y - v_upper < 1) {
					new_y = v_upper;
				}
			}
		}
		this._content.setPosition(new_x, new_y);
		this._scrollbar.updatePosition(new_x, new_y);
	}
});


var Scrollbar = GLUIUtil.Rectangle.subclass({
	initialize: function($super) {
		$super();
		this.setColor([0.5, 0.5, 0.5]);
		this.setAlpha(0);
		this.setDepth(65535);
	},
	updateSize: function(mode, frame, contentSize) {
		var f_width = frame.getSize().getWidth();
		var f_height = frame.getSize().getHeight();
		var c_width = contentSize.getWidth();
		var c_height = contentSize.getHeight();
		
		if (mode === exports.ListView.ScrollDirection.Horizontal) {
			this.setFrame([f_width/2, f_height/2-5, f_width * (f_width / c_width), 5]);		
		} else {
			this.setFrame([f_width/2-5, f_height/2, 5, f_height * (f_height / c_height)]);			
		}
		this.mode = mode;
		this.frameSize = new Core.Size([f_width, f_height]);
		this.contentSize = new Core.Size([c_width, c_height]);
	},
	updateAlpha: function(momentum) {
		if (momentum.x === 0 && momentum.y === 0) {
			var alpha = this.getAlpha();
			if (alpha === 0) {
				return;
			} else {
				alpha -= 0.03;
				if (alpha < 0.01) {
					alpha = 0;
				}
				this.setAlpha(alpha);
			}
		}
	},
	updatePosition: function(new_x, new_y) {
		this.setAlpha(1);
		if (!this.mode) {
			return;
		}
		var f_width = this.frameSize.getWidth();
		var f_height = this.frameSize.getHeight();
		var c_width = this.contentSize.getWidth();
		var c_height = this.contentSize.getHeight();
		
		if (this.mode === exports.ListView.ScrollDirection.Horizontal) {
			this.setPosition(- f_width * (0.5 + new_x/c_width), f_height/2-5);
		} else {
			this.setPosition(f_width/2-5, -f_height * (0.5 + new_y/c_height));
		}
	}
});


var DragListener = Core.MessageListener.subclass({
	classname: 'DragListener',

	initialize: function(listview) {
		this._touch = null;
		this.listview = listview;
		this._target = new GL2.TouchTarget();
		this._target.getTouchEmitter().addListener(this, this.onTouch);

		Core.UpdateEmitter.addListener(this, this.onUpdate);
	},
	getTarget: function() {
		return this._target;
	},
	onTouch: function(touch) {
		switch(touch.getAction()) {
		case touch.Action.Start:
			if (this._touch) {
				return false;
			}
			this._touch = {
				id:touch.getId(),
				sx:touch.getPosition().getX(),
				sy:touch.getPosition().getY(),
				x:touch.getPosition().getX(),
				y:touch.getPosition().getY(),
				dx:0,
				dy:0
			};
			this.listview._startTap(touch.getPosition());
			return true;
		case touch.Action.End:
			if (this._touch.id != touch.getId()) {
				return false;
			}
			this.listview._endTap(new Core.Point(this._touch.x - this._touch.sx, this._touch.y - this._touch.sy));
			this._touch = null;
			break;
		case touch.Action.Move: 
			if (this._touch.id != touch.getId() || this.listview._scrollLock) {
				return false;
			}
			var pos = touch.getPosition();
			if (this._touch === null || pos === undefined) {
				break;
			}
			this._touch.dx += pos.getX() - this._touch.x;
			this._touch.dy += pos.getY() - this._touch.y;
			this._touch.x = pos.getX();
			this._touch.y = pos.getY();
			break;
		default:
			break;
		}
		return false;
	},
	
	onUpdate: function() {
		var count = 0;
		var delta = {
			x:0,
			y:0
		};
		if (this._touch) {
			delta.x += this._touch.dx;
			delta.y += this._touch.dy;
			this._touch.dx = this._touch.dy = 0;
			++count;			
		}
		if (count > 1) {
			delta.x /= count;
			delta.y /= count;
		}
		// Tell our scroll area to update.
		this.listview._onUpdate(delta);
	},
	hasTouch: function() {
		return (this._touch !== null);
	}
});
