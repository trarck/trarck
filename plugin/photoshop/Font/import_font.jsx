if($.os.indexOf("Macintosh OS")>-1){
	//mac os
	var g_LibsScriptFolderPath = "/Users/duanhouhai/development/trarck/trarck/plugin/photoshop/libs/";
	var fontFolderPath="/Users/duanhouhai/development/trarck/dtcq/fca/temp/json/"
	var psdFolderPath = "/Users/duanhouhai/development/trarck/dtcq/fca/temp/psd/";
}else{
	//windows
	var g_LibsScriptFolderPath = "/e/trarck/plugin/photoshop/libs/";
	var fontFolderPath="/e/temp/score_numbers/"
	var psdFolderPath = "/e/lua/dtcqtool/fca/temp/psd/";
}

$.evalFile(g_LibsScriptFolderPath + "utils/LayerUtil.jsx");

var canvasWidth=1024;
var canvasHeight=128;
var padding=1;
var itemWidth=97;

function moveLayerTo(fLayer,x,y) {

 // var bounds = fLayer.bounds;
 // X = X- BOUNDS[0].AS("PX");;
 // Y = Y - BOUNDS[1].AS("PX");;
    
  fLayer.translate(x+" px",y+" px");
}

function importFontFile(fontFile,index){
	
	LayerUtil.openFileList([fontFile]);
	
	var currLayer=app.activeDocument.activeLayer;
	
	//fix matrix	
	moveLayerTo(currLayer,index*(itemWidth+padding),0);
	
	//currLayer.translate("100 px",0);

   // var bounds = currLayer.bounds;
	//var width=bounds[2].as("px")-bounds[0].as("px");
	//var height=bounds[3].as("px")-bounds[1].as("px");

   // alert(bounds[0])
}


function importFontFiles(){
	var fontFolder = Folder.selectDialog('Please select the folder to be imported:', Folder(fontFolderPath));
	var fontFiles=fontFolder.getFiles();

	for(var i in fontFiles){
		var fontFile=fontFiles[i].toString();
		if(fontFile.indexOf(".png")>0){
            importFontFile(fontFile,i);
        }

        //return;
	}
}

function importFromFontFolder(){
    var startRulerUnits = app.preferences.rulerUnits
    var startTypeUnits = app.preferences.typeUnits
    var startDisplayDialogs = app.displayDialogs

    app.preferences.rulerUnits = Units.PIXELS
    app.preferences.typeUnits = TypeUnits.PIXELS
    //app.displayDialogs = DialogModes.NO

    var currentDoc=app.documents.add(canvasWidth, canvasHeight,72, "FontDoc", NewDocumentMode.RGB,DocumentFill.TRANSPARENT);

    importFontFiles();

	//currentDoc.saveAs(new File(psdFolderPath+name+".psd"));
	//currentDoc.close();

    app.preferences.rulerUnits = startRulerUnits
    app.preferences.typeUnits = startTypeUnits
    app.displayDialogs = startDisplayDialogs
}

function selectChaFileAndTexturePath(){
	var chaFile=File.openDialog("choose a cha file");
	var textureFolder = Folder.selectDialog('Please select the folder of texture:',Folder(texgtureFolderPath+"Troll"));
	importFromFileAndTexturePath(chaFile,textureFolder.fullName+"/",textureFolder.name);
}

function main(){

	importFromFontFolder();
	// selectChaFileAndTexturePath();
}

main();
