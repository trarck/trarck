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
 * AvatarSpriteManager
 *   Manage AvatarSprite
 */

var Core            = require('../../../NGCore/Client/Core').Core;
var Social          = require('../../../NGCore/Client/Social').Social;
var URLSprite       = require('./URLSprite').URLSprite;
var PeopleWithCache = require('../Social/PeopleWithCache').PeopleWithCache;

exports.AvatarSpriteManager = Core.Class.subclass({
    classname: "AvatarSpriteManager",
    "_default_options" : {
	"cache"          : true,
	"key"            : "UserInfo",
	"localcachetime" : 3600,
	"cachesize"      : 100
    },
    initialize: function(options){
	this.sprites = [];
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
    addSprite: function( user_id, sprite, size, anchor, uvs ){
	NgLogD( "AvatarSpriteManager addObject: " + user_id);
	if( !user_id || !sprite ){
	    return;
	}
	this.sprites.push({
	    user_id: user_id,
	    sprite: sprite,
	    size: size,
	    anchor: anchor,
	    uvs: uvs
	});
    },
    setAvatarImages: function(){
	NgLogD( "AvatarSpriteManager setAvatarImages");
	var length = this.sprites.length;
	var user_ids = [];
	for( var i=0; i<length; i++ ){
	    var bt = this.sprites[i];
	    user_ids.push( bt.user_id );
	}
	var fields = [
	    "id",
	    "thumbnailUrl"
	];
	var people = new PeopleWithCache(this.options);
	people.getUsers(
//	Social.Common.People.getUsers(
	    user_ids, 
	    fields,
	    this._finishGetUsersInfo.bind(this)
	);
    },
	$unlock: function(key){
		PeopleWithCache.unlock(key);
		URLSprite.unlock(key);
	},
    _finishGetUsersInfo: function( error, users ){
//	NgLogD( "AvatarSpriteManager _finishGetUsersInfo");
//	NgLogD( "Get Users Info Error Code:"+error);
//	NgLogD( "UsersInfo: " + JSON.stringify(users));
	var users_hash = {};
	if( users ) {
	    var rlength = users.length;
	    for( var i=0;i<rlength; i++ ){
		if( users[i] ){
		    users_hash[users[i].id] = users[i];
		}
	    }
	    var slength = this.sprites.length;
	    for( var j=0; j<slength; j++ ){
		var bt = this.sprites[j];
		if( users_hash[bt.user_id] &&
		    users_hash[bt.user_id].thumbnailUrl ) {
		    var image_url = users_hash[bt.user_id].thumbnailUrl;
		    NgLogD( "AvatarSpriteManager _finishGetUsersInfo setImage: " + image_url );
		    bt.sprite.setImage( image_url, bt.size, bt.anchor, bt.uvs );
		}
	    }
	}
    }					     
});
