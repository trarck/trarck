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

exports.Scene = Class.subclass(
/** @lends Scene */
{
	classname: 'Scene',
	onEnter: function(prevScene) {},
	onEnterViaPush: function(prevScene) {},
	onEnterViaPop: function(prevScene) {},
	onExit: function(nextScene) {},
	onExitViaPush: function(nextScene) {},
	onExitViaPop: function(nextScene) {}
});


exports.SceneDirector = Class.singleton(
/** @lends SceneDirector */
{
	classname: 'SceneDirector',
	/**
	 * @class
	 */
	initialize: function() {
		this.sceneStack = [];
	},
	runScene: function(aScene, option) {
		if (this.sceneStack.length != 0) {
			return;
		}
		aScene.onEnter(null, option);
		this.sceneStack.push(aScene);
		NgLogD("scened: " + this.sceneStack.length);
	},
	replaceScene: function(aScene, option) {
		if (this.sceneStack.length == 0) {
			this.runScene(aScene, option);
			return;
		}
		var currentScene = this.sceneStack.pop();
		this.sceneStack.push(aScene);

		currentScene.onExit(aScene, option);
		aScene.onEnter(currentScene, option);
		NgLogD("scened: " + this.sceneStack.length);
	},
	pushScene: function(aScene, option) {
		if (this.sceneStack.length == 0) {
			return;
		}
		var currentScene = this.getTopScene();
		this.sceneStack.push(aScene);

		currentScene.onExitViaPush(aScene, option);
		aScene.onEnterViaPush(currentScene, option);
		NgLogD("scened: " + this.sceneStack.length);
	},
	popScene: function(option) {
		if (this.sceneStack.length < 2) {
			return;
		}
		var currentScene = this.sceneStack.pop();
		var nextScene    = this.getTopScene();
		currentScene.onExitViaPop(nextScene, option);
		nextScene.onEnterViaPop(currentScene, option);
		NgLogD("scened: " + this.sceneStack.length);
	},
	/**
	 * ポップアップされたシーンを閉じる
	 * 
	 * ※DnSceneDirectorと、Dn.SceneDirector が混在された環境では
	 *   スタックの数が異なるためDn.SceneDirector.popScene()でポップアップを閉じれない場合があるため追加
	 * ※Dn.SceneDirectorで統一されている環境では、本関数は利用しないで良いでしょう
	 */
	closeScene: function(option) {
		var currentScene = this.sceneStack.pop();
		currentScene.onExit();
		NgLogD("scened: " + this.sceneStack.length);
	},
	popSceneToRoot: function(option) {
		if (this.sceneStack.length < 2) {
			return;
		}
		while(this.sceneStack.length > 1) {
			var currentScene = this.sceneStack.pop();
			var nextScene    = this.getTopScene();
			currentScene.onExitViaPop(nextScene, option);
			nextScene.onEnterViaPop(currentScene, option);
		}
		NgLogD("scened: " + this.sceneStack.length);
	},
	getTopScene: function(option) {
		return this.sceneStack[this.sceneStack.length - 1];
	}
});

