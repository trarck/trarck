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
var MessageListener = require('../../../NGCore/Client/Core/MessageListener').MessageListener;
var Size = require('../../../NGCore/Client/Core/Size').Size;
var GL2Root = require('../../../NGCore/Client/GL2/Root').Root;
var Node = require('../../../NGCore/Client/GL2/Node').Node;
var Text = require('../../../NGCore/Client/GL2/Text').Text;
var Sprite = require('../../../NGCore/Client/GL2/Sprite').Sprite;
var TouchTarget = require('../../../NGCore/Client/GL2/TouchTarget').TouchTarget;
var Scene = require('../Scene/SceneDirector').Scene;
var Timekeeper = require('../Core/Timekeeper').Timekeeper;
var VFX = require('./VFX').VFX;
var Fade = require('./Fade').Fade;
var ImageFontFactory = require('./ImageFontFactory').ImageFontFactory;
var GLUIUtil = require('../GLUI/GLUIUtil').GLUIUtil;
var utils = require('../utils').utils;


var _KeyFrame = Class.subclass(
/** @lends _KeyFrame.prototype */
{	
	classname: "KeyFrame",
	/**
	 * @class This <code>_KeyFrame</code> class has methods for definition of CutScene animation.
	 * This object is created by <code><a href="Dn.CutScene.html#KeyFrame">KeyFrame()</a></code> method.
	 * You shouldn't create object directly.
	 * @constructs
	 * @arguments Core.Class
	 * @param cutScene
	 * @param opts
	 */
	initialize: function(cutScene, opts) {
		this._cutScene = cutScene;
		this._startTime = 0;
		this._nodes = [];
		this._fades = [];
		this._opts = opts;
	},
	
	/**
	 * Return parent node which is base node of the CutScene.
	 * @returns {GL2.Node}
	 */
	getParent: function() {
		return this._cutScene._parentNode;
	},
	/**
	 * Return CutScene's screen width.
	 * @returns {Number}
	 */
	getScreenWidth: function() {
		return this._cutScene._size.getWidth();
	},
	
	/**
	 * Return CutScene's screen height.
	 * @returns {Number}
	 */
	getScreenHeight: function() {
		return this._cutScene._size.getHeight();
	},
	
	/**
	 * Register target node. 
	 * 
	 * This node is shown within time line and destroyed the scene end. 
	 * This node has special vfx() method to use VFX in CutScene.
	 * @param node{GL2.Node}
	 */
	register: function(node) {
		this._nodes.push(node);
		var originalVisible = node.getVisible();
		node.setVisible(false);
		var self = this;
		node.vfx = function() {
			var task = VFX.enchant(node).register();
			if (self._startTime !== 0) {
				task = task.wait(self._startTime);
			}
			if (originalVisible) {
				task = task.on();
			}
			return task;
		};
	},
	
	/**
	 * Set sleep time in the CutScene.
	 * @param seconds{Number}
	 */
	wait: function(seconds) {
		this._startTime += seconds;
	},
	
	/**
	 * Append image which is zoomed automatically. 
	 * 
	 * @param zoomDuration {Number} sencods
	 * @param imagePath {String}
	 * @param imageSize {[Number, Number]}
	 * @param startScale {Number} default=1.2
	 * @returns {GL2.Sprite}
	 */
	zoomImage: function(zoomDuration, imagePath, imageSize, startScale) {
		startScale = startScale || 1.2;
		var image = new Sprite();
		image.setImage(imagePath, imageSize, [0.5, 0.5], [0, 0, 1, 1]);
		image.setPosition( this.getScreenWidth()/2, this.getScreenHeight()/2 );
		image.setScale( startScale, startScale );
		this.getParent().addChild(image);
		this.register(image);
		image.vfx().scaleTo(zoomDuration, 1, 1, -1);
		return image;
	},
	
	/**
	 * Set image with slide animation.
	 * 
	 * @param slideDuration {Number} 
	 * @param imagePath {String}
	 * @param imageSize {Array}
	 * @param offset {Number} Image offset position(px)
	 * @param direction {Number} CutScene.Direction
	 * @param imageScale {Number}
	 */
	slideImage: function(slideDuration, imagePath, imageSize, offset, direction, imageScale) {
		var DirDef = exports.CutScene.Direction;
		imageScale = imageScale || 1.4;
		
		var margin, x, y;
		var directionSign;

		switch (direction) {
		case DirDef.Upward:
		case DirDef.Downward:
			directionSign = (direction===DirDef.Top) ? -1 : 1;
			margin = this.getScreenHeight() * (imageScale - 1) / 2 * directionSign;
			x = this.getScreenWidth()/2 - offset;
			y = this.getScreenHeight()/2 - margin;
			break;
		case DirDef.Leftward:
		case DirDef.Rightward:
			directionSign = (direction===DirDef.Left) ? -1 : 1;
			margin = this.getScreenWidth() * (imageScale - 1) / 2 * directionSign;
			x = this.getScreenWidth()/2 - margin;
			y = this.getScreenHeight()/2 - offset;
			break;
		}
		var image = new Sprite();
		image.setImage(imagePath, imageSize, [0.5, 0.5], [0, 0, 1, 1]);
		image.setPosition( x, y );
		image.setScale( imageScale, imageScale );
		this.getParent().addChild(image);
		this.register(image);
		switch (direction) {
		case DirDef.Upward:
		case DirDef.Downward:
			image.vfx().move(slideDuration, 0, margin);
			break;
		case DirDef.Leftward:
		case DirDef.Rightward:
			image.vfx().move(slideDuration, margin, 0);
			break;
		}
	},
	
	/**
	 * Append GL2.Text. 
	 * 
	 * opts: <tt>duration</tt> show text in this time span.
	 * opts: <tt>slide</tt> slide text. [duraton, dw, dh].
	 *   
	 * @param content{String}
	 * @param fontSize{Number}
	 * @param frame{[Number, Number, Number, Number]} [x, y, h, w]
	 * @param opts{Object} text option.
	 * @returns {GL2.Node}
	 */
	text: function(content, fontSize, frame, opts) {
		opts = opts || {};
		var node = new Node();
		this.register(node);
		this.getParent().addChild(node);
		node.setPosition( frame[0], frame[1] );
		for (var i=1;  i>-1;  i--) {
            var text = new Text();
            text.setText    ( content );
            text.setColor   ( 1-i, 1-i, 1-i );
            text.setFontSize( 25 );
            text.setScale( fontSize/25, fontSize/25 );
            text.setAnchor  ( 0, 0 );
            text.setSize    ( frame[2], frame[3] );
            text.setOverflowMode   ( Text.OverflowMode.Multiline );
            text.setVerticalAlign  ( Text.VerticalAlign.Top    );
            text.setHorizontalAlign( Text.HorizontalAlign.Left );
            text.setPosition([i, i]);
            node.addChild(text);
		}
		var hasOpt = false;
		if (opts.duration) {
			node.setAlpha(0.0);
			node.vfx().wait( 0.5 ).fi( 1.0 ).wait( opts.duration - 3.0 ).fo( 1.0 );
			hasOpt = true;
		}
		if (opts.slide) {
			node.vfx().move( opts.slide[0], opts.slide[1], opts.slide[2], 0 );
			hasOpt = true;
		}
		if (!hasOpt) {
			node.vfx().fi(0.2, 1.0);
		}
		return node;
	},
	
	/**
	 * Append rectangle.
	 * 
	 * @param frame{[Number, Number, Number, Number]} [x, y, w, h]
	 * @param color{[Number, Number, Number]} [r, g, b]
	 * @param alpha{Number} default=1.0
	 * @returns {GL2.Node}
	 */
	rectangle: function(frame, color, alpha) {
		color = color || [0,0,0];
		alpha = alpha || 1.0;
		var rectangle = GLUIUtil.makePrimitive( frame[0], frame[1], frame[2], frame[3], color );
		rectangle.setAlpha(alpha);
		this.register(rectangle);
		this.getParent().addChild(rectangle);
		return rectangle;
	},
	
	/**
	 * Append text created by ImageFontFactory.
	 * 
	 * Available opts:
	 * <ul>
	 *    <li><tt>spacing</tt></li>
	 *    <li><tt>gradTop</tt></li>
	 *    <li><tt>gradBottom</tt></li>
	 *    <li><tt>anchor</tt></li>
	 * </ul>
	 * 
	 * @param key{String} 
	 * @param text{String}
	 * @param fontHeight{Number}
	 * @param position{[Number, Number]}
	 * @param opts{Object}
	 * @returns {GL2.Node}
	 */
	imageFont: function(key, text, fontHeight, position, opts) {
		var spacing = opts.spacing || 0;
		var gradTop = opts.gradTop || [1, 1, 1];
		var gradBottom = opts.gradBottom || [1, 1, 1];
		var anchor = opts.anchor || [0.5, 0.5];
		var imageFontObj = ImageFontFactory.create(key, text, fontHeight, spacing, gradTop, gradBottom);
		imageFontObj.setAnchor( anchor[0], anchor[1] );
		imageFontObj.setPosition( position[0], position[1] );
		this.getParent().addChild(imageFontObj);
		this.register(imageFontObj);
		return imageFontObj;
	},
	
	/**
	 * Append background.
	 * 
	 * @param color{[Number, Number, Number]} [r, g, b]
	 * @returns {GL2.Node}
	 */
	background: function(color) {
		color = color || [0,0,0];
		var background = GLUIUtil.makePrimitive( 0, 0, this.getScreenWidth(), this.getScreenHeight(), color );
		this.register(background);
		this.getParent().addChild(background);
		return background;
	},
	
	/**
	 * Append vertical slit which filter back images.
	 * 
	 * @param left{Number} 
	 * @param slitWidth{Number}
	 * @param color{[Number, Number, Number]} [r, g, b]
	 */
	verticalSlit: function(left, slitWidth, color) {
		color = color || [0,0,0];
		var width  = this.getScreenWidth();
		var height = this.getScreenHeight();

		var leftSlit = GLUIUtil.makePrimitive( 0, 0, left, height, color );
		this.register(leftSlit);
		leftSlit.vfx().fi(0.1);
		this.getParent().addChild(leftSlit);
		
		var rightSlit = GLUIUtil.makePrimitive( left + slitWidth, 0, width, height, color );
		this.register(rightSlit);
		rightSlit.vfx().fi(0.1);
		this.getParent().addChild(rightSlit);
	},
	
	/**
	 * Append horizontal slit which filter back images.
	 * 
	 * @param top{Number}
	 * @param slitHeight{NUmber}
	 * @param color{[Number, Number, Number]} [r, g, b]
	 */
	horizontalSlit: function(top, slitHeight, color) {
		color = color || [0,0,0];
		var width  = this.getScreenWidth();
		var height = this.getScreenHeight();

		var topSlit = GLUIUtil.makePrimitive( 0, 0, width, top, color );
		this.register(topSlit);
		topSlit.vfx().fi(0.1);
		this.getParent().addChild(topSlit);
		
		var bottomSlit = GLUIUtil.makePrimitive( 0, top + slitHeight, width, height - top - slitHeight, color );
		this.register(bottomSlit);
		bottomSlit.vfx().fi(0.1);
		this.getParent().addChild(bottomSlit);
	},
	
	/**
	 * Append fade in effect
	 * 
	 * @param duration{Number}
	 * @param color{[Number, Number, Number]} [r, g, b]
	 */
	fadeIn: function(duration, color) {
		var fade = Fade.getFadeIn( color, duration, this._startTime);
		this.getParent().addChild(fade.getNode());
		this._nodes.push(fade);
		this._fades.push(fade);
	},

	/**
	 * Append fade out effect
	 * 
	 * @param duration{Number}
	 * @param color{[Number, Number, Number]} [r, g, b]
	 */
	fadeOut: function(duration, color) {
		var fade = Fade.getFadeOut( color, duration, this._startTime);
		this.getParent().addChild(fade.getNode());
		this._nodes.push(fade);		
		this._fades.push(fade);
	},
	
	/**
	 * Append flash effect
	 * 
	 * @param duration{Number}
	 * @param color{[Number, Number, Number]} [r, g, b]
	 */
	flash: function(duration, color) {
		var fade = Fade.getFlash( color, duration, undefined, undefined, undefined, this._startTime);
		this.getParent().addChild(fade.getNode());
		this._nodes.push(fade);
		this._fades.push(fade);
	},
	_play: function() {
		if (this._opts.ignoreTap !== true) {
			this._skipListner = new _SkipListener(this);
		}
		for ( var i = 0; i < this._nodes.length; i++) {
			VFX.resume(this._nodes[i]);
		}
		Timekeeper.setTimeout(utils.bind(this, this._keyFrameFinish), this._startTime);
	},
	_keyFrameFinish: function() {
		if (this._skipListner) {
			this._skipListner.setDisable();
			this._skipListner.destroy();
		}
		this.destroy();
		if (this._opts.next) {
			this._cutScene._play(this._opts.next);
		} else {
			this._cutScene.onFinish();
		}
	},
	destroy: function() {
		VFX.removeAllTasks();
		for ( var j = 0; j < this._fades.length; j++) {
			this._fades[j].doneCallBack = true;
		}
		for ( var i = 0; i < this._nodes.length; i++) {
			utils.destroyIfAlive(this._nodes[i]);
		}
		Timekeeper.clearAllTimeout();
	}
});


var _SkipListener = MessageListener.subclass({
	classname: "SkipListener",
	initialize: function(keyframe) {
		this.target = new TouchTarget();
		this.target.setAnchor( [0, 0] );
		this.target.setSize(keyframe._cutScene._size);
		this.target.getTouchEmitter().addListener( this, this.onTouch );
		this.target.setDepth( 65535 );
		GL2Root.addChild( this.target );
		this.keyframe = keyframe;
		this.disable = false;
	},
	setDisable: function() {
		this.disable = true;
	},
	onTouch: function(touch) {
		if (this.disable) {
			return false;
		}
		switch (touch.getAction()) {
		case touch.Action.Start:
			break;
		case touch.Action.End:
			this.keyframe._keyFrameFinish();
		}
		return true;
	},
	destroy: function($super) {
		utils.destroyIfAlive(this.target);
		$super();
	}
});



exports.CutScene = Scene.subclass(
/** @lends Dn.CutScene.prototype */
{
	classname: "CutScene",

	/**
	 * @class This <code>CutScene</code> class is base class to create Cut Scene - demo, opening, so on.
	 * You can create Cut Scene with JS as a DSL. You can use this object both stand alone and with
	 * SceneDirector. 
	 * @constructs The default constructor.
	 * @argucments Dn.Scene
	 */
	initialize: function() {
		this._frames = [];
		this._blinds = [];
		this._shouldRemove = [];
		this._parentNode = new Node();
		this._parentNode.setPosition([0, 0]);
		this._shouldRemove.push(this._parentNode);
		this._screenMode = exports.CutScene.ScreenMode.Both;
		this.fitToScreen(480, 320);
		GL2Root.addChild(this._parentNode);
	},
	
	/** 
	 * Enumeration for screen mode of CutScene
	 * @namespace
	 */
	ScreenMode: {
		Stretch: 0,
		Bottom: 1,
		Both: 2,
		NoLetterBox: 4
	},

	/** 
	 * Enumeration for direction of CutScene.slideimage
	 * @namespace
	 */
	Direction: {
		Upward: 0,
		Leftward: 1,
		Downward: 2,
		Rightward: 3
	},
	/**
	 * This method create new key frame which is a part of CutScene.
	 * In the with structure, use <a href="Dn._KeyFrame"><code>KeyFrame's</code></a> method
	 * to define it.
	 * 
	 * @exmaple firstCut: function() {
     *     with(this.KeyFrame({next:this.secondCut})) {
     *         // content of scene
     *     }
     * },
	 * @param opts{Object} parameter for the Scene
	 * @returns {_KeyFrame}
	 */
	KeyFrame: function(opts) {
		opts = opts || {};
		var frame = new _KeyFrame(this, opts);
		this._frames.push(frame);
		return frame;
	},
	/**
	 * Set screen mode. It effect the usage of screen. 
	 * @param mode{CutScene.ScreenMode}
	 */
	setScreenMode: function(mode) {
		this._screenMode = mode;
	},
	/**
	 * Set depth of base node of Scene.
	 * @param depth{Number}
	 */
	setBaseDepth: function(depth) {
		this._parentNode.setDepth(depth);
	},
	/**
	 * Set Cut Scene's screen size. Default value is (480, 320).
	 * @param width{Number}
	 * @param height{Number}
	 */
	fitToScreen: function( width, height ) {
		for ( var i = 0; i < this._blinds.length; i++) {
			utils.destroyIfAlive(this._blinds[i]);
		}
		this._size = new Size(width, height);
		var originalWidth  = Capabilities.getScreenHeight();
		var originalHeight = Capabilities.getScreenWidth();
				
		var widthScale =  originalWidth / width;
		var heightScale = originalHeight / height;

		var mode = exports.CutScene.ScreenMode;
		var self = this;
		var createLetterBox = function(x, y, w, h) {
			var letterBox = GLUIUtil.makePrimitive( x, y, w, h, [0, 0, 0] );
			letterBox.setDepth(99999999);
			GL2Root.addChild(letterBox);
			self._blinds.push(letterBox);
		};
		
		if (this._screenMode === mode.Stretch) {
			this._parentNode.setScale(widthScale, heightScale);
		} else {
			var scale = Math.min(widthScale, heightScale);
			this._parentNode.setScale( scale, scale );
			var remainWidth = originalWidth - width * scale;
			var remainHeight = originalHeight - height * scale;
			if (this._screenMode & mode.Bottom) {
				this._parentNode.setPosition([0, 0]);
				if (this._screenMode & mode.NoLetterBox) {
					return;
				}
				if (remainWidth > 0) {
					createLetterBox( originalWidth - remainWidth, 0, remainWidth, originalHeight, [0, 0, 0] );
				} else if (remainHeight > 0) {
					createLetterBox( 0, originalHeight - remainHeight, originalWidth, remainHeight, [0, 0, 0] );
				}
			} else {
				this._parentNode.setPosition([remainWidth/2, remainHeight/2]);
				if (this._screenMode & mode.NoLetterBox) {
					return;
				}
				if (remainWidth > 0) {
					createLetterBox( 0, 0, remainWidth/2, originalHeight, [0, 0, 0] );
					createLetterBox( originalWidth - remainWidth/2, 0, remainWidth/2, originalHeight, [0, 0, 0] );
				} else if (remainHeight > 0) {
					createLetterBox( 0, 0, originalWidth, remainHeight/2, [0, 0, 0] );
					createLetterBox( 0, height - remainHeight/2, originalWidth, remainHeight/2, [0, 0, 0] );
				}				
			}
		}
	},
	/**
	 * You should override this method.
	 */
	firstCut: function() {
		throw "Should override";
	},
	onEnter: function() {
		this._play(this.firstCut);
	},
	/**
	 * This method start playing Cut Scene. If you use this object within SceneDirector, 
	 * you don't have to use this method.
	 */
	play: function() {
		this.onEnter();
	},
	onFinish: function() {
		// should override
	},
	onExit: function($super) {
		for ( var i = 0; i < this._frames.length; i++) {
			this._frames[i].destroy();
		}
		for ( var j = 0; j < this._blinds.length; j++) {
			this._blinds[j].destroy();
		}
		$super();
	},
	_play: function(cutMethod) {
		var originalPosition = this._frames.length;
		cutMethod.call(this);
		for ( var i = originalPosition; i < this._frames.length; i++) {
			var frame = this._frames[i];
			frame._play();
		}
	}
});
