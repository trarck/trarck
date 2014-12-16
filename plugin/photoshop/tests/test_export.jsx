var strUnexpectedError = localize("$$$/JavaScripts/ExportLayersToFiles/Unexpected=Unexpected error");
// the drop down list indexes for file type
var bmpIndex = 0; 
var jpegIndex = 1;
var pdfIndex = 2;
var psdIndex = 3;
var targaIndex = 4;
var tiffIndex = 5;
var png8Index = 6; 
var png24Index = 7;

// the drop down list indexes for tiff compression
var compNoneIndex = 0;
var compLZWIndex = 1;
var compZIPIndex = 2;
var compJPEGIndex = 3;

var exportInfo={
    fileNamePrefix:"",
	fileType:png24Index,
	destination:"/e/lua/dtcqtool/fca/work/new_heroes/",
    interlaced:false, 
    transparency:true
};
var doc=app.activeDocument;
var docName = app.activeDocument.name;  // save the app.activeDocument name before duplicate.

var layerCount = doc.layers.length;
var layerSetsCount = doc.layerSets.length;

if ((layerCount <= 1)&&(layerSetsCount <= 0)) {
    if ( DialogModes.NO != app.playbackDisplayDialogs ) {
        alert( strAlertNeedMultipleLayers );
    }
} else {
    app.activeDocument = doc;
    var duppedDocument = app.activeDocument.duplicate();
    duppedDocument.activeLayer = duppedDocument.layers[duppedDocument.layers.length-1]; // for removing
    setInvisibleAllArtLayers(duppedDocument);
    exportChildren(duppedDocument, doc, exportInfo, duppedDocument, exportInfo.fileNamePrefix);
    duppedDocument.close( SaveOptions.DONOTSAVECHANGES );
}

///////////////////////////////////////////////////////////////////////////////
// Function: saveFile
// Usage: the worker routine, take our params and save the file accordingly
// Input: reference to the document, the name of the output file, 
//        export info object containing more information
// Return: <none>, a file on disk
///////////////////////////////////////////////////////////////////////////////
function saveFile( docRef, fileNameBody, exportInfo) {
    switch (exportInfo.fileType) {
        case jpegIndex:
	        docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
            var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".jpg");
            jpgSaveOptions = new JPEGSaveOptions();
            jpgSaveOptions.embedColorProfile = exportInfo.icc;
            jpgSaveOptions.quality = exportInfo.jpegQuality;
            docRef.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);
            break;
        case psdIndex:
            var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".psd");
            psdSaveOptions = new PhotoshopSaveOptions();
            psdSaveOptions.embedColorProfile = exportInfo.icc;
            psdSaveOptions.maximizeCompatibility = exportInfo.psdMaxComp;
            docRef.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
            break;
        case tiffIndex:
            var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".tif");
            tiffSaveOptions = new TiffSaveOptions();
            tiffSaveOptions.embedColorProfile = exportInfo.icc;
            tiffSaveOptions.imageCompression = exportInfo.tiffCompression;
            if (TIFFEncoding.JPEG == exportInfo.tiffCompression) {
				tiffSaveOptions.jpegQuality = exportInfo.tiffJpegQuality;
			}
            docRef.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
            break;
        case pdfIndex:
	    	if (docRef.bitsPerChannel == BitsPerChannelType.THIRTYTWO)
				docRef.bitsPerChannel = BitsPerChannelType.SIXTEEN;
            var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".pdf");
            pdfSaveOptions = new PDFSaveOptions();
            pdfSaveOptions.embedColorProfile = exportInfo.icc;
            pdfSaveOptions.encoding = exportInfo.pdfEncoding;
            if (PDFEncoding.JPEG == exportInfo.pdfEncoding) {
				pdfSaveOptions.jpegQuality = exportInfo.pdfJpegQuality;
			}
            docRef.saveAs(saveFile, pdfSaveOptions, true, Extension.LOWERCASE);
            break;
        case targaIndex:
	    	docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
            var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".tga");
            targaSaveOptions = new TargaSaveOptions();
            targaSaveOptions.resolution = exportInfo.targaDepth;
            docRef.saveAs(saveFile, targaSaveOptions, true, Extension.LOWERCASE);
            break;
        case bmpIndex:
	    	docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
            var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".bmp");
            bmpSaveOptions = new BMPSaveOptions();
            bmpSaveOptions.depth = exportInfo.bmpDepth;
            docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
            break;
        case png8Index:
			saveFile(docRef, fileNameBody, exportInfo, exportInfo.interlaced, exportInfo.transparency);
        	function saveFile( docRef, fileNameBody, exportInfo, interlacedValue, transparencyValue) {
				var id5 = charIDToTypeID( "Expr" );
				var desc3 = new ActionDescriptor();
				var id6 = charIDToTypeID( "Usng" );
				var desc4 = new ActionDescriptor();
				var id7 = charIDToTypeID( "Op  " );
				var id8 = charIDToTypeID( "SWOp" );
				var id9 = charIDToTypeID( "OpSa" );
				desc4.putEnumerated( id7, id8, id9 );
				var id10 = charIDToTypeID( "Fmt " );
				var id11 = charIDToTypeID( "IRFm" );
				var id12 = charIDToTypeID( "PNG8" );
				desc4.putEnumerated( id10, id11, id12 );
				var id13 = charIDToTypeID( "Intr" ); //Interlaced
				desc4.putBoolean( id13, interlacedValue );
				var id14 = charIDToTypeID( "RedA" );
				var id15 = charIDToTypeID( "IRRd" );
				var id16 = charIDToTypeID( "Prcp" ); //Algorithm
				desc4.putEnumerated( id14, id15, id16 );
				var id17 = charIDToTypeID( "RChT" );
				desc4.putBoolean( id17, false );
				var id18 = charIDToTypeID( "RChV" );
				desc4.putBoolean( id18, false );
				var id19 = charIDToTypeID( "AuRd" );
				desc4.putBoolean( id19, false );
				var id20 = charIDToTypeID( "NCol" ); //NO. Of Colors
				desc4.putInteger( id20, 256 );
				var id21 = charIDToTypeID( "Dthr" ); //Dither
				var id22 = charIDToTypeID( "IRDt" );
				var id23 = charIDToTypeID( "Dfsn" ); //Dither type
				desc4.putEnumerated( id21, id22, id23 );
				var id24 = charIDToTypeID( "DthA" );
				desc4.putInteger( id24, 100 );
				var id25 = charIDToTypeID( "DChS" );
				desc4.putInteger( id25, 0 );
				var id26 = charIDToTypeID( "DCUI" );
				desc4.putInteger( id26, 0 );
				var id27 = charIDToTypeID( "DChT" );
				desc4.putBoolean( id27, false );
				var id28 = charIDToTypeID( "DChV" );
				desc4.putBoolean( id28, false );
				var id29 = charIDToTypeID( "WebS" );
				desc4.putInteger( id29, 0 );
				var id30 = charIDToTypeID( "TDth" ); //transparency dither
				var id31 = charIDToTypeID( "IRDt" );
				var id32 = charIDToTypeID( "None" );
				desc4.putEnumerated( id30, id31, id32 );
				var id33 = charIDToTypeID( "TDtA" );
				desc4.putInteger( id33, 100 );
				var id34 = charIDToTypeID( "Trns" ); //Transparency
				desc4.putBoolean( id34, transparencyValue );
				var id35 = charIDToTypeID( "Mtt " );
				desc4.putBoolean( id35, true );		 //matte
				var id36 = charIDToTypeID( "MttR" ); //matte color
				desc4.putInteger( id36, 255 );
				var id37 = charIDToTypeID( "MttG" );
				desc4.putInteger( id37, 255 );
				var id38 = charIDToTypeID( "MttB" );
				desc4.putInteger( id38, 255 );
				var id39 = charIDToTypeID( "SHTM" );
				desc4.putBoolean( id39, false );
				var id40 = charIDToTypeID( "SImg" );
				desc4.putBoolean( id40, true );
				var id41 = charIDToTypeID( "SSSO" );
				desc4.putBoolean( id41, false );
				var id42 = charIDToTypeID( "SSLt" );
				var list1 = new ActionList();
				desc4.putList( id42, list1 );
				var id43 = charIDToTypeID( "DIDr" );
				desc4.putBoolean( id43, false );
				var id44 = charIDToTypeID( "In  " );
				desc4.putPath( id44, new File( exportInfo.destination + "/" + fileNameBody + ".png") );
				var id45 = stringIDToTypeID( "SaveForWeb" );
				desc3.putObject( id6, id45, desc4 );
				executeAction( id5, desc3, DialogModes.NO );
			}
            //var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".png");
            //bmpSaveOptions = new BMPSaveOptions();
            //bmpSaveOptions.depth = exportInfo.bmpDepth;
            //docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
            break;
        case png24Index:
        	saveFile(docRef, fileNameBody, exportInfo, exportInfo.interlaced, exportInfo.transparency);
        	function saveFile( docRef, fileNameBody, exportInfo, interlacedValue, transparencyValue) {
				var id6 = charIDToTypeID( "Expr" );
				var desc3 = new ActionDescriptor();
				var id7 = charIDToTypeID( "Usng" );
				var desc4 = new ActionDescriptor();
				var id8 = charIDToTypeID( "Op  " );
				var id9 = charIDToTypeID( "SWOp" );
				var id10 = charIDToTypeID( "OpSa" );
				desc4.putEnumerated( id8, id9, id10 );
				var id11 = charIDToTypeID( "Fmt " );
				var id12 = charIDToTypeID( "IRFm" );
				var id13 = charIDToTypeID( "PN24" );
				desc4.putEnumerated( id11, id12, id13 );
				var id14 = charIDToTypeID( "Intr" );
				desc4.putBoolean( id14, interlacedValue );
				var id15 = charIDToTypeID( "Trns" );
				desc4.putBoolean( id15, transparencyValue );
				var id16 = charIDToTypeID( "Mtt " );
				desc4.putBoolean( id16, true );
				var id17 = charIDToTypeID( "MttR" );
				desc4.putInteger( id17, 255 );
				var id18 = charIDToTypeID( "MttG" );
				desc4.putInteger( id18, 255 );
				var id19 = charIDToTypeID( "MttB" );
				desc4.putInteger( id19, 255 );
				var id20 = charIDToTypeID( "SHTM" );
				desc4.putBoolean( id20, false );
				var id21 = charIDToTypeID( "SImg" );
				desc4.putBoolean( id21, true );
				var id22 = charIDToTypeID( "SSSO" );
				desc4.putBoolean( id22, false );
				var id23 = charIDToTypeID( "SSLt" );
				var list1 = new ActionList();
				desc4.putList( id23, list1 );
				var id24 = charIDToTypeID( "DIDr" );
				desc4.putBoolean( id24, false );
				var id25 = charIDToTypeID( "In  " );
				desc4.putPath( id25, new File( exportInfo.destination + "/" + fileNameBody + ".png") );
				var id26 = stringIDToTypeID( "SaveForWeb" );
				desc3.putObject( id7, id26, desc4 );
				executeAction( id6, desc3, DialogModes.NO );
			}
        
            //var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".png");
            //bmpSaveOptions = new BMPSaveOptions();
            //bmpSaveOptions.depth = exportInfo.bmpDepth;
            //docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
            break;
        default:
            if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                alert(strUnexpectedError);
            }
            break;
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: zeroSuppress
// Usage: return a string padded to digit(s)
// Input: num to convert, digit count needed
// Return: string padded to digit length
///////////////////////////////////////////////////////////////////////////////
function zeroSuppress (num, digit) {
    var tmp = num.toString();
    while (tmp.length < digit) {
		tmp = "0" + tmp;
	}
    return tmp;
}

function setInvisibleAllArtLayers(obj) {
    for( var i = 0; i < obj.artLayers.length; i++) {
        obj.artLayers[i].allLocked = false;
        obj.artLayers[i].visible = false;
    }
    for( var i = 0; i < obj.layerSets.length; i++) {
        setInvisibleAllArtLayers(obj.layerSets[i]);
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: setInvisibleAllArtLayers
// Usage: unlock and make invisible all art layers, recursively
// Input: document or layerset
// Return: all art layers are unlocked and invisible
///////////////////////////////////////////////////////////////////////////////
function setInvisibleAllArtLayers(obj) {
    for( var i = 0; i < obj.artLayers.length; i++) {
        obj.artLayers[i].allLocked = false;
        obj.artLayers[i].visible = false;
    }
    for( var i = 0; i < obj.layerSets.length; i++) {
        setInvisibleAllArtLayers(obj.layerSets[i]);
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: removeAllInvisibleArtLayers
// Usage: remove all the invisible art layers, recursively
// Input: document or layer set
// Return: <none>, all layers that were invisible are now gone
///////////////////////////////////////////////////////////////////////////////
function removeAllInvisibleArtLayers(obj) {
    for( var i = obj.artLayers.length-1; 0 <= i; i--) {
        try {
            if(!obj.artLayers[i].visible) {
				obj.artLayers[i].remove();
			}
        } 
        catch (e) {
        }
    }
    for( var i = obj.layerSets.length-1; 0 <= i; i--) {
        removeAllInvisibleArtLayers(obj.layerSets[i]);
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: removeAllEmptyLayerSets
// Usage: find all empty layer sets and remove them, recursively
// Input: document or layer set
// Return: empty layer sets are now gone
///////////////////////////////////////////////////////////////////////////////
function removeAllEmptyLayerSets(obj) {
    var foundEmpty = true;
    for( var i = obj.layerSets.length-1; 0 <= i; i--) {
        if( removeAllEmptyLayerSets(obj.layerSets[i])) {
            obj.layerSets[i].remove();
        } else {
            foundEmpty = false;
        }
    }
    if (obj.artLayers.length > 0) {
		foundEmpty = false;
	}
    return foundEmpty;
}


///////////////////////////////////////////////////////////////////////////////
// Function: zeroSuppress
// Usage: return a string padded to digit(s)
// Input: num to convert, digit count needed
// Return: string padded to digit length
///////////////////////////////////////////////////////////////////////////////
function removeAllInvisible(docRef) {
    removeAllInvisibleArtLayers(docRef);
    removeAllEmptyLayerSets(docRef);
}

function exportChildren(dupObj, orgObj, exportInfo, dupDocRef, fileNamePrefix) {
    for( var i = 0; i < dupObj.artLayers.length; i++) {
        if (exportInfo.visibleOnly) { // visible layer only
            if (!orgObj.artLayers[i].visible) {
				continue;
			}
        }
        dupObj.artLayers[i].visible = true;

        var layerName = dupObj.artLayers[i].name;  // store layer name before change doc
        var duppedDocumentTmp = dupDocRef.duplicate();
        if ((psdIndex == exportInfo.fileType)||(png24Index == exportInfo.fileType)||(png8Index == exportInfo.fileType)) { // PSD: Keep transparency
            removeAllInvisible(duppedDocumentTmp);

            //PNGFileOptions
  		    if ((png24Index == exportInfo.fileType)||(png8Index == exportInfo.fileType)) { // PNGFileOptions
				if ((png8Index == exportInfo.fileType)) { //transparancy checked?
					
					if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
					
						app.activeDocument.trim(TrimType.TRANSPARENT);
						
					}
					
				}
				if ((png24Index == exportInfo.fileType)) { //transparancy checked?
					
					if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
					
						app.activeDocument.trim(TrimType.TRANSPARENT);
						
					}
					
				}
            }
        } else { // just flatten
            duppedDocumentTmp.flatten();
        }
        var fileNameBody = fileNamePrefix;
        fileNameBody += "_" + zeroSuppress(i, 4);
        fileNameBody += "_" + layerName;
        fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|]/g, "_");  // '/\:*?"<>|' -> '_'
        if (fileNameBody.length > 120) {
			fileNameBody = fileNameBody.substring(0,120);
		}
        saveFile(duppedDocumentTmp, fileNameBody, exportInfo);
        duppedDocumentTmp.close(SaveOptions.DONOTSAVECHANGES);

        dupObj.artLayers[i].visible = false;
    }
    for( var i = 0; i < dupObj.layerSets.length; i++) {
        if (exportInfo.visibleOnly) { // visible layer only
            if (!orgObj.layerSets[i].visible) {
				continue;
			}
        }
        var fileNameBody = fileNamePrefix;
        fileNameBody += "_" + zeroSuppress(i, 4) + "s";
        exportChildren(dupObj.layerSets[i], orgObj.layerSets[i], exportInfo, dupDocRef, fileNameBody);  // recursive call
    }
}