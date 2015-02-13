
function AnimationImport(doc){
    this.doc=doc;
    this.lib=doc.library;
}

/**
 * 导入图片到库
 * @param group
 * @param elements
 * @param parentPath
 */
AnimationImport.prototype.importElementToLibs=function(group,elements,parentPath){
    if(!this.lib.itemExists(group)){
        //create new one
        this.lib.addNewItem("folder",group);
    }

    parentPath=this.checkDirPath(parentPath||"");

    for(var i in elements){
        var element=elements[i];

        var name=this.getBaseName(element.path);
        var path= parentPath+element.path;
        this.doc.importFile(path,true);
        this.lib.selectItem(name);
        this.lib.moveToFolder(group);
    }
};

/**
 * 导入的图片转成元件
 * @param group
 * @param elements
 * @param elementGroup
 */
AnimationImport.prototype.convertToSymbols=function(group,elements,elementGroup){
    if(!this.lib.itemExists(group)){
        //create new one
        this.lib.addNewItem("folder",group);
    }

    elementGroup=elementGroup||"";
    elementGroup=this.checkDirPath(elementGroup);

    for(var i in elements){
        var element=elements[i];

        var namePath= elementGroup+element.texture;
        var symbolName= element.name || this.getBaseName(element.texture,this.getExtName(element.texture));

        this.lib.selectItem(namePath);
        this.lib.addItemToDocument({x:0, y:0});
        this.doc.convertToSymbol('movie clip', symbolName, "center");
        this.lib.moveToFolder(group);
    }
};

AnimationImport.prototype.createAnimation=function(group,name,data){
    var timeline=this.createAnimationInLib(group,name);
    //create animation content
    this.createAnimationContent(timeline,data);
};

AnimationImport.prototype.createAnimationInLib=function(group,name){
    var lib=this.lib;

    var namePath=this.checkDirPath(group)+name;
    lib.deleteItem(namePath);
    lib.addNewItem('movie clip',namePath);
    lib.editItem(namePath);

    return this.doc.getTimeline();
};

AnimationImport.prototype.createAnimationContent=function(animationTimeline,data){
    this.timeline=animationTimeline;
    //
    var layers=data.layers;
    for(var i in layers){
        //first is exists,not need create
        if(i!=0){
            //create layer on top
            this.timeline.addNewLayer();
        }

        this.createAnimationLayer(layers[i]);
    }
};

//one layer only on element
AnimationImport.prototype.createAnimationLayer=function(data){
    var timeline=this.timeline;
    //top layer
    var layerIndex=0;

    var layerObj=timeline.layers[layerIndex];

    var elementName=data.element;

    layerObj.name=data.layerName|| elementName;

    //place element in first frame
    this.placeElement(layerIndex,0,elementName);

    var frames = data.frames;
    for(var i in frames){
        var frame=frames[i];





    }
};

AnimationImport.prototype.placeElement=function(layer,frame,elementName){
    if(!this.lib.selectItem(elementName)){
        return;
    }

    this.timeline.currentLayer=layer;
    this.timeline.currentFrame=frame;

    //check is key frame
    var layerObj=this.timeline.layers[layer];

    if(this.isKeyFrame(layerObj,frame)){
        //clear frame data
        this.timeline.clearFrames(frame);
    }else{
        //convert to key frame
        this.timeline.convertToBlankKeyframes(frame);
    }

    this.lib.addItemToDocument({x:0,y:0});
    ////后面放置的会在上面，depth值就越小。也就是elements的第一个元素。
    //var addedElement=this.timeline.layers[layer].frames[frame].elements[0];
    //this.setElementProperty(addedElement,property);
    return this.timeline.layers[layer].frames[frame].elements[0];
};

AnimationImport.prototype.setElementProperty=function(element,property){

    var haveSelected=false;

    if(property.matrix){
        element.matrix=property.matrix;

        doc.selection = [element];
        doc.setTransformationPoint({x:0, y:0});
        haveSelected=true;
    }

    if(typeof(property.alpha)!="undefined"){
        if(!haveSelected){
            doc.selection=[element];
            haveSelected=true;
        }
        doc.setInstanceAlpha(property.alpha);
    }
};

AnimationImport.prototype.isKeyFrame=function(layerObject,frameIndex){
   return layerObject.frameCount>frameIndex && layerObject.frames[frameIndex].startFrame==frameIndex;
};

/**
 * 取得文件基本名称
 * @param filePath
 * @returns {*}
 */
AnimationImport.prototype.getBaseName=function(filePath,ext){
    var pos=filePath.lastIndexOf("/");
    if(pos!=-1){
        var basename=filePath.substr(pos+1);

        if(ext){
            var extPos=basename.lastIndexOf(ext);
            if(extPos!=-1){
                basename= basename.substring(0,extPos);
            }
        }
        return basename;
    }
    return filePath;
};

AnimationImport.prototype.getExtName=function(filePath){
    var pos=filePath.lastIndexOf(".");
    if(pos!=-1){
        return filePath.substr(pos);
    }
    return "";
};

AnimationImport.prototype.checkDirPath=function(dirPath){
    if(!dirPath) return "";

    var lastChar=dirPath.charAt(dirPath.length-1);
    if(lastChar!="/"){
        dirPath=dirPath+"/";
    }
    return dirPath;
};
