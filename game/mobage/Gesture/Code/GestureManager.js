var Core = require('../NGCore/Client/Core').Core;

var Gesture=require('./Gesture').Gesture;
var Trajectory=require('./Trajectory').Trajectory;

var GestureManager=exports.GestureManager=Core.MessageListener.singleton({

    classname:"GestureManager",

    $Filter: {
        Cross:1,
        Straight:2,
        Repeat:3
    },

    initialize: function  () {
        this._gestTable=GestTable ;
        this._gestAction=GestAction;
        this._rules=GestRules;

        this._gestureEmitter=new Core.MessageEmitter();
        this._gesture=new Gesture();
    },

    destroy: function($super) {
        this._gestureEmitter.destroy();
        this._gesture.destroy();
        this._touch&&this._touch.destroy();
        $super();
    },

    getGestureEmitter: function() {
        return this._gestureEmitter;
    },

    getGesture: function() {
        return this._gesture;
    },

    setGestTable: function  (gestTable) {
        this._gestTable=gestTable;
    },

    getGestTable: function  () {
        return this._gestTable;
    },

    addGestTable: function(name,value) {
        this._gestTable[name]=value;
        return this;
    },

    deleteGestTable: function  (name) {
        delete this._gestTable[name];
        return this;
    },

    setGestAction: function  (gestAction) {
        this._gestAction=gestAction;
        return this;
    },

    getGestAction: function  () {
        return this._gestAction;
    },

    getAction: function(index) {
        return this._gestAction[index];
    },

    addAction: function  (index,value) {
        this._gestAction.splice(index,value);
        return this;
    },

    appendAction: function  (value) {
        this._gestAction.push(value);
        return this;
    },

    filter: function(gesture,filter) {
        if(typeof filter=='function')
            return filter(gesture);
        switch(filter) {
            case this.Filter.Cross:
                gesture=gesture.replace(/[NSWE]/g,"");
                break;
            case this.Filter.Straight:
                gesture=gesture.replace(/[URDL]/g,"");
                break;
            case this.Filter.Repeat:
                gesture=gesture.replace(/([URDLNSWE])\1+/g,'$1');
                break;
            default:
                break;
        }
        return gesture;
    },

    getActionFromTable: function(gesture) {
        return this._gestTable[gesture];
    },

    getActionFromRule: function(gesture) {
        var rules = this._rules;
        var len = rules.length;
        for(var i=0; i < len; ++i) {
            if(rules[i].f(gesture)) {
                return rules[i].name;
            }
        }
    },

    outputAction: function(gesture,filter) {
        var k=this.filter(gesture,filter);
        return this.getActionFromTable(k) || this.getActionFromRule(k);
    },

    addRule: function(action, func, priority) {
        //  The priority for default value is <code>0</code>
        if ((typeof priority) == 'undefined') {
            priority = 0;
        }
        var rules = this._rules;
        var len = rules.length;
        for(var i=0; i < len; ++i) {
            if(rules[i].p <= priority)
                break;
        }
        rules.splice(i, 0, {
            name: name,
            f: func,
            p: priority
        });
    },

    addGesture: function(gesture,action,func,priority) {
        var index=this._gestAction.indexOf(action);
        if(index==-1) {
            index=this._gestAction.length;
            this._gestAction.push(action);
        }
        this._gestTable[gesture]=action;
        if(func) {
            this.addRule(action,func,priority);
        }
    },

    start: function() {
        var w = Core.Capabilities.getScreenWidth();
        var h = Core.Capabilities.getScreenHeight();

        this._delayTimer=null;

        this._touch=new GL2.TouchTarget();
        this._touch.setAnchor(0,0).setSize(h,w).setDepth(999999);
        GL2.Root.addChild(this._touch);

        var touchEmitter=this._touch.getTouchEmitter();
        touchEmitter.addListener(this, this.onGestureTouch);
        
        var trajectory = new Trajectory( touchEmitter );
        trajectory.permanent = true;
        GL2.Root.addChild(trajectory.node);
    },

    stop: function() {
        this._touch.destroy();
    },

    onGestureTouch: function(touch) {
        switch (touch.getAction()) {
            case touch.Action.Start:
                clearTimeout(this._delayTimer);
                this._gesture.setLastPosition(touch.getPosition()).setLastMove('');
                return true;
            case touch.Action.End:
                this._delayTimer=setTimeout( function  () {
                    var s=this._gesture.output();
                    var action=this.outputAction(s);
                    this._gestureEmitter.chain(action);
                    this._gesture.reset();
                }.bind(this),400);

                break;
            case touch.Action.Move:
                //makeCircle(touch.getPosition(),2);
                this._gesture.gestMove(touch.getPosition());
                break;
        }
    }

});

var GestAction=['right','left','top','bottom','right_top','left_bottom','left_top','right_bottom','circle','fork','C','D'],
GestTable= {
    "R":GestAction[0],
    "L":GestAction[1],
    "U":GestAction[2],
    "D":GestAction[3],
    "N":GestAction[4],
    "S":GestAction[5],
    "W":GestAction[6],
    "E":GestAction[7],
    "URDL":GestAction[8],
    "RDLU":GestAction[8],
    "DLUR":GestAction[8],
    "LURD":GestAction[8],
    "SE":GestAction[9],
    "ES":GestAction[9],
    "LSDER":GestAction[10],
    "LSDERN":GestAction[10],
    "DREDSL":GestAction[11],
    "DNREDSL":GestAction[11]
},
GestRules=[{
    name:'circle',
    f: function(gesture) {
        var ret=false;
        gesture=GestureManager.filter(gesture,GestureManager.Filter.Cross);
        while(gesture.length>3) {
            if(GestureManager.getActionFromTable(gesture.substr(0,4))!='circle') {
                return false;
            }
            gesture=gesture.substr(4);
            ret=true;
        }
        return ret|| GestureManager.getActionFromTable(gesture)=='circle';
    },

    p:0

},{
    name:'fork',
    f: function(gesture) {
        gesture=GestureManager.filter(gesture,GestureManager.Filter.Straight);
        gesture=GestureManager.filter(gesture,GestureManager.Filter.Repeat);
        return GestureManager.getActionFromTable(gesture)=='fork';
    },

    p:0
}
];