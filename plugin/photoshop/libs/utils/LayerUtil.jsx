var LayerUtil={
	
    /**
     * 导入一个图片为一个智能对像
 	*/
	placeImage:function (file) {
	  var desc = new ActionDescriptor();
	  //路径
	  desc.putPath( charIDToTypeID('null'), new File(file));
	  //对齐方式
	  desc.putEnumerated( charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), charIDToTypeID('Qcsa') );
	  //放位置
	  var locationDesc = new ActionDescriptor();
	  locationDesc.putUnitDouble( charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), 0.000000 );
	  locationDesc.putUnitDouble( charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), 0.000000 );
	  desc.putObject( charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), locationDesc );
	  
	  return executeAction( charIDToTypeID('Plc '), desc, DialogModes.NO );
	},

   /**
    * 导入一组图片为layer
	*/
	openFileList:function ( specList ){
	    var keyfileList		    = app.stringIDToTypeID( "fileList" );
	    var keyAddLayerFromFile	    = app.stringIDToTypeID( "addLayerFromFile" );
	
		var myFileList = new ActionList();
		for (var i = 0; i < specList.length; i++)
			myFileList.putPath(new File(specList[i]));

		var myOpenDescriptor = new ActionDescriptor();
		myOpenDescriptor.putList(keyfileList, myFileList);

		executeAction( keyAddLayerFromFile, myOpenDescriptor, DialogModes.NO );
	},
	
	getCorners:function (layer) {
		var bounds = layer.bounds;
		corners = new Array();
		corners[0] = {x:bounds[0].as("px"), y:bounds[1].as("px")};
		corners[2] = {x:bounds[2].as("px"), y:bounds[3].as("px")};
		corners[1] = {x:corners[2].x,y:corners[0].y};
		corners[3] = {x:corners[0].x,y:corners[2].y};
		return corners;
	}
};