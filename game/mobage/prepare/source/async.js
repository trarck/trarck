exports.TaskSet = function(){
	this.join_callback = null;
	this.awaiting_tasks = [];
};

exports.TaskSet.prototype.join = function(callback){
	this.join_callback = callback;
	this._join_if_ready();
};

exports.TaskSet.prototype._join_if_ready = function(){
	if(this.awaiting_tasks.length == 0 && this.join_callback){
		this.join_callback();
	}
};

exports.TaskSet.prototype.task = function(callback){

	var ts = this;
	var f = function(){
		if(callback) callback.apply(callback, arguments);
		for(var i = 0; i < ts.awaiting_tasks.length; ++i){
			if(ts.awaiting_tasks[i] == arguments.callee){
				ts.awaiting_tasks.splice(i, 1);
				break;
			}
		}
		ts._join_if_ready();
	};
	
	this.awaiting_tasks.push(f);
	
	return f;
};

var WORK_POOL_LIMIT = 10;

exports.WorkPool = function(limit, name){
	this.join_callback = null;
	this.running_tasks = [];
	this.pending_tasks = [];
	this.limit = limit || WORK_POOL_LIMIT;
	this.name = name || 'anon';
};

exports.WorkPool.prototype._continue = function(){
	if(this.pending_tasks.length || this.running_tasks.length){
		while(this.pending_tasks.length && this.running_tasks.length < this.limit){
			// console.log(this.name + " beginning a task - queue: " + this.pending_tasks.length + " working: " + this.running_tasks.length);
			var task = this.pending_tasks.shift();
			this.running_tasks.push(task);
			task.closure();
		}
	}
	else if(this.join_callback){
		this.join_callback();
	}
};

exports.WorkPool.prototype.enqueue = function(closure){
	var ts = this;
	var job = {};

	var callback = function(){
		for(var i = 0; i < ts.running_tasks.length; ++i){
			if(ts.running_tasks[i] == job){
				ts.running_tasks.splice(i, 1);
				break;
			}
		}
		ts._continue();
	};
	
	job.closure = function(){
		closure(callback);
	};

	this.pending_tasks.push(job);
	
	this._continue();
};

exports.WorkPool.prototype.join = function(callback){
	this.join_callback = callback;
	this._continue();
};
