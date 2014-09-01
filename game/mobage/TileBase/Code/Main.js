//require in the main is global require. becase manifest.json in the code section include Main.js.that file define global variable
//other file do not require the below element
var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;

function gameInit () {
    var h = Core.Capabilities.getScreenWidth();
    var w = Core.Capabilities.getScreenHeight();
    
}

function main()
{
	var glView = new UI.GLView();
	glView.onload = function()
	{
       console.log("before:","sw="+ Core.Capabilities.getScreenWidth(),"sh="+ Core.Capabilities.getScreenHeight(),",",UI.Window.getFrame().array().slice());
       //设置为横版
       Device.OrientationEmitter.setInterfaceOrientation(Device.OrientationEmitter.Orientation.LandscapeLeft, false);
       console.log("after:","sw="+ Core.Capabilities.getScreenWidth(),"sh="+ Core.Capabilities.getScreenHeight(),",",UI.Window.getFrame().array().slice());
       gameInit();
	};
	glView.setAttribute('frame', [0, 0, NGWindow.outerWidth, NGWindow.outerHeight]);
	glView.setAttribute('active', true);

}

function getBtn (text,frame,onClick,parent) {
    var btn = new UI.Button({
		frame: frame,
		text: text,
		textSize: 24,
		textGravity: UI.ViewGeometry.Gravity.Center,
		gradient: {
			corners: '8 8 8 8',
			outerLine: "00 1.5",
			gradient: [ "FF9bd6f4 0.0", "FF0077BC 1.0" ]
		},
		highlightedGradient: {
			corners: '8 8 8 8',
			outerLine: "00 1.5",
			gradient: [ "FF0077BC 0.0", "FF9bd6f4 1.0" ]
		},
		disabledGradient: {
			corners: '0 8 8 8',
			gradient: [ "FF55 0.0", "FF00 1.0"],
		},
		onClick: onClick
	});
	//UI.Window.document.addChild(btn);
    parent=parent||UI.Window.document;
    parent.addChild(btn);
    return btn;
}