(function  () {
    var Scheduler=yhge.times.Scheduler;

    //根据不同平台实现定时器功能。
    var SingleSceneUpdater=function  () {
        this.initialize.apply(this,arguments);
    };
    SingleSceneUpdater.prototype={

        classname:"SingleSceneUpdater",

        initialize:function  (scheduler,context) {
            this._context=context;
            scheduler.addTask(this._run,Scheduler.Render,this);
            this.updateTimes=0;
        },
        _run:function  (delta) {
            this.updateTimes++;
            //update scene draw
            this._scene.render(this._context);
        },
        setScene:function  (scene) {
            this._scene=scene;
            return this;
        }
    };

    SingleSceneUpdater.getInstance=function  (scheduler,context) {
        if (!this._instance) {
            this._instance = new SingleSceneUpdater(scheduler,context);
        }
        return this._instance;
    };
    yhge.scene.SingleSceneUpdater=SingleSceneUpdater;
})();