var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;

var Util = require('../Util').Util;

var Component = require('./Component').Component;

exports.Overlay=Component.subclass({

    classname:"Overlay",

    initialize: function($super,properties) {
        
        
        properties=properties||{};
        properties.alpha=properties.alpha||0.6;
        properties.depth=properties.depth||65534;
        properties.color=properties.color||[0.8,0.8,0.8];
        if(!properties.frame){
            var screenSize=Util.getScreenSize();
            properties.frame=[0,0,screenSize.getWidth(),screenSize.getHeight()];
        }
        
        $super(properties);
        this._initialized=true;

        this._makeRectangle();
        this._makeTouchOverlay();

        properties.visible===false && this.hide();
        this.renderTo(properties.renderTo);
    },
    destroy:function  ($super) {
        this._touchLinstener.destroy();
        this._touchTarget.destroy();
        this._rectangle.destroy();
        $super();
    },
    /**
     * @param size array || object
     */
    setSize:function($super,size){
        $super(size);
        if(this._initialized){
            this._makeRectangle();
            this._makeTouchOverlay();
        }
        return this;
    },
    getSize:function(){
        return this._size;
    },
    setColor:function  (color) {
        this._color=color;
        if(this._initialized){
            this._rectangle.setColor(color);
        }
        return this;
    },
    getColor:function  () {
        return this._color;
    },
    show:function(){
        this.setVisible(true);
        this._touchTarget.setTouchable(true);
        return this;
    },
    hide:function(){
        this.setVisible(false);
        this._touchTarget.setTouchable(false);
        return this;
    },
    _makeRectangle: function() {
        if (this._rectangle != null)
        {
            this.removeChild(this._rectangle);
            this._rectangle.destroy();
        }

        this._rectangle=new GL2.Primitive();
        this._rectangle.setColor(this._color);

        var w=this._size.getWidth(),
            h=this._size.getHeight();

        this._rectangle.setType( GL2.Primitive.Type.TriangleStrip );

        var v = new Array();
        v.push( new GL2.Primitive.Vertex([0, 0], [0 , 0]));
        v.push( new GL2.Primitive.Vertex([w, 0], [0, 0]));
        v.push( new GL2.Primitive.Vertex([0, h], [0 , 0]));
        v.push( new GL2.Primitive.Vertex([w, h], [0, 0]));

        this._rectangle.spliceVertexes.apply(this._rectangle, ([0,0]).concat(v));

        this.addChild(this._rectangle);
    },
    _makeTouchOverlay:function(){
        this._touchTarget=new GL2.TouchTarget();
        this._touchTarget.setPosition(this._position)
                         .setSize(this._size)
                         .setAnchor(this._anchor)
                         .setRotation(this._rotation);
        this._touchLinstener=new Core.MessageListener();
        this._touchTarget.getTouchEmitter().addListener(this._touchLinstener,function(){
            //catch other touch
            return true;
        });
        this.addChild(this._touchTarget);
    }
});