(function() {
    YH = typeof YH=="undefined"?{}:YH;
    
    YH.accessor= {

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
})();