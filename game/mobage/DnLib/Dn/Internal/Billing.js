var Core   = require('../../../NGCore/Client/Core').Core;
var Social = require('../../../NGCore/Client/Social').Social;
var Bank   = require('../../../NGCore/Client/Bank').Bank;

/**
 * 課金処理を行う共通ライブラリを提供する
 * @see http://trac.mininat.com/trac/minination/wiki/NgmocoResearch/Machete/Billing
 */
exports.Billing = Core.Class.subclass({
/** @lends Dn.Internal.Billing.prototype */

	classname: "Billing",

	/** トランザクションのコミットが開始されたかどうか */
	_startCommitTransaction : false,

	/**
	 * @augments Core.Class
	 */
	initialize : function(options) {
		this._options = options;
		this._request = options.request;
		this._session = options.session;
		this._itemData = null;
	},

	/**
	 * purchase item
	 * @param {Object} itemData
	 * @param {Function} onPurchased
	 * @param {Function} onError
	 * @param {Function} onCancel
	 */
	purchase : function (itemData, onPurchased, onError, onCancel){
		this._startCommitTransaction = false;
		itemData.state = "new";
		
		this._itemData = itemData;
		this._onPurchased = onPurchased;
		this._onError = onError;
		this._onCancel = onCancel;
		
		var self = this;
		if (self._session.isExpiered()) { 
			self._session._reAuthorize(function(){
				self._createTransaction(self._itemData);
			});
		}else{
			self._createTransaction(self._itemData);
		}
	},
	
	/**
	 * show AlertDialog
	 * @param {String} msg
	 */
	showDialog : function(msg){
		var alert = new UI.AlertDialog();
		alert.setText(msg);
		alert.setChoices([ "OK" ]);
		alert.show();
	},
	
	/**
	 * refresh balance button
	 * @param {Array}
	 */
	refreshBalanceButton : function(array){
		Social.Common.Service.showBalanceButton(new UI.ViewGeometry.Rect(array), function(error) {
			if (error) {
				NgLogE("[Bank] showBalanceButton error = " + JSON.stringify(error));
			}
		});
	},
	
	/**
	 * 特商法を表示する
	 */
	showSpecialCommercialLaw : function(){
		Social.JP.Service.openCommunityFunction("/thisgame/tokushoho");
	},
	
	// ----------------------------------------------------------------------
	// private function
	// ----------------------------------------------------------------------
	/**
	 * 
	 */
	_createTransaction : function (_itemData){
		
		var itemData_text = JSON.stringify(_itemData);
		NgLogI("[Bank] _createTransaction start " + itemData_text);
		
		var self = this; 
		self._request.post(self._options.create_transaction_API, {
			data : {
				itemData : itemData_text
			},
			success : function (req){
				NgLogD("[Bank] _createTransaction responseText:" + req.responseText);

				var json = null;
				try {
					json = JSON.parse(req.responseText);
				} catch (e) {	// SyntaxError: Unexpected token ILLEGAL
					NgLogException(e);
					self._failure(req);
					return;
				}
				if (!json.success) {
					NgLogE("[Bank] _createTransaction response error : " + json.error);
					self._failure(req);
					return;
				}
				if (!json.transactionId) {
					NgLogE("[Bank] _createTransaction transactionId undefine ");
					self._failure();
					return;
				}

				Bank.Debit.continueTransaction(json.transactionId, function( error, transaction) {
					if (error) {
						NgLogE("[Bank] Bank.Debit.continueTransaction : error " + JSON.stringify(error));
						self._failure();
						return;
					}
					if (!transaction) {
						// ユーザが購入確認で「いいえ」を選択した場合
						NgLogD("[Bank] Bank.Debit.continueTransaction : user cancel");
						if (self._onCancel) {
							try {
								self._onCancel(self._itemData);
							} catch (e) {
								NgLogException(e);
							}
						}
						Bank.Debit.cancelTransaction(json.transactionId);
						return;
					}
					self._commitTransaction(json.transactionId);
				});
			},
			failure : function(req) {
				NgLogE("[Bank] _createTransaction responseText :" + req.responseText);
				self._failure(req);
			}
		});
	},
	
	/**
	 * 
	 * @param {String} transactionId
	 */
	_commitTransaction : function(transactionId){
		NgLogI("[Bank] _commitTransaction");
		this._startCommitTransaction = true;
		
		var itemData_text = JSON.stringify(this._itemData);
		var self = this; 
		self._request.post(self._options.commit_transaction_API, {
			data : {
				transactionId : transactionId,
				verifier      : self._session._verifier,
				itemData      : itemData_text
			},
			success : function (req){
				NgLogD("[Bank] _commitTransaction responseText:" + req.responseText);
				var json = null;
				try {
					json = JSON.parse(req.responseText);
				} catch (e) {	// SyntaxError: Unexpected token ILLEGAL
					NgLogException(e);
					self._failure(req, transactionId);
					return;
				}
				if (!json.success) {
					NgLogE("[Bank] _commitTransaction response json.error=" + json.error);
					self._session._create_time = -1;
					self._session._reAuthorize();
					self._failure(req, transactionId);
					return;
				}
				if (self._onPurchased) {
					self._onPurchased(self._itemData, req);
				}
				Bank.Debit.getTransaction(transactionId, function(error, transaction){
					NgLogI("[Bank] _commitTransaction state:" + transaction.state);
				});
				
			},
			failure : function(req) {
				NgLogE("[Bank] _commitTransaction responseText :" + req.responseText);
				self._failure(req, transactionId);
			}
		});
	},

	_failure : function(req, transactionId) {
		if (transactionId) {
			Bank.Debit.cancelTransaction(transactionId);
		}
		if (this._onError) {
			this._onError(this._itemData, req, this._startCommitTransaction);
		}
	}

});

