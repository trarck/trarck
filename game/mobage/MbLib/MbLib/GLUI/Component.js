var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;

var Util = require('../Util').Util;

exports.Component=GL2.Sprite.subclass({

    classname:"Component",

    initialize: function(properties) {
        this.setAttributes(properties);
    },
    renderTo:function(parent){
        if(parent && parent.addChild){
            parent.addChild(this);
        }
        return this;
    },
    render:function(parent){
        if(parent && parent.addChild){
            parent.addChild(this);
        }
        return this;
    },
    /**
     * @param frame array || object
     
     */
    setFrame:function(frame){
        frame=new Core.Rect(frame);
        this.setSize(frame.getSize());
        this.setPosition(frame.getOrigin());
        this._frame=frame;
        return this;
    },
    getFrame:function(){
        return this._frame;  
    },
    /**
     * @param size array || object
     */
    setSize:function(size){
        this._size=new Core.Size(size);  
        return this;
    },
    getSize:function(){
        return this._size;  
    },
    setBackgroundColor:function  () {
        
    },
    setBackgroundImage:function  (image) {
        
    },
    setMargin:function(){
        
    },
    //unit method
    getAttribute:function(key,value){
        var name="get"+Util.ucfirst(Util.camelCase(key));
        return this[name] && this[name]();
    },
    setAttribute:function(key,value){
        var name="set"+Util.ucfirst(Util.camelCase(key));
        this[name]&&this[name](value);
        return this;
    },
    setAttributes:function(dict){
        for (var key in dict) {
            this.setAttribute(key, dict[key]);
        }
        return this;
    },
    
});