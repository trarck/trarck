var Core = require('../NGCore/Client/Core').Core;
var UI = require('../NGCore/Client/UI').UI;
var ViewParent = require('../NGCore/Client/UI/ViewParent').ViewParent;
var AbstractView = require('../NGCore/Client/UI/AbstractView').AbstractView;

var WindowLayer = exports.WindowLayer = UI.View.subclass( {

    //type:'view',

	initialize: function($super, props) {
		if (WindowLayer._init) WindowLayer._init();
		$super(props);
		ViewParent.initialize.call(this);
		this._visible = true;
	},
	getRoot: function(){
		return this;
	},
	getParent: function(){
		return undefined;
	},
	
	getChildCount: ViewParent.getChildCount,
	getChildren: ViewParent.getChildren,
	addChild: ViewParent.addChild,
	removeChild: ViewParent.removeChild
});

WindowLayer._init = function() {
	delete WindowLayer._init;
	if (UI.View._init) UI.View._init();
	
    function getLevel () {
        return this._level;
    }
    function setLevel (level) {
        this._level=level;
        //remove from parent
        UI.Window.document.removeChild(this);
        //sort layer
        var layers=UI.Window.document.getChildren();
        var i=0,l=layers.length;
        for(;i<l;i++){
            if(layers[i]._level && level<layers[i]._level){
                break;
            }
        }
        UI.Window.document.addChild(this);
        //fix android bug android don't suport addChild(view,index);
        for(;i<l;i++){
            //UI.Window.document.removeChild(layers[i]);
            UI.Window.document.addChild(layers[i]);
        }
        return this;
    }
	WindowLayer.registerAccessors('level', getLevel, setLevel);
};
UI.Window.Layer={
    Normal:0,
    Window:10,
    Overlay:100
};
UI.Window._layers=UI.Window._layers||{};

var bgs=['FFFF00FF','FFCC9900','FFFFCC99','FFFF9933','FFCCFF99','FF99FFCC'];
var curr=0;
UI.Window.getLayer=function(level){
    level=level||0;
    return this._layers[level] || (this._layers[level] = new WindowLayer({'level':level}));
//    if(curr==2){
//        return this._layers[level] || (this._layers[level] = new WindowLayer({'level':level,backgroundColor:bgs[curr++]}));
//    }else{
//        return this._layers[level] || (this._layers[level] = new WindowLayer({'level':level,backgroundColor:bgs[curr++]}));
//    }
}