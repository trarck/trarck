var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;

var UIFx=require('./UIFx').UIFx;

var UIExtend=require('./UIExtend');

var Tip=require('./Tip').Tip;
var Overlay=require('./Overlay').Overlay;
//var Window=require('./Window').Window;
//var Loading=require('./Loading').Loading;

function gameInit () {
    var h = Core.Capabilities.getScreenWidth();
    var w = Core.Capabilities.getScreenHeight();

    //background
    var bg=new GL2.Sprite();
    bg.setImage('Content/blank1.png',[w,h],[0,0]);
    GL2.Root.addChild(bg);
    
    //back 
   getBtn("X",[w-64,10,64,64],function(){
        var LGL = require('../NGCore/Client/Core/LocalGameList').LocalGameList;
		LGL.runUpdatedGame('/Samples/Launcher');
   });
   //reload 
   getBtn("R",[w-140,10,64,64],function(){
        var LGL = require('../NGCore/Client/Core/LocalGameList').LocalGameList;
		LGL.runUpdatedGame('/Project/UI');
   });

   var body=UI.Window.getLayer(10);

   
//   var body=new UI.View({
//        frame:[0,0,w,h],
//        backgroundColor:'FF00'
//   });
//   UI.Window.document.addChild(body);

   

   //tip
   var icon={image:"./Content/no.png",frame:[10,0,64,100],imageGravity:[0,0.5]};
   // var bg={image:"Content/302.png",imageFit:3};
   var bg=null;

   var tip=new Tip([100,100,300,100],"opration success",icon,bg);

   body.addChild(tip);

   getBtn("tip",[160,10,64,64],function(){
        tip.show();
   });
   
   //var overlay=new Overlay({visible:false});

   var overlayBtn=new UI.Button({
		frame: [480,100,64,64],
		text: 'overlay',
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
		onClick: function  () {
            console.log("do click");
//            if(overlay.getVisible()){
//                overlay.hide();
//            }else {
//                overlay.show();
//            }
        }
	});
    UI.Window.getLayer(UI.Window.Layer.Overlay).addChild(overlayBtn);
    UI.Window.getLayer(UI.Window.Layer.Overlay).setTouchable(false);
//    getBtn('overlay',[380,10,64,64],function  () {
//        console.log("do click");
//        if(overlay.getVisible()){
//            overlay.hide();
//        }else {
//            overlay.show();
//        }
//    });
   //window
//   var win=new Window({
//        overlay:true,
//        frame:[100,100,300,100],
//        gradient:{
//            'gradient': ["FF50 0.0", "FF00 1.0"],
//            'outerLine': 'FFFF 5.0',
//            'corners': '15',
//            'insets': "{5,5,5,5}",
//            'outerShadow': 'FF00 5.0 {0,-2}',
//        }
//   });
//
//   getBtn("window",[320,10,64,64],function(){
//       if(win.getVisible()){
//            win.hide();
//       }else{
//            win.show();
//       }
//   });
//
//    var loading=new Loading({
//        frame:[null,null,64,64]
//    });
//    loading.show();
//    setTimeout(function(){
//        loading.destroy();
//    },10000);

//    var btn = new UI.Button({
//		frame: [w-220,10,64,64],
//		text: 'B',
//		textSize: 24,
//		textGravity: UI.ViewGeometry.Gravity.Center,
//		gradient: {
//			corners: '8 8 8 8',
//			outerLine: "00 1.5",
//			gradient: [ "FF9bd6f4 0.0", "FF0077BC 1.0" ]
//		},
//		highlightedGradient: {
//			corners: '8 8 8 8',
//			outerLine: "00 1.5",
//			gradient: [ "FF0077BC 0.0", "FF9bd6f4 1.0" ]
//		},
//		disabledGradient: {
//			corners: '0 8 8 8',
//			gradient: [ "FF55 0.0", "FF00 1.0"],
//		},
//		onClick: function(){
//          var LGL = require('../NGCore/Client/Core/LocalGameList').LocalGameList;
//		    LGL.runUpdatedGame('/Project/UI');
//       }
//	});
//	UI.Window.document.addChild(btn);    

//    var dlg=new UI.AlertDialog({
//        title:"this is a title",
//        text:"this is content"
//    });
//    dlg.setChoices(["Ok"]);
//    dlg.show();
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
	//UI.Window.document.addChild(btn);
    UI.Window.getLayer(0).addChild(btn);
    return btn;
}