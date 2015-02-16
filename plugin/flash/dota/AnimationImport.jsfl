function AnimationImport(doc){
    this.doc=doc;
    this.lib=doc.library;

    this.textureGroupName="images"
    this.symbolGroupName="bones"
    this.animationGroupName="animations"
}

AnimationImport.prototype.start=function(configFile){
    var data=this.getConfigData(configFile);

    this.importElementToLibs(this.textureGroupName,data.elements);

    this.convertToSymbols(this.symbolGroupName,data.elements)

};

AnimationImport.prototype.getConfigData=function(configFilePath) {
    var configFile = new File(configFilePath);//File.openDialog("choose dialog");
    configFile.encoding="BINARY";
    if(configFile.open()){
        var data=configFile.read();
        var jsonObj=JSON.parse(data);

        configFile.close();

        return jsonObj;
    }

    return null;
};

/**
 * 导入图片到库
 * @param group
 * @param elements
 * @param parentPath
 */
AnimationImport.prototype.importImagesToLibs=function(group,imagePath,elements){
    if(!this.lib.itemExists(group)){
        //create new one
        this.lib.addNewItem("folder",group);
    }

    imagePath=yh.Path.checkDirPath(imagePath||"");

    for(var i in elements){
        var element=elements[i];

        var path= element.path?element.path :(imagePath+element.texture);

        var name=yh.Path.basename(path);

        //check itemExists
        if(!this.lib.itemExists(group+"/"+name)){
            this.doc.importFile(path,true);
            this.lib.selectItem(name);
            this.lib.moveToFolder(group);
        }
    }
};

AnimationImport.prototype.importImagesToLibsFromFolder=function(group,folder){
    if(!this.lib.itemExists(group)){
        //create new one
        this.lib.addNewItem("folder",group);
    }

    folder=typeof(folder)=="string"?new Folder(folder):folder;
    var files=folder.getFiles();

    for(var i in files){
        var file=files[i];

        if(file instanceof File){

            var path= file.fullName;

            var name=yh.Path.basename(path);

            this.doc.importFile(path,true);
            this.lib.selectItem(name);
            this.lib.moveToFolder(group);
        }else if(file instanceof Folder){
            this.importImagesToLibsFromFolder(group+"/"+file.name);
        }
    }
};

/**
 * 导入的图片转成元件
 * @param group
 * @param elements
 * @param elementGroup
 */
AnimationImport.prototype.convertToSymbols=function(group,elements,textureGroup){
    if(!this.lib.itemExists(group)){
        //create new one
        this.lib.addNewItem("folder",group);
    }

    textureGroup=textureGroup||"";
    textureGroup=yh.Path.textureGroup(elementGroup);

    for(var i in elements){
        var element=elements[i];

        var textureName= element.path?yh.Path.basename(element.path):element.texture;
        var texturePath=textureGroup+textureName;

        var symbolName= element.name || yh.Path.basename(element.texture,this.getExtName(element.texture));

        this.lib.selectItem(texturePath);
        this.lib.addItemToDocument({x:0, y:0});
        this.doc.convertToSymbol('movie clip', symbolName, "center");
        this.lib.moveToFolder(group);
    }
};

AnimationImport.prototype.createAnimation=function(group,name,data){
    var timeline=this.createAnimationInLib(group,name);
    //create animation content
    var movieClip=new MovieClip(this.doc,timeline);
    movieClip.createContent(data);
};

AnimationImport.prototype.createAnimationInLib=function(group,name){
    var lib=this.lib;

    var namePath=yh.Path.checkDirPath(group)+name;
    lib.deleteItem(namePath);
    lib.addNewItem('movie clip',namePath);
    lib.editItem(namePath);

    return this.doc.getTimeline();
};