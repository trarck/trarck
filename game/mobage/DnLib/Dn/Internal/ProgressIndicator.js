var Core = require('../../../NGCore/Client/Core').Core;
var NGUI = require('../../../NGCore/Client/UI').UI;

/**
 * ProgressIndicator を表示します。
 * 
 * 1.	下記処理は、btn1 の実行後、Indicator を表示し、主処理の終了後
 *		Indicator を消去しています。
 * 
 * 		var btn1 = NGWindow.document.createElement('button');
 * 		btn1.onclick = function(){
 * 			var prog = new dn.ProgressIndicator();
 * 			prog.show();	// Indicator 表示 
 * 				:
 * 			// 時間の掛かる処理 
 * 				:
 * 			prog.hide();	// Indicator 消去 
 * 		};
 * 
 * 
 * 2.	デフォルトの Indicator 用画像を表示する場合は、Content/loading/ へ
 * 		loading_anim_01.png から loading_anim_08.png を配置してください。
 * 
 * 
 * 3.	任意の画像を表示する場合は、次の通り画像を指定してください。
 * 		var prog = new dn.ProgressIndicator();
 * 		prog.setAnimateImages(
 * 			["./Content/btn_store.png", "./Content/btn_back.png", "./Content/btn_water_petting.png"]
 * 		);
 *		prog.show();
 * 
 * 
 * 4.  Indicator へ表示する画像は、デフォルトで 0.1 秒間隔で切り替わります。
 *     この間隔を切り替える場合は、setPeriod(ミリ秒) で指定してください。
 *   	var prog = new dn.ProgressIndicator();
 *		prog.setPeriod(1000);
 *
 * 備考：
 *	・NGCoreの ProgressDialog.js は現在 iPhone で動作しない。
 *	  ngCoreでは２月以降にリリースする予定との事。 2011/01/14
 *	・現在の実装は、Indicator は画面の中央に表示されます。2011/01/14
 * 
 */
exports.ProgressIndicator = Core.Class.subclass(
/** @lends ProgressIndicator.prototype */
{
	classname: 'ProgressIndicator',
	initialize: function() {
		/* Indicator の画像を切り替える感覚 */
		this._period = 100
		this._animateImages = [
		"./Content/loading/loading_anim_01.png", "./Content/loading/loading_anim_02.png", 
		"./Content/loading/loading_anim_03.png", "./Content/loading/loading_anim_04.png", 
		"./Content/loading/loading_anim_05.png", "./Content/loading/loading_anim_06.png",
		"./Content/loading/loading_anim_07.png", "./Content/loading/loading_anim_08.png" ];
	},
	
	show: function() {
		// imageの場合、画像を差し替える事ができないためbuttonを利用する
		this._imageBtn = new NGUI.Button();
		var width = Core.Capabilities.getScreenWidth();
		var height = Core.Capabilities.getScreenHeight();	
		if (true) {
			// 横向きの場合
			height = NGWindow.outerWidth;
			width = NGWindow.outerHeight;
		};
		
		var imgWidth = 84;
		var imgHeight = 84;
		var centerWidth = (width - imgWidth) / 2;
		var centerHeight = (height - imgHeight) / 2;
		this._imageBtn.setFrame( [centerWidth, centerHeight, imgWidth, imgHeight]);
 		NGWindow.document.addChild(this._imageBtn);

		var i = 0;
		var ary = this._animateImages;
		var btn = this._imageBtn;
		this._timerID = setInterval(function(){
			if(i >= ary.length){
				i = 0;
			}
			btn.setNormalImage(ary[i]);
			++i;
		}, this._period);
	},
	
	/**
	 * ProgressIndicator を消します。
	 */
	hide: function() {
		NGWindow.document.removeChild(this._imageBtn);
		this._imageBtn.destroy();
		clearInterval(this._timerID);		 
	},	

	/**
	 * Indicator へ表示する画像を設定します。
	 * @param animateImages 画像ファイルの配列 
	 */
    setAnimateImages: function(animateImages) {
		this._animateImages = animateImages;
    },
	
	/**
	 * Indicator へ表示する画像を何秒間隔で切り替えるか指定します。
	 * @param period イメージを切り替える時間（ミリ秒） 	
	 */
	setPeriod: function(period) {
		this._period = period;
	}
});

