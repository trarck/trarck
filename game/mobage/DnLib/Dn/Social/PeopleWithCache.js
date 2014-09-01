/*
 * PeopleWithCache - extend Social.Common.People to use cahce for performance
 *
 *    Now it only supports getUser and getUsers
 */

var Class   = require('../../../NGCore/Client/Core/Class').Class;
var Social = require('../../../NGCore/Client/Social').Social;
var FileSystem = require('../../../NGCore/Client/Storage/FileSystem').FileSystem;

var $_lock  = {};
var $_queue = {};

exports.PeopleWithCache = Class.subclass(
{
    "classname" : "PeopleWithCache",
    "_default_options" : {
		"cache"          : true,
		"key"            : "UserInfo",
		"localcachetime" : 3600,
		"cachesize"      : 100
    },
	initialize: function(options){
		this.options = {};
		if( !options ){
			options = {};
		}
		for( var name in this._default_options ){
			this.options[name] = options.hasOwnProperty(name) ?
				options[name] : this._default_options[name];
		}
    },
    destroy: function($super){
		$super();
    },
    getUser: function(userId, fields, callback){
		if( !this.options.cache ){
			return Social.Common.People.getUser( userId, fields, callback );
		}
		userId = parseInt(userId);
		if( !userId ){
			return;
		}
		var args = {
			userId   : userId,
			fields   : fields,
			callback : callback
		};
		if( !$_queue[this.options.key] ){
			$_queue[this.options.key] = [];
		}
		if( $_lock[this.options.key] ){
			NgLogD( "PeopleWithCache getUser Locked. Add to Queue" );
			$_queue[this.options.key].push( this._getUserInternal.bind( this, args ) );
		}else{
			$_lock[this.options.key] = 1;
			this._getUserInternal( args );
		}
    },
    getUsers: function(userIds, fields, callback){
		if( !this.options.cache ){
			return Social.Common.People.getUsers( userIds, fields, callback );
		}
		if( !userIds || !userIds instanceof Array || userIds.length == 0 ){
			return;
		}
		var args = {
			userIds  : userIds,
			fields   : fields,
			callback : callback
		};
		if( !$_queue[this.options.key] ){
			$_queue[this.options.key] = [];
		}
		if( $_lock[this.options.key] ){
			NgLogD( "PeopleWithCache getUsers Locked. Add to Queue" );
			$_queue[this.options.key].push( this._getUsersInternal.bind( this, args ) );
		}else{
			$_lock[this.options.key] = 1;
			this._getUsersInternal( args );
		}
    },
    clearCache: function(){
		FileSystem.deleteFile(
			this.options.key+"-people.json"
		);
    },
	$unlock: function( key ){
		NgLogD("Unlock PeopleWithCache : "+ key);
		$_lock[key] = 0;
		$_queue[key] = [];
	},
    _cacheRemoved: function(error){
		NgLogD("PeopleWithCache cacheRemoved: " + error );
    },
    _getUserInternal: function( args, cache ){
//		NgLogD("_getUserInternal:　" + this.options.key+"-people.json");
		if( cache ){
			this._checkUserCacheData( args, undefined, undefined, cache );
		}else{
			FileSystem.readFile(
				this.options.key+"-people.json",
				false,
				this._checkUserCacheData.bind( this, args )
			);
		}
    },
    _searchCache: function(cache, id){
		if( cache ) {
			var length = cache.length;
			for( var i=0; i<length; i++ ){
				if( cache[i] && cache[i].id == id ){
					return i;
				}
			}
		}
		return -1;
    },
    _checkUserCacheData: function( args, error, value, obj ){
//		NgLogD("_checkUserCacheData:" + error);
//		NgLogD("_checkUserCacheData:" + value);
		var cache;
		if( obj ){
			NgLogD("_checkUserCacheData: get data from previous queue");
			cache = obj;
		}else if( !value || error ){
			cache = [];
		}else{
			cache = JSON.parse(value);
		}
		var i = this._searchCache( cache, args.userId );
		if( i == -1 ){
			return Social.Common.People.getUser(
				args.userId,
				args.fields,
				this._updateUserCacheData.bind(this, args, cache)
			);
		}else{
			var cachedata = cache[i];
			cache.splice(i,1);
			var now = new Date();
			if( cachedata.epoch + this.options.localcachetime*1000 < now.getTime() ){
				return Social.Common.People.getUser(
					args.userId,
					args.fields,
					this._updateUserCacheData.bind(this, args, cache) 
				);
			}else{
				NgLogD("PeopleWithCache: user info fetched from cache: " + 
					   JSON.stringify(cachedata));
				this._updateUserCacheData(args, cache, undefined, cachedata);
			}
		}
    },
    _updateUserCacheData: function( args, cache, error, cachedata ){
//		NgLogD("_updateUserCacheData:" + error);
//		NgLogD("_updateUserCacheData:" + JSON.stringify(cachedata));
		if( !error ){
			var now = new Date();
			cachedata["epoch"] = now.getTime();
			cache.unshift(cachedata);
			var length = cache.length;
			if( length > this.options.cachesize ){
				cache = cache.slice(0, this.options.cachesize );
			}
			if( $_queue[this.options.key].length > 0 ){
				NgLogD("_updateUserCacheData: data will be passwd to next");
				var next = $_queue[this.options.key].shift();
				next(cache);
				args.callback( error, cachedata );
			}else{
				var jsondata = JSON.stringify(cache);
				FileSystem.writeFile(
					this.options.key+"-people.json",
					jsondata,
					false,
					this._finishUpdateUserCacheData.bind(this, args, cachedata, error )
				);
			}
		}else{
			this._finishUpdateUserCacheData( args, cachedata, error, 
											 undefined, this.options.key );
		}
    },
    _finishUpdateUserCacheData: function(args, cachedata, apierror, error, key ){
//		NgLogD("_finishUpdateUserCacheData:" + error);
		if( $_queue[this.options.key].length > 0 ){
			var next = $_queue[this.options.key].shift();
			next();
		}else{
			$_lock[this.options.key] = 0;
		}
//		NgLogD("_finishUpdateUserCacheData: callback" + JSON.stringify(cachedata));	
		if( args.callback ){
			args.callback( apierror, cachedata );
		}
    },
    _getUsersInternal: function( args, cache ){
//		NgLogD("_getUsersInternal:　" + this.options.key+"-people.json");
		if( cache ){
			this._checkUsersCacheData( args, undefined, undefined, cache );
		}else{
			FileSystem.readFile(
				this.options.key+"-people.json",
				false,
				this._checkUsersCacheData.bind( this, args )
			);
		}
    },
    _checkUsersCacheData: function( args, error, value, obj ){
//		NgLogD("_checkUsersCacheData:" + error);
		var cache;
		if( obj ){
			NgLogD("_checkUsersCacheData: get data from previous queue");
			cache = obj;
		}else if( !value || error ){
			cache = [];
		}else{
			cache = JSON.parse(value);
		}
		var len = args.userIds.length;
		var cachedUserData = [];
		var uncachedUserIds = [];
		var removeIndex    = {};
		var removeCount    = 0;
		var now = new Date();
		var cachetime = this.options.localcachetime*1000;
		for( var j=0; j<len; j++ ){
			var id = parseInt(args.userIds[j]);
			if( !id ){
				continue;
			}
			var i = this._searchCache( cache, id );
			if( i == -1 ){
				uncachedUserIds.push(id);
			}else{
				removeIndex[i] = 1;
				removeCount++;
				if( cache[i].epoch + cachetime < now.getTime() ){
					uncachedUserIds.push(id);
				}else{
					var cachedata = cache[i];
					cachedUserData.push(cachedata);
					NgLogD("PeopleWithCache: user info fetched from cache: " + 
						   JSON.stringify(cachedata));
				}
			}
		}
		if( removeCount ){
			var newCache = [];
			for( var k=0; k<len; k++ ){
				if( !removeIndex[k] ){
					newCache.push( cache[k] );
				}
			}
			cache = newCache;
		}
		if( uncachedUserIds.length > 0 ){
//			NgLogD("Call People API:" + JSON.stringify(args.fields));
//			NgLogD("Call People API:" + JSON.stringify(uncachedUserIds));
			Social.Common.People.getUsers(
				uncachedUserIds,
				args.fields,
				this._updateUsersCacheData.bind( this, args, cache, cachedUserData )
			);
		}else{
			this._updateUsersCacheData( args, cache, cachedUserData, undefined, [] );
		}
    },
    _updateUsersCacheData: function( args, cache, cachedUserData, error, uncachedUserData ){
//		NgLogD("_updateUsersCacheData:" + error);
//		NgLogD("_updateUsersCacheData:" + JSON.stringify(uncachedUserData));
		var length;
		if( !error ){
			var now = new Date();
			length = uncachedUserData.length;
			for( var i=0; i<length; i++ ){
				uncachedUserData[i].epoch = now.getTime();
			}
			cache = uncachedUserData.concat(cache);
		}
		if( cachedUserData && cachedUserData.length > 0 ){
			cache = cachedUserData.concat(cache);
		}
		length = cache.length;
		if( length > this.options.cachesize ){
			cache = cache.slice(0, this.options.cachesize );
		}
		if( $_queue[this.options.key].length > 0 ){
			NgLogD("_updateUsersCacheData: data will be passwd to next");
			var next = $_queue[this.options.key].shift();
			next(cache);
			args.callback( error, cachedata );
		}else{
			var jsondata = JSON.stringify(cache);
			FileSystem.writeFile(
				this.options.key+"-people.json",
				jsondata,
				false,
				this._finishUpdateUsersCacheData.bind(this, args, cache, error )
			);
		}
    },
    _finishUpdateUsersCacheData: function(args, cache, apierror, error, key ){
//		NgLogD("_finishUpdateUsersCacheData:" + error);
		if( $_queue[this.options.key].length > 0 ){
			var next = $_queue[this.options.key].shift();
			next();
		}else{
			$_lock[this.options.key] = 0;
		}
		if( args.callback ){
			args.callback( apierror, cache );
		}
    }
});