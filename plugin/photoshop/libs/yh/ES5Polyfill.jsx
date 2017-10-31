(function(){
    if(!Object.prototype.iterator){
        Object.prototype.iterator = function(callback, scope) {
            for (var k in this) this.hasOwnProperty(k) && callback.call(scope, this[k], k);
        };
    }
    
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {
                },
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    if(!Array.isArray) {
        Array.isArray = function (vArg) {
            return Object.prototype.toString.call(vArg) === "[object Array]";
        };
    }

    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, thisArg) {

            var T, A, k;

            if (this == null) {
                throw new TypeError(" this is null or not defined");
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== "function") {
                throw new TypeError(callback + " is not a function");
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (thisArg) {
                T = thisArg;
            }

            // 6. Let A be a new array created as if by the expression new Array(len) where Array is
            // the standard built-in constructor with that name and len is the value of len.
            A = new Array(len);

            // 7. Let k be 0
            k = 0;

            // 8. Repeat, while k < len
            while (k < len) {

                var kValue, mappedValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[ k ];

                    // ii. Let mappedValue be the result of calling the Call internal method of callback
                    // with T as the this value and argument list containing kValue, k, and O.
                    mappedValue = callback.call(T, kValue, k, O);

                    // iii. Call the DefineOwnProperty internal method of A with arguments
                    // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                    // and false.

                    // In browsers that support Object.defineProperty, use the following:
                    // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                    // For best browser support, use the following:
                    A[ k ] = mappedValue;
                }
                // d. Increase k by 1.
                k++;
            }

            // 9. return A
            return A;
        };
    }
    
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function reduce(accumulator) {
            if (this === null || this === undefined) throw new TypeError("Object is null or undefined");
            var i = 0, l = this.length >> 0, curr;

            if (typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
                throw new TypeError("First argument is not callable");

            if (arguments.length < 2) {
                if (l === 0) throw new TypeError("Array length is 0 and no second argument");
                curr = this[0];
                i = 1; // start accumulating at the second element
            }
            else
                curr = arguments[1];

            while (i < l) {
                if (i in this) curr = accumulator.call(undefined, curr, this[i], i, this);
                ++i;
            }

            return curr;
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach(callback, thisArg) {

            var T, k;

            if (this == null) {
                throw new TypeError("this is null or not defined");
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if ({}.toString.call(callback) !== "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (thisArg) {
                T = thisArg;
            }

            // 6. Let k be 0
            k = 0;

            // 7. Repeat, while k < len
            while (k < len) {

                var kValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (Object.prototype.hasOwnProperty.call(O, k)) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[ k ];

                    // ii. Call the Call internal method of callback with T as the this value and
                    // argument list containing kValue, k, and O.
                    callback.call(T, kValue, k, O);
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }
    
    if(!Array.prototype.first){ 
        Array.prototype.first = function() {
            return (this.length == 0 ? o : this[0]);
        };
    }
    
    if(!Array.prototype.last){
        Array.prototype.last = function() {
            return (this.length == 0 ? null : this[this.length - 1]);
        };
    }
    
    if(!Array.prototype.join){
        Array.prototype.join = function() {
            return (this.length == 0 ? '' : (this.length == 1 ? this[0] : this.slice(0, this.length - 1).join(', ') + ' and ' + this[this.length - 1]));
        };
    }
    
    if(!Array.prototype.find){
        Array.prototype.find = function(callback) {
            for (var i = 0, l = this.length; i < l; ++i) 
                if (callback(this[i], i)) return this[i];
            return null;
        };
    }
    
    if(!Array.prototype.remove){
        Array.prototype.remove = function(callback) {
            for (var i = this.length; --i;i>=0){
                if(callback(this[i], i)){
                    this.splice(i, 1);
                }
            }
        };
    }
    if(!Array.prototype.sort){
        var Array = Array;

        function sort(arr, b) {
          if (arr.length < 2) return arr;
          for (var c = Math.ceil(arr.length / 2), d = sort(arr.slice(0, c), b), c = sort(arr.slice(c), b), e = new Array(); d.length > 0 && c.length > 0;)(b(d[0], c[0]) <= 0 ? e.push(d.shift()) : e.push(c.shift()));
          for (; d.length > 0;) e.push(d.shift());
          for (; c.length > 0;) e.push(c.shift());
          return e;
        }
        
        Array.prototype.sort = function(handle) {
          sort(this, handle);
        };
    }
    
    if(!String.prototype.trim){
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
    
    if(!String.prototype.startsWith){
        String.prototype.startsWith = function(searchString) {
            return this.indexOf(searchString) === 0;
        };
    }
    
    if(!String.prototype.firstChar){
        String.prototype.firstChar = function() {
            return this.substring(0, 1);
        };
    }
    
    if(!String.prototype.ucfirst){
        String.prototype.ucfirst = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
    }      
})();

