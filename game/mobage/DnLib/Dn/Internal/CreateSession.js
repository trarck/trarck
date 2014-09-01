var Core   = require('../../../NGCore/Client/Core').Core;
var Social = require('../../../NGCore/Client/Social').Social;

/**
 * ゲームサーバとのセッションを確立する 
 */
exports.CreateSession = Core.Class.subclass({
/** @lends Dn.CreateSession.prototype */

	classname: "CreateSession",

	/**
	 * @augments Core.Class
	 */
	initialize : function() {
		this._verifier = "";
		this._create_time = new Date().getTime();	
	},
	
	/**
	 * 
	 * @param options
	 */
	create : function(options) {
		this._options = options;

		var self = this;
		self._startAuthorize();
		
	},


	/**
	 * アクセストークンの期限切れを判定する。 
	 */
	isExpiered : function() {
		var currentTime = new Date().getTime();
		var diffTime = currentTime - this._create_time;
		var diffSec = diffTime / 1000;
		if (diffSec > 3000 ) { // 50分（3000秒）
			return true;
		}
		return false;
	},

	/**
	 * 
	 */
	_startAuthorize : function() {
		NgLogD("*** authorize start");
		
		var self = this; 
		// request temporary_credential
		self._options.request.get(self._options.start_authorize_API, {
			success : function (request){
				try {
					self._authorizeToken(JSON.parse(request.responseText));
				} catch (e) {	// SyntaxError: Unexpected token ILLEGAL
					NgLogException(e);
					self._failure(request);
				}
			},
			failure : Dn.utils.bind(self, self._failure),
			error   : Dn.utils.bind(self, self._error)
			
		});
		
	},

	/**
	 * アクセストークンを再取得する。 
	 */
	_reAuthorize : function(onReAuthorize) {
		NgLogD("*** re authorize start");
		this._create_time = -1;

		this._onReAuthorize = onReAuthorize;
		this._startAuthorize();
	},
	/**
	 * 
	 */
	_authorizeToken : function(resJSON) {
		var self = this;
		var authorizeCallBack =  Dn.utils.bind(self, function (error, verifier){
			NgLogI("[MobageAPI] oauth_token        =" + resJSON.oauth_token);
			NgLogI("[MobageAPI] verifier           =" + verifier);

			if (error) {
				NgLogE("[MobageAPI] Social.Common.Auth.authorizeToken error :" + JSON.stringify(error));
				if (self._options.authorizeError) {
					self._options.authorizeError(error);
				}
				return;
			}
			self._verifier = verifier;

			var params = {
				device_id          : Core.Capabilities.getUniqueId(),
				sdk_version        : Core.Capabilities.getSDKVersion(),
				oauth_token        : resJSON.oauth_token,
				verifier           : verifier
			}; 

			// 拡張パラムをセット
			if (self._options.create_session_extParam) {
				for ( var key in self._options.create_session_extParam) {
					params[key] =  self._options.create_session_extParam[key];
				}
			}
			NgLogI("[MobageAPI] send params       =" + JSON.stringify(params));
			
			// request token credential
			self._options.request.post(self._options.create_session_API, {
				
				data : params,
				
				success : function(request) {
					if (self._create_time == -1) {
						// アクセストークン再取得時
						if (self._onReAuthorize) {
							self._onReAuthorize();	
						}
					}else if (self._options.onCreate) {
						// 起動時の認証時
						self._options.onCreate(request);
					}
					self._create_time = new Date().getTime();
				},
				failure : Dn.utils.bind(self, self._failure),
				error   : Dn.utils.bind(self, self._error)
				
			});
		});
		Social.Common.Auth.authorizeToken(resJSON.oauth_token, authorizeCallBack);

	},
	
	_failure : function(request) {
		NgLogE("[MobageAPI] failure : "+ request.responseText);
		if (this._options.apiFailure) {
			this._options.apiFailure(request);
		}
	},
	_error : function(request) {
		NgLogE("[MobageAPI] error : "+ request.responseText);
		if (this._options.apiError) {
			this._options.apiError(request);
		}
	}

});

