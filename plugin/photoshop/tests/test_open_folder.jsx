var prefs = new Object();
prefs.sourceFolder         = '~';  // default browse location (default: '~')
prefs.removeFileExtensions = true; // remove filename extensions for imported layers (default: true)
prefs.savePrompt           = false; // display save prompt after import is complete (default: false)
prefs.closeAfterSave       = false; // close import document after saving (default: false)

// prompt for source folder
var sourceFolder = Folder.selectDialog('Please select the folder to be imported:', Folder(prefs.sourceFolder));

alert(sourceFolder);

var files = sourceFolder.getFiles();
alert(files)