//////////////////////////////////////////////////////////////////////////////
/**
 *  @date:      2010-11-09
 *  @file:      RegInfoViewController.js
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
var Device = require('../../../../NGCore/Client/Device').Device;
var UI = require('../../../../NGCore/Client/UI').UI;
var Scale = require('./Scaler').Scale;
var WebView = require('./WebView').WebView;
var RegistrationViewController = require('./RegViewController').RegistrationViewController;
//////////////////////////////////////////////////////////////////////////////////////////////////
function strFromRect(rect) {
	return "["+rect.x+","+rect.y+","+rect.w+","+rect.h+"]";
}
function RectPrint(rect) {
	NgLogD(strFromRect(rect)+"\n");
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// View Controller Definition
exports.RegistrationInfoViewController = Class.subclass({
	classname:"RegistrationInfoViewController",
	//analyticsName: "reg2",
	initialize:function(opt) {
		var self = this;
		this.opt = opt;
		this.styles = opt.theme.styles;
		this.onCompleteCallback = opt.onRegistrationSuccess;
		
		this.setKeyEmitterFlg = opt.setKeyEmitterFlg;
		this.destroySprites = opt.destroySprites;
		
		this.removeRegView = opt.removeRegView;
		
		NgLogD("removeRegView################################" + opt.removeRegView);
		
		NgLogD("opt.setKeyEmitterFlg in reginfo################################" + opt.setKeyEmitterFlg);
		NgLogD("opt.destroySprites in reginfo################################" + opt.destroySprites);

		this.buildUI();

		this.birthdateField.ondatechange = function(d){
			NgLogD("Birthdate Changed to: "+d);
			self.birthdateDidChange(d);
		};
		this.boyButton.onclick = function(){
			self.selectGender("male");
		};
		this.girlButton.onclick = function(){
			self.selectGender("female");
		};
		this.mailingListCheck.onclick = function(){
			self.toggleMailingListCheck();
		};
		this.notagreeButton.onclick = function(){
			NgLogD("notagreeButton.onclick ##################");
			self.notagreeButtonClicked();
		};
		this.playButton.onclick = function(){
			self.letsPlayButton();
		};
	},
	buildUI:function() {
		NgLogD("RegistrationInfoScreen Constructor\n");
		var opt = this.opt;
		var styles = this.styles;
		var i;
		this.registrationRecord = opt.registrationRecord;
		
		//デザイン作業用コメントアウト（通常有効にする）!!!!!
		if(!this.registrationRecord.gender) this.registrationRecord.gender = "NA";
		
		var onAndroid = false;
		if (Core.Capabilities.getPlatformOS().toLowerCase() == 'android') {
			onAndroid = true;
			NgLogD("Running on Android\n");
		}

		this.adDisplayCount = 0;

		var mainRect = new UI.ViewGeometry.Rect(0, 0, NGWindow.outerWidth, NGWindow.outerHeight);
		this.baseView = new UI.View();
		this.baseView.setFrame(mainRect.array());
		this.baseView.setBackgroundColor("00000000");
		this.mainContainer = this.baseView;
		this.mainContainer.analyticsName = this.analyticsName;

		//mainRect.sliceVertical(Scale.droid.height(140));
		mainRect.sliceVertical(Scale.droid.height(40));
		NgLogD("|| SubTitle ||\n");
		
		var subtitleHeight = 50;
		
		if (styles.signUpSubtitle.image) {
			this.subtitleImage = new UI.Image();
			this.subtitleImage.setFrame(styles.getAdjustedRect(
				styles.signUpSubtitle.imageSize,
				//mainRect.sliceVertical(Scale.ios.height(30))
				mainRect.sliceVertical(Scale.ios.height(subtitleHeight))
			).array());
			this.subtitleImage.setBackgroundColor(styles.signUpSubtitle.backgroundColor);
			this.subtitleImage.setImage(styles.signUpSubtitle.image);
			this.subtitleImage.setImageGravity([0.5,0.0]);
			this.subtitleImage.setImageFit(UI.FitMode.Stretch);
			this.baseView.addChild(this.subtitleImage);
		} else {
			this.subtitleLabel = new UI.Label();
			this.subtitleLabel.setFrame(mainRect.sliceVertical(Scale.ios.height(subtitleHeight)).array());
			this.subtitleLabel.setBackgroundColor(styles.signUpSubtitle.backgroundColor);
			this.subtitleLabel.setTextGravity(UI.ViewGeometry.Gravity.Center);
			//this.subtitleLabel.setGradient(styles.label);
			this.subtitleLabel.setText("");
			this.subtitleLabel.setTextColor(styles.signUpSubtitle.textColor);
			// TODO - set font style not yet supported, wait for jyopp
			//		this.subtitleLabel.setFont({'font-face':['Droid Sans'], 'font-size':24.0, 'bold':true});
			this.subtitleLabel.setTextSize(Scale.ios.textSize(styles.signUpSubtitle.font["font-size"]));
			this.baseView.addChild(this.subtitleLabel);
		}

		NgLogD("|| SubTitle 2 ||\n");
		this.subtitleLabel2 = new UI.Label();
		this.subtitleLabel2.setFrame(mainRect.sliceVertical(Scale.ios.height(20)).array());
		this.subtitleLabel2.setBackgroundColor(styles.signUpSubtitle2.backgroundColor);
		this.subtitleLabel2.setTextGravity(UI.ViewGeometry.Gravity.Center);
//		this.subtitleLabel2.setGradient({outerLine:"FF233e00 1.5"});
		this.subtitleLabel2.setText("Sign up and play with friends!");
		this.subtitleLabel2.setTextColor(styles.signUpSubtitle2.textColor);
		// TODO - set font2 style not yet supported, wait for jyopp
//		this.subtitleLabel2.setFont({'font-face':['Droid Sans'], 'font-size':13.0, 'bold':true});
		this.subtitleLabel2.setTextSize(Scale.ios.textSize(styles.signUpSubtitle2.font["font-size"]));
		this.baseView.addChild(this.subtitleLabel2);
		mainRect.inset(Scale.ios.height(5),0,0,0);

		var fieldHeight = Scale.ios.height(40);
		var fieldSpacer = Scale.ios.height(2);
		var fieldsRect = mainRect.sliceVertical(5*fieldHeight + 4*fieldSpacer);
		fieldsRect.inset(0,10,0,10);
		var labelHeight = Scale.ios.height(20);

		NgLogD("|| Rects ||\n");
		var birthdateLabelRect = fieldsRect.sliceVertical(labelHeight);
		var birthdateRect = fieldsRect.sliceVertical(fieldHeight);
//		fieldsRect.inset(fieldSpacer,0,0,0);
//		var genderLabelRect = fieldsRect.sliceVertical(labelHeight);
//		var genderRect = fieldsRect.sliceVertical(fieldHeight);
//		RectPrint(genderRect);
//		var boyRect = genderRect.sliceHorizontal(genderRect.w / 2);
//		var girlRect = genderRect.copy();
//		boyRect.inset(0,5,0,0);
//		girlRect.inset(0,0,0,5);
//		RectPrint(boyRect);
//		RectPrint(girlRect);

		fieldsRect.inset(fieldSpacer,0,0,0);
		var avatarLabelRect = fieldsRect.sliceVertical(labelHeight);
		var avatarRect = avatarLabelRect.copy();
		avatarRect.y += labelHeight + fieldSpacer;
		avatarRect.h = 2*fieldHeight + fieldSpacer;
		avatarRect.w = avatarRect.h;
		var fullnameLabelRect = avatarLabelRect.sliceHorizontal((-1.85/3.0)*avatarLabelRect.w);
		var firstnameRect = fullnameLabelRect.copy();
		firstnameRect.y += labelHeight + fieldSpacer;
		firstnameRect.h = fieldHeight;
		var lastnameRect = firstnameRect.copy();
		lastnameRect.y += fieldHeight+fieldSpacer;
		
		fieldsRect.inset(fieldSpacer,0,0,0);
		//var genderLabelRect = fieldsRect.sliceVertical(labelHeight);
		var genderLabelRect = fieldsRect.sliceVertical(Scale.ios.height(100));
		var genderRect = fieldsRect.sliceVertical(fieldHeight);
		RectPrint(genderRect);
		var boyRect = genderRect.sliceHorizontal(genderRect.w / 2);
		var girlRect = genderRect.copy();
		boyRect.inset(0,5,0,0);
		girlRect.inset(0,0,0,5);
		RectPrint(boyRect);
		RectPrint(girlRect);

		//fieldsRect.inset(2.3 * fieldHeight,0,0,0);
		fieldsRect.inset(15,0,0,0);
		var spamRect = fieldsRect.sliceVertical(45);
		var spamCheckRect = spamRect.sliceHorizontal(-fieldHeight);
		spamCheckRect.x += 10;
		spamCheckRect.y -= 5;
		
//		//ここにWebViewを追加
//		var termsViewRect = fieldsRect.sliceVertical(Scale.ios.height(60));
//		//var termsViewRect = fieldsRect.sliceVertical(Scale.ios.height(0));
//		termsViewRect.inset(0,0,0,0);
		
		//最下部のagree notagreeボタン関連
		var agreementRect = mainRect.sliceVertical(-1*fieldHeight);
		
		//ここにWebViewを追加
		var termsViewRect = mainRect.sliceVertical(-1.8*fieldHeight);
		//var termsViewRect = fieldsRect.sliceVertical(Scale.ios.height(0));
		termsViewRect.inset(0,0,0,0);
		
		notagreeBtnRect = agreementRect.sliceHorizontal(Scale.ios.width(125));
		notagreeBtnRect.inset(0, 5, 0, 15);
		agreeBtnRect = agreementRect.copy(agreementRect);
		agreeBtnRect.inset(0, 15, 0, 5);

		var curLabel;
		var curLabelStyle = styles.inputLabel;
		var curLabelFrame;

		NgLogD("|| Birthdate Label ||\n");
		curLabelFrame = birthdateLabelRect;
		RectPrint(curLabelFrame);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
		curLabel.setText('Birthdate (Required)');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.birthdateLabel = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD("|| Birthdate Field ||\n");
		this.birthdateField = new UI.DateField();
		this.birthdateField.setAttributes(styles.inputFieldGradients);
		this.birthdateField.setEnterKeyType(UI.EditText.EnterKeyTypes.Next);
		this.birthdateField.setDateFormat('mm-yyyy');
		this.birthdateField.setFrame(birthdateRect.array());
		this.baseView.addChild(this.birthdateField);

		NgLogD("|| Gender ||\n");
		curLabelFrame = genderLabelRect;
		RectPrint(curLabelFrame);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
		curLabel.setText('Gender');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.genderLabel = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD(" | Boy Button | \n");
		RectPrint(boyRect);
		this.boyButton = new UI.Button(styles.defaultButtonStyle);
		if (styles.boyButton.normalImage)  {
			this.boyButton.setNormalImage(styles.boyButton.normalImage);
			this.boyButton.setHighlightedImage(styles.boyButton.highlightedImage);
			this.boyButton.setFrame(styles.getAdjustedRect(styles.boyButton.imageSize, boyRect).array());
			this.boyButton.setImageGravity([0.5,0.0]);
			this.boyButton.setImageFit(UI.FitMode.Stretch);
			this.boyButton.setNormal = function() { this.setNormalImage(styles.boyButton.normalImage); };
			this.boyButton.setSelected = function() { this.setNormalImage(styles.boyButton.selectedImage); };
		} else {
			this.boyButton.setNormalGradient(styles.boyButton.normalGradient);
			this.boyButton.setHighlightedGradient(styles.boyButton.highlightedGradient);
			this.boyButton.setNormalText("boy");
			this.boyButton.setNormalTextColor(styles.boyButton.normalTextColor);
			this.boyButton.setFrame(boyRect.array());
			this.boyButton.setNormal = function() { this.setNormalGradient(styles.boyButton.normalGradient); };
			this.boyButton.setSelected = function() { this.setNormalGradient(styles.boyButton.highlightedGradient); };
		}
		this.boyButton.controller = this;
		//this.boyButton.setSelectedGradient(styles.lightblueButtonSelected);
		this.baseView.addChild(this.boyButton);

		NgLogD(" | Girl Button | \n");
		RectPrint(girlRect);
		this.girlButton = new UI.Button(styles.defaultButtonStyle);
		if (styles.girlButton.normalImage)  {
			this.girlButton.setNormalImage(styles.girlButton.normalImage);
			this.girlButton.setHighlightedImage(styles.girlButton.highlightedImage);
			this.girlButton.setFrame(styles.getAdjustedRect(styles.girlButton.imageSize, girlRect).array());
			this.girlButton.setImageGravity([0.5,0.0]);
			this.girlButton.setImageFit(UI.FitMode.Stretch);
			this.girlButton.setNormal = function() { this.setNormalImage(styles.girlButton.normalImage); };
			this.girlButton.setSelected = function() { this.setNormalImage(styles.girlButton.selectedImage); };
		} else {
			this.girlButton.setNormalGradient(styles.girlButton.normalGradient);
			this.girlButton.setHighlightedGradient(styles.girlButton.highlightedGradient);
			this.girlButton.setNormalText("girl");
			this.girlButton.setNormalTextColor(styles.girlButton.normalTextColor);
			this.girlButton.setFrame(girlRect.array());
			this.girlButton.setNormal = function() { this.setNormalGradient(styles.girlButton.normalGradient); };
			this.girlButton.setSelected = function() { this.setNormalGradient(styles.girlButton.highlightedGradient); };
		}
		this.girlButton.controller = this;
		//this.girlButton.setSelectedGradient(styles.lightpinkButtonSelected);
		this.baseView.addChild(this.girlButton);

		NgLogD("|| Profile Image Label ||\n");
		curLabelFrame = avatarLabelRect;
		RectPrint(curLabelFrame);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
		curLabel.setText('Profile Image');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.avatarLabel = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD(" | Profile Image |\n");
		RectPrint(avatarRect);
		this.avatarImage = new UI.Image();
		this.avatarImage.setFrame(avatarRect.array());
		this.avatarImage.setImage(styles.placeholderAvatarBox.image);
		this.avatarImage.setGradient({gradient:["00FFFFFF 0.0","00FFFFFF 1.0"],corners:"6 6 6 6"});
		this.avatarImage.controller = this;
		this.avatarImage.analyticsName = "reg2.avtrbtn";
		this.avatarImage.belongsToPlus = true;
		this.baseView.addChild(this.avatarImage);

		NgLogD("|| full name Label ||\n");
		curLabelFrame = fullnameLabelRect;
		RectPrint(curLabelFrame);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
		curLabel.setText('Full Name');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.fullnameLabel = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD(" | first name Field |\n");
		this.firstnameField = new UI.EditText();;
		this.firstnameField.setAttributes(styles.inputFieldGradients);
		this.firstnameField.setInputType(UI.EditText.InputTypes.TextWithCorrection);
		this.firstnameField.setEnterKeyType(UI.EditText.EnterKeyTypes.Next);
		this.firstnameField.setPlaceholder('first name');
		this.firstnameField.setFrame(firstnameRect.array());
		this.baseView.addChild(this.firstnameField);

		NgLogD(" | last name Field |\n");
		this.lastnameField = new UI.EditText();;
		this.lastnameField.setAttributes(styles.inputFieldGradients);
		this.lastnameField.setInputType(UI.EditText.InputTypes.TextWithCorrection);
		this.lastnameField.setEnterKeyType(UI.EditText.EnterKeyTypes.Done);
		this.lastnameField.setPlaceholder('last name');
		this.lastnameField.setFrame(lastnameRect.array());
		this.baseView.addChild(this.lastnameField);

		NgLogD("|| sign up for news checkbox Label ||\n");
		curLabelFrame = spamRect;
		//RectPrint(curLabelFrame);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Right);
		curLabel.setText('Game News and Updates');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.mailingListLabel = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD(" | spam check Button | \n");
		//RectPrint(spamCheckRect);
		this.mailingListCheck = new UI.CheckBox();
		this.mailingListCheck.controller = this;
		this.mailingListCheck.setFrame(spamCheckRect.array());
		this.baseView.addChild(this.mailingListCheck);
		
		
		var webview = new UI.WebView();
		webview.setFrame(termsViewRect.array());
		var caps	= Core.Capabilities;
		var server = caps.getServer();
		NgLogD("URL ##############################" + server+ "/" + Core.Capabilities.getGame() + "/" + opt.theme.html.licensenotice);
		webview.onpageevent = function(evt) {
			var data = evt.eventStream;
			
			//WebViewに引数として渡すURL
			var url;
			
			NgLogD("onpageevent:###########################" + data);
			if (data == "doPress") {
				
				NgLogD("theme:###########################" + opt.theme.html.dnprivacy);
				
				url = opt.theme.html.terms1;
			}
			else if (data == "doPress2") {
				NgLogD("dopress2:###########################");
				
				url = opt.theme.html.privacy1;
			}
			else if (data == "doPress3") {
				NgLogD("dopress3:###########################");
				
				url = opt.theme.html.terms2;
			}
			else if (data == "doPress4") {
				NgLogD("dopress4:###########################");
				
				url = opt.theme.html.privacy2;
			}
			
			
			var pv = new WebView({
				theme: opt.theme,
				url: url,
				from: "reginfo",
				registrationRecord: this.registrationRecord
			});
			
			NgLogD("url ######################################" + url);
			
			NgLogD("moveToPrivacyPolicy2 ######################################");
			UI.NavController.getInstance().forwardToView(pv.getMainContainer());
			NgLogD("moveToPrivacyPolicy3 ######################################");
		};
		
		//WebViewに利用規約を表示
		//webview.loadUrl(server+ "/" + Core.Capabilities.getGame() + "/" + opt.theme.html.licensenotice);
		webview.loadDocument(opt.theme.html.licensenotice);
		
		this.baseView.addChild(webview);
		
		NgLogD("this.baseView.addChild(webview) ##########################");

		NgLogD("|| Lets Play Button ||\n");
		this.notagreeButton = new UI.Button(styles.defaultButtonStyle);
		
		NgLogD("normal button#############################");
		
		if (styles.notagreeButton.normalImage)  {
			this.notagreeButton.setNormalImage(styles.notagreeButton.normalImage);
			this.notagreeButton.setHighlightedImage(styles.notagreeButton.highlightedImage);
			this.notagreeButton.setFrame(styles.getAdjustedRect(styles.notagreeButton.imageSize, notagreeBtnRect).array());
			this.notagreeButton.setImageGravity([0.5,0.0]);
			this.notagreeButton.setImageFit(UI.FitMode.Stretch);
		} else {
			this.notagreeButton.setNormalGradient(styles.notagreeButton.normalGradient);
			this.notagreeButton.setHighlightedGradient(styles.notagreeButton.highlightedGradient);
			this.notagreeButton.setNormalText("let's play!");
			this.notagreeButton.setNormalTextColor(styles.notagreeButton.normalTextColor);
			this.notagreeButton.setFrame(notagreeBtnRect.array());
		}
		this.notagreeButton.controller = this;
		this.notagreeButton.analyticsName = "reg2.alldnbtn";
		this.notagreeButton.belongsToPlus = true;
		this.baseView.addChild(this.notagreeButton);

		NgLogD("|| Lets Play Button ||\n");
		this.playButton = new UI.Button(styles.defaultButtonStyle);
		if (styles.playButton.normalImage)  {
			this.playButton.setNormalImage(styles.playButton.normalImage);
			this.playButton.setHighlightedImage(styles.playButton.highlightedImage);
			this.playButton.setFrame(styles.getAdjustedRect(styles.playButton.imageSize, agreeBtnRect).array());
			this.playButton.setImageGravity([0.5,0.0]);
			this.playButton.setImageFit(UI.FitMode.Stretch);
		} else {
			this.playButton.setNormalGradient(styles.playButton.normalGradient);
			this.playButton.setHighlightedGradient(styles.playButton.highlightedGradient);
			this.playButton.setNormalText("let's play!");
			this.playButton.setNormalTextColor(styles.playButton.normalTextColor);
			this.playButton.setFrame(agreeBtnRect.array());
		}
		this.playButton.controller = this;
		this.playButton.analyticsName = "reg2.alldnbtn";
		this.playButton.belongsToPlus = true;
		this.baseView.addChild(this.playButton);

		this.keysToFields = {birthdate:this.birthdateField,firstname:this.firstnameField,lastname:this.lastnameField};
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
	notagreeButtonClicked:function(){
		
		var self = this;
		
		//同意しない場合はゲームリスタート
		
		NgLogD("notagreeButton clicked function####################################");
		gLauncherUrl = Core.Capabilities.getStartingServer() + "/" +Core.Capabilities.getBootGame();
		NgLogD(gLauncherUrl + "#########################################");
		var LGL = require('../../../../NGCore/Client/Core/LocalGameList').LocalGameList;
		LGL.runUpdatedGame(gLauncherUrl);
		
//		//ゲームリブートではなく、ログイン画面トップに戻る仕様に修正
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
//					//UI.NavController.getInstance().clear();
//					while (UI.NavController.getInstance().back()) {}
//					cb(user, button, data);
//				});
//			};
//		};
//		
//		while (UI.NavController.getInstance().back()) {}
//		
//		var vc = new RegistrationViewController({
//			onLoginSuccess: restoreOrientation(getGameTokens(self.opt.onLoginSuccess)),
//			onLoginError: self.opt.onLoginError,
//			onCheckFirstLogin: self.opt.onCheckFirstLogin,
//			onRegistrationSuccess: restoreOrientation(getGameTokens(self.opt.onRegistrationSuccess)),
//			theme: self.opt.theme
//		});
//		// TODO: Androidでも強制表示している。hardwareボタン対応する。=> added in 0.9.2s
//		//NGUI.NavController.getInstance()._useBackButton = true;
//		UI.NavController.getInstance().forwardToView(vc.getMainContainer());
	},
	letsPlayButton:function(){
		var styles = this.styles;
		this.birthdateField.normalizeDateLayout();
		var rr = this.registrationRecord;
		var tDate = this.birthdateField.getDate();

		rr.birthdate = tDate;
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
				
				NgLogD("onCompleteCallback #####################################" + vc.onCompleteCallback);
				NgLogD("setKeyEmitterFlg2 in reginfo #####################################" + vc.setKeyEmitterFlg);
				NgLogD("destroySprites2 in reginfo #####################################" + vc.destroySprites);

				if(vc.onCompleteCallback) {
					vc.onCompleteCallback(session, vc.loginButton, vc.setKeyEmitterFlg, vc.destroySprites);
					vc.removeRegView();
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
	selectGender:function(nGender){
		NgLogD("Gender Selected: "+nGender + "\n");

		var styles = this.styles;
		var oldGender = this.registrationRecord.gender;
		this.registrationRecord.gender = nGender;

		if(nGender == "male"){
			this.boyButton.setSelected();
			this.girlButton.setNormal();
		}
		else if(nGender == "female"){
			this.boyButton.setNormal();
			this.girlButton.setSelected();
		}
		else {
			this.boyButton.setNormal();
			this.girlButton.setNormal();
		}
	},
	toggleMailingListCheck:function(){
		NgLogD("Mailing List Check Toggled");
		this.registrationRecord.optIn = !this.registrationRecord.optIn;
	},
	birthdateDidChange:function(d) {
		var rr = this.registrationRecord;
		rr.birthdate = d;
		if( rr.isUnderage() ) {
			// if user is < 14, disable fields.
			this.lastnameField.setText("");
			this.lastnameField.setPlaceholder("disabled");
			this.lastnameField.setEnabled(false);
			this.mailingListCheck.setEnabled(false);
			this.mailingListLabel.setEnabled(false);
		}
		else {
			// else, enable fields!
			this.lastnameField.setPlaceholder("last name");
			this.lastnameField.setEnabled(true);
			this.mailingListCheck.setEnabled(true);
			this.mailingListLabel.setEnabled(true);
		}
	}
});
