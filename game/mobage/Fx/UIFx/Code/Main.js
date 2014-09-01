var Device = require('../../NGCore/Client/Device').Device;
var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;
var UI = require('../../NGCore/Client/UI').UI;
var LGL = require('../../NGCore/Client/Core/LocalGameList').LocalGameList;

var Fx=require('../../Lib/UIFx').UIFx,
    animate=Fx.animate.bind(Fx),
    stop=Fx.stop.bind(Fx);
Fx.Easing.parabola=function  (x,t,b,c,d) {
    return -c*(t/=d/2)*(t-2)+b;
}
Fx.Calc.parabola=function  (start,end,pos,fx) {
    console.log(fx.prop,start+(fx.options.maxY-start)*pos);
    return start+(fx.options.parabola-start)*pos;
}

function gameInit () {
    var w = Core.Capabilities.getScreenWidth();
    var h = Core.Capabilities.getScreenHeight();
   //background
   var background = new GL2.Sprite();
   background.setImage('./Content/blank1.png', [w, h], [0, 0]);
   GL2.Root.addChild(background);

   //UI的显示范围。
   var view=new UI.View({frame:[0,100,w,300]});
   UI.Window.document.addChild(view);

   var n1=new UI.Image({image:'./Content/301.png',frame:[100,200,64,64]});
   view.addChild(n1);
   

   var n2=new UI.Image({image:'./Content/301.png',frame:[200,400,64,64]});
   UI.Window.document.addChild(n2);
   //alpha
   var alpha0 = new Fx(n1,{duration:1000,easing:"jswing",complete:function  (ele) {
        console.log(ele.getAlpha());
   }},"alpha");
   var btnx=getBtn("alpha0",[100,10,80,64],function  () {
         alpha0.custom(1,0);
   });

   var alpha1 = new Fx(n1,{duration:1000,easing:"jswing"},"alpha");
   var btnx=getBtn("alpha1",[100,74,80,64],function  () {
         alpha1.custom(0,1);
   });

   //frame
   var framex = new Fx(n1,{duration:1000,easing:"jswing"},"x");
   var btnx=getBtn("framex",[180,10,80,64],function  () {
         framex.custom(100,200);
   });

   var framey = new Fx(n1,{duration:1000,easing:"jswing"},"y");
   var btnx=getBtn("framey",[180,74,80,64],function  () {
         framey.custom(200,300);
   });

   var framew = new Fx(n1,{duration:1000,easing:"jswing"},"width");
   var btnx=getBtn("framew",[260,10,80,64],function  () {
         framew.custom(100,200);
   });

   var frameh = new Fx(n1,{duration:1000,easing:"jswing"},"height");
   var btnx=getBtn("frameh",[260,74,80,64],function  () {
         frameh.custom(100,200);
   });

   var frame = new Fx(n1,{duration:1000,easing:"jswing"},"frame");
   var btnx=getBtn("frame",[100,134,80,64],function  () {
         frame.custom([100,200,134,64],[200,300,128,128]);
   });
   
   var btnx=getBtn("animate",[180,134,80,64],function  () {
        animate(n1,{frame:[[400,400,128,128]]},1000);
   });
   //抛物线
   var btnx=getBtn("parabola",[260,134,80,64],function  () {
        n1.setFrame(100,200,64,64);
        animate(n1,{x:10},200,'linear');
        animate(n1,{y:185},{duration:100,easing:"easeOutCirc",complete:function  () {
            animate(n1,{y:200},{duration:100,easing:"easeInCirc"});
        }});
        //animate(n1,{y:100},{duration:1000,easing:"parabola",parabola:150});
   });
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
	var back = new UI.Button();
	back.setNormalText('x');
	back.setTextSize(32);
	back.setTextGravity(UI.ViewGeometry.Gravity.Center);
	back.setFrame([10, 10, 64, 64]);
	back.setNormalGradient({
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		gradient: [ "FF9bd6f4 0.0", "FF0077BC 1.0" ]
	});
	back.setHighlightedGradient({
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		gradient: [ "FF0077BC 0.0", "FF9bd6f4 1.0" ]
	});
	back.onclick = function() {
		LGL.runUpdatedGame('/Samples/Launcher');
	};
	NGWindow.document.addChild(back);
}
function getBtn (text,frame,onClick) {
    var btn=new UI.Button();
    btn.setNormalText(text);
    btn.setFrame(frame);
    btn.setNormalGradient({
        corners: '8 8 8 8',
        outerLine: "00 1.5",
        gradient: [ "FF9bd6f4 0.0", "FF0077BC 1.0" ]
    });
    btn.onclick=onClick;
    NGWindow.document.addChild(btn);
}