/*
 * yhge v0.141
 */

//
var yhge={
    core:{
    
    },
    renderer:{
        canvas:{
            shape:{},
            swf:{}
        },
        webgl:{},
        html:{}
    },
    times:{

    },
    math:{
    
    },
    event:{
        ui:{
            
        }
    },
	organizer:{
		
	},
    input:{

    },
    audo:{

    },
    scene:{
        
    },
    ui:{
        canvas:{
            
        }
    },
    network:{

    },
    isometric:{
    
    },
    tiled:{
        
    },
    animation:{},
    fx:{},
    util:{},
    i18n:{}
};/*
 *定义类与部件
 */
(function(){
    //require

    //private
    var objectPrototype = Object.prototype,TOPNS=window;
    
    //define
    yhge.core={

        ucfirst : function(str){
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        },
        lcfirst : function(str){
            str += '';
            var f = str.charAt(0).toLowerCase();
            return f + str.substr(1);
        },
        /*
         *创建命名空间
         */
        createNameSpace  : function(name){
            var namespace = name.split("."), name = namespace.pop(), ns = TOPNS, p;
            for (var ii in namespace) {
                p = yhge.ucfirst(namespace[ii]);
                ns = (p in ns ? ns[p] : ns[p] = {});
            }
            return {
                "ns": ns,
                "cName": name
            };
        },
        
        extend: function(subclass, superclass, overrides) {
        
            if (typeof superclass=="object") {
                overrides = superclass;
                superclass = subclass;
                subclass = overrides.constructor !== objectPrototype.constructor ? overrides.constructor : function() {
                    superclass.apply(this, arguments);
                };
            }

            if (!superclass) {
    //            throw({
    //                sourceClass: 'yhge',
    //                sourceMethod: 'extend',
    //                msg: 'Attempting to extend from a class which has not been loaded on the page.'
    //            });
                return;
            }
            // Copy statics from superclass.
            this.mixinIf(true,subclass,superclass);
            
            if(subclass._super_){
                this.mixinIf(true,subclass._super_,superclass.prototype);
                this.mixinIf(true,subclass.prototype,superclass.prototype);
            }else{
                // Copy prototype from superclass.
                var F = function() {},
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass._super_=superclassProto;
                subclass._superclass_=superclass;
                //subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectPrototype.constructor) {
                    superclassProto.constructor = superclass;
                }

                overrides && this.mixin(true,subclassProto,overrides);
            }
            return subclass;
        },
        inherits:function(subclass, superclass, overrides) {
            return this.extend.apply(this,arguments);
        },
        /*
         *申明类
         *name String
         *prototype Object 原型对象
         *content	Object 类属性(静态)|Function 父类
         */
        declare  : function( name,hasPrent){
            var Class;
            switch (typeof (name)) {
                case "string":
                    var nsc = yhge.createNameSpace(name);
                    var cName = yhge.ucfirst(nsc.cName);
                    Class=nsc.ns[cName] = hasPrent?function(){
                        Class._superclass_.apply(this,arguments);
                    }:function(){this.initialize.apply(this,arguments);};
                    //命名空间
                    Class.namespace = nsc.ns;
                    //名称
                    Class.classname = cName;
                    break;
                case "undefined":
                    Class= hasPrent?function(){
                        Class._superclass_.apply(this,arguments);
                    }:function(){
                        this.initialize.apply(this,arguments);
                    };
                    break;
                default:
                    Class=name;
            }
            return Class;
        },
        /**
         * {base:class||string,
           overrides:{},
           content:{},
           extend:[class,class]
           }
		 * 只能继承在prototype定义的属性和方法。在构造函数中通过this赋值的无效。
         */
        Class : function(){
            var subclass,overrides,content,extend;//父类的prototype方法,如果父类有几个则是其和
            
            subclass=arguments[0];
            
            if(subclass==null) return;

            switch (typeof subclass) {
                case "function":
                    subclass=undefined;
                    extend=arguments[0];
                    overrides=arguments[1];
                    content=arguments[2];
                    break;
                case "object":
                    if(subclass instanceof Array){
                        subclass=undefined;
                        extend=arguments[0];
                        overrides=arguments[1];
                        content=arguments[2];
                    }else{
                        var conf=arguments[0];
                        subclass=conf.base;
                        overrides=conf.overrides;
                        content=conf.content;
                        extend=conf.extend;
                    }
                    break;
                case "string":
                default:
                    if(typeof arguments[1]=="function" || arguments[1] instanceof Array){
                        extend=arguments[1];
                        overrides=arguments[2];
                        content=arguments[3];
                    }else{
                        extend=null;
                        overrides=arguments[1];
                        content=arguments[2];
                    }
                    break;
            }
            subclass=this.declare(subclass,extend);
            
            if(extend){
                extend=extend instanceof Array?extend:[extend];
                //只允许单独定义构造函数
                //prototype=this.mixinIf(prototype,subclass.prototype);
                //content=this.mixinIf(content,subclass);
                //主继承
                superclass=extend[0];
                
                var F = function() {},
                subclassProto, superclassProto = superclass.prototype;
                F.prototype = superclassProto;
                
                superclassProto =   new F();
                
                //扩展原型
                var prototypes = [superclassProto];//[true,superclassProto];

//                //支持多继承的initialize函数，如果有交差继承，祖先类的initialize可能会被执行多次。
//                //尽量减少交叉继承，或者把initialize命名成其它名称，在子类显示调用。
//                var initializes=[];
//                if(superclassProto.initialize) initializes.push(superclassProto.initialize);

                for (var i = 1,l=extend.length,proto; i<l ; i++) {
                    proto=extend[i].prototype;
                    if (proto) {
                        prototypes.push(proto);
//                        if(proto.initialize) initializes.push(proto.initialize);
                    }
                }

                superclassProto=this.mixinIf.apply(this, prototypes);

//                
//                if(initializes.length>1){
//                    superclassProto.initialize=function(){
//                        for(var i=0,l=initializes.length;i<l;i++){
//                            initializes[i].apply(this,arguments);
//                        }
//                    }
//                }

                F.prototype = superclassProto;
                subclassProto=subclass.prototype=new F();
                
                subclassProto.constructor = subclass;
                subclass._super_=superclassProto;
                subclass._superclass_=superclass;
                //subclass.superclass = superclassProto;
        
                if (superclassProto.constructor === objectPrototype.constructor) {
                    superclassProto.constructor = superclass;
                }
                overrides&&this.mixin(true,subclassProto,overrides);
                
                // Copy statics from superclass.
                var contents=(content?[true,subclass,content]:[true,subclass]).concat(extend);
                this.mixinIf.apply(this, contents);
            }else{
               overrides && this.mixin(true,subclass.prototype,overrides);
               content && this.mixin(true,subclass,content);
            }
            return subclass;
        },
        mixin: function(){
            
            var self = this,deep=false,options;
            
            // Make sure we have a target
            if(arguments.length == 0) return {};

            // Get the tag
            var target = arguments[0];
            var i = 1;
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }
            // Ensure we have an extendable target
            if(typeof target != 'object' && typeof target != 'function') {
                target = {};
            }

            var src,copy;

            for(; i < arguments.length; i++) {
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( var name in options ) {
                        if(name=="_super_" ||name=="_superclass_") continue;
                        
                        copy = options[ name ];
                        // Prevent never-ending loop
                        if ( copy==null||target === copy ) {
                            continue;
                        }
                        // Recurse if we're merging plain objects or arrays
                        if ( deep && typeof copy == 'object' ) {
                            src = target[ name ];
                            if(!src){
                                src=copy instanceof Array?[]:{};
                            }
                            // Never move original objects, clone them
                            target[ name ] = this.mixin( deep, src, copy );
        
                        // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Pass it back
            return target;
        },
        mixinIf: function(){
            
            var self = this,deep=false,options;
            
            // Make sure we have a target
            if(arguments.length == 0) return {};

            // Get the tag
            var target = arguments[0];
            var i = 1;
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }
            // Ensure we have an extendable target
            if(typeof target != 'object' && typeof target != 'function') {
                target = {};
            }

            var src,copy;

            for(; i < arguments.length; i++) {
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( var name in options ) {
                        
                        if(name=="_super_" ||name=="_superclass_") continue;
                        
                        copy = options[ name ];
        
                        // Prevent never-ending loop
                        if ( copy==null||target === copy ) {
                            continue;
                        }
                        src = target[ name ];
                        // Recurse if we're merging plain objects or arrays
                        if ( deep && typeof copy == 'object' ) {
                            if(!src){
                                src=copy instanceof Array?[]:{};
                            }
                            // Never move original objects, clone them
                            target[ name ] = this.mixinIf( deep, src, copy );
        
                        // Don't bring in undefined values
                        } else if ( !src && copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }
            // Pass it back
            return target;
        },
        isPlainObject:function( obj ) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if ( !obj || typeof obj !== "object"  ) {
                return false;
            }
            // Not own constructor property must be Object
            if ( obj.constructor &&
                !Object.prototype.hasOwnProperty.call(obj, "constructor") &&
                !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for ( key in obj ) {}

            return key === undefined || Object.prototype.hasOwnProperty.call( obj, key );
        },
        checkPathEndChar:function(dirStr){
            return dirStr.charAt(dirStr.length-1)=="/"?dirStr:dirStr+"/";
        }
    };
})();
(function() {
    var Accessor=yhge.core.Accessor=function  () {
        this.initialize.apply(this,arguments);
    };
    Accessor.prototype={

        getAttribute: function(key) {
            key=camelCase(key);
            if(this[key]){
                return this[key];
            }
            key="get"+ucfirst(key);
            return this[key] && this[key]();
        },

        setAttribute: function(key,value) {
            key=camelCase(key);
            var name="set"+ucfirst(key);
            if(this[name]){
               this[name](value);
            }else{
               this[key]=value; 
            }
            return this;
        },

        setAttributes: function(dict) {
            for (var key in dict) {
                this.setAttribute(key, dict[key]);
            }
            return this;
        },

        registerAccessors: function(propName, getterFn, setterFn) {
            var prop=this,
            caseAdjusted=ucfirst(propName);
            if(getterFn) {
                prop['get'+caseAdjusted]=getterFn;
            }
            if(setterFn) {
                prop['set'+caseAdjusted]=setterFn;
            }
            return this;
        },

        synthesizeProperty: function(propName, CommandsFn) {
            propName=camelCase(propName);
            var lVarName = '_' + propName;
            var setterFn;
            if (CommandsFn) {
                // Optional args are still passed through, even though only the first arg is assigned.
                setterFn = function(arg) {
                    this[lVarName] = arg;
                    CommandsFn.apply(this, arguments);
                    return this;
                }

            } else {
                setterFn = function(arg) {
                    this[lVarName] = arg;
                    return this;
                }

            }
            this.registerAccessors(propName, function() {
                return this[lVarName];
            } , setterFn);

            return this;
        },

        synthesizePropertys: function(props) {
            for(var i=0,l=props.length;i<l;i++) {
                this.synthesizeProperty(props[i]);
            }
            return this;
        }
    };
    
    Accessor.registerAccessors=function(propName, getterFn, setterFn) {
        var prop=this.prototype,
        caseAdjusted=ucfirst(propName);
        if(getterFn) {
            prop['get'+caseAdjusted]=getterFn;
        }
        if(setterFn) {
            prop['set'+caseAdjusted]=setterFn;
        }
        return this;
    };

    Accessor.synthesizeProperty= function(propName, CommandsFn) {
        propName=camelCase(propName);
        var lVarName = '_' + propName;
        var setterFn;
        if (CommandsFn) {
            // Optional args are still passed through, even though only the first arg is assigned.
            setterFn = function(arg) {
                this[lVarName] = arg;
                CommandsFn.apply(this, arguments);
                return this;
            }

        } else {
            setterFn = function(arg) {
                this[lVarName] = arg;
                return this;
            }

        }
        this.registerAccessors(propName, function() {
            return this[lVarName];
        } , setterFn);

        return this;
    };

    Accessor.synthesizePropertys = function(props) {
        for(var i=0,l=props.length;i<l;i++) {
            this.synthesizeProperty(props[i]);
        }
        return this;
    };

    yhge.core.accessor= {

        getAttribute: function(key) {
            key=camelCase(key);
            if(this[key]){
                return this[key];
            }
            key="get"+ucfirst(key);
            return this[key] && this[key]();
        },

        setAttribute: function(key,value) {
            key=camelCase(key);
            var name="set"+ucfirst(key);
            if(this[name]){
               this[name](value);
            }else{
               this[key]=value; 
            }
            return this;
        },

        setAttributes: function(dict) {
            for (var key in dict) {
                this.setAttribute(key, dict[key]);
            }
            return this;
        },

        registerAccessors: function(propName, getterFn, setterFn) {
            var prop=typeof this =="function"?this.prototype:this,
            caseAdjusted=ucfirst(propName);
            if(getterFn) {
                prop['get'+caseAdjusted]=getterFn;
            }
            if(setterFn) {
                prop['set'+caseAdjusted]=setterFn;
            }
            return this;
        },

        synthesizeProperty: function(propName, CommandsFn) {
            propName=camelCase(propName);
            var lVarName = '_' + propName;
            var setterFn;
            if (CommandsFn) {
                // Optional args are still passed through, even though only the first arg is assigned.
                setterFn = function(arg) {
                    this[lVarName] = arg;
                    CommandsFn.apply(this, arguments);
                    return this;
                }

            } else {
                setterFn = function(arg) {
                    this[lVarName] = arg;
                    return this;
                }

            }
            this.registerAccessors(propName, function() {
                return this[lVarName];
            } , setterFn);

            return this;
        },

        synthesizePropertys: function(props) {
            for(var i=0,l=props.length;i<l;i++) {
                this.synthesizeProperty(props[i]);
            }
            return this;
        },
        
        mixinTo:function(cls){
            if (typeof cls!=="function") return;
            
            var prot=cls.prototype;
            prot.getAttribute=this.getAttribute;
            prot.setAttribute=this.setAttribute;
            prot.setAttributes=this.setAttributes;
            
            cls.registerAccessors=this.registerAccessors;
            cls.synthesizeProperty=this.synthesizeProperty;
            cls.synthesizePropertys=this.synthesizePropertys;
        }

    };
    

    var rdashAlpha = /_([a-z])/ig;
    function fcamelCase( all, letter ) {
        return letter.toUpperCase();
    }

    function camelCase( string ) {
        return string.replace( rdashAlpha, fcamelCase );
    }

    function ucfirst (str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    }
})();(function  () {
    yhge.util=yhge.util||{};

    yhge.decToHex=function (n){
        return (n < 16 ? '0' : '') + n.toString(16);
    };

    yhge.util.url={
        getUriParameters:function(uri){
            var parameters={};
            var data=this.parseUriString(uri);
            
            if(data.fragment){
                var fragmentParameters=this.parseUriParameter(data.fragment);
                for(var k in fragmentParameters){
                    parameters[k]=fragmentParameters[k];
                }
            }

            if(data.query){
                var queryParameters=this.parseUriParameter(data.query);
                for(var k in queryParameters){
                    parameters[k]=queryParameters[k];
                }
            }
            return parameters;
        },
        getQueryParameters:function(){
            var data=this.parseUriString(uri);
            return this.parseUriParameter(data.query);
        },
        getFragmentParameters:function(){
            var data=this.parseUriString(uri);
            return this.parseUriParameter(data.fragment);
        },
        parseUriString:function (str, checkOnly) {
            var reg = /^([^?#]*)\??([^#]*)\#?([^#]*)/i;
            var m = str.match(reg);
            var ret = null;
            if (m) {
                ret.query = m[2];
                ret.fragment = m[3];
            }
            return ret;
        },
        parseUriParameter:function (str) {
            var i;
            if (!str || typeof str !== 'string') {
                return null;
            }
            var list = str.split("&");

            var len = list.length;
            var ret = {};
            for (i = 0; i < len; i++) {
                var entry = list[i].split("=");
                ret[decodeURIComponent(entry[0])] = entry[1] ? decodeURIComponent(entry[1]) : ""
            }
            return ret;
        }
    };
    //===============color===================//
    yhge.util.color={
        colorToString:function (color){
            return color ?( color.a
                ?"rgba("+parseInt(color.r)+","+parseInt(color.g)+","+parseInt(color.b)+","+color.a+")"
                :"rgb("+parseInt(color.r)+","+parseInt(color.g)+","+parseInt(color.b)+")"
                ):"";
        },

        colorArrayToString:function (color){
            return color ?( color.a
                ?"rgba("+parseInt(color[0])+","+parseInt(color[1])+","+parseInt(color[2])+","+color[3]+")"
                :"rgb("+parseInt(color[0])+","+parseInt(color[1])+","+parseInt(color[2])+")"
                ):"";
        },

        stringToColor:function (colorString){
            if(typeof colorString!="string") return colorString;
            var color;
            if(colorString.charAt(0)=="#"){
                var r=colorString.substr(1,2);
                var g=colorString.substr(3,2);
                var b=colorString.substr(5,2);
                var a=colorString.substr(7,2);
                color={
                    r:parseInt(r,16),
                    g:parseInt(g,16),
                    b:parseInt(b,16)
                };
                if(a) color.a=parseInt(a,16);
            }else if(colorString.charAt(0)=="r"){
                var match=colorString.match(/rgba?\((\d*),(\d*),(\d*),?(\d*\.?\d*)\)/);
                color={
                    r:match[1],
                    g:match[2],
                    b:match[3],
                    a:match[4]
                };
            }else if(colorString.length==6)      {
                var r=colorString.substr(0,2);
                var g=colorString.substr(2,2);
                var b=colorString.substr(4,2);
                color={
                    r:parseInt(r,16),
                    g:parseInt(g,16),
                    b:parseInt(b,16)
                };
            }
            return color;
        }
    };
})();(function  () {
    var RE_PAIR = /\{\s*([\d.\-]+)\s*,\s*([\d.\-]+)\s*\}/,
        RE_DOUBLE_PAIR = /\{\s*(\{[\s\d,.\-]+\})\s*,\s*(\{[\s\d,.\-]+\})\s*\}/;

    Math.PI_2 = 1.57079632679489661923132169163975144     /* pi/2 */

    /** @namespace */
    var geometry={
        /**
         * @class
         * A 2D point in space
         *
         * @param {Float} x X value
         * @param {Float} y Y value
         */
        Point: function (x, y) {
            /**
             * X coordinate
             * @type Float
             */
            this.x = x;

            /**
             * Y coordinate
             * @type Float
             */
            this.y = y;
        },

        /**
         * @class
         * A 2D size
         *
         * @param {Float} w Width
         * @param {Float} h Height
         */
        Size: function (w, h) {
            /**
             * Width
             * @type Float
             */
            this.width = w;

            /**
             * Height
             * @type Float
             */
            this.height = h;
        },

        /**
         * @class
         * A rectangle
         *
         * @param {Float} x X value
         * @param {Float} y Y value
         * @param {Float} w Width
         * @param {Float} h Height
         */
        Rect: function (x, y, w, h) {
            /**
             * Coordinate in 2D space
             * @type {geometry.Point}
             */
            this.origin = new geometry.Point(x, y);

            /**
             * Size in 2D space
             * @type {geometry.Size}
             */
            this.size   = new geometry.Size(w, h);
        },

        /**
         * @returns {Float}
         */
        degreesToRadians: function (angle) {
            return angle / 180.0 * Math.PI;
        },

        /**
         * @returns {Float}
         */
        radiansToDegrees: function (angle) {
            return angle * (180.0 / Math.PI);
        },
        /**
         *srcRange是否完全包含descRange
         */
        hitTestRangeContainRange:function(srcRange,descRange) {
            return descRange.left>=srcRange.left && descRange.right<=srcRange.right && descRange.top>=srcRange.top && descRange.bottom<=srcRange.bottom;
        },
        hitTestRangeInRange:function(descRange,srcRange) {
            return descRange.left>=srcRange.left && descRange.right<=srcRange.right && descRange.top>=srcRange.top && descRange.bottom<=srcRange.bottom;
        },
        /**
         *range是否包含point
         */
        hitTestRangeContainPoint:function(range,x,y) {
            return x>=range.left && x<=range.right && y>=range.top && y<=range.bottom;
        },
        hitTestPointInRange:function(x,y,range) {
            return x>=range.left && x<=range.right && y>=range.top && y<=range.bottom;
        },
        /**
         *srcRange是否和descRange相交
         */
        hitTestRangeCrossRange:function(srcRange,descRange) {
            //TODO
            //return descRange.left<=srcRange.left && descRange.right>srcRange.left && descRange.top<=srcRange.top && descRange.bottom>srcRange.top;
        },
        /**
         * 如果inner不在outer内或相交，则返回false。
         * 再内部返回inner，相交则截取inner。
         */
        cutRange:function (outer,inner) {
            if(inner.left<outer.right && inner.right>outer.left && inner.top<outer.bottom && inner.bottom>outer.top){
                inner.left=inner.left<outer.left?outer.left:inner.left;
                inner.right=inner.right>outer.right?outer.right:inner.right;
                inner.top=inner.top<outer.top?outer.top:inner.top;
                inner.bottom=inner.bottom>outer.bottom?outer.bottom:inner.bottom;
                return inner;
            }else{
                return false;
            }
        }
    };
    
    yhge.math.geometry=yhge.geo = geometry;
})();
(function  () {
    //坐标原点在左下角

    //使用a,b,c,d,tx,ty,行、列向量都适用。
    var TransformMatrix=function (){
        this.initialize.apply(this,arguments);
    };
    TransformMatrix.prototype={
        /**
         * @class
         * Transform matrix
         *
         * @param {Float} a
         * @param {Float} b
         * @param {Float} c
         * @param {Float} d
         * @param {Float} tx
         * @param {Float} ty
         */
        initialize: function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        },
        /**
         * Translate (move) a transform matrix
         *
         * @param {Float} tx Amount to translate along X axis
         * @param {Float} ty Amount to translate along Y axis
         * @returns {geometry.TransformMatrix} A new TransformMatrix
         */
        setTranslate: function (tx, ty) {
            var newtx = this.tx + this.a * tx + this.c * ty;
            var newty = this.ty + this.b * tx + this.d * ty;
            this.tx=newtx;
            this.ty=newty;
            return this;
        },
        /**
         * Rotate a transform matrix
         *
         * @param {Float} angle Angle in radians
         * @returns {geometry.TransformMatrix} A new TransformMatrix
         */
        setRotate: function ( angle) {
            var sin = Math.sin(angle),
                cos = Math.cos(angle);
            var a=this.a,b=this.b,c=this.c,d=this.d;
            this.a=a * cos + c * sin;
            this.b=b * cos + d * sin;
            this.c=c * cos - a * sin;
            this.d=d * cos - b * sin;
            return this;
        },

        /**
         * Scale a transform matrix
         *
         * @param {Float} sx X scale factor
         * @param {Float} [sy=sx] Y scale factor
         * @returns {geometry.TransformMatrix} A new TransformMatrix
         */
        setScale: function (sx, sy) {
            if (sy === undefined) {
                sy = sx;
            }
            this.a*=sx;
            this.b*=sx;
            this.c*=sy;
            this.d*=sy;
            return this;
        },
        pointApply:function(x,y){
            return {x:this.a * x + this.c * y + this.tx,y:this.b * x + this.d * y + this.ty};
        },
        rectApply:function (x,y,width,height) {
            var left=x,
                right=x+width,
                top=y,
                bottom=y+height,
                tl=this.pointApply(left,top),
                tr=this.pointApply(right,top),
                bl=this.pointApply(left,bottom),
                br=this.pointApply(right,bottom);
            left=Math.min(tl.x,tr.x,bl.x,br.x);
            right=Math.max(tl.x,tr.x,bl.x,br.x);
            top=Math.min(tl.y,tr.y,bl.y,br.y);
            bottom=Math.max(tl.y,tr.y,bl.y,br.y);
            return {x:left,y:top,width:right-left,height:bottom-top};
        },
        boundingApply:function (left,right,top,bottom) {
            var tl=this.pointApply(left,top),
                tr=this.pointApply(right,top),
                bl=this.pointApply(left,bottom),
                br=this.pointApply(right,bottom);
            left=Math.min(tl.x,tr.x,bl.x,br.x);
            right=Math.max(tl.x,tr.x,bl.x,br.x);
            top=Math.min(tl.y,tr.y,bl.y,br.y);
            bottom=Math.max(tl.y,tr.y,bl.y,br.y);
            return {left:left,right:right,top:top,bottom:bottom};
        },
        clone:function(){
            return new TransformMatrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
        },
        /**
         * Inverts a transform matrix
         *
         * @returns {geometry.TransformMatrix} New transform matrix
         */
        invert: function () {
            var determinant = 1 / (this.a * this.d - this.b * this.c);

            return new TransformMatrix(
                determinant * this.d,
                -determinant * this.b,
                -determinant * this.c,
                determinant * this.a,
                determinant * (this.c * this.ty - this.d * this.tx),
                determinant * (this.b * this.tx - this.a * this.ty)
            );
        },

        /**
         * Multiply 2 transform matrices together
         * @param {geometry.TransformMatrix} rhs Right matrix
         * @returns {geometry.TransformMatrix} New transform matrix
         */
        concat: function (rhs) {
            return new TransformMatrix(
                this.a * rhs.a + this.b * rhs.c,
                this.a * rhs.b + this.b * rhs.d,
                this.c * rhs.a + this.d * rhs.c,
                this.c * rhs.b + this.d * rhs.d,
                this.tx * rhs.a + this.ty * rhs.c + rhs.tx,
                this.tx * rhs.b + this.ty * rhs.d + rhs.ty
            );
        }
    };
    TransformMatrix.getIdentity= function () {
        return new TransformMatrix(1, 0, 0, 1, 0, 0);
    };

	TransformMatrix.create= function (matrix) {
		if(matrix instanceof Array){
			return new TransformMatrix(matrix[0], matrix[1],matrix[2], matrix[3], matrix[4], matrix[5]);
		}else if(typeof matrix =="number"){
			return new TransformMatrix(arguments[0], arguments[1],arguments[2], arguments[3], arguments[4], arguments[5]);
		}else if(typeof matrix=="object"){
			return new TransformMatrix(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx,matrix.ty);
		}
        return new TransformMatrix(1, 0, 0, 1, 0, 0);
    };
    TransformMatrix.equal= function (matrixa,matrixb) {
        return matrixa.a==matrixb.a && matrixa.b==matrixb.b && matrixa.c==matrixb.c
            && matrixa.d==matrixb.d && matrixa.tx==matrixb.tx && matrixa.ty==matrixb.ty;
    };
    yhge.math.TransformMatrix=TransformMatrix;
})();(function () {
    var util = yhge.util;

    var ColorPrototype = function () {
        this.initialize.apply(this, arguments);
    };

    ColorPrototype.prototype = {

        setColor:function (color) {

            if (arguments.length > 1) {
                this._color = {
                    r:arguments[0],
                    g:arguments[1],
                    b:arguments[2],
                    a:arguments[3]
                };
                this._colorString = util.color.colorToString(this._color);
            } else if (color instanceof Array) {
                this._color = {
                    r:color[0],
                    g:color[1],
                    b:color[2],
                    a:color[3]
                };
                this._colorString = util.color.colorToString(this._color);
            } else if (typeof color == "string") {
                this._colorString = color;
                this._color = util.color.stringToColor(color);
            } else {
                this._color = color;
                this._colorString = util.color.colorToString(this._color);
            }
            return this;
        },

        setColorObject:function (colorObject) {
            this._color = colorObject;
            this._colorString = util.color.colorToString(colorObject);
            return this;
        },

        setColor3b:function (r, g,b) {
            this._color = {
                r:r,
                g:g,
                b:b
            };
            this._colorString = util.color.colorToString(this._color);
            return this;
        },

        setColor4b:function (r, g, b, a) {
            this._color = {
                r:r,
                g:g,
                b:b,
                a:a
            };
            this._colorString = util.color.colorToString(this._color);
            return this;
        },

        setColorArray:function (color) {
            this._color = {
                r:color[0],
                g:color[1],
                b:color[2],
                a:color[3]
            };
            this._colorString = util.color.colorToString(this._color);
            return this;
        },

        getColor:function () {
            return this._color;
        },

        setColorString:function (colorString) {
            this._colorString = colorString;
            this._color = util.color.stringToColor(colorString);
            return this;
        },
        getColorString:function () {
            return this._colorString;
        }
    };

    yhge.renderer.ColorPrototype = ColorPrototype;
})();(function  () {
    var TransformMatrix=yhge.math.TransformMatrix;
    var geo=yhge.geo;

    var NodeTagInvalid=-1;

    var Dirty={
        ALL:0xFFFF,
        TRANSFORM:1,
        TRANSFORM_INVERSE:2,
        TRANSFORM_ALL:3
    };
    
	var idIndex=1;

    var Node=function  () {
        this.initialize.apply(this,arguments);
    };
    Node.prototype={
        
        classname:"Node",
        
        initialize:function(){
            
            //this._isTransformDirty=true;
            this._dirty=Dirty.ALL;//每位代表一个dirty位

            this._position={x:0,y:0};
            this._scaleX=1;
            this._scaleY=1;
            this._rotation=0;
            this._isRelativeAnchorPoint=true;
            this._anchorPoint={x:0,y:0};
            this._anchor={x:0,y:0};
            this._opacity=1;
            this._visible=true;
            this._zOrder=0;
            this._parent=null;
            this._children=[];
            this._retainCount=0;
            this._contentSize={width:0,height:0};
            this._tag=NodeTagInvalid;
            this._useAnchor=false;
			this._id=idIndex++;
        },
		getId:function(){
			return this._id;
		},
        setPosition:function  (x,y) {
            if(typeof x=="object"){
                y=x.y;
                x=x.x;
            }
            this._position.x=x;
            this._position.y=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getPosition:function  () {
            return this._position;
        },
        setPositionX:function  (x) {
            this._position.x=x;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getPositionX:function () {
            return this._position.x;
        },
        setPositionY:function  (y) {
            this._position.y=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getPositionY:function () {
            return this._position.y;
        },
        setScaleX:function  (x) {
            this._scaleX=x;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getScaleX:function  () {
            return this._scaleX;
        },
        setScaleY:function  (y) {
            this._scaleY=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getScaleY:function  () {
            return this._scaleY;
        },
        //one or two parameters
        setScale:function  (scaleX,scaleY) {
            this._scaleX=scaleX
            this._scaleY=typeof scaleY=="undefined"?scaleX:scaleY;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getScale:function  () {
            return {x:this._scaleX,y:this._scaleY};
        },
        setRotation:function  (rotation) {
            this._rotation=rotation;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this;
        },
        getRotation:function  () {
            return this._rotation;
        },
        setIsRelativeAnchorPoint:function  (isRelativeAnchorPoint) {
            this._isRelativeAnchorPoint=isRelativeAnchorPoint;
            return this;
        },
        getIsRelativeAnchorPoint:function  () {
            return this._isRelativeAnchorPoint;
        },
        setAnchorPoint:function  (x,y) {
            if(typeof x=="object"){
                y=x.y;
                x=x.x;
            }
            this._anchorPoint.x=x;
            this._anchorPoint.y=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this
        },
        setAnchorPointX:function  (x) {
            this._anchorPoint.x=x;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this
        },
        setAnchorPointY:function  (y) {
            this._anchorPoint.y=y;
            this._dirty|=Dirty.TRANSFORM_ALL;
            return this
        },
        getAnchorPoint:function  () {
            return this._anchorPoint;
        },
        setOpacity:function  (opacity) {
            this._opacity=opacity;
            return this;
        },
        getOpacity:function  () {
            return this._opacity;
        },
        setVisible:function  (visible) {
            this._visible=visible;
            return this;
        },
        getVisible:function  () {
            return this._visible;
        },
        setZOrder:function  (z) {
            this._zOrder=z;
            return this;
        },
        getZOrder:function  () {
            return this._zOrder;
        },
        setTransformMatrix:function(transformMatrix) {
           this._transformMatrix = transformMatrix;
           this._dirty &=~Dirty.TRANSFORM_ALL;
           return this;
        },
        getTransformMatrix:function() {
           return this._transformMatrix;
        },
        
        setTag:function(tag){
           this._tag=tag;
           return this;
        },
        getTag:function(){
            return this._tag;
        },

        setContentSize:function(contentSize) {
            this._contentSize = arguments.length==1?contentSize:{width:arguments[0],height:arguments[1]};
            if(this._useAnchor){
                this.setAnchorPoint(
                    this._anchor.x*this._contentSize.width,
                    this._anchor.y*this._contentSize.height
                );
            }
            return this;
        },
        getContentSize:function() {
            return this._contentSize;
        },
        setWidth:function(width) {
            this._contentSize.width = width;
            if(this._useAnchor){
                this.setAnchorPointX(this._anchor.x*this._contentSize.width);
            }
            return this;
        },
        getWidth:function() {
            return this._contentSize.width;
        },
        setHeight:function(height) {
            this._contentSize.height = height;
            if(this._useAnchor){
                this.setAnchorPointY(this._anchor.y*this._contentSize.height);
            }
            return this;
        },
        getHeight:function() {
            return this._contentSize.height;
        },

        setAnchorX:function(x){
            this._anchor.x=x;
            this._useAnchor=true;
            if(this._contentSize.width>0)
                this.setAnchorPointX(this._anchor.x*this._contentSize.width);
            return this;
        },

        setAnchorY:function(y){
            this._anchor.y=y;
            this._useAnchor=true;
            if(this._contentSize.height>0)
                this.setAnchorPointY(this._anchor.y*this._contentSize.height);
            return this;
        },

        setAnchor:function(x,y) {
            if(typeof x=="object"){
                y=x.y;
                x=x.x;
            }
            this._anchor.x=x;
            this._anchor.y=y;
            this._useAnchor=true;
            this.setAnchorPoint(
                this._anchor.x*this._contentSize.width,
                this._anchor.y*this._contentSize.height
            );
            return this;
        },
        getAnchor:function() {
            return this._anchor;
        },
        getAnchorX:function() {
            return this._anchor.x;
        },
        getAnchorY:function() {
            return this._anchor.y;
        },
		
		// setClip:function(clip) {
		//             this._clip = clip;
		//             return this;
		//         },
		//         getClip:function() {
		//             return this._clip;
		//         },

        draw:function(context){

        },
		
		// drawClip:function(context){
		// 	this._clip && this._clip.draw(context);
		// },
		
		
		//clip添加到children里
		
        render: function (context) {
            if (!this._visible) {
                return;
            }

            context.save();

            this.transform(context);

            // Set alpha value (global only for now)
            context.globalAlpha = this._opacity;
            
            this.draw(context);

            // Draw child 
            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
                this._children[i].render(context);
            }

            context.restore();
        },
        //在设置变化矩阵的时候，先移动，再旋转，再缩放。
        //先旋转再缩放与先缩放再旋转的图形不一样，而先旋转再缩放符合人们的思考习惯。
        //变化方时的anchorPoint
        //一、用于transform时的中心点。layer,scene等
        //二、满足一外，还是位置的定位点。spite
        //直接使用transform matrix
        transform: function (context) {
            //transform matrix
            var matrix=this.nodeToParentTransform();
            context.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
        },
		// transform: function (context) {
            // // Translate
            // //layer scene _isRelativeAnchorPoint=false
            // if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                // context.translate(Math.round(this._anchorPoint.x), Math.round(this._anchorPoint.y));
            // }
//             
            // if(this._position.x!=0 || this._position.y!=0){
                // //
                // context.translate(Math.round(this._position.x), Math.round(this._position.y));
            // }
//             
// 
            // // Rotate 顺时针.坐标原点在左上角，正方向为顺时针;坐标原点在左下角，正方向为逆时针。
            // if(this._rotation!=0){
                // //
                // context.rotate(geo.degreesToRadians(this._rotation));
            // }
            // // Scale
            // if(this._scaleX!=1 || this._scaleY!=1){
                // //
                // context.scale(this._scaleX, this._scaleY);
            // }
            // //anchor point
            // if (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0) {
                // //
                // context.translate(Math.round(-this._anchorPoint.x), Math.round(-this._anchorPoint.y));
            // }
        // },
        nodeToParentTransform: function () {
            if (this._dirty & Dirty.TRANSFORM) {

                this._transformMatrix = TransformMatrix.getIdentity();

                if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                    this._transformMatrix.setTranslate(this._anchorPoint.x, this._anchorPoint.y);
                }

                if (this._position.x!=0 || this._position.y!=0) {
                    this._transformMatrix.setTranslate(this._position.x, this._position.y);
                }

                if (this._rotation !== 0) {
                    //保持方向一致。由于canvas坐标原点在左上角，正方向为顺时针。我们的坐标系统和canvas坐标系统一致，所以方向保持一致。如果使用坐标原点在左下角，则此处为负。
                    this._transformMatrix.setRotate(geo.degreesToRadians(this._rotation));
                }
                if (!(this._scaleX == 1 && this._scaleY == 1)) {
                    this._transformMatrix.setScale(this._scaleX, this._scaleY);
                }

                if (this._anchorPoint.x!=0 || this._anchorPoint.y!=0) {
                    this._transformMatrix.setTranslate(-this._anchorPoint.x, -this._anchorPoint.y);
                }
                this._dirty &= ~Dirty.TRANSFORM;
            }

            return this._transformMatrix;
        },

        parentToNodeTransform: function () {
            if(this._dirty & Dirty.TRANSFORM_INVERSE){
                this._inverse=this.nodeToParentTransform().invert();
                this._dirty &= ~Dirty.TRANSFORM_INVERSE;
            }
            return this._inverse;
        },

        nodeToWorldTransform: function () {
            var t = this.nodeToParentTransform().clone();

            var p=this._parent,parentTransform;
            while(p){
                parentTransform=p.nodeToParentTransform();
                if(parentTransform) t = t.concat(parentTransform);
                p=p._parent;
            }
            return t;
        },

        worldToNodeTransform: function () {
            return this.nodeToWorldTransform().invert();
        },
//        screenToLocal: function(x,y){
//            var parent = this._parent;
//            if(!parent) return {x:x,y:y};
//                
//            var location = parent.screenToLocal(x,y);
//            if(!location) return undefined;
//            
//            x = location.x;
//            y = location.y;
//            
//            // Undo translation.
//            var p = this._position;
//            x -= p.x;
//            y -= p.y;
//            
//            // Undo rotation.
//            var r = this._rotation * Math.PI / 180;
//            var cosr = Math.cos(r);
//            var sinr = Math.sin(r);
//            var tx = cosr*x + sinr*y;
//            var ty = -sinr*x + cosr*y;
//            x = tx;
//            y = ty;
//            
//            // Undoe scale.
//            var s = this._scale;
//            x /= s.getX();
//            y /= s.getY();
//            
//            return {x:x,y:y};
//        },
        /**
         * Convert a location within the local coordinate space for this Node  to a location within the screen coordinate
         * space.
         */
//        localToScreen: function(x,y)
//        {
//            // Undoe scale.
//            var s = this._scale;
//            x *= s.x;
//            y *= s.y;
//            
//            // Undoe rotation.
//            var r = -this._rotation * Math.PI / 180;
//            var cosr = Math.cos(r);
//            var sinr = Math.sin(r);
//            var tx = cosr*x + sinr*y;
//            var ty = -sinr*x + cosr*y;
//            x = tx;
//            y = ty;
//            
//            // Undoe translation.
//            var p = this._position;
//            x += p.x;
//            y += p.y;
//            
//            var parent = this._parent;
//            if(!parent) return {x:x,y:y};
//            
//            var location = parent.localToScreen(x,y);
//            if(!location) return undefined;
//            return location;
//        },
        screenToLocal: function(x,y){
            return this.worldToNodeTransform().pointApply(x,y);
        },
        localToScreen: function(x,y){
            return this.nodeToWorldTransform().pointApply(x,y);
        },
        boundingRect:function () {
            return this.nodeToParentTransform().rectApply(0,0,this._contentSize.width,this._contentSize.height);
        },
        worldBoundingRect:function () {
            return this.nodeToWorldTransform().rectApply(0,0,this._contentSize.width,this._contentSize.height);
        },

        setParent:function  (parent) {
            this._parent=parent;
            return this;
        },
        getParent:function(){
            return this._parent;
        },
        /**
         * Add a child Node
         *
         */
        addChild: function (child,tag) {
            child._willAddToParent(this);

            var z = child._zOrder;
            var added = false;

            for (var i = 0, childLen = this._children.length; i < childLen; i++) {
                var c = this._children[i];
                if (c._zOrder > z) {
                    added = true;
                    this._children.splice(i, 0, child);
                    break;
                }
            }

            if (!added) {
				tag && (child._tag=tag);
                this._children.push(child);
            }

            child._addedToParent(this);
            return this;
        },

        removeChild: function (child) {
            var index = this._children.indexOf(child);
            if(index > -1) {
                child._willRemoveFromParent(this);
                this._children.splice(index, 1);
                child._removedFromParent(this);
            }else{
                throw new Error('removeChild called for a node that is not a child');
            }
            return this;
        },
        _willAddToParent:function(parent){
            if(this._parent)
                this._parent.removeChild(this);
            this._parent = parent;
        },
        _addedToParent:function (parent) {

        },
        _willRemoveFromParent:function (parent) {

        },
        _removedFromParent:function(parent){
            this._parent=null;
        },
        getChildren:function  () {
            return this._children.slice();
        },
        getChildByTag:function(tag){
            if(tag==NodeTagInvalid) return null;

            var children=this._children;
            for(var i=0,l=children.length;i<l;i++){
                if(children[i]._tag==tag) return children;
            }
            return null;
        },

        retain:function  () {
            this._retainCount++;
        },
        release:function  () {
            if(--this._retainCount==0){
                this.destroy();
            }
        },
        destroy:function  () {
            var children = this._children;
            while(children.length)
            {
                this.removeChild(children[0]);
            }
                
            if(this._parent)
            {
                this._parent.removeChild(this);
            }
        },
        clone:function (newObj) {
            newObj=newObj?newObj:new this.constructor();
            newObj._dirty=this._dirty;
            newObj._position=yhge.core.mixin({},this._position);
            newObj._scaleX=this._scaleX;
            newObj._scaleY=this._scaleY;
            newObj._rotation=this._rotation;
            newObj._isRelativeAnchorPoint=this._isRelativeAnchorPoint;
            newObj._anchorPoint=yhge.core.mixin({},this._anchorPoint);
            newObj._opacity=this._opacity;
            newObj._visible=this._visible;
            newObj._zOrder=this._zOrder;
            newObj._retainCount=this._retainCount;
            newObj._transformMatrix=this._transformMatrix;

            newObj._anchor=yhge.core.mixin({},this._anchor);
            newObj._contentSize=yhge.core.mixin({},this._contentSize);
            return newObj;
        }
    };
    Node.Dirty=Dirty;
    yhge.renderer.Node=Node;
    yhge.renderer.Dirty=Dirty;
})();(function  () {

    var ColorPrototype = yhge.renderer.ColorPrototype;

    /**
     * Sprite 的接口
     */
    var Sprite=yhge.core.Class([yhge.core.Accessor,ColorPrototype],{

        classname:"Sprite",

        initialize:function(props){
            this._color = {r:255, g:255, b:255};
            this._colorString = "rgb(255,255,255)";
            
            //rect都为正数. texture的显示矩形。
            this._flipX=false;
            this._flipY=false;

        },

        initWithTexture:function(texture,rect){
            this.setTexture(texture);
            rect && this.setTextureRect(rect);
        },
        initWithFile:function(file,rect){
            this.setImageFile(file);
            rect && this.setTextureRect(rect);
        },

        setTexture:function(texture) {
            this._texture = texture;
            return this;
        },
        getTexture:function() {
            return this._texture;
        },

        /**
         * rect都为正数，可以用uvs来扩展rect接口。
         */
        setTextureRect:function(rect){
            this._rect=rect;
            rect && this.setContentSize(rect.width,rect.height);
            return this;
        },
        getTextureRect:function(){
            return this._rect;
        },

        setImageFile:function(file){
            this._imageFilename=file;
            return this;
        },
        getImageFile:function(){
            return this._imageFilename;
        },

        setFlipX:function(flipX) {
            this._flipX = flipX;
            return this;
        },
        isFlipX:function() {
            return this._flipX;
        },
        
        setFlipY:function(flipY) {
            this._flipY = flipY;
            return this;
        },
        isFlipY:function() {
            return this._flipY;
        },
        
        setFlip:function(flipX,flipY){
            this._flipX=flipX;
            this._flipY=flipY;
            return this;
        },
        
        clone:function () {
            var newObj=Sprite._super_.clone.apply(this,arguments);
            newObj._texture=this._texture;
            newObj._rect=this._rect;
            newObj._imageFilename=this._imageFilename;
            return newObj;
        }
    });
    yhge.renderer.Sprite=Sprite;
})();(function  () {


    var ColorPrototype = yhge.renderer.ColorPrototype;

    var util=yhge.util;

    var HorizontalAlign={
        Left: "left",
        Center:"center",
        Right: "right"
    };

    var VerticalAlign={
        Top: "top",
        Middle: "middle",
        Bottom: "bottom",
        Alphabetic:"alphabetic"
    };

    /**
     * Text的接口
     */
    var Text=yhge.core.Class([yhge.core.Accessor,ColorPrototype],{

        classname:"Text",

        initialize:function(props){
            

            this._text="";
            this._color={r:0,g:0,b:0};
            this._colorString="rgb(0,0,0)";

            this._horizontalAlign=HorizontalAlign.Center;
            this._verticalAlign=VerticalAlign.Middle;
            this._fontSize="10pt"
            this._fontFamily="Arial";
            this._weight=1;
            this._anchor={x:0,y:0};
            this._originOffset={x:0,y:0};
        },

        setFont:function(font) {
            this._font = font;
            return this;
        },
        getFont:function() {
            return this._font;
        },

        setFontSize:function(fontSize) {
            this._fontSize = fontSize;
            return this;
        },
        getFontSize:function() {
            return this._fontSize;
        },
        setFontFamily:function(fontFamily) {
            this._fontFamily = fontFamily;
            return this;
        },
        getFontFamily:function() {
            return this._fontFamily;
        },

        setTextBaseline:function(textBaseline) {
            this._verticalAlign = textBaseline;
            return this;
        },
        getTextBaseline:function() {
            return this._verticalAlign;
        },

        setHorizontalAlign: function(horizontalAlign)
        {
            this._horizontalAlign = horizontalAlign;
            return this;
        },
        getHorizontalAlign: function(){
            return this._horizontalAlign;
        },

        setVerticalAlign:function(verticalAlign){
            this._verticalAlign = verticalAlign;
            return this;
        },
        getVerticalAlign:function(){
            return this._verticalAlign;
        },

        setWeight:function(weight) {
            this._weight = weight;
            return this;
        },
        getWeight:function() {
            return this._weight;
        },

        setOutlineColor:function(outlineColor) {
            this._outlineColor = outlineColor;
            return this;
        },
        getOutlineColor:function() {
            return this._outlineColor;
        },

        setText:function(text) {
            this._text = text;
            return this;
        },
        getText:function() {
            return this._text;
        },

        setOriginOffset:function(originOffset) {
            this._originOffset = originOffset;
            return this;
        },
        getOriginOffset:function() {
            return this._originOffset;
        },

        setMaxWidth:function(maxWidth) {
            this._maxWidth = maxWidth;
            if(this._maxWidth){
                this._draw=this.draw;
                this.draw=this._drawWithMaxWidth;
            }else{
                this.draw=this._draw;
                this._draw=null;
            }
            return this;
        },
        getMaxWidth:function() {
            return this._maxWidth;
        },

        clone:function(){
            var newObj=Text._super_.clone.apply(this,arguments);
            newObj._text=this._text;
            newObj._color=this._color;
            newObj._colorString=this._colorString;

            newObj._horizontalAlign=this._horizontalAlign;
            newObj._verticalAlign=this._verticalAlign;
            newObj._fontSize=this._fontSize;
            newObj._fontFamily=this._fontFamily;
            newObj._weight=this._weight;
            newObj._anchor=this._anchor;
            newObj._originOffset=this._originOffset;
            newObj._maxWidth=this._maxWidth;
            newObj._font=this._font;
            newObj._outlineColor=this._outlineColor;

            return newObj;
        }

    });

    Text.HorizontalAlign=HorizontalAlign;
    Text.VerticalAlign=VerticalAlign;

    yhge.renderer.Text=Text;
})();(function  ($) {
    var Node=yhge.renderer.Node;

    /**
     * 即时生效。
     * 利用浏览器的渲染时钟，无需一个渲染主循环。
     * 关于transform。由于在画图系统(canvas)中，坐标原点在(0,0)，canvas是左上角，opengl是左下角。
     * 而transform变换都相对于原点进行，即(0,0)点。
     * html中，的transform-origin为物体的中心点，所以再进行旋转，缩放结果和画图系统不一致。
     * 所以把transform-origin设置为(0,0).
     */
    var HTMLNode=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"Node",

        initialize:function(props){
            HTMLNode._super_.initialize.apply(this,arguments);
            this.initView(props);

        },
        setPositionX:function  (x) {
            HTMLNode._super_.setPositionX.apply(this,arguments);
            this.transform();
            return this;
        },
        setPositionY:function  (y) {
            HTMLNode._super_.setPositionY.apply(this,arguments);
            this.transform();
            return this;
        },
        setPosition:function  (x,y) {
            HTMLNode._super_.setPosition.apply(this,arguments);
            this.transform();
            return this;
        },
        setScaleX:function  (x) {
            HTMLNode._super_.setScaleX.apply(this,arguments);
            this.transform();
            return this;
        },
        setScaleY:function  (y) {
            HTMLNode._super_.setScaleY.apply(this,arguments);
            this.transform();
            return this;
        },
        setScale:function  (scaleX,scaleY) {
            HTMLNode._super_.setScale.apply(this,arguments);
            this.transform();
            return this;
        },
        setRotation:function  (rotation) {
            HTMLNode._super_.setRotation.apply(this,arguments);
            this.transform();
            return this;
        },

        setAnchorPoint:function  (x,y) {
            HTMLNode._super_.setAnchorPoint.apply(this,arguments);
            this.transform();
            return this
        },

        setAnchorPointX:function  (x) {
            HTMLNode._super_.setAnchorPointX.apply(this,arguments);
            this.transform();
            return this
        },
        setAnchorPointY:function  (y) {
            HTMLNode._super_.setAnchorPointY.apply(this,arguments);
            this.transform();
            return this
        },

        setTransformMatrix:function(transformMatrix) {
            HTMLNode._super_.setTransformMatrix.apply(this,arguments);
            this.transform();
            return this;
        },

        setContentSize:function(contentSize) {
            HTMLNode._super_.setContentSize.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            this._view.css(this._contentSize);
            return this;
        },

        setWidth:function(width) {
            HTMLNode._super_.setWidth.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            this._view.css({
                width:width
            });
            return this;
        },

        setHeight:function(height) {
            HTMLNode._super_.setHeight.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            this._view.css({
                height:height
            });
            return this;
        },

        setAnchorX:function(x){
            HTMLNode._super_.setAnchorX.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            return this;
        },

        setAnchorY:function(y){
            HTMLNode._super_.setAnchorY.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            return this;
        },

        setAnchor:function(x,y) {
            HTMLNode._super_.setAnchor.apply(this,arguments);
            if(this._dirty&Node.Dirty.TRANSFORM)
                this.transform();
            return this;
        },

        setOpacity:function  (opacity) {
            HTMLNode._super_.setOpacity.apply(this,arguments);
            this._view.css({
                opacity:this._opacity
            });
            return this;
        },

        setVisible:function  (visible) {
            HTMLNode._super_.setVisible.apply(this,arguments);
            this._view.css({
                display:this._visible?"block":"none"
            });
            return this;
        },
        setZOrder:function  (z) {
            HTMLNode._super_.setZOrder.apply(this,arguments);
            this._view.css({
                zIndex:this._zOrder
            });
            return this;
        },

        setRelativeTransformOrigin:function(relativeTransformOrigin) {
            this._isRelativeTransformOrigin = relativeTransformOrigin;
            return this;
        },
        isRelativeTransformOrigin:function() {
            return this._isRelativeTransformOrigin;
        },


        draw:function(context){
//            
            this._view.css({
                zIndex:this._zOrder,
                opacity:this._opacity,
                display:this._visible?this._visibleType:"none"
            });
            return this;
        },

        /**
         * no save and restore
         * @param context
         */
        render: function (context) {
            if (!this._visible) {
                return this;
            }

            this.transform(context);

            this.draw(context);

            // Draw child
            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
                this._children[i].render(context);
            }
            return this;
        },

        transform: function (context) {
            //transform matrix
            var matrix=this.nodeToParentTransform();
//            
            var matrixCss="matrix("+matrix.a.toFixed(8)+","+matrix.b.toFixed(8)+","+matrix.c.toFixed(8)+","+matrix.d.toFixed(8)+","+matrix.tx+","+matrix.ty+")";
            this._setTransformCss(matrixCss);
        },

        _setTransformCss:function(funCss){
            this._view.css({
                transform:funCss,
                WebkitTransform:funCss,
                MozTransform:funCss,
                OTransform:funCss
            });
        },

        _updateTransformOriginCss:function(){
            if(this._isRelativeTransformOrigin){
                this.setTransformOriginByAnchor(this._anchor);
            }else{
                this._setTransformOriginCss("0 0");
            }
        },

        setTransformOriginByAnchor:function(anchor){
            var originX=anchor.x*100,
                originY=anchor.y*100

            var css=originX+"% "+originY+"%";
            this._setTransformOriginCss(css);
        },

        _setTransformOriginCss:function(css){
            this._view.css({
                transformOrigin:css,
                WebkitTransformOrigin:css,
                MozTransformOrigin:css,
                OTransformOrigin:css
            });
        },

        _addedToParent:function (parent) {
            parent._view.append(this._view);
        },
        _willRemoveFromParent:function (parent) {
            //this._view.remove();
            this._view[0].parentNode.removeChild( this._view[0] )
        },
        initView:function(props){
            
            this._view=$('<div/>').addClass(this.classname);
            //关联
            this._view.data("_node_",this);
            this._setTransformOriginCss("0 0");
            return this;
        },
        setView:function(view){
            if(!view.jquery){
                view=$(view);
            }
            view.addClass(this.classname);
            this._view=view;
            //关联
            this._view.data("_node_",this);
            this._setTransformOriginCss("0 0");
            return this;
        },
        getView:function(){
            return this._view;
        },
        _visibleType:"block"
    },{
       setTransformCss:function(view,transformCss){
            view && view.css({
                transform:transformCss,
                WebkitTransform:transformCss,
                MozTransform:transformCss,
                OTransform:transformCss
            });
        }
    });
    yhge.renderer.html.Node=HTMLNode;
})(jQuery);(function ($) {
    /**
     * like image
     */
    var ColorPrototype = yhge.renderer.ColorPrototype;
    var ISprite = yhge.renderer.Sprite;
    var Node = yhge.renderer.html.Node;
    var TransformMatrix=yhge.math.TransformMatrix;
    var geo=yhge.geo;
    var Dirty=Node.Dirty;


    var Sprite = yhge.core.Class([Node, ISprite], {

        classname:"Sprite",

        initialize:function (props) {
            ISprite.prototype.initialize.apply(this, arguments);
            Sprite._super_.initialize.apply(this, arguments);
        },

        draw:function (context) {
            Sprite._super_.draw.apply(this, arguments);
            
            //如果设置了textureRect,则contentSize和textureRect的大小一致，即Sprite的大小，不用显示设置contentSize。
            //如果没有设置textureRect,则texture的大小为整个Sprite的大小，则设不设置contentSize没有关系。

//            if(this._contentSize && this._contentSize.width!=0 && this._contentSize.height!=0){
//                this._view.css({
//                    width:this._contentSize.width,
//                    height:this._contentSize.height
//                });
//            }

////            else{
////                this._view.css({
////                    overflow:"visible"
////                });
////            }
            if (this._flipX || this._flipY) {
                this.drawFlipCss();
            }

            this.drawTextureSize();

        },

        setTexture:function (texture) {
            texture=!texture.jquery?$(texture):texture;
            this._texture.remove();
            Sprite._super_.setTexture.apply(this, arguments);
            this._view.append(this._texture);
            return this;
        },

        setImageFile:function(file){
            Sprite._super_.setImageFile.apply(this, arguments);
            this._texture.attr("src",file);
        },
        setTextureRect:function(rect){
            Sprite._super_.setTextureRect.apply(this, arguments);
            this.drawTextureSize();
            return this;
        },
        //size 为texture的实际大小。
        setUvs:function (uvs,size) {
            this._uvs = uvs;
            
            var rect={};

            rect.x=uvs[0]*size.width;
            rect.y=uvs[1]*size.height;

            if (uvs[2] < 0){
                rect.width=-uvs[2]*size.width;
                this._flipX = true;
            }else{
                rect.width=uvs[2]*size.width;
            }
            if (uvs[3] < 0) {
                rect.height=-uvs[3]*size.height;
                this._flipY = true;
            }else{
                rect.height=uvs[3]*size.height;
            }
            
            this.setTextureRect(rect);

            return this;
        },

        getUvs:function () {
            return this._uvs;
        },

        setFlipX:function (flipX) {
            this._flipX = flipX;
            this.drawFlipCss();
            return this;
        },
        getFlipX:function () {
            return this._flipX;
        },

        setFlipY:function (flipY) {
            this._flipY = flipY;
            this.drawFlipCss();
            return this;
        },
        getFlipY:function () {
            return this._flipY;
        },

        setFlip:function(flipX,flipY){
            this._flipX=flipX;
            this._flipY=flipY;
            this.drawFlipCss();
            return this;
        },
        getFlip:function(){
            return {x:this._flipX,y:this._flipY};
        },

        setContentSize:function(){
            Sprite._super_.setContentSize.apply(this, arguments);
            this.drawTextureSize();
        },

        drawFlipCss:function(){
            var scaleX=this._flipX?-1:1;
            var scaleY=this._flipY?-1:1;

            var transformCss="scale("+scaleX+","+scaleY+")";
            Sprite.setTransformCss(this._texture,transformCss);
        },

        drawTextureSize:function(){
            //TODO add check dirty
            if(this._rect){
                this._texture.css({
                    left:this._rect.x,
                    top:this._rect.y
                });
                this._view.css({
                    width:this._contentSize.width,
                    height:this._contentSize.height,
                    overflow:"hidden"
                });
            }else{
//                this._view.css("overflow","visible");
//                if(this._contentSize && this._contentSize.width!=0 && this._contentSize.height!=0){
//                    this._texture.css({
//                        width:this._contentSize.width,
//                        height:this._contentSize.height
//                    });
//                }

                if(this._contentSize && this._contentSize.width!=0 && this._contentSize.height!=0){
                    this._view.css({
                        width:this._contentSize.width,
                        height:this._contentSize.height,
                        overflow:"visible"
                    });
                    this._texture.css({
                        width:"100%",
                        height:"100%"
                    });
                }else{
                    this._view.css("overflow","visible");
                }
            }
        },


        initView:function(){
            Sprite._super_.initView.apply(this, arguments);
            this._texture=$('<img/>').appendTo(this._view[0]);
            return this;
        }
    });
    yhge.renderer.html.Sprite = Sprite;
})(jQuery);(function  () {
    /**
     * like text
     */
    var Node=yhge.renderer.html.Node;
    var IText=yhge.renderer.Text;

    var HorizontalAlign=IText.HorizontalAlign;

    var VerticalAlign=IText.VerticalAlign;

    var Text=yhge.core.Class([Node,IText],{

        classname:"Text",

        HorizontalAlign:HorizontalAlign,
        VerticalAlign:VerticalAlign,
        
        initialize:function(props){

            IText.prototype.initialize.apply(this,arguments);
            Text._super_.initialize.apply(this,arguments);

        },

        draw:function  (context) {
            Text._super_.draw.apply(this,arguments);
            var css={
                width:this._contentSize.width,
                height:this._contentSize.height

            };

            var contentCss={
                textAlign: this._horizontalAlign,
                verticalAlign: this._verticalAlign,
                fontSize:this._fontSize
            };

            if(this._fontFamily) css.fontFamily=this._fontFamily;
            if(this._color) css.color=this.getColorString();

            this._view.css(css);
            this._contentView.css(contentCss);
            //show content
            var text=this._text?this._text.replace(/\n/g,"<br/>"):this._text;
            this._contentView.html(text);
        },

        setColor:function(color) {
            Text._super_.setColor.apply(this,arguments);
            this._contentView.css("color",this.getColorString());
            return this;
        },

        setText:function(text) {
            Text._super_.setText.apply(this,arguments);
			this._contentView.html(text);
            return this;
        },
        setHorizontalAlign: function(horizontalAlign)
        {
            Text._super_.setHorizontalAlign.apply(this,arguments);

			this._contentView.css("text-align",horizontalAlign);
            return this;
        },

        setVerticalAlign: function(verticalAlign)
        {
            Text._super_.setVerticalAlign.apply(this,arguments);
			this._contentView.css("vertical-align",verticalAlign);
            return this;
        },

        setFontFamily: function(fontFamily)
        {
            Text._super_.setFontFamily.apply(this,arguments);
			this._contentView.css("font-family",fontFamily);
            return this;
        },

        setFontSize: function(fontSize)
        {
            Text._super_.setFontSize.apply(this,arguments);
			this._contentView.css("font-size",fontSize);
            return this;
        },

        initView:function(){
            Text._super_.initView.apply(this,arguments);
            this._contentView=$('<span class="cnt"></span>');
            this._view.append(this._contentView);
            return this;
        },
        setView:function(view){
            Text._super_.setView.apply(this,arguments);
            var contentView=this._view.children(".cnt");
            if(contentView && contentView.length){
                this._contentView=contentView;
            }else{
                this._contentView=$('<span class="cnt"></span>');
                this._view.append(this._contentView);
            }
            return this;
        },
        _visibleType:"table"
    });
    yhge.renderer.html.Text=Text;
})();