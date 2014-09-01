var GLUIViewScene = require('../Scene/GLUIViewScene').GLUIViewScene;
var UIViewScene = require('../Scene/UIViewScene').UIViewScene;

/**
 * フレンド機能共通ライブラリ 
 * @see http://trac.mininat.com/trac/minination/wiki/DnLib/Dn/FriendScene
 */
exports.FriendScene = GLUIViewScene.subclass({
/** @lends Dn.FriendScene.prototype */

	classname: "FriendScene",

	/**
	 * Enumeration for friends events.
	 * @namespace
	 */
	ACTIONS : {
		LIST 		: "LIST",		// 友達一覧
		SEARCH 		: "SEARCH",		// 友達検索
		SEARCH_MOBAGE: "SEARCH_MOBAGE",// Mobage 友達検索
		RECEIVED 	: "RECEIVED",	// 友達被申請中
		REQUEST 	: "REQUEST",	// 友達申請中
		NEXT 		: "NEXT"		// 次のページを検索する
	},

	/**
	 * @param {Dn.GLUI.ListView}	aJSONDef GL2ベースの画面定義JSON
	 * @param {GL2.Node}			parentNode ゲーム内のルートノード
	 * @param {Dn.SecureRequest}	request ログイン済みの Dn.SecureRequest インスタンス
	 * @param {Object}				apiNames 友達一覧、友達検索、友達申請-承認待ち一覧、友達申請-申請中一覧のAPI名
	 * @param {String}				searchLvl 検索処理でレベル検索を行う場合、自分のレベルを指定する
	 * @constructs The constructor
	 * @augments Dn.GLUIViewScene
	 */
	initialize : function(aJSONDef, parentNode, request, apiNames, searchLvl, initialTab) {
		this.JSONDef = aJSONDef;
		this.name = "FriendScene";
		this.request = request;
		this.apiNames = apiNames;
		if (!apiNames) {
			throw new Error("apiNames is not defined");
		}
		this.searchLvl = searchLvl;
		this.initialTab = initialTab;

		this._searchingFlg = false; 		// タブを連続してタップできないようにするフラグ
		this._searchDialogDidAppear = false; // 検索ダイアログの２重表示の制御
	},

	// ----------------------------------------------------------------------
	// imple GLUIViewScene
	// ----------------------------------------------------------------------
	viewDidLoad : function () {
		switch (this.initialTab) {
		case this.ACTIONS.LIST    : this.action_list();        break;
		case this.ACTIONS.SEARCH  : this.action_search_init(); break;
		case this.ACTIONS.RECEIVED: this.action_receive();     break;
		case this.ACTIONS.REQUEST : this.action_request();     break;
		default:
			this.action_list(); break;
		}
	},
	
	onDestroy : function () {
		NgLogD("*** FriendScene#onDestroy() end");
	},
	

	// ----------------------------------------------------------------------
	// GL2UIBuilder action
	// ----------------------------------------------------------------------
	/**
	 * 友達一覧を検索して ListView を生成する
	 */
	action_list : function() {
		this.callAPI(this.ACTIONS.LIST, this.getAPIParams(this.ACTIONS.LIST));
	},
	/**
	 * 友達申請-申請中一覧を検索して ListView を生成する
	 */
	action_request : function() {
		this.callAPI(this.ACTIONS.REQUEST, this.getAPIParams(this.ACTIONS.REQUEST));
	},
	/**
	 * 友達申請-被申請中一覧を検索して ListView を生成する
	 */
	action_receive : function() {
		this.callAPI(this.ACTIONS.RECEIVED, this.getAPIParams(this.ACTIONS.RECEIVED));
	},

	/**
	 * 検索ダイアログを表示する
	 */
	action_search_init : function() {
		if (this._searchDialogDidAppear) {
			return;
		}
		this._searchDialogDidAppear = true;

		this.elem_listView.clearItems();	
		var friendDialog = new FriendDialog(this.JSONDef, this.parentNode);
		friendDialog.setFriendScene(this);
		
		if (Dn.Scene.SceneDirector.sceneStack && Dn.Scene.SceneDirector.sceneStack.length > 0) {
			NgLogD("*** Dn.Scene.SceneDirector.pushScene()");
			Dn.Scene.SceneDirector.pushScene(friendDialog);
		}else{
			// ゲーム内で 旧 DnSceneDirector を利用している場合の暫定対応 
			// ※TODO ゲームが Dn.Scene.SceneDirector置き換わったらこ分岐は消す
			NgLogD("*** Dn.Scene.SceneDirector.replaceScene()");
			Dn.Scene.SceneDirector.replaceScene(friendDialog);
		}
	},
	/**
	 * 改ページ
	 */
	action_more : function() {
		this.callAPI(this.ACTIONS.NEXT);
	},
	
	// ----------------------------------------------------------------------
	// 		FriendScene abstract function 
	// ----------------------------------------------------------------------
	/**
	 * サーバAPIをコール際のdata部を指定する
	 * @param {String} actionType リストの格納方法
	 */
	getAPIParams : function(actionType) {
		return {};
	},

	/**
	 * API呼び出し前後でCallBackを指定する
	 * @param {String} actionType リストの格納方法
	 * @returns {Function} API呼び出し前後でCallされるFunction
	 */
	getAPICallBack : function(actionType) {
		return { 
			before : function(){
				;
			}, 
			after : function(){
				;
			}, 
			error : function(req) {
				;
			}
		};
	},

	/**
	 * FriendScene を継承するサブクラスは、引数の json データから
	 * リストアイテムを生成し、listView へ格納してください。
	 *
	 * リストの格納方法は actionType を参照して分岐してください。
	 *
	 * @param {GLUI.ListView} GLベースのリストビュー
	 * @param {JSON} APIの結果データを格納するJSONオブジェクト
	 * @param {String} actionType リストの格納方法
	 * 		LIST 		: 1	// 友達一覧
	 * 		SEARCH 		: 2	// 友達検索
	 * 		RECEIVED 	: 3	// 友達申請-被申請中一覧
	 * 		REQUEST 	: 4	// 友達申請-申請中一覧	
	 */
	createListView : function(listView, json, actionType) {
		throw new Error("not implements !!");
	},
	
	/**
	 * サーバAPIをコールする
	 * @param {String} actionType リストの格納方法
	 * @param {params} サーバAPIをコール際のdata部
	 */
	callAPI : function(actionType, params){
		if (this._searchingFlg == true) {	// 連続タップを禁止する
			return;
		}
		
		this._searchingFlg = true;
		var apiName = this.apiNames[actionType];
		var params = params || {};

		// 改ページの場合
		if (this.ACTIONS.NEXT == actionType) {
			apiName = this._apiName; 
			params = this._params; 
			if (this._params.page) {
				params.page = parseInt(this._params.page) + 1;
			}
		}else{
			// 改ページ以外はリストをクリア
			this.elem_listView.clearItems();	
			this.thisActionType = actionType;
			this._apiName = apiName; 
			this._params = params; 
		}
		var callBack = this.getAPICallBack(actionType);
		callBack.before();
		NgLogD("[freiend] api="+ apiName +", params= " + JSON.stringify(params) );
		this.request.get(apiName, {
			data: params,
			success: Dn.utils.bind(this, function (req) {
				NgLogD("[freiend] json=\n" + req.responseText);
				var json = JSON.parse(req.responseText);
				// 現在のページを設定
				if (json.page) {
					this._params.page = json.page;
				}
				
				// 改ページの場合
				if (this.ACTIONS.NEXT == actionType) {
					NgLogD("[freiend] getListSize="+ this.elem_listView.getListSize() );
					this.elem_listView.removeItem(this.elem_listView.getListSize() -1);
					// リストitem を作成
					this.createListView(this.elem_listView, json, this.thisActionType);
				} else{
					// リストitem を作成
					this.createListView(this.elem_listView, json, actionType);
				}
					
				// 次のページがある場合 more ボタンを格納
				if (json.has_next) {
					var nodes = [];
					var element = Dn.GLUIBuilder.buildUI(this, this.JSONDef["MoreButton"], nodes);
					nodes.splice(0, 1);
					this.elem_listView.addItem(element, nodes);
				}

				callBack.after( json );
				
				this._searchingFlg = false;
			}),
			failure: Dn.utils.bind(this, function (req){
				NgLogE("[freiend] apiName="+ apiName + " failure");
				NgLogE("[freiend] params= " + JSON.stringify(params));
				NgLogE("[freiend] detail=\n" + req.responseText);
				callBack.after();
				callBack.error(req);
			}),
			error: Dn.utils.bind(this, function (req){
				NgLogE("[freiend] apiName="+ apiName + " error");
				NgLogE("[freiend] params= " + JSON.stringify(params));
				NgLogE("[freiend] detail=\n" + req.responseText);
				callBack.after();
				callBack.error(req);
			})
		});
	},
	
	// ----------------------------------------------------------------------
	// 		FriendDialog と連携するための拡張ポイントを記述 
	// ----------------------------------------------------------------------
	/**
	 * 検索ダイアログ上のタブが切り替わった時に呼び出される
	 * @param searchDialog
	 * @param changeTab 1 ゲーム友達タブ、2 Mobage タブ
	 */
	changeSearchTab : function (searchDialog , changeTab) {
		;
	},
	/**
	 * 検索ダイアログの viewDidLoad の後に呼び出される
	 * @param searchDialog
	 */
	dialogDidLoad : function (searchDialog) {
		;
	}
});


var FriendDialog = exports.FriendDialog = UIViewScene.subclass({
/** @lends Dn.FriendDialog.prototype */

	classname: "FriendDialog",
	
	/** 1: ゲーム友達を検索、 2:mobage友達を検索*/
	_searchFriendTarget : "1",

	/**
	 * @constructs The constructor.
	 * @augments Dn.NGUIViewScene
	 */
	initialize : function(aJSONDef) {
		this.JSONDef = aJSONDef;
		this.name = "FriendDialog";
	},
	
	viewDidLoad : function () {
		if (this.friendScene.lvl_check == true) {
			this.elem_lvl_checkbox.setChecked(true);
			this.elem_lvl_field.setText(this.friendScene.searchLvl);
		}
		this.elem_lvl_checkbox.setOnClick(Dn.utils.bind(this, function() {
			if (this.elem_lvl_checkbox.getChecked() == true) {
				this.elem_lvl_field.setText(this.friendScene.searchLvl);
				this.friendScene.lvl_check = true;
			}else{
				this.elem_lvl_field.setText("");
				this.friendScene.lvl_check = false;
			}
		}));
		if (this.friendScene.nickname) {
			this.elem_nickname_field.setText(this.friendScene.nickname);
		}
		this.friendScene.dialogDidLoad(this);
	},
	action_search : function () {
		var param = this.friendScene.getAPIParams(this.friendScene.ACTIONS.SEARCH);
		delete param.frtype;
		param.nickname = this.elem_nickname_field.getText();
		if ( this.elem_lvl_checkbox.getChecked() == true) {
			param.tgt_lv = this.friendScene.searchLvl;
		}
		this.friendScene.nickname = param.nickname;
		if (this._searchFriendTarget == "1") {	
			// ninja 友達検索
			this.friendScene.callAPI(this.friendScene.ACTIONS.SEARCH, param);
		} else {
			// Mobage 友達検索
			this.friendScene.callAPI(this.friendScene.ACTIONS.SEARCH_MOBAGE, param);
		}
		this._closeScene();
	},
	action_level_down : function () {
		if (this.elem_lvl_checkbox.getChecked() == true) {
			if (this.friendScene.searchLvl && parseInt(this.friendScene.searchLvl) > 0) {
				--this.friendScene.searchLvl;
			}
			if (!this.friendScene.searchLvl || this.friendScene.searchLvl == "") {
				this.friendScene.searchLvl = "1";
			}
			this.elem_lvl_field.setText(this.friendScene.searchLvl);
		}
	},
	action_level_up : function () {
		if (this.elem_lvl_checkbox.getChecked() == true) {
			++this.friendScene.searchLvl;
			if (parseInt(this.friendScene.searchLvl) > 999) {
				this.friendScene.searchLvl = "999";
			}
			this.elem_lvl_field.setText(this.friendScene.searchLvl);
		}
	},
	setFriendScene : function (aFriendScene) {
		this.friendScene = aFriendScene;
	},
	
	onDestroy : function () {
		NgLogD("FriendDialog#onDestroy() end");
		this.friendScene._searchDialogDidAppear = false;
	},
	action_close: function() {
		this._closeScene();
	},
	_closeScene: function() {
		// 旧DnSceneDirectorを利用している場合の対応
		if (Dn.Scene.SceneDirector.sceneStack.length < 2) {
			Dn.Scene.SceneDirector.closeScene();
			NgLogD("*** Dn.Scene.SceneDirector.closeScene()");
		}else{
			Dn.Scene.SceneDirector.popScene();
		}
	},
	
	// ----------------------------------------------------------------------
	// Mobage 友達 検索ダイアログの対応
	action_select_game_tab : function () {
		this._searchFriendTarget = "1";
		this.friendScene.changeSearchTab(this, this._searchFriendTarget);
	},
	action_select_mobage_tab : function () {
		this._searchFriendTarget = "2";
		this.friendScene.changeSearchTab(this, this._searchFriendTarget);
	}

});

