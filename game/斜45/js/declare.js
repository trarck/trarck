/*
 *定义类与部件
 */
(function($){
    var objectPrototype = Object.prototype,
        TOPNS=window;

    YH = YH || {};
    
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
        $.extend(true,subclass,superclass);

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

        overrides && $.extend(true,subclassProto,overrides);
        
        return subclass;
    };
    /*
     *申明类
     *name String
     *prototype Object 原型对象
     *content	Object 类属性(静态)|Function 父类
     */
    YH.declare  = function(name, prototype, content){
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
            //实现继承
            if(var l=parents.length){
                l--;
                for(var i=0;i<l;i++){
                    YH.extend(Class,parents[i])
                }
                YH.extend(Class,parents[l],prototype);
            }else{
                //扩充prototype
                $.extend(true,Class.prototype, prototype);
            }
            //扩充自身属性
            if (content != null) $.extend(true,Class, content);
            return Class;
        }
    };

    YH.Class = function(){
        
    };
})(jQuery);
