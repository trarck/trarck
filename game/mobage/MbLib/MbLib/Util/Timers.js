var Core  = require('../../NGCore/Client/Core').Core;

exports.Timers=Core.Class.singleton({
    
    guid: 1,
    
    tasks:{},
    
    initialize: function() {
        //UpdateEmitter.addListener( this, this.onUpdate );
        
    },
    
	everyTime: function(interval, label, fn, times) {
		this.add(interval, label, fn, times);
	},
	oneTime: function(interval, label, fn) {
		this.add(interval, label, fn, 1);
	},
	stopTime: function(label, fn) {
		this.remove(label, fn);
	},
    add: function(interval, label, fn, times,scope,data) {
        
        if (typeof fn  != 'function'|| typeof interval != 'number' || isNaN(interval) || interval < 0) return;
                
        if (typeof times != 'number' || isNaN(times) || times < 0)  times = 0;
        
        
        if (!this.tasks[label]) this.tasks[label] = {};
        
        fn.timerID = fn.timerID || this.guid++;
        
        var task={
            id:fn.timerID,
            handler:fn,
            counter:0,
            times:times,
            interval:interval,
            delta:0,
            scope:scope,
            data:data
        };
        this.tasks[label][task.id]=task;
        
        
        
        var self=this,counter = 0;
        var handler = function() {
            if ((++counter > times && times !== 0) || fn.call(scope,data) === false)
                self.remove(label, fn);
        };
        handler.timerID = fn.timerID;
        
    },
    remove: function(label, fn) {
        var ret;
            
        if (!label) {
            for ( label in this.tasks )
                this.remove(label, fn);
        } else if ( this.tasks[label] ) {
            if ( fn ) {
                if ( fn.timerID ) {
                    delete this.tasks[label][fn.timerID];
                }
            } else {
                for ( var fn in this.tasks[label] ) {
                    delete this.tasks[label][fn];
                }
            }
            
            for ( ret in this.tasks[label] ) break;
            if ( !ret ) {
                ret = null;
                delete this.tasks[label];
            }
        }
    },
    onUpdate: function( delta ) {
        
        var labelTasks,task;
        for (var label in this.tasks) {
            
            labelTasks = this.tasks[label];
            
            for(var id in labelTasks){
                task=labelTasks[id];
                task.delta +=delta;
                if (task.delta >= task.interval) {
                    if ((++task.counter > task.times && task.times !== 0) || task.handler.call(task.scope,task.data)===false) {
                        //delete this.tasks[label][id];
                        this.remove(label,task.handler);
                    }
                }
             }
        }
    }
});
