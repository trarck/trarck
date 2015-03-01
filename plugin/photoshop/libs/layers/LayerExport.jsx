var LayerExport;
(function(){
    var FileType={
        Bmp: 0,
        Jpeg: 1,
        Pdf: 2,
        Psd: 3,
        Targa: 4,
        Tiff: 5,
        Png8: 6, 
        Png24: 7
    };

    var Compression={
        compNone: 0,
        compLZW: 1,
        compZIP: 2,
        compJPEG: 3
    };
    
    LayerExport=function(){
    
    };

    LayerExport.FileType=FileType;

    LayerExport.FileType=FileType;

    LayerExport.prototype={
        
        FileType:FileType,
        
        Compression:Compression,
        
        saveFilePng8:function ( docRef, fileNameBody, exportInfo) {
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
            desc4.putBoolean( id13, exportInfo.interlaced );
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
            desc4.putBoolean( id34, exportInfo.transparency );
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
        },
    
        saveFilePng24:function ( docRef, fileNameBody, exportInfo) {
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
            desc4.putBoolean( id14, exportInfo.interlaced );
            var id15 = charIDToTypeID( "Trns" );
            desc4.putBoolean( id15, exportInfo.transparency );
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
        },
    
        saveFile:function ( docRef, fileNameBody, exportInfo) {
            switch (exportInfo.fileType) {
                case FileType.Jpeg:
                    docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
                    var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".jpg");
                    jpgSaveOptions = new JPEGSaveOptions();
                    jpgSaveOptions.embedColorProfile = exportInfo.icc;
                    jpgSaveOptions.quality = exportInfo.jpegQuality;
                    docRef.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);
                    break;
                case FileType.Psd:
                    var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".psd");
                    psdSaveOptions = new PhotoshopSaveOptions();
                    psdSaveOptions.embedColorProfile = exportInfo.icc;
                    psdSaveOptions.maximizeCompatibility = exportInfo.psdMaxComp;
                    docRef.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
                    break;
                case FileType.Tiff:
                    var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".tif");
                    tiffSaveOptions = new TiffSaveOptions();
                    tiffSaveOptions.embedColorProfile = exportInfo.icc;
                    tiffSaveOptions.imageCompression = exportInfo.tiffCompression;
                    if (TIFFEncoding.JPEG == exportInfo.tiffCompression) {
                        tiffSaveOptions.jpegQuality = exportInfo.tiffJpegQuality;
                    }
                    docRef.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
                    break;
                case FileType.Pdf:
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
                case FileType.Targa:
                    docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
                    var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".tga");
                    targaSaveOptions = new TargaSaveOptions();
                    targaSaveOptions.resolution = exportInfo.targaDepth;
                    docRef.saveAs(saveFile, targaSaveOptions, true, Extension.LOWERCASE);
                    break;
                case FileType.Bmp:
                    docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
                    var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".bmp");
                    bmpSaveOptions = new BMPSaveOptions();
                    bmpSaveOptions.depth = exportInfo.bmpDepth;
                    docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
                    break;
                case FileType.Png8:
                    this.saveFilePng8(docRef, fileNameBody, exportInfo);
                    
                    //var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".png");
                    //bmpSaveOptions = new BMPSaveOptions();
                    //bmpSaveOptions.depth = exportInfo.bmpDepth;
                    //docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
                    break;
                case FileType.Png24:
                    this.saveFilePng24(docRef, fileNameBody, exportInfo);           
                
                    //var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".png");
                    //bmpSaveOptions = new BMPSaveOptions();
                    //bmpSaveOptions.depth = exportInfo.bmpDepth;
                    //docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
                    break;
                default:
                    if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                        alert("Unexpected Error:"+exportInfo.fileType);
                    }
                    break;
            }
        },
    
        zeroSuppress:function  (num, digit) {
            var tmp = num.toString();
            while (tmp.length < digit) {
                tmp = "0" + tmp;
            }
            return tmp;
        },
    
        setInvisibleAllArtLayers:function (obj) {
            for( var i = 0; i < obj.artLayers.length; i++) {
                obj.artLayers[i].allLocked = false;
                obj.artLayers[i].visible = false;
            }
            for( var i = 0; i < obj.layerSets.length; i++) {
                this.setInvisibleAllArtLayers(obj.layerSets[i]);
            }
        },
    
        setInvisibleAllArtLayers:function (obj) {
            for( var i = 0; i < obj.artLayers.length; i++) {
                obj.artLayers[i].allLocked = false;
                obj.artLayers[i].visible = false;
            }
            for( var i = 0; i < obj.layerSets.length; i++) {
                this.setInvisibleAllArtLayers(obj.layerSets[i]);
            }
        },
    
        removeAllInvisibleArtLayers:function (obj) {
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
                this.removeAllInvisibleArtLayers(obj.layerSets[i]);
            }
        },
    
        removeAllEmptyLayerSets:function (obj) {
            var foundEmpty = true;
            for( var i = obj.layerSets.length-1; 0 <= i; i--) {
                if( this.removeAllEmptyLayerSets(obj.layerSets[i])) {
                    obj.layerSets[i].remove();
                } else {
                    foundEmpty = false;
                }
            }
            if (obj.artLayers.length > 0) {
                foundEmpty = false;
            }
            return foundEmpty;
        },
    
        removeAllInvisible:function (docRef) {
            this.removeAllInvisibleArtLayers(docRef);
            this.removeAllEmptyLayerSets(docRef);
        },
    
        exportChildren:function (dupObj, orgObj, exportInfo, dupDocRef, fileNamePrefix) {
            for( var i = 0; i < dupObj.artLayers.length; i++) {
                if (exportInfo.visibleOnly) { // visible layer only
                    if (!orgObj.artLayers[i].visible) {
                        continue;
                    }
                }

                if(!this.checkLayerExportAble(dupObj.artLayers[i])){
                    continue;
                }

                dupObj.artLayers[i].visible = true;

                var layerName = dupObj.artLayers[i].name;  // store layer name before change doc
                var duppedDocumentTmp = dupDocRef.duplicate();
                if ((FileType.Psd == exportInfo.fileType)||(FileType.Png24 == exportInfo.fileType)||(FileType.Png8 == exportInfo.fileType)) { // PSD: Keep transparency
                    
                    this.removeAllInvisible(duppedDocumentTmp);

                    this.parseLayer(duppedDocumentTmp.activeLayer,duppedDocumentTmp);

                    //PNGFileOptions
                    if ((FileType.Png24 == exportInfo.fileType)||(FileType.Png8 == exportInfo.fileType)) { // PNGFileOptions
                        if ((FileType.Png8 == exportInfo.fileType)) { //transparancy checked?
                            
                            if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
                            
                                app.activeDocument.trim(TrimType.TRANSPARENT);
                                
                            }
                            
                        }
                        if ((FileType.Png24 == exportInfo.fileType)) { //transparancy checked?
                            
                            if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
                            
                                app.activeDocument.trim(TrimType.TRANSPARENT);
                                
                            }
                            
                        }
                    }
                
                    
                
                } else { // just flatten
                    duppedDocumentTmp.flatten();
                }
            
                var fileNameBody ="";
                
                if(exportInfo.createLayerFileName){
                    fileNameBody=exportInfo.createLayerFileName(layerName,i,dupObj.artLayers[i]);
                }else{
                    fileNameBody=fileNamePrefix;
                    //fileNameBody += "_" + zeroSuppress(i, 4);
                    fileNameBody += layerName;//"_" + layerName;
                }

                fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|]/g, "_");  // '/\:*?"<>|' -> '_'
                /*
                    if (fileNameBody.length > 120) {
                        fileNameBody = fileNameBody.substring(0,120);
                    }
                    */
            
                this.saveFile(duppedDocumentTmp, fileNameBody, exportInfo);
                duppedDocumentTmp.close(SaveOptions.DONOTSAVECHANGES);

                dupObj.artLayers[i].visible = false;
            }
        
            for( var i = 0; i < dupObj.layerSets.length; i++) {
                if (exportInfo.visibleOnly) { // visible layer only
                    if (!orgObj.layerSets[i].visible) {
                        continue;
                    }
                }
                var fileNameBody = "";
                if(exportInfo.createLayerSetPrefixName){
                    fileNameBody=exportInfo.createLayerSetPrefixName(i,dupObj.layerSets[i]);
                }else{
                    fileNameBody=fileNamePrefix;
                    fileNameBody += "";//"_" + zeroSuppress(i, 4) + "s";
                }
    
                this.exportChildren(dupObj.layerSets[i], orgObj.layerSets[i], exportInfo, dupDocRef, fileNameBody);  // recursive call
            }
        },
    
        start:function(doc,exportInfo){

            var docName = doc.name;  // save the app.activeDocument name before duplicate.

            var layerCount = doc.layers.length;
            var layerSetsCount = doc.layerSets.length;

            if ((layerCount <= 1)&&(layerSetsCount <= 0)) {
                if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                    alert( "NeedMultipleLayers" );
                }
            } else {
                app.activeDocument = doc;
                var duppedDocument = doc.duplicate();
                duppedDocument.activeLayer = duppedDocument.layers[duppedDocument.layers.length-1]; // for removing
                this.setInvisibleAllArtLayers(duppedDocument);
                this.exportChildren(duppedDocument, doc, exportInfo, duppedDocument, exportInfo.fileNamePrefix);
                duppedDocument.close( SaveOptions.DONOTSAVECHANGES );
            }
        },
    
        //对layer进行处理
        parseLayer:function(layer,doc){
            
        },

        checkLayerExportAble:function(layer){
            return true;
        }
    };    
})();



