(function(){

    /**
     * 同时只有一个语言存在，就算切换语言，则上个语言的内容被清空。
	 * 键可以是文本，也可以是资源id或路径
     */
    var Localization=function(){
        this.initialize.apply(this,arguments);
    };

    Localization.prototype={

        classname:"Localization",

        initialize:function(){

            this._dictionary={};

        },

        initWithLocal:function(local){
            this.setLocal(local);
            //TODO get local File data
        },

        setLocal:function(local) {
            if(local && this._local!=local){
                this._local = local;
            }
            return this;
        },
        getLocal:function() {
            return this._local;
        },

        setDictionary:function(dictionary) {
            dictionary && (this._dictionary = dictionary);
            return this;
        },
        getDictionary:function() {
            return this._dictionary;
        },


        add:function(key,value){
            this._dictionary[key]=value;
            return this;
        },

        addObject:function(obj){
            var dict=this._dictionary;
            for(var k in obj){
                dict[k]=obj[k];
            }
            return this;
        },

        get:function(key,data){
			if(arguments.length==1){
	            return this._dictionary[key]||key;
	        }else{
				if(arguments.length>2) data=Array.prototype.slice.call(arguments,1);
	            return this.getWithData(this,data);
	        }
        },

        getWithData:function(key,data){
            var value=this._dictionary[key];
            if(value){
                value=typeof data=="object"?
						value.replace(/#\{(\w+)\}/g,function(all,name){
	                    	return data[name]||all;
		                })
						:value.replace(/#\{0\}/g,data);
            }else{
                value=key;
            }
            return value;
        },

        remove:function(key){
            delete this._dictionary[key];
            return this;
        }


    };

    Localization.create=function(local){
		var localization=new Localization();
		localization.setLocal(local);
		//TODO load text map
		//TODO load asset map
		return localization;
    };

    yhge.i18n.Localization=Localization;
})();
