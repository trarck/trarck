var FileUtil={

	makeDirs:function (path) {
	    var folder=new Folder(path);
        if(!folder.exists){
            folder.create();
        }
	},
    getImageFiles:function (sourceFolder) {
        // declare local variables
        var fileArray = new Array();
        var extReg = /\.(?:png|gif|jpg|bmp|tif|psd|tga)$/i;

        // get all files in source folder
        var files = sourceFolder.getFiles();
        for (var i = 0; i <  files.length; i++) {
            var file = files[i];

            // only match files (not folders)
            if (file instanceof File) {
                // store all recognized files into an array
                var fileName = file.name;
                if (fileName.match(extReg)) {
                    fileArray.push(file);
                }
            }
        }

        // return file array
        return fileArray;
    }
};