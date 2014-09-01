/*
 * yh v0.11
 */

/*
 *定义类与部件
 */
(function($){
  $.YH=$.YH||{};
    /**
     * 静态方法，供全局使用
     */
  $.extend($.YH, {
        position: function(pos, ele){
            return this.getPositionOfWindow(pos,ele);
        },
        /**
         * 计算位置，相对于窗口
         * @param {Object} pos 坐标通常使用数组做为参数。如果使用dom元素坐为参数，则返回dom元素的偏移量
         * @param {Object} ele
         */
        getPositionOfWindow: function(pos, ele){
            var doc = $(document), pTop = doc.scrollTop(), pLeft = doc.scrollLeft(),offset=this.getOffsetInContainer(pos,ele,window)/*, minTop = pTop*/;
            offset.top+=pTop;
            offset.left+=pLeft;
            //pTop = Math.max(pTop, minTop);//使得含有标题的窗体的标题可见，像window部件，如果不可见则不能拖动。
            return offset;
        },
        //某个元素在容器中的位置，转换到文档的绝对位置
        getOffsetInContainer: function(pos, ele,container){
            if (pos == undefined) {
                pos = [0, 0];
            }
            ele=ele.jquery?ele:$(ele);
            var wnd = $(container),offset=wnd.offset()||{top:0,left:0},pTop = offset.top, pLeft =  offset.left;
            if (pos.length == 1) {
                pos[1] = "middle";
            }
            if (pos[0].constructor == Number) {
                pLeft += pos[0];
            } else {
                switch (pos[0]) {
                    case 'left':
                        pLeft += 0;
                        break;
                    case 'right':
                        pLeft += wnd.width() - ele.outerWidth();
                        break;
                    case 'center':
                    default:
                        pLeft += (wnd.width() - ele.outerWidth()) / 2;
                }
            }
            if (pos[1].constructor == Number) {
                pTop += pos[1];
            } else {
                switch (pos[1]) {
                    case 'top':
                        pTop += 0;
                        break;
                    case 'bottom':
                        pTop += wnd.height() - ele.outerHeight();
                        break;
                    case 'middle':
                    default:
                        pTop += (wnd.height() - ele.outerHeight()) / 2;
                }
            }
            return {
                left: pLeft,
                top: pTop
            };
        },
       /**
        * 
        * @param ele
        * @param xy 0-none,1-x,2-y,3-x+y
        * @param pos
        *   
        * @return
        */
        getBesidePositionOfElement: function(ele,xy,pos){
            ele = $(ele);
            if (ele.length > 0) {
                var offset = ele.offset();
                switch (xy){
                    case 1:
                        offset.left += ele.outerWidth();
                        break;
                    case 2:
                        offset.top += ele.outerHeight();
                        break;
                    case 3:
                        offset.left += ele.outerWidth();
                        offset.top += ele.outerHeight();
                        break;

                }
                if (pos) {
                    offset.left += pos.left==undefined?pos[0]?pos[0]:0:pos.left;
                    offset.top += pos.top==undefined?pos[1]?pos[1]:0:pos.top;
                }
                return offset;
            }
        },
        /**
         * 处理取得元素的配置
         * @param {Object} confItem
         */
        parseConfig: function(confItem){
            if (confItem) {
                if (typeof confItem == "string") {
                    confItem = {
                        cls: confItem
                    };
                }
                if (!confItem.nodeType && !(confItem instanceof jQuery) && !confItem.selector) {
                    confItem.selector = "." + confItem.cls;
                }
            }
            return confItem;
        },
        checkConfig: function(confItem){
            return this.parseConfig(confItem);
        },
        /**
         * 根据配置得到jquery对象
         * 如果ops带selector先从content的子对像在找，未找到则从document找，如果未找到则新建，并加入到content的元素。
         * 如果ops是jQuery对象，直接返回
         * 如果ops是dom元素，则返回jQuery对象
         * @param {Object} ops
         * @param {Object} content
         * @param {string|boolean} add fasle表示不添加到content，默认为appendTo
         * @return jQuery [display Object dom]
         *
         */
        getObj: function(ops, content, template,add){
            var ret = null, selector,template=template||ops.template
                add=typeof add=="undefined"?'appendTo':add;
            if (ops) {
                if (ops instanceof jQuery) {
                    ret = ops;
                } else if (ops.nodeType) {
                    ret = $(ops);
                } else {
					ops=this.parseConfig(ops);
                    selector = ops.selector;
                    if (typeof selector == "string") {
                        ret = content.find(selector);
                        if (ret.length == 0) {
							//防止选取全局相同的东西
                            if(ops.global!==false && selector!='.'+ops.cls){
                            	ret = $(selector);
                            }
                            if (ret.length == 0) {
                                ret = $(template).addClass(ops.cls);
                                if(add){
                                    ret[add](content);
                                }
                            }
                        }
                        
                    }else if(template){
                        ret = $(template).addClass(ops.cls);
                        if(add){
                            ret[add](content);
                        }
                    }
                }
            }
            return ret;
        },
        template: function(tmpstr, data){
            var re = /\{([\w\.]*)\}/g;
            //re.test(tmpstr) 性能改善不是很大
            return tmpstr.replace(re, function(a, b){
                return $.YH.attr(data, b);
            });
        },
        /**
         * 取出对象的值
         * 对于取对像的子值十分有用
         * @param {Object} obj 某个对像
         * @param {Object} name 值的名称，使用"."分隔
         *
         * 对像user的属性user.school.master.name="test"
         * arrt(user,"school.master.name")=="test"
         * 
         * user.school.master=[{"name":"test"},{"name":"test2"}]
         * arrt(user,"school.master.0.name")=="test"
         */
        attr: function(obj, name,v){
            if(typeof v=="undefined")
                return this.getAttr(obj,name);
            else
                return this.setAttr(obj,name,v);
        },
        getAttr: function(obj, name){
            var r, t;
            if (name.indexOf(".") > -1) {
                t = name.split(".");
                r = obj[t[0]];
                for (var i = 1; i < t.length; i++) {
                    r = r[t[i]];
                }
            } else {
                r = obj[name];
            }
            return r;
        },
        /**
         * 这里使用与attr相同的获取含有"."的值，为了成功赋值，则使用重复获取"."值代码。
         * @param {Object} obj
         * @param {Object} name
         * @param {Object} v
         */
        setAttr:function(obj,name,v){
            var r,t;
            if(name==null||name==''){
                r=obj;
            }else if (name.indexOf(".") > -1) {
                t = name.split(".");
                r = obj[t[0]];
                for (var i = 1; i < t.length; i++) {
                    r=r[t[i]];
                }
            } else {
               r=obj[name];
            }
            $.extend(r,v);
            return obj;
        },
         /**
         * 实现继承
         * 子覆盖父，前面覆盖后面，与extend相反
         */
        implement: function(){
            var l = arguments.length, target = arguments[0] || {}, deep = false, i = 1;
            
            if (typeof(target) == 'boolean') {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            
            for (; i < l; i++) {
                var object = arguments[i];
                if (typeof(object) != 'object') 
                    continue;
                for (var key in object) {
                    var op = object[key], mp = target[key];
                    
                    //target存在改属性，则跳过||阻止死循环
                    if (target === op) {
                        continue;
                    }
                    if (mp) {
                        if (deep && typeof(op) == 'object' && typeof(mp) == 'object') {
                            target[key] = $.YH.implement(deep, mp, op);
                        }
                    } else {
                        target[key] = op;
                    }
                }
            }
            return target;
        },
        extendOriginal: function(Class, prop, cls){
            if (typeof prop == 'object') {
                for (var name in prop) {
                    if (!Class.prototype[name]) {
                        Class.prototype[name] = prop[name];
                    }
                }
            }
            if (typeof cls == 'object') {
                for (var p in cls) {
                    if (!Class[p]) {
                        Class[p] = cls[p];
                    }
                }
            }
        },
        _count:0,
        UUID:function(){
            return "yh"+this._count++;
        }
        //others
        ,
        isArray:function(obj){
            return obj instanceof Array;
        },
        isFunction:function(obj){
            return obj instanceof Function;
        }
         
    });
        
    /**
     *  通用继承的方法
     */
    $.common = {
        /**
         * 设置配置参数
         * @param {Object} key
         * @param {Object} value
         */
        option: function(key, value){
            var options = key;
            
            if (typeof key === "string") {
                if (value === undefined) 
                    return this.options[key];
                else {
                    options = {};
                    options[key] = value;
                }
            }
            $.extend(this.options, options);
        }
    };
})(jQuery);
/*
 *定义类与部件
 */
(function($){
    var objectPrototype = Object.prototype;

    YH=$.My=$.YH = $.YH || {};
    
    $.YH.ucfirst = function(str){
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    }
    
    $.YH.lcfirst = function(str){
        str += '';
        var f = str.charAt(0).toLowerCase();
        return f + str.substr(1);
    }
    /*
     *创建命名空间
     */
    $.YH.createNameSpace  = function(name){
        var namespace = name.split("."), name = namespace.pop(), ns = $, p;
        for (var ii in namespace) {
            p = $.YH.ucfirst(namespace[ii]);
            ns = (p in ns ? ns[p] : ns[p] = {});
        }
        return {
            "ns": ns,
            "cName": name
        };
    };

    /**
     *单继承

     如果指定了subclass，则是否调用superclass的构造函数由sub class决定。
     var A=function  () {
         A.superclass.apply(this,arguments);
        //this.constructor.superclass.apply(this,arguments);//一不小心，引起死循环
        this.a=1;
    }
    var B=function  () {
        B.superclass.apply(this,arguments);
        //this.constructor.superclass.apply(this,arguments);//一不小心，引起死循环
        this.b=2;
    }
    var C=function  () {
        this.c=3;
    }
    extend(B,C);
    extend(A,B);
     */
    $.YH.extend=function(subclass, superclass, overrides) {
        
        if (typeof superclass=="object") {
            overrides = superclass;
            superclass = subclass;
            subclass = overrides.constructor !== objectPrototype.constructor ? overrides.constructor : function() {
                superclass.apply(this, arguments);
            };
        }

        if (!superclass) {
//            throw({
//                sourceClass: 'YH',
//                sourceMethod: 'extend',
//                msg: 'Attempting to extend from a class which has not been loaded on the page.'
//            });
            return;
        }
        // Copy statics from superclass.
        $.extend(true,subclass,superclass);

        // Copy prototype from superclass.
        var F = function() {},
            subclassProto, superclassProto = superclass.prototype;

        F.prototype = superclassProto;
        subclassProto = subclass.prototype = new F();
        subclassProto.constructor = subclass;
        subclass._super_=superclassProto;
		//subclass.superclass = superclass;
        //subclass.superclass = superclassProto;

        if (superclassProto.constructor === objectPrototype.constructor) {
            superclassProto.constructor = superclass;
        }

        overrides && $.extend(true,subclassProto,overrides);
        
        return subclass;
    };
    /*
     *申明类
     *name String
     *prototype Object 原型对象
     *content	Object 类属性
     */
    $.YH.declare  = function(name, prototype, content){
        var nsc = $.YH.createNameSpace(name);
        var cName = $.YH.ucfirst(nsc.cName);
        nsc.ns[cName] = function(element, options){
            //this._cs=this.constructor;
            //引用类，直接使用this.constructor
            this.widgetBaseClass = this.constructor || content;
            this.namespace = this.constructor.nameSpace;
            this.widgetName = this.className = this.constructor.className;
            //防止原型与定义函数不一致，使用BaseClass。
            this.BaseClass = nsc.ns[cName];
            //处理参数
            if (!element) {
                element = [];
            } else if (element != window && typeof options == 'undefined' && typeof element.nodeType == 'undefined') {
                options = element;
                element = [];
            }
            
            this.options = $.extend({}, nsc.ns[cName].defaults, options);
            
            this.element = element.BaseClass?element:$(element);
            if ($.isFunction(this._init)) {
                return this._init();
            }
        };
        //扩充自身属性
        if (typeof content != 'undefined') 
            $.extend(nsc.ns[cName], content);
        //命名空间
        nsc.ns[cName].nameSpace = nsc.ns;
        //名称
        nsc.ns[cName].className = nsc.ns[cName].cName = cName;
        //添加 prototype
        //使用extend，对以后new 对像要快。见tests/constructora.html,tests/constructorb.html
        $.extend(nsc.ns[cName].prototype, prototype);
        //nsc.ns[cName].prototype = prototype;
        //直接赋值导致constructor的改变，必须修改过来。或不改变prototype，直接使用$.extend扩展。$.extend(nsc.ns[cName].prototype, prototype);
        //nsc.ns[cName].prototype.constructor=nsc.ns[cName];
        return nsc.ns[cName];
    };
    $.YH.Class = function(){
        var name = arguments[0], 
            prototype = arguments[1], 
            cls,self,
            _parent=null;//父类的prototype方法,如果父类有几个则是其和
        
        if (arguments.length == 3) {
            //name,prototype,content||fatherClass
            cls = arguments[2];
            if (cls.prototype != null) {
                _parent=cls.prototype;
                prototype = $.extend({}, cls.prototype, prototype);
            }
        } else if (arguments.length == 4) {
            //name,prototype,content,fatherClass
            var cnt = arguments[2];
            var fCls = arguments[3];
            cls = $.extend(true, {}, fCls, cnt);
            if (fCls.prototype != null) {
                _parent=fCls.prototype;
                prototype = $.extend({}, fCls.prototype, prototype);
            }
        } else {
            //扩展原型
            var args = [{}];
            for (var i = arguments.length-1; i>1 ; i--) {
                if (arguments[i].prototype) {
                    args.push(arguments[i].prototype);
                }
            }
            _parent=$.extend.apply(this, args);
            prototype = $.extend({},_parent,prototype);
            //扩展自身属性
            arguments[0] = true;
            arguments[1] = {};
            cls = $.extend.apply(this, arguments);
        }
        self=$.YH.declare(name, prototype, cls);
        self.prototype._parent=_parent;
        return self;
    };
    /*
     *申明部件
     */
    $.YH.widget = function(name, prototype, content){
        var dec, wdName;
        if (typeof prototype == 'function') {
            dec = prototype;
            wdName = $.YH.lcfirst(name)
        } else {
            dec = $.YH.declare(name, prototype, content);
            wdName = $.YH.lcfirst(dec.cName);
        }
        // create plugin method
        $.fn[wdName] = function(options){
            var isMethodCall = (typeof options == 'string'), args = Array.prototype.slice.call(arguments, 1);
            
            // @修饰的方法，返回widget的值，而不是返回jQuery对象.第二个参数（紧跟@修饰的方法的参数）为第几个dom对应的widget
            // 直接调用返回jQuery对象
            if (isMethodCall) {
                switch (options.substring(0, 1)) {
                    case '_':
                        return this;
                    case '@':
                        var ind = args.shift() || 0;
                        var dom = this[ind];
                        var instance = dom && $.data(dom, wdName);
                        return (instance ? instance[options.substring(1)].apply(instance, args) : undefined);
                }
            }
            
            // handle initialization and non-getter methods
            return this.each(function(){
                var instance = $.data(this, wdName);
                if (instance && isMethodCall && $.isFunction(instance[options])) {
                    instance[options].apply(instance, args)
                } else if (!isMethodCall && !instance) {
                    instance = new dec(this, options);
                    $.data(this, wdName, instance);
                }
            });
        };
    };
})(jQuery);
/*
 *定义类与部件
 */
(function($){
    /**
     *  通用继承的方法
     */
    $.common = {
        /**
         * 设置配置参数
         * @param {Object} key
         * @param {Object} value
         */
        option: function(key, value){
            var options = key;
            
            if (typeof key === "string") {
                if (value === undefined) 
                    return this.options[key];
                else {
                    options = {};
                    options[key] = value;
                }
            }
            $.extend(this.options, options);
        }
    };
    /**
     * 静态方法，供全局使用
     */
    $.My = $.YH = {
        /**
         * 计算位置，相对于窗口
         * @param {Object} pos 坐标通常使用数组做为参数。如果使用dom元素坐为参数，则返回dom元素的偏移量
         * @param {Object} ele
         */
        position: function(pos, ele){
            return this.getPositionOfWindow(pos,ele);
        },
        getPositionOfWindow: function(pos, ele){
            if (pos == undefined) {
                pos = [0, 0];
            }
            
            var wnd = $(window), doc = $(document), pTop = doc.scrollTop(), pLeft = doc.scrollLeft(), minTop = pTop;
            if (pos.length == 1) {
                pos[1] = "middle";
            }
            if (pos[0].constructor == Number) {
                pLeft += pos[0];
            } else {
                switch (pos[0]) {
                    case 'left':
                        pLeft += 0;
                        break;
                    case 'right':
                        pLeft += wnd.width() - ele.outerWidth();
                        break;
                    case 'center':
                    default:
                        pLeft += (wnd.width() - ele.outerWidth()) / 2;
                }
            }
            if (pos[1].constructor == Number) {
                pTop += pos[1];
            } else {
                switch (pos[1]) {
                    case 'top':
                        pTop += 0;
                        break;
                    case 'bottom':
                        pTop += wnd.height() - ele.outerHeight();
                        break;
                    case 'middle':
                    default:
                        pTop += (wnd.height() - ele.outerHeight()) / 2;
                }
            }
            pTop = Math.max(pTop, minTop);
            return {
                left: pLeft,
                top: pTop
            };
        },
       /**
        * 
        * @param ele
        * @param xy 0-none,1-x,2-y,3-x+y
        * @param pos
        *   
        * @return
        */
        getBesidePositionOfElement: function(ele,xy,pos){
            ele = $(ele);
            if (ele.length > 0) {
                var offset = ele.offset();
                switch (xy){
                    case 1:
                        offset.left += ele.outerWidth();
                        break;
                    case 2:
                        offset.top += ele.outerHeight();
                        break;
                    case 3:
                        offset.left += ele.outerWidth();
                        offset.top += ele.outerHeight();
                        break;

                }
                if (pos) {
                    offset.left += pos.left==undefined?pos[0]?pos[0]:0:pos.left;
                    offset.top += pos.top==undefined?pos[1]?pos[1]:0:pos.top;
                }
                return offset;
            }
        },
        /**
         * 实现继承
         * 子覆盖父，前面覆盖后面，与extend相反
         */
        implement: function(){
            var l = arguments.length, target = arguments[0] || {}, deep = false, i = 1;
            
            if (typeof(target) == 'boolean') {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            
            for (; i < l; i++) {
                var object = arguments[i];
                if (typeof(object) != 'object') 
                    continue;
                for (var key in object) {
                    var op = object[key], mp = target[key];
                    
                    //target存在改属性，则跳过||阻止死循环
                    if (target === op) {
                        continue;
                    }
                    if (mp) {
                        if (deep && typeof(op) == 'object' && typeof(mp) == 'object') {
                            target[key] = $.YH.implement(deep, mp, op);
                        }
                    } else {
                        target[key] = op;
                    }
                }
            }
            return target;
        },
        /**
         * 根据配置得到jquery对象
         * 如果ops带selector先从content的子对像在找，未找到则从document找，如果未找到则新建，并加入到content的元素。
         * 如果ops是jQuery对象，直接返回
         * 如果ops是dom元素，则返回jQuery对象
         * @param {Object} ops
         * @param {Object} content
         * @return jQuery [display Object dom]
         *
         */
        getObj: function(ops, content, template){
            var ret = null, selector;
            if (ops) {
            	template=template||ops.template
                if (ops instanceof jQuery) {
                    ret = ops;
                } else if (ops.nodeType) {
                    ret = $(ops);
                } else {
					ops=this.checkConfig(ops);
                    selector = ops.selector;
                    if (typeof selector == "string") {
                        ret = content.find(selector);
                        if (ret.length == 0) {
							//防止选取全局相同的东西
                            if(ops.global!==false && selector!='.'+ops.cls){
                            	ret = $(selector);
                            }
                            if (ret.length == 0) {
                                ret = $(template).appendTo(content).addClass(ops.cls);
                            }
                        }
                        
                    }else if(template){
                         ret = $(template).appendTo(content).addClass(ops.cls);
                    }
                }
            }
            return ret;
        },
        template: function(tmpstr, data){
            var re = /\{([\w\.]*)\}/g;
            //re.test(tmpstr) 性能改善不是很大
            return tmpstr.replace(re, function(a, b){
                return $.YH.attr(data, b);
            });
        },
        /**
         * 取出对象的值
         * 对于取对像的子值十分有用
         * @param {Object} obj 某个对像
         * @param {Object} name 值的名称，使用"."分隔
         *
         * 对像user的属性user.school.master.name="test"
         * arrt(user,"school.master.name")=="test"
         * 
         * user.school.master=[{"name":"test"},{"name":"test2"}]
         * arrt(user,"school.master.0.name")=="test"
         */
        attr: function(obj, name){
            var r, t;
            if (name.indexOf(".") > -1) {
                t = name.split(".");
                r = obj[t[0]];
                for (var i = 1; i < t.length; i++) {
                    r = r[t[i]];
                }
            } else {
                r = obj[name];
            }
            return r;
        },
        /**
         * 这里使用与attr相同的获取含有"."的值，为了成功赋值，则使用重复获取"."值代码。
         * @param {Object} obj
         * @param {Object} name
         * @param {Object} v
         */
        setAttr:function(obj,name,v){
            var r,t;
            if (name.indexOf(".") > -1) {
                t = name.split(".");
                r = obj[t[0]];
                for (var i = 1; i < t.length; i++) {
                    r[t[i]]=v;
                }
            } else {
                obj[name]=v;
            }
            return obj;
        },
        /**
         * 处理取得元素的配置
         * @param {Object} confItem
         */
        parseConfig: function(confItem){
            if (confItem) {
                if (typeof confItem == "string") {
                    confItem = {
                        cls: confItem
                    };
                }
                if (!confItem.nodeType && !(confItem instanceof jQuery) && !confItem.selector) {
                    confItem.selector = "." + confItem.cls;
                }
            }
            return confItem;
        },
		checkConfig: function(confItem){
            if (confItem) {
                if (typeof confItem == "string") {
                    confItem = {
                        cls: confItem
                    };
                }
                if (confItem.selector==null) {
                    confItem.selector = "." + confItem.cls;
                }
            }
            return confItem;
        },
        extendOriginal: function(Class, prop, cls){
            if (typeof prop == 'object') {
                for (var name in prop) {
                    if (!Class.prototype[name]) {
                        Class.prototype[name] = prop[name];
                    }
                }
            }
            if (typeof cls == 'object') {
                for (var p in cls) {
                    if (!Class[p]) {
                        Class[p] = cls[p];
                    }
                }
            }
        },
        _count:0,
        UUID:function(){
            return "yh"+this._count++;
        },
        ucfirst: function(str){
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        },
        lcfirst: function(str){
            str += '';
            var f = str.charAt(0).toLowerCase();
            return f + str.substr(1);
        }
        
    };
    /*
     *创建命名空间
     */
    $.YH.createNameSpace = $.createNameSpace = function(name){
        var namespace = name.split("."), name = namespace.pop(), ns = this, p;
        for (var ii in namespace) {
            p = $.YH.ucfirst(namespace[ii]);
            ns = (p in ns ? ns[p] : ns[p] = {});
        }
        return {
            "ns": ns,
            "cName": name
        };
    };
    /*
     *申明类
     *name String
     *prototype Object 原型对象
     *content	Object 类属性
     */
    $.YH.declare = $.declare = function(name, prototype, content){
        var nsc = $.createNameSpace(name);
        var cName = $.YH.ucfirst(nsc.cName);
        nsc.ns[cName] = function(element, options){
            //this._cs=this.constructor;
            //引用类，直接使用this.constructor
            this.widgetBaseClass = this.constructor || content;
            this.namespace = this.constructor.nameSpace;
            this.widgetName = this.className = this.constructor.className;
            //防止原型与定义函数不一致，使用BaseClass。
            this.BaseClass = nsc.ns[cName];
            //处理参数
            if (!element) {
                element = [];
            } else if (element != window && typeof options == 'undefined' && typeof element.nodeType == 'undefined') {
                options = element;
                element = [];
            }
            
            this.options = $.extend({}, nsc.ns[cName].defaults, options);
            
            this.element = $(element);
            if ($.isFunction(this._init)) {
                return this._init();
            }
        };
        //扩充自身属性
        if (typeof content != 'undefined') 
            $.extend(nsc.ns[cName], content);
        //命名空间
        nsc.ns[cName].nameSpace = nsc.ns;
        //名称
        nsc.ns[cName].className = nsc.ns[cName].cName = cName;
        //添加 prototype
        //使用extend，对以后new 对像要快。见tests/constructora.html,tests/constructorb.html
        $.extend(nsc.ns[cName].prototype, prototype);
        //nsc.ns[cName].prototype = prototype;
        //直接赋值导致constructor的改变，必须修改过来。或不改变prototype，直接使用$.extend扩展。$.extend(nsc.ns[cName].prototype, prototype);
        //nsc.ns[cName].prototype.constructor=nsc.ns[cName];
        return nsc.ns[cName];
    };
    /*
     *申明部件
     */
    $.YH.widget = $.myWidget = function(name, prototype, content){
        var dec, wdName;
        if (typeof prototype == 'function') {
            dec = prototype;
            wdName = $.YH.lcfirst(name)
        } else {
            dec = $.YH.declare(name, prototype, content);
            wdName = $.YH.lcfirst(dec.cName);
        }
        // create plugin method
        $.fn[wdName] = function(options){
            var isMethodCall = (typeof options == 'string'), args = Array.prototype.slice.call(arguments, 1);
            
            // @修饰的方法，返回widget的值，而不是返回jQuery对象.第二个参数（紧跟@修饰的方法的参数）为第几个dom对应的widget
            // 直接调用返回jQuery对象
            if (isMethodCall) {
                switch (options.substring(0, 1)) {
                    case '_':
                        return this;
                    case '@':
                        var ind = args.shift() || 0;
                        var dom = this[ind];
                        var instance = dom && $.data(dom, wdName);
                        return (instance ? instance[options.substring(1)].apply(instance, args) : undefined);
                }
            }
            
            // handle initialization and non-getter methods
            return this.each(function(){
                var instance = $.data(this, wdName);
                if (instance && isMethodCall && $.isFunction(instance[options])) {
                    instance[options].apply(instance, args)
                } else if (!isMethodCall && !instance) {
                    instance = new dec(this, options);
                    $.data(this, wdName, instance);
                }
            });
        };
    };
    $.YH.Class = function(){
        var name = arguments[0], prototype = arguments[1], cls,_parent=null,self;
        
        //name,prototype,content||fatherClass
        if (arguments.length == 3) {
            cls = arguments[2];
            if (cls.prototype != null) {
                prototype = $.extend({}, cls.prototype, prototype);
            }
            //name,prototype,content,fatherClass
        } else if (arguments.length == 4) {
            var cnt = arguments[2];
            var fCls = arguments[3];
            cls = $.extend(true, {}, fCls, cnt);
            if (fCls.prototype != null) {
            	_parent=fCls.prototype;
                prototype = $.extend({}, fCls.prototype, prototype);
            }
        } else {
            //扩展原型
            var args = [{}];
            for (var i = arguments.length-1; i>=0 ; i--) {
                if (arguments[i].prototype) {
                    args.push(arguments[i].prototype);
                }
            }
            _parent=$.extend.apply(this, args);
            prototype = $.extend({},_parent,prototype);
            //扩展自身属性
            arguments[0] = true;
            arguments[1] = {};
            cls = $.extend.apply(this, arguments);
        }
        self=$.YH.declare(name, prototype, cls);
        self.prototype._parent=_parent;
    };
})(jQuery);
/**
 * 阻止移动过程中选中
 * 
	IE:
	   1.设置selectstart使其返回false。(chrome下也适用)---最佳方法
	   2.设置属性unselectable为on，并设置其所月子结点的unselectable属on。(对于指定了某个元素为handle比较适用)
	   3.捕获事件(setCapture，releaseCapture)
	   4.在mousemove中调用selection.empty()
	   5.document的mousemove返回false。(preventDefault也可以)
	非IE:
	   1.设置mousedown返回false。(preventDefault也可以)---最佳方法
	   2.设置user-select样式为none。
	   3.在mousemove中调用window.getSelection().removeAllRanges()－－FF,safari,chrome
   					document.selection = null--Opera
 */
(function($){
    $.YH.Mouse = {
        _enable:true,
        _mouseStarted: false,
		_mouseInit:function(){
			var self = this;
            this.handle
			.bind("mousedown",function(e){
                self._mouseDown(e);
				//return false;//选回false，jQuery自动调用 event.preventDefault();event.stopPropagation(); 
            })
            .css({ 'MozUserSelect': 'none', "KhtmlUserSelect": "none", 'UserSelect': 'none',"WebkitUserSelect":"none"})//阻止选中，非IE.
			.bind('selectstart.YH', function(){return false; });//阻止选中，IE.如果设置了范围
			//处理start，drag，stop，这里判断好，函数内直接使用
            this.startFunction=$.isFunction(this.options.start);
            this.dragFunction=$.isFunction(this.options.drag);
            this.stopFunction=$.isFunction(this.options.stop);
		},
        _mouseDown: function(e){
			//决断是不是不处理的元素。cancel中的设置只做用于当前dom，不代表其子元素。
			if(this._isCancel(e.target)||!this._enable) return;
            this._mouseDownEvent = e;
            this._mouseStarted = true;
            var self = this;
			
            $(document).bind("mousemove.YH",function(e){
                self._mouseMove(e);
				return false;//阻止选中，如果设置了范围，鼠标会超出元素。则之前设置的阻止选中无效。
            }).bind("mouseup.YH",function(e){
                self._mouseUp(e);
            });
			this._mouseStart(e);
			//阻止默认方法，防止图片被浏览器默认拖动。
			e.preventDefault();
        },
        _mouseMove: function(e){
            if (!this._mouseStarted)  return;
			this._mouseDrag({x:e.pageX - this._mouseDownEvent.pageX,y:e.pageY - this._mouseDownEvent.pageY},e);
			////阻止选中
			//e.preventDefault();
        },
        _mouseUp: function(e){
            this._mouseStarted = false;
            $(document).unbind("mousemove.YH").unbind("mouseup.YH");
			this._mouseStop(e);
        },
        _position:function(){
             if ("static" == this.element.css("position")) {
				//没有设置position或为static则其初始值为0
                this.position = {
                    top: 0,
                    left: 0
                };
				this.element.css("position",'relative')
            } else {
				//无论position为relative，absolute，fixed，取当前样式的top与left,不能使用jquery的position
                var top = parseInt(this.element.css("top"));
                var left = parseInt(this.element.css("left"));
                //top = isNaN(top) ? 0 : top;
                //left = isNaN(left) ? 0 : left;
                this.position = {
                    top: top,
                    left: left
                };
            }
        },
		_mouseStart: function(e) {
			this.mouseStart(e);
			this.startFunction&&this.options.start.call(this.options.scope,e,this);
		},
		_mouseDrag: function(distance,e) {
			var ret=this.mouseDrag(distance);
			this.dragFunction&&this.options.drag.call(this.options.scope,e,distance,ret,this);
		},
		_mouseStop: function(e) {
			this.mouseStop(e);
			this.stopFunction&&this.options.stop.call(this.options.scope,e,this);
		},
		_isCancel:function(ele){
			this.updateCancel();
			return this.cancel&&this.cancel.index(ele)>-1?true:false;
		},
		updateCancel:function(){
			
		},
        enable:function(){
            this._enable=true;
        },
        disable:function(){
            this._enable=false;
        }
    };
    
})(jQuery);
(function($){
    $.YH.widget('YH.dragDrop', $.extend({}, $.YH.Mouse, {
        _init: function(){
            this.options.scope=this.options.scope||this;
            
			if(this.options.handle){
				this.handle =$(this.options.handle,this.element);
			}else{
            	this.handle = this.element;
			}
            
			if(this.options.cancel){
				this.cancel =$(this.options.cancel,this.element);
			}
			//x、y单方向移动
            this.axis={x:1,y:1};
			var axis=this.options.axis||'';
			switch (axis.toLowerCase()) {
				case 'x':
					this.axis.y=0;
					break;
				case 'y':
					this.axis.x=0;
					break;
				default:
					break;
			}
            this._mouseInit();
        },
        mouseStart: function(e){
           //处理初始位置。
          this._position();
        },
        mouseDrag: function(distance){
			//范围检查
			var pos=this._checkRange( this.position.left + distance.x*this.axis.x,this.position.top + distance.y*this.axis.y);
            this.element.css({
                "left": pos.x,
                "top":pos.y
            });
            return pos;
        },
        mouseStop: function(e){

        },
		_checkRange:function(x,y){
			var min=this.options.min,
				max=this.options.max;
				
			if(min){
				x=x<min.x?min.x:x;
				y=y<min.y?min.y:y;
			}
			if(max){
				x=x>max.x?max.x:x;
				y=y>max.y?max.y:y;
			}
			return {x:x,y:y};
		}
    }),{
        defaults:{
            cancel:":input"
        }
    });
})(jQuery);
/**
 * 
 * //ie6 下子元素的高度设为100％时，父元素只改变高度时，子元素高度不变。但如果宽度改变，子元素高度也会变化。使用overflow:hidden;来修正。
 * 只改变x，y单方向改变大小通过设定8方向实现，不用在程序中设置asix。

 */
(function($){
    $.YH.widget('YH.resizable', $.extend({}, $.YH.Mouse, {
        _init: function(){
            this.options.scope=this.options.scope||this;

            if(this.options.handle){
                this.handle =$.YH.getObj(this.options.handle,this.element);
            }else{
                this.handle = this.element.find(".n,.s,.w,.e,.nw,.ne,.sw,.se");
            }

            this.havResizingFunction=$.isFunction(this.options.resizing);

            this._mouseInit();
            //Fix ie6 下子元素的高度设为100％时，父元素没有定义高度，则子元素的100％不会生效。
            if($.browser.msie&&$.browser.version<"7.0"){
                this.element.css("height",this.element.height());
            }
        },
        mouseStart: function(e){
            //处理初始位置。
            this._position();
            this.beginWidth=this.element.width();
            this.beginHeight=this.element.height();
            //计算相对值
            this.minWR=this.beginWidth-this.options.minWidth;
            this.maxWR=this.beginWidth-this.options.maxWidth;
            this.minHR=this.beginHeight-this.options.minHeight;
            this.maxHR=this.beginHeight-this.options.maxHeight;
            //设置方向
            this._checkDirection();
        },
        mouseDrag: function(distance){
            var css={},l=this._direction.l,p=this._direction.p;
            //计算大小
            var w=this.beginWidth + l.x * distance.x;
            var h= this.beginHeight + l.y * distance.y;
            var dx=dy=0;
            //范围检查
            var range=this._checkRange(w,h);
            if (l.x != 0) {
                css.width = range.width;
            }
            if (l.y != 0) {
                css.height = range.height;
            }

            if(p.x!=0){
                dx=p.x*(range.x===true?distance.x:range.x);
                css.left= this.position.left+x;
            }

            if(p.y!=0) {
                dy=p.y*(range.y===true?distance.y:range.y);
                css.top=this.position.top+dy;
            }

            !this.options.skipDefaultAction && this.element.css(css);
            //执行resizing
            if(this.havResizingFunction){
                this.options.resizing.call(this,{x:dx,y:dy},range,css);
            }
        },
        mouseStop: function(e){
			
        },
		_checkRange:function(w,h){
            var minW=this.options.minWidth,
                minH=this.options.minHeight,
                maxW=this.options.maxWidth,
                maxH=this.options.maxHeight,
                x=y=true;
                
            if(w<minW){
                w=minW;
                x=this.minWR;
            }else if(maxW&&w>maxW){
                w=maxW;
                x=this.maxWR;
            }
            
            if(h<minH){
                h=minH;
                y=this.minHR;
            }else if(maxH&&h>maxH){
                h=maxH;
                y=this.maxHR;
            }
            return {width:w,height:h,x:x,y:y};
		},
        _checkDirection :function(){
            var p={x:0,y:0},l={x:0,y:0},stop,css;
            if(!this.options.direction){
                this.options.direction=this.getDirectionFromHandle();
            }
            switch (this.options.direction) {
                case "n":
                    p.y = 1;
                    l.y = -1;
                    break;
                case "s":
                    l.y = 1;
                    break;
                case "w":
                    p.x = 1;
                    l.x = -1;
                    break;
                case "e":
                    l.x = 1;
                    break;
                case "nw":
                    p = {
                        x: 1,
                        y: 1
                    };
                    l = {
                        x: -1,
                        y: -1
                    };
                    break;
                case "ne":
                    p.y = 1;
                    l = {
                        x: 1,
                        y: -1
                    };
                    break;
                case "sw":
                    p.x = 1;
                    l = {
                        x: -1,
                        y: 1
                    };
                    break;
                case "se":
                    l = {
                        x: 1,
                        y: 1
                    };
                    break;
                default:
                    stop=false;
                    break;
            }
            this._direction={p:p,l:l};
        },
        getDirectionFromHandle:function(){
            var css=this._mouseDownEvent.target.className.split(" "),className=null;
            for (var i = 0; i < css.length; i++) {
                stop=true;
                className=css[i];
                switch (className) {
                    case "n":
                        break;
                    case "s":
                        break;
                    case "w":
                        break;
                    case "e":
                        break;
                    case "nw":
                        break;
                    case "ne":
                        break;
                    case "sw":
                        break;
                    case "se":
                        break;
                    default:
                        stop=false;
                        break;
                }
                if(stop){
                    break;
                }
            }
            return className;
        }
    }),{
        defaults:{
            minHeight:0,
            minWidth:0,
            maxHeight:0,
            maxWidth:0
        }
    });
})(jQuery);
/**
 * 选择
 */
(function($){
    $.YH.widget('My.select', $.extend({}, $.YH.Mouse, {
        _init: function(){
            this.options.scope=this.options.scope||this;
            
			this._createSelectBox();
			this.handle=this.element;
			if(this.options.cancel){
				this.cancel =$(this.options.cancel,this.element);
			}
            this._mouseInit();
        },
        mouseStart: function(e){
			//在每次开始时，重新取得子元素，因为子元素可能被动态添加。暂不对正在拖动时的子元素增加的处理。如果要处理，在selecting中也要取得，这样失去了只取一次的优化意义。
			this._children=this.element.children();
			this.position={left:e.pageX,top:e.pageY};
			this.selectBox.show().css({width:0,height:0,top:e.pageY,left:e.pageX});
			//TODO 合并选择
			this._children.removeClass("selecting");
			//子元素触发click事件,放在后面，有可能效果被上面语句去除。解决方法不完美，寻找更好的办法。
			//$(e.target).trigger("click");
			this._beginElement=$(this._closetOfUIChild(e.target)).addClass("selecting");
        },
        mouseDrag: function(distance){
			 var t=l=0;
			 if(distance.x<0){
			 	l=-1;
				distance.x=0-distance.x;
			 }
			 if(distance.y<0){
			 	t=-1;
				distance.y=0-distance.y;
			 }
			 var left=this.position.left +l * distance.x;
			 var top=this.position.top + t * distance.y;
			 this.selectBox.css({
                "width": distance.x,
                "height":distance.y,
				"left": left,
                "top": top
            });
			this.selecting(this.createBox(left,top,distance.x,distance.y));
        },
        mouseStop: function(e){
			this.selectBox.hide();
			//$(this._beginEvent.target).trigger("click");
        },
		_createSelectBox:function(){
			this.selectBox=$('<div id="selectBox"/>').css({border:"1px dotted #666",display:"none",position:"absolute",overflow:"hidden"}).appendTo(document.body);
		},
		selecting:function(selectBox){
			var self=this,ele,currbox;
			$.each(this._children,function(){
				ele=$(this);
				currbox=self.getBox(ele);
				//TODO 优化选种方式
				if(self.checkHit(selectBox,currbox)){
					//if(!ele.data("selected")){
						ele.addClass("selecting");
					//	ele.data("selected",true);
					//}
				}else{
					//if(ele.data("selected")==true){
						ele.removeClass("selecting");
					//	ele.data("selected",false);
					//}
				}
			});
		},
		checkHit:function(a,b){
			return (a.x0<b.x1&&b.x0<a.x1&&a.y0<b.y1&&b.y0<a.y1);
		},
		createBox:function(left,top,width,height){
			return {x0:left,y0:top,x1:left+width,y1:top+height};
		},
		getBox:function(ele){
			var pos=ele.offset();
			var w=ele.outerWidth();
			var h=ele.outerHeight();
			return {x0:pos.left,y0:pos.top,x1:pos.left+w,y1:pos.top+h};
		},
		getExtBox:function(ele){//偏离原位置
			var ext={left:20,top:20};
			var pos=ele.offset();
			var w=ele.outerWidth();
			var h=ele.outerHeight();
			return {x0:pos.left+ext.left,y0:pos.top+ext.top,x1:pos.left+w,y1:pos.top+h};
		},
		_closetOfUIChild:function(obj){
			var cur = obj,parent=this.element[0],last;
			while ( cur && cur.ownerDocument ) {
				last=cur;
				cur = cur.parentNode;
				if (cur==parent) {
					return last;
				}
			}
		},
		updateCancel:function(){
			if(this.options.cancel){
				this.cancel = this.handle.find(this.options.cancel);
			}
		},
		getSelects:function(){
			return this.element.children(".selecting");
		},
		setSelects:function(){
		
		},
		selectAll:function(){
			var ret=[];
			if(this.element.children(":not(.selecting)").length>0){
				ret=this.element.children().addClass("selecting");
			}else{
				this.element.children().removeClass("selecting");
			}
			return ret;
		}
    }),{
        defaults:{
            cancel:":input",
			className:{selecting:"selecting"}
        }
	});
})(jQuery);
/**
 * 数据操作
 * 通过store来统一操作数据
 * 目前提供数组与map二种类型。map的值可以为对象
 */
(function($){
    $.YH.declare('YH.Data.Store', {
        _init: function(){
            var self = this, o = this.options;
			this._initReader(o);
            this._initProxy(o);
            this.data=[];
            
        },
		_initReader:function(o){
			switch(typeof o.reader){
				case 'undefined':
					this.reader=new $.YH.Data.JsonReader(o);
					break;
				case 'object':
					this.reader =  o.reader;
					break;
				case 'function':
					this.reader =   new o.reader(o);
					break;
				default:
					break;
			}
		},
		_initProxy:function(o){
			switch(typeof o.proxy){
				case 'undefined':
					this.proxy=new $.YH.Data.HttpProxy(o);
					break;
				case 'object':
					this.proxy = o.proxy;
					break;
				case 'function':
					this.proxy =new o.proxy(o);
					break;
				default:
					break;
			}
		},
         //以后可能去除callback，只使用事件
        load: function(param){
            var self = this,args,callback=arguments[1];
            
            if($.isFunction(callback)){
                args=Array.prototype.slice.call(arguments, 2)
            }else{
                args=Array.prototype.slice.call(arguments, 1);
                callback=null;
            }
            
            this.proxy.request(param, function(data){
                self.loadData(data,args);
                if (callback) {
                    callback(self,args);
                }
            },args);
        },
        loadData: function(data,args){
            if(!data) return;
            if (this.reader) {
                data = this.reader.read(data);
                this.data = data.items;
                this.total = data.total;
            } else {
                this.data = data.items || data;
                this.total = data.total || data.length;
            }
            //触发数据改变事件
            $.event.trigger("datachanged", args, this);
        },
        get: function(k, j){
            return j ? this.data[k][j] : this.data[k];
            //return tag&&o[tag]?o[tag]:o;
        },
        getById: function(id){
            return this.reader.map[id];
        },
        getKeys: function(){
            return null;
        },
        getData: function(){
            return this.data;
        },
        getTotal: function(){
            return this.total;
        },
        getCount: function(){
            return this.data.length;
        },
        update: function(k, j, v){
            if (typeof v=="undefined") {
                this.data[k] = j;
                $.event.trigger("updaterow", [k], this);
                //this.proxy.update()
            } else {
                j?this.data[k][j] = v:this.data[k] = v;
                $.event.trigger("updatecell", [k, j], this);
                //this.proxy.update()
            }
        },
        updateSilence:function(){
            if (typeof v=="undefined") {
                this.data[k] = j;
                //this.proxy.update()
            } else {
                j?this.data[k][j] = v:this.data[k] = v;
                //this.proxy.update()
            }
        },
        remove:function(){
            
        },
        sort: function(param){
            if (this.options.remote||this.options.remoteSort) {
                this.load(param);
            } else {
                this.doSort(param);
            }
        },
        doSort: function(param){
            var sortFlag = param.type == 'ASC' ? 1 : -1, name = param.order, r;
            this.data.sort(function(a, b){
                r = a[name] > b[name] ? 1 : -1;
                return r * sortFlag;
            });
            //触发数据改变事件
            $.event.trigger("datachanged", null, this);
        },
        filter: function(param){
            if (this.options.remote) {
                this.load(param);
            }else{
                this.doFilter(param);
            }
        },
        doFilter: function(param){
            if(!this.originalData){
                this.originalData=this.getData();
            }
            
            var regexp = new RegExp("^" + param.value, "i"),
                k=param.key,
                r =[],
                data;
                
            if(this.lastFilterValue==param.value){
                return this.lastFilterData;
            }else if(param.value.indexOf(this.lastFilterData)>0){
                data=this.lastFilterData;
            }else{
                data=this.originalData;
            }
            for (var i=0;i<data.length;i++) {
                if (regexp.test(data[i][k])) {
                    r.push(data[i]);
                }
            }
            
            this.data=r;
            this.lastFilterValue=param.value;
            //触发数据改变事件
            $.event.trigger("datachanged", [r], this);
        },
		getParameter:function(){
			return this.proxy.getParameter();
		}
    });
    $.YH.Class('YH.Data.ArrayStore',{
        _initReader:function(o){
			this.reader=new $.YH.Data.ArrayReader(o);
		}
    },$.YH.Data.Store);
	
	$.YH.Class('YH.Data.JsonStore',{
        _initReader:function(o){
			this.reader=new $.YH.Data.JsonReader(o);
		},
		_initProxy:function(o){
			this.proxy=new $.YH.Data.HttpProxy({
				url:o.url,
				dataType:'json',
				error:function(){}
			});
		}
		
    },$.YH.Data.Store);
	
	$.YH.Class('YH.Data.XmlStore',{
        _initReader:function(o){
			this.reader=new $.YH.Data.XmlReader(o);
		},
		_initProxy:function(o){
			this.proxy=new $.YH.Data.HttpProxy({
				url:o.url,
				dataType:'xml',
				error:function(){}
			});
		}
    },$.YH.Data.Store);
	
    $.YH.declare('YH.Data.Reader', {
        _init: function(){
            var self = this, o = this.options;
            if(o.fields){
                this.setFields(o.fields);
            }
			this.setProperty(o);
        },
        setFields:function(fields){
            for (var i = 0; i < fields.length; i++) {
                if (typeof fields[i] == "string") {
                    fields[i] = {
                        name: fields[i]
                    };
                }
                if(!fields[i].mapping){
                    fields[i].mapping=fields[i].name;
                }
            }
            this.fields = fields;
        },
		setProperty:function(o){
			if (o.idProperty) {
                this.idProperty = o.idProperty;
                this.map = {};
            }
            this.totalProperty = o.totalProperty || "total";
            this.root = o.root || "items" ;
		},
        read: function(data){
            //var ret=[],total=$.YH.attr(data,this.totalProperty),items=$.YH.attr(data,this.root);更通用
            var ret = [], items = data[this.root] || data, total = data[this.totalProperty] || items.length;//简单，性能好
            if (this.fields) {
                //指定字段，进行组合
                if (this.idProperty) {
                    ret = this._readUseId(items);
                } else {
                    ret = this._read(items);
                }
            } else {
                //没有指定，返回所有。
                ret = items;
            }
            return {
                total: total,
                items: ret
            };
        },
        _read: function(data){
            var ret = [], rs, r;
            for (var i = 0; i < data.length; i++) {
                rs = data[i];
                r = this._record(rs);
                ret.push(r);
            }
            return ret;
        },
        _readUseId: function(data){
            var ret = [], rs, r, id = this.idProperty, map = this.map;
            for (var i = 0; i < data.length; i++) {
                rs = data[i];
                r = this._record(rs);
                ret.push(r);
                map[rs[id]] = r;
            }
            return ret;
        },
        //filed={name:'',mapping:'',type:'',format:''}
        _record: function(rs){
            var r = {}, field, key, tmp, p;
            for (var j = 0; j < this.fields.length; j++) {
                field = this.fields[j];
                key = field.mapping;
                //处理子元素
                if (typeof key == "string" && key.indexOf(".") > 0) {
                    tmp = key.split(".");
                    p = rs[tmp[0]];
                    for (var i = 1; i < tmp.length; i++) {
                        p = p[tmp[i]];
                    }
                } else {
                    p = rs[key];
                }
                
                r[field.name] =this._format(p,field,rs);
            }
            return r;
        },
        /**
         * 对值进行处理
         * @param {Object} p 要被处理的值
         * @param {Object} field 单个field对象
         * @param {Object} rs    一条记录
         */
		_format:function (p,field,rs) {
			//处理format
			if(field.format && $.isFunction(field.format)){
				p=field.format(p,rs);
			}else if(field.type){
				p=this.parseType(p,field);
			}
            return p;
		},
        parseType:function(p,field){
            //处理类型
            switch (field.type) {
                case 'date':
                    p = Date.phpparse(p, field.format);
                    break;
                case 'int':
                case 'float':
                    p = this.parseNumber(p,field.format);
                    break;
                case 'dataint':
                    p=new Date(p*1000);
                    break;
				case 'default':
					p=field.defaultValue;
					break;
                default:
                    break;
            }
            return p;
        },
        parseNumber: function(v, format){
            if (format) {
                format = format.replace(/#/g, "");
                format = format.replace(".", "");
                for (var i = 0; i < format.length; i++) {
                    v = v.replace(format.charAt(i), "");
                }
            }
            return v-0;
        }
    });
    $.YH.Data.JsonReader=$.YH.Data.Reader;
	
    $.YH.Class("YH.Data.ArrayReader", {
        setFields:function(fields){
            for (var i = 0; i < fields.length; i++) {
                if (typeof fields[i] == "string") {
                    fields[i] = {
                        name: fields[i]
                    };
                }
                if(!fields[i].mapping){
                    fields[i].mapping=i;
                }
            }
            this.fields = fields;
        }
    }, $.YH.Data.Reader);
	
    $.YH.Class("YH.Data.XmlReader", {
		read: function(data){
            var ret = [], items = $(this.root,data).children(), total =  $(this.totalProperty,data).text()|| items.length;//简单，性能好
            if (this.fields) {
                //指定字段，进行组合
              ret = this._readUseId(items);
            } else {
                //没有指定，返回所有。
                ret = this._readAll(items);
            }
            return {
                total: total,
                items: ret
            };
        },
		_readUseId: function(data){
            var self=this, ret = [], rs, r, id = this.idProperty, map = this.map;
			data.each(function(){
				rs=this;
				r=self._record(rs);
				ret.push(r);
				if (id) {
					map[$(id, rs).text()] = r;
				}
			});
            return ret;
        },
		_record: function(rs){
            var r = {}, field, key, tmp, p;
            for (var j = 0; j < this.fields.length; j++) {
                field = this.fields[j];
                key = field.mapping;
                //包括子元素
                p = $(key,rs).text();
                //处理类型
                r[field.name] =this._format(p,field,rs);
            }
            return r;
        },
		_readAll:function(data){
			var self=this, ret = [], rs, r, id = this.idProperty, map = this.map;
			data.each(function(){
				r={};
				$(this).children().each(function(){
					r[this.tagName]=$.text([this]);
				});
				ret.push(r);
				if (id) {
					map[$(id, this).text()] = r;
				}
			});
			return ret;
		}
    }, $.YH.Data.Reader);
	
    $.YH.Class("YH.Data.HtmlReader", {
        setFields:function(fields){
            for (var i = 0; i < fields.length; i++) {
                if (typeof fields[i] == "string") {
                    fields[i] = {
                        name: fields[i]
                    };
                }
                if(!fields[i].mapping){
                    fields[i].mapping=":nth-child("+(i+1)+")";
                }
            }
            this.fields = fields;
        },
		setProperty:function(o){
			if (o.idProperty) {
                this.idProperty = o.idProperty;
                this.map = {};
            }
            this.totalProperty = o.totalProperty || "total";
            this.root = o.root || "tbody tr";
		},
        read: function(dom){
            var ret = [], items = $(this.root, dom), total = $(dom).attr(this.totalProperty) || items.length;//简单，性能好
            if (this.fields) {
                //指定字段，进行组合
                ret = this._readUseId(items);
            } else {
                //没有指定，返回所有。
                ret = this._readAll(items);
            }
            return {
                total: total,
                items: ret
            };
        },
        _readAll: function(data){
            var ret = [], rs, r, tds, id = this.idProperty, map = this.map;
            for (var i = 0; i < data.length; i++) {
                rs = data.eq(i);
                tds = rs.children();
                r = [];
                for (var j = 0; j < tds.length; j++) {
                    r.push(tds[0].innerHTML);
                }
                ret.push(r);
                if (id) {
                    map[rs[id]] = r;
                }
            }
            return ret;
        },
        _readUseId: function(data){
            var ret = [], rs, r, id = this.idProperty, map = this.map;
            for (var i = 0; i < data.length; i++) {
                rs = data.eq(i);
                r = this._record(rs);
                ret.push(r);
                if (id) {
                    map[rs[id]] = r;
                }
            }
            return ret;
        },
        _record: function(rs){
            var r = {}, field, key, tmp, p;
            for (var j = 0; j < this.fields.length; j++) {
                field = this.fields[j];
                key = field.mapping;
                //处理子元素
				if($.isFunction(key)){
					p = key(rs);
				}else {
					switch(field.mapType){
						case 1:
							p=rs.text();
							break;
						case 2:
							p=rs.attr(key);
							break;
						case 3:
							p=rs.find(key).innerHTML;
							break;
						case 4:
						default:
							p=rs.find(key).text();
							break;
					}
				}
                //格式化
                r[field.name] = this._format(p,field,rs);
            }
            return r;
        }
    },{TEXT:1,ATTRIBUTE:2,INNERHTML:3,INNERTEXT:4},$.YH.Data.Reader);
    //YH.Data.Proxy{request:function(){}}
    $.YH.declare('YH.Data.HttpProxy', {
        _init: function(){
            var self = this, o = this.options;
        },
        request: function(param, callback){
            var o = this.options;
            //$.getJSON(o.url, param, function(data){
            //    callback(data);
            //});
           // var conf={url:o.url.request}
			o.data=param;
			o.success=callback;
			$.ajax(o);
            //触发完成事件
            //this.trigger("loadComplete.store");		
        },
		getParameter:function(){
			return o.data||{};
		},
		update:function (data) {
//			var o=this.options;
//			o.data=data;
//			o.type="POST"
//			$.ajax(o);
		}
    });
    $.YH.declare('YH.Data.LocalProxy', {
        _init: function(){
            var self = this, o = this.options;
			this.data=o.data;
			this._parse=o.parse||this._parse;
        },
        request: function(param, callback,args){
			callback(this._parse(this.data,param,args));
        },
		_parse:function(){
			return this.data;
		}
    });
    /*
    $.YH.declare('YH.Data.Map', {
        _init: function(){
            var self = this, op = this.options;
            this.keys = [];
            //建立hashmap
            if (op.keyName) {
                this.keyName = op.keyName;
                this.map = {};
                for (var k = 0; k < op.data.length; k++) {
                    this.map[op.data[k][op.keyName]] = op.data[k];
                    this.keys.push(op.data[k][op.keyName]);
                }
            } else {
                this.map = op.data;
                for (var k in this.map) {
                    this.keys.push(k);
                }
            }
        },
        add: function(k, o){
            this.map[k] = o;
            if ($.inArray(k, this.keys) == -1) {
                this.keys.push(k);
            }
        },
        remove: function(k){
            delete this.map[k];
            delete this.keys[$.My.Data.indexOf(this.keys, k)];
        },
        sort: function(){
            var r = {};
            this.keys.sort(function(a, b){
                return a.toUpperCase() < b.toUpperCase();
            });
            for (var i = 0; i < this.keys.length; i++) {
                r[this.keys[i]] = this.map[this.keys[i]];
            }
            return r;
        },
        filter: function(k){
            var regexp = new RegExp("^" + k, "i");
            var r = [];
            for (var i = 0; i < this.keys.length; i++) {
                if (regexp.test(this.keys[i])) {
                    r.push(this.keys[i]);
                }
            }
            return r;
        },
        get: function(k){
            return this.map[k];
        },
        getKeys: function(){
            return this.keys;
        },
        getData: function(){
            return this.map;
        }
    });
    $.YH.declare('YH.Data.Array', {
        _init: function(){
            var self = this, op = this.options;
            //建立hashmap
            this.data = op.data;
        },
        add: function(k){
            this.data.push(k);
        },
        remove: function(k){
            delete this.data[$.YH.Data.indexOf(this.data, k)];
        },
        sort: function(){
            this.data.sort(function(a, b){
                return a.toUpperCase() < b.toUpperCase();
            });
            return this.data;
        },
        filter: function(k){
            var regexp = new RegExp("^" + k, "i");
            var r = [];
            for (var i = 0; i < this.data.length; i++) {
                if (regexp.test(this.data[i])) {
                    r.push(this.data[i]);
                }
            }
            return r;
        },
        get: function(k){
            return k;
        },
        getKeys: function(){
            return this.data;
        },
        getData: function(){
            return this.data;
        }
    });*/
})(jQuery);

(function($){
	$.YH.widget('YH.tree',{
		_init: function(){
			var self=this,o=this.options;
			this.store=o.store;
			//this.treeType=o.treeType;
            this.hashs={};
			//加载子结点方法
			if ($.isFunction(o.loadSubNode)) {
				this.loadNodes=o.loadNodes;
			}

			this.element.addClass(o.cls);
			this.container=$('<ul class="tree-single"></ul>').appendTo(this.element);	
			$.event.add(this.store, 'datachanged', function(e,node){
                self.creaateSubNodes(node,self.store.getData());
            });
			//创建初始结点	
			if ($.isFunction(o.createRoot)) {
				o.createRoot.call(this,o.root);
			} else {
				this.createRoot(o.root);
			}
		},
		createRoot:function(root){
            if (root) {
				if(root instanceof Array){
                	for (var i = 0; i < root.length; i++) {
	                    this.appendRoot(this.createNode(root[i]));
	                }
				}else{
					this.appendRoot(this.createNode(root));
				}
            }
		},
		appendRoot:function(node){
            this.container.append(node.element);
        },
		createNode:function(ops){
			if(typeof ops=="undefined"){
				ops={};
			}
			ops.tree=this;
			ops.enableCheckbox=ops.enableCheckbox||this.options.enableCheckbox;
			var node=new $.YH.Tree.Node(ops);
			this.hashs[node.id]=node;
			return node;
		},
		loadNodes:function(fnode){
            var param={id:fnode.id};
			this.store.load(param,fnode);
		},
		loadSuccess:function(node,data){
			this.creaateSubNodes(node,data);
		},
        creaateSubNodes:function(node,data){
            node.removeAll();
            if (data&&data.length>0) {
                data[data.length - 1].isEnd = true;
                var child,children=[];
                for (var i = 0; i < data.length; i++) {
                    //有带改进，调来调去，有点绕。不使用tree的方法
                    child=this.createNode(data[i]);
                    node.append(child);
                    children.push(child);
                }
                $.event.trigger("createSubNodesSuccess",[children],this);
            }
        },
        selectedNode:function(node,e){
            if(this.setSelectedNode(node)){
                if(typeof this.options.selectedNode=="function"){
                    this.options.selectedNode.apply(this,arguments);
                }
            }
        },
        getNode:function(id){
            return this.hashs[id];
        },
        setSelectedNodeById:function(id){
            this.setSelectedNode(this.hashs[id]);
        },
        setSelectedNode:function(node){
            if(node && this.lastSelectedNode!=node){
                if(this.lastSelectedNode){
                    this.lastSelectedNode.panel.removeClass("selected");
                }
                node.panel.addClass("selected");
                this.lastSelectedNode=node;
                return true;
            }
            return false
        },
		getSelectedNode:function(){
			return this.lastSelectedNode;
		},
		getCheckedNode:function(){
			var ret=[],hashs=this.hashs;
			this.element.find(":checkbox:checked").each(function(){
				   ret.push(hashs[this.value]);
			});
			return ret;
		},
		getCheckedNodeId:function(){
			var ret=[];
			this.element.find(":checkbox:checked").each(function(){
				   //去除无用的根目录
				   if(this.value!="0"){
					   ret.push(this.value);
				   }
			});
			return ret;
		},
		clearChecked:function(){
			this.element.find(":checkbox:checked").attr("checked",false);
		},
		setChecked:function(ids){
			if(ids){
				var id,node;
				for(var i=0;i<ids.length;i++){
					id=ids[i];
					id=typeof id=="object"?id.id:id;
					node=this.hashs[id];
					node.checkbox[0].checked=true;
				}
			}
		}
//        ,
//        expandTo:function(node){
//            var paths=[];
//
//            while(node.parentNode){
//                paths.push(node.parentNode);
//            }
//            var parentNode;
//            for(var j=paths.length;j>=0;j--){
//                parentNode=paths[j];
//                if(!parentNode.expanded)
//                    parentNode.expand();
//            }
//        }
	}, {
		defaults: {
			cls:"tree",
			enableCheckbox:false,
			treeType:"Node"
		}
	});
	$.YH.declare('YH.Tree.Node',{
		_init: function(){
			var o=this.options,self=this;
			this.element=$(this.widgetBaseClass.template);
			this.panel=this.element.children(":first");
			this.container=this.element.children(":last");
			this.elbow=this.panel.children(":first");
			this.icon=this.panel.children(".tree-icon");
			this.text=this.panel.children(":last");

            this.id=o.id;
			this.text.html(o.text);	

			if(o.enableCheckbox){
				this.checkbox=this.panel.children(":checkbox");
				this.checkbox.val(o.id).show();
			}
			
			this.tree=o.tree;
			//设置样式
			this.panel.addClass("tree-node-"+o.status);

            o.cls && this.panel.addClass(o.cls);

			//展开收起事件
			if (o.status != "leaf") {
                if(o.status=="expanded"){
                    self.expanded=true;
                    self.expand();
                }else{
                    self.expanded=false;
                    self.collapse();
                }
				this.elbow.click(action);
				this.panel.dblclick(action);
			}
			//点击文本事件
            this.text.add(this.icon).click(function(e){
                self.selected(e);
            });
          //设置结尾结点
			if(o.isEnd){
				this.elbow.addClass("tree-elbow-end");
				this.setSingle();
			}

			this.text.html(o.text);

            this.element.data("Node",this);

			function action(){
				if (self.expanded) {
					self.collapse();
				} else {
					self.expand();
				}
			}
		},
		expand:function(){
			this.panel.removeClass("tree-node-collapsed").addClass("tree-node-expanded");
			if(!this.isLoad){
				this.loadSubNode();
				this.isLoad=true;
			}			
			this.container.slideDown("fast");
			this.expanded=true;
			//触发展开事件
			//this.tree.expand();
		},
		collapse:function(){
			this.panel.removeClass("tree-node-expanded").addClass("tree-node-collapsed");
			this.container.slideUp("fast");
			this.expanded=false;
		},
		append:function(node){
            node.parentNode=this;
			this.container.append(node.element);
		},
		remove:function(node){
            node.element.remove();
//			this.container.remove(node.element[0]);
		},
		removeAll:function(){
			this.container.empty();
		},
		setSingle:function(){
			this.container.addClass("tree-single");
		},
		removeSingle:function(){
			this.container.removeClass("tree-single");
		},
        loadSubNode:function(){
			this.tree.loadNodes(this);
        },
        addSubNode:function(data){
            if(data){
                //remove last child isEnd sign
                var lastNode=this.container.children(":last");
                if(lastNode && lastNode.length){
                    lastNode.data("Node").removeEndFlag();
                }

                if(data instanceof Array){
                    if (data.length>0) {
                        data[data.length - 1].isEnd = true;
                        for (var i = 0; i < data.length; i++) {
                            //有带改进，调来调去，有点绕。不使用tree的方法
                            this.append(this.tree.createNode(data[i]));
                        }
                    }
                }else{
                    data.isEnd = true;
                    this.append(this.tree.createNode(data));
                }
            }
        },
        selected:function(e){
            this.tree.selectedNode(this,e);
        },
        setEndFlag:function(){
            this.elbow.addClass("tree-elbow-end");
        },
        removeEndFlag:function(){
            this.elbow.removeClass("tree-elbow-end");
        }
	}, {
		defaults: {
			status:"collapsed"
		},
		template : '<li><div><span class="tree-elbow"></span><span class="tree-icon"></span><input style="display:none;" type="checkbox" class="tree-chk" /><a href="javascript:void(0)"></a></div><ul style="display:none;"></ul></li>'
	});
	$.YH.declare('YH.Tree.Loader',{
		
	});
})(jQuery);