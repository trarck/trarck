/* Copyright (c) 2011 DeNA Co., Ltd.
 * Permission is hereby granted, free of charge, to any person to obtain a copy of
 * this software and associated documentation files (collectively called
 * the "Software"), in order to exploit the Software without restriction, including
 * without limitation the permission to use, copy, modify, merge, publish,
 * distribute, and/or sublicense copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS LICENSED TO YOU "AS IS" AND WITHOUT
 * WARRANTY OF ANY KIND. DENA CO., LTD. DOES NOT AND CANNOT
 * WARRANT THE PERFORMANCE OR RESULTS YOU MAY OBTAIN BY
 * USING THE SOFTWARE. EXCEPT FOR ANY WARRANTY, CONDITION,
 * REPRESENTATION OR TERM TO THE EXTENT TO WHICH THE SAME
 * CANNOT OR MAY NOT BE EXCLUDED OR LIMITED BY LAW APPLICABLE
 * TO YOU IN YOUR JURISDICTION, DENA CO., LTD., MAKES NO
 * WARRANTIES, CONDITIONS, REPRESENTATIONS OR TERMS, EXPRESS
 * OR IMPLIED, WHETHER BY STATUTE, COMMON LAW, CUSTOM, USAGE,
 * OR OTHERWISE AS TO THE SOFTWARE OR ANY COMPONENT
 * THEREOF, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * INTEGRATION, MERCHANTABILITY,SATISFACTORY QUALITY, FITNESS
 * FOR ANY PARTICULAR PURPOSE OR NON-INFRINGEMENT OF THIRD
 * PARTY RIGHTS. IN NO EVENT SHALL DENA CO., LTD. BE LIABLE FOR
 * ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * EXPLOITATION OF THE SOFTWARE.
 */

/*
 * URLSprite - extend GL2.Sprite to be able to use URL instead of file path
 *
 */

var Sprite = require('../../../NGCore/Client/GL2/Sprite').Sprite;
var toMD5 = require('../../../NGCore/Client/Core/toMD5').toMD5;
var DownloadFile  = require('../../../NGCore/Client/Network/DownloadFile').DownloadFile;
var FileSystem = require('../../../NGCore/Client/Storage/FileSystem').FileSystem;

var $_lock = {};
var $_queue = {};

exports.URLSprite = Sprite.subclass(
/** @lends Dn.GL2.URLSprite.prototype */
{
	"classname"        :'URLSprite',
    /**	 
     * @class The <code>URLSprite</code> class inherits GL2.Sprite and add the image downloading function.
     * (see <code><a href="GL2.Sprite.html">GL2.Sprite</a></code>).
     * It also has caching mechanism to decrease network trafic.
     **/
    "_default_options" : {
		"cache"          : true,
		"directory"      : "urlsprite",
		"localcachetime" : 3600,
		"cachesize"      : 100
    },
    /**
     * @constructs The default constructor.
     **/
    initialize: function(options) {
		this.options = {};
		if( !options ){
			options = {};
		}
		for( var name in this._default_options ){
			this.options[name] = options.hasOwnProperty(name) ?
				options[name] : this._default_options[name];
		}
		this.tempfiles = {};
    },
    destroy: function($super) {
		for( var file in this.tempfiles ){
			FileSystem.deleteFile( file );
		}
		$super();
    },
	/**
	 * Download a image and set it for this <code>Sprite</code>.
	 * It has same interface as GL2.Sprite but it can use URL instead of local image path.
     * It can accept local image path and at that time, it's behaviour is totally same as GL2.Sprite's setImage method.
     * @param {String} image URL or the directory path to an image referenced by a frame.
     * @param {Core.Size} [size] The size of the image to display (in pixels).
     * @param {Core.Point} [anchor] The anchor coordinates that indicate the image center in the animation.
     * @param {Core.Rect} [uvs] The UV coordinates used to specify the subset of an image.
     * @returns This function returns <code>this</code> to support method invocation chaining.
     **/
	setImage: function($super, image, size, anchor, uvs) {
		if( !image ){
			return this;
		}
		if( image.slice(0,7).toLowerCase() != "http://" &&
			image.slice(0,8).toLowerCase() != "https://" ){
				return $super(image, size, anchor, uvs);
			}
		var url = image;
		var args = {
			_super        : $super,
			url           : url,
			name          : toMD5(url)+this._extractExstension(url),
			size          : size,
			anchor        : anchor,
			uvs           : uvs,
			addpath       : ""
		};
		if( !this.options.cache ){
			var time = new Date();
			args.addpath = "nocahce/" + Math.floor(Math.random()*100) + time.getTime();
		}
		if( !$_queue[this.options.directory] ){
			$_queue[this.options.directory] = [];
		}
		if( $_lock[this.options.directory] ){
			$_queue[this.options.directory].push( this._setImageInternal.bind( this, args ) );
		}else{
			$_lock[this.options.directory] = 1;
			this._setImageInternal( args );
		}
		return this;
    },
	$unlock: function( directory ){
		NgLogD("Unlock URLSprite : " + directory);
		$_lock[directory] = 0;
		$_queue[directory] = [];			
	},
    _extractExstension: function( url ){
		var qpos = url.indexOf("?");
		if( qpos >-1 ){
			url = url.slice(0, qpos);
		}
		var filepos = url.lastIndexOf("/");
		if( filepos > -1 ){
			url = url.slice(filepos+1);
		}
		var dotpos  = url.lastIndexOf(".");
		if( dotpos == -1 ){
			return "";
		}
		var extension = url.slice(dotpos).toLowerCase();
		if( extension == ".jpeg" ){
			extension = ".jpg";
		}
		return extension;
    },
    _setImageInternal: function( args, cache ){
		//	NgLogD("setImageInternal");
		if( this.options.cache ){
			if( cache ){
				this._checkCacheData(args,undefined,undefined,cache);
			}else{
				this._setImageWithCache( args );
			}
		}else{
			this._fetchImage( args, [], -1 );
		}
    },
    _searchCache: function(cache, name){
		var length = cache.length;
		for( var i=0; i<length; i++ ){
			if( cache[i].name == name ){
				return i;
			}
		}
		return -1;
    },
    _setImageWithCache: function( args ){
		NgLogD("_setImageWithCache: " + this.options.directory+"-urlsprite.json" );
		FileSystem.readFile(
			this.options.directory+"-urlsprite.json",
			false,
			this._checkCacheData.bind( this, args )
		);
    },
    _checkCacheData: function( args, error, value, obj ){
//		NgLogD("_checkCacheData:" + error);
		var cache;
		if( obj ){
			NgLogD("_checkCacheData: use queued cache");
			cache = obj;
		}else if( !value || error ){
			cache = [];
		}else{
			cache = JSON.parse(value);
		}
//		NgLogD("_checkCacheData: JSON Parsed");
		var i = this._searchCache( cache, args.name );
//		NgLogD("_checkCacheData: index " + i);
		if( i == -1 ){
			this._fetchImage( args, cache, i );
		}else{
			var now = new Date();
			if( cache[i].epoch + this.options.localcachetime*1000 < now.getTime() ){
				NgLogD("URLSprite: cache hit. but old: "+ args.url);
				this._fetchImage( args, cache, i, cache[i].epoch );
			}else{
				var cachedata = cache[i];
				cache.splice(i,1);
				cache.unshift(cachedata);
				NgLogD("URLSprite: cache hit. update image from cache: " + args.url);
				args._super(this.options.directory + "/" + args.name,
							args.size, args.anchor, args.uvs);		
				this._updateCacheData(args, cache);
			}
		}
    },
    _updateCacheData: function(args, cache){
		var length = cache.length;
		if( length > this.options.cachesize ){
			for( var i = this.options.cachesize; i<length; i++){
				FileSystem.deleteFile( this.options.directory + "/" + cache[i].name );
			}
			cache = cache.slice(0, this.options.cachesize );
		}
		if( $_queue[this.options.directory].length > 0 ){
			NgLogD("_updateCacheData: send cache to next queue");
			var next = $_queue[this.options.directory].shift();
			next(cache);
		}else{
			var jsondata = JSON.stringify(cache);
			FileSystem.writeFile(
				this.options.directory+"-urlsprite.json",
				jsondata,
				false,
				this._finishUpdateCacheData.bind(this, args)
			);
		}
    },
    _finishUpdateCacheData: function( args, error,key ){
		if( $_queue[this.options.directory].length > 0 ){
			var next = $_queue[this.options.directory].shift();
			next();
		}else{
			$_lock[this.options.directory] = 0;
		}
    },
    _fetchImage: function( args, cache, i, epoch ){
		//	NgLogD("Fetch Image");
		var request = new DownloadFile();
		var filepath = this.options.directory + "/" + args.addpath + args.name;
		
		var headers = [];
		//      DownloadFile doesn't return correct status code.
		//	if( epoch ){
		//	    var time = new Date();
		//	    time.setTime(epoch);
		//	    headers.push("If-Modified-Since: "+time.toUTCString());
		//	    NgLogD("URLSprite _fetchImage modified since header: "+headers[0] );
		//	}
		request.start(filepath,
					  "GET",
					  args.url,
					  headers,
					  this._finishFetchImage.bind(this,args, cache, i, request)
					 );
    },
    _finishFetchImage: function(args, cache, i, request, statuscode, filesignature) {
		//	NgLogD("Download finish"+statuscode);
		delete request;
		if( statuscode == 200 ){
			args._super("./"+this.options.directory + "/" + args.addpath + args.name,
						args.size, args.anchor, args.uvs);
			if( this.options.cache ){
				this._addCacheData( args, cache, i );
			}else{
				this._unlockDirectory( args );
			}
		}else if( statuscode == 304 && this.options.cache ){
			args._super("./"+this.options.directory + "/" + args.name,
						args.size, args.anchor, args.uvs);
			this._unlockDirectory( args );
		}else{
			// Error ( Not Found / Unavailable and so on.. )
			this._unlockDirectory( args );
		}
    },
    _unlockDirectory: function( args ){
		this.tempfiles["./"+this.options.directory + "/" + args.addpath + args.name] = 1;
		if( $_queue[this.options.directory].length > 0 ){
			var next = $_queue[this.options.directory].shift();
			next();
		}else{
			$_lock[this.options.directory] = 0;
		}
    },
    _addCacheData: function( args, cache, i ){
		if( !(cache instanceof Array) ){
			cache = [];
		}
		var now = new Date();
		var cachedata = {
			"name" : args.name,
			"epoch" : now.getTime()  
		};
		if( i > -1 ){
			if( cache[i].name != args.name ){
				i = this._searchCache( cache, args.name );
			}
			if( i > -1 ){
				cache.splice(i,1);		
			}
		}
		cache.unshift(cachedata);
		this._updateCacheData(args, cache);
    }
});
