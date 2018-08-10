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
       
        zeroPad:function  (num, digit) {
            var tmp = num.toString();
            while (tmp.length < digit) {
                tmp = "0" + tmp;
            }
            return tmp;
        },
		
		exportChild:function(layer,doc,options,fileNamePrefix){
			layer.visible=true;
			
			var layerName = layer.name;  // store layer name before change doc
			var duppedDocumentTmp = doc.duplicate();
			
			if ((FileType.Psd == options.fileType)||(FileType.Png24 == options.fileType)||(FileType.Png8 == options.fileType)) { // PSD: Keep transparency
				
				LayerHelper.removeAllInvisible(duppedDocumentTmp);

				//this.parseLayer(duppedDocumentTmp.activeLayer,duppedDocumentTmp);

				//PNGFileOptions
				if ((FileType.Png24 == options.fileType)||(FileType.Png8 == options.fileType)) { // PNGFileOptions
					if ((FileType.Png8 == options.fileType)) { //transparancy checked?
						
						if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
						
							app.activeDocument.trim(TrimType.TRANSPARENT);
							
						}
						
					}
					if ((FileType.Png24 == options.fileType)) { //transparancy checked?
						
						if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
						
							app.activeDocument.trim(TrimType.TRANSPARENT);
							
						}
						
					}
				}
			
				
			
			} else { // just flatten
				duppedDocumentTmp.flatten();
			}
		
			var fileName ="";
			
			if(options.createLayerFileName){
				fileName=options.createLayerFileName(layerName,layer,layerIndex);
			}else{
				fileName=fileNamePrefix;
				//fileName += "_" + zeroPad(i, 4);
				fileName += layerName;//"_" + layerName;
			}

			fileName = fileName.replace(/[:\/\\*\?\"\<\>\|]/g, "_");  // '/\:*?"<>|' -> '_'
			/*
				if (fileName.length > 120) {
					fileName = fileName.substring(0,120);
				}
				*/
		
			DocumentUtil.saveFile(duppedDocumentTmp, fileName, options);
			duppedDocumentTmp.close(SaveOptions.DONOTSAVECHANGES);
			
			layer.visible=false;
		},
    
        exportChildren:function (dupObj, orgObj, options, dupDocRef, fileNamePrefix) {
            for( var i = 0; i < dupObj.artLayers.length; i++) {
                if (options.visibleOnly) { // visible layer only
                    if (!orgObj.artLayers[i].visible) {
                        continue;
                    }
                }

                if(!this.checkLayerExportAble(dupObj.artLayers[i])){
                    continue;
                }

                this.exportChild(dupObj.artLayers[i],dupDocRef,options,fileNamePrefix);
            }
        
            for( var i = 0; i < dupObj.layerSets.length; i++) {
                if (options.visibleOnly) { // visible layer only
                    if (!orgObj.layerSets[i].visible) {
                        continue;
                    }
                }
                var fileName= "";
                if(options.createLayerSetPrefixName){
                    fileName=options.createLayerSetPrefixName(dupObj.layerSets[i]);
                }else{
                    fileName=fileNamePrefix;
                    fileName += "";//"_" + zeroPad(i, 4) + "s";
                }
    
                this.exportChildren(dupObj.layerSets[i], orgObj.layerSets[i], options, dupDocRef, fileName);  // recursive call
            }
        },
    
        exportDocument:function(doc,options){

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
                LayerHelper.hideAllArtLayers(duppedDocument);
                this.exportChildren(duppedDocument, doc, options, duppedDocument, options.fileNamePrefix);
                duppedDocument.close( SaveOptions.DONOTSAVECHANGES );
            }
        },
		
		exportLayer:function(layer,doc,options){
			app.activeDocument = doc;
			var duppedDocument = doc.duplicate();
			var dumpLayer=null;
			for(var i=0;i<doc.layers.length;++i){
				if(doc.layers[i]==layer){
					dumpLayer=duppedDocument.layers[i];
					duppedDocument.activeLayer =dumpLayer;					
				}
			}
			
			if(dumpLayer!=null){
				LayerHelper.hideAllArtLayers(duppedDocument);				
				this.exportChild(dumpLayer,duppedDocument,options,"");
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



