(function  () {
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
            _duration:30,//每帧的显示时间

            initialize: function(props) {
                console.log("init "+this.classname);
                this._frames=[];
                (props && props.duration) && (this._duration=props.duration);
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
             * 对于固定animation可以加入组中，执行些方法;加入AnimationManager中，执行update方法。
             * 使用些方法，可以少一个GroupAnimation类。
             */
            updateGroup:function (delta,deltaFrame) {
                if(this._enable){
                    this._currentFrame=(this._currentFrame+deltaFrame)%this._frameCount;
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
                return this;
            },

            getCurrentFrameIndex: function() {
                return this._currentFrame;
            },

            nextFrame: function() {
                this._currentFrame = (this._currentFrame + 1) % this._frameCount;
                this.stop();
                return this;
            },

            prevFrame: function() {
                if (this._currentFrame == 0) {
                    this._currentFrame = this._frameCount - 1;
                } else {
                    this._currentFrame--;
                }
                this.stop();
                return this;
            },

            gotoAndPlay: function(frNumber) {
                this.setCurrentFrame(frNumber);
                this.play();
                return this;
            },

            gotoAndStop: function(frNumber) {
                this.setCurrentFrame(frNumber);
                this.stop();
                return this;
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
                return this;
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
                return this;
            },

            getFrame: function(index) {
                return index>-1 && index<this._frameCount? this._frames[index] : null;
            },

            getCureentFrame: function() {
                return this._frames[this._currentFrame];
            },
            setFrames:function (frames) {
                this._frames=frames;
                this._frameCount=frames.length;
                this._totalDuration=this._duration*this._frameCount;
                return this;
            },
            addFrames:function (frames,index) {
                if(index==null) {
                    this._frames=this._frames.concat(frames);
                } else {
                    var args=[index,0].concat(frames);
                    this._frames=Array.prototype.splice.apply(this._frames,args);
                }
                this._frameCount+=frames.length;
                this._totalDuration=this._duration*frames.length;
                return this;
            },
            getFrames:function () {
                return this._frames;
            },
            getFramesCount:function () {
                return this._frameCount;
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
    yhge.renderer.Animation=Animation;
    yhge.animation.Animation=Animation;
})();