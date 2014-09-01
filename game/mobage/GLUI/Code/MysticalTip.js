var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;

var AnimationFactory=require('../Model/AnimationFactory').AnimationFactory;
var Fx=require('../Model/GLFx').Fx;

exports.MysticalTip=GL2.Node.subclass({

    classname:"MysticalTip",

    initialize: function(conf) {
        var imgRect,textRect;

        //background
        conf.background &&  this.createBackground(conf.background);

        //tip content
        this._label=new GL2.Text(conf.text);
        this._label.setColor(0,0,0)
            .setFontSize(26)
            .setSize(600,220)
            .setAnchor(0.5,0.5)
            .setVerticalAlign(GL2.Text.VerticalAlign.Middle);
        //icon
        conf.icon && this.createIcon();
        this._icon=new GL2.Sprite();
        a=new GL2.Animation();
        a.pushFrame(new GL2.Animation.Frame('Content/GameStart/secret.png',0,[512,512]));
        this._icon.setAnimation(a);

        this.addChild(this._text);
        this.addChild(this._icon);
    },

    createBackground: function(conf) {
        this._background=new GL2.Sprite();
        this._background.setAnimation(AnimationFactory.get(conf.image,conf.size,conf.anchor,conf.uvs))
                        .setPosition(conf.position);
        conf.depth && this._background.setDepth(conf.depth);
        conf.scale && this._background.setScale(conf.scale);
        this.addChild(this._background);
    },

    setText: function  (text) {
        this._label.setText(text);
        return this;
    },

    getText: function  () {
        return this._label.getText();
    },

    show: function  () {

    },

    hide: function  () {

    }

});