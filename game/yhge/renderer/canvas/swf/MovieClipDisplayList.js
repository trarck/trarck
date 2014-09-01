(function () {
    var Node=yhge.renderer.Node;
    var Sprite=yhge.renderer.canvas.Sprite;
    var ActionAnimation=yhge.animation.ActionAnimation;
	var TransformMatrix=yhge.math.TransformMatrix;
    var ColorTransform=yhge.math.ColorTransform;
    var ASObject=yhge.renderer.canvas.swf.ASObject;

    var PlaceTypes={
        Add:1,
        Modify:2,
        Replace:3,
        Remove:9
    };
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
    var MovieClipDisplayList=yhge.core.Class([ASObject,Sprite,ActionAnimation],{

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
			this._displayListOrderDirty=false;
            MovieClipDisplayList._super_.initialize.apply(this,arguments);
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
        addCharacter:function(character,zOrder){
            if(!this._characters[zOrder]) this._characters[zOrder]={};
            this._characters[zOrder][character.getCharacterId()]=character;
//            var name=character.getName();
//            if(name){
//                this._characters[name]=character;
//            }
//            character._parent=this;
        },
        addCharacterByName:function(haracter,name){
            if(name){
                this._characters[name]=character;
            }
        },
        getCharacters:function() {
            return this._characters;
        },
        getCharacter:function(zOrder,characterId){
            return this._characters[zOrder] && this._characters[zOrder][characterId];
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
            MovieClipDisplayList._super_.updateGroup.call(this,delta,deltaFrame);
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
            MovieClipDisplayList._super_.updateGroup.call(this,delta,deltaFrame);
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
 		updateDisplayList: function () {

            var frame=this._frames[this._currentFrame];
            var ele,character;

            for(var zOrder in frame.elements){

                ele=frame.elements[zOrder];

				switch (ele.placeType){
					case PlaceTypes.Add://add
						this._displayList[zOrder]=ele.character;
						this._displayListOrderDirty=false;
						break;
					case PlaceTypes.Modify://modify
						
						break;
					case PlaceTypes.Replace://replace
						this._displayList[zOrder]=ele.character;
						break;
					case PlaceTypes.Remove://remove
						delete this._displayList[zOrder];
						break;
				}
				
				character=this._displayList[zOrder];
				if(!character) continue;
				
                if(ele.clipDepth) {
                	character.setClipDepth(ele.clipDepth);
                }
                

                //为了保持对像的数量最少，这里把属性的改变保存在frame中。
                //如果内存够大，把每一帧的对象建立一个拷贝，属性变化直接设置到拷贝的对象中。
                //transform为空，则保持上一个位置。
                //动态设置transform
                if(ele.transform && ele.character._baseTransformMatrix!=ele.transform){
                    //console.log("cid:"+this._characterId+",frmae:"+this._currentFrame,JSON.stringify(ele.transform));
                    character.setBaseTransformMatrix(ele.transform);
                }
                ele.colorTransform && character.setOpacity(ele.colorTransform.alphaMultiplier);
                ele.colorTransformKey && character.setColorTransformKey(ele.colorTransformKey);
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

            var character,clipDepth=0;

			if(this._displayListOrderDirty) this.sortDisplayList();
			
            for(var zOrder in this._displayList){

                character=this._displayList[zOrder];

                if(clipDepth && zOrder>clipDepth) {
                    context.restore();
                    console.log("clip close:"+clipDepth,zOrder);
                    clipDepth=0;
                }
                //保存剪切前状态
                if(character._clipDepth){
                    clipDepth=character._clipDepth;
                    context.save();
                    console.log("clip save:"+clipDepth,zOrder,this._currentFrame);
                }
				character.render(context);
                //恢复剪切前状态
            }
            if(clipDepth) {
                context.restore();
                console.log("clip close:"+clipDepth,zOrder);
            }
            context.restore();
        },
		sortDisplayList:function(){
			var keys=[],displayList={};
            for(var key in this._displayList) keys.push(key);
            keys.sort(function (a,b) {
                return parseInt(a)-parseInt(b);
            });
            for(var key,i=0,l=keys.length;i<l;i++){
                key=keys[i];
                displayList[key]=this._displayList[key];
            }
			this._displayListOrderDirty=false;
            return this._displayList=displayList;
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
            var newMC=MovieClipDisplayList._super_.clone.apply(this,arguments);
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
            var newMC=MovieClipDisplayList._super_.clone.apply(this,arguments);
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
            MovieClipDisplayList._super_.gotoAndPlay.call(this,frame);
        },

        gotoAndStop: function(frame) {
            if(typeof frame=="string" && !/\d+/.test(frame)){
                frame=this.getFrameLabelIndex(frame);
            }
            MovieClipDisplayList._super_.gotoAndStop.call(this,frame);
        }
    });

    MovieClipDisplayList.PlaceTypes=PlaceTypes;

    MovieClipDisplayList.sortElements=function(elements) {
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

    MovieClipDisplayList.parseElements=function(frameIndex,elements,context,resMap,instance,usedCharacters,config){
        var it;
        var baseTransformMatrix;
        var cloneLayer,movieClipCloned={};

        var clipMap={},clip;
        var character;
        for(var zOrder in elements){
            it=elements[zOrder];


           if(it.transform && !(it.transform instanceof TransformMatrix)){
               it.transform=TransformMatrix.create(it.transform);
           }

           if(it.colorTransform && !(it.colorTransform instanceof ColorTransform)){
               it.colorTransform=ColorTransform.create(it.colorTransform);
           }

           switch(it.placeType){
                case PlaceTypes.Add:
                case PlaceTypes.Replace:
                    character=instance.getCharacter(zOrder,it.characterId);
                    if(!character) {
                        character=resMap[it.characterId];
                        if(character.classname=="MovieClip"){
                            character=character.simpleClone();
                            MovieClipDisplayList.parseFrames2(character._definition.frames,character,context,resMap,config);
                        }else{
                            character=character.clone();
                        }
                        instance.addCharacter(character);
                    }
                    if(it.name){
                        character.setName(it.name);
                        instance.addCharacterByName(character,it.name);
                    }
                    usedCharacters[zOrder]=character;
                    break;
               case PlaceTypes.Modify:
                   character=usedCharacters[zOrder];
                   break;
           }


            //TODO sound支持
            if(character){
                if(it.clipDepth){
                    if(!clipMap[zOrder]) clipMap[zOrder]={};
                    clip=clipMap[zOrder][it.characterId];
                    if(!clip){
                        clip=clipMap[zOrder][it.characterId]=character.toClip(context,it.clipDepth);
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
                            break;
                        case "MovieClip":
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
    //仅对MovieClip处理，减少生成时间。
    MovieClipDisplayList.parseFrames2=function(frames,instance,context,resMap,config){
        var frameObj;
        var usedCharacters={
            
            __names__:{}
        };

        var elements;
        var it,character;
        for(var i=0,l=frames.length;i<l;i++){
            frameObj=frames[i];
            //由于是键值对，要进行排序
            elements=frameObj.elements;
            for(var zOrder in elements){
                it=elements[zOrder];
                if(it.addedFrameIndex!=null && it.addedFrameIndex==i){

                    if(!usedCharacters[zOrder]){
                        usedCharacters[zOrder]={};
                    }
                    character=usedCharacters[zOrder][it.characterId];
                    if(!character){
                        character=resMap[it.characterId];
                        if(character.classname=="MovieClip"){
                            character=character.simpleClone();
                            MovieClipDisplayList.parseFrames2(character._definition.frames,character,context,resMap,config);
                        }else{
                            character=character.clone();
                        }
                        usedCharacters[zOrder][it.characterId]=character;
                    }
                    if(it.name){
                        character.setName(it.name);
//                        usedCharacters[it.name]=character;
                        usedCharacters.__names__[it.name]=character;
                    }
                }else{
                    character= usedCharacters[zOrder]&&  usedCharacters[zOrder][it.characterId];
                    character=character?character:resMap[it.characterId];
                }
                switch (character.classname) {
                    case "Shape":
                    case "ShapeCache":
                        if(it.colorTransform){
                            //no alpha
//                            if(!ColorTransform.isOnlyAlpha(it.colorTransform)){
                                it.colorTransformKey=character.addColorTransform(it.colorTransform,context,resMap,config);
//                                character=character.toColorTransformShape(it.colorTransform,context,resMap,config);
//                            }
                        }
                        break;
                }
                it.character=character;
            }
            instance.addFrame(frameObj);
        }
        //console.log(instance._characterId+" usedCharacters2:",usedCharacters);
        instance.setCharacters(usedCharacters);
    };

    MovieClipDisplayList.parseFrames=function(frames,instance,context,resMap,config){
        var frameObj;
        var usedCharacters={
            __names__:{}
        };

        for(var i=0,l=frames.length;i<l;i++){
            frameObj=frames[i];
            //由于是键值对，要进行排序
            frameObj.elements=MovieClipDisplayList.parseElements(i,MovieClipDisplayList.sortElements(frameObj.elements),context,resMap,instance,usedCharacters,config);
            instance.addFrame(frameObj);
        }
        //console.log(instance._characterId+" usedCharacters:",usedCharacters);
        instance.setCharacters(usedCharacters);
    };
    //直接生成MovieClip
    //如果子元素中含有MovieClip则使用clone的
    MovieClipDisplayList.createMovieClip=function(context,def,resMap,config){
        console.log("createMovieClip:"+def.characterId);
		//MovieClip通常以固定的帧率更新，可以省去duration
        var mc=new MovieClipDisplayList({
            characterId:def.characterId
        });

        //子MovieClip,参与到update
        //用到的character，包含克隆和未克隆的。
        MovieClipDisplayList.parseFrames(def.frames,mc,context,resMap,config);

        mc.setFrameLabels(def.frameLabels);
        mc.setActions(def.actions.slice());
//        mc.setChildSpriteOperations(def.childSpriteOperations);
        mc.setDefinition(def);
        return mc;
    };
    
    yhge.renderer.canvas.swf.MovieClipDisplayList=MovieClipDisplayList;
})();