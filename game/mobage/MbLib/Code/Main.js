var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;


var body;

var navController,winFrame;

function gameInit () {
    var h = Core.Capabilities.getScreenWidth();
    var w = Core.Capabilities.getScreenHeight();
    var frame=[0,0,w,h];
    winFrame=frame;
    //background
    var bg=new GL2.Sprite();
    bg.setImage('Content/blank1.png',[w,h],[0,0]);
    GL2.Root.addChild(bg);
    
    navController = new UI.NavController({
		frame: [0,0,w,100]
	});
    
    navController.setUseBackButton(false);
    UI.Window.document.addChild(navController);
    
    var MainPage= require('./Page/MainPage').MainPage;
    var UIPage= require('./Page/UIPage').UIPage;
    var GLUIPage= require('./Page/GLUIPage').GLUIPage;
    var EventPage= require('./Page/EventPage').EventPage;
    
    var rootPage=new MainPage({
        frame:frame,
        gradient: {
			'gradient': ["FFEF 0.0", "FFC0 1.0"],
		}
    });

    var uiPage=new UIPage({
        root:rootPage,
        navController:navController
    });
    
    var gluiPage=new GLUIPage({
        root:rootPage,
        navController:navController
    });
    var eventPage=new EventPage({
        frame:[0,0,w,100],
        root:rootPage,
        navController:navController
    });

    navController.forwardToView(rootPage);

    var testEvent= require('./Test/TestEvent').TestEvent;

    getBtn("UI",[112,80,64,64],function(){
        navController.forwardToView(uiPage);
        uiPage.createItems();
    },rootPage);
    getBtn("GLUI",[112,160,64,64],function(){
        navController.forwardToView(gluiPage);
        gluiPage.createItems();
    },rootPage);

//   
//   getBtn("UI",[32,80,64,64],function(){
//        navController.forwardToView(uiPage);
//    },rootPage);
//
//    getBtn("GLUI",[112,80,64,64],function(){
//        navController.forwardToView(gluiPage);
//    },rootPage);
//    
    getBtn("event",[192,80,64,64],function(){
        navController.forwardToView(eventPage);
        eventPage.createItems();
        testEvent.start();
    },rootPage);
//
//
//    //glui
//    getBtn("root",[w/2-32,10,64,64],function(){
//        navController.backToView(rootPage);
//    },gluiPage);
//
//    //glui content
//    this.createGLUI(gluiPage);
//
//    //event
//    getBtn("root",[w/2-32,10,64,64],function(){
//        navController.backToView(rootPage);
//    },eventPage);
//
//    //event content
}

function createUI (uiPage) {
    
}

function createGLUI (gluiPage) {
    getBtn("overlay",[32,80,64,64],function(){
        var GLOverlay=require('../MbLib/GLUI/Overlay').Overlay;
        var overlay=new GLOverlay({visible:false,renderTo:GL2.Root});

        if(overlay.getVisible()){
            overlay.hide();
        }else {
            overlay.show();
            setTimeout(function(){
                overlay.hide();
            },4000);
        }
    },gluiPage);
}



function testOverlay (frame) {
    var overlay=new Overlay({visible:false});
   
    getBtn('overlay',frame,function  () {
        
        if(overlay.getVisible()){
            overlay.hide();
            UI.Window.getLayer(0).addChild(this);
        }else {
            overlay.show();
            UI.Window.getLayer(UI.Window.Layer.Overlay).addChild(this);
        }
    });
}

function testTip (frame) {
    //tip
   var icon={image:"./Content/no.png",frame:[10,0,64,100],imageGravity:[0,0.5]};
   // var bg={image:"Content/302.png",imageFit:3};
   var bg=null;
   var tip=new Tip([100,100,300,100],"opration success",icon,bg);
   body.addChild(tip);

   getBtn("tip",frame,function(){
        tip.show();
   });
}
function testWindow (frame) {
   var win=new Window({
        overlay:true,
        frame:[100,100,300,100],
        gradient:{
            'gradient': ["FF50 0.0", "FF00 1.0"],
            'outerLine': 'FFFF 5.0',
            'corners': '15',
            'insets': "{5,5,5,5}",
            'outerShadow': 'FF00 5.0 {0,-2}',
        }
   });

   getBtn("window",frame,function(){
       if(win.getVisible()){
            win.hide();
       }else{
            win.show();
       }
   });
}
function testLoading (frame) {
    getBtn('loading',frame,function  () {
         var loading=new Loading({
            frame:[null,null,64,64]
        });
        loading.show();
        setTimeout(function(){
            loading.destroy();
        },5000);
    });
}

function testNgUIDialog (frame) {
    getBtn('loading',frame,function  () {
       var dlg=new UI.AlertDialog({
            title:"this is a title",
            text:"this is content"
        });
        dlg.setChoices(["Ok"]);
        dlg.show();
    });
}
function testGLOverlay (frame) {
    var overlay=new GLOverlay({visible:false});
   
    getBtn('gloverlay',frame,function  () {
        if(overlay.getVisible()){
            overlay.hide();
            UI.Window.getLayer(0).addChild(this);
        }else {
            overlay.show();
            UI.Window.getLayer(UI.Window.Layer.Overlay).addChild(this);
        }
    });
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