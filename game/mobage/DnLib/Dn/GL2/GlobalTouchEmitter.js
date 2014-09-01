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

var Capabilities = require('../../../NGCore/Client/Core/Capabilities').Capabilities;
var MessageListener = require('../../../NGCore/Client/Core/MessageListener').MessageListener;
var TouchTarget  = require('../../../NGCore/Client/GL2/TouchTarget').TouchTarget;
var GL2Root  = require('../../../NGCore/Client/GL2/Root').Root;


exports.GlobalTouchEmitter = MessageListener.subclass(
/** @lends GlobaltouchEmitter.prototype */
{
	classname: 'GlobalTouchEmitter',
	/** 
	 * @class This class aims to touch with multi objects.
	 *		Machete Shark has object oriented touch event handling
	 *		mechanism. But, it has following cons:
	 *
	 *			* When ``GL2.Touch#Action.Start`` return true,
	 *			  that handler is not called back anymore.
	 *			* When ``GL2.Touch#Action.Start`` doesn't return true,
	 *			  Move event is not handled.
	 *
	 *		This spec is useful when we want to drag&drop via multi touch,
	 *		but hard to handle MOVE event with multi object, like slashing
	 *		off multi enemies.
	 *
	 *		This class is alternate class of `getTouchEmitter` to enable
	 *		End/Move event handling with multi objects.
	 *
     * @author Tatsuya Koyama
	 */
	initialize: function(portrait) {
		
		this.target = new TouchTarget();
		this.target.setAnchor( [0, 0] );
		if (portrait) {
			this.target.setSize(
				Capabilities.getScreenWidth(), //----- adapt to landscape
				Capabilities.getScreenHeight()
			);
		} else {
			this.target.setSize(
				Capabilities.getScreenHeight(), //----- adapt to landscape
				Capabilities.getScreenWidth()
			);
		}
		this.target.getTouchEmitter().addListener( this, this.onTouch );
		this.target.setDepth( 65535 );
		GL2Root.addChild( this.target );
		
		this.listeners = {};
		this.index = 0;
		this.isActivated = true;
	},
	
	/** destructor */
	destroy: function() {
		this.target.destroy();
	},

	activate:   function() { this.isActivated = true;  },
	deactivate: function() { this.isActivated = false; },
		
	/** add event handler
	 *
	 * @type {fucntion} handler event handler
	 * @returns {bool} is success?
	 */
	addListener: function( object, touchTarget, handler, onFingerOutHandler ) {
		
		if (typeof( handler ) !== 'function') {
			NgLogD( "dn.GlobalTouchEmitter.addListener - handler is not function" );
			return false;
		}
		
		this.index++;
		var listener = {};
		listener.object  = object;
		listener.target  = touchTarget;
		listener.handler = handler;
		listener.hasHandled = false;
		listener.onFingerOutHandler = onFingerOutHandler;
		this.listeners[ this.index ] = listener;
		object.touchObserverIndex = this.index;
		
		//NgLogD( "add listener: " + this.index );
		return true;
	},
	
	/* remove event handler
	 * 
	 * @param object registered object
	 * @returns {bool} is success?
	 */
	removeListener: function( object ) {
		
		if (! object.touchObserverIndex) {
			NgLogD( "dn.GlobalTouchEmitter.removeListener - object is not registered" );
			return false;
		}
		
		delete this.listeners[ object.touchObserverIndex ];
		delete object.touchObserverIndex;
		//NgLogD( "remove listener: " + this.index );
		return true;
	},
	
	/** 
	 * @event
	 */
	onTouch: function( touch ) {
	
		if (! this.isActivated) { return false; }
		
		//----- call listeners
		for (var i in this.listeners) {
			var listener = this.listeners[i];
			if (listener.target) {
				if (touch.getIsInside( listener.target )) {
					listener.handler.apply( listener.object, [touch] );
					listener.hasHandled = true;
				} else {
					if (listener.hasHandled) {
						listener.hasHandled = false;
						if (listener.onFingerOutHandler) {
							listener.onFingerOutHandler.apply( listener.object );
						}
					}
				}
			} else {
				listener.handler.apply( listener.object, [touch] );
			}
		}
		
		//----- return true to capture subsequent Move / End event.
		//----- In this case, lower priority handlers cannot capture the event.
		if (touch.getAction() === touch.Action.Start) {
			return true;
		}
		return false;
	}
	
});


