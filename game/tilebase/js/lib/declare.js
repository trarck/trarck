/*
 *定义类与部件
 */
(function(){
    var objectPrototype = Object.prototype,
        TOPNS=window;

    YH = typeof YH=="undefined"?{}:YH;
    
    YH.ucfirst = function(str){
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    }
    
    YH.lcfirst = function(str){
        str += '';
        var f = str.charAt(0).toLowerCase();
        return f + str.substr(1);
    }
    /*
     *创建命名空间
     */
    YH.createNameSpace  = function(name){
        var namespace = name.split("."), name = namespace.pop(), ns = TOPNS, p;
        for (var ii in namespace) {
            p = YH.ucfirst(namespace[ii]);
            ns = (p in ns ? ns[p] : ns[p] = {});
        }
        return {
            "ns": ns,
            "cName": name
        };
    };
    YH.extend=function(subclass, superclass, overrides) {
        
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
        this.mixin(true,subclass,superclass);

        // Copy prototype from superclass.
        var F = function() {},
            subclassProto, superclassProto = superclass.prototype;

        F.prototype = superclassProto;
        subclassProto = subclass.prototype = new F();
        subclassProto.constructor = subclass;
        subclassProto._super_=superclassProto;
        //subclass.superclass = superclassProto;

        if (superclassProto.constructor === objectPrototype.constructor) {
            superclassProto.constructor = superclass;
        }

        overrides && this.mixin(true,subclassProto,overrides);
        
        return subclass;
    };
    /*
     *申明类
     *name String
     *prototype Object 原型对象
     *content	Object 类属性(静态)|Function 父类
     */
    YH.declare  = function( name, prototype, content){
        if(typeof name=="string"){
            var pos=3,parents;
            if(typeof content=="function"){
                pos=2;
                content=null;
                parents=Array.prototype.slice(arguments,pos);
            }
            
            var nsc = YH.createNameSpace(name);
            var cName = YH.ucfirst(nsc.cName);
            var Class=nsc.ns[cName] = function(){
                this._super_.constructor.apply(this,arguments);
            };
            //命名空间
            Class.nameSpace = nsc.ns;
            //名称
            Class.className = cName;
            var l=parents.length
            //实现继承
            if(l){
                l--;
                for(var i=0;i<l;i++){
                    YH.extend(Class,parents[i])
                }
                YH.extend(Class,parents[l],prototype);
            }else{
                //扩充prototype
                this.mixin(true,Class.prototype, prototype);
            }
            //扩充自身属性
            if (content != null) this.mixin(true,Class, content);
            return Class;
        }
    };

    /**
     * {base:class||string,
       overrides:{},
       content:{},
       extend:[class,class]
       }
     */
    YH.Class = function(){
        var subclass,overrides,content,extend;//父类的prototype方法,如果父类有几个则是其和
        
        if(arguments.length==1){
            var conf=arguments[0];
            subclass=conf.base;
            overrides=conf.overrides;
            content=conf.content;
            extend=conf.extend;
            
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
            //subclass.superclass = superclassProto;
    
            if (superclassProto.constructor === objectPrototype.constructor) {
                superclassProto.constructor = superclass;
            }
            overrides&&this.mixin(true,subclassProto,overrides);
            
            // Copy statics from superclass.
            var contents=(content?[true,subclass,content]:[true,subclass]).concat(extend);
            this.mixinIf.apply(this, contents);
            
        }
        return subclass;
    };
    YH.mixin=function(){
        
        var self = this;
        
        // Make sure we have a target
        if(arguments.length == 0) return {};

        // Get the tag
        var target = arguments[0];
        
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

        for(var i = 1; i < arguments.length; i++) {
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    copy = options[ name ];
                    // Prevent never-ending loop
                    if ( target === copy ) {
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
    };
    YH.mixinIf=function(){
        
        var self = this;
        
        // Make sure we have a target
        if(arguments.length == 0) return {};

        // Get the tag
        var target = arguments[0];
        
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

        for(var i = 1; i < arguments.length; i++) {
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    copy = options[ name ];
    
                    // Prevent never-ending loop
                    if ( target === copy ) {
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
    }
})();
