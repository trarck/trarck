(function(){
    var util={
        getType:function (obj) {
            var type = typeof obj;
            if ('object' == type){
                if (obj) {
                    if (obj instanceof Array) return 'array';
                    if (obj instanceof Object) return type;
                    var nativeType = Object.prototype.toString.call(obj);
                    if ('[object Window]' == nativeType) return 'object';
                    if ('[object Array]' == nativeType ||
                        'number' == typeof obj.length && 'undefined' != typeof obj.splice && 
                        'undefined' != typeof obj.propertyIsEnumerable && !obj.propertyIsEnumerable('splice'))
                        return 'array';
                    if ('[object Function]' == nativeType || 
                        'undefined' != typeof obj.call && 
                        'undefined' != typeof obj.propertyIsEnumerable && 
                        !obj.propertyIsEnumerable('call')) 
                        return 'function';
                } else {
                    return 'null';
                }
            }else if ('function' == type && 'undefined' == typeof obj.call) {
                return 'object';
            }
            return type;
        },
        function proxy(fun, scope) {
            return function() {
                return fun.apply(scope, Array.prototype.slice.call(arguments));
            };
        }
    };
    //yh.util=util;
    yh.core.mixin(yh.util,util);
})();