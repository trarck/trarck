var Core = require('../../NGCore/Client/Core').Core;
var UI = require('../../NGCore/Client/UI').UI;


exports.Tip=UI.View.subclass({

    initialize:function  ($super,properties,frame,text,icon,bg,delay) {

        $super(properties);
        
        var frame=this._frame,imgRect,textRect;

        bg=bg||{
                'gradient': ["FF50 0.0", "FF00 1.0"],
                'outerLine': 'FFFF 5.0',
                'corners': '15',
                'insets': "{5,5,5,5}",
                'outerShadow': 'FF00 5.0 {0,-2}',
        };
        
        //bg
        this.createBg(bg);

        //icon
        if(icon){
            this.createIcon(icon);
            imgRect=this._icon.getFrame();
            textRect=[imgRect[2]+10,0,rect[2]-imgRect[2]-10,rect[3]];
        }else{
            textRect=[0,0,rect[2],rect[3]];
        }
        //label
        this.createLable(text,textRect);
        this._delay=delay||2000;

        this.setVisible(false);
        this.setAlpha(0);
        
    },
    destroy:function  () {
        if(this._hideTimer) clearTimeout(this._hideTimer);

    },
    createBg:function  (conf) {
        if(conf.image){
            if(!conf.frame){
                var frame=this.getFrame();
                conf.frame=[0,0,frame[2],frame[3]];
            }
            this._bg=new UI.Image(conf);
            this.addChild(this._bg);
        }else{
            this.setGradient(conf);
        }
    },
    createIcon:function(conf){
        var frame=this.getFrame();
        if(typeof conf=="string"){
            conf={
                image:conf,
                frame:[0,0,64,frame[3]],// vertical in
                imageGravity:[0,0.5]    // middle
            };
        }
        if(conf.frame[3]==null){
            conf.frame[3]=frame(3);
        }
        this._icon=new UI.Image(conf);
        this.addChild(this._icon);
    },
    createLable:function  (conf,rect) {
        if(typeof conf=="string"){
            conf={
                frame:rect,
                text:conf,
                textColor:'FFFF',
                textSize:22
                //backgroundColor:"FFFF00FF",
                //textGravity:[0.5,0.5]
            };
        }
        this._label=new UI.Label(conf);
        this.addChild(this._label);
    },
    setText:function  (text) {
        this._label.setText(text);
        return this;
    },
    getText:function  () {
        return this._label.getText();
    },
    setIcon:function(icon){
        if(typeof icon=="string"){
            this._icon.setImage(icon);
        }else{
            this._icon.setAttributes(icon);
        }
    },
    getIcon:function  () {
        return this._icon;
    },
    show:function  () {
        this.setVisible(true);
        if(UIFx){
            UIFx.animate(this,{alpha:1,y:"+50"},200,"easeInQuint",function  () {
                this.setVisible(true);
                this._hideTimer=setTimeout(this.hide.bind(this),this._delay);
            }.bind(this));
        }else{
            this._hideTimer=setTimeout(this.hide.bind(this),this._delay);
        }
    },
    hide:function  () {
        UIFx.animate(this,{alpha:0,y:"-50"},200,"easeOutQuint",function  () {
            this.setVisible(false);
        }.bind(this));
    }
});