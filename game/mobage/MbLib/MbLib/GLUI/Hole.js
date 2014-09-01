var Core  = require('../../NGCore/Client/Core').Core;
var GL2   = require('../../NGCore/Client/GL2').GL2;

exports.Hole = GL2.Sprite.subclass({

    classname:'Hole',

    initialize: function  (conf) {
        conf=conf||{};
        
        this._touchInHole=conf.onTouchInHole||this.onTouchInHole;

        this._image=conf.image;

        //hole size
        this._holeSize=new Core.Size(conf.holeSize);
        //image size
        this._imageSize=conf.imageSize?new Core.Size(conf.imageSize):this._holeSize;
        //visible size
        if(conf.frame){
            this.__position=new Core.Point(conf.frame[0],conf.frame[1]);
            this._size=new Core.Size(conf.frame[2],conf.frame[3]);
        }else{
            this.__position=new Core.Point(conf.position);
            this._size=conf.size?new Core.Size(conf.size):this.getScreenSize();
        }
        
        this.createElements();

        if(conf.visible!=null){
            this.setVisible(conf.visible);
        }
        this.setPosition(this.__position);

    },
    destroy:function  () {
        
        this._touchListener.destroy();
        this._target.destroy();

        this._touchInHole=null;
        this._holeSize=null;
        this._size=null;
        this._screenSize=null;
        this._animation=null;
        this._touchListener=null;
        this._target=null;
    },
    createElements: function(conf) {
        this._animation=new GL2.Animation();
        this._animation.pushFrame(new GL2.Animation.Frame(this._image,0));
        this.setAnimation(this._animation);
        
        this._touchListener=new Core.MessageListener();
        
        var target=new GL2.TouchTarget();
        target.setAnchor([0,0]);
        target.setSize(this._size);
        target.getTouchEmitter().addListener(this._touchListener, this.onTouch.bind(this));
        this.addChild(target);
        this._target=target;
    },
//    calcUV:function(){
//        var sw=this._size.getWidth(),
//            sh=this._size.getHeight(),
//            w=this._imageSize.getWidth(),
//            h=this._imageSize.getHeight();
//        this._u=sw/w;
//        this._v=sh/h;
//    },
    setPosition:function  ($super,pos) {
        $super(0,0);
        this.__position=new Core.Point(pos);
        this._setFrame();
    },
    _setFrame:function(){
      var   uvs=[],
            pos=this.__position,
            left=pos.getX(),
            top=pos.getY(),
            sw=this._size.getWidth(),
            sh=this._size.getHeight(),
            w=this._imageSize.getWidth(),
            h=this._imageSize.getHeight();
        
        uvs[0]=-left/w+0.5;
        uvs[1]=-top/h+0.5;
        uvs[2]=sw/w;
        uvs[3]=sh/h;

        this._animation.setFrame(0,new GL2.Animation.Frame(this._image,0,this._size,[0,0],uvs));
    },
    onTouch: function(touch) {
        switch(touch.getAction()) {
            case touch.Action.Start:
                var local=this.screenToLocal(touch.getPosition());
                var dx=this.__position.getX()-local.getX(),
                    dy=this.__position.getY()-local.getY();
                if(Math.abs(dx)<this._holeSize.getWidth()/2 && Math.abs(dy)<this._holeSize.getHeight()/2) {
                    this._touchInHole();
                    return false;
                } else {
                    return true;
                }
        }
    },
    onTouchInHole:function(){
        this.destroy();
    },
    getScreenSize:function(){
        var w,h;
        if(Device.OrientationEmitter.getInterfaceOrientation()==Device.OrientationEmitter.Orientation.LandscapeLeft){
            h=Core.Capabilities.getScreenWidth();
            w=Core.Capabilities.getScreenHeight();
        }else{
            w=Core.Capabilities.getScreenWidth();
            h=Core.Capabilities.getScreenHeight();
        }
        return new Core.Size(w,h);
    }
});