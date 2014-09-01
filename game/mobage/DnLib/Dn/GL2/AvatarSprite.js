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
 * AvatarSprite - extend URLSprite to show avatar image from user id.
 *
 */

var Core            = require('../../../NGCore/Client/Core').Core;
var URLSprite       = require('./URLSprite').URLSprite;
var PeopleWithCache = require('../Social/PeopleWithCache').PeopleWithCache;

exports.AvatarSprite = URLSprite.subclass({
    "classname" : "AvatarSprite",
    initalize: function(options){
		var key = "UserInfo";
		if( options && options["key"] ){
			key = options["key"];
		}
		if( this.options ){
			this.options["key"] = key;
		}else{
			this.options = {"key": key };
		}
    },
	destroy: function($super){
		$super();
	},
    setAvatarImage: function( user_id, size, anchor, uvs ){
//	NgLogD("Avatar Sprite: User ID SetImage: " + user_id);
		var fields = [
			"id",
			"thumbnailUrl"
		];
		var args = {
			size   : size,
			anchor : anchor,
			uvs    : uvs
		};
		var people = new PeopleWithCache(this.options);
		people.getUser(
			user_id, 
			fields,
			this._finishGetUserInfo.bind(this, args )
		);
		return this;
    },
	$unlock: function(key){
		PeopleWithCache.unlock(key);
		URLSprite.unlock(key);
	},
    _finishGetUserInfo: function( args, error, user ){
		//	NgLogD( "Get User Info Error Code:"+error);
		//	NgLogD( "UserInfo: " + JSON.stringify(user));
		if( user && user.thumbnailUrl ){
			var image_url = user.thumbnailUrl;
			this.setImage( image_url, args.size, args.anchor, args.uvs );
		}
    },
	setDefaultImage: function( image, size, anchor, uvs ){
		return this.setImage( image, size, anchor, uvs );
    }
});
