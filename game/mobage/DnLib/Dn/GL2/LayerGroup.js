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
var Node  = require('../../../NGCore/Client/GL2/Node').Node;
var GL2Root  = require('../../../NGCore/Client/GL2/Root').Root;


// IMAGE:
//
//   GL2.Root
//      |- Group1
//      |    |- Layer1
//      |    `- Layer2
//      `- Group2
//           |- Layer1
//           `- Layer2
//                |
//                `- Node1    <- addNode( 'Group2', 'Layer2', Node1 )
//
//
// USAGE:
//
//     //----- on initialize
//     var lg = dn.LayerGroup;
//     lg.addGroup( 'battle', 0 );
//     lg.addLayer( 'battle', 'back'  , 0 );
//     lg.addLayer( 'battle', 'front' , 1 );
//     lg.addLayer( 'battle', 'effect', 2 );
//     lg.addLayer( 'battle', 'text'  , 3 );
//     lg.fitToScreen( 'battle', 320 ); // short side of screen size
//
//     //----- on main loop
//     lg.addNode( 'battle', 'front', node );
//     lg.addNode( 'battle', 'front', nodeHolder.node, nodeHolder );
//         // if the node is a child of other class, you should set
//         // 4th argument to pass the object to destroy.
//         // if 5th argument is true, the node will not be destroy()
//         //  when clearGroup, clearLayer
//
//     //----- on finalize
//     lg.clearGroup( 'battle' ); //----- call destroy() of all registered node

exports.LayerGroup = Node.singleton(
/** @lends LayerGroup.prototype */
{
	classname: 'LayerGroup',
	/**
	 * @class
	 * @author Tatsuya Koyama
	 */
	initialize: function() {
		
		this.groups = {};
		this.layers = {};
		this.destroyListeners = {};
		this.listenerId = 0;
		this.numNode    = 0;
		this.setDepth( 1 );
		GL2Root.addChild( this );
	},
	/**
	 *
	 */
	setRootDepth: function( depth ) {
		this.setDepth( depth );
	},
	/**
	 * Add new group. if the groupName already exists,
	 * this action is ignored.
	 * 
	 * @param {String} groupName group name
	 * @param {Number} depth depth
	 */
	addGroup: function( groupName, depth ) {
		
		if (this._isGroupDuplicated( groupName )) { return false; }
		var group = new Node();
		group.setDepth( depth );
		this.addChild( group );
		this.groups[ groupName ] = group;
		this.layers[ groupName ] = {};
		this.destroyListeners[ groupName ] = {};
	},
	/**
	 * Add new layer. if the layerName already exists,
	 * this action is ignored.
	 * 
	 * @param {String} groupName group name
	 * @param {String} layerName layer name
	 * @param {Number} depth depth
	 */
	addLayer: function( groupName, layerName, depth ) {
		
		if (this._isLayerDuplicated( groupName, layerName )) { return false; }
		var layer = new Node();
		layer.setDepth( depth );
		this.groups[ groupName ].addChild( layer );
		this.layers[ groupName ][ layerName ] = layer;
		this.destroyListeners[ groupName ][ layerName ] = {};
	},
	/**
	 * Remove all registered groups.
	 */
	removeAllGroups: function() {
		
		for (var groupName in this.groups) {
			this.removeGroup( groupName );
		}
	},
	/**
	 * Remove target group. Layers which are belonged to the group will be removed too.
	 * 
	 * @param {String} groupName group name.
	 */
	removeGroup: function( groupName ) {
		
		if (this._hasNotGroup( groupName )) { return false; }
		for (var layerName in this.layers[ groupName ]) {
			this.removeLayer( groupName, layerName );
		}
		this.groups[ groupName ].destroy();
		delete this.groups[ groupName ];
		delete this.layers[ groupName ];
		delete this.destroyListeners[ groupName ];
	},
	/**
	 * Remove target layer. Nodes which are contained in the layer are removed too.
	 *
	 * @param {String} groupName group name
	 * @param {String} layerName layer name
	 */
	removeLayer: function( groupName, layerName ) {
		
		if (this._hasNotLayer( groupName, layerName )) { return false; }
		this.clearLayer( groupName, layerName );
		this.layers[ groupName ][ layerName ].destroy();
		delete this.layers[ groupName ][ layerName ];
		delete this.destroyListeners[ groupName ][ layerName ];
	},
	/**
	 * Return the node object of target groups.
	 *
	 * @param {String} groupName group name
	 * @returns {GL2.Node} groups node(false: undefined)
	 */
	getGroup: function( groupName ) {
		
		if (this._hasNotGroup( groupName )) { return false; }
		return this.groups[ groupName ];
	},
	/**
	 * Return the layer object of target groups.
	 *
	 * @param {String} groupName group name
	 * @param {String} layerName layer name
	 * @returns {GL2.Node} layer node(false: undefined)
	 */
	getLayer: function( groupName, layerName ) {
		
		if (this._hasNotLayer( groupName, layerName )) { return false; }
		return this.layers[ groupName ][ layerName ];
	},
	/**
	 * Register node object to the layer
	 *
	 * @param {String} groupName group name
	 * @param {String} layerName layer name
	 * @param {GL2.Node} node node object
	 * @param {Function} destroyCaller destructor function of this node (default node.destroy)
	 * @param {Boolean} permanentMode if true, the node is not removed when parent layer removed.
	 */
	addNode: function( groupName, layerName, node, destroyCaller, permanentMode ) {
		
		if (this._hasNotLayer( groupName, layerName )) { return false; }
		if (! destroyCaller) { destroyCaller = node;  }
		if (! permanentMode) { permanentMode = false; }
		
		this.layers[ groupName ][ layerName ].addChild( node );
		++this.numNode;
		
		if (! permanentMode) {
			//----- add the layer destroy event listener
			++this.listenerId;
			this.destroyListeners[ groupName ][ layerName ][ this.listenerId ] = destroyCaller;
			
			//----- hook the node's destroy() to add the remove listener process
			var originalDestroyFunc = destroyCaller.destroy;
			var that = this;
			var id   = this.listenerId;
			destroyCaller.destroy = function() {
				originalDestroyFunc.apply( destroyCaller );
				delete that.destroyListeners[ groupName ][ layerName ][ id ];
				--that.numNode;
			};
		}
	},
	/**
	 * Clear all nodes.
	 */
	clearAllGroups: function() {
		
		for (var groupName in this.groups) {
			this.clearGroup( groupName );
		}
	},
	/**
	 * Clear all nodes belong to the group. 
	 * 
	 * @param {String} groupName group name
	 */
	clearGroup: function( groupName ) {
		
		if (this._hasNotGroup( groupName )) { return false; }
		for (var layerName in this.layers[ groupName ]) {
			this.clearLayer( groupName, layerName );
		}
	},
	/**
	 * Clear all nodes belong to the layer
	 *
	 * @param {String} groupName group name
	 * @param {String} layerName layer name
	 */
	clearLayer: function( groupName, layerName ) {
		
		if (this._hasNotLayer( groupName, layerName )) { return false; }
		var listeners = this.destroyListeners[ groupName ][ layerName ];
		for (var id in listeners) {
			listeners[ id ].destroy();
		}
		listeners = {};
	},
	/**
	 * Liner scale setting.
	 *
	 * @param {String} groupName group name
	 * @param {Number} originalShortSideLength short side length.
	 * @see setScale
	 */
	fitToScreen: function( groupName, originalShortSideLength ) {
		
		if (this._hasNotGroup( groupName )) { return false; }
		var scale  = 1.0;
		var width  = Capabilities.getScreenWidth();
		var height = Capabilities.getScreenHeight();
		
		if (width < height) {
			scale = width  / originalShortSideLength;
		} else {
			scale = height / originalShortSideLength;
		}
		this.groups[ groupName ].setScale( scale, scale );
	},
	/**
	 * Flexible scale setting.
	 *
	 * @param {String} groupName group name
	 * @param {Number} scaleW
	 * @param {Number} scaleH
	 * @see fitToScreen
	 */
	setScale: function( groupName, scaleW, scaleH ) {
		
		if (this._hasNotGroup( groupName )) { return false; }
		this.groups[ groupName ].setScale( scaleW, scaleH );
	},

	/**
	 * For debugging
	 */
	getDescription: function() {
		var numGroup = 0;
		var numLayer = 0;
		for (var groupName in this.groups) {
			++numGroup;
			for (var layerName in this.layers[ groupName ]) {
				++numLayer;
			}
		}
		return 'Node: ' + this.numNode + ' Group: ' + numGroup + ' Layer: ' + numLayer;
	},
	/**
	 * For error checking
	 */
	_isGroupDuplicated: function( groupName ) {
		
		if (this.groups[ groupName ]) {
			NgLogD( 'Warning: dn.LayerGroup: group already exists: ' + groupName );
			return true;
		}
		return false;
	},

	_isLayerDuplicated: function( groupName, layerName ) {
		
		if (this._hasNotGroup( groupName )) { return true; }
		if (this.layers[ groupName ][ layerName ]) {
			NgLogD( 'Warning: dn.LayerGroup: layer already exists: ' + layerName );
			return true;
		}
		return false;
	},
	
	_hasNotGroup: function( groupName ) {
		
		if (! this.groups[ groupName ]) {
			NgLogD( 'Error: dn.LayerGroup: group not found: ' + groupName );
			return true;
		}
		return false;
	},
	
	_hasNotLayer: function( groupName, layerName ) {
		
		if (this._hasNotGroup( groupName )) { return true; }
		if (! this.layers[ groupName ][ layerName ]) {
			NgLogD( 'Error: dn.LayerGroup: layer not found: ' + layerName );
			return true;
		}
		return false;
	}
});

