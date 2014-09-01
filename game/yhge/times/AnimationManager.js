(function  () {
    var Scheduler=yhge.times.Scheduler;

    //根据不同平台实现定时器功能。
    var AnimationManager=yhge.times.AnimationManager=function  () {
        this.initialize.apply(this,arguments);
    };
    AnimationManager.prototype={
        
        initialize:function  (scheduler) {
            this._animations=[];
            scheduler && scheduler.addTask(this._run,Scheduler.Animation,this);
        },
        _run:function  (delta) {
            //防止更新是有删除会出现异常
            var animations=this._animations.slice();
            for(var i=0,l=animations.length;i<l;i++){
                animations[i].update(delta);
            }
        },
        add:function  (animation) {
            this._animations.push(animation);
            return this;
        },
        remove:function  (animation) {
            for(var i=0,l=this._animations.length;i<l;i++){
                if(this._animations[i]==animation){
                    this._animations.splice(i,1);
                }
            }
            return this;
        }
    };

    AnimationManager.getInstance=function  (scheduler) {
        if (!this._instance) {
            this._instance = new AnimationManager(scheduler);
        }
        return this._instance;
    }
})();