function AnimationImport(doc,fcaScale,registrationPoint){
    this.doc=doc;
    this.lib=doc.library;

    this.textureGroupName="images";
    this.symbolGroupName="bones";
    this.animationGroupName="animations";
    this.fcaScale=fcaScale;
    //"top left"  "top center" "top right" "center left" "center" "center right" "bottom left" "bottom center" "bottom right"
    this.registrationPoint=registrationPoint||"center";
}

AnimationImport.prototype.setRegistrationPoint=function(registrationPoint){
    this.registrationPoint=registrationPoint;
    return this;
};

AnimationImport.prototype.getRegistrationPoint=function(){
    return this.registrationPoint;
};

AnimationImport.prototype.start=function(configFile,imageFolder,configIsConvert){
    var data=this.getConfigData(configFile);
    if(!configIsConvert){
        var convertFca=new ConvertFca(data);
        var actions=convertFca.convertActions();
        data.actions=actions;
    }

    this.importImagesToLibsFromFolder(this.textureGroupName,imageFolder);
    this.convertToSymbols(this.symbolGroupName,data.elements,this.textureGroupName);

//    this.createAnimation(this.animationGroupName,data.actions[8]);
    this.createAnimations(data.actions);
};

AnimationImport.prototype.getConfigData=function(configFile) {
    if(FLfile.exists(configFile)){
        var data=FLfile.read(configFile);
        var jsonObj=JSON.parse(data);

        return jsonObj;
    }
    return null;
};

/**
*
* @param group
* @param elements
* @param parentPath
*/
AnimationImport.prototype.importImagesToLibs=function(group,imagePath,elements){
    if(!this.lib.itemExists(group)){
        //create new one
        this.lib.addNewItem("folder",group);
    }

    imagePath=yh.Path.adjustDirPath(imagePath||"");

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
    if(!this.lib.itemExists(group)) {
        //create new one
        this.lib.addNewItem("folder", group);
    }

    folder=yh.Path.adjustDirPath(folder);

    var files=FLfile.listFolder(folder,"files");

    for(var i in files){
        var file=files[i];

        if(this.isImage(file)){
            var path= folder+file;

            var name=file;//yh.Path.basename(path);

            this.doc.importFile(path,true);
            this.lib.selectItem(name);
            this.lib.moveToFolder(group);
        }
    }

    var dirs=FLfile.listFolder(folder,"directories");
    for(var i in dirs){
        var file=dirs[i];
        this.importImagesToLibsFromFolder(group+"/"+file,folder+file);
    }
};

AnimationImport.prototype.isImage=function(file){
    var ext=yh.Path.extname(file);
    return ext==".png" || ext==".jpg" || ext==".bmp";
};

/**
*
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
    textureGroup=yh.Path.adjustDirPath(textureGroup);

    for(var i in elements){
        var element=elements[i];

        var textureName= element.path?yh.Path.basename(element.path):(element.texture.indexOf(".png")!=-1?element.texture:(element.texture+".png"));
        var texturePath=textureGroup+textureName;

        var symbolName= element.name || yh.Path.basename(element.texture,this.getExtName(element.texture));

        this.lib.selectItem(texturePath);
        this.lib.addItemToDocument({x:0, y:0});
        this.doc.convertToSymbol('movie clip', symbolName, this.registrationPoint);
        this.lib.moveToFolder(group);
        this.doc.deleteSelection();
    }
};

AnimationImport.prototype.createAnimations=function(actions){
    for(var i in actions){
        this.createAnimation(this.animationGroupName,actions[i]);
    }
};

AnimationImport.prototype.createAnimation=function(group,action){
    var timeline=this.createAnimationInLib(group,action.name);

    //add group name to layer element
    var layers=action.layers;
    for(var i in layers){
        layers[i].element=this.symbolGroupName+"/"+layers[i].element;
    }
    //create animation content
    var movieClip=new MovieClip(this.doc,timeline,this.fcaScale);
    movieClip.createContent(layers);
};

AnimationImport.prototype.createAnimationInLib=function(group,name){
    var lib=this.lib;

    var namePath=yh.Path.adjustDirPath(group)+name;
    if(lib.itemExists(namePath)){
        lib.deleteItem(namePath);
    }
    lib.addNewItem('movie clip',namePath);
    lib.editItem(namePath);

    return this.doc.getTimeline();
};