(function  () {
    /**
     * 每帧可以自己定义显示时长
     */
   var AnimationVariable=yhge.core.Class({
        overrides:{
            classname:"AnimationVariable",

            _enable:true,
            _currentFrame:0,
            _frameCount:0,//兼容其它语言
            _totalDuration:0,
            _frames:null,
            _elapsed:0,

            initialize: function(props) {
                console.log("init "+this.classname);
                this._frames=[];
                this._durations=[];
            },

            /**
             * 使用时间间隔，当前时间只取一次就可以
             */
            update: function(delta) {
                if(this._enable){
                    this._elapsed+=delta;
                    this._currentFrame=this._getIndex();
//                    if(this._currentFrame==this._frameCount-1){//这样判断不准确，如果delta比较大，则会跳过尾帧，除了动作类游戏，一般不用。
//                                                                //但是动作类游戏的动作发生不一定在,在尾帧，所以加这个用处不大。
//                        //TODO a loop event
//                    }
                }
            },
            /**
             * 折半查找
             */
            _getIndex:function(){
                //this._elasped>0
                var elapsed=this._elapsed % this._totalDuration;
                
                if(elapsed==0) return this._frameCount-1;
                if(elapsed<=this._durations[0]) return 0;
                
                var min=0,max=this._frameCount-1,mid;
                do{
                	 mid=Math.floor((min+max)/2);
                    if(this._durations[mid]>elapsed){
                        max=mid;
                    }else if(this._durations[mid]<elapsed){
                        min=mid;
                    }else{
                        break;
                    }
                   // mid=Math.floor((min+max)/2);
                }while(max-min>1);
                return mid==min?mid+1:mid;
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

            addFrame: function(frame,duration,index) {
                if(index==null) {
                    this._frames.push(frame);
                } else {
                    this._frames.splice(index,0,frame);
                }
                this._frameCount++;
                this._totalDuration+=duration;
                this._durations.push(this._totalDuration);
            },

            removeFrame: function(frame) {
            	var index;
                if(typeof frame=="number") {
                    if(frame<0 || frame>=this._frames.length) return;
                    index=frame;
                    frame=this._frames.splice(frame,1);
                } else {
                    var i=this._frames.indexOf(frame);
                    if(i<0) return;
                    this._frames.splice(i,1);
                    index=i;
                }
                this._frameCount--;
                this._updateDurationSeque(index);
            },
			_updateDurationSeque:function(index){
				if(index<0 && index>=this._durations.length) return;
				var duration=this._durations[index]-this._durations[index-1];
                this._totalDuration-=duration;
                this._durations.splice(index,1);
                for(var i=index,l=this._durations.length;i<l;i++){
                	this._durations[i]-=duration;
                }
			},
            getFrame: function(index) {
                return index>-1 && index<this._frameCount? this._frames[index] : null;
            },

            getCureentFrame: function() {
                return this._frames[this._currentFrame];
            }
            
        }
   });
   yhge.renderer.AnimationVariable=AnimationVariable;
   yhge.animation.AnimationVariable=AnimationVariable;
})();