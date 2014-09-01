var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;
var UI = require('../../NGCore/Client/UI').UI;

var Util = require('../../MbLib/Util').Util;

var NgEventListenerManager = require('../../MbLib/Event/NgEventListenerManager').NgEventListenerManager;
var EventObject = require('../../MbLib/Event/EventObject').EventObject;
var NgEventTarget = require('../../MbLib/Event/NgEventTarget').NgEventTarget;

var Testor = require('./Testor').Testor;

var testor;
exports.TestEvent=Core.Class.singleton({

    classname:"TestPrintor",

    initialize:function  () {
        
    },
    start:function  () {
        testor=new Testor({frame:[Core.Capabilities.getScreenHeight()-300,0,300,200]})

        this.testCustomEvent();
        this.testUpdateEvent();
        this.testUIEvent();
        this.testEventTarget();
    },
    testCustomEvent:function  () {
        var testNode=new GL2.Node();
        GL2.Root.addChild(testNode);

        var action=function  (e) {
            testor.assertEqual(e.type,"custom","custom dispath");
        }
        NgEventListenerManager.addEventListener(testNode,"custom",action);
        testor.assertEqual(NgEventListenerManager.getEventListeners(testNode,"custom").length,1,"custom addEventListener");
        var customEvent=new EventObject("custom",true,true);
        NgEventListenerManager.dispatchEvent(testNode,customEvent);
        
        NgEventListenerManager.removeEventListener(testNode,"custom",action);
        testor.assertTrue(NgEventListenerManager.getEventListeners(testNode,"custom")==null,"custom removeEventListener");
        testNode.destroy();
    },
    testUpdateEvent:function  () {
        var testNode=new GL2.Node();
        GL2.Root.addChild(testNode);

        var action=function  (e) {
            testor.assertEqual(e.type,"update","execute update");
            NgEventListenerManager.removeEventListener(testNode,"update",action);
            testor.assertTrue(NgEventListenerManager.getEventListeners(testNode,"update")==null,"remove update event");
            testNode.destroy();
        }
        NgEventListenerManager.addEventListener(testNode,"update",action);
        testor.assertEqual(NgEventListenerManager.getEventListeners(testNode,"update").length,1,"add update event");
        
        var testView=new UI.View();
        UI.Window.document.addChild(testView);

        var viewAction=function  (e) {
            testor.assertEqual(e.type,"update","execute ui update");
            NgEventListenerManager.removeEventListener(testView,"update",viewAction);
            testor.assertTrue(NgEventListenerManager.getEventListeners(testView,"update")==null,"remove ui update event");
            testView.destroy();
        }
        NgEventListenerManager.addEventListener(testView,"update",viewAction);
        testor.assertEqual(NgEventListenerManager.getEventListeners(testView,"update").length,1,"add ui update event");
        
    },
    testUIEvent:function  () {
        var testView=new UI.View();
        UI.Window.document.addChild(testView);

        var action=function  (e) {
            testor.assertEqual(e.type,"uicustom","uicustom dispath");
        }
        NgEventListenerManager.addEventListener(testView,"uicustom",action);
        testor.assertEqual(NgEventListenerManager.getEventListeners(testView,"uicustom").length,1,"uicustom addEventListener");
        var customEvent=new EventObject("uicustom",true,true);
        NgEventListenerManager.dispatchEvent(testView,customEvent);
        
        NgEventListenerManager.removeEventListener(testView,"uicustom",action);
        testor.assertTrue(NgEventListenerManager.getEventListeners(testView,"uicustom")==null,"uicustom removeEventListener");
        testView.destroy();
    },
    testEventTarget:function  () {
        
        Util.mixinIf(GL2.Node.prototype,NgEventTarget.prototype);
        console.log(GL2.Node.prototype,NgEventTarget.prototype)
        var testNode=new GL2.Node();
        GL2.Root.addChild(testNode);

        var action=function  (e) {
            testor.assertEqual(e.type,"custom","custom EventTarget dispath");
        }
        
        testNode.addEventListener("custom",action);
        testor.assertEqual(testNode.getEventListeners("custom").length,1,"custom EventTarget addEventListener");
        var customEvent=new EventObject("custom",true,true);
        testNode.dispatchEvent(customEvent);
        
        testNode.removeEventListener("custom",action);
        testor.assertTrue(testNode.getEventListeners("custom")==null,"custom EventTarget removeEventListener");
        testNode.destroy();
    },
});