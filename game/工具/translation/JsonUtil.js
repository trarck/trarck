var JsonUtil = {
    /**
     * 近转键值
     * @param obj
     * @param keepMultiValue
     */
    flip:function (obj,keepMultiValue) {

        if(keepMultiValue) return JsonUtil.flipKeepMultiValue(obj);

        var ret = {};
        var value;
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                value = obj[k];
                ret[value] = k;
            }
        }
        return ret;
    },

    /**
     * 返转键值
     * 如果值有重复的，则键使用数组保存
     * @param obj
     */
    flipKeepMultiValue:function (obj) {
        var ret = {};
        var value, temp;
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                value = obj[k];
                if (ret[value] == null) {
                    ret[value] = k;
                } else {
                    temp = ret[value];
                    if (temp instanceof Array) {
                        temp.push(k);
                    } else {
                        ret[value] = [temp, k];
                    }
                }
            }
        }
        return ret;
    },

    /**
     * 给对象应用差值
     * @param src
     * @param diff
     */
    applyDiff:function (src, diff) {
        var ret = JsonUtil.clone(src);
        //add
        for (var k in diff.adds) {
            ret[k] = diff.adds[k];
        }
        //update
        for (var k in diff.updates) {
            ret[k] = typeof diff.updates[k]=="object"?diff.updates[k].to:diff.updates[k];
        }
        //remove
        for (var k in diff.removes) {
            delete ret[k];
        }
        return ret;
    },

    /**
     * 计算二个对象的不同
     * @param src
     * @param dest
     */

    diff:function (src, dest) {
        var adds = {};
        var removes = {};
        var updates = {};

        dest = JsonUtil.clone(dest);

        for (var k in src) {
            if (dest[k] != null) {

                if (src[k] != dest[k]) {
                    updates[k] = {
                        from:src[k],
                        to:dest[k]
                    };
                }
                delete dest[k];
            } else {
                removes[k] = src[k];
            }
        }

        //check the add
        for (var k in dest) {
            adds[k] = dest[k];
        }

        return {
            adds:adds,
            removes:removes,
            updates:updates
        };
    },

    /**
     * 给对象应用差值
     * 递归应用每个子对象
     * @param src
     * @param diff
     */
    applyDiffDeep:function (src, diff) {
        var ret = JsonUtil.clone(src);
        //add
        for (var k in diff.adds) {
            ret[k] = diff.adds[k];
        }
        //update
        for (var k in diff.updates) {
            //check should deep apply . src shuold plain object,dest should diff
            if(JsonUtil.isPlainObject(src[k]) && (diff.updates[k].adds || diff.updates[k].updates || diff.updates[k].removes) ){
                ret[k] = JsonUtil.applyDiffDeep(src[k],diff.updates[k]);
            }else{
                typeof diff.updates[k]=="object"?diff.updates[k].to:diff.updates[k];
            }
        }
        //remove
        for (var k in diff.removes) {
            delete ret[k];
        }
        return ret;
    },

    /**
     * 计算二个对象的不同
     * 递归计算每个子对象
     * @param src
     * @param dest
     */
    diffDeep:function (src, dest) {
        var adds = {};
        var removes = {};
        var updates = {};

        dest = JsonUtil.clone(dest);

        for (var k in src) {
            if (dest[k] != null) {

                if (src[k] != dest[k]) {
                    //ignore array
                    if(JsonUtil.isPlainObject(src[k]) && JsonUtil.isPlainObject(dest[k])){
                        updates[k]=JsonUtil.diffDeep(src[k],dest[k]);
                    }else{
                        updates[k] = {
                            from:src[k],
                            to:dest[k]
                        };
                    }
                }

                delete dest[k];
            } else {
                removes[k] = src[k];
            }
        }

        //check the add
        for (var k in dest) {
            adds[k] = dest[k];
        }

        return {
            adds:adds,
            removes:removes,
            updates:updates
        };
    },

    clone:function (obj) {
        var ret = {};
        for (var k in obj)
            if (obj.hasOwnProperty(k)) {
                ret[k] = obj[k];
            }
        return ret;
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
exports.JsonUtil = JsonUtil;

