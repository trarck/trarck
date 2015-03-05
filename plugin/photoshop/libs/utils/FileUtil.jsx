var FileUtil={

	makeDirs:function (path) {
	    var folder=new Folder(path);
        if(!folder.exists){
            folder.create();
        }
	}
};