//////////////////////////////////////////////////////////////////////////////
/**
 *  @date:      2010-11-09
 *  @file:      RegViewController.js
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
var Core  = require('../../../../NGCore/Client/Core').Core;
var Class = require('../../../../NGCore/Client/Core/Class').Class;
var UI = require('../../../../NGCore/Client/UI').UI;
var RegistrationRecord = require('../../../../NGCore/Client/Plus/RegistrationRecord').RegistrationRecord;
var LoginViewController = require('./LoginControllers').LoginViewController;
var Scale = require('./Scaler').Scale;

//////////////////////////////////////////////////////////////////////////////////////////////////
function strFromRect(rect) {
	return "["+rect.x+","+rect.y+","+rect.w+","+rect.h+"]";
}
function RectPrint(rect) {
	NgLogD(strFromRect(rect)+"\n");
}


//var KeyListener = Core.MessageListener.singleton (
//{
//    initialize: function()
//    {
//		NgLogD("key emitter initialized1###############################");
//        Device.KeyEmitter.addListener(this, KeyListener.onUpdate);
//		NgLogD("key emitter initialized2###############################");
//    },
//
//    onUpdate: function(keyEvent)
//    {
//		NgLogD("key emitter invoked1###############################");
//		
//        if (keyEvent.code === Device.KeyEmitter.Keycode.back)
//        {
//			NgLogD("key emitter invoked2###############################");
//			
//            if(Core.Capabilities.getBootGame() === Core.Capabilities.getGame())
//            {
//                NgLogD("Called on standalone ... Exiting ");
//                NgPushCommand2(NgEntityTypes.App, NgApplicationCommands.BackPress); 
//            }
//            else
//            {
//	            var gLauncherUrl = ""; //<- Must be empty string
//                NgLogD("NOTE ::: Launcher URL is: " + gLauncherUrl);
//                var alertDialog = new UI.AlertDialog();
//               	alertDialog.setTitle("Exiting Game..");
//		        alertDialog.setText("Returning to launcher..");
//	        	alertDialog.onchoice = function(event) {};
//	        	alertDialog.show();
//                gLauncherUrl = Core.Capabilities.getStartingServer() + "/" + Core.Capabilities.getBootGame();
//                Core.LocalGameList.runGame(gLauncherUrl);
//            }
//            //NgLogD("boot: back button pressed");
//            //Core.LocalGameList.runUpdatedGame(gLauncherUrl);
//            return true;
//        }
//    }
//});


//////////////////////////////////////////////////////////////////////////////////////////////////
// View Controller Definition
exports.RegistrationViewController = UI.View.subclass({
//exports.RegistrationViewController = UI.View.subclass({
	classname:"RegistrationViewController",
	//analyticsName: "reg1",
	//initialize:function(opt) {
	initialize:function($super, opt) {
		
		$super(opt);
		
		NgLogD("exports.RegistrationViewController started#################################");
		//KeyListener.instantiate();
		
		var self = this;
		this.opt = opt;
		this.styles = opt.theme.styles;
		this.onCompleteCallback = opt.onRegistrationSuccess;
		this.clearCtrl = opt.clearCtrl;
		this.setKeyEmitterFlg = opt.setKeyEmitterFlg;
		this.destroySprites = opt.destroySprites;
		this.removeCtrl = opt.removeCtrl;
		
		NgLogD("removeCtrl################################" + opt.removeCtrl);
		
		NgLogD("opt.clearCtrl RegViewController################################" + opt.clearCtrl);
		
		NgLogD("opt.setKeyEmitterFlg RegViewController################################" + opt.setKeyEmitterFlg);
		
		NgLogD("opt.destroySprites RegViewController################################" + opt.destroySprites);
		
		this.buildUI();

		this.signUpButton.onclick = function(){
			self.signupButton();
		};

//		var clearCtrl = function()
//		{
//			NgLogD("self###################" + self);
//			NgLogD("this###################" + this);
//			NgLogD("self.getChildren###################" + self.getChildren);
//			if (self.getChildren) {
//				self.getChildren().forEach(function(child) {
//					//destroy.call(child, depth + 1);
//					//if (child.destroy) { child.destroy(); }
//					
//					NgLogD("child###################" + child);
//				});
//			}
//
////			var removed = back.call(this, fromButton);
////			if (!removed) { return null; }
////			var destroy = function(depth) {
////				if (this.getChildren) {
////					this.getChildren().forEach(function(child) {
////						destroy.call(child, depth + 1);
////						if (child.destroy) { child.destroy(); }
////					});
////				}
////			};
////			destroy.call(removed, 0);
//	
//		}

		var controller;

		var removeCtrl2 = function()
		{
			controller.removeFromParent();
		}
		
		this.loginButton.onclick = function() {
			NgLogD("Log in Button Clicked\n");
			var vc = new LoginViewController({
				onLoginSuccess: opt.onLoginSuccess, onLoginError: opt.onLoginError, clearCtrl: opt.clearCtrl, 
				onCheckFirstLogin: opt.onCheckFirstLogin, theme: opt.theme, setKeyEmitterFlg: opt.setKeyEmitterFlg, destroySprites: opt.destroySprites,
				removeCtrl2: removeCtrl2
			});
			NgLogD("opt.onCheckFirstLogin##########################" + opt.onCheckFirstLogin);
			
			//UI.NavController.getInstance().forwardToView(vc.getMainContainer());
			
			controller = new UI.NavController({
				frame: UI.Window.getFrame()
			});
			controller.forwardToView(vc.getMainContainer());
			UI.Window.document.addChild(controller);
			
			NgLogD("removeCtrl0###################");
			opt.removeCtrl();
			NgLogD("removeCtrl1###################");

//			NgLogD("self###################" + self);
//			NgLogD("this###################" + this);
//			//self.removeFromParent();	
//			//self.destroy();
//			
//			NgLogD("this###################" + self.getChildren);
//
//			if (self.getChildren) {
//				self.getChildren().forEach(function(child) {
//					//destroy.call(child, depth + 1);
//					//if (child.destroy) { child.destroy(); }
//					
//					NgLogD("child###################" + child);
//				});
//			}
//			NgLogD("before clearCtrl###################");
//			clearCtrl();
//			NgLogD("after clearCtrl###################");
		};
		


		this.keysToFields = {gamername:this.gamernameField,password:this.passwordField,email:this.emailField};
	},
//	clearCtrl:function()
//	{
////		NgLogD("self###################" + self);
////		NgLogD("this###################" + this);
//		//self.removeFromParent();	
//		//self.destroy();
//		
//		NgLogD("clearCtrl###################");
//		
//		NgLogD("this###################" + this);
//		
////		NgLogD("this###################" + self.getChildren);
////
////		if (this.getChildren) {
////			this.getChildren().forEach(function(child) {
////				//destroy.call(child, depth + 1);
////				//if (child.destroy) { child.destroy(); }
////				
////				NgLogD("child###################" + child);
////			});
////		}		
//	},
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
		var emailRect = fieldsRect.sliceVertical(fieldHeight);
//		fieldsRect.inset(fieldSpacer,0,0,0);
		
		var spaceRect = fieldsRect.sliceVertical(labelHeight);
		
		var signUpButtonRect = fieldsRect.sliceVertical(fieldHeight + fieldSpacer);
		signUpButtonRect.inset(0,15,0,15);

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
		this.gamernameField.setPlaceholder('4 to 15 letters');
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
		this.passwordField.setEnterKeyType(UI.EditText.EnterKeyTypes.Next);
		//this.passwordField.setText(' 4 to 15 characters');
		this.passwordField.setPlaceholder('4 to 25 letters');
		passwordRect.inset(0,15,0,15);
		this.passwordField.setFrame(passwordRect.array());
		this.baseView.addChild(this.passwordField);

		NgLogD("|| Email Label ||\n");
		curLabelFrame = emailLabelRect;
		curLabelFrame.inset(0,0,0,16);
		curLabel = new UI.Label();
		curLabel.setTextGravity(UI.ViewGeometry.Gravity.Left);
		curLabel.setText('Email');
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
		this.emailField.setEnterKeyType(UI.EditText.EnterKeyTypes.Done);
		//this.emailField.setText(' valid email address');
		this.emailField.setPlaceholder('must be a valid email address');
		emailRect.inset(0,15,0,15);
		this.emailField.setFrame(emailRect.array());
		this.baseView.addChild(this.emailField);

		//今後画像表示による規約確認仕様に戻す場合はここを有効にする
//		NgLogD("|| Terms Label ||\n");
//		this.termsLabel = new UI.Label();
//		this.termsLabel.setTextGravity(UI.ViewGeometry.Gravity.Center);
//		this.termsLabel.setFrame(disclaimerRect.array());
//		this.termsLabel.setText('By tapping "sign up!" below, you agree to our');
//		this.termsLabel.setTextColor("FFFFFFFF");
//		this.termsLabel.setBackgroundColor("0000");
//		// TODO - set font style not yet supported, wait for jyopp
////		this.termsLabel.setFont({'font-face':['Droid Sans'], 'font-size':12.0, 'bold':false});
//		this.termsLabel.setTextSize(Scale.ios.textSize(11.0));
//		this.baseView.addChild(this.termsLabel);
//
//
//		this.termsLabel.termsButton = new UI.Button();
//		this.termsLabel.termsButton.analyticsName = "tclnk";
//		this.termsLabel.termsButton.setNormalText("Terms of Service");
//		this.termsLabel.termsButton.setNormalTextColor("FFFFFFFF");
//		this.termsLabel.termsButton.setTextGravity(UI.ViewGeometry.Gravity.Center);
//		this.termsLabel.termsButton.setNormalGradient(styles.termsLabelButton);
////		this.termsLabel.termsButton.controller = this;
//		this.termsLabel.termsButton.analyticsName = "reg1.tclnk";
//		this.termsLabel.termsButton.belongsToPlus = true;
//
//		var termsButtonRect = this.termsLabel.getFrame();
//		termsButtonRect[0]-=10;
//		termsButtonRect[1]+=Scale.ios.height(15);
//		termsButtonRect[2]=Scale.ios.width(150);
//		// TODO - set font style not yet supported, wait for jyopp
////		this.termsLabel.termsButton.setFont({'font-face':['Droid Sans'], 'font-size':10.0, 'bold':false});
//		this.termsLabel.termsButton.setTextSize(Scale.ios.textSize(10.0));
//		this.termsLabel.termsButton.analyticsName = "tclnk";
//		this.termsLabel.termsButton.setFrame(termsButtonRect);
//		this.baseView.addChild(this.termsLabel.termsButton);
//
//		this.termsLabel.and = new UI.Label();
//		this.termsLabel.and.setBackgroundColor("00000000");
//		this.termsLabel.and.setText('and');
//		this.termsLabel.and.setTextColor("FFFFFFFF");
//		this.termsLabel.and.setTextGravity(UI.ViewGeometry.Gravity.Center);
//		// TODO - set font style not yet supported, wait for jyopp
////		this.termsLabel.and.setFont({'font-face':['Droid Sans'], 'font-size':12.0, 'bold':false});
//		this.termsLabel.and.setTextSize(Scale.ios.textSize(12.0));
//		termsButtonRect[0]+=Scale.ios.width(130);
//		termsButtonRect[2]=Scale.ios.width(50);
//		this.termsLabel.and.setFrame(termsButtonRect);
//		this.baseView.addChild(this.termsLabel.and);
//
//		this.termsLabel.privacyButton = new UI.Button();
//		this.termsLabel.privacyButton.analyticsName = "pplnk";
//		this.termsLabel.privacyButton.setNormalText("Privacy Policy");
//		this.termsLabel.privacyButton.setNormalTextColor("FFFFFFFF");
//		this.termsLabel.privacyButton.setTextGravity(UI.ViewGeometry.Gravity.Center);
//		this.termsLabel.privacyButton.setNormalGradient(styles.termsLabelButton);
////		this.termsLabel.privacyButton.controller = this;
//		this.termsLabel.privacyButton.analyticsName = "reg1.pplnk";
//		this.termsLabel.privacyButton.belongsToPlus = true;
//
//		termsButtonRect[0]+=Scale.ios.width(25);
//		termsButtonRect[2]=Scale.ios.width(150);
//		// TODO - set font style not yet supported, wait for jyopp
////		this.termsLabel.privacyButton.setFont({'font-face':['Droid Sans'], 'font-size':10.0, 'bold':false});
//		this.termsLabel.privacyButton.setTextSize(Scale.ios.textSize(10.0));
//		this.termsLabel.privacyButton.setFrame(termsButtonRect);
//		this.baseView.addChild(this.termsLabel.privacyButton);

		NgLogD("|| Sign Me Up! Button||\n");
		this.signUpButton = new UI.Button(styles.defaultButtonStyle);
		if (styles.signUpButton.normalImage)  {
			this.signUpButton.setNormalImage(styles.signUpButton.normalImage);
			this.signUpButton.setHighlightedImage(styles.signUpButton.highlightedImage);
			this.signUpButton.setFrame(styles.getAdjustedRect(styles.signUpButton.imageSize, signUpButtonRect).array());
			this.signUpButton.setImageGravity([0.5,0.0]);
			this.signUpButton.setImageFit(UI.FitMode.Stretch);
		} else {
			this.signUpButton.setNormalGradient(styles.signUpButton.normalGradient);
			this.signUpButton.setHighlightedGradient(styles.signUpButton.highlightedGradient);
			this.signUpButton.setNormalText('sign up!');
			this.signUpButton.setNormalTextColor(styles.signUpButton.normalTextColor);
			this.signUpButton.setFrame(signUpButtonRect.array());
		}
//		this.signUpButton.controller = this;
		this.signUpButton.analyticsName = "reg1.sgnpbtn";
		this.signUpButton.belongsToPlus = true;
		this.baseView.addChild(this.signUpButton);

		NgLogD("|| Wood Fence ||\n");
		var fenceRect = mainRect.sliceVertical(-Math.round(100*Scale.screenWidth/480));
		fenceRect.w = Scale.screenWidth;
		fenceRect.x = 0;
		if (styles.signUpBottomPlank.image) {
			this.fence = new UI.Image();
			this.fence.setImage(styles.signUpBottomPlank.image);
			this.fence.setBackgroundColor(styles.signUpBottomPlank.backgroundColor);
			this.fence.setFrame(styles.getAdjustedRect(styles.signUpBottomPlank.imageSize, fenceRect).array());
			this.fence.setImageGravity([0.5,0.0]);
			this.fence.setImageFit(UI.FitMode.Stretch);
			this.baseView.addChild(this.fence);
		}

		NgLogD("|| Already Have Account Label ||\n");
		this.alreadyHaveAccount = new UI.Label();
		var alreadyHaveAccountLabelRect = fenceRect.sliceHorizontal(Scale.ios.width(220));
		alreadyHaveAccountLabelRect.inset(0,0,0,Scale.ios.width(20));
		alreadyHaveAccountLabelRect.y -= 10;
		alreadyHaveAccountLabelRect.x -= 5;
		alreadyHaveAccountLabelRect.w += 8;
		this.alreadyHaveAccount.setFrame(alreadyHaveAccountLabelRect.array());
		this.alreadyHaveAccount.setTextGravity(UI.ViewGeometry.Gravity.Left);
		this.alreadyHaveAccount.setText('Already have a plus+ account?');
		this.alreadyHaveAccount.setBackgroundColor(styles.alreadyHaveAccount.backgroundColor);
		this.alreadyHaveAccount.setTextColor(styles.alreadyHaveAccount.textColor);
//		this.alreadyHaveAccount.setFont({'font-face':['Droid Sans'], 'font-size':13.0, 'bold':true});
		this.alreadyHaveAccount.setTextSize(Scale.ios.textSize(styles.alreadyHaveAccount.font["font-size"]));
		
		NgLogD("alreadyHaveAccount.setTextSize###############################" + styles.alreadyHaveAccount.font["font-size"])
		
		this.baseView.addChild(this.alreadyHaveAccount);

		NgLogD("|| Already Have Account, sublabel ||\n");
		var alreadyHaveAccountLabelRect2 = alreadyHaveAccountLabelRect.copy();
		alreadyHaveAccountLabelRect2.y+=20;
		this.alreadyHaveAccountDirections = new UI.Label();
		this.alreadyHaveAccountDirections.setFrame(alreadyHaveAccountLabelRect2.array());
		this.alreadyHaveAccountDirections.setTextGravity(UI.ViewGeometry.Gravity.Right);
		this.alreadyHaveAccountDirections.setText('Use your plus+ gamername and password.');
		this.alreadyHaveAccountDirections.setBackgroundColor(styles.alreadyHaveAccountDirection.backgroundColor);
		this.alreadyHaveAccountDirections.setTextColor(styles.alreadyHaveAccountDirection.textColor);
//		this.alreadyHaveAccountDirections.setFont({'font-face':['Droid Sans'], 'font-size':10.0, 'bold':false});
		this.alreadyHaveAccountDirections.setTextSize(Scale.ios.textSize(styles.alreadyHaveAccountDirection.font["font-size"]));
		
		NgLogD("alreadyHaveAccountDirections.setTextSize##########################" + styles.alreadyHaveAccountDirection.font["font-size"])
		
		this.baseView.addChild(this.alreadyHaveAccountDirections);

		NgLogD("|| Login Button ||\n");
		this.loginButton = new UI.Button(styles.defaultButtonStyle);
		this.loginButton.analyticsName = "lgnbtn";
		if (styles.goLoginButton.normalImage)  {
			fenceRect.inset(12,15,12,Scale.ios.width(10));
			this.loginButton.setNormalImage(styles.goLoginButton.normalImage);
			this.loginButton.setHighlightedImage(styles.goLoginButton.highlightedImage);
			this.loginButton.setFrame(styles.getAdjustedRect(styles.goLoginButton.imageSize, fenceRect).array());
			this.loginButton.setImageGravity([0.5,0.0]);
			this.loginButton.setImageFit(UI.FitMode.Stretch);
		} else {
			this.loginButton.setNormalGradient(styles.goLoginButton.normalGradient);
			this.loginButton.setHighlightedGradient(styles.goLoginButton.highlightedGradient);
			this.loginButton.setNormalText('log in');
			fenceRect.inset(16,Scale.ios.width(20),8,Scale.ios.width(10));
			this.loginButton.setFrame(fenceRect.array());
		}
		this.loginButton.analyticsName = "reg1.lgnbtn";
		this.loginButton.belongsToPlus = true;
		this.baseView.addChild(this.loginButton);
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
	signupButton:function(){
		NgLogD("Sign Up Button Clicked\n");

		var styles = this.styles;
		this.rr = new RegistrationRecord();
		this.rr.gamername = this.gamernameField.getText();
		this.rr.password = this.passwordField.getText();
		this.rr.email = this.emailField.getText();

		var vc = this;
		var f = function(errors){
			
			NgLogD("registration error ###################################");
			
			vc.progressDialog.hide();
			
			var myErrorList = new Array();
			
			if(errors && errors.length) {
				NgLogD("Errors with basic information: "+JSON.stringify(errors));
				for(var i in errors ) {
					if(errors.hasOwnProperty(i)){
						var e = errors[i];
						if (e.field && vc.keysToFields[e.field]) {
							vc.keysToFields[e.field].errored = true;
							vc.keysToFields[e.field].setGradient(styles.inputFieldErrored);
							NgLogD("Set Style Successfully" + e.field);
						}
						
						//NgLogD("toast error show ###################################");

//						var t = new UI.Toast();
//						t.setText(""+e);
//						t.show();
						
						//エラーリストを作成する（重複メッセージを省く）
						var checkFlg = 0;
						for(var idx in myErrorList)
						{
//							NgLogD("idx ###################################" + idx);
//							NgLogD("myErrorList[idx] ###################################" + myErrorList[idx]);
							//NgLogD("e ###################################" + e);
//							NgLogD("###" + myErrorList[idx]);
//							NgLogD("###" + e);

							NgLogD(String(myErrorList[idx]));
							NgLogD(String(e));
							
							NgLogD("comp###################" + (myErrorList[idx] == e));
							
							if(String(myErrorList[idx]) == String(e))
							{
								NgLogD("same message ###################################");
								checkFlg = 1;
								break;
							}
							else
							{
								NgLogD("not same message ###################################");
							}
						}
						
						if (checkFlg == 0) {
							myErrorList.push(e);
						}
					}
				}
				
				for(var idx in myErrorList)
				{
					var t = new UI.Toast();
					t.setText(""+myErrorList[idx]);
					t.show();
				}
				
				NgLogD("registration error2 ###################################");
			}
			else {
				NgLogD("No Errors with basic information");
				vc.moveToInfoScreen(vc.signUpButton);
				
				NgLogD("registration no error ###################################");
			}
		};
		this.clearErrors();

		if(!this.progressDialog) {
			this.progressDialog = new UI.ProgressDialog();
			this.progressDialog.setText("Verifying");
		}
		this.progressDialog.show();

		this.rr.testBasicInformation(f);
	},
	moveToInfoScreen:function(fromButton){
		var opt = this.opt;
		var RegistrationInfoViewController = require('./RegInfoViewController').RegistrationInfoViewController;
		
		NgLogD("opt.setKeyEmitterFlg moveToInfoScreen###################" + this.setKeyEmitterFlg);
		NgLogD("opt.destroySprites moveToInfoScreen###################" + this.destroySprites);
		
		var removeRegView = function()
		{
			controller2.removeFromParent();
		}
		
		var rs2 = new RegistrationInfoViewController({
			registrationRecord: this.rr,
			onRegistrationSuccess: this.onCompleteCallback,
			onLoginSuccess: opt.onLoginSuccess,
			onLoginError: opt.onLoginError,
			onCheckFirstLogin: opt.onCheckFirstLogin,
			theme: opt.theme,
			setKeyEmitterFlg: this.setKeyEmitterFlg,
			removeRegView: removeRegView,
			destroySprites: this.destroySprites
		});
		//UI.NavController.getInstance().clear();
		//UI.NavController.getInstance().forwardToView(rs2.getMainContainer(), fromButton);
		controller2 = new UI.NavController({
			frame: UI.Window.getFrame()
		});
		controller2.forwardToView(rs2.getMainContainer());
		UI.Window.document.addChild(controller2);
		
		opt.removeCtrl();
	},
	moveToPrivacyPolicy:function(fromButton){
		var pv = new PageView(this.opt.theme.html.privacy);
		UI.NavController.getInstance().forwardToView(pv.getMainContainer(), fromButton);
	},
	moveToTermsAndConditions:function(fromButton){
		var pv = new PageView(this.opt.theme.html.terms);
		UI.NavController.getInstance().forwardToView(pv.getMainContainer(), fromButton);
	}
});