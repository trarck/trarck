var Core  = require('../NGCore/Client/Core').Core;
var Device   = require('../NGCore/Client/Device').Device;

var rdashAlpha = /_([a-z])/ig;
function fcamelCase(letter) {
	return letter.toUpperCase();
}

exports.Util ={
    ucfirst:function  (str){
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    },
    camelCase:function(string){
        return string.replace( rdashAlpha, fcamelCase );
    },
    getScreenSize:function(){
        var w,h;
        if(Device.OrientationEmitter.getInterfaceOrientation()==Device.OrientationEmitter.Orientation.LandscapeLeft){
            h=Core.Capabilities.getScreenWidth();
            w=Core.Capabilities.getScreenHeight();
        }else{
            w=Core.Capabilities.getScreenWidth();
            h=Core.Capabilities.getScreenHeight();
        }
        return new Core.Size(w,h);
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
    getAttribute: function(obj, name){
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
    setAttribute:function(obj,name,v){
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
        
        return obj;
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
	mixin:function(){
        
        var self = this;
        
        // Make sure we have a target
        if(arguments.length == 0) return {};

        // Get the tag
        var target = arguments[0];

        // Ensure we have an extendable target
        if(typeof target != 'object' && typeof target != 'function') {
            target = {};
        }

        for(var i = 1; i < arguments.length; i++) {
            // Get the object
            var object = arguments[i];

            // Ensure we have an object we can extend with, otherwise, bail.
            if(typeof object != 'object') {
                return target;
            }

            // Loop through object and bring eerything into the target scope
            for(var key in object) {
                var value = object[key];

                // Ignore undefined values
                if(typeof value == 'undefined') continue;

                // Handle null
                else if(value == null) {
                    target[key] = null;
                }

                // Handle objects recursively
                else if(typeof value == 'object') {
                    target[key] = this.mixin(target[key], value);
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
    mixinIf:function(){
        
        var self = this;
        
        // Make sure we have a target
        if(arguments.length == 0) return {};

        // Get the tag
        var target = arguments[0];

        // Ensure we have an extendable target
        if(typeof target != 'object' && typeof target != 'function') {
            target = {};
        }

        for(var i = 1; i < arguments.length; i++) {
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
}
