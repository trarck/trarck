function AnimationExport(doc){
    this.doc=doc;
    this.lib=doc.library;

    this.textureGroupName="images";
    this.symbolGroupName="bones";
    this.animationGroupName="am";//"animations";
}

AnimationExport.prototype.start=function(outFile,outImageFolder,name){

    this.exportImagesToFolder(this.textureGroupName,outImageFolder);

    var characters=this.generateCharacters(this.symbolGroupName);
    this._charactersMap=this.generateCharactersMap(characters);
    var actions=this.generateAnimations(this.animationGroupName);

    this.writeExportData(outFile,{
        name:name||this.doc.name,
        elements:characters,
        actions:actions
    });
};

AnimationExport.prototype.writeExportData=function(outFile,data) {
    var jsonString=JSON.stringify(data,null,4);
    var dirPath=yh.Path.dirname(outFile);
    if(!FLfile.exists(dirPath)){
        FLfile.createFolder(dirPath);
    }

    FLfile.write(outFile,jsonString);

    var dirPaht=yh.Path.dirname(outFile);
    FLfile.write(dirPaht+"/t.js","var d="+jsonString+";");
};

/**
*
* @param group
* @param elements
* @param parentPath
*/
AnimationExport.prototype.exportImagesAsSpriteSheet=function(group,spriteSheetFile){
    if(!this.lib.itemExists(group)){
        //create new one
        return;
    }
};

AnimationExport.prototype.exportImagesToFolder=function(group,folder){
    if(!this.lib.itemExists(group)) {
        return;
    }

    folder=yh.Path.adjustDirPath(folder);

    var items=this.getItemsOfGroup(group);

    for(var i in items){
        var item=items[i];
        var exportPath= folder+ yh.Path.basename(item.name);

        if(item.itemType=="bitmap"){
            if(!item.exportToFile(exportPath,100)){
                fl.trace("export "+item.name+" to "+exportPath +" fail");
            }
        }else{
            fl.trace(item.name+" is not a image");
        }
    }
};

AnimationExport.prototype.generateCharacters=function(group){

    var items=this.getItemsOfGroup(group);
    var index=1;
    var characters=[];
    for(var i in items){
        var item=items[i];
        var characterData=this.getCharacterData(item);
        if(characterData){
            characterData.index=index++;
            characters.push(characterData);
        }
    }
    return characters;
};

AnimationExport.prototype.getCharacterData=function(item) {
    var element=item.timeline.layers[0].frames[0].elements[0];

    var libItem=element.libraryItem;

    //the base character is compose by bitmap
    if(libItem.itemType=="bitmap"){
        return {
            name:yh.Path.basename(item.name,yh.Path.extname(item.name)),
            texture:yh.Path.basename(libItem.name,yh.Path.extname(libItem.name))
        }
    }

    return null;
};

AnimationExport.prototype.generateCharactersMap=function(characters){
    var map={};
    for(var i in characters){
        map[characters[i].name]=characters[i];
    }
    return map;
};

AnimationExport.prototype.getItemsOfGroup=function(group) {
    var find=[];
    var libItems=this.lib.items;
    group=yh.Path.adjustDirPath(group);
    for(var i in libItems){
        var item=libItems[i];
        if(item.name.indexOf(group)==0){
            find.push(item);
        }
    }

    return find;
};

AnimationExport.prototype.generateAnimations=function(group){
    var animations=this.getItemsOfGroup(group);
    var actions=[];
    for(var i in animations){
        actions.push(this.getAnimationData(animations[i]));
    }

    return actions;
};

AnimationExport.prototype.getAnimationData=function(animationItem){
    this.lib.selectNone();
    this.lib.duplicateItem(animationItem.name);
    var tempItem=this.lib.getSelectedItems()[0];

    var movieClip=new MovieClip(this.doc,tempItem.timeline);
    var frames=movieClip.getFrameData();

    //element name property to index
    for(var f in frames){
        var frame=frames[f];
        for(var i in frame.elements){
            var ele=frame.elements[i];
            var character=this._charactersMap[ele.name];
            ele.index=this._charactersMap[ele.name].index;
            delete ele.name;
        }
    }
    //delete temp
    this.lib.deleteItem();

    return {
        fps:this.doc.frameRate,
        name:yh.Path.basename(animationItem.name,yh.Path.extname(animationItem.name)),
        frames:frames
    };
};

AnimationExport.prototype.createAnimationInLib=function(group,name){
    var lib=this.lib;

    var namePath=yh.Path.adjustDirPath(group)+name;
    if(lib.itemExists(namePath)){
        lib.deleteItem(namePath);
    }
    lib.addNewItem('movie clip',namePath);
    lib.editItem(namePath);

    return this.doc.getTimeline();
};