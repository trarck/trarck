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
       
        zeroSuppress:function  (num, digit) {
            var tmp = num.toString();
            while (tmp.length < digit) {
                tmp = "0" + tmp;
            }
            return tmp;
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

                dupObj.artLayers[i].visible = true;

                var layerName = dupObj.artLayers[i].name;  // store layer name before change doc
                var duppedDocumentTmp = dupDocRef.duplicate();
                if ((FileType.Psd == options.fileType)||(FileType.Png24 == options.fileType)||(FileType.Png8 == options.fileType)) { // PSD: Keep transparency
                    
                    LayerHelper.removeAllInvisible(duppedDocumentTmp);

                    this.parseLayer(duppedDocumentTmp.activeLayer,duppedDocumentTmp);

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
            
                var fileNameBody ="";
                
                if(options.createLayerFileName){
                    fileNameBody=options.createLayerFileName(layerName,i,dupObj.artLayers[i]);
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
            
                DocumentUtil.saveFile(duppedDocumentTmp, fileNameBody, options);
                duppedDocumentTmp.close(SaveOptions.DONOTSAVECHANGES);

                dupObj.artLayers[i].visible = false;
            }
        
            for( var i = 0; i < dupObj.layerSets.length; i++) {
                if (options.visibleOnly) { // visible layer only
                    if (!orgObj.layerSets[i].visible) {
                        continue;
                    }
                }
                var fileNameBody = "";
                if(options.createLayerSetPrefixName){
                    fileNameBody=options.createLayerSetPrefixName(i,dupObj.layerSets[i]);
                }else{
                    fileNameBody=fileNamePrefix;
                    fileNameBody += "";//"_" + zeroSuppress(i, 4) + "s";
                }
    
                this.exportChildren(dupObj.layerSets[i], orgObj.layerSets[i], options, dupDocRef, fileNameBody);  // recursive call
            }
        },
    
        start:function(doc,options){

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
                LayerHelper.setInvisibleAllArtLayers(duppedDocument);
                this.exportChildren(duppedDocument, doc, options, duppedDocument, options.fileNamePrefix);
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



