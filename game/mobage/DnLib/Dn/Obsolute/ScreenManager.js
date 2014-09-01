var Core = require('../../../NGCore/Client/Core').Core;
var GL2  = require('../../../NGCore/Client/GL2').GL2;
var LayerGroup = require('../GL2/LayerGroup').LayerGroup;

// written by Tatsuya Koyama
// dn.ScreenManager とセットで使うコンテナ。Club から Machete にうつるときに作った残骸。
// 今では ScreenManager もこれも必要ないことが分かったが、コードを直すのが面倒なので昔のインタフェースを
// 残しておくことを許してほしい。

exports.NodeContainer = Core.MessageListener.subclass({
	classname: 'NodeContainer',
	//--------------------------------------------------------------------------
	initialize: function() {
		this.node = new GL2.Sprite();
		this.isAddedToLayer = false;
	},
	
	//--------------------------------------------------------------------------
	addToLayer: function( layerName, groupName ) {
		//ScreenManager.getInstance().addChild( layerName, this );
		if (! groupName) { groupName = 'battle'; }
		LayerGroup.addNode( groupName, layerName, this.node, this );
		//this.isAddedToLayer = true;
	},
	
	//--------------------------------------------------------------------------
	destroy: function() {
		this.node.destroy();
		/*
		if (this.isAddedToLayer) {
			dn.ScreenManager.getInstance().removeChild( this );
		}
		*/
	}
	
});


// written by Tatsuya Koyama
// 描画オブジェクト管理のために昔作ったクラス。dn.NodeContainer と併用しなければならないなど
// 汎用性が低いため、よろしくない。今なら改良版の dn.LayerGroup があるので、そちらを使うべきである。
//


exports.ScreenManager = Core.Class.singleton(
/** @lends ScreenManager */
{
	classname: 'ScreenManager',
	/**
	 * @class
	 * @author Tatsuya Koyama
	 * @depricated
	 */
	initialize: function() {
		this.layers     = [];
		this.containers = {};
		this.index      = 0;
		this.scaleW     = 1.0;
		this.scaleH     = 1.0;
		this.numObject  = 0;
		this.index      = 0;
	},
	addLayer: function( layerName, depth ) {
		this.layers[ layerName ] = new GL2.Node();
		this.layers[ layerName ].setDepth( depth );
		GL2.Root.addChild( this.layers[ layerName ] );
	},
	removeLayer: function( layerName ) {
		if (! this.layers[ layerName ]) { return false; }
		this.layers[ layerName ].destroy();
		delete this.layers[ layerName ];
	},
	/**
	 * add node to the layer and put it under memory management.
	 * @param {String} [layerName] identifier of the layer
	 * @param {dn.NodeContainer} [container] target sprite. This will be attached 'managedIndex' member
	 */
	addChild: function( layerName, container ) {
		//----- error check
		if (this.layers[ layerName ] === undefined) {
			NgLogD( "dn.ScreenManager - layer not found: " + layerName );
			return false;
		}
		if (! container.node) {
			NgLogD( "dn.ScreenManager - container has not node" );
			return false;
		}
	
		//----- add to layer and managed memory
		this.layers[ layerName ].addChild( container.node );
		this.index++;
		this.containers[ this.index ] = container;
		container.managedIndex = this.index;
	
		this.numObject++;
		//NgLogD("dn.ScreenManager.addChild : " + this.numObject);
		return true;
	},
	removeChild: function( container ) {
		container.node.destroy();
		delete this.containers[ container.managedIndex ];
		this.numObject--;
		//NgLogD("dn.ScreenManager.removeChild : " + this.numObject);
	},
	/**
	 * If container has 'permanent' member and its value is true,
	 * the container would avoid death.
	 */
	removeAllChildren: function() {
		//----- call destroy of all registered container
		for (var i in this.containers) {
			var c = this.containers[i];
			if (c.permanent  &&  c.permanent === true) {
				continue;
			}
			else if (typeof( this.containers[i].destroy ) === 'function' ) {
				this.containers[i].destroy();
				delete this.containers[i];
			}
			else {
				NgLogD( "dn.ScreenManager - destroy function not found" );
			}
		}
		//NgLogD("dn.ScreenManager remove all children : " + this.numObject);
	},
	getLayer: function( layerName ) {
		if (this.layers[ layerName ] === undefined) {
			return false;
		}
		return this.layers[ layerName ];
	},
	fitToScreen: function( originalShortSideLength ) {
		var scale  = 1.0;
		var width  = Core.Capabilities.getScreenWidth();
		var height = Core.Capabilities.getScreenHeight();
	
		if (width < height) {
			scale = width / originalShortSideLength;
		} else {
			scale = height / originalShortSideLength;
		}
		this.setScale( scale, scale );
	},
	setScale: function( scaleW, scaleH ) {
		if (scaleW < 0  ||  scaleH < 0) {
			return;
		}
		if (scaleW == 0) {
			scaleW = 0.01;
		}
		if (scaleH == 0) {
			scaleH = 0.01;
		}
		this.scaleW = scaleW;
		this.scaleH = scaleH;
	
		for (var i in this.layers) {
			this.layers[i].setScale( scaleW, scaleH );
		}
	}
});
