var  Task=require("./Task").Task;

var WorkPoolLimit=10;
/**
 * 工作池
 * 池里的内容是并发的。所以不需要保持顺序。
 * 基础功能要简单，复杂的功能用继承来实现
 * 可以扩展子类，实现parse的功能等。
 *
 * ps:如果使用数组实现的工作池可以保持增加时的顺序，
 *    但移除任务会增加额外操作，如果不删数组保持增长。
 *    使用队列也会是同样问题。
 * @param limit
 * @param name
 * @constructor
 */
var WorkPool=function(limit,name){
    this._pendingTasks={};
    this._runningTasks={};
    this._pendingTasksLength=0;
    this._runningTasksLength=0;

    this._joinActions=[];//当work pool中的任务完成时调用，如果有事件就不用这样。直接触发事件。

    this._isComplete=false;
    this._limit=limit||WorkPoolLimit;
    this._name=name;
};

WorkPool.prototype.taskIdIndex=1;

WorkPool.prototype.finishTaskWithId=function(taskId){
    delete this._runningTasks[taskId];
    this._runningTasksLength--;
    this._continue();
};

WorkPool.prototype.finishTask=function(task){
    delete this._runningTasks[task.getId()];
    this._runningTasksLength--;
    this._continue();
};

WorkPool.prototype.add=function(fun,scope){
    this._isComplete=false;
    var args=Array.prototype.slice.call(arguments,1);//the first for later use
    var taskId=this.taskIdIndex++;
    var task=new Task(taskId,fun,scope,args);//{action:fun,content:scope,args:args,id:taskId};
    args[0]=task;
    task.setContainer(this);
    if(this._runningTasksLength<this._limit){
        this._runningTasks[taskId]=task;
        this._runningTasksLength++;
        task.run();
    }else{
        this._pendingTasks[taskId]=task;
        this._pendingTasksLength++;
    }
};
/**
 * 所有任务完成时执行
 * @param fun
 * @param scope
 */
WorkPool.prototype.join=function(fun,scope){
    var args=Array.prototype.slice.call(arguments,1);//the first for later use
    if(this._isComplete){
        fun.apply(scope,args);
    }else{
        this._joinActions.push({
           action:fun,
           content:scope,
           args:args
        });
    }
};


WorkPool.prototype._continue=function(){
//    console.log("continue:",this._pendingTasksLength,this._runningTasksLength);
    if(this._pendingTasksLength>0 && this._runningTasksLength<this._limit){
        var i=this._runningTasksLength,task;
        for(var taskId in this._pendingTasks){
            task=this._pendingTasks[taskId];
            this._runningTasks[taskId]=task;
            task.run();
            delete this._pendingTasks[taskId];
            this._pendingTasksLength--;
            this._runningTasksLength++;
            if(++i>=this._limit) break;
        }
//        console.log("cotinue end",this._runningTasksLength);
    }
    if(this._pendingTasksLength==0 && this._runningTasksLength==0){
        this._complete();
    }
};

WorkPool.prototype._complete=function(){
    for(var i= 0,l=this._joinActions.length;i<l;i++){
        var act=this._joinActions[i];
        act.action.apply(act.content,act.args);
    }
    this._isComplete=true;
};

exports.WorkPool=WorkPool;