/*
 *定义类与部件
 */
var yhge={};
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
                    }:function(){this.initialize.apply(this,arguments);};
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
                for (var i = 1,l=extend.length; i<l ; i++) {
                    if (extend[i].prototype) {
                        prototypes.push(extend[i].prototype);
                    }
                }
                superclassProto=this.mixinIf.apply(this, prototypes);
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

            for(; i < arguments.length; i++) {
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
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

            for(; i < arguments.length; i++) {
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        
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
                            target[ name ] = this.mixin( deep, src, copy );
        
                        // Don't bring in undefined values
                        } else if ( !src && copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
                // Get the object
                var object = arguments[i];

                // Ensure we have an object we can extend with, otherwise, bail.
                if(typeof object != 'object') {
                    return target;
                }

                // Loop through object and bring eerything into the target scope
                for(var key in object) {
                    
                    if(target[key]) continue;
                    
                    var value = object[key];

                    // Ignore undefined values
                    if(typeof value == 'undefined') continue;

                    // Handle null
                    else if(value == null) {
                        target[key] = null;
                    }

                    // Handle objects recursively
                    else if(typeof value == 'object') {
                        target[key] = this.mixinIf(target[key], value);
                    }

                    // For the rest, just do a straight assign
                    else {
                        target[key] = value;
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
        }
    };
})();
