(function  () {
    var AnimationVariable=yhge.animation.AnimationVariable;
    /**
     * 每帧显示时长固定
     */
    var LoopAnimationVariable=yhge.core.Class({
        extend:AnimationVariable,
        overrides:{
            classname:"LoopAnimationVariable",
            _loop:0,//循环次数。0-无阻循环
            _remainTimes:0,//剩余次数

            /**
             * 使用时间间隔，当前时间只取一次就可以
             */
            update: function(delta) {
//                LoopAnimationVariable._super_.update.call(this,delta);
//                if(this._enable && this._loop){
//                    var loopTimes=Math.ceil(this._elapsed/this._totalDuration);
//                    if(loopTimes>this._loop){
//                        this.stop();
//                        //TODO callback or event
//                    }
//                }
                if(this._enable){
                    this._elapsed+=delta;
                    this._currentFrame=this._getIndex();
                    //loop为0则表示，永久循环下去
                    if(this._loop ){
                        var loopTimes=Math.ceil(this._elapsed/this._totalDuration);
                        if(loopTimes>this._loop){
                            this.stop();
                            //TODO callback or event
                        }
                    }
                }
            },
            setLoop:function(loop) {
                this._loop = loop;
                this._remainTimes=loop?loop:0;
                return this;
            },
            getLoop:function() {
                return this._loop;
            }
        }
    });
    yhge.renderer.LoopAnimationVariable=LoopAnimationVariable;
    yhge.animation.LoopAnimationVariable=LoopAnimationVariable;
})();