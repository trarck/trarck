var g_StackScriptFolderPath = "/Users/duanhouhai/development/trarck/trarck/plugin/photoshop/libs/math/";//app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/" + localize("$$$/private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");
                                    
/*$.evalFile(g_StackScriptFolderPath + "Terminology.jsx");
$.evalFile(g_StackScriptFolderPath + "Geometry.jsx");
$.evalFile(g_StackScriptFolderPath + "GeometryUtil.jsx");
$.evalFile(g_StackScriptFolderPath + "TransformMatrix.jsx");
*/
function makeSelection(x,y,sw,sh){
    app.activeDocument.selection.select([ [x,y], [x,y+sh], [x+sw,y+sh], [x+sw,y] ]);  
}

function testCrop(x,y,sw,sh){
    app.activeDocument.crop([x,y,x+sw,y+sh ]);  
}


// makeSelection(74,176,296,157);
testCrop(74,176,296,157);

// var idslct = charIDToTypeID( "slct" );
    // var desc68 = new ActionDescriptor();
    // var idnull = charIDToTypeID( "null" );
        // var ref45 = new ActionReference();
        // var idChnl = charIDToTypeID( "Chnl" );
        // var idChnl = charIDToTypeID( "Chnl" );
        // var idRGB = charIDToTypeID( "RGB " );
        // ref45.putEnumerated( idChnl, idChnl, idRGB );
    // desc68.putReference( idnull, ref45 );
// executeAction( idslct, desc68, DialogModes.NO );

// var idcopy = charIDToTypeID( "copy" );
// executeAction( idcopy, undefined, DialogModes.NO );

// documents.add(296, 157, 72, "myDocument", NewDocumentMode.RGB)