/**
 * Date: 12-5-12
 * Time: 下午11:46
 */
(function(){
    var Node=yhge.renderer.html.Node;
    var Sprite=yhge.renderer.html.Sprite;
    var Text=yhge.renderer.html.Text;

    /**
     * hierarchical
     * 可以自定义元素类型
     * 设置多种事件
     */
    var HTMLBuilder=function(){
        this.initialize.apply(this,arguments);
    };
    HTMLBuilder.prototype={

        calssname:"HTMLBuilder",

        initialize:function(){
            this._defaultZOrder=10000;
            this._userDefinedTypes={};
        },
        buildWithJSONDef : function(aJSONDef,parent) {
            if(!parent){
                parent = new Node();
                parent.setZOrder(this._defaultZOrder);
            }
            var elem,def;
            for(var i in aJSONDef){
                def=aJSONDef[i];
                elem = this.buildUI(def,parent);
                parent.addChild(elem);
            }
            return parent;
        },
        buildUI :function( def, parent) {
            var elem = this._createElement(def, parent);

            if (def.children) {
                for (var i in def.children) {
                    var child = this.buildUI(def.children[i],elem);
                    elem.addChild(child);
                }
            }
            return elem;
        },
        _createElement : function(def, parent) {
            var elem = undefined;
            switch(def.type) {
                case "view":
                    elem = this.createView(def);
                    break;
                case "image":
                    elem = this.createImage(def);
                    break;
                case "button":
                    elem = this.createButton(def);
                    break;
                case "label":
                    elem = this.createLabel(def);
                    break;
                case "node":
                    elem = this.createNode(def);
                    break;
                case "sprite":
                    elem = this.createSprite(def);
                    break;
                case "text":
                    elem = this.createText(def);
                    break;
                default:
                    elem = this._createFromUserDefinedMethods(def);
                    break;
            }
            return elem;
        },
        _createUIElement: function(elementType, controller, def){
            var shallowCopy = function(obj)
            {
                var newObj = {};
                var key;
                for (key in obj)
                {
                    if (obj.hasOwnProperty(key))
                    {
                        newObj[key] = obj[key];
                    }
                }
                return newObj;
            };

            var attrs = shallowCopy(def.attrs);

            var action = attrs.action;
            delete attrs.action;

            var elem = new elementType(attrs);

            if (action)
            {
                //elem.trigger("click");
            }
            return elem;
        },
        createButton:function(def){

        },
        createView:function(def){

        },
        createImage:function(def){

        },
        createLabel:function(def){

        },
        createNode:function(def){
            return new Node(def);
        },
        createSprite:function(def){
            return new Sprite(def);
        },
        createText:function(def){
            return new Text(def);
        },
        setDefaultZOrder:function(defaultZOrder){
            this._defaultZOrder=defaultZOrder;
            return this;
        },
        getDefaultZOrder:function(){
            return this._defaultZOrder;
        },
        registerTypeMethod: function(type, methodDefinition)
        {
            if (typeof type === 'string' && typeof methodDefinition === 'function')
            {
                this._userDefinedTypes[type] = methodDefinition;
            }
        },
        _createFromUserDefinedMethods: function(def)
        {
            var type = def.type;
            if(this._userDefinedTypes[type]){
                return this._userDefinedTypes[type](def);
            }
            throw "Element type not found in HTMLBuilder";
            return null;
        }
    };

    yhge.ui.HTMLBuilder=HTMLBuilder;
})();