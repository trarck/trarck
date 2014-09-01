(function () {

    var Node = yhge.renderer.html.Node;
    var Sprite = yhge.renderer.html.Sprite;
    var Text = yhge.renderer.html.Text;

    var KeyCode=uikit.Keybord.KeyCode;

    var WorkSpace = function () {

        this._selectes=[];

        this.initialize.apply(this, arguments);

    };

    WorkSpace.prototype = {

        classname:"WorkSpace",

        initialize:function (config) {
            this._config = config;
            this._content = config.content;
            this._attrViewElement = config.attrViewElement;
            this._structViewElement = config.structViewElement;
        },

        setCurrentScreen:function(currentScreen) {
            this._currentScreen = currentScreen;
            this._content.empty().append(currentScreen.getView());
            return this;
        },
        getCurrentScreen:function() {
            return this._currentScreen;
        },


        setup:function () {

            var config = this._config;
            var self=this;

            //ui构建器
            this._builder = new uikit.HTMLBuilder({
                basePath:config.contentRoot
            });

            //属性列表
            this._attrView = new uikit.AttrView(this._attrViewElement);
            this._attrView.setupAttrView();

            //listen name change event
            $.event.add(this._attrView,"namechange",function(e,value,node){
                var treeNode=self._structView._tree.getNode(node.getId());
                treeNode.text.html(value);
            });


            this._structView = new uikit.StructView(this._structViewElement, this._attrView);


            //listen select event
            $.event.add(this._structView,"select",function(e,node){
                self.setSelect(node,true);
            });

            this.showScreenViewDataList();
            this.setupActions(this._config.actions);
            this.setupKeybord();
        },


        setupKeybord:function(){
            var self=this;


            var keybord=new uikit.Keybord();
            keybord.setup();

            keybord.addShortcut({
                name:"delete",
                keys:[KeyCode.Control,uikit.Keybord.KeyCode.Delete],
                action:function(){
                    self.remove();
                }
            });

            keybord.addShortcut({
                name:"save",
                keys:[KeyCode.Control,KeyCode.S],
                action:function(){
                    self.saveFile();
                }
            });


            keybord.addShortcut({
                name:"createScreen",
                keys:[KeyCode.Control,KeyCode.N],
                action:function(){
                    self.createScreen();
                }
            });

            keybord.addShortcut({
                name:"createSprite",
                keys:[KeyCode.Control,KeyCode.I],
                action:function(){
                    self.createSprite();
                }
            });

            keybord.addShortcut({
                name:"createLabel",
                keys:[KeyCode.Control,KeyCode.L],
                action:function(){
                    self.createLabel();
                }
            });

            keybord.addShortcut({
                name:"createButton",
                keys:[KeyCode.Control,KeyCode.B],
                action:function(){
                    self.createButton();
                }
            });

            keybord.addShortcut({
                name:"createTFButton",
                keys:[KeyCode.Control,KeyCode.T],
                action:function(){
                    self.createTFButton();
                }
            });

            keybord.addShortcut({
                name:"createTFButton",
                keys:[KeyCode.Control,KeyCode.F],
                action:function(){
                    self.freshScreen();
                }
            });

            keybord.addShortcut({
                name:"KeymoveUp",
                keys:[KeyCode.UpArrow],
                action:function(){
                    self.doKeyMove(KeyCode.UpArrow);
                }
            });

            keybord.addShortcut({
                name:"KeymoveDown",
                keys:[KeyCode.DownArrow],
                action:function(){
                    self.doKeyMove(KeyCode.DownArrow);
                }
            });

            keybord.addShortcut({
                name:"KeymoveLeft",
                keys:[KeyCode.LeftArrow],
                action:function(){
                    self.doKeyMove(KeyCode.LeftArrow);
                }
            });

            keybord.addShortcut({
                name:"KeymoveRight",
                keys:[KeyCode.RightArrow],
                action:function(){
                    self.doKeyMove(KeyCode.RightArrow);
                }
            });

            this._keybord=keybord;

//            var multyKeybordInput=new uikit.MultiKeybordInput(function(){
//                self.doKeyMove(this._input);
//            });
//            multyKeybordInput.setup();

            var singleKeybordInput=new uikit.SingleKeybordInput(function(code){
                console.log(code);
                self.doSingleKeyMove(this._input,code);
            });
            singleKeybordInput.setup();
        },


        setupActions:function(actions){
            var self=this;
            var value,element,action;
            for(var name in actions){
                value=actions[name];
                if(typeof value=="string" || value.jquery){

                    element=value.jquery?value:$(value);
                    action=name;

                }else{
                    element=value.element.jquery?value.element:$(value.element);
                    action=value.action;

                }
                if(self[action]){
                    (function(action){
                        element.click(function(e){
                            self[action]();
                        });
                    })(action);
                }
            }
        },

        showScreenViewDataList:function (){
            var self=this;
            var viewDataList=this._config.viewDataList[0];

            $.get(this._config.Server.listView,function(list){

                for(var i=0,l=list.length;i<l;i++){
                    viewDataList.options.add(new Option(list[i],list[i]));
                }
            });

            this._config.viewDataList.change(function(e){
                self.showScreen(this.value);
            });
        },

        showScreen:function (screenFilename) {
            var self=this;
            $.get(this._config.viewDataRoot + "/" + screenFilename, null, function (data) {
                self.createScreenWithDefine(self.getViewData(data), screenFilename);
            }, "text");
        },

        createScreenWithDefine:function (define, screenFilename) {
            //screen
            var screen = this._createScreen({
                name:screenFilename.replace(".js", "")
            });

            screen.loadElementsWithDefine(define);
            this.setCurrentScreen(screen);
            screen.render();

//            this._structView.setup(screen);
        },

        getViewData:function (data) {
            var fun = new Function("var exports={};" + data + ";return exports;");
            var data = fun();
            //only one key
            for (var k in data) return data[k];
        },


        saveFile:function () {
            if(!this._currentScreen) return ;

            var currentScreenData = this._currentScreen.getElementDefine()||{};
            var data = this.createDataFromView(this._currentScreen);

            for(var group in data){
                currentScreenData[group]=data[group];
            }

            data = JSON.stringify(currentScreenData, null, 4);//JsonUtil.convertToString(data);

            $.post("/saveView?filename=" + this._currentScreen.getDefineFilename(), data);

        },

        createDataFromView:function (screen) {
            var dw = new DataWriter();
            var dataDef = dw.getData(screen);
            console.log(dataDef);
            return dataDef;
        },

        _createScreen:function(config){
            var self=this;
            var screen = new uikit.Screen();

            config && screen.setAttributes(config);

            screen.setAttrView(this._attrView);
            screen.setBuilder(this._builder);
            screen.setStructView(this._structView);
            screen.getView().addClass("wrap");

            $.event.add(screen,"select",function(e,node){
                self.setSelect(node);
            });

            this._structView.setup(screen);

            return screen;
        },


        createScreen:function(){

            var name=this._config.screenName.val();
            var screen = this._createScreen({
                name:name||"Screen"+parseInt(Math.random()*1000)
            });

            this.setCurrentScreen(screen);
            screen.render();
            return screen;
        },
        
        createSprite:function () {
            if (this._currentScreen) {
                var screen=this._currentScreen;
                var sprite = this._builder.createImage({
                    name:"Sprite",
                    pos_x:0,
                    pos_y:0,
                    size_x:128,
                    size_y:128,
                    asset:"Content/Images8x/misc/1pxblack.png"
                });
                sprite.render();
                screen.setupEvent(sprite);
                screen.addChild(sprite);
                var root = screen.getStructView()._tree.getNode(screen.getId());
                root.addSubNode(screen.getStructView().createTreeNodeData(sprite));
                this.setSelect(sprite);
            }
        },

        createLabel:function () {
            if (this._currentScreen) {
                var screen=this._currentScreen;
                var text = this._builder.createLabel({
                    name:"Text",
                    pos_x:0,
                    pos_y:0,
                    size_x:128,
                    size_y:32,
                    font_size:18,
                    text:"EMPTY"
                });
                text.render();
                screen.setupEvent(text);
                screen.addChild(text);
                var root = screen.getStructView()._tree.getNode(screen.getId());
                root.addSubNode(screen.getStructView().createTreeNodeData(text));
                this.setSelect(text);
            }
        },

        createButton:function () {
            if (this._currentScreen) {
                var screen=this._currentScreen;
                var button =this._builder.createButton({
                    name:"Button",
                    pos_x:0,
                    pos_y:0,
                    size_x:128,
                    size_y:32,
                    text:"Button"
                });
                button.render();
                screen.setupEvent(button);
                screen.addChild(button);
                var root = screen.getStructView()._tree.getNode(screen.getId());
                root.addSubNode(screen.getStructView().createTreeNodeData(button));
                this.setSelect(button);
            }
        },

        createTFButton:function () {
            if (this._currentScreen) {
                var screen=this._currentScreen;
                var button =this._builder.createTFButton({
                    name:"TFButton",
                    pos_x:0,
                    pos_y:0,
                    size_x:160,
                    size_y:64,
                    type:5,
                    text:"TFButton"
                });
                button.render();
                screen.setupEvent(button);
                screen.addChild(button);
                var root = screen.getStructView()._tree.getNode(screen.getId());
                root.addSubNode(screen.getStructView().createTreeNodeData(button));
                this.setSelect(button);
            }
        },


        remove:function(){
            if(this._selected){
                this._currentScreen.removeChild(this._selected);
                this._attrView.clearAttrView();
                this._structView.removeNode(this._selected);
            }
//            for(var i=0,l=this._selectes.length;i<l;i++){
//
//            }
        },

        setSelect:function(node,settedInStructView){
            if (this._selected != node) {
                if(this._selected){
                    this._selected.getView().removeClass("selected");

                    if(this._selected.resizeHandle) {
                        this._selected.resizeHandle.remove();
                        this._selected.resizeHandle=null;
                        this._selected.getView().removeData("resizable");
                    }
                }

                this._selected = node;
                this._selected.getView().addClass("selected");

                this._attrView.setSelect(node);
                !settedInStructView && this._structView.setSelectNode(node);

                this.addReshizeHandle(node);
            }
        },

        addSelect:function(node){
            this._selectes.push(node);
        },

        removeSelect:function(node){
            var index=this._selectes.indexOf(node);
            this._selectes.splice(index,1);
        },

        freshScreen:function(){
            this.showScreen(this._currentScreen.getDefineFilename());
        },

        //key move
        doKeyMove:function(input){
            if(this._selected){
                var pos=this._selected.getPosition();
                var speed=input[KeyCode.Shift]?this._config.keyMoveMax:this._config.keyMoveMin;
                var x=pos.x,y=pos.y;

                x+=input[KeyCode.LeftArrow]?-speed:(input[KeyCode.RightArrow]?speed:0);
                y+=input[KeyCode.UpArrow]?-speed:(input[KeyCode.DownArrow]?speed:0);

                this._selected.setPosition(x,y);
                this._attrView.updatePosition(x,y);
            }
        },
        doSingleKeyMove:function(input,code){
            if(this._selected){
                var pos=this._selected.getPosition();
                var speed=input[KeyCode.Shift]?this._config.keyMoveMax:this._config.keyMoveMin;
                var x=pos.x,y=pos.y;

                switch (code) {
                    case KeyCode.UpArrow:
                        y-=speed;
                        break;
                    case KeyCode.DownArrow:
                        y+=speed;
                        break;
                    case KeyCode.LeftArrow:
                        x-=speed;
                        break;
                    case KeyCode.RightArrow:
                        x+=speed;
                        break;
                }
                this._selected.setPosition(x,y);
                this._attrView.updatePosition(x,y);
            }
        },

        /**
         *
         * @param node
         */
        addReshizeHandle:function(node){
            if(!node.resizeHandle && !(node.getParent() && node.getParent().isLock && node.getParent().isLock())){
                var resizeHandle=$("<div class='resize-handle se'/>");
                node.getView().append(resizeHandle);
                node.getView().resizable({handle:resizeHandle,direction:"se",skipDefaultAction:true,resizing:function(distance,range,data){

                    if(distance.x!=0 && distance.y!=0){
                        var position=node.getPosition();
                        node.setPosition(position.x+distance.x,position.y+distance.y);
                    }

                    node.setContentSize({width:range.width,height:range.height});
                }});
                node.resizeHandle=resizeHandle;
            }
        }
    };

    uikit.WorkSpace=WorkSpace;

})();
