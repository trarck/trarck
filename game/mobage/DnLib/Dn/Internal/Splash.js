var UI = require('../../../NGCore/Client/UI').UI;
var Core = require('../../../NGCore/Client/Core').Core;
var LGL = require('../../../NGCore/Client/Core/LocalGameList').LocalGameList;
var Class = require('../../../NGCore/Client/Core/Class').Class;
var PlusRequest = require('../../../NGCore/Client/Plus/PlusRequest').PlusRequest;
var Session = require('../../../NGCore/Client/Plus/Session').Session;
var RegistrationViewController = require('./_Bootstrap/RegViewController').RegistrationViewController;
var Device = require('../../../NGCore/Client/Device').Device;
var VFX = require('../GL2/VFX').VFX;
var GL2 = require('../../../NGCore/Client/GL2').GL2;
var Sync = require('../Core/Sync').Sync;
var Styles = require('./_Bootstrap/Styles').Styles;
var Network = require('../../../NGCore/Client/Network').Network;
var Scale = require('./_Bootstrap/Scaler').Scale;


exports.Splash = Class.subclass({
//exports.BootStrap = Class.subclass({
//export.BootStrap = UI.View.subclass({
	classname: "Splash",
	initialize: function(opt) {
		NgLogD("bootstrap initialize start ############################");
		opt = opt || {};
		opt.onLoginSuccess = opt.onLoginSuccess || function() {};
		opt.onLoginError = opt.onLoginError || function() {};

		opt.onRegistrationSuccess = opt.onRegistrationSuccess || function() {};
		
		opt.onDownloadDone = opt.onDownloadDone || function() {};
		
		opt.theme = { styles: new Styles(), html: opt.html || {} };
		opt.styles.call(opt.theme.styles);

		NgLogD("opt.theme.styles.labelOffsetV#########################" + opt.theme.styles.labelOffsetV);
		NgLogD("opt.theme.styles.labelOffsetH#########################" + opt.theme.styles.labelOffsetH);
		
		NgLogD("opt.theme.styles.copyRightPosX#########################" + opt.theme.styles.copyRightPosX);
		NgLogD("opt.theme.styles.copyRightPosY#########################" + opt.theme.styles.copyRightPosY);
		
		this.opt = opt;
		
		var quitting = false;
		
		var back = new UI.Button({
			frame: [0,0,0,0],
			//frame: [10, 10, 64, 64],
			//frame2: [10, 10, 64, 64],
			//text: "X",
			disabledText: "Returning...",
			disabledTextColor: "FFFF",
			textSize: 24,
			textGravity: UI.ViewGeometry.Gravity.Center,
			gradient: {
//				corners: '8 8 8 8',
//				outerLine: "00 1.5",
//				gradient: [ "FF9bd6f4 0.0", "FF0077BC 1.0" ]
			},
			highlightedGradient: {
//				corners: '8 8 8 8',
//				outerLine: "00 1.5",
//				gradient: [ "FF0077BC 0.0", "FF9bd6f4 1.0" ]
			},
			disabledGradient: {
				corners: '0 8 8 8',
				gradient: [ "FF55 0.0", "FF00 1.0"]
			},
			onClick: function(event) {
				
				if (quitting)
				{
					return;
				}
				quitting = true;

				LGL.runUpdatedGame(Core.Capabilities.getBootGame());
				
				NgLogD("this.getFrame()#############################" + this.getFrame());
				
				UI.Window.document.addChild(new UI.Spinner({
					frame: new UI.ViewGeometry.Rect(10, 10, 64, 64).inset(10)
				}));
				
				var myRect = new UI.ViewGeometry.Rect(this.getFrame());
				this.setFrame(10, 10, 240, 64);
				// Reserve some space for the spinner to appear
				this.setTextInsets(0, 0, 0, 64);
				this.setTextGravity(0, 0.5);
				
				this.setTextSize(18.0);
				// Select the "disabled" appearance, and deactivate the control
				this.addState(UI.State.Disabled);
			}
		});
		
		this.doneBootStrap = false;
		
		var self = this;
		
		var KeyListener = Core.MessageListener.singleton (
		{		
		    initialize: function()
		    {
		        Device.KeyEmitter.addListener(this, this.onUpdate);
		    },
		    onUpdate : function(keyEvent)
		    {
		        if (keyEvent.code === Device.KeyEmitter.Keycode.back)
		        {
		        	
		            if (this.backButton) {
		            	//return this.backButton.onclick(keyEvent);
		            	if(self.doneBootStrap)
	            		{
		            		return false;
	            		}
		            	else
		            	{
		            		//ゲーム側ではバックキーの操作を行わないように処理を条件分けすることなく揃える（20110425）
//		            		this.backButton.onclick(keyEvent);
//		            		return true;
		            		
		            		return false;
		            	}
		            }
		        }
		    }
		});
		
		//ゲーム側ではバックキーの制御を行わないよう仕様を修正（20110425）
//		KeyListener.instantiate();
//		KeyListener.backButton = back;
		UI.Window.document.addChild(back);
		
		NgLogD("bootstrap initialize end ############################");
	},
//	// TODO: BootStrap実装者は、NavControllerの挙動を把握してから下記部分を置き換える
//	_patchNavController: function() {
//		var oldMethod = UI.NavController.prototype.onBackPressed;
//		var self = this;
//		UI.NavController.prototype.onBackPressed = function(bypassForceBackButtonPassThrough) {
//			if(self.doneBootStrap)	//ゲーム中
//			//if(true)	//ゲーム中
//			{
//				return oldMethod.call(this, bypassForceBackButtonPassThrough);
//			}
//			else	//bootstrap処理中
//			{
//				if(this.navStack.length <= 1)
//				{
//					Core.LocalGameList.runUpdatedGame(
//						Core.Capabilities.getStartingServer() + "/" + Core.Capabilities.getBootGame()
//					);
//					return true;
//				}
//				else
//				{
//					return oldMethod.call(this, bypassForceBackButtonPassThrough);
//				}
//			}
//		};
//	},
	run: function() {
		// TODO: BootStrap実装者は、NavControllerの挙動を把握してから下記部分を置き換える
		//UI.NavController.getInstance();

		var self = this;
		var gLabel;
		var gLabelShadow;
		var splashImage;
		var copyRight;
		var copyRightShadow;
		var statusUpdateFlg = 0;
		
		//ラベル表示位置offset値を取得
		var labelOffsetV = self.opt.theme.styles.labelOffsetV;
		var labelOffsetH = self.opt.theme.styles.labelOffsetH;
		
		var copyRightPosX = self.opt.theme.styles.copyRightPosX;
		var copyRightPosY = self.opt.theme.styles.copyRightPosY;
		
		
		//Splashクラス呼び出し時copyRightPosXまたはcopyRightPosYの値が指定されている時は
		//指定値を優先するがそう出なければデフォルト値を設定する
		if(copyRightPosX == undefined)
		{
			copyRightPosX = 240;
		}
		
		if(copyRightPosY == undefined)
		{
			copyRightPosY = 305;
		}
		
		NgLogD("copyRightPosX##############################: " + copyRightPosX);
		NgLogD("copyRightPosY##############################: " + copyRightPosY);
		
		
		var loadingStatusLabelPosX = self.opt.theme.styles.loadingStatusLabelPosX;
		var loadingStatusLabelPosY = self.opt.theme.styles.loadingStatusLabelPosY;
		
		NgLogD("loadingStatusLabelPosX##############################: " + loadingStatusLabelPosX);
		NgLogD("loadingStatusLabelPosY##############################: " + loadingStatusLabelPosY);
		
		
		if(loadingStatusLabelPosX == undefined)
		{
			NgLogD("set loadingStatusLabelPosX##########");
			loadingStatusLabelPosX = 240;
		}
		
		if(loadingStatusLabelPosY == undefined)
		{
			NgLogD("set loadingStatusLabelPosY##########");
			loadingStatusLabelPosY = 271;
		}
		
		NgLogD("loadingStatusLabelPosX##############################: " + loadingStatusLabelPosX);
		NgLogD("loadingStatusLabelPosY##############################: " + loadingStatusLabelPosY);
		
//		var loadStatusFontSize = 16;
//		var loadStatusTextSpaceSize = 20;
//		var loadStatusFont = "DroidSans-Bold"
		
		var loadStatusFontSize = self.opt.theme.styles.loadStatusFontSize;
		if(loadStatusFontSize == undefined)
		{
			loadStatusFontSize = 16;
		}
		
		var loadStatusTextSpaceSize = self.opt.theme.styles.loadStatusTextSpaceSize;
		if(loadStatusTextSpaceSize == undefined)
		{
			loadStatusTextSpaceSize = 20;
		}
		
		var loadStatusFont = self.opt.theme.styles.loadStatusFont;
		if(loadStatusFont == undefined)
		{
			loadStatusFont = "DroidSans-Bold";
		}
		
		//CopyRightフォントサイズ
//		copyRightSprite.setFontSize(12);
//		copyRightSprite.setSize = new Core.Point(0, 17);
//		copyRightSprite.setFontFamily("DroidSans");
		var copyRightFontSize = self.opt.theme.styles.copyRightFontSize;
		if(copyRightFontSize == undefined)
		{
			copyRightFontSize = 12;
		}
		
		var copyRightTextSpaceSize = self.opt.theme.styles.copyRightTextSpaceSize;
		if(copyRightTextSpaceSize == undefined)
		{
			copyRightTextSpaceSize = 17;
		}
		
		var copyRightFont = self.opt.theme.styles.copyRightFont;
		if(copyRightFont == undefined)
		{
			copyRightFont = "DroidSans";
		}
		
		var destroySprites = function(){
			backBase.destroy();
		}
		
		var destroyObjects = function(){
			splashImage.destroy();
			copyRight.destroy();
			copyRightShadow.destroy();
			gLabel.destroy();
			gLabelShadow.destroy();
		}

		//ジョブの待ち合わせ処理用同期処理
		//	スプラッシュ描画処理、ダウンロード完了処理の待ち合わせを行う
		var sync = new Sync();
		var splashSync = sync.job();
		var downloadSync = sync.job();
		
		var showSpinner = function(){
			//spinnerテスト
			var w = Core.Capabilities.getScreenWidth();
			var h = Core.Capabilities.getScreenHeight();
			var mainRect = new UI.ViewGeometry.Rect(0, 0, w, h);
			//var label;
			//var elems = [];

			////////// Background //////////
			baseView = new UI.View();
			baseView.setFrame(mainRect.array());
//			baseView.setGradient({
//				innerShadow:"FF3DA7FF 200.0 {0.0,0.0}",
//				gradient:["FFC0DCFF 0.000","FFC0DCFF 1.000"]
//			});
			NGWindow.document.addChild(baseView);
			mainRect.sliceHorizontal(Scale.ios.width(240));
			mainRect.sliceVertical(Scale.ios.height(240));
			
//			mainRect.sliceHorizontal(240);
//			mainRect.sliceVertical(400);
			
//			mainRect.inset(30,30,10,10);

			
			/////////// Spinner /////////////
			//label = createLabel("Spinner", mainRect.sliceVertical(30));
			//baseView.addChild(label);
			//elems.push(label);
			
			var spinner = new UI.Spinner();
			spinner.setFrame(mainRect.sliceVertical(100).sliceHorizontal(100).array());
			baseView.addChild(spinner);
			//elems.push(spinner);
		}
		
		//ロゴ＋splash表示完了処理とダウンロード完了処理の待ち合わせ同期処理を行う
		//	ロゴ＋splashは必ず最低時間表示する（VFX処理完了時まで）
		var callSplashSyncFunc = function(){
			splashSync();
			
			NgLogD("before showSpinner ############################");
			//showSpinner();
			NgLogD("after showSpinner ############################");

			this.finish();
		}

		//ローディングステータス表示フェードイン
		var dispLoadStatus = function(){
			
			var shadowPosOffset = 1;

			gLabel= new GL2.Text();
			gLabel.setAnchor(0.5, 0.5);
			
			gLabelShadow= new GL2.Text();
			gLabelShadow.setAnchor(0.5, 0.5);
			
//			var loadStatusFontSize = 16;
//			var loadStatusTextSpaceSize = 20;
//			var loadStatusFont = "DroidSans-Bold"
			
			gLabel.setFontSize(loadStatusFontSize);
			gLabel.setSize = new Core.Point(0, loadStatusTextSpaceSize);
			gLabel.setFontFamily(loadStatusFont);
			
			gLabelShadow.setFontSize(loadStatusFontSize);
			gLabelShadow.setSize = new Core.Point(0, loadStatusTextSpaceSize);
			gLabelShadow.setFontFamily(loadStatusFont);
			
			gLabelShadow.setColor(0, 0, 0);
			
			gLabel.setText(" ");
			gLabel.setPosition(loadingStatusLabelPosX + labelOffsetH, loadingStatusLabelPosY + labelOffsetV);
			
			gLabelShadow.setText(" ");
	
			gLabelShadow.setPosition(loadingStatusLabelPosX + shadowPosOffset + labelOffsetH, loadingStatusLabelPosY + shadowPosOffset + labelOffsetV);
			
			gLabel.setAlpha( 0 );
			gLabelShadow.setAlpha( 0 );
			
			self.opt.parent.addChild(gLabelShadow);
			self.opt.parent.addChild(gLabel);
			
			VFX.enchant(gLabel).fi(1).and(callSplashSyncFunc, []).wait(0);
			VFX.enchant(gLabelShadow).fi(1).wait(0);

			statusUpdateFlg = 1;
		}
		
		var setCopyRightSprite = function(copyRightSprite, offsetPos, shadowFlg){
			
			//©を使うと難読化で文字化けするようなので(c)にて対応
			//var copyRightLine = "©2011 DeNA Co.,LTD. All rights reserved.";
			var copyRightLine = "(c)2011 DeNA Co.,LTD. All rights reserved.";
			copyRightSprite = new GL2.Text();
			
			copyRightSprite.setPosition(copyRightPosX + labelOffsetH + offsetPos, copyRightPosY + labelOffsetV + offsetPos);
			copyRightSprite.setFontSize(copyRightFontSize);
			copyRightSprite.setSize = new Core.Point(0, copyRightTextSpaceSize);
			copyRightSprite.setFontFamily(copyRightFont);
			copyRightSprite.setText(copyRightLine);
			
			if(shadowFlg == 1)
			{
				copyRightSprite.setColor(0, 0, 0);
			}
			else
			{
				copyRightSprite.setColor(1, 1, 1);
			}
			
			copyRightSprite.setAlpha(0);

			self.opt.parent.addChild(copyRightSprite);
			
			return copyRightSprite;
		}
		
		//splash画面表示
		var addSplash = function() {

			splashImage = new GL2.Sprite();

			splashImage.setImage(self.opt.theme.styles.splashBackGround.image, [480, 320], [0, 0]);

			splashImage.setAlpha(0);
			
			self.opt.parent.addChild(splashImage);

			//フェードイン
			VFX.enchant(splashImage).fi(1).wait(1).wait(0);

			copyRightShadow = setCopyRightSprite(copyRightShadow, 1, 1);
			copyRight = setCopyRightSprite(copyRight, 0, 0);
			VFX.enchant(copyRightShadow).fi(1).wait(1);
			VFX.enchant(copyRight).fi(1).wait(1);
			
			//ダウンロードステータス
			dispLoadStatus();
		};
		
		var w = Core.Capabilities.getScreenWidth();
		var h = Core.Capabilities.getScreenHeight();

		
		//orientationにより回転させる時に背景が見えてしまうので長い方の長さに合わせて背景を作成するための変数取得
		var baseSize;
		if(w > h)
		{
			baseSize = w;
		}
		else
		{
			baseSize = h;
		}

		// Back ground
		var backBase = new GL2.Sprite();
		
		backBase.setImage(self.opt.backGroundImageFile,[baseSize, baseSize],[0,0]);
		self.opt.parent.addChild(backBase);
		
		addSplash();
		
		var controller;

		var startDownload = function(){
		
			//ダウンロード手続き開始処理
			// Post a loading screen from manifest assets.
			
			var url = Core.Capabilities.getContentUrl();
			
			var dl = new Network.DownloadManifest();
			
			var currentTotal = 0;
			var downLoaded = 0;
			var newDownLoaded = 0;
			
			//ダウンロード進捗を必ず取得するようフラグを追加
			var setInitialDownloadStatus = 0;
			
			dl.start(url, ".", self.opt.manifest, function(cur, total){
				//NgLogD ( "##################################" + self.opt.manifest + " " + statusUpdateFlg);
				
				//totalをステータス表示からの計算にする
				//	ステータス表示開始からの値をメモリしておく
				
				if (statusUpdateFlg == 1 && setInitialDownloadStatus == 1) {
				
					newDownLoaded = cur - downLoaded;
					
					// Update loading progress display.
					//NgLogD("****** downloader progress = " + cur + " / " + total);
					//var progress = total > 0 ? parseInt(cur / (total - currentDownLoadedMem) * 100) : 100;
					
					NgLogD("****** downloader progress = " + cur + " / " + currentTotal);
					
					var percentage = 0;
					if (currentTotal) {
						percentage = parseInt(newDownLoaded / currentTotal * 100);
					}
					
					var progress = total > 0 ? percentage : 100;
					gLabel.setText("Loading... " + progress + " %");
					gLabelShadow.setText("Loading... " + progress + " %");
				}
				else {
					currentTotal = total - cur;
					downLoaded = cur;
					
					//必ず初回は処理を実行するためのフラグ
					setInitialDownloadStatus = 1;
				}
			}, function(err, manifest){
				
				if (err) // Failure. :(
				{
				
					var alertDialog = new UI.AlertDialog();
					alertDialog.setTitle("Network Error");
					alertDialog.setText("Retry downloading?");
					alertDialog.setChoices(["OK"]);
					alertDialog.onchoice = function(event){
//						var gLauncherUrl = Core.Capabilities.getStartingServer() + "/" + Core.Capabilities.getBootGame();
//						NgLogD(gLauncherUrl + "#########################################");
//						var LGL = require('../../../../../NGCore/Client/Core/LocalGameList').LocalGameList;
//						LGL.runUpdatedGame(gLauncherUrl);
						
						startDownload();
					};
					alertDialog.show();

					NgLogD("###################****** downloader failed with " + err);
				}
				else // Success!!!
				{
					NgLogD("################****** downloader finished!!!");
					
					
					//テキストボックス表示まで完了している場合
					if (statusUpdateFlg == 1) {
						// Continue with game startup.
						
						NgLogD("set Download Done text########################");
						
						gLabel.setText("Download Done");
						gLabelShadow.setText("Download Done");
					}
					else {
						NgLogD("################****** downloader finished!!!no destroy");
					}
					
					downloadSync();
				}
			});
			
		}
		
		
		NgLogD("startDownload0#############################");
		startDownload();
		NgLogD("startDownload1#############################");


		//待ち合わせ後の処理
		sync.wait(function() {
			NgLogD( "##########################all jobs are finished");
//			NgLogD( "##########################" + self.opt.plusServerData.consumerKey);
			gotoLoginProcess();
		});

		//各画面で背景に使う画像を表示／消去する関数
		var background;
		this.addBackground = function() {
			
			self.opt.parent.addChild(backBase);
			
			styles = self.opt.theme.styles;
			if (!styles.signUpBackground.image) { return; }
			background = new UI.Image();
			background.setImage(styles.signUpBackground.image);
			background.setFrame([0, 0, NGWindow.outerHeight/5*3, NGWindow.outerHeight]);
			background.setImageGravity([0.5, 0.0]);
			background.setImageFit(UI.FitMode.Stretch);
			NGWindow.document.addChild(background);
		};
		this.removeBackground = function() {
			//背景削除
			destroyObjects();
			if (!background) { return; }
			NGWindow.document.removeChild(background);
			background.destroy();
		};
		
		// it seems NavController doesn't free objects explicitly.
		var overrideBack = function() {
			var back = UI.NavController.prototype.back;
			UI.NavController.prototype.back = function(fromButton) {
				var removed = back.call(this, fromButton);
				if (!removed) { return null; }
				var destroy = function(depth) {
					if (this.getChildren) {
						this.getChildren().forEach(function(child) {
							destroy.call(child, depth + 1);
							if (child.destroy) { child.destroy(); }
						});
					}
				};
				destroy.call(removed, 0);
				NgLogD("removed view destroyed");
				return removed;
			};
		};
		
		//ここからログインコールバック等実装
		function gotoLoginProcess()
		{
			var setKeyEmitterFlg = function(isDone)
			{
				self.doneBootStrap = isDone;
			}
			
			destroyObjects();
			
			self.opt.onDownloadDone(setKeyEmitterFlg, destroySprites);
		}
		NgLogD("BootStrap run end ############################");
	}
});
