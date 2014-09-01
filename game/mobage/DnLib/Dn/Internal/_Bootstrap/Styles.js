//////////////////////////////////////////////////////////////////////////////
/**
 *  @date:      2010-11-09
 *  @file:      Styles.js
 *  @author:    Frederic Barthelemy
 *  Website:    http://www.ngmoco.com/
 *  Copyright:  2010, by ngmoco:)
 *              Unauthorized redistribution of source code is
 *              strictly prohibited. Violators will be prosecuted.
 *
 *  @brief:
 */
//////////////////////////////////////////////////////////////////////////////
exports.Styles = function() {
	this.logoBackGround = {
		image: null,
		backgroundColor: "00000000"
	};
	this.splashBackGround = {
		image: null,
		backgroundColor: "00000000"
	};

	this.signUpBackground = {
		image: null,
		backgroundColor: "00000000"
	};
	this.signUpBottomPlank = {
		image: null,
		backgroundColor: "00000000"
	};
	this.placeholderAvatarBox = {
		image: null
	};

	this.defaultButtonStyle = {
		normalTextSize: 14,
		normalTextStyle: 0x01 /*from Fonts.js 'Bold': 0x01,*/
	};
	this.background = {
		innerShadow:"FF3DA7FF 200.0 {0.0,0.0}",
		gradient:[
			"FFC0DCFF 0.000",
			"FFC0DCFF 1.000"
		]
	};
	this.loginBox = {
		corners: '0 0 0 4',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"0000FFEC 0.0",
			"0000FFCF 1.0"
		]
	};
	this.loginBoxDown = {
		corners: '0 0 0 4',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"0000FFCF 0.0",
			"0000FFEC 1.0"
		]
	};
	this.grayButton = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FFfcf6cf 0.0",
			"FFd3b700 1.0"
		]
	};
	this.grayButtonDown = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FF9f8a00 0.0",
			"FFbab06a 1.0"
		]
	};
	this.yellowButton = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FFfcf6cf 0.0",
			"FFd3b700 1.0"
		]
	};
	this.yellowButtonDown = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FF9f8a00 0.0",
			"FFbab06a 1.0"
		]
	};
	var yellowButton = function(){};
	yellowButton.prototype = {
		normalGradient: this.yellowButton,
		highlightedGradient: this.yellowButtonDown,
		normalTextColor: "FF613500"
	};

	this.grayButton = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FFe4e4e4 0.0",
			"FF888888 1.0"
		]
	};
	this.grayButtonDown = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FF888888 0.0",
			"FFe4e4e4 1.0"
		]
	};
	var grayButton = function(){};
	grayButton.prototype = {
		normalGradient: this.grayButton,
		highlightedGradient: this.grayButtonDown,
		normalTextColor: "FF613500"
	};

	this.blueButton = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FF9bd6f4 0.0",
			"FF0077BC 1.0"
		]
	};
	this.blueButtonDown = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FF1a6395 0.0",
			"FF13476c 1.0"
		]
	};
	var blueButton = function(){};
	blueButton.prototype = {
		normalGradient: this.blueButton,
		highlightedGradient: this.blueButtonDown,
		normalTextColor: "0000"
	};

	this.lightblueButton = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FF9bd6f4 0.0",
			"FF458dc3 1.0"
		]
	};
	this.lightblueButtonSelected = {
		corners: '8 8 8 8',
		outerLine: "00 2.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FF316b90 0.0",
			"FF508db0 1.0"
		]
	};
	this.lightblueButtonDown = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FF316b90 0.0",
			"FF508db0 1.0"
		]
	};
	var lightblueButton = function(){};
	lightblueButton.prototype = {
		normalGradient: this.lightblueButton,
		highlightedGradient: this.lightblueButtonDown,
		selectedGradient: this.lightblueButtonSelected,
		normalTextColor: "FF1C326A"
	};

	this.lightpinkButton = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FFf8ced3 0.0",
			"FFc84f75 1.0"
		]
	};
	this.lightpinkButtonDown = {
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FFb86b74 0.0",
			"FF993956 1.0"
		]
	};
	this.lightpinkButtonSelected = {
		corners: '8 8 8 8',
		outerLine: "00 2.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FFb86b74 0.0",
			"FF993956 1.0"
		]
	};
	var lightpinkButton = function(){};
	lightpinkButton.prototype = {
		normalGradient: this.lightpinkButton,
		highlightedGradient: this.lightpinkButtonDown,
		selectedGradient: this.lightpinkButtonSelected,
		normalTextColor: "FF4C1822"
	};

	this.whiteButton = {
		corners: '4 4 4 4',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FFE3E3E3 0.0",
			"FFFFFFFF 1.0"
		]
	};
	this.whiteButtonDown = {
		corners: '4 4 4 4',
		outerLine: "00 1.5",
		/*innerLine: "99FF 1.5",*/
		gradient: [
			"FFFFFFFF 0.0",
			"FFE3E3E3 1.0"
		]
	};
	// This style is basically transparent.  It is needed for the two terms
	// buttons to show up on Android
	this.termsLabelButton = {
		gradient: [
			"0000 0.0",
			"0000 1.0"
		]
	};
	this.transparent = {
		gradient: [
			"0000 0.0",
			"0000 1.0"
		]
	};
	this.basicBox = {
		corners: "4",
		outerLine: "00 1.5",
		innerLine: "99FF 1.5",
		gradient: [
			"FF00B6EC 0.0",
			"FF0077CF 1.0"
		]
	};
	this.basicBoxDown = {
		corners: "4",
		outerLine: "00 1.5",
		innerLine: "55FF 1.5",
		gradient: [
			"FF0077CF 0.0",
			"FF00B6EC 1.0"
		]
	};
	this.label = {
		gradient: ['FFFF 0.0', 'FFFF 1.0'],
		outerLine: "FFF9 1.0"
	};
	this.inputLabel = {
		font: {'font-face':['Droid Sans'], 'font-size':12.0, 'bold':false},
		textColor: "FFFFFFFF",
		backgroundColor: "0000"
	};
	this.inputField = {
		outerLine: "00 1.5",
		corners: "4 4 4 4",
		gradient: [
			"FFF0 0.0",
			"FFFF 1.0"
		]
	};
	this.inputFieldSelected = {
		outerLine: "FF0066CC 2.0",
		corners: "4 4 4 4",
		gradient: [
			"FFF0 0.0",
			"FFFF 1.0"
		]
	};
	this.inputFieldErrored = {
		outerLine: "FFFF0000 4.0",
		corners: "4 4 4 4",
		gradient: [
			"FFFFFFFF 0.0",
			"FFFFA2A2 1.0"
		]
	};
	this.inputFieldDisabled = {
		outerLine: "FF22 2.0",
		corners: "4 4 4 4",
		gradient: [
			"AF60 0.0",
			"AFA0 1.0"
		]
	};
	this.inputFieldGradients = {
		gradient: this.inputField,
		selectedGradient: this.inputFieldSelected,
		disabledGradient: this.inputFieldDisabled
	};
	this.adBorder = {
		corners: "9.0"
	};
	this.cellRow = {
		insets: '4',
		gradient: ['FFF0 0.0', 'FF80 1.0']
	};

	var Subtitle = function(){};
	Subtitle.prototype = {
		backgroundColor: "0000",
		textColor: "FFFF",
		font: { "font-size": 24.0 }
	};

	var Subtitle2 = function(){};
	Subtitle2.prototype = {
		backgroundColor: "00EEE285",
		//textColor: "FFEEE285",
		textColor: "FFFFFFFF",
		font: { "font-size": 14.0 }
	};
//	this.labelOffset= {
//			V: 0,
//			H: 0
//	};
	
	this.labelOffsetV = 0;
	this.labelOffsetH = 0;
	
	this.signUpSubtitle = new Subtitle();
	this.signUpSubtitle2 = new Subtitle2();
	this.loginSubtitle = new Subtitle();
	this.forgotPasswordSubtitle = new Subtitle();

	this.signUpButton = new yellowButton();
	this.notagreeButton = new grayButton();
	this.playButton = new yellowButton();
	this.loginButton = new yellowButton();
	this.sendButton = new yellowButton();
	this.forgotPasswordButton = new grayButton();
	this.goLoginButton = new blueButton();
	this.boyButton = new lightblueButton();
	this.girlButton = new lightpinkButton();

	this.alreadyHaveAccount = {
		backgroundColor: "0000",
		textColor: "FFFFFFFF",
		font: { "font-size": 11.0 }
	};
	this.alreadyHaveAccountDirection= {
		backgroundColor: "0000",
		textColor: "FFFFFFFF",
		font: { "font-size": 8.0 }
	};
	

};

exports.Styles.prototype.getAdjustedRect = function(srcSizeArray, tgtRect) {
	var rect = tgtRect.copy();
	var h2w = srcSizeArray[0] / srcSizeArray[1];
	var adjustedHeight = rect.w / h2w;
	var marginHeight = rect.h - adjustedHeight;
	var adjustedRect = rect;
	if (marginHeight > 0) {
		rect.sliceVertical(marginHeight / 2);
		adjustedRect = rect.sliceVertical(adjustedHeight);
	}
	return adjustedRect;
};
