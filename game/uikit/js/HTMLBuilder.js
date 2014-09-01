/**
 * Date: 12-5-12
 * Time: 下午11:46
 */
(function () {
    var Node = yhge.renderer.html.Node;
    var Sprite = yhge.renderer.html.Sprite;
    var Text = yhge.renderer.html.Text;
    var Button = uikit.Button;
    var TFButton = uikit.TFButton;
    var Group=uikit.Group;


    var HTMLBuilder = function () {
        this.initialize.apply(this, arguments);
    };
    HTMLBuilder.prototype = {

        calssname:"HTMLBuilder",

        initialize:function (attrs) {
            this._basePath = attrs.basePath || "";
            this._defaultZOrder = 10000;
        },
        buildWithJSONDef:function (def, parent) {
            if (!parent) {
                parent = new Node();
                parent.setZOrder(this._defaultZOrder);
            }
            //build images
            var images = def.images;
            if (images) {
                for (var img, i = 0, l = images.length; i < l; i++) {
                    img = this.createImage(images[i]);
                    parent.addChild(img);
                }
            }
            //build labels
            var labels = def.labels;
            if (labels) {
                for (var label, i = 0, l = labels.length; i < l; i++) {
                    label = this.createLabel(labels[i]);
                    parent.addChild(label);
                }
            }

            //build button
            var buttons = def.buttons;
            if (buttons) {
                for (var button, i = 0, l = buttons.length; i < l; i++) {
                    button = this.createButton(buttons[i]);
                    parent.addChild(button);
                }
            }

            //build TFButton
            var tfbuttons = def.tfbuttons;
            if (tfbuttons) {
                for (var button, i = 0, l = tfbuttons.length; i < l; i++) {
                    button = this.createTFButton(tfbuttons[i]);
                    parent.addChild(button);
                }
            }

            var data;
            for (i in def.lists) {
                data = def.lists[i];
                parent.addChild(this.createListView(data));

            }

            for (i in def.progressBar) {
                data = def.progressBar[i];
                parent.addChild(this.createProgressBar(data));
            }

            for (var i in def.comboBoxs) {
                data = def.comboBoxs[i];
                parent.addChild(this.createComboBox(data));
            }

            for (var i in def.UIEditText) {
                data = def.UIEditText[i];
                parent.addChild(this.createUIEditText(data));
            }

            for (var i in def.groups) {
                data = def.groups[i];
                var defnName = data.groupDefinition;

                if( def.groupDefinitions && def.groupDefinitions[defnName] ){
                    var group=this.createGroups(data);
                    parent.addChild(group);
                    this.buildWithJSONDef( def.groupDefinitions[defnName], group);
                    group._elementDefine=def.groupDefinitions[defnName];
                }
            }

            return parent;
        },

        createImage:function (def) {
            var self = this;
            def.info = def.info || {};

            var sprite = new Sprite();
            sprite.def = def;

            this.setAttributes(sprite, def);

            return sprite;
        },


        createLabel:function (def) {
            var self = this;
            def.info = def.info || {};

            var txt = new Text();
            txt.def = def;

            this.setAttributes(txt, def);

            return txt;
        },

        createButton:function (def) {
            var self = this;
            def.info = def.info || {};

            var btn = new Button();
            btn.def = def;

            this.setAttributes(btn, def);

            return btn;
        },

        createTFButton:function (def) {
            var self = this;
            def.info = def.info || {};

            var btn = new TFButton(null, def.text, def.type);
            btn.def = def;

            this.setAttributes(btn, def);

            return btn;
        },

        createListView:function (def) {
            var self = this;
            def.info = def.info || {};

            var listView = new Node();
            listView.def = def;
            this.setAttributes(listView, def);

            return listView;
        },

        createProgressBar:function (def) {
            var self = this;
            def.info = def.info || {};

            var processBar = new Node();
            processBar.def = def;
            this.setAttributes(processBar, def);

            return processBar;
        },

        createComboBox:function (def) {
            var self = this;
            def.info = def.info || {};

            var comboBox = new Node();
            comboBox.def = def;
            this.setAttributes(comboBox, def);

            return comboBox;
        },

        createUIEditText:function (def) {
            var self = this;
            def.info = def.info || {};

            var uieditText = new Node();
            uieditText.def = def;
            this.setAttributes(uieditText, def);

            return uieditText;
        },

        createGroups:function (def) {
            var self = this;
            def.info = def.info || {};

            var groups = new Group();
            groups.def = def;
            this.setAttributes(groups, def);

            return groups;
        },

        setAttributes:function (node, def) {
            var val, setter;
            for (var k in def) {
                if (DefObjMap[k]) {
                    if (DefObjMap[k].kind & AttrType[node.classname]) {
                        val = def[k];
                        setter = DefObjMap[k].setter;
                        if (setter) {
                            if (typeof setter == "function") {
                                setter(node, val, def);
                            } else {
                                node[setter](val);
                            }
                        }
                    }
                }
            }
        },


        setBasePath:function (basePath) {
            this._basePath = basePath;
            return this;
        },
        getBasePath:function () {
            return this._basePath;
        },
        setDefaultZOrder:function (defaultZOrder) {
            this._defaultZOrder = defaultZOrder;
            return this;
        },
        getDefaultZOrder:function () {
            return this._defaultZOrder;
        }

    };
    var defaultInstance;
    HTMLBuilder.getDefaultBuilder = function () {
        if (!defaultInstance) {
            defaultInstance = new HTMLBuilder();
        }
        return defaultInstance;
    };
    HTMLBuilder.calcAnchor = function (anchorDef) {
        var anchor = [0.5, 0.5];
        if (anchorDef) {
            if (anchorDef.indexOf("l") >= 0) {
                // left
                anchor[0] = [0];
            } else if (anchorDef.indexOf("r") >= 0) {
                // right
                anchor[0] = [1];
            }

            if (anchorDef.indexOf("t") >= 0) {
                // left
                anchor[1] = [0];
            } else if (anchorDef.indexOf("b") >= 0) {
                // right
                anchor[1] = [1];
            }
        }
        return anchor;
    };

    HTMLBuilder.anchorToString = function (anchor, width, height) {
        var pos_origin = "";
        switch (parseInt(100 * anchor.x / width)) {
            case 0:
                pos_origin += "l";
                break
            case 50:
                break;
            case 100:
                pos_origin += "r"
                break;
        }
        switch (parseInt(100 * anchor.y / height)) {
            case 0:
                pos_origin += "t";
                break
            case 50:
                break;
            case 100:
                pos_origin += "m"
                break;
        }
        return pos_origin;
    };
    uikit.HTMLBuilder = HTMLBuilder;
})();