var Core  = require('../NGCore/Client/Core').Core;
var GL2   = require('../NGCore/Client/GL2').GL2;
var UI    = require('../NGCore/Client/UI').UI;
var Device = require('../NGCore/Client/Device').Device;
var Physics2 = require('../NGCore/Client/Physics2').Physics2;


var node;
var vx=vy=vz=0;
var timeStamp=0;
var accel;
var tip,n=0,m=0;
function makeBox(position, size)
{
	var body = new Physics2.Body();
	body.setPosition(position);
	world.addBody(body);

	var shape = new Physics2.BoxShape();
	shape.setDensity(1);
	shape.setFriction(0.1);
	shape.setRestitution(0.8);
	//shape.setGroupIndex(-1);
	shape.setSize(size);
	shape.body = body;
	body.addShape(shape);

	return body;
}

function makeCircle(position, radius)
{
	var body = new Physics2.Body();
	body.setPosition(position);
	world.addBody(body);
	
	var shape = new Physics2.CircleShape();
	shape.setDensity(1);
	shape.setFriction(0.1);
	shape.setRestitution(0.8);
	//shape.setGroupIndex(-1);
	shape.setRadius(radius);
	shape.body = body;
	body.addShape(shape);
	
	return body;
}

function HelloWorld()
{
    var  h=Core.Capabilities.getScreenWidth();
    var  w=Core.Capabilities.getScreenHeight();
    var bg=new GL2.Sprite();
    bg.setImage("./Content/bg.png",[w,h],[0,0]);
    GL2.Root.addChild(bg);

    
   var superRoot = new GL2.Node();
   GL2.Root.addChild(superRoot);
		
   var root = new GL2.Node();
   superRoot.addChild(root);

    world = new Physics2.World();
    //world.setDebugDrawFlags(Physics2.World.DebugDrawFlags.Shapes | Physics2.World.DebugDrawFlags.Joints | Physics2.World.DebugDrawFlags.CenterOfMass);
    world.setDebugDrawGL2Node(root);
   // world.setGravity(0,0);
    
    tip=new GL2.Text();
    tip.setFontSize(28)
       .setPosition(w-100,30)
       .setSize(200,40)
       .setDepth(65355);
    GL2.Root.addChild(tip);

    var basket=new Basket();
    basket.setPosition(100,h/2);
    basket.setType(basket.Type.Static);
    root.addChild(basket.getGL2Node());
    world.addBody(basket);

   makeFish(root);
   makeFish(root);
   
   var Reporter = Core.MessageListener.subclass(
	{
		initialize: function()
		{
			world.getContactEmitter().addListener(this, this.onContact);
		},
		
		onContact: function(contact)
		{
            //console.log(contact);
			if(contact.getType() == Physics2.Body.ContactFlags.Begin)
			{
                //console.log(contact.getShapeA(),contact.getShapeB());
                var fish=contact.getShapeB().body;
                if(fish.classname=="Fish" && fish.getState()!=3){
                    fish.destroy();
                    tip.setText(++n+"/"+m);
                    contact.getShapeA().body.catchFish(n);
                }
//				for(var i=0; i < contact.getLocationCount(); ++i)
//				{
//					var l = contact.getLocation(i).getPosition();
//				    console.log(contact.getLocation(i),l);
//				}
			}
		},
	});
	var r = new Reporter();

}
function makeFish (root) {
    var  h=Core.Capabilities.getScreenWidth();
    var  w=Core.Capabilities.getScreenHeight();
    var x=(w/2+Math.random()*w/2),
        rh=h*0.5625,
        y=(h-rh)+Math.random()*rh;
    
    var fish=new Fish(root,[x,y]);
    fish.onDestroy=function(){
        makeFish(root);
    }
    world.addBody(fish);
    m++;
    tip.setText(n+"/"+m);
    return fish;
}
var Basket=Physics2.Body.subclass({

    classname:"Basket",

    initialize:function  (root,position) {
        
        this._size=new Core.Size(200,160);

        var node=new GL2.Sprite();
        node.setImage("Content/basket1.png",[256,256]);
        root && root.addChild(node);
        this.setGL2Node(node);

        this.setContactFlags(Physics2.Body.ContactFlags.All);

        position && this.setPosition(position);
        this.makeShape(this._size);
        
        this._listener=new Core.MessageListener();
        Core.UpdateEmitter.addListener(this._listener,this.onUpdate.bind(this));
    },
    destroy:function  () {
        Core.UpdateEmitter.removeListener(this._listener,this.onUpdate);
        this.getGL2Node().destroy();
    },
    makeShape:function(size){
        var shape = new Physics2.BoxShape();
        shape.setDensity(1);
        shape.setFriction(0.1);
        shape.setRestitution(0.8);
        shape.setGroupIndex(1);
        shape.setSize(size);
        shape.setPosition(0,20);
        shape.body = this;


        this.addShape(shape);
    },
    onUpdate:function  (delta) {
        if(!accel) return;

       delta=delta/50;//时间比例
      // accel.x=-accel.x;//x方向是反的

       var  h=Core.Capabilities.getScreenWidth();
       var  w=Core.Capabilities.getScreenHeight();
       var pos=this.getPosition();
       var vx0=vx,vy0=vy;
       
       vx+=accel.y*delta;
       vy+=accel.x*delta;

       var dx=vx0*delta+accel.y*delta*delta/2,
           dy=vy0*delta+accel.x*delta*delta/2;

       var x=pos.getX()+dx,
           y=pos.getY()+dy;

       //范围限制
       if(x<0){
            x=0;
            vx=0;
       }else if(x>w){
            x=w;
            vx=0;
       }

       if(y<0){
            y=0;
            vy=0;
       }else if(y>h){
            y=h;
            vy=0;
       }
//       x=x<0?0:x>w?w:x;
//       y=y<0?0:y>h?h:y;
//       console.log(vx,vy);
       this.setPosition(x,y);
    },
    catchFish:function  (fishNumber) {
       if(fishNumber==1){
            this.getGL2Node().setImage("Content/basket2.png",[256,256]);
       }
    }
});

var Fish=Physics2.Body.subclass({

    classname:"Fish",

    initialize:function  (root,position) {
        
        this._size=new Core.Size(64,64);

        var node=new GL2.Sprite();
        node.setImage("Content/fish_01.png",this._size);
        root&& root.addChild(node);
        this.setGL2Node(node);
        this.setContactFlags(Physics2.Body.ContactFlags.All);
        this._node=node;

        this.makeShape(this._size.getWidth()/2);
        
        this._vx=-(20+Math.random()*40);
        this._vy=-(40+Math.random()*40);
        //this._vz=5+Math.random()*5;
        this._startPosition=new Core.Point(position);
        position && this.setPosition(position);
        this.appear();
    },
    destroy:function  () {
        this._listener.destroy();
        this._appearTimer!=null && clearTimeout(this._appearTimer);
        this._disappearTimer!=null && clearTimeout(this._disappearTimer);
        this.onDestroy();
        this.getGL2Node().destroy();
    },
    onDestroy:function  () {
        
    },
    makeShape:function(radius){
        var shape = new Physics2.CircleShape();
        shape.setDensity(1);
        shape.setFriction(0.1);
        shape.setRestitution(0.8);
        shape.setGroupIndex(-1);
        shape.setRadius(radius);
        shape.body = this;
        this.addShape(shape);
    },
    onUpdate:function  (delta) {
        var  h=Core.Capabilities.getScreenWidth();
        var  w=Core.Capabilities.getScreenHeight();
        
        var dt=delta/100;

        var p=this.getPosition();
        this._vy+=10*dt;

        var dx=this._vx*dt,
            dy=this._vy*dt;
        var x=p.getX()+dx,
            y=p.getY()+dy;
        
        var degrees = Math.atan(this._vy/this._vx) *180 / Math.PI ;
        this.setRotation(degrees-90);

        var width=this._size.getWidth,height=this._size.getHeight();
        
        if(x<width || x>w+width ||  y>=this._startPosition.getY()){//y<height ||y>h+height ||
            this.disappear();
        }
        
        
//        if(tana>0.414){//上升
//            this.setStatus(2);
//        }else if(tana>-0.414){//水平
//            this.setStatus(3);
//        }else{//下降
//            this.setStatus(4);
//        }
//        if(x<64){
//            x=0;
//            this._vx=-this._vx;
//        }else if(x>w+64){
//            x=w;
//            this._vx=-this._vx;
//        }
//        if(y<64){
//            y=0;
//            this._vy=-this._vy;
//        }else if(y>h+64){
//            y=h;
//            this._vy=-this._vy;
//        }
        this.setPosition(x,y);
    },
    appear:function  () {
        var self=this;
        this.setStatus(1);
        

        this._appearTimer=setTimeout(function  () {
            this._appearTimer=null;
            self.setStatus(2);
            self._listener=new Core.MessageListener();
            Core.UpdateEmitter.addListener(self._listener,self.onUpdate.bind(self));
        },300);
       
        
    },
    disappear:function(){
        Core.UpdateEmitter.removeListener(this._listener,this.onUpdate);
        var self=this;
        this.setRotation(0);
        this.setStatus(3);

        this._disappearTimer=setTimeout(function  () {
            this._disappearTimer=null;
            self.destroy();
        },500);
    },
    setStatus:function(state) {
        if(this._animation)this._animation.destroy();
        if(this._state==state) return;
        this._state=state;

        this._animation=new GL2.Animation();
        this._animation.setLoopingEnabled(false);
        switch (state) {
            case 1:
                
                this._animation.pushFrame(new GL2.Animation.Frame("Content/fish_01.png",300,this._size));
                this._animation.pushFrame(new GL2.Animation.Frame("Content/fish_02.png",200,this._size));
                
                break;
            case 2:
                this._animation.pushFrame(new GL2.Animation.Frame("Content/fish_02.png",0,this._size));
                break;
            case 3:
                this._animation.pushFrame(new GL2.Animation.Frame("Content/fish_04.png",50,this._size));
                this._animation.pushFrame(new GL2.Animation.Frame("Content/fish_05.png",100,this._size));
                this._animation.pushFrame(new GL2.Animation.Frame("Content/fish_06.png",100,this._size));
                break;
        }
        this._node.setAnimation(this._animation);
    },
    getState:function  () {
        return this._state;
    }
});

var KeyListener = Core.MessageListener.singleton (
{
    initialize: function()
    {
        Device.KeyEmitter.addListener(this, this.onUpdate);
    },

    onUpdate : function(keyEvent)
    {
        if (keyEvent.code === Device.KeyEmitter.Keycode.back)
        {
            if (this.backButton) {
				this.backButton.onclick(keyEvent);
			}
            return true;
        }
    }
});

var UpdateListener = Core.MessageListener.singleton (
{
    initialize: function()
    {
        Core.UpdateEmitter.addListener(this, this.onUpdate);
    },

    onUpdate : function(delta)
    {
       if(!accel) return;

       delta=delta/50;//时间比例
       accel.x=-accel.x;//x方向是反的

       var w=480,h=800;
       var pos=node.getPosition();
       var vx0=vx,vy0=vy;
       
       vx+=accel.x*delta;
       vy+=accel.y*delta;

       var dx=vx0*delta+accel.x*delta*delta/2,
           dy=vy0*delta+accel.y*delta*delta/2;

       var x=pos.getX()+dx,
           y=pos.getY()+dy;

       //范围限制
       if(x<0){
            x=0;
            vx=0;
       }else if(x>w){
            x=w;
            vx=0;
       }

       if(y<0){
            y=0;
            vy=0;
       }else if(y>h){
            y=h;
            vy=0;
       }
//       x=x<0?0:x>w?w:x;
//       y=y<0?0:y>h?h:y;
//       console.log(vx,vy);
       node.setPosition(x,y);
    }
});

var MotionListener = Core.MessageListener.singleton (
{
    initialize: function()
    {
        Device.MotionEmitter.addListener(this, this.onUpdate);
    },

    onUpdate : function(motion)
    {
       accel=motion.getAccelData();
//
//           compass=motion.getCompassData(),
//           gyro=motion.getGyroData();
//       var s='';
//       if(accel){
//            for(var i in accel){
//                s+=i+'='+accel[i]+",";
//            }
//       }
////       if(compass){
////            for(var i in compass){
////                s+=i+'='+compass[i]+",";
////            }
////       }
////       if(gyro){
////            for(var i in gyro){
////                s+=i+'='+gyro[i]+",";
////            }
////       }
//       console.log(s);
    }
});

function main()
{
	var glView = new UI.GLView({
		frame: [0, 0, UI.Window.outerWidth, UI.Window.outerHeight],
		onLoad: function() {
            //设置为横版
            Device.OrientationEmitter.setInterfaceOrientation(Device.OrientationEmitter.Orientation.LandscapeLeft, false);

			HelloWorld();
			KeyListener.instantiate();
            MotionListener.instantiate();
            //UpdateListener.instantiate();
		}
	});
	glView.setActive(true);
	
	var quitting = false;
	// Add a back button.
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

	KeyListener.backButton = back;
	UI.Window.document.addChild(back);

    var back = new UI.Button({
		frame: [80, 10, 64, 64],
		text: "r",
		disabledText: "restart...",
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
			
			var LGL = require('../NGCore/Client/Core/LocalGameList').LocalGameList;
			LGL.runUpdatedGame('/Project/Fish');
			
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

	KeyListener.backButton = back;
	UI.Window.document.addChild(back);
}
