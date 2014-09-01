var Core  = require('../../NGCore/Client/Core').Core;

var Util  = require('../Util').Util;

var EventObject  = require('./EventObject').EventObject;
var NgEventListenerManager  = require('./NgEventListenerManager').NgEventListenerManager;

var TouchHandler=exports.TouchHandler=Core.Class.subclass{

	classname: 'TouchHandler',

	/**
	 * Create touch target.
	 * level
        touch process model
            baseTouch
            longTouch
            
	 */
	initialize: function(obj) {
        this._obj=obj;
		// Touch Constructor
		this._trackingId = [];
		this._touchLast = [];
		this._touchNew = [];
		this._isMove = [];
		
		// the minimum distance to recognizing move action; 
		this._recogDist = Capabilities.getScreenWidth() * 0.08;
	},
	destroy: function() {
	},
	touchStart: function() {},
	touchMove: function() {},
	touchMoveEnd: function() {},
	touchEnd: function() {},
	pinchStart: function() {},
	pinchMove: function() {},
	pinchEnd: function() {},
    longTouchStart:function  () {},
    longTouchEnd:function  () {},
	/**
	 * @event
     * touchAction
	 */ 
	onTouch: function(touch) {
				 
		var p = touch.getPosition();
		var id=touch.getId();

		// Touch Common Process
		var event=new EventObject("touch",true,true);
        event.target=touch;
        NgEventListenerManager.dispatchEvent(this._obj,event);

		switch (touch.getAction()) {
			
			////////////////////////
			case touch.Action.Start:

				if ( this._trackingId[1] ) {	
					// 3rd Finger or more
                    return false;
				} else if ( this._trackingId[0] ) {
					//2nd Finger
					this._trackingId[1] = id;
					this._touchLast[1] = p;

					this._pinchCenter = this._calcCenter( this._touchLast[0], this._touchLast[1] );
                    this._pinchCenterX =this._pinchCenter[0];
					this._pinchCenterY =this._pinchCenter[1];
					this._pinchDistN = this._calcDist( this._touchLast[0], this._touchLast[1] );
					this._isMove[0] = true;
					this._isMove[1] = true;			
					//this.pinchStart ( this._pinchCenterX, this._pinchCenterY );	
                    event=new EventObject("pinchStart",true,true);
                    event.target=touch;
                    event.pinchCenterX=this._pinchCenterX;
                    event.pinchCenterY=this._pinchCenterY;
                    NgEventListenerManager.dispatchEvent(this._obj,event);
				} else { 
					// 1st Finger
					this._trackingId[0] = id;
					this._touchLast[0] = p;
					this._isMove[0] = false;
					//this.touchStart ( this._touchLast[0].getX(), this._touchLast[0].getY());
                    event=new EventObject("touchStart",true,true);
                    event.target=touch;
                    event.x=this._touchLast[0].getX();
                    event.y=this._touchLast[0].getY();
                    NgEventListenerManager.dispatchEvent(this._obj,event);
				}
				return true;

			////////////////////////
			case touch.Action.End:
				
				// Irregular remove
				if( id !== this._trackingId[0] && id !== this._trackingId[1] ) {
					return false;
				}

				if( id === this._trackingId[1] && this._trackingId[0]) {
					//this.pinchEnd() ;
                    event=new EventObject("pinchEnd",true,true);
                    event.target=touch;
                    NgEventListenerManager.dispatchEvent(this._obj,event);
				
					// 2nd Finger removed (1st Finger still remains) 
					this._trackingId[0] = null;
					this._touchLast[0] = null;
					this._touchNew[0] = null;
					this._isMove[0] = null;
					this._trackingId[1] = null;
					this._touchLast[1] = null;
					this._touchNew[1] = null;
					this._isMove[1] = null;
                    this._pinchCenter = null;
					this._pinchCenterX = null;
					this._pinchCenterY = null;
					this._pinchDistN = null;
					this._pinchDist = null;
				
				} else if(id === this._trackingId[0]) {
				
					if (this._trackingId[1]) {
						this.pinchEnd() ;
						this._pinchCenterX = null;
						this._pinchCenterY = null;
						this._pinchDistN = null;
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
						this.touchMoveEnd ( p.getX(), p.getY() );
					} else {
                        this.touchEnd ( p.getX(), p.getY() );
					}
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
				if (id == this._trackingId[0]) {
					this._touchNew[0] = p;
				} else if (id == this._trackingId[1]) {
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
};

