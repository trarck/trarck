(function  () {
    var Scheduler=yhge.times.Scheduler;

    //根据不同平台实现定时器功能。
    var FxAnimate=function  () {
        this.initialize.apply(this,arguments);
    };
    FxAnimate.prototype={
        
        initialize:function  (scheduler) {
            this._tasks={};
            this._length=0;
            this.taskIdIndex=1;
            //regeist to scheduler
            this._scheduler=scheduler;
            //Timer._instance=this;
        },
        _run:function  (delta) {
            var targetTasks,task;
            for(var i in this._tasks){
                targetTasks=this._tasks[i];
                for(var j=0,l=targetTasks.length;j<l;j++){
                    task=targetTasks[j];
                    task.action.call(task.content);
                }
            }
        },
        //delay为0则表示和更新器时间同步。如果delay小于每帧的间隔时间，则和最小帧时间同步，也就是同步update。
        start:function  (node,fun,scope) {
            if(this._length==0) this._scheduler.addTask(this._run,Scheduler.Timer,this);
            var id=node._fxTaskId_;
            if(!id){
                id=this.taskIdIndex++;
                node._fxTaskId_=id;
                this._length++;
            }
            if(!this._tasks[id]) this._tasks[id]=[];
            this._tasks[id].push({action:fun,content:scope||node});

            return id;
        },
        stop:function  (node,gotoEnd) {
            var id=node._fxTaskId_;
            if(id) {
                if(gotoEnd){
                    var targetTasks=this._tasks[id],task;
                    for(var j=0,l=targetTasks.length;j<l;j++){
                        task=targetTasks[j];
                        task.action.call(task.content,true);
                    }
                }
                delete this._tasks[id];
                delete node._fxTaskId_;
                this._length--;
            }
            if(this._length==0) this._scheduler.removeTask(this._run);
        },

        setScheduler:function(scheduler){
            this._scheduler=scheduler;
            return this;
        },
        getScheduler:function(){
            return this._scheduler;
        }
    };

	var instance=null;
	FxAnimate.getInstance=function(){
		if(!instance) instance=new FxAnimate();
		return instance;
	};

	yhge.fx.FxAnimate=FxAnimate;
})();