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
var Capabilities = require('../../../NGCore/Client/Core/Capabilities').Capabilities;
var TouchTarget = require('../../../NGCore/Client/GL2/TouchTarget').TouchTarget;

exports.TouchHandler = MessageListener.subclass(
/** @lends TouchHandler.prototype */
{
	classname: 'TouchHandler',

	/**
	 * Create touch target.
	 *
	 * @class Analyze touch event and call suitable handler 
	 *		by the situation.
	 */
	initialize: function( w, h, z ) {

		// Create touch target.
		this._target = new TouchTarget();
		this._target.setPosition( 0, 0 );
		this._target.setAnchor( 0.5, 0.5 );
		this._target.setSize( w, h );
		this._target.setDepth(z);
		this._target.getTouchEmitter().addListener(this, this.onTouch, z);
		
		// Touch Constructor
		this._trackingId = [];
		this._touchLast = [];
		this._touchNew = [];
		this._isMove = [];
		
		// the minimum distance to recognizing move action; 
		this._recogDist = Capabilities.getScreenWidth() * 0.08;
		//this._recogDist = 40;
		//this._recogDist = 5;
		
	},
	setPosition: function( x, y ) {
		this._target.setPosition( x, y );	
	},
	setAnchor: function( x, y ) {
		this._target.setAnchor( x, y );	
	},
	setDepth: function( z ) {
		this._target.setDepth( z );	
	},
	destroy: function() {
		this._target.destroy();
	},
	touchAction: function() {},
	touchStart: function() {},
	touchMove: function() {},
	touchMoveEnd: function() {},
	touchEnd: function() {},
	pinchStart: function() {},
	pinchMove: function() {},
	pinchEnd: function() {},
	/**
	 * Register handler to hook all touch event.
	 *
	 * @param {function()} listener listener
	 */
	setTouchAction: function (listener){
		this.touchAction = listener;
	},

	/**
	 * Register handler for ``One Finger Touch Start``
	 *
	 * @param {function(x,y)} listener listener
	 */
	setTouchStart: function (listener){
		this.touchStart = listener;
	},

	/**
	 * Register handler for ``One Finger Touch Move``
	 *
	 * @param {function(oldX,oldY,newX,newY)} handler handler
	 */ 
	setTouchMove: function (listener){
		this.touchMove = listener;
	},
	
	/**
	 * Register handler for ``One Finger Touch End``
	 *
	 * @param {function(x,y)} handler handler
	 */ 
	setTouchMoveEnd: function (listener){
		this.touchMoveEnd = listener;
	},
	
	/**
	 * Register handler for ``One Finger Tap End``
	 *
	 * @param {function(x,y)} handler handler
	 */ 
	setTouchEnd: function (listener){
		this.touchEnd = listener;
	},
	
	/**
	 * Register handler for ``Pinch Start``
	 *
	 * @param {function(centerX,centerY)} handler handler
	 */ 
	setPinchStart: function (listener){
		this.pinchStart = listener;
	},
	
	/**
	 * Register handler for ``Pinch Move``
	 *
	 * @param {function(centerX,centerY,ratio)} handler handler
	 */ 
	setPinchMove: function (listener){
		this.pinchMove = listener;
	},

	/**
	 * Register handler for ``Pinch End``
	 *
	 * @param {function()} handler handler
	 */ 
	setPinchEnd: function (listener){
		this.pinchEnd = listener;
	},

	/**
	 * @event
	 */ 
	onTouch: function(touch) {
				 
		var p = touch.getPosition();
		
		// Touch CommonProcess
		this.touchAction();

		switch (touch.getAction()) {
			
			////////////////////////
			case touch.Action.Start:
				NgLogD("**** touch start case.");

				// touch 
				if (touch.targetCb) {
					this._targetCb = touch.targetCb;
				}

				if ( this._trackingId[1] ) {	
					// 3rd Finger or more
                    return false;

				} else if ( this._trackingId[0] ) {
					//2nd Finger
					this._trackingId[1] = touch.getId();
					this._touchLast[1] = p;
					this._pinchCenterX = this._calcCenter( this._touchLast[0], this._touchLast[1] )[0];
					this._pinchCenterY = this._calcCenter( this._touchLast[0], this._touchLast[1] )[1];
					this._pinchDistN = this._calcDist( this._touchLast[0], this._touchLast[1] );
					this._isMove[0] = true;
					this._isMove[1] = true;			
					this.pinchStart ( this._pinchCenterX, this._pinchCenterY );	
				} else { 
					// 1st Finger
					this._trackingId[0] = touch.getId();
					this._touchLast[0] = p;
					this._isMove[0] = false;
					this.touchStart ( this._touchLast[0].getX(), this._touchLast[0].getY());
				}
				return true;

			////////////////////////
			case touch.Action.End:
				NgLogD("**** touch end case.");
				
				// Irregular remove
				if( touch.getId() !== this._trackingId[0] && touch.getId() !== this._trackingId[1] ) {
					return false;
				}

				if( touch.getId() === this._trackingId[1] && this._trackingId[0]) {
					this.pinchEnd() ;
				
					// 2nd Finger removed (1st Finger still remains) 
					this._targetCb = null;
					this._trackingId[0] = null;
					this._touchLast[0] = null;
					this._touchNew[0] = null;
					this._isMove[0] = null;
					this._trackingId[1] = null;
					this._touchLast[1] = null;
					this._touchNew[1] = null;
					this._isMove[1] = null;
					this._pinchCenterX = null;
					this._pinchCenterY = null;
					this._pinchDistN = null;
					this._pinchDist = null;
				
				} else if( touch.getId() === this._trackingId[0]) {
				
					if (this._trackingId[1]) {
						this.pinchEnd() ;
						this._pinchCenterX = null;
						this._pinchCenterY = null;
						this._pinchDistN = null;
						this._targetCb = null;
						this._trackingId[0] = null;
						this._touchLast[0] = null;
						this._touchNew[0] = null;
						this._isMove[0] = null;
						this._trackingId[1] = null;
						this._touchLast[1] = null;
						this._touchNew[1] = null;
						this._isMove[1] = null;
						return true;
					}

					// 1st Finger removed 
					if (this._isMove[0]) { 
						NgLogD("**** touch end move end.");
						this.touchMoveEnd ( p.getX(), p.getY() );
					} else {
						if (this._targetCb) {
							this._targetCb(touch);
						} else {
							NgLogD("**** touch end one finger.");
							this.touchEnd ( p.getX(), p.getY() );
						}
					}
					this._targetCb = null;
					this._trackingId[0] = null;
					this._touchLast[0] = null;
					this._touchNew[0] = null;
					this._isMove[0] = null;
				}
				this._recogChkFlg = false;
				return true;
			
			////////////////////////
			case touch.Action.Move:

				// Update Touch
				if ( touch.getId() == this._trackingId[0]) {
					this._touchNew[0] = p;
				} else if ( touch.getId() == this._trackingId[1]) {
					this._touchNew[1] = p;
				} else {
					return false;
				}


				if( this._touchNew[0] == null && this._touchNew[1] == null) {
					
					// Irregular move
					return false;
				
				} else if( this._touchNew[1] == null && this._touchNew[0] !== null ) {

					// One Finger moved
					var lastP = this._touchLast[0];
					var newP  = this._touchNew[0];
					var dist = this._calcDist( lastP, newP );

					// asobi.
					if ( this._recogChkFlg ) {
					}
					else {
						if ( dist < this._recogDist ) {
							return false;
						}
						else {
							this._recogChkFlg = true;
						}
					}

					// if (dist < this._recogDist && !this._recogChkFlg) {
					// 	this._recogChkFlg = true;
					// 	return false;
					// }

					this.touchMove( lastP.getX(), lastP.getY(), newP.getX(), newP.getY(), touch);
					this._touchLast[0] = this._touchNew[0];
					this._isMove[0] = true;

				} else if( this._touchNew[0] == null && this._touchNew[1] !== null ) {
					
					// One Finger moved
					var lastP = this._touchLast[1];
					var newP  = this._touchNew[1];
					var dist = this._calcDist( lastP, newP );
					if (dist < this._recogDist) {
						return false;
					}
					
					this.touchMove( lastP.getX(), lastP.getY(), newP.getX(), newP.getY(), touch);
					this._touchLast[1] = this._touchNew[1];
					this._isMove[1] = true;

				} else if (this._touchNew[1] !== null && this._touchNew[0] !== null) {
					
					// Double Finger moved (Pinch)
					this._pinchDistN = this._calcDist(this._touchLast[0], this._touchLast[1]);
					this._pinchDist = this._calcDist(this._touchNew[0], this._touchNew[1]);
					var pinchRatio = this._pinchDist / this._pinchDistN ;
					
					this.pinchMove(this._pinchCenterX, this._pinchCenterY, pinchRatio);

					// Remember last location.
					this._touchLast[0] = this._touchNew[0];
					this._touchLast[1] = this._touchNew[1];
					this._pinchDistN = null;
					this._pinchDist = null;
				}
				return true;
		}
	},
//-----------------------------------------------------------------------------------------------
	_calcDist: function( p1, p2 ) {
		var distX = p1.getX() - p2.getX();
		var distY = p1.getY() - p2.getY();
		var dist = distX * distX + distY * distY;
		return Math.sqrt(dist);
	},
	_calcCenter: function( p1, p2 ) {
		var center = new Array(2);
		center[0] = ( p1.getX() + p2.getX() )/2;
		center[1] = ( p1.getY() + p2.getY() )/2;
		return center;
	},
	getTarget: function(){
		return this._target;
	},
	setPosition: function(x, y) {
		this._target.setPosition(x, y);
	},
	getPosition: function() {
		return this._target.getPosition();
	}
});

