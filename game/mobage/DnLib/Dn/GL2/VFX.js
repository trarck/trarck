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

var MessageListener = require('../../../NGCore/Client/Core/MessageListener').MessageListener;
var UpdateEmitter = require('../../../NGCore/Client/Core/UpdateEmitter').UpdateEmitter;
var Class = require('../../../NGCore/Client/Core/Class').Class;
var Timekeeper = require('../Core/Timekeeper').Timekeeper;
var utils = require('../utils').utils;

/**
 * @fileoverview VFX class which make creating VFX easily
 * @author Tatsuya Koyama
 * @version 0.1
 */

exports.VFXTaskNode = Class.subclass(
/** @lends Dn.VFXTaskNode.prototype */
{
	classname: 'VFXTaskNode',
	/**
	 * @class <code>VFXTaskNode</code> class is a effect task class. 
	 * Use it in fluent interface(http://martinfowler.com/bliki/FluentInterface.html), like jQuery.
	 *
	 * @example
	 * VFX.enchant(node)
	 *    .move(3.0, 100, 100)
	 *    .hop(5, 5)
	 *    .end();
	 *
	 * @arguments Core.Class
	 * @constructs Init effect task class.
	 * @param {GL2.Node} node Target node object.
	 * @param {Function} call back when called on finish.
	 */
	initialize: function( node ) {
		
		this.node     = node;
		this.func     = null;
		this.args     = [];
		this.progress = 0;
		this.delta    = 0;
		this.next     = null;
		this.param    = {};
		
		this.isInitialized = false;
		this.isActive      = false;
		this.isFinished    = false;
		this.isDestroyed   = false;
	},

	/**
	 * Apply any functions as the task. The function should call <code>this.finish()</code>.
	 *
	 * @example
	 * var msg = function(message) {
	 *     text.setText(message);
	 *     this.finish();
	 * };
	 *
	 * VFX.enchant(node)
	 *     .wait(10)
	 *     .and(msg, ["wait finished"])
	 *     .end();
	 * 
	 * @param {Function} func Function object which is called after previous task was finished.
	 * @param {Array} args arguments they are passed to the function.
	 * @returns {Dn.VFXTaskNode} next job.
	 */
	and: function( func, args ) {
		
		this.isActive = true;
		this.func     = func;
		this.args     = args;
		
		var nextTask = new exports.VFXTaskNode( this.node );
		this.next = nextTask;
		return nextTask;
	},

	/**
	 * Insert new task into the task chain.
	 *
	 * @example
	 * var msg = function(message) {
	 *     text.setText(message);
	 *     if (Math.random() > 0.5) {
	 *          this.insert('hop', [10, 1]);
	 *     }
	 *     this.finish();
	 * };
	 *
	 * VFX.enchant(node)
	 *     .and(msg, ["sometimes hopping finished"])
	 *     .end();
	 * 
	 * @param {Function} func Function object which is called after previous task was finished.
	 * @param {Array} args arguments they are passed to the function.
	 * @returns {Dn.VFXTaskNode} next job.
	 */
	insert: function( func, args ) {
		
		var insertTask = new exports.VFXTaskNode( this.node );
		
		insertTask.isActive = true;
		insertTask.func     = func;
		insertTask.args     = args;

		insertTask.next = this.next;
		this.next       = insertTask;

		return insertTask;
	},
	
	/**
	 * Stop VFX during passed term.
	 * @param {Number} sec seconds
	 * @returns {Dn.VFXTaskNode} next job.
	 */
	wait: function( sec ) {
		return this.and( 'wait', [sec] );
	},
	
	/**
	 * Finish VFX tasks and destroy target node.
	 */
	end: function() {
		return this.and( 'end' );
	},
	
	/**
	 * Fade in task.
	 * @param {Number} duration the time it takes fade in[Seconds].
	 * @param {Number} alpha default=1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#fo
	 */
	fi: function( duration, alpha ) {
		return this.and( 'fadeIn', [duration, alpha] );
	},
	
	/**
	 * Fade out task.
	 * @param {Number} duration the time it takes fade out[Seconds].
	 * @param {Number} alpha default=1.
	 * @returns {Dn.VFXTaskNode} next job.
 	 * @see Dn.VFXTaskNode#fi
	 */
	fo: function( duration, alpha ) {
		return this.and( 'fadeOut', [duration, alpha] );
	},
	
	/**
	 * Alpha task. 
	 * @param {Number} duration the time it takes moving[Seconds].
	 * @param {Number} alpha 
	 * @param {Number} easing easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#moveTo
	 */
	alpha: function( duration, alpha, easing ) {
		return this.and( 'alpha', [duration, alpha, easing] );
	},

	/**
	 * Alpha task.
	 * @param {Number} duration the time it takes moving[Seconds].
	 * @param {Number} alpha 
	 * @param {Number} easing easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#move
	 */
	alphaTo: function( duration, alpha, easing ) {
		return this.and( 'alphaTo', [duration, alpha, easing] );
	},
	
	/**
	 * Move task. Move to the position which is far from current position.
	 * @param {Number} duration the time it takes moving[Seconds].
	 * @param {Number} dx delta x
	 * @param {Number} dy delta y
	 * @param {Number} easing easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#moveTo
	 */
	move: function( duration, dx, dy, easing ) {
		return this.and( 'move', [duration, dx, dy, easing] );
	},

	/**
	 * Move task. Move to the position which is far from current position.
	 * @param {Number} duration the time it takes moving[Seconds].
	 * @param {Number} tx x of goal position
	 * @param {Number} ty y of goal position
	 * @param {Number} easing easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#move
	 */
	moveTo: function( duration, tx, ty, easing ) {
		return this.and( 'moveTo', [duration, tx, ty, easing] );
	},
	
	/**
	 * Scale task. Scale with passed scale late.
	 * @param {Number} duration the time it takes scaling[Seconds].
	 * @param {Number} dScaleX delta scale of X
	 * @param {Number} dScaleY delta scale of Y
	 * @param {Number} easeIn easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#scaleTo
	 */
	scale: function( duration, dScaleX, dScaleY, easeIn ) {
		return this.and( 'scale', [duration, dScaleX, dScaleY, easeIn] );
	},

	/**
	 * Scale task. Scale up to the passed scale.
	 * @param {Number} duration the time it takes scaling[Seconds].
	 * @param {Number} tScaleX goal scale of X
	 * @param {Number} tScaleY goal scale of Y
	 * @param {Number} easeIn easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#scale
	 */
	scaleTo: function( duration, tScaleX, tScaleY, easeIn ) {
		return this.and( 'scaleTo', [duration, tScaleX, tScaleY, easeIn] );
	},

	/**
	 * Rotate task. Rotate with passed angle.
	 * @param {Number} duration the time it takes rotating[Seconds].
	 * @param {Number} dRot delta angle(degree)
	 * @param {Number} easeIn easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#rotateTo
	 */
	rotate: function( duration, dRot, easeIn ) {
		return this.and( 'rotate', [duration, dRot, easeIn] );
	},

	/**
	 * Rotate task. Rotate until passed angle.
	 * @param {Number} duration the time it takes rotating[Seconds].
	 * @param {Number} dRot delta angle(degree)
	 * @param {Number} easeIn easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#rotate
	 */
	rotateTo: function( duration, tRot, easeIn ) {
		return this.and( 'rotateTo', [duration, tRot, easeIn] );
	},
	
	/**
	 * Color task. Change color filter.
	 * @param {Number} duration the time it takes changing color[Seconds].
	 * @param {Number} dr delta color(red)
	 * @param {Number} dg delta color(green)
	 * @param {Number} db delta color(blue)
	 * @param {Number} easeIn easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#rotate
	 */
	color: function( duration, dr, dg, db, easeIn ) {
		return this.and( 'color', [duration, dr, dg, db, easeIn] );
	},

	/**
	 * Color task. Change color filter.
	 * @param {Number} duration the time it takes changing color[Seconds].
	 * @param {Number} tr destination color(red)
	 * @param {Number} tg destination color(green)
	 * @param {Number} tb destination color(blue)
	 * @param {Number} easeIn easing parameter. -1 .. +1.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#rotate
	 */
	colorTo: function( duration, tr, tg, tb, easeIn ) {
		return this.and( 'colorTo', [duration, tr, tg, tb, easeIn] );
	},

	/**
	 * Hopping task. Node jumps. Both parameters should be positive number.
	 * @param {Number} velocity first speed.
	 * @param {Number} gravity damping rate.
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#rotate
	 */
	hop: function ( velocity, gravity ) {
		return this.and( 'hop', [velocity, gravity] );
	},

	/**
	 * Visiblity task. Node appears quickly. 
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#rotate
	 */
	on: function() {
		return this.and( 'appear' );
	},

	/**
	 * Visiblity task. Node disappears quickly. 
	 * @returns {Dn.VFXTaskNode} next job.
	 * @see Dn.VFXTaskNode#rotate
	 */
	off: function() {
		return this.and( 'disappear' );
	},
	
	/**
	 * Blink target object.
	 * 
	 * @returns {Dn.VFXTaskNode} next job.
	 */
	blink: function( duration, term, alphas) {
		term = term || 0.5;
		alphas = alphas || [0.8, 0.3];
		return this.and( 'blink', [duration, term, alphas] );
	},
	/**
	 * Register task, but not fire now. To restart this task, run Dn.VFX.resume(node).
	 * 
	 * @returns {Dn.VFXTaskNode} next job.
	 */
	register: function() {
		var next = this.and( 'register', [] );
		this.isActive = false;
		return next;
	},
	
	finish: function( duration ) {
		if (! duration) { duration = 0; }
		if (this.progress > duration) { this.isFinished = true; }
		return this.isFinished;
	},
	
	easing: function( duration, value, easeIn ) {
		
		var e = easeIn;
		if (! e) { e = 0; }
		e /= -3.14;
		var t = (this.progress / duration);
		if (Math.abs( e ) > 0.01) { t += e * utils.sin( 180 * t ); }
		
		return value * t;
	}
});



//========================================================================================
exports.VFX = MessageListener.singleton(
/** @lends Dn.VFX.prototype */
{
	classname: 'VFX',
	/**
	 * @class <code>VFX</code> class effect to the <code>GL2.Node</code> class. 
	 * Use it in fluent interface(http://martinfowler.com/bliki/FluentInterface.html), like jQuery.
	 *
	 * @arguments Core.MessageListener
	 * @constructs Initialize effect class.
	 */
	initialize: function() {
		UpdateEmitter.addListener( this, this.onUpdate );
		
		this.tasks  = {};
		this.nodeId = 0;
		this.taskId = 0;
	},
	
	/**
	 * Start setting new tasks.
	 *
	 * @param {GL2.Node} node Target node object.
	 * @returns {Dn.VFXTaskNode} next job.
	 */
	enchant: function( node ) {
		
		var nodeId = 0;
		var taskId = 0;
		
		if (! node._dnVFXManagedId) {
			nodeId = ++this.nodeId;
			node._dnVFXManagedId = nodeId;
			this.tasks[ nodeId ] = {};
		} else {
			nodeId = node._dnVFXManagedId;
			taskId = ++this.taskId;
		}
		
		var newTask = new exports.VFXTaskNode( node );
		this.tasks[ nodeId ][ taskId ] = newTask;
		return newTask;
	},
	
	/**
	 * Stop all remained tasks of passed node.
	 *
	 * @param {GL2.Node} node Target node object.
	 */
	stop: function( node ) {
		
		if (node._dnVFXManagedId) {
			this.tasks[ node._dnVFXManagedId ] = {};
			delete node._dnVFXManagedId;
		}
	},
	
	/**
	 * Reset task groups and start recreating.
	 *
	 * @param {GL2.Node} node Target node object.
	 * @returns {Dn.VFXTaskNode} next job.
	 */
	restart: function( node ) {
		
		this.stop( node );
		return this.enchant( node );
	},
	
	resume: function( node ) {
		if (node._dnVFXManagedId) {
			var nodeId = node._dnVFXManagedId;
			for (var taskId in this.tasks[ nodeId ]) {
				var task = this.tasks[ nodeId ][ taskId ];
				if (task.func === "register") {
					if (task.next.isActive) {
						this.tasks[ nodeId ][ taskId ] = task.next;
					} else {
						var n = this.tasks[ nodeId ][ taskId ].node;
						if (n._dnVFXManagedId) { delete n._dnVFXManagedId; break; }
						delete this.tasks[ nodeId ][ taskId ];
					}
				}
			}
		}		
	},
	
	//--------------------------------------------------------------------------
	removeAllTasks: function() {
		
		for (var nodeId in this.tasks) {
			for (var taskId in this.tasks[ nodeId ]) {
				var n = this.tasks[ nodeId ][ taskId ].node || null;
				if (!n) { break; }
				if (n._dnVFXManagedId) { delete n._dnVFXManagedId; break; }
			}
		}
		this.tasks = {};
	},
	
	//==========================================================================
	// Animation methods
	//--------------------------------------------------------------------------
	end: function() {
		utils.destroyIfAlive(this.node);
		this.isDestroyed = true;
	},
	
	//--------------------------------------------------------------------------
	wait: function( time ) {
		this.finish( time );
	},
	
	//--------------------------------------------------------------------------
	appear: function() {
		this.node.setVisible( true );
		this.finish();
	},
	
	//--------------------------------------------------------------------------
	disappear: function() {
		this.node.setVisible( false );
		this.finish();
	},
	
	//--------------------------------------------------------------------------
	fadeIn: function( duration, alpha ) {
		if (alpha === undefined) { alpha = 1; }
		this.node.setAlpha( (this.progress / duration) * alpha );
		this.finish( duration );
	},
	
	//--------------------------------------------------------------------------
	fadeOut: function( duration, alpha ) {
		if (alpha === undefined) { alpha = 1; }
		this.node.setAlpha( (1 - (this.progress / duration)) * alpha );
		this.finish( duration );
	},
	
	//--------------------------------------------------------------------------
	alpha: function( duration, alpha, easeIn ) {
		if (! this.isInitialized) {
			this.isInitialized = true;
			var a = this.node.getAlpha();
			this.param.startAlpha = a;
			this.param.targetAlpha = alpha + a;
			if (this.param.targetAlpha > 1) {
				this.param.targetAlpha = 1;
			}
			if (this.param.targetAlpha < 0) {
				this.param.targetAlpha = 0;
			}
		}
		
		this.node.setAlpha( this.param.startAlpha + this.easing(duration, alpha, easeIn) );
		if (this.finish( duration )) {
			this.node.setAlpha( this.param.targetAlpha);
		}
	},
	
	//--------------------------------------------------------------------------
	alphaTo: function( duration, alpha, easeIn ) {
		var a = alpha - this.node.getAlpha();
		this.func = 'alpha';
		this.args = [duration, a, easeIn];
	},
	
	//--------------------------------------------------------------------------
	move: function( duration, dx, dy, easeIn ) {
		
		if (! this.isInitialized) {
			var x = this.node.getPosition().getX();
			var y = this.node.getPosition().getY();
			this.isInitialized = true;
			this.param.startX  = x;
			this.param.startY  = y;
			this.param.targetX = x + dx;
			this.param.targetY = y + dy;
		}
		
		this.node.setPosition(
			this.param.startX + this.easing( duration, dx, easeIn ),
			this.param.startY + this.easing( duration, dy, easeIn )
		);
		if (this.finish( duration )) {
			this.node.setPosition( this.param.targetX, this.param.targetY );
		}
 	},
	
	//--------------------------------------------------------------------------
	moveTo: function( duration, tx, ty, easeIn ) {
		
		var dx = tx - this.node.getPosition().getX();
		var dy = ty - this.node.getPosition().getY();
		this.func = 'move';
		this.args = [duration, dx, dy, easeIn];
	},
	
	//--------------------------------------------------------------------------
	scale: function( duration, dScaleX, dScaleY, easeIn ) {

		if (! this.isInitialized) {
			var sx = this.node.getScale().getX();
			var sy = this.node.getScale().getY();
			this.isInitialized = true;
			this.param.startScaleX  = sx;
			this.param.startScaleY  = sy;
			this.param.targetScaleX = sx + dScaleX;
			this.param.targetScaleY = sy + dScaleY;
		}
		
		this.node.setScale(
			this.param.startScaleX + this.easing( duration, dScaleX, easeIn ),
			this.param.startScaleY + this.easing( duration, dScaleY, easeIn )
		);
		this.finish( duration );
		if (this.finish( duration )) {
			this.node.setScale( this.param.targetScaleX, this.param.targetScaleY );
		}
	},

	//--------------------------------------------------------------------------
	scaleTo: function( duration, tScaleX, tScaleY, easeIn ) {
		
		var dsx = tScaleX - this.node.getScale().getX();
		var dsy = tScaleY - this.node.getScale().getY();
		this.func = 'scale';
		this.args = [duration, dsx, dsy, easeIn];
	},

	//--------------------------------------------------------------------------

	rotate: function( duration, dRot, easeIn ) {
		
		if (! this.isInitialized) {
			var rot = this.node.getRotation();
			this.isInitialized = true;
			this.param.startRot  = rot;
			this.param.targetRot = rot + dRot;
		}
		
		this.node.setRotation(
			this.param.startRot + this.easing( duration, dRot, easeIn )
		);
		if (this.finish( duration )) {
			this.node.setRotation( this.param.targetRot );
		}
	},
	
	//--------------------------------------------------------------------------
	rotateTo: function( duration, tRot, easeIn ) {
		
		var dRot = tRot - this.node.getRotation();
		this.func = 'rotate';
		this.args = [duration, dRot, easeIn];
	},
	
	//--------------------------------------------------------------------------
	color: function( duration, dr, dg, db, easeIn ) {
		
		if (! this.isInitialized) {
			this.isInitialized = true;
			this.param.startR  = this.node.getColor().getRed();
			this.param.targetR = this.param.startR + dr;
			this.param.startG  = this.node.getColor().getGreen();
			this.param.targetG = this.param.startG + dg;
			this.param.startB  = this.node.getColor().getBlue();
			this.param.targetB = this.param.startB + db;
		}
		
		this.node.setColor(
			this.param.startR + this.easing( duration, dr, easeIn ),
			this.param.startG + this.easing( duration, dg, easeIn ),
			this.param.startB + this.easing( duration, db, easeIn )
		);
		if (this.finish( duration )) {
			this.node.setColor(
				this.param.targetR,
				this.param.targetG,
				this.param.targetB
			);
		}
	},
	
	//--------------------------------------------------------------------------
	colorTo: function( duration, tr, tg, tb, easeIn ) {
		
		var dr = tr - this.node.getColor().getRed();
		var dg = tg - this.node.getColor().getGreen();
		var db = tb - this.node.getColor().getBlue();
		this.func = 'color';
		this.args = [duration, dr, dg, db, easeIn];
	},
	
	//--------------------------------------------------------------------------
	hop: function ( velocity, gravity ) {

		if (! this.isInitialized) {
			this.isInitialized = true;
			this.param.vecY = -velocity;
			this.param.baseLineY = this.node.getPosition().getY();
			this.param.hopCount = 10;
		}
		var x = this.node.getPosition().getX();
		var y = this.node.getPosition().getY();
		this.param.vecY += gravity;
		y += this.param.vecY;
		this.node.setPosition( x, y );

		if (y > this.param.baseLineY) {
			y = this.param.baseLineY;
			this.node.setPosition( x, y );
			this.param.vecY *= -0.7;
			this.param.hopCount -= 1;
			if (this.param.hopCount == 0) { this.finish(); }
			if (Math.abs( this.param.vecY ) < 0.1) { this.finish(); }
		}
	},
	
	blink: function (duration, term, alphas) {
		var progress = this.progress % term / term;
		var alpha = alphas[0] * (1 - progress) + alphas[1] * progress;
		this.node.setAlpha( alpha );
		this.finish( duration );
	},
	
	finish: function () {
		this.finish();
	},
	
	//==========================================================================
	//--------------------------------------------------------------------------
	onUpdate: function() {
		var delta = Timekeeper.getPassedSec();
		
		for (var nodeId in this.tasks) {
			for (var taskId in this.tasks[ nodeId ]) {
				
				//----- 途中で task が destroy された
				if (! this.tasks[ nodeId ]) { continue; }
				
				var t = this.tasks[ nodeId ][ taskId ];
				if (! t.isActive) { continue; }
				t.progress += delta;
				t.delta     = delta;
				
				//----- call function
				if (typeof( t.func ) === 'function') {
					t.func.apply( t, t.args );
				} else {
					this[ t.func ].apply( t, t.args );
				}
				
				if (t.isDestroyed) {
					delete this.tasks[ nodeId ];
				}
				else if (t.isFinished) {
					if (t.next.isActive) {
						this.tasks[ nodeId ][ taskId ] = t.next;
					} else {
						var n = this.tasks[ nodeId ][ taskId ].node;
						if (n._dnVFXManagedId) { delete n._dnVFXManagedId; }
						delete this.tasks[ nodeId ][ taskId ];
					}
				}
			}
			//----- 途中で node が destroy された
			if (! this.tasks[ nodeId ]) { continue; }
		}
	}	
});

