(function () {
    var Node = yhge.renderer.html.Node;

    var Screen=yhge.core.Class(Node,{

        classname:"Screen",

        initialize:function () {
            //王国使用的4大内容
            this._images = [];
            this._labels = [];
            this._composites = [];

            Screen._super_.initialize.apply(this,arguments);
        },

        setAttrView:function(attrView) {
            this._attrView = attrView;
            return this;
        },
        getAttrView:function() {
            return this._attrView;
        },

        setBuilder:function(builder) {
            this._builder = builder;
            return this;
        },
        getBuilder:function() {
            return this._builder;
        },

        setStructView:function(structView) {
            this._structView = structView;
            return this;
        },
        getStructView:function() {
            return this._structView;
        },


        getElementDefine:function() {
            return this._elementDefine;
        },

        setName:function(name) {
            this._name = name;
            return this;
        },
        getName:function() {
            return this._name;
        },

        getDefineFilename:function() {
            return this._name+".js";
        },


        loadElementsWithDefine:function(def){
            this._builder.buildWithJSONDef(def,this);

            //setup children event
//            for(var i=0,l=this._children.length;i<l;i++){
//                this.setupEvent(this._children[i]);
//            }
            this.setupChildrenEvents(this.getChildren());

            this._elementDefine=def;
        },

        setupChildrenEvents:function (children) {
            for(var i=0,l=children.length;i<l;i++){
                this.setupEvent(children[i]);
                if(children[i].classname=="Group"){
                    this.setupChildrenEvents(children[i].getChildren());
                }
            }
        },

        setupEvent:function(node){
            var self=this;
            node.getView().mousedown(function(e){
                self.onNodeMousedown(e,node);
            });


//            $.event.add(node,"namechange",function(e,value){
//                var treeNode=self._structView._tree.getNode(node.getId());
//                treeNode.text.html(node.def.name);
//            });
        },

        onNodeMousedown:function(e,node){
            //if parent is lock,can't resize and move.it used for group
            if(node.getParent().isLock && node.getParent().isLock()) return;

            //stop group recive mousedown event
            e.stopPropagation();

            //if click resize block,jush resize the element size ,not change the position.
            if(node.resizeHandle && e.target==node.resizeHandle[0]) return;

            //for position move
            var attrView=this._attrView;

            var startPosition={x:0,y:0},startX=0,startY=0;
            var didMove=function (e){
                var dx=e.pageX-startX;
                var dy=e.pageY-startY;
                node.setPosition({
                    x:startPosition.x+dx,
                    y:startPosition.y+dy
                });//.render();
            };

            $.event.trigger("select",node,this);

            //fix firefox drag node,the outline become more big.
            node.getView().removeClass("selected");

            startX=e.pageX;
            startY=e.pageY;
            var p=node.getPosition();
            startPosition.x=p.x;
            startPosition.y=p.y;
            $(document)
                .mousemove(didMove)
                .mouseup(function(e){
                    node.getView().addClass("selected");
                    $(document).unbind("mousemove",didMove).unbind("mouseup");
                    //更新位置
                    var dx=e.pageX-startX;
                    var dy=e.pageY-startY;
                    if(dx!=0 || dy!=0){
                        //var data=sprite.data("def");
                        var pos=node.getPosition();
                        attrView.updatePosition(pos.x,pos.y);
                    }
                });
            e.preventDefault();
        },
        /**
         * for modify children
         * if locked can't modify children
         */
        isLock:function(){
            return this._lock;
        },
        setLock:function(lock){
            this._lock=true;
        }


    });

    uikit.Screen=Screen;
})();