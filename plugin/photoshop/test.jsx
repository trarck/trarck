var g_LibsScriptFolderPath = "/Users/duanhouhai/development/trarck/trarck/plugin/photoshop/libs/";

$.evalFile(g_LibsScriptFolderPath + "math/Terminology.jsx");
$.evalFile(g_LibsScriptFolderPath + "math/Geometry.jsx");
$.evalFile(g_LibsScriptFolderPath + "math/GeometryUtil.jsx");
$.evalFile(g_LibsScriptFolderPath + "math/TransformMatrix.jsx");

$.evalFile(g_LibsScriptFolderPath + "json2.jsx");
$.evalFile(g_LibsScriptFolderPath + "utils/LayerUtil.jsx");

var texgtureFolderPath = "/Users/duanhouhai/development/trarck/dtcq/fca/temp/AM/";
var fcaScale=0.111;
var canvasWidth=2048;
var canvasHeight=2048;

function getInfoData() {
	var file = new File(g_LibsScriptFolderPath+"../tests/cha.json");//File.openDialog("choose dialog");
	file.encoding="BINARY";
	if(file.open()){
		var data=file.read();
		var jsonObj=JSON.parse(data);

		file.close();
		
		return jsonObj;
	}
	
	return null;
}

function importPart(part){
	var file=texgtureFolderPath+part.texture+".png";
	
	// alert(file);
	
	LayerUtil.openFileList([file]);
	
	var currLayer=app.activeDocument.activeLayer;
	
	//fix matrix	
	var bounds = currLayer.bounds;
	var width=bounds[2].as("px")-bounds[0].as("px");
	var height=bounds[3].as("px")-bounds[1].as("px");
	
	// alert(width+","+height);
	
	var matrix=part.matrix;
	
	var tx=-0.5*matrix.c*height - 0.5*matrix.a*width + matrix.tx*fcaScale;
	var ty=-0.5*matrix.d*height - 0.5*matrix.b*width + matrix.ty*fcaScale;
	
	tx+=canvasWidth/2;
	ty+=canvasHeight/2;
	
	matrix.tx=tx;
	matrix.ty=ty;
	
	var transformMatrix=new TransformMatrix(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
		
	transformLayer(currLayer,transformMatrix);
	
}


function getCornersFromLayerBounds( layer )
{
	var bounds = layer.bounds;
	var fCorners = new Array();
	fCorners[0] = new TPoint( bounds[0].as("px"), bounds[1].as("px") );
	fCorners[2] = new TPoint( bounds[2].as("px"), bounds[3].as("px") );
	
	fCorners[1] = new TPoint( fCorners[2].fX, fCorners[0].fY );
	fCorners[3] = new TPoint( fCorners[0].fX, fCorners[2].fY );
	
	return fCorners;
}

function applyConersTransformMaxtrix(corners,matrix){
	for(var i=0;i<corners.length;++i){
		var p=matrix.pointApply(corners[i].fX,corners[i].fY);
		corners[i].fX=p.x;
		corners[i].fY=p.y;
	}
	return corners;
}

function transformActiveLayerWithCorners( newCorners )
{
	function pxToNumber( px )
	{
		return px.as("px");
	}
	
	var saveUnits = app.preferences.rulerUnits;
	app.preferences.rulerUnits = Units.PIXELS;

	var i;
	var setArgs = new ActionDescriptor();
	var chanArg = new ActionReference();
	
	chanArg.putProperty( classChannel, keySelection );
	setArgs.putReference( keyNull, chanArg );
	
	var boundsDesc = new ActionDescriptor();
	var layerBounds = app.activeDocument.activeLayer.bounds;
	boundsDesc.putUnitDouble( keyTop, unitPixels, pxToNumber( layerBounds[1] ) );
	boundsDesc.putUnitDouble( keyLeft, unitPixels, pxToNumber( layerBounds[0] ) );
	boundsDesc.putUnitDouble( keyRight, unitPixels, pxToNumber( layerBounds[2] ) );
	boundsDesc.putUnitDouble( keyBottom, unitPixels, pxToNumber( layerBounds[3] ) );
	
	setArgs.putObject( keyTo, classRectangle, boundsDesc );
	executeAction( eventSet, setArgs );
	
	var result = new ActionDescriptor();
	var args = new ActionDescriptor();
	var quadRect = new ActionList();
	quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[0] ) );	// ActionList put is different from ActionDescriptor put
	quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[1] ) );
	quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[2] ) );
	quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[3] ) );
	
	var quadCorners = new ActionList();
	for (i = 0; i < 4; ++i)
	{
		quadCorners.putUnitDouble( unitPixels, newCorners[i].fX );
		quadCorners.putUnitDouble( unitPixels, newCorners[i].fY );
	}
	args.putList( krectangleStr, quadRect );
	args.putList( kquadrilateralStr, quadCorners );
	executeAction( eventTransform, args );
	
	// Deselect
	deselArgs = new ActionDescriptor();
	deselRef = new ActionReference();
	deselRef.putProperty( classChannel, keySelection );
	deselArgs.putReference( keyNull, deselRef );
	deselArgs.putEnumerated( keyTo, typeOrdinal, enumNone );
	executeAction( eventSet, deselArgs );
	app.preferences.rulerUnits = saveUnits;
}

function transformLayer(layer,matrix){
	
	if(app.activeDocument.activeLayer!=layer){
		app.activeDocument.activeLayer=layer;
	}
	
	var corners=getCornersFromLayerBounds(layer);
	
	applyConersTransformMaxtrix(corners,matrix);
	
	transformActiveLayerWithCorners(corners);
}

function main(){

	var data=getInfoData();
	
	if(!data){
		alert("false");
		return;
	}

	// importPart(data["Hair"]);
	//
	// importPart(data["TorsoBottom"]);
	
	for(var k in data){
		importPart(data[k]);
	}
		
}

main();
