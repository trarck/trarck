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
//////////////////////////////////////////////////////////////////////////////
function strFromRect(rect) {
	return "["+rect.x+","+rect.y+","+rect.w+","+rect.h+"]";
}
function RectPrint(rect) {
	NgLogD(strFromRect(rect)+"\n");
}
//////////////////////////////////////////////////////////////////////////////
// View Controller Definition
exports.ForgotPasswordViewController = UI.View.subclass({
	classname:"ForgotPasswordViewController",
	//analyticsName: "fgtpwd",
	initialize:function($super, opt) {
		$super(opt);
		var self = this;
		this.opt = opt;
		this.styles = opt.theme.styles;
		this.onCompleteCallback = opt.onSendPasswordResetEmailSuccess;


		this.buildUI();

		this.sendButton.onclick = function(){
			self.sendClicked();
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

		if (styles.forgotPasswordSubtitle.image) {
			this.subtitleImage = new UI.Image();
			this.subtitleImage.setFrame(styles.getAdjustedRect(
				styles.forgotPasswordSubtitle.imageSize,
				//mainRect.sliceVertical(Scale.ios.height(30))
				mainRect.sliceVertical(Scale.ios.height(subtitleHeight))
			).array());
//			this.subtitleImage.setBackgroundColor(styles.forgotPasswordSubtitle.backgroundColor);
			this.subtitleImage.setImage(styles.forgotPasswordSubtitle.image);
			this.subtitleImage.setImageGravity([0.5,0.0]);
			this.subtitleImage.setImageFit(UI.FitMode.Stretch);
			this.baseView.addChild(this.subtitleImage);
		} else {
			this.subtitleLabel = new UI.Label();
			this.subtitleLabel.setFrame(mainRect.sliceVertical(Scale.ios.height(subtitleHeight)).array());
			this.subtitleLabel.setBackgroundColor(styles.forgotPasswordSubtitle.backgroundColor);
			this.subtitleLabel.setTextGravity(UI.ViewGeometry.Gravity.Center);
			//this.subtitleLabel.setGradient(styles.label);
			this.subtitleLabel.setText("");
			this.subtitleLabel.setTextColor(styles.forgotPasswordSubtitle.textColor);
			// TODO - set font style not yet supported, wait for jyopp
			//		this.subtitleLabel.setFont({'font-face':['Droid Sans'], 'font-size':24.0, 'bold':true});
			this.subtitleLabel.setTextSize(Scale.ios.textSize(styles.forgotPasswordSubtitle.font["font-size"]));
			this.baseView.addChild(this.subtitleLabel);
		}
		
		NgLogD("|| SubTitle 2 ||\n");
		this.subtitleLabel2 = new UI.Label();
		this.subtitleLabel2.setFrame(mainRect.sliceVertical(Scale.ios.height(20)).array());
		this.subtitleLabel2.setBackgroundColor(styles.signUpSubtitle2.backgroundColor);
		this.subtitleLabel2.setTextGravity(UI.ViewGeometry.Gravity.Center);
//		this.subtitleLabel2.setGradient({outerLine:"FF233e00 1.5"});
		this.subtitleLabel2.setText("Forgot Your Password ?");
		this.subtitleLabel2.setTextColor(styles.signUpSubtitle2.textColor);
		// TODO - set font2 style not yet supported, wait for jyopp
//		this.subtitleLabel2.setFont({'font-face':['Droid Sans'], 'font-size':13.0, 'bold':true});
		this.subtitleLabel2.setTextSize(Scale.ios.textSize(styles.signUpSubtitle2.font["font-size"]));
		this.baseView.addChild(this.subtitleLabel2);
		mainRect.inset(Scale.ios.height(5),0,0,0);

		var fieldHeight = Scale.ios.height(40);
		var fieldSpacer = Scale.ios.height(5);

		//Space between the first subtitle and its directions
		mainRect.inset(fieldHeight*2/3,0,0,0);

		var fieldsRect = mainRect.sliceVertical(5*fieldHeight + 4*fieldSpacer);
		var labelHeight = Scale.ios.height(20);
		var fieldType = 'edittext';

		NgLogD("|| Rects ||\n");
		var dirLabelRect1 = fieldsRect.sliceVertical(labelHeight);
		var dirLabelRect2 = fieldsRect.sliceVertical(labelHeight);
		var dirLabelRect3 = fieldsRect.sliceVertical(labelHeight);
		fieldsRect.inset(fieldHeight*2/3,0,0,0);
		var emailLabelRect = fieldsRect.sliceVertical(labelHeight);
		fieldsRect.inset(fieldSpacer,0,0,0);
		var emailRect = fieldsRect.sliceVertical(fieldHeight);
		fieldsRect.inset(fieldHeight*2/3,0,0,0);
		var sendButtonRect = fieldsRect.sliceVertical(fieldHeight);
		sendButtonRect.inset(0,15,0,15);

		mainRect.inset(fieldSpacer,0,0,0);

		var labelWidth = Scale.ios.width(120);
		var inputWidth = Scale.screenWidth-labelWidth;

		var curLabel;
		var curLabelStyle = styles.inputLabel;
		var curLabelFrame;

		NgLogD("|| Directions Labels ||\n");
		curLabelFrame = dirLabelRect1;
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Center);
		curLabel.setText('Enter the email address you used to');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.directionsLabel1 = curLabel;
		this.baseView.addChild(curLabel);

		curLabelFrame = dirLabelRect2;
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Center);
		curLabel.setText('sign up for plus+ and a password');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.directionsLabel2 = curLabel;
		this.baseView.addChild(curLabel);

		curLabelFrame = dirLabelRect3;
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Center);
		curLabel.setText('reset will be sent to you.');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.directionsLabel3 = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD("|| Email Address Label ||\n");
		curLabelFrame = emailLabelRect;
		curLabelFrame.inset(0,0,0,16);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
		curLabel.setText('Email Address');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.emailLabel = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD("|| Email Field ||\n");
		this.emailField = new UI.EditText();
		this.emailField.setAttributes(styles.inputFieldGradients);
		this.emailField.setInputType(UI.EditText.InputTypes.Email);
		emailRect.inset(0,15,0,15);
		this.emailField.setFrame(emailRect.array());
		this.baseView.addChild(this.emailField);

		NgLogD("|| send Button||\n");

		NgLogD("|| Sign Me Up! Button||\n");
		this.sendButton = new UI.Button(styles.defaultButtonStyle);
		if (styles.sendButton.normalImage)  {
			this.sendButton.setNormalImage(styles.sendButton.normalImage);
			this.sendButton.setHighlightedImage(styles.sendButton.highlightedImage);
			this.sendButton.setFrame(styles.getAdjustedRect(styles.sendButton.imageSize, sendButtonRect).array());
			this.sendButton.setImageGravity([0.5,0.0]);
			this.sendButton.setImageFit(UI.FitMode.Stretch);
		} else {
			this.sendButton.setNormalGradient(styles.sendButton.normalGradient);
			this.sendButton.setHighlightedGradient(styles.sendButton.highlightedGradient);
			this.sendButton.setNormalText('send');
			this.sendButton.setNormalTextColor(styles.sendButton.normalTextColor);
			this.sendButton.setFrame(sendButtonRect.array());
		}
		this.sendButton.controller = this;
		this.sendButton.analyticsName = "lgnbtn";
		this.baseView.addChild(this.sendButton);

		this.keysToFields = {email:this.emailField};
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
	sendClicked:function() {
		NgLogD("Send Clicked\n");

		var styles = this.styles;
		this.clearErrors();

		if(!this.progressDialog) {
			this.progressDialog = new UI.ProgressDialog();
			this.progressDialog.setText("Sending request");
		}
		this.progressDialog.show();

		var vc = this;
		PlusRequest.sendPasswordResetEmailWithAddress(this.emailField.getText(), function(error) {
			vc.progressDialog.hide();
			if(!error) {
				var emailSuccessToast = new UI.Toast();
				emailSuccessToast.setText("Email Sent!");
				emailSuccessToast.show();

				if(vc.onCompleteCallback) {
					vc.onCompleteCallback(null, vc.sendButton);
				}
			}
			else {
				if(error.indexOf("email") != -1) {
					vc.emailField.errored = true;
					vc.emailField.setGradient(styles.inputFieldErrored);
				}
				var emailFailToast = new UI.Toast();
				emailFailToast.setText(error);
				emailFailToast.show();
			}
		});
	}
});
exports.LoginViewController = UI.View.subclass({
	classname:"LoginViewController",
	//analyticsName: "lgn",
	initialize:function($super, opt) {
		$super(opt);
		var self = this;
		this.opt = opt;
		this.styles = opt.theme.styles;
		this.onCompleteCallback = opt.onLoginSuccess;
		this.onErrorCallback = opt.onLoginError;
		this.clearCtrl = opt.clearCtrl;
		this.setKeyEmitterFlg = opt.setKeyEmitterFlg;
		this.destroySprites = opt.destroySprites;
		this.removeCtrl2 = opt.removeCtrl2;
		
		NgLogD("removeCtrl2##########################################" + opt.removeCtrl2);
		
		NgLogD("opt.clearCtrl Login################################" + opt.clearCtrl);
		NgLogD("opt.setKeyEmitterFlg Login################################" + opt.setKeyEmitterFlg);
		NgLogD("opt.destroySprites Login################################" + opt.destroySprites);
		
		this.onFirstLoginSuccess = opt.onFirstLoginSuccess;
		this.onCheckFirstLogin = opt.onCheckFirstLogin;

		this.buildUI();

		this.loginButton.onclick = function(){
			self.loginClicked();
		};
		this.forgotPasswordButton.onclick = function(){
			self.forgotPasswordClicked();
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
				mainRect.sliceVertical(Scale.ios.height(subtitleHeight))
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
		var gamernameLabelRect = fieldsRect.sliceVertical(labelHeight);
		var gamernameRect = fieldsRect.sliceVertical(fieldHeight);
		fieldsRect.inset(fieldSpacer,0,0,0);
		var passwordLabelRect = fieldsRect.sliceVertical(labelHeight);
		var passwordRect = fieldsRect.sliceVertical(fieldHeight);
		fieldsRect.inset(fieldSpacer,0,0,0);
		var emailLabelRect = fieldsRect.sliceVertical(labelHeight);

		var loginButtonRect = fieldsRect.sliceVertical(Scale.ios.height(300));
		loginButtonRect.inset(0,15,0,15);
		//var forgotPasswordRect = mainRect.sliceVertical(-1*(fieldHeight+fieldSpacer+10));
		var forgotPasswordRect = mainRect.sliceVertical(-1*(fieldHeight));
		//forgotPasswordRect.inset(0,15,fieldSpacer,15);
		forgotPasswordRect.inset(0,15,0,15);

		mainRect.inset(fieldSpacer,0,0,0);

		var labelWidth = Scale.ios.width(120);
		var inputWidth = Scale.screenWidth-labelWidth;

		var curLabel;
		var curLabelStyle = styles.inputLabel;
		var curLabelFrame;

		NgLogD("|| Gamename Label ||\n");
		curLabelFrame = gamernameLabelRect;
		curLabelFrame.inset(0,0,0,16);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
		curLabel.setText('Gamername');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.gamernameLabel = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD("|| Gamename Field ||\n");
		this.gamernameField = new UI.EditText();
		this.gamernameField.setAttributes(styles.inputFieldGradients);
		this.gamernameField.setInputType(UI.EditText.InputTypes.None);
		this.gamernameField.setEnterKeyType(UI.EditText.EnterKeyTypes.Next);
		//this.gamernameField.setText(' 4 to 15 characters');
		//this.gamernameField.setPlaceholderText(' 4 to 15 characters');
		gamernameRect.inset(0,15,0,15);
		this.gamernameField.setFrame(gamernameRect.array());
		this.baseView.addChild(this.gamernameField);

		NgLogD("|| Password Label ||\n");
		curLabelFrame = passwordLabelRect;
		curLabelFrame.inset(0,0,0,16);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
		curLabel.setText('Password');
		curLabel.setBackgroundColor(curLabelStyle.backgroundColor);
		curLabel.setTextColor(curLabelStyle.textColor);
		// TODO - set font style not yet supported, wait for jyopp
//		curLabel.setFont(curLabelStyle.font);
		curLabel.setTextSize(Scale.ios.textSize(curLabelStyle.font['font-size']));
		curLabel.setFrame(curLabelFrame.array());
		this.passwordLabel = curLabel;
		this.baseView.addChild(curLabel);

		NgLogD("|| Password Field ||\n");
		this.passwordField = new UI.EditText();
		this.passwordField.setAttributes(styles.inputFieldGradients);
		this.passwordField.setInputType(UI.EditText.InputTypes.Password);
		this.passwordField.setEnterKeyType(UI.EditText.EnterKeyTypes.Done);
		//this.passwordField.setText(' 4 to 15 characters');
		//this.passwordField.setPlaceholderText(' 4 to 15 characters');
		passwordRect.inset(0,15,0,15);
		this.passwordField.setFrame(passwordRect.array());
		this.baseView.addChild(this.passwordField);

		NgLogD("|| log in! Button||\n");
		this.loginButton = new UI.Button(styles.defaultButtonStyle);
		if (styles.loginButton.normalImage)  {
			this.loginButton.setNormalImage(styles.loginButton.normalImage);
			this.loginButton.setHighlightedImage(styles.loginButton.highlightedImage);
			this.loginButton.setFrame(styles.getAdjustedRect(styles.loginButton.imageSize, loginButtonRect).array());
			this.loginButton.setImageGravity([0.5,0.0]);
			this.loginButton.setImageFit(UI.FitMode.Stretch);
		} else {
			this.loginButton.setNormalGradient(styles.loginButton.normalGradient);
			this.loginButton.setHighlightedGradient(styles.loginButton.highlightedGradient);
			this.loginButton.setNormalText('log in!');
			this.loginButton.setNormalTextColor(styles.loginButton.normalTextColor);
			this.loginButton.setFrame(loginButtonRect.array());
		}
		this.loginButton.controller = this;
		this.loginButton.analyticsName = "lgn.lgnbtn";
		this.loginButton.belongsToPlus = true;
		this.baseView.addChild(this.loginButton);

		NgLogD("|| forgot password Button||\n");
		this.forgotPasswordButton = new UI.Button(styles.defaultButtonStyle);
		if (styles.forgotPasswordButton.normalImage)  {
			this.forgotPasswordButton.setNormalImage(styles.forgotPasswordButton.normalImage);
			this.forgotPasswordButton.setHighlightedImage(styles.forgotPasswordButton.highlightedImage);
			this.forgotPasswordButton.setFrame(styles.getAdjustedRect(styles.forgotPasswordButton.imageSize, forgotPasswordRect).array());
			this.forgotPasswordButton.setImageGravity([0.5,0.0]);
			this.forgotPasswordButton.setImageFit(UI.FitMode.Stretch);
		} else {
			this.forgotPasswordButton.setNormalGradient(styles.forgotPasswordButton.normalGradient);
			this.forgotPasswordButton.setHighlightedGradient(styles.forgotPasswordButton.highlightedGradient);
			this.forgotPasswordButton.setNormalText('forgot your password ?');
			this.forgotPasswordButton.setNormalTextColor(styles.forgotPasswordButton.normalTextColor);
			this.forgotPasswordButton.setFrame(forgotPasswordRect.array());
		}
		this.forgotPasswordButton.controller = this;
		this.forgotPasswordButton.analyticsName = "lgn.fgtpwbtn";
		this.forgotPasswordButton.belongsToPlus = true;
		this.baseView.addChild(this.forgotPasswordButton);

		this.keysToFields = {gamername:this.gamernameField,password:this.passwordField};
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
	loginClicked:function() {
		NgLogD("Log in Clicked\n");
		var styles = this.styles;
		//var setKeyEmitterFlg = this.setKeyEmitterFlg;
		
		NgLogD("setKeyEmitterFlg loginClicked#############################" + this.setKeyEmitterFlg);
		
		var theme = this.opt.theme;
		this.clearErrors();

		if(!this.progressDialog) {
			this.progressDialog = new UI.ProgressDialog();
			this.progressDialog.setText("Logging in");
		}
		
		this.progressDialog.show();

		var gamername = this.gamernameField.getText();
		var password = this.passwordField.getText();

		var pr = PlusRequest;
		var vc = this;
		
		pr.loginWithUsernameAndPassword(gamername,password,function(error, session) {
			var user;
			vc.progressDialog.hide();
			if(error) {
				NgLogD("************** Failed Login Error: "+JSON.stringify(error)+"\n");

				if(error.indexOf("gamername") != -1 || error.indexOf("login") != -1) {
					vc.gamernameField.errored = true;
					vc.gamernameField.setGradient(styles.inputFieldErrored);
				}
				if(error.indexOf("password") != -1) {
					vc.passwordField.errored = true;
					vc.passwordField.setGradient(styles.inputFieldErrored);
				}
				var t = new UI.Toast();
				t.setText(""+error);
				t.show();
				if(vc.onErrorCallback) {
					user = {};
					user.gamername = gamername;
					
					NgLogD("error in LoginControllers#####################################" + error);
					NgLogD("user in LoginControllers#####################################" + user);
					NgLogD("user.gamername in LoginControllers#####################################" + user.gamername);
					
					//NgLogD("self.doneBootStrap in LoginControllers#####################################" + self.doneBootStrap);
					
					//UI.NavController.getInstance().clear();
					//self.removeBackground();
					//self.doneBootStrap = true;
					
					vc.onErrorCallback(error, user, vc.loginButton, vc.clearCtrl, vc.setKeyEmitterFlg, vc.destroySprites);
				}
			}
			else {
				
				//ログイン成功時は処理を分岐させる
				//初回ログインか否かここで判定
				NgLogD("login OK1###############################");
				NgLogD("vc###############################" + vc);
				
				user = session.authenticatedUser();
				
				if (vc.onCheckFirstLogin) {
				
					vc.onCheckFirstLogin(user, function(checkedStatus){
						if (checkedStatus) {
							NgLogD("checked status true#########################");
							
							//初回ログイン時処理
							
							NgLogD("first time log in##########################################");
							
							NgLogD("setKeyEmitterFlg to login notice#############################" + vc.setKeyEmitterFlg);
							
							NgLogD("destroySprites to login notice#############################" + vc.destroySprites);
							
							NgLogD("vc.onCompleteCallback#########################" + vc.onCompleteCallback);
							NgLogD("setKeyEmitterFlg to login notice2#############################");
							var LoginNoticeController = require('./LoginNoticeController').LoginNoticeController;
							NgLogD("setKeyEmitterFlg to login notice2.5#############################");
							
//							var controller3;
//							
//							var removeCtrl3 = function()
//							{
//								NgLogD("controller3###################################" + controller3);
//								controller3.removeFromParent();
//							}
							
							var controller3;
					
							var removeCtrl3 = function()
							{
								NgLogD("controller3###################################" + controller3);
								controller3.removeFromParent();
							}							
							var myView = new LoginNoticeController({
								styles: styles,
								theme: theme,
								user: user,
								onLoginSuccess: vc.onCompleteCallback,
								session: session,
								setKeyEmitterFlg: vc.setKeyEmitterFlg,
								removeCtrl3: removeCtrl3,
								destroySprites: vc.destroySprites
							});
							
							NgLogD("setKeyEmitterFlg to login notice3#############################");
//							var myView = new LoginNoticeController({
//								styles: styles,
//								theme: theme,
//								user: user,
//								onLoginSuccess: vc.onCompleteCallback,
//								session: session
//							});
							//UI.NavController.getInstance().forwardToView(myView.getMainContainer());
							controller3 = new UI.NavController({
								frame: UI.Window.getFrame()
							});
							controller3.forwardToView(myView.getMainContainer());
							UI.Window.document.addChild(controller3);
							//controller3.removeFromParent();	
							NgLogD("setKeyEmitterFlg to login notice4#############################");
							
							vc.removeCtrl2();
						}
						else {
							NgLogD("checked status false#########################");
							
							//初回でない場合もログイン時処理
							
							NgLogD("not first time log in##########################################");
							NgLogD("Successful login! ********************\n");
							
							NgLogD("setKeyEmitterFlg loginOK#############################" + vc.setKeyEmitterFlg);
							
		//					user = session.authenticatedUser();
							var loginSuccessfulToast = new UI.Toast();
							loginSuccessfulToast.setText("Welcome back "+user.gamertag+"!");
							loginSuccessfulToast.show();
							
							//ログイン成功時処理（onLoginSuccess）
							if(vc.onCompleteCallback) {
								vc.onCompleteCallback(session, vc.loginButton, vc.setKeyEmitterFlg, vc.destroySprites);
								vc.removeCtrl2();
							}
						}
					});
				}
				else
				{
					NgLogD("vc.onCheckFirstLogin(user) not checked############################################" + vc.onCheckFirstLogin(user));
				}
			}
		});
		
		NgLogD("Log in click done, pending results.\n");
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
