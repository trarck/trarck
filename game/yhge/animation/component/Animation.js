(function  () {
    var LOOP_UPDATE=2
    /**
     * 每帧显示时长固定
     */
    var Animation=yhge.core.Class({
        overrides:{
            classname:"Animation",
            _enable:true,
            _currentFrame:0,
            _frameCount:0,//兼容其它语言
            _totalDuration:0,
            _frames:null,
            _elapsed:0,

            initialize: function(props) {
                console.log("init "+this.classname);
                this._frames=[];
                this._duration=props && props.duration||30;//每帧的显示时间

                //设置update函数
                if(typeof props.update=="function"){
                    this.update=props.update;
                }else{
                    switch (props.u) {
                        case :
                    
                    }
                }
            },

            /**
             * 使用时间间隔，当前时间只取一次就可以
             */
            update: function(delta) {
                if(this._enable){
                    this._elapsed+=delta;
                    //deltaFrame=delta/this._duration;
                    //this._currentFrame=Math.floor(this._frameCount*this._elapsed/this._totalDuration)%this._frameCount;
                    this._currentFrame=Math.floor(this._elapsed/this._duration)%this._frameCount;
//                    if(this._currentFrame==this._frameCount-1){//这样判断不准确，如果delta比较大，则会跳过尾帧，除了动作类游戏，一般不用。
//                                                                //但是动作类游戏的动作发生不一定在,在尾帧，所以加这个用处不大。
//                        //TODO a loop event
//                    }
                }
            },
            
            /**
             * 开始动画
             */
            play: function () {
                this._enable=true;
            },

            /**
             * 停止
             */
            stop: function () {
                this._enable=false;
            },

            /**
             * 设置当前帧
             * @param {number} frNumber
             */
            setCurrentFrame: function (frNumber) {
                // if(frNumber>=this._frameCount){
                // this._currentFrame=this._frameCount-1;
                // }else if(frNumber<0){
                // this._currentFrame=0;
                // }else{
                // this._currentFrame=frNumber;
                // }
                this._currentFrame=frNumber<0?0:(frNumber>=this._frameCount?this._frameCount-1:frNumber);
            },

            getCurrentFrameIndex: function() {
                return this._currentFrame;
            },

            nextFrame: function() {
                this._currentFrame = (this._currentFrame + 1) % this._frameCount;
                this.stop();
            },

            prevFrame: function() {
                if (this._currentFrame == 0) {
                    this._currentFrame = this._frameCount - 1;
                } else {
                    this._currentFrame--;
                }
                this.stop();
            },

            gotoAndPlay: function(frNumber) {
                this.setCurrentFrame(frNumber);
                this.play();
            },

            gotoAndStop: function(frNumber) {
                this.setCurrentFrame(frNumber);
                this.stop();
            },

            addFrame: function(frame,index) {
                if(index==null) {
                    this._frames.push(frame);
                } else {
                    this._frames.splice(index,0,frame);
                }
                //this._frameCount=this._frames.length;
                this._frameCount++;
                this._totalDuration+=this._duration;
            },

            removeFrame: function(frame) {
                if(typeof frame=="number") {
                    if(frame<0 || frame>=this._frames.length) return;
                    this._frames.splice(frame,1);
                } else {
                    var i=this._frames.indexOf(frame);
                    if(i<0) return;
                    this._frames.splice(i,1);
                }
                this._frameCount--;
                this._totalDuration-=this._duration;
            },

            getFrame: function(index) {
                return index>-1 && index<this._frameCount? this._frames[index] : null;
            },

            getCureentFrame: function() {
                return this._frames[this._currentFrame];
            },
            setDuration:function(duration) {
                this._duration = duration;
                return this;
            },
            getDuration:function() {
                return this._duration;
            }
        }
    });
    //Animation update type
    Animation.DefaultUpdateType=1;
    Animation.LoopUpdateType=2;
    Animation.ActionUpdateType=3;
    Animation.GroupUpdateType=4;

    function loopUpdate(delta) {
        
    }

    function actionUpdate(delta) {
        
    }
    
    function groupUpdate(delta,deltaFrame) {
        
    }


    yhge.renderer.Animation=Animation;
    yhge.animation.Animation=Animation;
})();