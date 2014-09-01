(function  () {
    var Scheduler=yhge.times.Scheduler;

    //根据不同平台实现定时器功能。
    var Timer=yhge.times.Timer=function  () {
        this.initialize.apply(this,arguments);
    };
    Timer.prototype={
        
        initialize:function  (scheduler) {
            this._tasks={};
            this._length=0;
            this.taskIdIndex=1;
            //regeist to scheduler
            scheduler && scheduler.addTask(this._run,yhge.times.Scheduler.Timer,this);
            //Timer._instance=this;
        },
        _run:function  (delta) {
            //for(var i=0,l=this._tasks.length,task;i<l;i++){
            //由于在一轮中，可能有新的任务加进来，为了即时处理，数组长度可能动态改变。
            //主要是防范删除task除错，对于新加进行来的任务放在下一轮中处理完全可以。
            //使用延迟执行的办法来防止删除。
            var delays=[];
            for(var i=0,task;i<this._tasks.length;i++){
                task=this._tasks[i];
                task.leftTime-=delta;
                if(task.leftTime<=0){
                    //TODO support args
                    //task.args[0]=delta
                    //task.action.apply(task.content,task.args);
                    delays.push(task);
                    if(task.times && --task.times==0){   
                        this._tasks.splice(i--,1);
                    }else{
                        task.leftTime+=task.delay;
                    }
                }
            }
            for(var i=0,l=delays.length,task;i<l;i++){
                task=delays[i];
                task.action.apply(task.content,task.args);
            }
        },
        //delay为0则表示和更新器时间同步。如果delay小于每帧的间隔时间，则和最小帧时间同步，也就是同步update。
        add:function  (fun,delay,times,scope,args) {
            var id=this.taskIdIndex++;
            this._tasks[id]={action:fun,delay:delay,times:times,leftTime:delay,content:scope,args:args,id:id};
            this._length++;
            return id;
        },
        remove:function  (id) {
            delete this._tasks[id];
            this._length--;
        },

        setTimeout:function  (fun,delay) {
            var args=Array.prototype.slice.call(arguments,1),//the first for delta
            return this.add(fun,delay,1,null,args);
        },
        clearTimeout:function  (id) {
            this.remove(id);
        },
        setInterval:function(fun,delay){
            var args=Array.prototype.slice.call(arguments,2),
            return this.add(fun,delay,0,null,args);
        },
        clearInterval:function  (id) {
            this.remove(id);
        },
        //移动到Updater里
        schedule:function(scope,fun,interval){
            return this.add(fun,delay,0,scope,args);
        },
        unschedule:function (scope,fun) {
            for(var task,i=0;i<this._tasks.length;i++){//length 需要每次计算
                task=this._tasks[i];
                if( task.action==fun &&( !scope || task.content==scope)){
                    this._tasks.splice(i,1);
                }
            }
        },
        scheduleUpdate:function (target) {
            var fun=target.update;
            if(fun){
                this.schedule(target,fun,0);
            }
        },
        unscheduleUpdate:function (target) {
            var fun=target.update;
            if(fun){
                this.unschedule(target,fun);
            }
        }
    };

    Timer.getInstance=function  (scheduler) {
        if (!this._instance) {
            this._instance = new Timer(scheduler);
        }
        return this._instance;
    }
})();