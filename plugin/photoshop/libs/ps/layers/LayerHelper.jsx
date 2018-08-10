var LayerHelper={
	
    /**
     * 导入一个图片为一个智能对像。
 	*/
	importImageAsSmartObject:function (file,x,y) {
	  var desc = new ActionDescriptor();
	  //路径
	  desc.putPath( charIDToTypeID('null'), new File(file));
	  //对齐方式
	  desc.putEnumerated( charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), charIDToTypeID('Qcsa') );
	  //放位置
	  var locationDesc = new ActionDescriptor();
	  x=typeof(x)==undefined?0.000000:x;
	  y=typeof(y)==undefined?0.000000:y;
	  
	  locationDesc.putUnitDouble( charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), x );
	  locationDesc.putUnitDouble( charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), y );
	  desc.putObject( charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), locationDesc );
	  
	  return executeAction( charIDToTypeID('Plc '), desc, DialogModes.NO );
	},

   /**
    * 导入一组图片为layer。
	*/
	importImages:function ( fileList ){
	    var keyfileList		    = app.stringIDToTypeID( "fileList" );
	    var keyAddLayerFromFile	    = app.stringIDToTypeID( "addLayerFromFile" );
	
		var myFileList = new ActionList();
		for (var i = 0; i < fileList.length; i++)
			myFileList.putPath(new File(fileList[i]));

		var myOpenDescriptor = new ActionDescriptor();
		myOpenDescriptor.putList(keyfileList, myFileList);

		executeAction( keyAddLayerFromFile, myOpenDescriptor, DialogModes.NO );
	},
	
	/**
	 * 取得layer的4个角坐标。
	 */
	getCorners:function (layer) {
		var bounds = layer.bounds;
		corners = new Array();
		corners[0] = {x:bounds[0].as("px"), y:bounds[1].as("px")};
		corners[2] = {x:bounds[2].as("px"), y:bounds[3].as("px")};
		corners[1] = {x:corners[2].x,y:corners[0].y};
		corners[3] = {x:corners[0].x,y:corners[2].y};
		return corners;
	},
	    
	/**
	 *隐藏某个对像下的所有layer
	 */
	hideAllArtLayers:function (obj) {
		for( var i = 0; i < obj.artLayers.length; i++) {
			obj.artLayers[i].allLocked = false;
			obj.artLayers[i].visible = false;
		}
		for( var i = 0; i < obj.layerSets.length; i++) {
			this.setInvisibleAllArtLayers(obj.layerSets[i]);
		}
	},
	
	/**
	 *删除所有隐藏的ArtLayer
	 */
	removeAllInvisibleArtLayers:function (obj) {
		for( var i = obj.artLayers.length-1; 0 <= i; i--) {
			if(!obj.artLayers[i].visible) {
				obj.artLayers[i].remove();
			}
		}
		for( var i = obj.layerSets.length-1; 0 <= i; i--) {
			this.removeAllInvisibleArtLayers(obj.layerSets[i]);
		}
	},
	
	/**
	 *删除所有空的LayerSet
	 */
	removeAllEmptyLayerSets:function (obj) {
		var childrenEmpty = true;
		for( var i = obj.layerSets.length-1; 0 <= i; i--) {
			if( this.removeAllEmptyLayerSets(obj.layerSets[i])) {
				obj.layerSets[i].remove();
			} else {
				childrenEmpty = false;
			}
		}
		if (obj.artLayers.length > 0) {
			childrenEmpty = false;
		}
		return childrenEmpty;
	},
	
	/**
	 *删除所有不可见的Layer
	 */
	removeAllInvisible:function (obj) {
		this.removeAllInvisibleArtLayers(obj);
		this.removeAllEmptyLayerSets(obj);
	}
};