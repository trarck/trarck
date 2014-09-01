(function  () {

    var Scheduler=yhge.times.Scheduler;
    var Easing=yhge.fx.Easing;

    var timerId, timers = [];

    var rdashAlpha = /-([a-z])/ig,
        rfxnum = /^([+\-]=)?([\d+.\-]+)$/i;
    function fcamelCase( all, letter ) {
        return letter.toUpperCase();
    }
    function camelCase( string ) {
        return string.replace( rdashAlpha, fcamelCase );
    }
    function ucfirst (str) {
        str += '';
        return  str.charAt(0).toUpperCase()+str.substr(1);
    }

    var YHFx=yhge.core.Class({overrides:{

        classname: 'YHFx',

        interval : 13,

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
                    task.action.call(task.content,delta);
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
                        task.action.call(task.content,0,true);
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
        },
        animate:function  (target,prop, speed, easing, callback) {
            var opt=this.parseAnimateArgs(prop, speed, easing, callback);

            //parse fx complete
            var curAnim={};
            if(opt.complete){
                var complete=opt.complete;
                opt.complete=function(fx){
                    curAnim[fx.prop] = true;
                    var  done = true;
                    for (var i in curAnim) {
                        if (curAnim[i] !== true) {
                            done = false;
                        }
                    }
                    if (done) {
                        complete(fx.target);
                    }
                };
            }

            for(var name in prop){
                curAnim[name] =false;

                var val=prop[name],
                    e = new yhge.fx.FxNode( target, opt, name,this),//animate必须做为某个Fx的方法调用，this才指向Fx
                    parts = rfxnum.exec(val),
                    start = e.cur();

                if ( parts ) {
                    var end = parseFloat( parts[2] );

                    // If a +=/-= token was provided, we're doing a relative animation
                    if ( parts[1] ) {
                        end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                    }

                    e.custom( start, end );

                } else {
                    e.custom( start, val );
                }
            }
            return true;
        },
        animateWithGroup:function  (target,prop, speed, easing, callback) {
            var opt=this.parseAnimateArgs(prop, speed, easing, callback);
            var e = new yhge.fx.FxNodeGroup( target, opt,prop,this);
            var start=e.cur();
            var end=prop;
            for(var name in prop){
                var val=prop[name],
                    parts = rfxnum.exec(val);

                if ( parts ) {
                    var propEnd = parseFloat( parts[2] );

                    // If a +=/-= token was provided, we're doing a relative animation
                    if ( parts[1] ) {
                        propEnd = ((parts[1] === "-=" ? -1 : 1) * propEnd) + start[name];
                    }
                    end[name]=propEnd;
                }
            }
            e.custom( start, end );
            return true;
        },
        parseAnimateArgs:function(prop, speed, easing, callback){
            var opt,p;
            switch (typeof (speed)) {
                case 'object':
                    opt=speed;
                    opt.curAnim={};
                    break;
                default:
                    opt = {
                        complete:callback || typeof easing =='function' && easing || typeof speed =='function' && speed,
                        easing:callback && easing || easing && typeof easing!='function' && easing,
                        duration:speed,
                        curAnim :{}
                    }
                    break;
            }
            opt.duration = typeof opt.duration === "number" ? opt.duration :
                opt.duration in this.Speeds ? this.Speeds[opt.duration] : this.Speeds._default;

            for ( p in prop ) {
                var name = camelCase( p );

                if ( p !== name ) {
                    prop[ name ] = prop[ p ];
                    delete prop[ p ];
                    p = name;
                }

                if ( prop[p] instanceof Array ) {
                    // Create (if needed) and add to specialEasing
                    (opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
                    prop[p] = prop[p][0];
                }
            }
            return opt;
        }
    }});

    YHFx.Speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

    //以下属性需要扩展
    YHFx.StepUpdate = {
        opacity: function(val,fx){
            fx.target.setAlpha(val);
        },
        alpha: function(val,fx){
            fx.target.setAlpha(val);
        },
        color: function(val,fx){
            fx.target.setColor(val);
        },
        //fx node 直接使用default，但node group无法使用
        _default: function(val,fx,prop){
            fx.target[fx.setPropName](val);
        }
    };

    YHFx.Get = {
        opacity: function(fx){
            return fx.target.getAlpha();
        },
        alpha: function(fx){
            return fx.target.getAlpha();
        },
        position: function(fx){
            var pos=fx.target.getPosition();
            return {x:pos.x,y:pos.y};
        },
        _default: function(fx){
            return fx.target[fx.getPropNmae]();
        }
    };

    YHFx.Calc = {
        position: function(start,end,pos,target){
            var x=start.x+(end.x-start.x)*pos,
                y=start.y+(end.y-start.y)*pos;
            return {x:x,y:y};
        },
        _default:function(start,end,pos){
            return start + ((end - start) * pos);
        }
    };

    var instance=null;
    YHFx.getInstance=function(){
        if(!instance) instance=new YHFx();
        return instance;
    };

    yhge.fx.Fx=YHFx;
})();