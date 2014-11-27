var g_StackScriptFolderPath = "/Users/duanhouhai/development/trarck/trarck/plugin/photoshop/libs/math/";//app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/" + localize("$$$/private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");
									
$.evalFile(g_StackScriptFolderPath + "Terminology.jsx");
$.evalFile(g_StackScriptFolderPath + "Geometry.jsx");
$.evalFile(g_StackScriptFolderPath + "GeometryUtil.jsx");
$.evalFile(g_StackScriptFolderPath + "TransformMatrix.jsx");

function transformActiveLayer( newCorners )
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
	var str="";
	for (i = 0; i < 4; ++i)
	{
		str+=newCorners[i].fX +","+newCorners[i].fY+":";
		quadCorners.putUnitDouble( unitPixels, newCorners[i].fX );
		quadCorners.putUnitDouble( unitPixels, newCorners[i].fY );
	}
	alert(str);
	args.putList( krectangleStr, quadRect );
	args.putList( kquadrilateralStr, quadCorners );
	executeAction( eventTransform, args , DialogModes.ALL);
	
	// Deselect
	deselArgs = new ActionDescriptor();
	deselRef = new ActionReference();
	deselRef.putProperty( classChannel, keySelection );
	deselArgs.putReference( keyNull, deselRef );
	deselArgs.putEnumerated( keyTo, typeOrdinal, enumNone );
	executeAction( eventSet, deselArgs );
	app.preferences.rulerUnits = saveUnits;
}

function test1()
{
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(app.charIDToTypeID("Chnl"), app.charIDToTypeID("fsel"));
    desc.putReference(app.charIDToTypeID("null"), ref);
    executeAction(app.charIDToTypeID("Trnf"), desc, DialogModes.ALL);
}

var canvasWidth=2048,canvasHeight=2048;

var width=1379,height=681;

var fCorners = [new TPoint(0,0), new TPoint(width, 0),
						new TPoint(width, height), new TPoint( 0, height) ];
						
var matrix=TransformMatrix.getIdentity();

// matrix.setTranslate(canvasWidth/2,canvasHeight/2);

matrix.setScale(0.5);

matrix.setRotate(geometry.degreesToRadians(30));

for(var i=0;i<4;++i){
	var p=matrix.pointApply(fCorners[i].fX,fCorners[i].fY);
	fCorners[i].fX=p.x;
	fCorners[i].fY=p.y;
}
						
transformActiveLayer(fCorners);

// test1();


