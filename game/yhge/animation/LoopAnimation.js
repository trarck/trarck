(function  () {
    var Animation=yhge.animation.Animation;
    /**
     * 每帧显示时长固定
     */
    var LoopAnimation=yhge.core.Class({
        extend:Animation,
        overrides:{
            classname:"LoopAnimation",
            _loop:0,//循环次数。0-无阻循环
            _loopTimes:0,
            /**
             * 使用时间间隔，当前时间只取一次就可以
             */
            update: function(delta) {
//                LoopAnimation._super_.update.call(this,delta);
//                if(this._enable && this._loop){
//                    var loopTimes=Math.ceil(this._elapsed/this._totalDuration);
//                    if(loopTimes>this._loop){
//                        this.stop();
//                        //TODO callback or event
//                    }
//                }
                if(this._enable){
                    this._elapsed+=delta;
                    var frame=Math.floor(this._elapsed/this._duration);
                    this._currentFrame=frame%this._frameCount;
                    //loop为0则表示，永久循环下去
                    //_loopTimes放在外面，可取得循环了多少次。如果使用loop了，多少次则会有，如果不使用loop则，自然不关心loop多少次。没必要放在外面。
                    //this._loopTimes=Math.ceil(frame/this._frameCount);
                    if(this._loop ){
                        //_loopTimes放在里面可提高性能
                        this._loopTimes=Math.ceil(frame/this._frameCount);
                        if(this._loopTimes>this._loop){
                            this.stop();
                            //TODO callback or event
                            this.didAnimationFinished();
                        }
                    }
                }
            },
            updateGroup:function (delta,deltaFrame) {
                if(this._enable){
                    var nextFrame=this._currentFrame+deltaFrame;
                    this._currentFrame=nextFrame%this._frameCount;
                    //loop为0则表示，永久循环下去
                    //_loopTimes放在外面，可取得循环了多少次
                    //if(nextFrame>=this._frameCount) this._loopTimes+=Math.floor(nextFrame/this._frameCount);
                    if(this._loop ){
                        //_loopTimes放在里面可提高性能
                        if(nextFrame>=this._frameCount) this._loopTimes+=Math.floor(nextFrame/this._frameCount);
                        if(loopTimes>this._loop){
                            this.stop();
                            //TODO callback or event
                            this.didAnimationFinished();
                        }
                    }
                }
            },
            setLoop:function(loop) {
                this._loop = loop;
                return this;
            },
            getLoop:function() {
                return this._loop;
            },
            didAnimationFinished:function () {
                
            }
        }
    });
    yhge.renderer.LoopAnimation=LoopAnimation;
    yhge.animation.LoopAnimation=LoopAnimation;
})();