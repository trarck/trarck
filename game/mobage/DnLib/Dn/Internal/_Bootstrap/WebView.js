//////////////////////////////////////////////////////////////////////////////////////////////////
// Includes
var Class = require('../../../../NGCore/Client/Core/Class').Class;
var UI = require('../../../../NGCore/Client/UI').UI;
var Core = require('../../../../NGCore/Client/Core').Core;
var GL2 = require('../../../../NGCore/Client/GL2').GL2;
var Scale = require('./Scaler').Scale;


var LoginViewController = require('./LoginControllers').LoginViewController;

//////////////////////////////////////////////////////////////////////////////////////////////////

exports.WebView = Class.subclass({
	classname:"WebView",
	initialize:function(opt) {
		
//		NgLogD("opt ##########################");
//		NgLogD("opt.theme ##########################" + opt.theme);
//		NgLogD("opt.theme.styles ##########################" + opt.theme.styles);
		
		var self = this;
		this.opt = opt;
		this.styles = opt.theme.styles;
		this.url = opt.url;
		this.from = opt.from;
		
		this.registrationRecord = opt.registrationRecord;

		NgLogD("webview url ########################" + this.url);
		NgLogD("opt.theme.styles1 ########################");
		NgLogD("opt.theme.styles2 ########################" + opt.theme.styles);

		this.buildUI();
		
		
		//Back
		this.backButton.onclick  = function(){
			//self.signupButton();
			
			NgLogD("backButton clicked ##############################");
			self.backClicked();
			
			//self.moveToInfoScreen(this.agreeButton);
		}
		
//		//not agree
//		this.disAgreeButton.onclick = function()
//		{
//			var vc = new RegistrationViewController({
//				onLoginSuccess: restoreOrientation(getGameTokens(self.opt.onLoginSuccess)),
//				onLoginError: self.opt.onLoginError,
//				onRegistrationSuccess: restoreOrientation(getGameTokens(self.opt.onRegistrationSuccess)),
//				theme: self.opt.theme
//			});
//			// TODO: Androidでも強制表示している。hardwareボタン対応する。=> added in 0.9.2s
//			//NGUI.NavController.getInstance()._useBackButton = true;
//			
//			NgLogD("create regist view #############################");
//			
//			NGUI.NavController.getInstance().forwardToView(vc.getMainContainer());
//		}
//		
//		//同意ボタン
//		this.agreeButton.onclick  = function(){
//			//self.signupButton();
//			
//			NgLogD("agreeButton ##############################");
//			//self.letsPlayButton();
//			
//			self.moveToInfoScreen(this.agreeButton);
//		}
		
//		this.ボタン名.onclick=funcion(){
//			self.selectGender("male");
//		}
		
//		//not agree
//		this.disAgreeButton.onclick = function() {
//			NgLogD("disAgreeButton ##################################");
////			
////			var vc = new RegistrationViewController({
////				theme: opt.theme
////			});
////			UI.NavController.getInstance().forwardToView(vc.getMainContainer());
//		};
//
//		//agree
//		this.agreeButton.onclick = function() {
//			NgLogD("agree ##################################");
////			var vc = new LoginViewController({
////				theme: opt.theme
////			});
////			UI.NavController.getInstance().forwardToView(vc.getMainContainer());
//
//			//self.moveToInfoScreen();
//			
//			
//			//self.letsPlayButton();
//		};
	},
	buildUI:function() {
		var opt = this.opt;
		var styles = this.styles;
		var onAndroid = false;
		if (Core.Capabilities.getPlatformOS().toLowerCase() == 'android') {
			onAndroid = true;
			NgLogD("Running on Android\n");
		}

		var i;

		this.adDisplayCount = 0;

		//var mainRect = new UI.ViewGeometry.Rect(0, 0, NGWindow.outerWidth, NGWindow.outerHeight);


		var mainRect = new UI.ViewGeometry.Rect(0, 0, NGWindow.outerWidth, NGWindow.outerHeight);
		this.baseView = new UI.View();
		this.baseView.setFrame(mainRect.array());
		this.baseView.setBackgroundColor("00000000");
		this.mainContainer = this.baseView;
		this.mainContainer.analyticsName = this.analyticsName;


//		var bg = new UI.Image();
//		if (styles.loginBackground.image) {
//			bg.setImage(styles.loginBackground.image);
//		}
//		if (styles.loginBackground.image) {
//			bg.setImage(opt.theme.styles.loginBackground.image);
//		}
//		if (!onAndroid) {
//			this.scrollView = new UI.ScrollView();
//			this.scrollView.setFrame(mainRect.array());
//			this.scrollView.setContentSize([Scale.screenWidth,Scale.screenHeight+20]);
//
//			this.baseView = new UI.View({
//				gradient: {
//					gradient: ["FFC0 0.0", "FF80 1.0"]
//				}
//			});
//			this.baseView.setFrame(mainRect.array());
//			bg.setFrame(mainRect.array());
//			bg.setImageGravity([0.5,0.0]);
//			bg.setImageFit(UI.FitMode.Stretch);
//			this.baseView.addChild(bg);
//			this.scrollView.addChild(this.baseView);
//			this.mainContainer = this.scrollView;
//		} else {
//			//var androidStyles = {
//			//	customBackground: {
//			//		gradient: [
//			//			"FFF96f22 0.0",
//			//			"FF00FFFF 0.8"
//			//		]
//			//	}
//			//};
//			this.baseView = new UI.View();
//			this.baseView.setFrame(mainRect.array());
//			this.baseView.setBackgroundColor(styles.loginBackground.backgroundColor);
//			bg.setFrame([0,0,NGWindow.outerHeight/5*3,NGWindow.outerHeight]);
//			bg.setImageGravity([0.5,0.0]);
//			bg.setImageFit(UI.FitMode.Stretch);
//			this.baseView.addChild(bg);
//			this.mainContainer = this.baseView;
//		}
		
		NgLogD("WebView01 ########################################");

		mainRect.sliceVertical(Scale.droid.height(140));
		NgLogD("|| SubTitle ||\n");

		if (styles.signUpSubtitle.image) {
			this.subtitleImage = new UI.Image();
			this.subtitleImage.setFrame(styles.getAdjustedRect(styles.signUpSubtitle.imageSize, mainRect.sliceVertical(Scale.ios.height(30))).array());
			this.subtitleImage.setBackgroundColor(styles.signUpSubtitle.backgroundColor);
			this.subtitleImage.setImage(styles.signUpSubtitle.image);
			this.subtitleImage.setImageGravity([0.5, 0.0]);
			this.subtitleImage.setImageFit(UI.FitMode.Stretch);
			this.baseView.addChild(this.subtitleImage);
		}
		else {
			this.subtitleLabel = new UI.Label();
			this.subtitleLabel.setFrame(mainRect.sliceVertical(Scale.ios.height(30)).array());
			this.subtitleLabel.setBackgroundColor(styles.signUpSubtitle.backgroundColor);
			this.subtitleLabel.setTextGravity(UI.ViewGeometry.Gravity.Center);
			//this.subtitleLabel.setGradient(styles.label);
			this.subtitleLabel.setText("Sign Up");
			this.subtitleLabel.setTextColor(styles.signUpSubtitle.textColor);
			// TODO - set font style not yet supported, wait for jyopp
			//		this.subtitleLabel.setFont({'font-face':['Droid Sans'], 'font-size':24.0, 'bold':true});
			this.subtitleLabel.setTextSize(Scale.ios.textSize(styles.signUpSubtitle.font["font-size"]));
			this.baseView.addChild(this.subtitleLabel);
		}
		
		NgLogD("WebView01 ########################################");

		this.mainContainer.analyticsName = this.analyticsName;
		
		var caps	= Core.Capabilities;
		var screenWidth	= caps.getScreenWidth();
		var screenHeight	=  caps.getScreenHeight();
		
		//WebViewのポジション
		//var viewPosY = Scale.droid.height(200)
		var viewPosY = Scale.droid.height(0)
		
		
		mainRect.sliceVertical(viewPosY);
		
		//WebViewの高さ
		//var webViewHeight = Scale.ios.height(280)
		
		var webViewHeight = Scale.ios.height(480)
		
		//背景ラベル設定
		//mainRect.sliceVertical(Scale.droid.height(220));
		this.subtitleLabel = new UI.Label();
		//this.subtitleLabel.setFrame(mainRect.sliceVertical(Scale.ios.height(250)).array());
		//this.subtitleLabel.setFrame([30, 300, screenWidth-100, 520]);
		
//		this.subtitleLabel.setFrame(mainRect.sliceVertical(webViewHeight).array());
//		this.subtitleLabel.setBackgroundColor("FFFF");
//		this.baseView.addChild(this.subtitleLabel);
		
		
		//NGWindow.document.addChild (backView ([0, 0, screenWidth, screenHeight]) );
		this.baseView.addChild(backView ([0, viewPosY, screenWidth, webViewHeight]) );
		
		
		var webview = new UI.WebView();
		//webview.setBackgroundColor("FFFFFFFF");
		//webview.setTextColor("FFFFFFFF");
		//webview.setFrame([0, 220, screenWidth, screenHeight-80]);
		//webview.setFrame([30, 300, screenWidth-100, 520]);
		
		//NgLogD("webview posy" + Scale.droid.height(170));
		webview.setFrame([0, viewPosY, screenWidth, webViewHeight]);
		
		mainRect.inset(Scale.ios.height(10),0,0,0);

		var fieldHeight = Scale.ios.height(40);
		var fieldSpacer = Scale.ios.height(5);	//fieldRect間のマージン
		var fieldsRect = mainRect.sliceVertical(5*fieldHeight + 4*fieldSpacer);
		var labelHeight = Scale.ios.height(40);
		
		var fenceRect = mainRect.sliceVertical(-Math.round(113*Scale.screenWidth/480));
		fenceRect.w = Scale.screenWidth;
		fenceRect.x = 0;
		
		var gamernameLabelRect = fieldsRect.sliceVertical(labelHeight);
		var gamernameRect = fieldsRect.sliceVertical(fieldHeight);
		fieldsRect.inset(fieldSpacer,0,0,0);
		
		//ここにパネルを配置
		var curLabel;
		var curLabelStyle = styles.inputLabel;
		var curLabelFrame;

//		NgLogD("|| Gamename Label ||\n");
//		curLabelFrame = gamernameLabelRect;	//オブジェクトを代入
//		curLabelFrame.inset(0,0,0,16);	//右側を削る？
		curLabel = new UI.Label();
		
//		var alreadyHaveAccountLabelRect = fenceRect.sliceHorizontal(Scale.ios.width(120));
//		//fenceRect.h = 10;
//		alreadyHaveAccountLabelRect.inset(0,0,30,0);
		
		//backボタン実装
//		NgLogD("|| Login Button ||\n");
		this.backButton = new UI.Button(styles.defaultButtonStyle);
		this.backButton.analyticsName = "notAgree";
		this.backButton.setNormalGradient(styles.yellowButton);
		this.backButton.setHighlightedGradient(styles.blueButtonDown);
		this.backButton.setNormalText('Back');
		//fenceRect.inset(16,Scale.ios.width(20),8,Scale.ios.width(10));
//		this.backButton.controller = this;
//		gamernameLabelRect.inset(0, 0, 0, 280);
//		this.backButton.setFrame(gamernameLabelRect.array());

//		gamernameLabelRect.inset(0, 0, 0, 280);
		//fenceRect.inset(0,0,30,20);
		fenceRect.inset(0,0,30,0);
		this.backButton.setFrame(fenceRect.array());
		
		//this.backButton.analyticsName = "reg1.lgnbtn";
		this.backButton.belongsToPlus = true;
		//this.baseView.addChild(this.backButton);

		
		//agree仕様OFFのためコメントアウト
//		NgLogD("|| Login Button ||\n");
//		this.disagreeButton = new UI.Button(styles.defaultButtonStyle);
//		this.disagreeButton.analyticsName = "notAgree";
//		this.disagreeButton.setNormalGradient(styles.blueButton);
//		this.disagreeButton.setHighlightedGradient(styles.blueButtonDown);
//		this.disagreeButton.setNormalText('not agree');
//		//fenceRect.inset(16,Scale.ios.width(20),8,Scale.ios.width(10));
////		this.disagreeButton.controller = this;
//		//alreadyHaveAccountLabelRect.inset(0, 0, 0, 20);
//		this.disagreeButton.setFrame(alreadyHaveAccountLabelRect.array());
//		//this.disagreeButton.analyticsName = "reg1.lgnbtn";
//		this.disagreeButton.belongsToPlus = true;
//		this.baseView.addChild(this.disagreeButton);
//		
//		//agreeボタン
//		NgLogD("|| Login Button ||\n");
//		this.agreeButton = new UI.Button(styles.defaultButtonStyle);
//		this.agreeButton.analyticsName = "notAgree";
//		this.agreeButton.setNormalGradient(styles.yellowButton);
//		this.agreeButton.setHighlightedGradient(styles.blueButtonDown);
//		this.agreeButton.setNormalText('agree');
//		//fenceRect.inset(16,Scale.ios.width(20),8,Scale.ios.width(10));
////		this.agreeButton.controller = this;
////		gamernameLabelRect.inset(0, 0, 0, 280);
////		this.agreeButton.setFrame(gamernameLabelRect.array());
//
////		gamernameLabelRect.inset(0, 0, 0, 280);
//		fenceRect.inset(0,0,30,20);
//		this.agreeButton.setFrame(fenceRect.array());
//		
//		//this.agreeButton.analyticsName = "reg1.lgnbtn";
//		this.agreeButton.belongsToPlus = true;
//		this.baseView.addChild(this.agreeButton);
		
		
//		curLabel.setFrame(alreadyHaveAccountLabelRect.array());
//		curLabel.setText('gamername');
//		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
//		curLabel.setTextColor(curLabelStyle.textColor);
//		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
//		this.baseView.addChild(this.curLabel);
//		
//		
//		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
//		curLabel.setText('gamername');
//		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
//		curLabel.setTextColor(curLabelStyle.textColor);
//		// TODO - set font style not yet supported, wait for jyopp
////		curLabel.setFont(curLabelStyle.font);
//		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
//		curLabel.setFrame(curLabelFrame.array());	//配置
//		this.gamernameLabel = curLabel;
//		this.baseView.addChild(curLabel);

		//ラベルサンプルにつきコメントアウト
//		NgLogD("|| Gamename Label ||\n");
//		curLabelFrame = gamernameLabelRect;	//オブジェクトを代入
//		curLabelFrame.inset(0,0,0,16);	//右側を削る？
//		curLabel = new UI.Label();
//		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
//		curLabel.setText('gamername');
//		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
//		curLabel.setTextColor(curLabelStyle.textColor);
//		// TODO - set font style not yet supported, wait for jyopp
////		curLabel.setFont(curLabelStyle.font);
//		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
//		curLabel.setFrame(curLabelFrame.array());	//配置
//		this.gamernameLabel = curLabel;
//		this.baseView.addChild(curLabel);

//		NgLogD("|| Login Button ||\n");
//		this.loginButton = new UI.Button(styles.defaultButtonStyle);
//		this.loginButton.analyticsName = "notAgree";
//		this.loginButton.setNormalGradient(styles.blueButton);
//		this.loginButton.setHighlightedGradient(styles.blueButtonDown);
//		this.loginButton.setNormalText('not agree');
//		//fenceRect.inset(16,Scale.ios.width(20),8,Scale.ios.width(10));
////		this.loginButton.controller = this;
//		gamernameLabelRect.inset(0, 330, 0, 0);
//		this.loginButton.setFrame(gamernameLabelRect.array());
//		//this.loginButton.analyticsName = "reg1.lgnbtn";
//		this.loginButton.belongsToPlus = true;
//		this.baseView.addChild(this.loginButton);


		
		//fenceRect.inset(16,Scale.ios.width(20),8,Scale.ios.width(10));

		//webview.setFrame(mainRect.sliceVertical(Scale.ios.height(250)).array());
		var server = caps.getServer();
		//webview.loadUrl(server+'/Samples/Touch/Content/webpage.html');
		
		NgLogD("URL ##############################" + server+ "/" + Core.Capabilities.getGame() + "/" + opt.url);
		
		//webview.loadUrl(server+ "/" + Core.Capabilities.getGame() + "/" + opt.theme.html.dnprivacy);
		
		//webview.loadUrl(server+ "/" + Core.Capabilities.getGame() + "/" + opt.url);
		NgLogD("webview.loadDocument0#####################");
		webview.loadDocument(opt.url);
		NgLogD("webview.loadDocument1#####################");
		
		//webview.loadUrl("https://developer.mobage.com/en/terms");
		
		this.baseView.addChild(webview);
		
		NgLogD("this.baseView.addChild(webview) ##########################");
		
//		this.loginButton = new UI.Button(styles.defaultButtonStyle);
//		this.loginButton.analyticsName = "btn01";
//		this.loginButton.setNormalGradient(styles.blueButton);
//		this.loginButton.setHighlightedGradient(styles.blueButtonDown);
//		this.loginButton.setNormalText('disagree');
//		//fenceRect.inset(16,Scale.ios.width(20),8,Scale.ios.width(10));
////		this.loginButton.controller = this;
//		//this.loginButton.setFrame(10, screenHeight, 30, 30);
//		this.loginButton.setFrame(150, 150, 150, 150);
//		//this.loginButton.analyticsName = "reg1.lgnbtn";
//		this.loginButton.belongsToPlus = true;
//		this.baseView.addChild(this.loginButton);
		
		//NGWindow.document.addChild (backView ([0, 0, screenWidth, screenHeight]) );
		//NGWindow.document.addChild (webview);
		
	},
	getMainContainer: function() {
		return this.mainContainer;
	},
	moveToInfoScreen:function(fromButton){
		var opt = this.opt;
		NgLogD("moveToInfoScreen ##############################");
		var RegInfoViewController = require('./RegInfoViewController').RegInfoViewController;
		var rs2 = new RegInfoViewController({
			theme: opt.theme
		});
		NgLogD("moveToInfoScreen2 ##############################");
		UI.NavController.getInstance().forwardToView(rs2.getMainContainer(), fromButton);
	},
	letsPlayButton:function(){
		var styles = this.styles;
		this.birthdateField.normalizeDateLayout();
		var rr = this.registrationRecord;
		var tDate = this.birthdateField.getDate();

		rr.birthdate = tDate;
		//NgLogD("Birthdate appears to be: "+ rr.birthdate.toString());
		rr.firstName = this.firstnameField.getText();
		if(this.lastnameField.getEnabled()) {
			rr.lastName = this.lastnameField.getText();
		} else {
			rr.lastName = "";
		}

		var vc = this;
		var f = function(errors, session) {
			vc.progressDialog.hide();
			if(errors && errors.length) {
				NgLogD("Errors while submitting for user creation: "+JSON.stringify(errors)+"\n");
				for(var i in errors ) {
					if(errors.hasOwnProperty(i)){
						var e = errors[i];
						if (e.field && vc.keysToFields[e.field]) {
							vc.keysToFields[e.field].errored = true;
							vc.keysToFields[e.field].setGradient(styles.inputFieldErrored);
						}

						var t = new UI.Toast();
						t.setText(""+e);
						t.show();
					}
				}
			}
			else {
				NgLogD("No Errors with user submission!\n");

				var successToast = new UI.Toast();
				successToast.setText("Success! User Created!!");
				successToast.show();

				if(vc.onCompleteCallback) {
					vc.onCompleteCallback(session, vc.loginButton);
				}
			}
		};

		this.clearErrors();
		if(!this.progressDialog) {
			this.progressDialog = new UI.ProgressDialog();
			this.progressDialog.setText("Registering");
		}
		this.progressDialog.show();
		rr.createUser(f);
	},
	backClicked:function() {
		
		//呼び出し元により場合分けを行う
		
		//NgLogD("QUACK Forgot Password Clicked\n");
		NgLogD("backClicked ######################################");
		var button = this.backButton;
		var opt = this.opt;
		var from = this.from;
		NgLogD("RegistrationViewController ######################################");
		
		NgLogD("this.registrationRecord######################################" + this.registrationRecord);

		//呼び出しもとUIにより戻り先を変える
		if(from == "reginfo")
		{
			var RegInfoViewController = require('./RegInfoViewController').RegInfoViewController;
			var vc = new RegInfoViewController({
				theme: opt.theme,
				styles: opt.theme.styles,
				registrationRecord: this.registrationRecord
			});
	
			NgLogD("RegistrationViewController2 ######################################");
	
			//NgLogD("VC with analyticsName " + vc.getMainContainer().analyticsName + ", " + vc.analyticsName);
			UI.NavController.getInstance().forwardToView(vc.getMainContainer(), button);
			
			NgLogD("webview destroy ########");
			//this.destroy();
			//UI.NavController.destroy();
			NgLogD("webview destroy2 ########");
		}
		else
		{
			var LoginControllers = require('./LoginControllers').LoginControllers;
			var vc = new LoginControllers({
				theme: opt.theme,
				styles: opt.theme.styles
			});
	
			NgLogD("RegistrationViewController2 ######################################");
	
			//NgLogD("VC with analyticsName " + vc.getMainContainer().analyticsName + ", " + vc.analyticsName);
			UI.NavController.getInstance().forwardToView(vc.getMainContainer(), button);
			
			NgLogD("webview destroy ########");
			//this.destroy();
			//UI.NavController.destroy();
			NgLogD("webview destroy2 ########");
		}
		
	}
});


var backView	= function (rectArray) {
	var view	= new UI.View ({
		frame: rectArray,
		gradient: {
			gradient: [
				"FFFFFFFF 0.0",
				"FFFFFFFF 0.0"
			]
		}
	});
	
	return view;
};
