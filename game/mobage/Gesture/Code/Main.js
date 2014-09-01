var UI = require('../NGCore/Client/UI').UI;
var GL2 = require('../NGCore/Client/GL2').GL2;
var Core = require('../NGCore/Client/Core').Core;
var Device = require('../NGCore/Client/Device').Device;
var Physics2 = require('../NGCore/Client/Physics2').Physics2;

var GestureManager=require('./GestureManager').GestureManager;

var world,root,body;

function makeCircle(position, radius) {
    var shape = new Physics2.CircleShape();
    shape.setDensity(1);
    shape.setFriction(0.1);
    shape.setRestitution(0.8);
    shape.setGroupIndex(-1);
    shape.setRadius(radius);
    shape.setPosition(position);
    body.addShape(shape);

    return shape;
}

function makeBox(position, size) {
    var body = new Physics2.Body();
    body.setPosition(position);
    world.addBody(body);

    var shape = new Physics2.BoxShape();
    shape.setDensity(1);
    shape.setFriction(0.1);
    shape.setRestitution(0.8);
    shape.setGroupIndex(-1);
    shape.setSize(size);
    shape.body = body;
    body.addShape(shape);

    return body;
}

function clearAll (node) {
    var shape=node.getShape(0);
    while(shape){
        node.removeShape(shape);
        shape=node.getShape(0);
    }
}

var gLabel=null;

function log () {
    var msg='';
    for(var i=0;i<arguments.length;i++) msg+=arguments[i];
    gLabel.setText(msg);
}

var Track=Core.MessageListener.subclass({
    initialize:function  (gesture) {
        this._gesture=gesture;
        this._lastAction=null;
    },
    start:function  (action) {
        Core.MessageEmitter.addListener(this,this.onUpdate);
        this._action=action;
    },
    stop:function  () {
        Core.MessageEmitter.removeListener(this,this.onUpdate);
        this._action=null;
    },
    onUpdate:function  () {
        var s=gesture.output();
        var action=GestureManager.outputAction(s);
        if(this._action==action){
            
        }
    }
});

function gameInit () {

    var w = Core.Capabilities.getScreenWidth();
    var h = Core.Capabilities.getScreenHeight();

    var _superRoot = new GL2.Node();
    GL2.Root.addChild(_superRoot);

    root = new GL2.Node();
    _superRoot.addChild(root);

    world = new Physics2.World();
    world.setDebugDrawFlags(Physics2.World.DebugDrawFlags.Shapes | Physics2.World.DebugDrawFlags.Joints | Physics2.World.DebugDrawFlags.CenterOfMass);
    world.setDebugDrawGL2Node(root);

    body = new Physics2.Body();
    body.setType(body.Type.Static);
    world.addBody(body);

    var _sprite = new GL2.Sprite();
    _sprite.setDepth(-1);
    _sprite.setImage('Content/white.png', [w*2, h*2], [0.25, 0.25]);
    root.addChild(_sprite);

    gLabel=new UI.Label({
        frame:[140,10,w-140,60]
    });

    UI.Window.document.addChild(gLabel);

       
    createLabel('gesture:',[10,80,80,40]);
    var gestInput=createInput([90,80,100,40]);
    gestInput.setText("test");
    
    GestureManager.getGestureEmitter().addListener(new Core.MessageListener(),function(action){
        gestInput.setText(action);
    });
    GestureManager.start();
}

function main() {
    var glView = new UI.GLView();
    glView.onload = function() {
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
	UI.Window.document.addChild(back);

        gameInit();

    };
    glView.setAttribute('frame', [0, 0, NGWindow.outerWidth, NGWindow.outerHeight]);
    glView.setAttribute('active', true);
}

function createButton(text,frame,onClick) {
    // Add a back button.
    var btn = new UI.Button({
        text:text,
        frame:frame,
        textSize:22,
        textGravity:UI.ViewGeometry.Gravity.Center,
        gradient:{
            corners: '8 8 8 8',
            outerLine: "00 1.5",
            gradient: [ "FF9bd6f4 0.0", "FF0077BC 1.0" ]
        },
        highlightedGradient:{
			corners: '8 8 8 8',
			outerLine: "00 1.5",
			gradient: [ "FF0077BC 0.0", "FF9bd6f4 1.0" ]
		},
		disabledGradient: {
			corners: '0 8 8 8',
			gradient: [ "FF55 0.0", "FF00 1.0"]
		},
        onclick:onClick
    });
    NGWindow.document.addChild(btn);
    return btn;
}
function createLabel (text,frame) {
    var label = new UI.Label({
		frame: frame,
//		gradient: {
//			gradient: ["90001d33 0.0", "C0001d33 1.0"],
//			innerShadow: "FF00 1.0 {0,1}"
//		},
		textGravity: [0.5, 0.5],
		textSize: 22,
		text: text,
		textColor: "FF00"
	});
    UI.Window.document.addChild(label);
    return label;
}
function createInput (frame) {
    var label = new UI.Label({
		frame: frame,
		gradient: {
			//gradient: ["90001d33 0.0", "C0001d33 1.0"],
            outerLine: "00 1",
			innerShadow: "FF00 1.0 {0,1}"
		},
        inputType:2,
		textGravity: [0.5, 0.5],
		textSize: 22,
		textColor: "FF00"
	});
    UI.Window.document.addChild(label);
    return label;
}