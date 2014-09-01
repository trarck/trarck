(function  () {
    var Scheduler=yhge.times.Scheduler;

    var keyIndex=1;
    //根据不同平台实现定时器功能。
    var AnimationManager=yhge.times.AnimationManager=function  () {
        this.initialize.apply(this,arguments);
    };
    AnimationManager.prototype={
        
        initialize:function  (scheduler) {
            this._animations={};
            this._length=0;
            scheduler && scheduler.addTask(this._run,Scheduler.Animation,this);
        },
        _run:function  (delta) {
            for(var i in this._animations){
                this._animations[i].update(delta);
            }
        },
        add:function  (animation) {
            this._animations[keyIndex++]=animation;
            this._length++;
            return this;
        },
        remove:function  (animation) {
            for(var i in this._animations){
                if(this._animations[i]==animation){
                    delete this._animations[i];
                    this._length--;
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