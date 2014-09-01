var Device = require('../../NGCore/Client/Device').Device;
var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;
var UI = require('../../NGCore/Client/UI').UI;

var ButtonFactory = require('../ButtonFactory').ButtonFactory;
var PageBase = require('./PageBase').PageBase;

exports.EventPage=PageBase.subclass({
    
    initialize: function($super,propertis) {
        if (this.constructor._init) this.constructor._init();
        $super(propertis);
    },
    createItems:function  () {
        var self=this;
        var h = Core.Capabilities.getScreenWidth();
        var w = Core.Capabilities.getScreenHeight();
        //back to root
        ButtonFactory.getButton("root",[w/2-32,10,64,64],function(){
            self._navController.backToView(self._root);
        },this);

        var NgEventListenerManager = require('../../MbLib/Event/NgEventListenerManager').NgEventListenerManager;
        var EventObject = require('../../MbLib/Event/EventObject').EventObject;

        //bind update event
        ButtonFactory.getButton("update",[10,100,64,64],function(){
            NgEventListenerManager.addEventListener(GL2.Root,"update",function (e) {
                console.log("do update event e=",e);
            });
        },this);
        
        var node=new GL2.Sprite();
        node.setImage("Content/rolando.jpg",[128,128]);
        node.setPosition(w/2,264);    
        GL2.Root.addChild(node);

        //touch event
        ButtonFactory.getButton("touch",[80,100,64,64],function(){
            NgEventListenerManager.addEventListener(node,"touch",function (e) {
                console.log("do touch event e=",e);
            },null,null,{size:[128,128],anchor:[0.5,0.5]});
        },this);
        ButtonFactory.getButton("longtouch",[80,20,64,64],function(){

            NgEventListenerManager.addEventListener(node,"longTouchStart",function (e) {
                console.log("do long touch start event e=",e);
            },null,null,{size:[128,128],anchor:[0.5,0.5]});
            
            NgEventListenerManager.addEventListener(node,"longTouchEnd",function (e) {
                console.log("do long touch end event e=",e);
            });

            NgEventListenerManager.addEventListener(node,"touch",function (e) {
                console.log("do touch event e=",e);
            });
        },this);

        //listen custom event 
        ButtonFactory.getButton("lis custom",[160,100,64,64],function(){
            NgEventListenerManager.addEventListener(node,"custom",function (e) {
                console.log("do custom event e=",e);
            });
        },this);

        //fire custom event
        ButtonFactory.getButton("fire custom",[240,100,64,64],function(){
            var customEvent=new EventObject("custom",true,true);
            NgEventListenerManager.dispatchEvent(node,customEvent);
        },this);
    }


});