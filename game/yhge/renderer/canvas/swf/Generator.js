(function () {

    var Shape=yhge.renderer.canvas.swf.Shape;
    var ShapeCache=yhge.renderer.canvas.swf.ShapeCache;
    var MorphShape=yhge.renderer.canvas.swf.MorphShape;
    var MovieClip=yhge.renderer.canvas.swf.MovieClip;
    var GlyphShape=yhge.renderer.canvas.swf.GlyphShape;
    var GlyphFont=yhge.renderer.canvas.swf.GlyphFont;
    var GlyphText=yhge.renderer.canvas.swf.GlyphText;
    var DynamicText=yhge.renderer.canvas.swf.DynamicText;
    var Button=yhge.renderer.canvas.swf.Button;


    var Generator=function(context,imageRoot,config){
        this._imagePreLoadCount=0;
        this._loadedImages={};
        this._context=context;
        this._imageRoot=imageRoot?(imageRoot.charAt(imageRoot.length-1)=="/"?imageRoot:imageRoot+"/"):"";
		this._imageCache={};
    };

    Generator.prototype={

        setContext:function(context) {
            this._context = context;
            return this;
        },
        getContext:function() {
            return this._context;
        },
        setImageRoot:function(imageRoot) {
            this._imageRoot = imageRoot?(imageRoot.charAt(imageRoot.length-1)=="/"?imageRoot:imageRoot+"/"):"";
            return this;
        },
        getImageRoot:function() {
            return this._imageRoot;
        },

		setImageCache:function(imageCache) {
            this._imageCache = imageCache;
            return this;
        },
        getImageCache:function() {
            return this._imageCache;
        },
           

        /**
         * 保证使用的图片都已经加载到内存中。
         * @param characters
         */
        generateCharacters:function (characters,config) {
            var context=this._context;
            var dict={};
            var character;
            config=config||{};
//            console.log(characters);
            for(var i in characters){
//                console.log("generate:",i);
                character=characters[i];
                switch (character.className) {
                    case "Shape":
                        if(config.shapeCache){
                            dict[character.characterId]=ShapeCache.createShape(context,character,dict,config);
                        }else{
                            dict[character.characterId]=Shape.createShape(context,character,dict,config);//generateShape(c,ctx);
                        }
                        break;
                    case "MorphShape":
                        dict[character.characterId]=MorphShape.crateMorphShape(context,character,dict,config);
                        break;
                    case "MovieClip":
                        dict[character.characterId]=MovieClip.createMovieClip(context,character,dict,config);//generateMovieClip(c,ctx,dict);
                        break;
                    case "Bitmap":
                        dict[character.characterId]=this._loadedImages[character.characterId];
                        break;
                    case "GlyphFont":
                        dict[character.characterId]=GlyphFont.create(context,character,dict,config);
                        break;
                    case "GlyphText":
                        dict[character.characterId]=GlyphText.create(context,character,dict,config);
                        break;
                    case "DynamicText":
                        dict[character.characterId]=DynamicText.create(context,character,dict,config);
                        break;
                    case "Button":
                        dict[character.characterId]=Button.create(context,character,dict,config);
                        break;
                    default:
                        throw("the class "+character.className+" don't surpport");
                };
            }
            return dict;
        },
        preloadImage:function(characters,callback){
            var self=this;
            var character,img,src;
            this.onPreloadSuccess=callback|| this.onPreloadSuccess;
            for(var i in characters){
                character=characters[i];
                if (character.className=="Bitmap") {
                    //TODO 如果定义中的图片含有原始的二进制数据，使用canvas生成图片。
					src=this._imageRoot+character.src;
					console.log('src:'+src,this._imageCache[src]);
					if(this._imageCache[src]){
						this._loadedImages[character.characterId]=this._imageCache[src];
					}else{
						img=new Image();
                    	this._imagePreLoadCount++;
	                    img.onload=(function(path){
							return function(){
								self._imageCache[path]=this;
	    	                    self._imagePreLoadCount--;
		                        self._checkImagePreLoad();
							};
	                    })(src);

                        img.onerror=(function(path){
                            return function(){
                                throw "preload image error src="+path;
                            }
                        })(src);
	                    img.src=src;
	                    this._loadedImages[character.characterId]=img;
					}
                    
                }
            }
            self._checkImagePreLoad();
        },
        _checkImagePreLoad:function(){
//            console.log("onLoad:"+this._imagePreLoadCount);
            if(this._imagePreLoadCount<=0){
                //do image load ok
                this.onPreloadSuccess && this.onPreloadSuccess();
            }
        }
    };

    yhge.renderer.canvas.swf.Generator=Generator;

})();