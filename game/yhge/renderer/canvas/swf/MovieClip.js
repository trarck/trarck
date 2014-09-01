(function () {
    var Node=yhge.renderer.Node;
    var Sprite=yhge.renderer.canvas.Sprite;
    var ActionAnimation=yhge.animation.ActionAnimation;
	var TransformMatrix=yhge.math.TransformMatrix;
    var ColorTransform=yhge.math.ColorTransform;
    var ASObject=yhge.renderer.canvas.swf.ASObject;

    /**
     * 渲染方式
     * 当前是按照固定的帧内容进行渲染。
     *      好处是效率高，由于每帧的内容固定，不需要在渲染循环里进行判断。 
     *      但，不利于动态修改帧里的内容。
     *      比较适合游戏里的帧动画,但作为整个游戏不太合适。
     * 适合动态的方式:每个MovieClip维护一个显示表，每帧描述对显示表的处理。比如增删改等操作。
     *      这样要求，每个帧都要处理，但不一定显示出来，只显示当前帧。
     *      导出的sprite格式也要不一样。
     *
     * 执行action的方式:
     * 1.完全自定义。
     * 2.解析执行swf的DoAction
     * 3.混合自定义和DoAction
     * 4.DoAction转成自定义，也可以加入自己定义。
     * 这里只支持自己定义，其它方式可以由子类实现。
     */
    var MovieClip=yhge.core.Class([ASObject,Sprite,ActionAnimation],{

        classname:"MovieClip",

        initialize: function(props) {
            this._currentFrame=0;
            this._frames=[];
            this._duration=30;//每帧的显示时间
            this._frameLabels={};
//            this._childMovieClips=[];//子影片。需要更新帧。
            //使用的对象，使用name做为键，对象为值.
            //目前保存全局资源的MovieClip的副本.
            this._characters={};
            this._actions=[];
            MovieClip._super_.initialize.apply(this,arguments);
        },

        setFrameLabels:function(frameLabels) {
            this._frameLabels = frameLabels;
            return this;
        },
        getFrameLabels:function() {
            return this._frameLabels;
        },
        getFrameLabelIndex:function(label){
            return this._frameLabels[label];
        },

        setCharacters:function(characters) {
            var names=characters.__names__;
            delete characters.__names__;
            
            var elements;

            for(var zOrder in characters){
                elements=characters[zOrder];
                for(var characterId in elements){
                    elements[characterId]._parent=this;
                }
            }
            for(var name in names){
                characters[name]=names[name];
            }
            this._characters = characters;
            
            return this;
        },
        getCharacters:function() {
            return this._characters;
        },


        /**
         * 由于frame的帧率都是相同的，有关帧的计算只要一次，放在主时间轴上计算。
         * 父类的动作和属性先于子类更新。子类有时需要父类的一些属性。
         * 通常deltaFrame都为1.
         */
        update: function(delta,deltaFrame) {
//            if(this._characterId==5){
//                console.log(this.cloneId,this._currentFrame);
//            }
            //TODO 每帧数据更新应该放在action执行前。如果在draw里，会在执行action后。
            MovieClip._super_.updateGroup.call(this,delta,deltaFrame);
			//更新带有时间轴的子元素
            //TODO 对同一个元素被多次放在显示列表的处理。使用hash map 表示_childMovieClips,键为MovieClip的characterId，可以避免重复更新。
            //     对于同一个MovieClip在不同的帧里被放入的处理。
			//子时间轴更新不受父影响
            this.updateChildren(delta,deltaFrame);
//            for(var i=0,l=this._children.length;i<l;i++){
//                this._children[i].update(delta,deltaFrame);
//            }
        },
        updateGroup: function(delta,deltaFrame) {
            MovieClip._super_.updateGroup.call(this,delta,deltaFrame);
			//更新带有时间轴的子元素
            //TODO 对同一个元素被多次放在显示列表的处理。
            for(var i=0,l=this._children.length;i<l;i++){
                this._children[i].updateGroup(delta,deltaFrame);
            }
        },
        updateChildren:function(delta,deltaFrame){
            var elements=this._frames[this._currentFrame].elements;
            var ele,clipDepth=0;
            var it;
            //TODO 加入character添加删除事件。使用一个显示表，记录哪些正被显示。
            //如果一个character在frames中，且不在显示表，则表示加入，如果在显示表不在frame表示删除。
            //还要考虑，代码加入character时的情况。
            for(var zOrder in elements){
                it=elements[zOrder];
                if(it.character.classname=="MovieClip" || it.character.classname=="Button"){
                    it.character.update(delta,deltaFrame);
                }
            }
        },
        render: function (context) {
            if (!this._visible) {
                return;
            }

            context.save();

            this.transform(context);

            // Set alpha value (global only for now)
            context.globalAlpha = this._opacity;
            
            var frame=this._frames[this._currentFrame];
            var ele,clipDepth=0;
            for(var zOrder in frame.elements){
                
                ele=frame.elements[zOrder];

                if(clipDepth && zOrder>clipDepth) {
                    context.restore();
//                    console.log("clip close:"+clipDepth,zOrder);
                    clipDepth=0;
                }
                //保存剪切前状态
                if(ele.clipDepth){
                    clipDepth=ele.clipDepth;
                    context.save();
//                    console.log("clip save:"+clipDepth,zOrder,this._currentFrame);
                }

                //为了保持对像的数量最少，这里把属性的改变保存在frame中。
                //如果内存够大，把每一帧的对象建立一个拷贝，属性变化直接设置到拷贝的对象中。
                //transform为空，则保持上一个位置。
                //动态设置transform
                if(ele.transform && ele.character._baseTransformMatrix!=ele.transform){
                    //console.log("cid:"+this._characterId+",frmae:"+this._currentFrame,JSON.stringify(ele.transform));
                    ele.character.setBaseTransformMatrix(ele.transform);
                }
                ele.colorTransform && ele.character.setOpacity(ele.colorTransform.alphaMultiplier);
                ele.colorTransformKey && ele.character.setColorTransformKey(ele.colorTransformKey);
                
//               ele.transform && ele.character.setTransformMatrix(ele.transform);
                ele.character.render(context);
                //恢复剪切前状态
            }
            if(clipDepth) {
                context.restore();
//                console.log("clip close:"+clipDepth,zOrder);
            }

            context.restore();
        },
        /**
         * 只负责画自己。render中处理子元素。
         * 另外一种方案。帧中的每层对象都是资源的clone，然后把数据直接设置在clone的对象上。这样每帧都不需要计算数据。
         * 目前只对transform进行处理，所以改进不大。
         */
//        draw:function (context) {
////            if(this._enable && !this._characterId){
////                console.log(this._characterId+" draw:"+this._currentFrame);
////            }
//            var frame=this._frames[this._currentFrame];
//            var ele;
//            for(var zOrder in frame.elements){
//                ele=frame.elements[zOrder];
//                //为了保持对像的数量最少，这里把属性的改变保存在frame中。
//                //如果内存够大，把每一帧的对象建立一个拷贝，属性变化直接设置到拷贝的对象中。
//                ele.character.setTransformMatrix(ele.transform);
//                ele.character.render(context);
//            }
//        },

        /**
         * 主要是子的MovieClip
         * 由于创建的时候使用clone，确保每个MovieClip都是独立了，防止一个MovieClip用于多个MovieClip的子元素时候的异常。
         * @param child
         */
        addChild: function (child) {
            if( this._children.indexOf(child)==-1){
//                console.log("movieclip"+this._characterId+" addChild:"+child._characterId);
                child._willAddToParent(this);
                this._children.push(child);
                child._addedToParent(this);
            }
            return this;
        },
        
        
        getChildByName:function(name){
            if(!name) return null;
            var children=this._children;
            for(var i=0,l=children.length;i<l;i++){
                if(children[i]._name==name) return children[i];
            }
            return null;
        },
        getCharacterByName:function(name){
            return this._characters[name];
        },
        setChildSpriteOperations:function(childSpriteOperations) {
            console.log("childSpriteOperations:",childSpriteOperations);

            this._childSpriteOperations = childSpriteOperations;
            var sop;

            for(var i=0,l=childSpriteOperations.length;i<l;i++){
                sop=childSpriteOperations[i];
//                console.log(this._characterId+" spriteOp:",sop);

                switch(sop[0]){
                    case "ADD":
                        this.addAction({
                            action:function(characterId,zOrder){
                                this.addChild(this._characters[zOrder][characterId]);
                            },
                            arguments:[sop[2],sop[3]]
                        },sop[1]);
                        break;
                    case "DEL":
                        this.addAction({
                            action:function(characterId,zOrder){
                                this.removeChild(this._characters[zOrder][characterId]);
                            },
                            arguments:[sop[2],sop[3]]
                        },sop[1]);
                        break;
                }
            }
            return this;
        },
        getChildSpriteOperations:function() {
            return this._childSpriteOperations;
        },

        clone:function () {
            var newMC=MovieClip._super_.clone.apply(this,arguments);
            newMC._characterId=this._characterId;
            newMC._currentFrame=0;
            newMC._frames=this._frames;
            newMC._actions=this._actions;
            newMC._frameLabels=this._frameLabels;
            newMC._frameCount=this._frameCount;
            newMC._children=this._children.slice();
            newMC._childSpriteOperations=this._childSpriteOperations;
            newMC._characters=this._characters;
            return newMC;
        },
        simpleClone:function(){
            var newMC=MovieClip._super_.clone.apply(this,arguments);
            newMC._characterId=this._characterId;
            newMC._currentFrame=0;
            newMC._actions=this._actions;
            newMC._frameLabels=this._frameLabels;
            newMC._childSpriteOperations=this._childSpriteOperations;
            newMC._definition=this._definition;
            return newMC;
        },
        gotoAndPlay: function(frame) {
            if(typeof frame=="string" && !/\d+/.test(frame)){
                frame=this.getFrameLabelIndex(frame);
            }
            MovieClip._super_.gotoAndPlay.call(this,frame);
        },

        gotoAndStop: function(frame) {
            if(typeof frame=="string" && !/\d+/.test(frame)){
                frame=this.getFrameLabelIndex(frame);
            }
            MovieClip._super_.gotoAndStop.call(this,frame);
        }
    });
    MovieClip.sortElements=function(elements) {
        var newElements={};
        var keys=[];
        for(var i in elements){
            keys.push(i);
        }
        keys.sort(function (a,b) {
            return a-b;
        });
        for(var j in keys) newElements[keys[j]]=elements[keys[j]];
        return newElements;
    };

    MovieClip.parseElements=function(frameIndex,elements,context,resMap,instance,usedCharacters,config){
        var it;
        var baseTransformMatrix;
        var cloneLayer,movieClipCloned={};

        var clipMap=usedCharacters.__clip__,
            clip;
        var character;
        for(var zOrder in elements){
            it=elements[zOrder];

            //character 从资源库中clone出来
            if(it.addedFrameIndex!=null && it.addedFrameIndex==frameIndex ){

                if(!usedCharacters[zOrder]){
                    usedCharacters[zOrder]={};
                }
                character=usedCharacters[zOrder][it.characterId];
                if(!character){
                    character=resMap[it.characterId];
                    if(character.classname=="MovieClip"){
                        character=character.simpleClone();
                        MovieClip.parseFrames(character._definition.frames,character,context,resMap,config);
                    }else{
                        character=character.clone();
                    }
//                    character=resMap[it.characterId].clone();
                    usedCharacters[zOrder][it.characterId]=character;
                }

                //TODO 处理没有名子的默认情况
                if(it.name){
                    character.setName(it.name);
//                    usedCharacters[it.name]=character;
                    usedCharacters.__names__[it.name]=character;
                }
            }else{
                character= usedCharacters[zOrder]&&  usedCharacters[zOrder][it.characterId];
                character=character?character:resMap[it.characterId];
            }

            //TODO sound支持
            if(character){
                it=elements[zOrder]=yhge.core.mixin({},it);

                if(it.modifyFrameIndex!=null){
                    if(it.modifyFrameIndex==frameIndex){
                        if(it.transform && !(it.transform instanceof TransformMatrix)){
                            it.transform=TransformMatrix.create(it.transform);
                        }
                    }else{
                        //modifyFrameIndex只对MovieClip有效
                        var modifyFrame=instance._frames[it.modifyFrameIndex];
                        var modifyItem=modifyFrame.elements[zOrder];
                        it.transform=modifyItem.transform;
                    }
                }else{

                    if(it.transform && !(it.transform instanceof TransformMatrix)){
                        it.transform=TransformMatrix.create(it.transform);
                    }
                }


    //            if(it.transform && !(it.transform instanceof TransformMatrix)){
    //                it.transform=TransformMatrix.create(it.transform);
    //            }
                if(it.colorTransform && !(it.colorTransform instanceof ColorTransform)){
                    it.colorTransform=ColorTransform.create(it.colorTransform);
                }

                if(it.clipDepth){
                    if(!clipMap[zOrder]) clipMap[zOrder]={};
                    clip=clipMap[zOrder][it.characterId];
                    if(!clip){
                        clip=clipMap[zOrder][it.characterId]=character.toClip(context);
                    }
                    character=clip;
                    //clip path只可能为shape
                }else{
                    switch (character.classname) {
                        case "Shape":
                        case "ShapeCache":
                            if(it.colorTransform){
                                //no alpha
//                                if(!ColorTransform.isOnlyAlpha(it.colorTransform)){
                                    it.colorTransformKey=character.addColorTransform(it.colorTransform,context,resMap,config);
//                                    character=character.toColorTransformShape(it.colorTransform,context,resMap,config);
//                                    console.log("it.colorTransform:",it.colorTransform,"frame:"+frameIndex,"deep:"+zOrder,"cid:"+it.characterId,character);
//                                }
                            }
                            break;
                        case "MorphShape":
                            character=character.createShape(context,resMap,config,it.ratio);
                            break;
                        case "GlyphText":
                        case "DynamicText":
                            // 处理基础矩阵。显示的基础乘上显示矩阵。
                            // 目前所知，只有文字有基础矩阵或不为单位矩阵。
                            // 为了最大兼容性，最好处理所有子元素，但会使生成时间加长，不影响渲染。
                            // 为了减少处理时间，子对象提供是否需要处理。
//                            baseTransformMatrix=character.nodeToParentTransform();
//                            it.transform=baseTransformMatrix.concat(it.transform);
                            break;
                        case "MovieClip":
                            //使用zOrder和characterId来确定一个MovieClip
                            //所有MovieClip使用clone对象
//                            if(cloneMovieClips){
//                                cloneLayer=cloneMovieClips[zOrder];
//                                if(cloneLayer){
//                                    movieClipCloned=cloneLayer[it.characterId];
//                                    if(!movieClipCloned){
//                                        movieClipCloned=cloneLayer[it.characterId]=character;//character.clone();
//                                    }
//                                }else{
//                                    cloneLayer=cloneMovieClips[zOrder]={};
//                                    movieClipCloned=cloneLayer[it.characterId]=character;//character.clone();
//                                }
////                                character=movieClipCloned;
//                            }

                            break;
                    }
                }
                it.character=character;
            }else{
                delete elements[zOrder];
            }
        }
        return elements;
    };
//    //仅对MovieClip处理，减少生成时间。
//    MovieClip.parseFrames2=function(frames,instance,context,resMap,config){
//        var frameObj;
//        var usedCharacters={
//            
//            __names__:{}
//        };
//        var clipMap={};
//        var elements;
//        var it,character;
//        for(var i=0,l=frames.length;i<l;i++){
//            frameObj=frames[i];
//            //由于是键值对，要进行排序
//            elements=frameObj.elements;
//            for(var zOrder in elements){
//                it=elements[zOrder];
//                if(it.addedFrameIndex!=null && it.addedFrameIndex==i){
//
//                    if(!usedCharacters[zOrder]){
//                        usedCharacters[zOrder]={};
//                    }
//                    character=usedCharacters[zOrder][it.characterId];
//                    if(!character){
//                        character=resMap[it.characterId];
//                        if(character.classname=="MovieClip"){
//                            character=character.simpleClone();
//                            MovieClip.parseFrames2(character._definition.frames,character,context,resMap,config);
//                        }else{
//                            character=character.clone();
//                        }
//                        usedCharacters[zOrder][it.characterId]=character;
//                    }
//                    if(it.name){
//                        character.setName(it.name);
////                        usedCharacters[it.name]=character;
//                        usedCharacters.__names__[it.name]=character;
//                    }
//                }else{
//                    character= usedCharacters[zOrder]&&  usedCharacters[zOrder][it.characterId];
//                    character=character?character:resMap[it.characterId];
//                }
//                if(it.clipDepth){
//                    if(!clipMap[zOrder]) clipMap[zOrder]={};
//                    clip=clipMap[zOrder][it.characterId];
//                    if(!clip){
//                        clip=clipMap[zOrder][it.characterId]=character.toClip(context);
//                    }
//                    character=clip;
//                    //clip path只可能为shape
//                }else{
//                    switch (character.classname) {
//                        case "Shape":
//                        case "ShapeCache":
//                            if(it.colorTransform){
//                                //no alpha
//    //                            if(!ColorTransform.isOnlyAlpha(it.colorTransform)){
//                                    it.colorTransformKey=character.addColorTransform(it.colorTransform,context,resMap,config);
//    //                                character=character.toColorTransformShape(it.colorTransform,context,resMap,config);
//    //                            }
//                            }
//                            break;
//                    }
//                }
//                it.character=character;
//            }
//            instance.addFrame(frameObj);
//        }
//        //console.log(instance._characterId+" usedCharacters2:",usedCharacters);
//        instance.setCharacters(usedCharacters);
//    };

    MovieClip.parseFrames=function(frames,instance,context,resMap,config){
        var usedCharacters={
            __names__:{},
            __clip__:{}
        };

        var frameObj;

        for(var i=0,l=frames.length;i<l;i++){
            frameObj=yhge.core.mixin({},frames[i]);
            //由于是键值对，要进行排序
            frameObj.elements=MovieClip.parseElements(i,MovieClip.sortElements(frameObj.elements),context,resMap,instance,usedCharacters,config);
            instance.addFrame(frameObj);
        }
        delete usedCharacters.__clip__;
        //console.log(instance._characterId+" usedCharacters:",usedCharacters);
        instance.setCharacters(usedCharacters);
    };
    //直接生成MovieClip
    //如果子元素中含有MovieClip则使用clone的
    MovieClip.createMovieClip=function(context,def,resMap,config){
        console.log("createMovieClip:"+def.characterId);
		//MovieClip通常以固定的帧率更新，可以省去duration
        var mc=new MovieClip();

        mc.setCharacterId(def.characterId);

        //子MovieClip,参与到update
        //用到的character，包含克隆和未克隆的。
        MovieClip.parseFrames(def.frames,mc,context,resMap,config);

        mc.setFrameLabels(def.frameLabels);
        mc.setActions(def.actions.slice());
//        mc.setChildSpriteOperations(def.childSpriteOperations);
        mc.setDefinition(def);
        return mc;
    };
    //对定义资源的红缓存
    var characterChaces={};
    //对MovieClip的定义进行处理，以便使用
    MovieClip.parseDefineWithCache=function(context,def,resMap){
        var frameObj,ele,character,chachedCharacter,
            subMovieClips={},
            frames=def.frames;

        for(var i=0,l=frames.length;i<l;i++){
            frameObj=frames[i];
            //由于是键值对，要进行排序
            frameObj.elements=MovieClip.sortElements(frameObj.elements);
            for(var zOrder in frameObj.elements){
                ele=frameObj.elements[zOrder];

                character=characterChaces[ele.characterId];
                if(!character){
                    //缓存中没有
                    character=resMap[ele.characterId];
                    //TODO text image sound支持
                    if(character){
                        //是对象
                        if(character instanceof Node){
                            characterChaces[ele.characterId]=character;
                        }else{
                            //是定义.进行缓存
                            switch (character.className) {
                                case "Shape":
                                    character=Shape.createShape(context,character);
                                    break;
                                case "MovieClip":
                                    //flash中已经排好了先后顺序。
                                    //此处引用到的MovieClip的定义已经是处理好的
                                    character=new MovieClip(character);
                                    break;
                                case "MorphShape":
                                    character=new MorphShape(character);
                                    break;
                            }
                            characterChaces[ele.characterId]=character;
                        }
                    }else{
                        //定义，缓存中都没有。删除该层。
                        delete frameObj.elements[zOrder];
                        continue;
                    }
                }

                if(character.classname=="MorphShape"){
                    character=character.toShape(context,ele.ratio);
                }
                ele.character=character;
            }
        }
        
        var children=def.childSprites,childMovieClips=[],isInChildMap={},subId;
        //过虑重复的id
        for(var i=0,l=children.length;i<l;i++){
            subId=children[i];
            if(!isInChildMap[subId]){
                childMovieClips.push(characterChaces[subId]);
                isInChildMap[subId]=true;
            }
        }
        return {characterId:def.characterId,childMovieClips:childMovieClips,frames:frames};
    };
    MovieClip.createMovieClipWithCache=function(context,def,resMap,fps){
        var frameObj,ele,character,chachedCharacter,
            subMovieClips={},
            frames=def.frames;

        for(var i=0,l=frames.length;i<l;i++){
            frameObj=frames[i];
            //由于是键值对，要进行排序
            frameObj.elements=MovieClip.sortElements(frameObj.elements);
            for(var zOrder in frameObj.elements){
                ele=frameObj.elements[zOrder];

                character=characterChaces[ele.characterId];
                if(!character){
                    //缓存中没有
                    character=resMap[ele.characterId];
                    //TODO text image sound支持
                    if(character){
                        //是对象
                        if(character instanceof Node){
                            characterChaces[ele.characterId]=character;
                        }else{
                            //是定义.进行缓存
                            switch (character.className) {
                                case "Shape":
                                    character=Shape.createShape(context,character);
                                    break;
                                case "MovieClip":
                                    //flash中已经排好了先后顺序。
                                    //此处引用到的MovieClip的定义已经是处理好的
                                    character=MovieClip.createMovieClip2(context,character,resMap);
                                    break;
                                case "MorphShape":
                                    character=new MorphShape(character);
                                    break;
                            }
                            characterChaces[ele.characterId]=character;
                        }
                    }else{
                        //定义，缓存中都没有。删除该层。
                        delete frameObj.elements[zOrder];
                        continue;
                    }
                }

                if(character.classname=="MorphShape"){
                    character=character.toShape(context,ele.ratio);
                }
                ele.character=character;
            }
        }
        
        var children=def.childSprites,childMovieClips=[],isInChildMap={},subId;
        //过虑重复的id
        for(var i=0,l=children.length;i<l;i++){
            subId=children[i];
            if(!isInChildMap[subId]){
                childMovieClips.push(characterChaces[subId]);
                isInChildMap[subId]=true;
            }
        }

        return new MovieClip({characterId:def.characterId,childMovieClips:childMovieClips,frames:frames});
    };
    yhge.renderer.canvas.swf.MovieClip=MovieClip;
})();