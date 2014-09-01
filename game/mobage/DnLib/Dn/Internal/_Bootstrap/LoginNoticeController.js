//////////////////////////////////////////////////////////////////////////////
/**
 *  @date:      2010-11-09
 *  @file:      LoginControllers.js
 *  @author:    Frederic Barthelemy
 *  Website:    http://www.ngmoco.com/
 *  Copyright:  2010, by ngmoco:)
 *              Unauthorized redistribution of source code is
 *              strictly prohibited. Violators will be prosecuted.
 *
 *  @brief:
 */
//////////////////////////////////////////////////////////////////////////////
// Includes
var Class = require('../../../../NGCore/Client/Core/Class').Class;
var UI = require('../../../../NGCore/Client/UI').UI;
var PlusRequest = require('../../../../NGCore/Client/Plus/PlusRequest').PlusRequest;
var Scale = require('./Scaler').Scale;
var WebView = require('./WebView').WebView;
var RegistrationViewController = require('./RegViewController').RegistrationViewController;

//////////////////////////////////////////////////////////////////////////////
function strFromRect(rect) {
	return "["+rect.x+","+rect.y+","+rect.w+","+rect.h+"]";
}
function RectPrint(rect) {
	NgLogD(strFromRect(rect)+"\n");
}

exports.LoginNoticeController = UI.View.subclass({
	classname:"LoginViewController",
	//analyticsName: "lgn",
	initialize:function($super, opt) {
		$super(opt);
		NgLogD("login notice Controller initializing started ######################");
		
		var self = this;
		this.opt = opt;
		this.styles = opt.theme.styles;
		this.onCompleteCallback = opt.onLoginSuccess;
		this.session = opt.session;
		this.setKeyEmitterFlg = opt.setKeyEmitterFlg;
		this.destroySprites = opt.destroySprites;
		this.removeCtrl3 = opt.removeCtrl3;

		NgLogD("removeCtrl3##########################################" + opt.removeCtrl3);
		
		NgLogD("opt.setKeyEmitterFlg##########################################" + opt.setKeyEmitterFlg);
		NgLogD("opt.destroySprites##########################################" + opt.destroySprites);

		this.buildUI();

		this.agreeButton.onclick = function(){
			self.agreeClicked();
		};
		
		this.disagreeButton.onclick = function(){
			self.disagreeClicked();
		};
	},
	buildUI:function() {
		var opt = this.opt;
		var styles = this.styles;
		var onAndroid = false;
		if (Core.Capabilities.getPlatformOS().toLowerCase() == 'android') {
			onAndroid = true;
			NgLogD("Running on Android\n");
		}

		this.adDisplayCount = 0;

		var mainRect = new UI.ViewGeometry.Rect(0, 0, NGWindow.outerWidth, NGWindow.outerHeight);
		this.baseView = new UI.View();
		this.baseView.setFrame(mainRect.array());
//		this.baseView.setBackgroundColor("00000000");
		this.mainContainer = this.baseView;
		this.mainContainer.analyticsName = this.analyticsName;

		//mainRect.sliceVertical(Scale.droid.height(140));
		mainRect.sliceVertical(Scale.droid.height(40));
		NgLogD("|| SubTitle ||\n");
		
		var subtitleHeight = 50;

		if (styles.loginSubtitle.image) {
			this.subtitleImage = new UI.Image();
			this.subtitleImage.setFrame(styles.getAdjustedRect(
				styles.loginSubtitle.imageSize,
				//mainRect.sliceVertical(Scale.ios.height(30))
				mainRect.sliceVertical(Scale.ios.height(50))
			).array());
//			this.subtitleImage.setBackgroundColor(styles.loginSubtitle.backgroundColor);
			this.subtitleImage.setImage(styles.loginSubtitle.image);
			this.subtitleImage.setImageGravity([0.5,0.0]);
			this.subtitleImage.setImageFit(UI.FitMode.Stretch);
			this.baseView.addChild(this.subtitleImage);
		} else {
			this.subtitleLabel = new UI.Label();
			this.subtitleLabel.setFrame(mainRect.sliceVertical(Scale.ios.height(subtitleHeight)).array());
			this.subtitleLabel.setBackgroundColor(styles.loginSubtitle.backgroundColor);
			this.subtitleLabel.setTextGravity(UI.ViewGeometry.Gravity.Center);
			//this.subtitleLabel.setGradient(styles.label);
			this.subtitleLabel.setText("");
			this.subtitleLabel.setTextColor(styles.loginSubtitle.textColor);
			// TODO - set font style not yet supported, wait for jyopp
			//		this.subtitleLabel.setFont({'font-face':['Droid Sans'], 'font-size':24.0, 'bold':true});
			this.subtitleLabel.setTextSize(Scale.ios.textSize(styles.loginSubtitle.font["font-size"]));
			this.baseView.addChild(this.subtitleLabel);
		}
		
		NgLogD("|| SubTitle 2 ||\n");
		this.subtitleLabel2 = new UI.Label();
		this.subtitleLabel2.setFrame(mainRect.sliceVertical(Scale.ios.height(20)).array());
		this.subtitleLabel2.setBackgroundColor(styles.signUpSubtitle2.backgroundColor);
		this.subtitleLabel2.setTextGravity(UI.ViewGeometry.Gravity.Center);
//		this.subtitleLabel2.setGradient({outerLine:"FF233e00 1.5"});
		this.subtitleLabel2.setText("Log in");
		this.subtitleLabel2.setTextColor(styles.signUpSubtitle2.textColor);
		// TODO - set font2 style not yet supported, wait for jyopp
//		this.subtitleLabel2.setFont({'font-face':['Droid Sans'], 'font-size':13.0, 'bold':true});
		this.subtitleLabel2.setTextSize(Scale.ios.textSize(styles.signUpSubtitle2.font["font-size"]));
		this.baseView.addChild(this.subtitleLabel2);
		mainRect.inset(Scale.ios.height(5),0,0,0);

		var fieldHeight = Scale.ios.height(40);
		var fieldSpacer = Scale.ios.height(5);
		var fieldsRect = mainRect.sliceVertical(5*fieldHeight + 4*fieldSpacer);
		var labelHeight = Scale.ios.height(20);
		
		NgLogD("|| Rects ||\n");
		var noticeLabelRect = fieldsRect.sliceVertical(Scale.ios.height(100));
		noticeLabelRect.inset(30, 15, 0, 15);
		
		//同意するしないボタン配置パネル
		var agreeBtnPanelRect = fieldsRect.sliceVertical(fieldHeight);
		agreeBtnPanelRect.inset(0, 15, 0, 15);
		
		var disagreeBtnRect = agreeBtnPanelRect.sliceHorizontal(Scale.ios.width(120));
		disagreeBtnRect.inset(0, 5, 0, 0);
		
		var agreeBtnRect = agreeBtnPanelRect.copy(agreeBtnPanelRect);
		agreeBtnRect.inset(0, 0, 0, 5);
		
		//WebViewを追加
		var webview = new UI.WebView();
		webview.setFrame(noticeLabelRect.array());
		var caps	= Core.Capabilities;
		var server = caps.getServer();
		NgLogD("URL ##############################" + server+ "/" + Core.Capabilities.getGame() + "/" + opt.theme.html.loginnotice);
		webview.onpageevent = function(evt) {
			
			var data = evt.eventStream;
			var url;
			
			NgLogD("onpageevent:###########################" + data);
			if (data == "doPress") {
				url = opt.theme.html.terms1;
			}
			else if (data == "doPress2") {
				url = opt.theme.html.privacy1;
			}
			
			var pv = new WebView({
				theme: opt.theme,
				url: url
			});
			
			NgLogD("url ######################################" + url);
			NgLogD("moveToPrivacyPolicy2 ######################################");
			UI.NavController.getInstance().forwardToView(pv.getMainContainer());
			NgLogD("moveToPrivacyPolicy3 ######################################");
		};
		
		//WebViewに利用規約を表示
		//webview.loadUrl(server+ "/" + Core.Capabilities.getGame() + "/" + opt.theme.html.loginnotice);
		webview.loadDocument(opt.theme.html.loginnotice);
		
		this.baseView.addChild(webview);

		NgLogD("|| disagreeButton Button ||\n");
		
		NgLogD("|| disagree Button ||\n");
		this.disagreeButton = new UI.Button(styles.defaultButtonStyle);
		//this.disagreeButton.analyticsName = "disagree";
		if (styles.notagreeButton.normalImage)  {
			this.disagreeButton.setNormalImage(styles.notagreeButton.normalImage);
			this.disagreeButton.setHighlightedImage(styles.notagreeButton.highlightedImage);
			
			NgLogD("styles.notagreeButton.imageSize######################" + styles.notagreeButton.imageSize);
			
			this.disagreeButton.setFrame(styles.getAdjustedRect(styles.notagreeButton.imageSize, disagreeBtnRect).array());
			this.disagreeButton.setImageGravity([0.5,0.0]);
			this.disagreeButton.setImageFit(UI.FitMode.Stretch);
			NgLogD("styles.notagreeButton.imageSize2######################");
		} else {
			this.disagreeButton.setNormalGradient(styles.notagreeButton.normalGradient);
			this.disagreeButton.setHighlightedGradient(styles.notagreeButton.highlightedGradient);
			this.disagreeButton.setNormalText('Not Agreed');
			this.disagreeButton.setFrame(disagreeBtnRect.array());
		}
		//this.disagreeButton.analyticsName = "reg1.lgnbtn";
		this.disagreeButton.belongsToPlus = true;
		this.baseView.addChild(this.disagreeButton);

		NgLogD("|| Login Button ||\n");
		this.agreeButton = new UI.Button(styles.defaultButtonStyle);
		//this.agreeButton.analyticsName = "agree";
		NgLogD("before styles.agreeButton.normalImage######################");
		if (styles.playButton.normalImage)  {
			NgLogD("after styles.agreeButton.normalImage######################");
			this.agreeButton.setNormalImage(styles.playButton.normalImage);
			this.agreeButton.setHighlightedImage(styles.playButton.highlightedImage);
			
			NgLogD("styles.agreeButton.imageSize######################" + styles.playButton.imageSize);
			
			this.agreeButton.setFrame(styles.getAdjustedRect(styles.playButton.imageSize, agreeBtnRect).array());
			this.agreeButton.setImageGravity([0.5,0.0]);
			this.agreeButton.setImageFit(UI.FitMode.Stretch);
			NgLogD("styles.agreeButton.imageSize2######################");
		} else {
			this.agreeButton.setNormalGradient(styles.playButton.normalGradient);
			this.agreeButton.setHighlightedGradient(styles.playButton.highlightedGradient);
			this.agreeButton.setNormalText('Agreed!');
			//disagreeBtnRect.inset(16,Scale.ios.width(20),8,Scale.ios.width(10));
			this.agreeButton.setFrame(agreeBtnRect.array());
		}
		//this.agreeButton.analyticsName = "reg1.lgnbtn";
		this.agreeButton.belongsToPlus = true;
		this.baseView.addChild(this.agreeButton);

	},
	getMainContainer: function() {
		return this.mainContainer;
	},
	clearErrors:function() {
		var fields = this.keysToFields;
		for(var i in fields) {
			if(fields.hasOwnProperty(i) && fields[i].errored){
				fields[i].errored = false;
				fields[i].setGradient(this.styles.inputField);
			}
		}
	},
	agreeClicked:function() {
		
		var vc = this;
		
		NgLogD("agreeClicked ###################################");

		NgLogD("vc.onCompleteCallback##########################################" +vc.onCompleteCallback);
		
		NgLogD("vc.setKeyEmitterFlg##########################################" +vc.setKeyEmitterFlg);
		
		NgLogD("vc.destroySprites##########################################" + vc.destroySprites);
		
		//何か表示を行う時のために残しておく
		//NgLogD("Successful login! ********************\n");
//					user = session.authenticatedUser();
//		var loginSuccessfulToast = new UI.Toast();
//		loginSuccessfulToast.setText("Welcome back "+user.gamertag+"!");
//		loginSuccessfulToast.show();

		NgLogD("this.session#######################" + this.session);
		
		
		if(this.onCompleteCallback) {
			this.onCompleteCallback(this.session, this.agreeButton, vc.setKeyEmitterFlg, vc.destroySprites);
			
			vc.removeCtrl3();
		}
	},
	disagreeClicked:function(){
		
		//同意しない場合はゲームリスタート
		
		gLauncherUrl = Core.Capabilities.getStartingServer() + "/" +Core.Capabilities.getBootGame();
		NgLogD(gLauncherUrl + "#########################################");
		var LGL = require('../../../../NGCore/Client/Core/LocalGameList').LocalGameList;
		LGL.runUpdatedGame(gLauncherUrl);

		//ゲームリブートではなく、ログイン画面トップに戻る仕様に修正
		
//		var self = this;
//		
//		restoreOrientation = function(cb) {
//			return function() {
//				if (self.opt.currentOrientation !== Device.OrientationEmitter.Orientation.Portrait) {
//					Device.OrientationEmitter.setInterfaceOrientation(self.opt.currentOrientation);
//				}
//				cb.apply(this, Array.prototype.slice.apply(arguments));
//			};
//		};
//		
//		var getGameTokens = function(cb) {
//			return function(session, button) {
//				var user = session.authenticatedUser();
//				PlusRequest.getSessionTokensForConsumerKey(self.opt.gameServerData.consumerKey, function(err, data) {
//					NgLogD("Callback'd for session tokens *" +
//						err + "* **" + data.oauth_token + "**" +
//						data.oauth_secret);
//					//NGUI.NavController.getInstance().clear();
//					while (UI.NavController.getInstance().back()) {}
//					cb(user, button, data);
//				});
//			};
//		};
//
//		//NgLogD("this.navStack.length0###############" + this.navStack.length);
//		
//		while (UI.NavController.getInstance().back()) {}
//		
//		//NgLogD("this.navStack.length1###############" + this.navStack.length);
//
//		var vc = new RegistrationViewController({
//			onLoginSuccess: restoreOrientation(getGameTokens(self.opt.onLoginSuccess)),
//			onLoginError: self.opt.onLoginError,
//			onRegistrationSuccess: restoreOrientation(getGameTokens(self.opt.onRegistrationSuccess)),
//			onCheckFirstLogin: self.opt.onCheckFirstLogin,
//			theme: self.opt.theme
//		});
//		
//		// TODO: Androidでも強制表示している。hardwareボタン対応する。=> added in 0.9.2s
//		//NGUI.NavController.getInstance()._useBackButton = true;
//		UI.NavController.getInstance().forwardToView(vc.getMainContainer());
	},
	forgotPasswordClicked:function() {
		NgLogD("QUACK Forgot Password Clicked\n");
		var button = this.forgotPasswordButton;
		var opt = this.opt;
		var vc = new exports.ForgotPasswordViewController({
			onSendPasswordResetEmailSuccess: function() {
				UI.NavController.getInstance().back(button);
			},
			theme: opt.theme
		});

		NgLogD("VC with analyticsName " + vc.getMainContainer().analyticsName + ", " + vc.analyticsName);
		UI.NavController.getInstance().forwardToView(vc.getMainContainer(), button);
	}
});
