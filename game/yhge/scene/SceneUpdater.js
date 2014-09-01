(function  () {
    var Scheduler=yhge.times.Scheduler;

    //根据不同平台实现定时器功能。
    var SceneUpdater=yhge.scene.SceneUpdater=function  () {
        this.initialize.apply(this,arguments);
    };
    SceneUpdater.prototype={

        classname:"SceneUpdater",

        initialize:function  (scheduler,context) {
            this._scenes=[];
            this._context=context;
            scheduler.addTask(this._run,Scheduler.Render,this);
            this.updateTimes=0;
        },
        _run:function  (delta) {
            this.updateTimes++;
            //update scene draw
            for(var i=0,l=this._scenes.length,task;i<l;i++){
                this._scenes[i].render(this._context,delta);
            }
        },
        add:function  (scene) {
            this._scenes.push(scene);
            return this;
        },
        remove:function  (scene) {
            for(var i=0,l=this._scenes.length;i<l;i++){
                if(this._scenes[i]==scene){
                    this._scenes.splice(i,1);
                }
            }
            return this;
        }
    };

    SceneUpdater.getInstance=function  (scheduler,context) {
        if (!this._instance) {
            this._instance = new SceneUpdater(scheduler,context);
        }
        return this._instance;
    }
})();