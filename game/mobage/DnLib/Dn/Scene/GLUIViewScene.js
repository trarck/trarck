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

var GL2Root = require('../../../NGCore/Client/GL2/Root').Root;
var Node = require('../../../NGCore/Client/GL2/Node').Node;
var Class = require('../../../NGCore/Shared/Class').Class;

var Scene = require('./SceneDirector').Scene;
var VFX = require('../GL2/VFX').VFX;
var GLUIBuilder = require('../GLUI/GLUIBuilder').GLUIBuilder;
var utils = require('../utils').utils;

//////////////////////////////////////////////////////////////////////////////////////////////////
exports.GLUIViewScene = Scene.subclass({
	classname: 'GLUIViewScene',
	initialize: function (aJSONDef, parentNode) {
		this.JSONDef = aJSONDef;
		this.view = null;

		this.parentNode = parentNode || GL2Root;
		this._content = null;
		this._nodes = null;
	},
	//////////////////////////////////////////////////////////////////
	// callback
	viewDidLoad      : function () {},
	viewWillAppear   : function () {},
	viewDidAppear    : function () {},
	viewWillDisappear: function () {},

	onActivate : function(prevScene) {
		this.view.setTouchable(true);
	},

	onDeactivate : function() {
		this.view.setTouchable(false);
	},

	willAppear    : function() {},
	willDisappear : function() {},

	onDestroy : function() {},

	//////////////////////////////////////////////////////////////////
	// impl
	loadView : function (cb) {
		this.view = new Node();

		if (this.JSONDef) {
			var result = GLUIBuilder.buildWithJSONDef(this, this.JSONDef[this.name]);
			this._content = result[0];
			this._nodes   = result[1];
			this.view.addChild( this._content );
		} else {
			NgLogE("required view def");
		}

		return this.view;
	},
	pushNodes : function(node) {
		//controller内でつくったnodeを_nodesにいれる。
		this._nodes.push(node);
	},

	appear : function() {
		this.parentNode.addChild(this.view);
		this.view.setTouchable(true);
	},

	disappear : function() {
		this.parentNode.removeChild(this.view);
	},

	_disappear : function () {
		this.viewWillDisappear();
		this.disappear();
	},

	_appear :function(prevScene) {
		this.willAppear();
		this.viewWillAppear();
		this.appear();
		this.viewDidAppear();
		this.onActivate();
	},

	//////////////////////////////////////////////////////////////////
	// interface DnScene
	onEnter : function(prevScene, option) {
		if (this.view) {
			this._appear();
		} else {
			this.loadView();
			this.viewDidLoad();
			this._appear();
		}
	},

	onEnterViaPush : function(prevScene, option) {
		this.onEnter(prevScene, option);
	},

	onEnterViaPop : function(prevScene, option) {
		if (this.hideFunc) {
			this.hideFunc(true);
			delete this.hideFunc;
		}
		if (this.isHide) {
			this.isHide = false;
			this._appear();
		} else {
			this.onActivate();
		}
	},

	onExit : function(nextScene, option) {
		this.disappear();
		this.onDestroy();
		if(this._nodes) {
			utils.each(this._nodes, function(i) {
//				NgLogD("destroy -> " + i);
				i.destroy();
			});
		}
		if(this._content) {
			this._content.destroy();
		}
		VFX.removeAllTasks();
		this.view.destroy();
	},

	onExitViaPush : function(nextScene, option) {
		this.onDeactivate();

		if (!option) {return;}

		if (option.hideFunc) {
			this.hideFunc = option.hideFunc;
			this.hideFunc(false);
		}
		if (option.hide) {
			this.isHide = true;
			this._disappear();
		}
	},

	onExitViaPop : function(nextScene, option) {
		this.onExit(nextScene, option);
	},

	//////////////////////////////////////////////////////////////////
	// easing
	easeOne : function (from, to, asExit, type) {
		var transitionType = type || 'easeInOutCubic'
		this.view.setPosition(from.x, from.y);
		var self = this;
		this.view.mX = from.x;
		this.view.mY = from.y;
		JSTweener.addTween(this.view, {
			time: 0.5,
			transition: transitionType,
			onComplete: function() {
				if (asExit) {
					self._disappear();
				} else {
					self.viewDidAppear();
				}
			},
			onUpdate: function() {
				var g = self.view;
				self.view.setPosition(g.mX, g.mY);
			},
			mX: to.x,
			mY: to.y
		});
	},

	boom : function () {
		//dn.VFX.enchant(this.view).hop( 5.0, 0.5);
		//this.view.setPosition(240, 160);
		//this.view.setScale(0.01, 0.01);
		//this.view.mXScale = 0.0;
		//this.view.mYScale = 0.0;
		//var self = this;
		//JSTweener.addTween(this.view, {
			//time: 0.5,
			//transition: 'easeOutBounce',
			//onComplete: function() {},
			//onUpdate: function() {
				//var g = self.view;
				//self.view.setScale(g.mXScale, g.mYScale);
			//},
			//mXScale: 1.0,
			//mYScale: 1.0
		//});
	},

	shun : function() {
		//dn.VFX.enchant(this.view).scaleTo(0.3, 0.01, 0.01, -1);
		//this.view.setScale(1.0, 1.0);
		//this.view.mXScale = 1.0;
		//this.view.mYScale = 1.0;
		//var self = this;
		//JSTweener.addTween(this.view, {
			//time: 0.3,
			//transition: 'easeOutCubic',
			//onComplete: function() {
				//self.disappear();
			//},
			//onUpdate: function() {
				//var g = self.view;
				//self.view.setScale(g.mXScale, g.mYScale);
			//},
			//mXScale: 0.0,
			//mYScale: 0.0
		//});
	}
});
