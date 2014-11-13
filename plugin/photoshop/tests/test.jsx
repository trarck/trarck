function replaceLayer(fileRef){
     var desc = new ActionDescriptor();
     desc.putPath( charIDToTypeID( "null" ), new File( fileRef ) );
     executeAction( stringIDToTypeID( "placedLayerReplaceContents" ), desc, DialogModes.NO );
}

// replaceLayer("/Users/duanhouhai/development/trarck/dtcq/fca/temp/heros part 2.1.0/AM/Head.png");

function addLayerFromFile(hdtrDocument,fileRef) {
	var sourceDocument = open(new File( fileRef ));
	app.activeDocument = sourceDocument;
	app.activeDocument.activeLayer.copy();
	app.activeDocument = hdtrDocument;
	hdtrDocument.paste();
	hdtrDocument.activeLayer.name =sourceDocument.name;
	sourceDocument.close();
	return hdtrDocument.activeLayer;
}

// var artLayer=addLayerFromFile(app.activeDocument,"/Users/duanhouhai/development/trarck/dtcq/fca/temp/heros part 2.1.0/AM/Head.png");



// var originalRulerUnits = app.preferences.rulerUnits
// app.preferences.rulerUnits = Units.PIXELS
//
// var newDoc = documents.add(300, 300, 72, 'Imported Layers', NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1);
// var newLayer = newDoc.activeLayer;
// // var doc = open(new File(app.path+"/Presets/Scripts/Stack Scripts Only/P_AutoAlign_Interactive_87x38.png"));
// var doc=open(new File("/Users/duanhouhai/development/trarck/dtcq/fca/temp/heros part 2.1.0/AM/Head.png"));
//
// // alert(doc);
//
//
// app.preferences.rulerUnits = originalRulerUnits

function angleFromMatrix(yy, xy)
{
    var toDegs = 180/Math.PI;
    return Math.atan2(yy, xy) * toDegs - 90;
}

function getActiveLayerRotation()
{
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
    var desc = executeActionGet(ref).getObjectValue(stringIDToTypeID('textKey'))
    if (desc.hasKey(stringIDToTypeID('transform')))
    {
        desc = desc.getObjectValue(stringIDToTypeID('transform'))
        var yy = desc.getDouble(stringIDToTypeID('yy'));
        var xy = desc.getDouble(stringIDToTypeID('xy'));
        return angleFromMatrix(yy, xy);
    }
    return 0;
}

alert(getActiveLayerRotation());