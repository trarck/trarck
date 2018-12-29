var DocumentUtil={

	saveFilePng8:function ( docRef, fileName, options) {
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
		desc4.putBoolean( id13, options.interlaced?true:false );
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
		desc4.putBoolean( id34, options.transparency ?true:false);
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
		desc4.putPath( id44, new File( options.destination + "/" + fileName + ".png") );
		var id45 = stringIDToTypeID( "SaveForWeb" );
		desc3.putObject( id6, id45, desc4 );
		executeAction( id5, desc3, DialogModes.NO );
	},

	saveFilePng24:function ( docRef, fileName, options) {
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
		desc4.putBoolean( id14, options.interlaced ?true:false);
		var id15 = charIDToTypeID( "Trns" );
		desc4.putBoolean( id15, options.transparency ?true:false);
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
        if(options.destination){
            desc4.putPath( id25, new File( options.destination + "/" + fileName + ".png") );
        }else{
            desc4.putPath( id25, new File( fileName ) );
        }
		var id26 = stringIDToTypeID( "SaveForWeb" );
		desc3.putObject( id7, id26, desc4 );
		executeAction( id6, desc3, DialogModes.NO );
	},

	saveFile:function ( docRef, fileName, options) {
		switch (options.fileType) {
			case FileType.Jpeg:
				docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
				var saveFile = new File(options.destination + "/" + fileName + ".jpg");
				jpgSaveOptions = new JPEGSaveOptions();
				jpgSaveOptions.embedColorProfile = options.icc;
				jpgSaveOptions.quality = options.jpegQuality;
				docRef.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);
				break;
			case FileType.Psd:
				var saveFile = new File(options.destination + "/" + fileName + ".psd");
				psdSaveOptions = new PhotoshopSaveOptions();
				psdSaveOptions.embedColorProfile = options.icc;
				psdSaveOptions.maximizeCompatibility = options.psdMaxComp;
				docRef.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
				break;
			case FileType.Tiff:
				var saveFile = new File(options.destination + "/" + fileName + ".tif");
				tiffSaveOptions = new TiffSaveOptions();
				tiffSaveOptions.embedColorProfile = options.icc;
				tiffSaveOptions.imageCompression = options.tiffCompression;
				if (TIFFEncoding.JPEG == options.tiffCompression) {
					tiffSaveOptions.jpegQuality = options.tiffJpegQuality;
				}
				docRef.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
				break;
			case FileType.Pdf:
				if (docRef.bitsPerChannel == BitsPerChannelType.THIRTYTWO)
					docRef.bitsPerChannel = BitsPerChannelType.SIXTEEN;
				var saveFile = new File(options.destination + "/" + fileName + ".pdf");
				pdfSaveOptions = new PDFSaveOptions();
				pdfSaveOptions.embedColorProfile = options.icc;
				pdfSaveOptions.encoding = options.pdfEncoding;
				if (PDFEncoding.JPEG == options.pdfEncoding) {
					pdfSaveOptions.jpegQuality = options.pdfJpegQuality;
				}
				docRef.saveAs(saveFile, pdfSaveOptions, true, Extension.LOWERCASE);
				break;
			case FileType.Targa:
				docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
				var saveFile = new File(options.destination + "/" + fileName + ".tga");
				targaSaveOptions = new TargaSaveOptions();
				targaSaveOptions.resolution = options.targaDepth;
				docRef.saveAs(saveFile, targaSaveOptions, true, Extension.LOWERCASE);
				break;
			case FileType.Bmp:
				docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
				var saveFile = new File(options.destination + "/" + fileName + ".bmp");
				bmpSaveOptions = new BMPSaveOptions();
				bmpSaveOptions.depth = options.bmpDepth;
				docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
				break;
			case FileType.Png8:
				this.saveFilePng8(docRef, fileName, options);
				
				//var saveFile = new File(options.destination + "/" + fileName + ".png");
				//bmpSaveOptions = new BMPSaveOptions();
				//bmpSaveOptions.depth = options.bmpDepth;
				//docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
				break;
			case FileType.Png24:
				this.saveFilePng24(docRef, fileName, options);           
			
				//var saveFile = new File(options.destination + "/" + fileName + ".png");
				//bmpSaveOptions = new BMPSaveOptions();
				//bmpSaveOptions.depth = options.bmpDepth;
				//docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
				break;
			default:
				if ( DialogModes.NO != app.playbackDisplayDialogs ) {
					alert("Unexpected Error:"+options.fileType);
				}
				break;
		}
	}
    
};