var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;

var FX=require('./UIFx');

var Tip=UI.View.subclass({
    initialize:function  ($super,rect,text,icon) {

        var attributes={
            frame:new UI.ViewGeometry.Rect(rect),
            gradient:{
                'gradient': ["FF50 0.0", "FF00 1.0"],
                'outerLine': 'FFFF 5.0',
                'corners': '15',
                'insets': "{5,5,5,5}",
                'outerShadow': 'FF00 5.0 {0,-2}',
            },
            alpha:1
        },imgRect,textRect;

        $super(attributes);
        //icon
        if(icon){
            imgRect=[0,0,64,64];
            textRect=[70,0,rect[2]-1,rect[3]];
            this._icon=new UI.Image({frame:imgRect,image:'./Content/Tip/'+icon+'.png'});
            this.addChild(this._icon);
        }else{
            textRect=[0,0,rect[2],rect[3]];
        }

        //label
        this._label=new UI.Label({
            frame:textRect,
            text:text,
            textColor:'FFFF',
            textSize:22
        });
        this.addChild(this._label);

        setTimeout(function  () {
            this.hide();
        }.bind(this),3000);
    },
    setText:function  (text) {
        this._label.setText(text);
        return this;
    },
    getText:function  () {
        return this._label.getText();
    },
    show:function  () {
        FX.animate(this,{alpha:1,y:"+50"},200,"easeInQuint",function  () {
            setTimeout(function(){this.hide()}.bind(this),2000);
        }.bind(this));
    },
    hide:function  () {
        FX.animate(this,{alpha:0,y:"-50"},200,"easeOutQuint",function  () {
            setTimeout(function(){this.show()}.bind(this),2000);
        }.bind(this));
        //console.log(this.getFrame());
//        var self=this;
//        UI.animate(function(){
//            //self.setAlpha(1);
//            self.setFrame(200,200,200,100);
//        }.bind(this),200,function  () {
//            console.log('aaa');
//            self.setVisible(false);
//        });
    }
});

function gameInit () {
    var h = Core.Capabilities.getScreenWidth();
    var w = Core.Capabilities.getScreenHeight();
   //background
   var background = new GL2.Sprite();
   background.setImage('./Content/blank1.png', [w, h], [0, 0]);
   GL2.Root.addChild(background);
   //view
   var tip=new Tip([100,100,200,100],"opration success");
   UI.Window.document.addChild(tip);
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
		var LGL = require('../NGCore/Client/Core/LocalGameList').LocalGameList;
		LGL.runUpdatedGame('/Samples/Launcher');
	};
	NGWindow.document.addChild(back);
}
