
if($.os.indexOf("Macintosh OS")>-1){
	//mac os
	var g_LibsScriptFolderPath = "/Users/duanhouhai/development/trarck/trarck/plugin/photoshop/libs/";
	var texgtureFolderPath = "/Users/duanhouhai/development/trarck/dtcq/fca/temp/hero/";
	var jsonFolderPath="/Users/duanhouhai/development/trarck/dtcq/fca/temp/json/"
	var psdFolderPath = "/Users/duanhouhai/development/trarck/dtcq/fca/temp/psd/";
}else{
	//windows
	var g_LibsScriptFolderPath = "/d/trarck/plugin/photoshop/libs/";
	var texgtureFolderPath = "/e/lua/dtcqtool/fca/temp/hero/";
	var jsonFolderPath="/e/lua/dtcqtool/fca/temp/json/"
	var psdFolderPath = "/e/lua/dtcqtool/fca/temp/psd/";
}


$.evalFile(g_LibsScriptFolderPath + "math/Terminology.jsx");
$.evalFile(g_LibsScriptFolderPath + "math/Geometry.jsx");
$.evalFile(g_LibsScriptFolderPath + "math/GeometryUtil.jsx");
$.evalFile(g_LibsScriptFolderPath + "math/TransformMatrix.jsx");

$.evalFile(g_LibsScriptFolderPath + "json2.jsx");
$.evalFile(g_LibsScriptFolderPath + "utils/LayerUtil.jsx");


var fcaScale=0.111;
var canvasWidth=1500;
var canvasHeight=1200;

function getInfoData(infoFile) {
	//var file = new File(g_LibsScriptFolderPath+"../tests/cha.json");//File.openDialog("choose dialog");
	infoFile.encoding="BINARY";
	if(infoFile.open()){
		var data=infoFile.read();
		var jsonObj=JSON.parse(data);

		infoFile.close();
		
		return jsonObj;
	}
	
	return null;
}

function importPart(part,texturePath){
	var file=texturePath+part.texture+".png";
	
//	alert(file);
	
	LayerUtil.openFileList([file]);
	
	var currLayer=app.activeDocument.activeLayer;
//
//	alert(currLayer);
//	return;
	
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
		
//	alert(transformMatrix.a+","+transformMatrix.b+","+transformMatrix.c+","+transformMatrix.d+","+transformMatrix.tx+","+transformMatrix.ty);

//	alert(currLayer);

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

function importFromFileAndTexturePath(file,texturePath,name){
	
	var currentDoc=app.documents.add(canvasWidth, canvasHeight,72, "boneDoc", NewDocumentMode.RGB,DocumentFill.TRANSPARENT);

	var data=getInfoData(file);
	
	if(!data){
		alert("false");
		return;
	}
	
	for(var k in data){
		importPart(data[k],texturePath);
	}

	currentDoc.saveAs(new File(psdFolderPath+name+".psd"));
	currentDoc.close();
}

function importFromFileAndName(file,name){
	file=file instanceof File ?file:new File(file);
	var texturePath=texgtureFolderPath+name+"/";
	importFromFileAndTexturePath(file,texturePath,name);
}

function importFromChaFolder(){
	var jsonFolder = Folder.selectDialog('Please select the folder to be imported:', Folder(jsonFolderPath));
	var boneFolders=jsonFolder.getFiles();

	for(var i in boneFolders){
		var boneFolder=boneFolders[i];
		importFromFileAndName((boneFolder.getFiles())[0],boneFolder.name);
	}
}

function selectChaFileAndTexturePath(){
	var chaFile=File.openDialog("choose a cha file");
	var textureFolder = Folder.selectDialog('Please select the folder of texture:',Folder(texgtureFolderPath+"Troll"));
	importFromFileAndTexturePath(chaFile,textureFolder.fullName+"/",textureFolder.name);
}

function main(){

//	//create a new doc if no document
//	if(app.documents.length){
//		currentDoc=app.activeDocument;
//	}else{
//		currentDoc=app.documents.add(canvasWidth, canvasHeight,72, "boneDoc", NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
//	}

	importFromChaFolder();
	// selectChaFileAndTexturePath();
}

main();
