var Device = require('../../NGCore/Client/Device').Device;
var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;
var UI = require('../../NGCore/Client/UI').UI;

var Fx=require('../../Lib/GLFx').GLFx;
//var animate=Fx.animate.bind(Fx),
 //   stop=Fx.stop.bind(Fx);

var ex,ey;
var A=Core.Class.subclass({
    ma:function  () {
        console.log("this is A's ma");
    },
    maa:function  () {
        console.log(this.constructor.a);
    }
});
A.a="this is a";


var B=A.subclass({
    mb:function  () {
        console.log("this is B's mb");
    }
});

var C=A.subclass({
    mc:function  () {
        console.log("this is C's mc");
    }
});
function main()
{
	var glView = new UI.GLView();

	glView.onload = function()
	{
        B.a="this is b";
        C.a="this is C";

        console.log(A.a,B.a,C.a);
        var a=new A();
        var b=new B();
        var c=new C();
        a.maa();
        b.maa();
        c.maa();

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
        root=GL2.Root;
       

        var n1=new GL2.Sprite();
        root.addChild(n1);
        
		var a = new GL2.Animation();
		a.pushFrame(new GL2.Animation.Frame('Content/rolando.jpg', 0, [64, 64], [0, 0]));
        n1.setAnimation(a);

        px = new Fx(n1,{duration:1000,easing:"easeInOutBounce"},"positionX");
        console.log(px);
        var btnx=getBtn("px",[100,10,80,64],function  () {
             px.custom(20,200);
        });
        py=new Fx(n1,{duration:1000,easing:"easeInOutBounce"},"positionY");
        var btnx=getBtn("py",[190,10,80,64],function  () {
             py.custom(20,200);
        });

        var p=n1.getPosition().clone();
        position=new Fx(n1,{duration:1000,easing:"easeInOutBounce",complete:function  () {
            position2.custom(new Core.Vector(200,200),p);
        }},"position");
        position2=new Fx(n1,{duration:1000,easing:"easeInOutBounce"},"position");

        var btnp=getBtn("position",[280,10,80,64],function  () {
             position.custom(p,new Core.Vector(200,200));
        });


        sx=new Fx(n1,{duration:1000,easing:"easeInOutBounce"},"scaleX");
        var btnsx=getBtn("sx",[100,80,80,64],function  () {
             sx.custom(0.5,1);
        });

        sy=new Fx(n1,{duration:1000,easing:"easeInOutBounce"},"scaleY");
        var btnsy=getBtn("sy",[190,80,80,64],function  () {
             sy.custom(0,1);
        });

        scale=new Fx(n1,{duration:1000,easing:"easeInOutBounce",complete:function(){scale2.custom(new Core.Vector(0,0),new Core.Vector(1,1));}},"scale");
        scale2=new Fx(n1,{duration:1000,easing:"easeInOutBounce",},"scale");
        var btns=getBtn("scale",[280,80,80,64],function  () {
             scale.custom(new Core.Vector(1,1),new Core.Vector(0,0));
        });

        color=new Fx(n1,{duration:2000,easing:"easeInBack",complete:function(){
            console.log("**color******ok");
            color2.custom(new Core.Color(1,0,1),new Core.Color(1,1,1));
        }},"color");
        color2=new Fx(n1,{duration:2000,easing:"easeOutBack",complete:function(){
            console.log("***color2******ok");
        }},"color");
        var btnc=getBtn("color",[370,10,80,64],function  () {
             color.custom(new Core.Color(1,1,1),new Core.Color(1,0,1));
        });

        var btn=getBtn("animation",[370,80,80,64],function  () {
             Fx.animate(n1,{color:new Core.Color(1,0,1),position:new Core.Point(200,200)},1000,'',function(){
                Fx.animate(n1,{color:new Core.Color(1,1,1),position:new Core.Point(30,30)},1000);
             });
        });
        
        var btn=getBtn("parabola",[460,10,80,64],function  () {
            n1.setPosition(400,200);
            n=0;
            py=100;
            px=30;
            parabola();
        });
        
        var n=0,y=80,x=30;
        function parabola () {
            if(py<10) return;
            Fx.animate(n1,{positionX:'-='+x},200,'linear');
            Fx.animate(n1,{positionY:'-='+y},{duration:100,easing:"easeOutQuad",complete:function  () {
                Fx.animate(n1,{positionY:200},{duration:100,easing:"easeInQuad",complete:function  () {
                    parabola();
                }});
            }});
            y=y*0.5;
            x=x*0.9;
        }
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
			
			var LGL = require('../../NGCore/Client/Core/LocalGameList').LocalGameList;
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
