
var sourceFolder = Folder.selectDialog('Please select the folder to be imported:', Folder("/e/lua/dtcqtool/fca/temp/hero"));

convertFolder(sourceFolder);

function convertFolder(folder){

	var files = folder.getFiles();

	for(var i in files){
		if(files[i] instanceof Folder){
			convertFolder(files[i]);
		}else{
			convertFile(files[i]);
		}
	}
}

function convertFile(file){
	app.open(file);
	if(app.activeDocument.mode==DocumentMode.INDEXEDCOLOR){
		app.activeDocument.changeMode(ChangeMode.RGB);
		app.activeDocument.save();
	}
	app.activeDocument.close();
}