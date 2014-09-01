function Sprite(options) {
    this._init(options);
}
Sprite.prototype={
    x:0,
    y:0,
    width:0,
    height:0,
    rotation:0,
    enabled:true,
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
    /**
     * 开始动画
     */
    play:function () {
        this.enabled=true;
        //this.start();
    },
    /**
     * 停止
     */
    stop:function () {
        this.enabled=false;
        //clearTimeout(this._timer);
    },
    /**
     * 进入初始帧
     * @param {Object} frNumber
     * @param {Object} isstop true 进入并停止
     */
    gotoFrame:function (frNumber,isstop) {
        this.setCurrentFrame(frNumber);
        isstop&&this.stop();
    },
//    /**
//     * 动画过程
//     */
//    start:function () {
//        this.draw();
//        if(this.enabled){
//            var self=this;
//            this._timer=setTimeout(function () {
//                self.start();
//            },this.duration);
//        }
//    },
    /**
     * 绘出内容，切换帧。
     * 扩展Sprite，要实现draw。
     * 可用于canvas，要实现全局的帧执行器，类似flash的帧
     */
    draw:function(){
        var px=-this.width*this.currentFrame;
        this.ele.style.backgroundPosition=px+"px 0";
        this.setCurrentFrame(this.currentFrame+1);
    },
    /**
     * 设置当前帧
     * @param {Object} frNumber
     */
    setCurrentFrame:function (frNumber) {
        if(frNumber>=this.totalFrames||frNumber<0){
            this.currentFrame=0;
        }else{
            this.currentFrame=frNumber;
        }
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