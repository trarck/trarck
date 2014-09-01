var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;

var GLFx=require('../Lib/GLFx').GLFx;
var UIFx=require('../Lib/UIFx').UIFx;

function main()
{
	var glView = new UI.GLView();

	glView.onload = function()
	{
        var w = Core.Capabilities.getScreenWidth();
        var h = Core.Capabilities.getScreenHeight();
       //background
       var background = new GL2.Sprite();
       background.setImage('./Content/ground.png', [w, h], [0, 0]);
       //背景可以使动画时，没有影子。
       GL2.Root.addChild(background);

        var root=new GL2.Node();
        root.setPosition(0,100);
        GL2.Root.addChild(root);
        
        //GL Fx
        var g1=new GL2.Sprite();
        root.addChild(g1);
        
		var a = new GL2.Animation();
		a.pushFrame(new GL2.Animation.Frame('Content/rolando.jpg', 0, [64, 64], [0, 0]));
        g1.setAnimation(a);

        var btn=getBtn("animateGL",[370,80,80,64],function  () {
             GLFx.animate(g1,{color:new Core.Color(1,0,1),position:new Core.Point(200,200)},1000,'',function(){
                GLFx.animate(g1,{color:new Core.Color(1,1,1),position:new Core.Point(30,30)},1000);
             });
        });
        //UI Fx
        var u1=new UI.Image({image:'./Content/rolando.jpg',frame:[100,200,64,64],});
        UI.Window.document.addChild(u1);
        
        var btnx=getBtn("animateUI",[180,134,80,64],function  () {
            UIFx.animate(u1,{frame:[[400,400,128,128]]},1000,function(){
                UIFx.animate(u1,{frame:[[100,200,64,64]]},1000);
            });
       });
	};
	glView.setAttribute('frame', [0, 0, NGWindow.outerWidth, NGWindow.outerHeight]);
	glView.setAttribute('active', true);
    
    var quitting = false;

    var back = new UI.Button({
		frame: [10, 10, 64, 64],
		text: "X",
		disabledText: "Returning...",
		disabledTextColor: "FFFF",
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
		onClick: function(event) {
			if (quitting)
				return;
			quitting = true;
			
			var LGL = require('../NGCore/Client/Core/LocalGameList').LocalGameList;
			LGL.runUpdatedGame('/Samples/Launcher');
			
			UI.Window.document.addChild(new UI.Spinner({
				frame: new UI.ViewGeometry.Rect(this.getFrame()).inset(10)
			}));
			var myRect = new UI.ViewGeometry.Rect(this.getFrame());
			this.setFrame(10, 10, 240, 64);
			// Reserve some space for the spinner to appear
			this.setTextInsets(0, 0, 0, 64);
			this.setTextGravity(0, 0.5);
			
			this.setTextSize(18.0);
			// Select the "disabled" appearance, and deactivate the control
			this.addState(UI.State.Disabled);
		}
	});
	UI.Window.document.addChild(back);
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
