(function(){
    //fix requestAnimationFrame
    window.requestAnimationFrame= window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    var SchedulerState={
        Stop:0,
        Start:1
    };
    //根据不同平台实现定时器功能。
    var Scheduler=function  () {
        this.initialize.apply(this,arguments);
    };

    Scheduler.prototype={
        
        _interval:20,//时间间隔
        _state:0,//状态0,停止,1-开始

        initialize:function  (props) {
            this._interval=props && props.interval!=null?props.interval:this._interval;
            this._forceInterval=props && props.forceInterval && this._interval;
            this._tasks=[];
        },
        run:function  () {
            if(this._state==SchedulerState.Start) return;
            this._state=SchedulerState.Start;

            var self=this;
            this._lastTime=(new Date()).getTime();
            if ( window.requestAnimationFrame && !this._forceInterval) {
                this._runType=2;
                self.timerId = true;
                raf = function() {
                    // When timerId gets set to null at any point, this stops
                    if ( self.timerId ) {
                        window.requestAnimationFrame( raf );
                        self.tick();
                    }
                };
                window.requestAnimationFrame( raf );
            } else {
                this._runType=1;
                self.timerId = setInterval(function  () {
                     self.tick();
                }, this._interval);
            }
        },
        stop:function  () {
            if(this._state==SchedulerState.Stop) return;
            this._state=SchedulerState.Stop;
            switch (this._runType) {
                case 1:
                    clearInterval(this.timerId);
                    break;
                case 2:
                    this.timerId=null;
                    break;
            }
        },
        tick:function  () {
            var now=(new Date()).getTime(),delta=now-this._lastTime;
            //直接循环可能会出错。
            //比如，如果在循环中某个task删除了另一个task，如果是当前task之后的，则没有影响，如果是之前的，则会使循环的index错位，导致下一个task会被跳过。
            //解决办法：一、把task数组tasks拷贝一份，在拷贝上进行循环执行。
            //            二、不使用数组，使用hashmap。由于涉及优先级，使用hashmap不是很方便。
            var tasks=this._tasks.slice();
            for(var i=0,l=tasks.length,task;i<l;i++){
                task=tasks[i];
                task.action.call(task.content,delta);
            }

//            for(var i=0,l=this._tasks.length,task;i<l;i++){
//                task=this._tasks[i];
//                task.action.call(task.content,delta);
//            }
            this._lastTime=now;
        },
         
        //fun priority scope
        //fun scope priority
        //fun scope
        //fun priority
        //priority越小越先执行
        addTask:function (fun,priority,scope) {
            
            if(typeof priority!="number"){
                if(scope==null){
                    scope=priority;
                    priority=0;
                }else{
                    var tmp=scope
                    scope=priority;
                    priority=tmp;
                }
            }

            for(var i=0,l=this._tasks.length;i<l;i++){
                if(priority<this._tasks[i].priority){
                    break;
                }
            }
            this._tasks.splice(i,0,{action:fun,priority:priority,content:scope});
        },
        removeTask:function(fun){
            for(var i=0,l=this._tasks.length;i<l;i++){
                if(fun==this._tasks[i].action){
                    break;
                }
            }
            this._tasks.splice(i,1);
        },
        clearTask:function  () {
            this._tasks=[];
        },
        setInterval:function(interval) {
            this._interval = interval;
            return this;
        },
        getInterval:function() {
            return this._interval;
        }
    };
    //值越小，越先执行。
    Scheduler.Render=50;
    Scheduler.Updater=Scheduler.Update=40;
    Scheduler.Animation=30;
    Scheduler.Timer=20;
    
    Scheduler.getInstance=function  (props) {
        if (!this._instance) {
            this._instance = new Scheduler(props);
        }
        return this._instance;
    }

    yhge.times.Scheduler=Scheduler;

})();