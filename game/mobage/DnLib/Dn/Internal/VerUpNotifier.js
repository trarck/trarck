var Core = require('../../../NGCore/Client/Core').Core;
var UI = require('../../../NGCore/Client/UI').UI;
var Device = require('../../../NGCore/Client/Device').Device;
var Storage = require('../../../NGCore/Client/Storage').Storage;

var LifecycleEventSorter = require('../Core/LifecycleEventSorter').LifecycleEventSorter;

/**
 *バージョンアップ通知として次の機能を提供する
 * @see http://trac.mininat.com/trac/minination/wiki/DnLib/DnVerUpNotifier
 */
var VerUpNotifier = exports.VerUpNotifier = Core.Class.singleton(
/** @lends Dn.Internal.VerUpNotifier.prototype */
{
	classname: 'VerUpNotifier',

	/**
	 * @constructs The default constructor.
	 * @augments Core.Class
	 */
	initialize: function() {
	},

	/**
	 * バージョン情報が記述された version.js ファイルを初期化します。
	 * @param version require で version.js を読み込んで引渡しでください
	 */
	configure : function(version) {
		VerUpNotifier._versionJSON = version;
		if (!VerUpNotifier._checkVersionJSON()) {
			throw new Error("can not read version.js");
		}
	},

	/**
	 * ゲーム起動時に、ゲームのバージョンアップを検知しユーザへメッセージを通知します。
	 * <br>
	 * 本関数は、バージョンアップがある場合のみ verUpTaskCB が呼び出されます。
	 * 通知の内容を AlertDialog ではなく、WebViow にしたい場合などは、verUpTaskCB をカスマイズしてください。
	 * <br>
	 * バージョンの保存は Storage.KeyValueCache を利用します。
	 * @examples
	 * <pre>
	 *	var verUpTaskCB = function(prevVer) {
	 *		if (prevVer && prevVer.localeCompare("1.2.0") > 0) {
	 *			return; // 何度も同じ内容を通知しないために prevVer を参照し制御している
	 *		}
	 *		NgLogD("call back !! prevVer = "+prevVer);
	 *		var alert = new UI.AlertDialog();
	 *		alert.setTitle("バージョンアップしました。");
	 *		alert.setText("変更履歴を確認しますか？");
	 *		alert.setChoices(["Yes","No"]);
	 *		alert.onchoice = function(event) {
	 *			if (event.choice == 0) {
	 *				NgLogD("Yes clicked");
	 *				// show WebViow など
	 *			} else {
	 *				NgLogD("No clicked");
	 *			}
	 *		};
	 *		alert.show();
	 *	};
	 *	Dn.VerUpNotifier.confirm(verUpTaskCB);
	 * </pre>
	 * @param {Function} verUpTaskCB バージョンアップを検知した場合に呼び出す CallBack
	 */
	confirm : function(verUpTaskCB) {
		var getCB = function(error, prevVer, key) {
			NgLogD("prevVer = " + prevVer);
			NgLogD("GAME_VERSION = " + VerUpNotifier._versionJSON.GAME_VERSION);
			if (!prevVer) {
				NgLogD("first install");
				VerUpNotifier._saveVeiosn(VerUpNotifier._versionJSON.GAME_VERSION);
				return;
			}
			// 同じバージョンの場合
			if (VerUpNotifier._versionJSON.GAME_VERSION == prevVer) {
				NgLogD("same version " + prevVer + "=" + VerUpNotifier._versionJSON.GAME_VERSION);
				return;
			}
			// バージョンアップ時
			if (prevVer && prevVer.localeCompare(VerUpNotifier._versionJSON.GAME_VERSION) < 0) {
				if (verUpTaskCB) {
					verUpTaskCB(prevVer);
				}
				VerUpNotifier._saveVeiosn(VerUpNotifier._versionJSON.GAME_VERSION);
			}
		};
		Storage.KeyValueCache.local.getItem(VerUpNotifier._versionJSON.GAME_NAME, getCB);
	},

	
	/**
	 * ゲーム再開時、ゲームバージョン、GameServerAPI互換バージョンを比較し、バージョンアップされている場合は
	 * コールバックを通知する。<br>
	 * ※共にアップデートを検知された場合は、GameServerAPI互換バージョンのみ通知する
	 *
	 * @examples
	 * <pre>
	 *	var verUpSrvAPICB = function(){
	 *		var alert = new UI.AlertDialog();
	 *		alert.setTitle("サーバがバージョンアップしました。");
	 *		alert.setText("継続してゲームができない場合があるため、バージョンアップを行います");
	 *		alert.setChoices(["OK"]);
	 *		alert.onchoice = function(event) {
	 *			// application.js 再読み込み
	 *			Core.LocalGameList.restartGame();
	 *		};
	 *		alert.show();
	 *	};
	 *	var verUpGameCB = function(){
	 *		var alert = new UI.AlertDialog();
	 *		alert.setTitle("最新バージョンが公開されています。");
	 *		alert.setText("今すぐアップデートしますか？");
	 *		alert.setChoices(["Yes","No"]);
	 *		alert.onchoice = function(event) {
	 *			if (event.choice == 0) {
	 *				NgLogD("Yes clicked");
	 *				// application.js 再読み込み
	 *				Core.LocalGameList.restartGame();
	 *			} else {
	 *				NgLogD("No clicked");
	 *			}
	 *		};
	 *		alert.show();
	 *	};
	 *	Dn.VerUpNotifier.startCheckSrvVersion(
	 *			"http://mgdev101.dena.jp/", "_ninja_getServerAPIVersion", verUpSrvAPICB, verUpGameCB);
	 * </pre>
	 * @param {String} request
	 * @param {String} srvAPIName GameServerのバージョンを確認するAPI名
	 * @param {Function} verUpSrvAPICB GameServer互換バージョンのアップを検知した場合に呼び出すCallBack
	 * @param {Function} verUpGameCB ゲームバージョンのアップを検知した場合に呼び出すCallBack
	 */
	startCheckSrvVersion : function(request, srvAPIName, verUpSrvAPICB, verUpGameCB) {
		// 既に実行している場合
		if (this._lifecycleListener) {
	        NgLogD("LifecycleListener already init");
			return;
		}
		if (!verUpSrvAPICB && !verUpGameCB) {
	        NgLogD("verUpSrvAPICB and verUpGameCB undefine");
			return;
		}
		LifecycleEventSorter.addListener({
			onResume : function(chain){
				VerUpNotifier._confirmOnResume(request, srvAPIName, verUpSrvAPICB, verUpGameCB, chain);
			}
		});
	},

	/**
	 * クライアントの GAMESERVER_API_VERSION の値を返す。
	 * @return {String} クライアントの GAMESERVER_API_VERSION の値
	 */
	getSrvAPIVeiosn : function(){
		if (VerUpNotifier._versionJSON) {
			return VerUpNotifier._versionJSON.GAMESERVER_API_VERSION;
		}else{
			return "";
		}
	},

	/**
	 *
	 * @param currentVar
	 */
	_saveVeiosn : function(currentVar){
		// バージョン情報を保存
		Storage.KeyValueCache.local.setItem(VerUpNotifier._versionJSON.GAME_NAME, currentVar,
				function(error, key) {
					if (error) {
						NgLogD("save currentVar Failed. error= " + error);
					} else {
						NgLogD("save currentVar = " + currentVar);
					}
				});

	},

	/**
	 *
	 * @param currentVar
	 */
	_checkVersionJSON : function(){
		if (!VerUpNotifier._versionJSON) {
			NgLogE("cannot initialize version.json. ");
			return false;
		}
		if (!VerUpNotifier._versionJSON.GAME_NAME) {
			NgLogE("define GAME_NAME to version.json. ");
			return false;
		}
		if (!VerUpNotifier._versionJSON.GAME_VERSION) {
			NgLogE("define GAME_VERSION to version.json. ");
			return false;
		}
		if (!VerUpNotifier._versionJSON.GAMESERVER_API_VERSION) {
			NgLogE("define GAMESERVER_API_VERSION to version.json. ");
			return false;
		}
		NgLogD("client GAME_NAME = " + VerUpNotifier._versionJSON.GAME_NAME);
		NgLogD("client GAME_VERSION = " + VerUpNotifier._versionJSON.GAME_VERSION);
		NgLogD("client GAMESERVER_API_VERSION = " + VerUpNotifier._versionJSON.GAMESERVER_API_VERSION);
		return true;
	},
	
	/**
	 * @constructs The default constructor.
	 * @augments Core.MessageListener
	 */
	_confirmOnResume : function(request, srvAPIName , verUpSrvAPICB, verUpGameCB, chain) {
		if (!VerUpNotifier._checkVersionJSON()) {
			return;
		}
		var funcSrvAPI = verUpSrvAPICB;
		var funcGame = verUpGameCB;
		request.get(srvAPIName, {
    		data:{},
    		success: function (req) {
				NgLogD("ServerAPI.getRequest response: " + req.responseText);
				var json = JSON.parse(req.responseText);

				// サーバとの互換比較
				if (funcSrvAPI) {
					if(json.GAMESERVER_API_VERSION &&
						VerUpNotifier._versionJSON.GAMESERVER_API_VERSION.localeCompare(json.GAMESERVER_API_VERSION) < 0) {

    					NgLogD("Start Call Back funcSrvAPI !!");
    					funcSrvAPI(chain);
    					return;
					}
				}

    			// ゲームのバージョンアップ確認
				if (funcGame) {
					if(json.GAME_VERSION &&
							VerUpNotifier._versionJSON.GAME_VERSION.localeCompare(json.GAME_VERSION) < 0) {

						NgLogD("Start Call Back funcGame !!");
	    				funcGame(chain);
    					return;
					}
    			}
				
				chain.next();
    		},
    		failure:function(req) {
    			NgLogD("200以外");
				chain.next();
    		},
    		error: function(req,ex) {
    			NgLogD("400,500系");
				chain.next();
    		}
		});
	}

});

