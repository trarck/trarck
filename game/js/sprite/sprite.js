function Sprite(options) {
    this._init(options);
}
Sprite.prototype={
    x:0,
    y:0,
    width:0,
    height:0,
    rotation:0,
    enable:true,
    currentFrame:0,
    totalFrames:0,
    //fps:15,
    //duration:1000,
    //_timer:null,
    frames:null,
    _init:function (options) {
        this.ele=options.ele;
        this.width=options.width||this.ele.clientWidth;
        this.height=options.width||this.ele.clientHeight;
        this.totalFrames=options.totalFrames;
        //this.setFps(options.fps);
        //this.duration=parseInt(1000/this.fps);
        //if(options.autoPlay){
        //    this.play();
        //}
    },
    setX:function (x) {
        this.x=x;
        
    },
    setY:function (y) {
        this.y=y;
    },
    /**
     * 绘出内容，切换帧。
     * 扩展Sprite，要实现draw。
     * 可用于canvas，要实现全局的帧执行器，类似flash的帧
     */
    draw:function(){
        
    },
    /**
     * 开始动画
     */
    play:function () {
        this.enable=true;
    },
    /**
     * 停止
     */
    stop:function () {
        this.enable=false;
        //clearTimeout(this._timer);
    },
    /**
     * 设置当前帧
     * @param {Object} frNumber
     */
    setFrame:function (frNumber) {
        if(frNumber>=this.totalFrames||frNumber<0){
            this.currentFrame=0;
        }else{
            this.currentFrame=frNumber;
        }
    },
    getFrame:function() {
        return this.currentFrame;
    },
    nextFrame:function() {
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    },
    prevFrame:function() {
        if (this.currentFrame == 0) {
                this.currentFrame = this.totalFrames - 1;
        } else {
                this.currentFrame--;
        }
    },
    gotoAndPlay:function(frNumber){
        this.setFrame(frNumber);
        this.play();
    },
    gotoAndStop:function(frNumber){
        this.setFrame(frNumber);
        this.stop();
    }
//    ,
//    /**
//     * 设置帧频
//     * @param {Object} fps
//     */
//    setFps:function(fps){
//        if(fps){
//            this.fps=fps;
//        }
//    }
}

function HtmlSprite(options) {
    this._init(options);
}
HtmlSprite.prototype={
    fps:15,
    duration:1000,
    _timer:null,
    _init:function (options) {
        this.ele=options.ele;
        this.width=options.width||this.ele.clientWidth;
        this.height=options.width||this.ele.clientHeight;
        this.totalFrames=options.totalFrames;

        if(options.autoPlay){
            this.play();
        }
    },
    draw:function  () {
        this.ele.style.left=this.x+"px";
        this.ele.style.top=this.y+"px";
        if(this.enable){
            var px=-this.width*this.currentFrame;
            this.ele.style.backgroundPosition=px+"px 0";
        }
    },
    /**
     * 设置帧频
     * @param {Object} fps
     */
    setFps:function(fps){
        if(fps){
            this.fps=fps;
        }
    }
}
//HtmlSprite继承Sprite
for(var i in Sprite.prototype){
    if(HtmlSprite.prototype[i]==null){
        HtmlSprite.prototype[i]=Sprite.prototype[i];
    }
}
