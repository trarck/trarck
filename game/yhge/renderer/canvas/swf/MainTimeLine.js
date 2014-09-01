(function () {
    var YhgeAnimation=yhge.animation.Animation;
    var MaxDeltaFrame=50;
    var MainTimeLine=yhge.core.Class(yhge.core.Accessor,{
        classname:"MainTimeLine",
        _elapsed:0,
        _duration:0,
        _frame:0,
        _nextFrame:0,
        _frameRate:60,
        _frameSkipAble:true,
        _root:null,//root movieclip
        initialize: function(props) {
            this.setAttributes(props);
            this._maxDelta=MaxDeltaFrame*1000/this._frameRate;
        },
        update:function(delta){
            //主时间轴始终可用，当处理暂停状态是，整个时钟会停止。
            if(this._frameSkipAble){
                if(delta>this._maxDelta) delta=this._duration;
//                //累加式
//                var deltaFrame=Math.round(delta*this._frameRate/1000);
//                if(deltaFrame>0){
//                    this._root.update(delta,deltaFrame);
//                    this._frame+=deltaFrame;
//                }

                //统计式。delta累积起来，消除单次的误差。
                this._elapsed+=delta;
                this._nextFrame=Math.floor(this._elapsed*this._frameRate/1000);
                if(this._nextFrame>this._frame){
                    for(;this._frame<this._nextFrame;this._frame++)
                        this._root.update(delta,1);
                    //this._frame=this._nextFrame;
                }
            }else{
                this._frame++;
                this._root.update(delta,1);
            }
        },
        //第一帧能够运行。使用update会把0，1二帧一起执行。
        updateFirst:function(){
            this._root.update(0,0);
        },
        //rate的单位是HZ
        setFrameRate:function (rate) {
            this._frameRate=rate;
            this._duration=1000/rate;
            return this;
        },
        getFrameRate:function(){
            return this._frameRate;
        },
        //duration单位是毫秒
        setDuration:function (duration) {
            this._frameRate=1000/duration;
            this._duration=duration;
            return this;
        },
        getDuration:function(){
            return this._duration;
        },
        setRoot:function (root) {
            this._root=root;
            return this;
        },
        getRoot:function () {
            return this._root;
        }
    });
    yhge.renderer.canvas.swf.MainTimeLine=MainTimeLine;
})();