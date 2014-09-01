(function () {

    var GroupNodeMap={
        Screen:true,
        Group:true

    };

    var StructView = function () {
        this.initialize.apply(this, arguments);
    };

    StructView.prototype = {

        initialize:function (view,attrView) {
            this._view=view;
            this._attrView=attrView;
        },

        setup:function(screen){
            var self=this;

            var store=new $.YH.Data.Store({
                proxy:$.YH.Data.LocalProxy,
                parse:function(data,param,args){
                    var node=args[0].options.node;
                    return self.createChildrenTreeNodeData(node);
                }
            });

            this._view.empty().removeData("tree");

            this._tree=this._view.tree({
                root:this.createTreeNodeData(screen),
                store:store,
                selectedNode:function(treeNode){
                    var node=treeNode.options.node;
//                    self._attrView.setObj(node);
                    $.event.trigger("select",node,self);
                }
            }).data("tree");

            //for crate sub nodes event
            $.event.add(this._tree,"createSubNodesSuccess",function(e,createNodes){
                for(var i=0,l=createNodes.length;i<l;i++){
                    var node=createNodes[i].options.node;
                    if(node.classname=="Group"){
                        node.isLock() && createNodes[i].icon.addClass("lock");
                    }
                }
            });

            //setup Group icon click event
            this._tree.element.click(function(e){
                var target=$(e.target);
                if(target.hasClass("tree-icon") && target.parent().hasClass("Group")){
                    var treeNoe=target.parent().parent().data("Node");
                    var node=treeNoe.options.node;
                    if(node.isLock()){
                        node.setLock(false);
                        target.removeClass("lock");
                    }else{
                        node.setLock(true);
                        target.addClass("lock");
                    }

                }
            });

            this._treeRoot=this._tree.getNode(screen.getId());

        },
        createTreeNodeData:function(node){
            return {
                id:node.getId(),
                text:node.getName ? node.getName():node.def.name,
                node:node,
                status:GroupNodeMap[node.classname] ?"collapse": "leaf",
                cls:node.classname
            };
        },
        createChildrenTreeNodeData:function(node){
            var children=node.getChildren();
            var data=[];
            for(var i=0,l=children.length;i<l;i++){
                data.push(this.createTreeNodeData(children[i]));
            }
            return data;
        },
        setSelectNode:function(node){
            var paths=[];

            var parent=node.getParent();

            while(parent){
                paths.push(parent);
                if(parent==this) break;
                parent=parent.getParent();
            }

            var treeNode;
            for(var j=paths.length-1;j>=0;j--){
                parent=paths[j];
                treeNode=this._tree.getNode(parent.getId());
                treeNode.expand();
            }

            this._tree.setSelectedNodeById(node.getId());
        },
        removeNode:function(node){
            this._treeRoot.remove(this._tree.getNode(node.getId()));
        }
    };
    uikit.StructView=StructView;
})();
