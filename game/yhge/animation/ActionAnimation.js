(function  () {
    var Animation=yhge.animation.Animation;

    var actionId=0;
    /**
     * 每帧显示时长固定
     * 由于每帧都可以执行动作，实现loop的功能更灵活，就不继承LoopAnimation.
     * action和render分开。便于代码的便写和逻辑清楚。
     * frames里保存的是render信息。
     * actions保存的脚本相关数据。
     * 如果action和frames在一起，则在准备每个frame时，还要带上action数据。
     * 修改action也不方便
     * action方面，_currentActionFrame作为主要帧号。
     */
    var ActionAnimation=yhge.core.Class({
        extend:Animation,
        overrides:{
            classname:"ActionAnimation",
            _loop:0,//循环次数。0-无阻循环
            _totalFrame:0,
            _deltaFrame:0,
            _currentActionFrame:0,
            _totalActionFrame:0,

            initialize: function(props) {
                this._actions=[];
                ActionAnimation._super_.initialize.apply(this,arguments);
            },

            /**
             * 使用actionFrame，则无需使用inUpdate,deltaFrame等变量，可以完美实现跳转，并支持跳帧下的跳转。
             * @param frNumber
             */
            setCurrentFrame: function (frNumber) {
                if(this._currentActionFrame==frNumber) return;

                ActionAnimation._super_.setCurrentFrame.apply(this,arguments);

                var diff=this._currentFrame-this._currentActionFrame;
                this._currentActionFrame=this._currentFrame;

                this._totalFrame+=diff;
                this._totalActionFrame+=diff;
                if(this._duration){
                    this._elapsed+=diff*this._duration;
                }

                this.doAction(this._currentActionFrame);
                return this;
            },

//            /**
//             * 执行gotoFrame会影响后面执行代码。不像flash,gotoFrame的代码会在gotoFrame调用前执行。
//             * 以显示帧为主。当跳帧时，对于nextFrame,prevFrame不好处理。
//             * @param frNumber
//             */
//            setCurrentFrame: function (frNumber) {
//                if(this._currentActionFrame==frNumber) return;
//
//                var before=this._currentFrame;
//                ActionAnimation._super_.setCurrentFrame.apply(this,arguments);
//                var diff=this._currentFrame-before;
//                this._totalFrame+=diff;
//                //如果是在update里，循环结束后要对_totalActionFrame加1，所以这里和_totalFrame相等。
//                //如果是在update外，因为totalActionFrame要比totalFrame大1，所以要加1.
//                //不能直接使用_totalActionFrame+=diff,如果遇到跳帧，则diff不准确。所以_inUpdate是必须的。
//                this._totalActionFrame=this._inUpdate?this._totalFrame:this._totalFrame+1;
//                this._currentActionFrame=this._currentFrame;
//                if(this._duration){
//                    this._elapsed+=diff*this._duration;
//                }
//                this.doAction(this._currentActionFrame);
//
//                //如果跳帧，则要执行后续帧的action
//                if(this._inUpdate && this._deltaFrame>0){
//                    this._totalFrame+=this._deltaFrame;
//                    this._currentFrame=this._totalFrame%this._frameCount;
//                }
//                return this;
//            },

            nextFrame: function() {
//                if(this._inUpdate && this._deltaFrame>0){
//                    this.setCurrentFrame((this._totalFrame-this._deltaFrame)%this._frameCount);
//                }else{
//                    this.setCurrentFrame(this._currentFrame+1);
//                }
//
//                if(this._inUpdate){
//                    this.setCurrentFrame(this._currentActionFrame+1);
//                }else{
//                    this.setCurrentFrame(this._currentFrame+1);
//                }
                this.setCurrentFrame(this._currentActionFrame+1);
                return this;
            },

            prevFrame: function() {
                var prevFrameIndex=this._currentActionFrame==0?this._frameCount-1:this._currentActionFrame-1;
                this.setCurrentFrame(prevFrameIndex);
                return this;
            },

            /**
             * 使用时间间隔，当前时间只取一次就可以
             */
            update: function(delta) {
                if(this._enable){
//                    this._inUpdate=true;
                    this._elapsed+=delta;
//                    var totalFrame=Math.floor(this._elapsed/this._duration);
//                    this._deltaFrame=totalFrame-this._totalFrame;
//                    this._totalFrame=totalFrame;
                    this._totalFrame=Math.floor(this._elapsed/this._duration);
                    this._currentFrame=(this._totalFrame)%this._frameCount;

                    //parse action
                    //action frame小于等于render frame则执行直到frder frame的action
                    //结束条件加入enable判断，主要是防止delta大于一帧时，在某一帧调用stop，其后应该不执行。
                    for(;this._totalActionFrame<=this._totalFrame && this._enable;this._totalActionFrame++){
//                        this._deltaFrame--;
                        this._currentActionFrame=(this._totalActionFrame)%this._frameCount;
                        //在action里如果要取得当前帧号，则用this._currentActionFrame
                        this.doAction(this._currentActionFrame);
                    }
                    //在跳帧的时候可能会在中间的某个帧就stop了。要对总时间进行修正。
                    if(!this._enable){
                        var diff=this._totalFrame-this._totalActionFrame+1;
                        if(diff>0){
                            this._totalFrame-=diff;
                            this._elapsed-=diff*this._duration;
                            this._currentFrame=(this._totalFrame)%this._frameCount;
                        }
                    }
//                    this._inUpdate=false;
                }
            },
            /**
             * 使用时间间隔，当前时间只取一次就可以
             */
            updateGroup: function(delta,deltaFrame) {
                if(this._enable){
//                    this._inUpdate=true;
                    this._totalFrame+=deltaFrame;
                    this._currentFrame=(this._totalFrame)%this._frameCount;
//                    this._deltaFrame=deltaFrame;
                    //parse action
                    //action frame小于等于render frame则执行直到frder frame的action
                    //如果只有一帧，delta时间过大，则会多次执行第一帧的action
                    for(;this._totalActionFrame<=this._totalFrame && this._enable;this._totalActionFrame++){
//                        this._deltaFrame--;
                        this._currentActionFrame=(this._totalActionFrame)%this._frameCount;
                        this.doAction(this._currentActionFrame);

                    }
                    //在跳帧的时候可能会在中间的某个帧就stop了。要对总时间进行修正。
                    if(!this._enable){
                        var diff=this._totalFrame-this._totalActionFrame+1;
                        if(diff>0){
                            this._totalFrame-=diff;
//                            if(this._duration){
//                                this._elapsed-=diff*this._duration;
//                            }
                            this._currentFrame=(this._totalFrame)%this._frameCount;
                        }
                    }

//                    //after for  this._deltaFrame=0;
//                    this._inUpdate=false;
                }
            },

            setActions:function(actions) {
                this._actions = actions||[];
                return this;
            },
            getActions:function() {
                return this._actions;
            },

            /**
             *
             * @param action
             * {
             *     action:function
             *     context:object,
             *     arguments:array
             *     priority:int
             * }
             * @param frame
             */
            //支持优先级
            addAction:function(action,frame){
                var actions=this._actions[frame];
                if(!actions){
                    actions=this._actions[frame]=[];
                }
                if(action.priority==null) action.priority=0;
                if(action.context==null) action.context=this;

                for(var i=0,l=actions.length;i<l;i++){
                    //同样priority，先添加先执行,如果同样的优先级，则要多对比这些优先级。
                    if(action.priority>actions[i].priority){
                        break;
                    }
                }
                action.id=++actionId;
                actions.splice(i,0,action);
                return action.id;
                //acions.push(action);
            },

            addActions:function(actions,frame){
                var ids=[];
                for(var i in actions){
                    ids[i]=this.addAction(actions[i],frame);
                }
                return ids;
            },

            /**
             * actions key 是frame index
             * @param actions
             */
            addActionsMap:function(actions){
                var ids={};
                for(var frame in actions){
                    ids[frame]=actions[frame] instanceof Array?this.addActions(actions[frame],frame):this.addAction(actions[frame],frame);
                }
                return ids;
            },

            removeAction:function(action,frame){
                var actions=this._actions[frame];
                if(actions){
                    var index=actions.indexOf(action);
                    if(index>-1) actions.splice(index,1);
                }
            },

            removeActions:function(actions,frame){
                for(var i in actions){
                    this.removeAction(actions[i],frame);
                }
            },

            removeActionsMap:function(actions){
                for(var frame in actions){
                    actions[frame] instanceof Array? this.removeActions(actions[frame],frame):this.removeAction(actions[frame],frame);
                }
            },

            removeActionsAll:function(frame){
                delete this._actions[frame];
            },

            doCurrentFrameAction:function () {
				this.doAction(this._currentActionFrame);
            },

            doAction:function (frame) {
                var actions=this._actions[frame];
                if(actions){
                    var action;
                    for(var i=0,l=actions.length;i<l;i++){
                        action=actions[i];
                        action.action.apply(action.context||this,action.arguments);
                    }
                }
            }
        }
    });
    yhge.renderer.ActionAnimation=ActionAnimation;
    yhge.animation.ActionAnimation=ActionAnimation;
})();