var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;

var Listener=Core.MessageListener.subclass({
    initialize:function  (node) {
        Core.UpdateEmitter.addListener(this,this.onUpdate);
        this.node=node;
    },
    onTouch:function  (touch) {
         console.log(touch.getAction());
         switch (touch.getAction()) {
            case touch.Action.Start:
                this.startPosition=touch.getPosition();
                this.startTime=Core.Time.getRealTime();
                return true;
                break;
            case touch.Action.End:
                var end=touch.getPosition();
                var endTime=Core.Time.getRealTime();
                this.vx=(end.getX()-this.startPosition.getX())*40/(endTime-this.startTime);
                this.vx=this.vx>100?100:this.vx<-100?-100:this.vx;

                //console.log(end.getX()-this.startPosition.getX(),end.getY()-this.startPosition.getY(),endTime-this.startTime);
                this.doMove();
                break;
            case touch.Action.Move:
                break;
        }
    },
    doMove:function  () {
        this.a=this.vx>0?-8:8;
        console.log('s:',this.vx*this.vx/(2*this.a),"v:",this.vx,"a:",this.a);
    },
    onUpdate:function  (delta) {
        delta/=100;
        var vxt=this.vx+delta*this.a;
        if(this.a>0){
             if(vxt<0){
                var x=this.node.getPosition().getX();
                sx=this.vx*delta+delta*delta*this.a/2;
                x+=sx;
                console.log(x,vxt,sx);
                this.node.setPosition(x,this.node.getPosition().getY());
                this.vx=vxt;
            }
        }else{
            if(vxt>0){
                var x=this.node.getPosition().getX();
                sx=this.vx*delta+delta*delta*this.a/2;
                x+=sx;
                console.log(x,vxt,sx);
                this.node.setPosition(x,this.node.getPosition().getY());
                this.vx=vxt;
            }
        }
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
   var s=new GL2.Sprite();
   s.setImage('./Content/301.png',[64,64],[0,0]);
   var target=new GL2.TouchTarget();
   target.setAnchor(0,0)
         .setSize(64,64);
   var listener=new Listener(s);
   target.getTouchEmitter().addListener(listener,listener.onTouch);
   s.addChild(target);
   GL2.Root.addChild(s);
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
}
