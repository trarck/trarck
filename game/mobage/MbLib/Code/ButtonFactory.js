var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;

exports.ButtonFactory={
    
    getButton:function  (text,frame,onClick,parent) {
        var btn = new UI.Button({
            frame: frame,
            text: text,
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
            onClick: onClick
        });
        //UI.Window.document.addChild(btn);
        parent=parent||UI.Window.document;
        parent.addChild(btn);
        return btn;
    }
    
};