var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;

function getScreenSize () {
    var w = Core.Capabilities.getScreenWidth();
    var h = Core.Capabilities.getScreenHeight();
    var size={};
    switch (Device.OrientationEmitter.getDeviceOrientation()) {
        case Device.OrientationEmitter.Orientation.LandscapeLeft:
            size.width=h;
            size.height=w;
            break;
        default:
            size.width=w;
            size.height=h;
            break;
    
    }
    return size;
}

function gameInit () {
    var w = getScreenSize().width;
    var h = getScreenSize().height;
   //background
   var background = new GL2.Sprite();
   background.setImage('./Content/blank1.png', [w, h], [0, 0]);
   GL2.Root.addChild(background);
   //loading
   var loading=new GL2.Sprite();
   var a=new GL2.Animation();
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[0/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[1/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[2/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[3/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[4/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[5/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[6/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[7/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[8/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[9/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[10/16,0,1/16,1]));
   a.pushFrame(new GL2.Animation.Frame("./Content/loading.png",100,[64,64],[0.5,0.5],[11/16,0,1/16,1]));
   loading.setAnimation(a).setPosition(100,100);
   GL2.Root.addChild(loading);


}
function main()
{
	var glView = new UI.GLView();
	glView.onload = function()
	{
       gameInit();
	};
	glView.setAttribute('frame', [0, 0, NGWindow.outerWidth, NGWindow.outerHeight]);
	glView.setAttribute('active', true);

    // Add a back button.
    getBtn('x',[10, 10, 64, 64],function() {
		var LGL = require('../NGCore/Client/Core/LocalGameList').LocalGameList;
		LGL.runUpdatedGame('/Samples/Launcher');
	});
}
function getBtn (text,frame,onClick) {

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
	UI.Window.document.addChild(btn);
    return btn;
}