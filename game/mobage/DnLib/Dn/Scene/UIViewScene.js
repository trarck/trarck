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

var UIBuilder = require('../UI/UIBuilder').UIBuilder;
var Scene = require('./SceneDirector').Scene;
var utils = require('../utils').utils;

exports.UIViewScene = Scene.subclass(
/** @lends UIViewScene.prototype */
{
	classname: 'UIViewScene',
	/**
	 * @class
	 */
	initialize: function(aJSONDef) {
		this.JSONDef = aJSONDef;
		this.views = null;
		this.__elements = [];
	},
	viewDidLoad: function () {},
	viewWillAppear: function () {},
	viewDidAppear: function () {},
	viewWillDisappear: function () {},
	onDestroy: function () {},
	loadView: function () {
		if (this.JSONDef) {
			this.views = UIBuilder.buildWithJSONDef(this, this.JSONDef[this.name]);
		}
	},
	appear: function () {
		if (!this.views) {
			return;
		}

		utils.each(this.views, function (v) {
			UI.Window.document.addChild(v);
		});
	},
	disappear: function () {
		if (!this.views) {
			return;
		}

		utils.each(this.views, function (v) {
			UI.Window.document.removeChild(v);
		});
	},
	_appear: function () {
		this.viewWillAppear();
		this.appear();
		this.viewDidAppear();
	},
	_disappear: function () {
		this.viewWillDisappear();
		this.disappear();
	},
	onEnter: function(prevScene, via) {
		if (this.views) {
			this._appear();
		} else {
			this.loadView();
			this.viewDidLoad();
			this._appear();
		}
	},
	onEnterViaPush: function(prevScene) {
		this.onEnter();
	},
	onEnterViaPop: function(prevScene) {},
	onExit: function() {
		this._disappear();
		this.onDestroy();
		utils.each(this.__elements, function(e) {
			e.destroy();
		});
	},
	onExitViaPush: function() {},
	onExitViaPop: function() {
		this.onExit();
	}
});
