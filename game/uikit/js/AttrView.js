(function () {
    var AttrView = function () {
        this.initialize.apply(this, arguments);
    };

    AttrView.prototype = {

        initialize:function (attrView) {
            this._argItems = [];
            this._element = attrView;
            this._fixedElements = {};
        },

        setupAttrView:function () {
            this.setupBaseAttrElements();
            this.setupExtAttrView();
            this.setupArgsAttrView();
        },

        setupBaseAttrElements:function () {
            var self = this, form = this._element.children("form")[0];

            this._baseElements = {};
            for (var name in BaseAttr) {
                this._baseElements[name] = $(form[name]);
            }

            //更新显示
            for (var key in this._baseElements) {
                this._baseElements[key].change((function (name) {
                    return function () {
                        var val = this.value;
                        var obj = self._selected;

                        var setter = ViewObjMap[name] && ViewObjMap[name].setter;
                        if (setter) {
                            if (ViewObjMap[name].kind & AttrType[obj.classname]) {

                                switch(ViewObjMap[name].dataType){
                                    case DataType.INT:
                                        val=parseInt(val);
                                        break;
                                    case DataType.FLOAT:
                                        val=parseFloat(val);
                                        break;
                                    case DataType.BOOLEAN:
                                        val=val=="false"?false:true;
                                        break;

                                }

//                                switch (this.name) {
//                                    case "assert":
//                                        val = config.contentRoot + val;
//                                        break;
//                                    case "pos_x":
//                                    case "pos_y":
//                                    case "size_x":
//                                    case "size_y":
//                                        val = parseFloat(val);
//                                        break;
//                                    case "visible":
//                                        val=val=="false"?false:true;
//                                        break;
//                                }
                                if (typeof setter == "function") {
                                    setter(obj, val,self);
                                } else {
                                    obj[setter](val);
                                }
//                                obj.render();
                            }
                        } else {
                            obj.def[this.name] = val;
                        }
//                        $.event.trigger("attrchange",[name,val,obj],self);
                    }
                })(key));
            }
        },
        setupExtAttrView:function () {
            var self = this;
            this._argsView = this._element.children(".args-view");
            this._addArgItemBtn = $("#addArgItem")
                .click(function (e) {
                    self.createAddItemView();
                    e.preventDefault();
                }
            );
        },
        setupArgsAttrView:function () {
            //args view
            var self = this;
            this._argsView = this._element.children(".args-view");
            this._addArgItemBtn = $("#addArgItem")
                .click(function (e) {
                    self.createAddItemView();
                    e.preventDefault();
                }
            );
        },

        createBaseAttrElements:function () {

        },

        createArgsItem:function (name, value) {
            var self = this;
            var argItem = $("<li/>");
            var nameEle = $("<label>" + name + ":</label>");
            var valueEle = $("<input name='" + name + "' value='" + value + "'/>");
            var actEle = $("<a class='btn btn-del'>删除</a>");

            actEle.click(function () {
                var data = self._selected.data("def");
                delete data.info[name];
                argItem.remove();
            });

            valueEle.bind("change", function (e) {
                var data = self._selected.data("def");
                data.info[this.name] = self._dataFormat(this.value);
            });

            argItem.append(nameEle).append(valueEle).append(actEle);
            argItem.nameEle = nameEle;
            argItem.valueEle = valueEle;

            this._argsView.append(argItem);
            this._argItems.push(argItem);
        },
        createAddItemView:function () {
            var self = this;
            var argItem = $("<li/>");
            var nameEle = $("<input name='argsKey' />");
            var valueEle = $("<input name='argsValue'/>");
            var okEle = $("<a href='#' class='btn btn-ok'>确定</a>");
            var cancelEle = $("<a href='#' class='btn btn-cancel'>取消</a>");
            okEle.click(function (e) {
                e.preventDefault();

                var name = nameEle.val();
                var value = valueEle.val();
                argItem.remove();
                self.createArgsItem(name, value);
                var data = self._selected.data("def");
                data.info[name] = self._dataFormat(value);
            });

            cancelEle.click(function (e) {
                argItem.remove();
                e.preventDefault();
            });

            argItem.append(nameEle).append("<span>:</span>").append(valueEle).append(okEle).append(cancelEle);
            this._argsView.append(argItem);
        },
        setObj:function (nodeObj) {
            this.setSelect(nodeObj);
        },
        setSelect:function (nodeObj) {
            if (this._selected != nodeObj) {
//                this._selected && this._selected.getView().removeClass("selected");
                this._selected = nodeObj;
//                this._selected.getView().addClass("selected");
                this.clearAttrView();
                this.updateAttr();
            }
        },
        clearAttrView:function () {
            //clear base attribute
            for (var i in this._baseElements) {
                this._baseElements[i].val("");
            }

            //show use BaseAttr config
            for (var name in this._baseElements) {
                if(BaseAttr[name] & AttrType[this._selected.classname]){
                    this._baseElements[name].parent().show();
                }else{
                    this._baseElements[name].parent().hide();
                }
            }

            this.clearExtAttrView();

            this.clearArgsView();
        },

        clearExtAttrView:function () {

        },

        clearArgsView:function () {
            this._argsView.empty();
            this._argItems = [];
        },

        updateAttr:function () {
            var obj = this._selected;

            //普通值
            var getter, handle;
            //do in ObjToAttrViewMap
            for (var name in ViewObjMap) {
                if (this._baseElements[name]) {
                    if (ViewObjMap[name].kind & AttrType[obj.classname]) {
                        getter = ViewObjMap[name].getter;
                        if (typeof getter == "function") {
                            this._baseElements[name].val(getter(obj));
                        } else {
                            this._baseElements[name].val(obj[getter]());
                        }
                    }
                } else {
                    handle = ViewObjMap[name].handle;
                    if (typeof handle == "function") {
                        handle(this, null, obj);
                    }
                }
            }
            //也可以在ViewObjMap定义特殊的不返回obj的属性，直接返回def值
            /*
             fontType:{
                 kind:AttrType.Sprite,
                 getter:function(obj){
                     return obj.def.fontType;
                 },
                 setter:function(obj,value){
                     obj.def.fontType=value;
                }
             },
             */
            var def = obj.def;
                if(def){
                var info = def.info;
                delete def.info;
                for (var name in def) {
                    if (!ViewObjMap[name] && this._baseElements[name]) {
                        //定义属性
                        if (this._baseElements[name]) {
                            this._baseElements[name].val(def[name]);
                        } else {
                            //扩展属性
                        }
                    }
                }
                //特殊值。可扩展
                if (info) {
                    for (var name in info) {
                        this.createArgsItem(name, info[name]);
                    }
                }
                def.info = info;
            }
        },
        //view -> attr
        updatePosition:function (x, y) {
            if (x != null) {
                this._baseElements.pos_x.val(x);
            }
            if (y != null) {
                this._baseElements.pos_y.val(y);
            }
        },
        updateSize:function (width, height) {
            var data = this._selected.data("def");
            if (width != null) {
                this._fixedElements.size_x.val(width);
                data.size_x = width;
            }
            if (height != null) {
                this._fixedElements.size_y.val(height);
                data.size_y = height;
            }
        },

        _dataFormat:function (v) {
            if (typeof v == "string") {
                //true
                if (v === "true" || v === "TRUE") {
                    v = true;
                } else if (v === "false" || v === "FALSE") {
                    v = false;
                    //整数
                } else if (/^-?\d+$/.test(v)) {
                    v = parseInt(v);
                    //浮点数
                } else if (/^(-?\d+)(\.\d+)?$/.test(v)) {
                    v = parseFloat(v);
                }
            }
            return  v;
        }
    };
    function getColorFromString(colorString) {
        var color;
        if (colorString.charAt(0) == "#") {
            var r = colorString.substr(1, 2);
            var g = colorString.substr(3, 2);
            var b = colorString.substr(5, 2);
            var a = colorString.substr(7, 2);
            color = {
                r:parseInt(r, 16),
                g:parseInt(g, 16),
                b:parseInt(b, 16)
            };
            if (a) color.a = parseInt(a, 16);
        }
        return color;
    }

    uikit.AttrView=AttrView;
})();