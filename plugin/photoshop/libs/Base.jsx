/*
 *定义类与部件
 */
 var yh;
(function(){
    //require

    //private
    var objectPrototype = Object.prototype,TOPNS=$;
    
    //define
    yh={
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
                p = yh.ucfirst(namespace[ii]);
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
    //                sourceClass: 'yh',
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
                    var nsc = yh.createNameSpace(name);
                    var cName = yh.ucfirst(nsc.cName);
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

//                console.log("initializes:",overrides.classname,initializes.length);
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
            if ( typeof target === "boolean" || typeof target==="number") {
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
                            // target[ name ] = this.mixin( deep, src, copy );
        					target[ name ] = this.mixin( deep===true?deep:deep-1, src, copy );
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
            if ( typeof target === "boolean" || typeof target==="number") {
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
                            // target[ name ] = this.mixinIf( deep, src, copy );
        					target[ name ] = this.mixinIf( deep===true?deep:deep-1, src, copy );
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
        },
        throwError:function(err){
            throw err;
        }
    };
})();
