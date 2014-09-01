(function  () {

    var Scheduler=yhge.times.Scheduler;
    var Easing=yhge.fx.Easing;

    var timerId, timers = [];

    var rdashAlpha = /-([a-z])/ig,
        rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i;
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

    function tick(){
        for (var i = 0; i < timers.length; i++) {
            if (!timers[i]()) {
                timers.splice(i--, 1);
            }
        }
        
        if (!timers.length) {
            timerId = false;
            Scheduler.getInstance().removeTask(tick);
        }
    }
    /**
     * 动画
     * 	var e = new Fx( grid, {
                duration:1000,
                easing:"easeInOutBounce"
            }, "positionX" );
     */
    var FxNode=yhge.core.Class({
        overrides:{

        classname: 'FxNode',
        
        initialize: function(target, options, prop){

            options.easing=options.easing || "swing";
            
            if(!options.curAnim){
                options.curAnim={};
                options.curAnim[prop] = false;
            }
            this.options = options;
            this.target = target;
            this.prop = prop;
            //easing 在这里处理，step不用处理。一个效果，在step阶段改变easing的可能性不大。
            this.easing = options.specialEasing && options.specialEasing[this.prop] || options.easing;
            this.easingFunction=this.constructor.Easing[this.easing];
            //更新方法
            this.updateStep=this.constructor.Step[this.prop] || this.constructor.Step._default;
            //加入special calc。支持每个属性有自己的calc。可以在animate属性处定义，也可以在配置中定义。
            this.calcNow=this.constructor.Calc[options.specialCalc && options.specialCalc[this.prop] || options.calc || this.prop ] || this.constructor.Calc._default;
            this.getProp=this.constructor.Get[this.prop] || this.constructor.Get._default;

            //        if (!options.orig) {
            //            options.orig = {};
            //        }
        },
        update: function(){
            if (this.options.step) {
                this.options.step.call(this.target, this.now, this);
            }
            this.updateStep(this);
        },
        
        // Get the current size
        cur: function(){
            return this.getProp(this);
        },
        
        // Start an animation from one number to another
        custom: function(from, to, unit){
            var self = this;
            
            this.startTime = (new Date()).getTime();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            
            function t(gotoEnd){
                return self.step(gotoEnd);
            }
            
            t.target = this.target;
            
            if (t() && timers.push(t) && !timerId) {
                //Core.UpdateEmitter.addListener(FxLinstener,tick);
                Scheduler.getInstance().addTask(tick,Scheduler.Timer);
                timerId=true;
            }
        },
        // Each step of an animation
        step: function(gotoEnd){
            var t = (new Date()).getTime(), done = true;
            
            if (gotoEnd || t >= this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                
                this.options.curAnim[this.prop] = true;
               
                for (var i in this.options.curAnim) {
                    if (this.options.curAnim[i] !== true) {
                        done = false;
                    }
                }
                
                if (done) {
                    // Execute the complete function
                    this.options.complete&&this.options.complete(this.target);
                }
                
                return false;
                
            } else {
                var n = t - this.startTime;
                this.state = n / this.options.duration;
                //如果使用this.constructor.Easing[this.easing](this.state, n, 0, 1, this.options.duration)
                //则可以使easing函数的this指向其所在的对象
                this.pos = this.easingFunction(this.state, n, 0, 1, this.options.duration);
                //传参数更通用，利于自定义calcNow
                this.now = this.calcNow(this.start,this.end,this.pos,this);
                
                // Perform the next step of the animation
                this.update();
            }
            
            return true;
        },
        calcNow:function(start,end,pos){
            return start + ((end - start) * pos);
        }
    }});

    var Fx=yhge.core.Class({overrides:{
        classname: 'Fx',

        interval : 13,

        initialize: function(){

        },
        animate:function  (target,prop, speed, easing, callback) {
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
                    //specialCalc
                    prop[p][2] && ((opt.specialCalc = opt.specialCalc || {})[p] = prop[p][2]);
                    prop[p] = prop[p][0];
                }
            }
            //anim
            for(var name in prop){
                opt.curAnim[name] =false;
            }
            //for(var jQuery.extend({}, prop);
            for(var name in prop){
                var val=prop[name],
                    e = new Fx( target, opt, name ),//animate必须做为某个Fx的方法调用，this才指向Fx
                    parts = rfxnum.exec(val),
                    start = e.cur();

                if ( parts ) {
                    var end = parseFloat( parts[2] ),
                        unit = parts[3] ||"";

                    // If a +=/-= token was provided, we're doing a relative animation
                    if ( parts[1] ) {
                        end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                    }

                    e.custom( start, end, unit );

                } else {
                    e.custom( start, val, "" );
                }
            }
            return true;
        },
        stop:function(target,gotoEnd ) {
            // go in reverse order so anything added to the queue during the loop is ignored
            for ( var i = timers.length - 1; i >= 0; i-- ) {
                if ( timers[i].target === target ) {
                    if (gotoEnd) {
                        // force the next step to be the last
                        timers[i](true);
                    }
                    timers.splice(i, 1);
                }
            }
            return this;
        },

        setActions:function(actions){
            this._stepAction=actions.step;
            this._getActions=actions.get;
            this._calcActions=actions.calc;
        },

        Step : {
            opacity: function(fx){
                fx.target.setAlpha(fx.now);
            },
            alpha: function(fx){
                fx.target.setAlpha(fx.now);
            },
            color: function(fx){
                fx.target.setColor(fx.now);
            },
            _default: function(fx){
                fx.target['set'+ucfirst(fx.prop)](fx.now);
            }
        },
        Get : {
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
                return fx.target['get'+ucfirst(fx.prop)]();
            }
        },
        Calc : {
            position: function(start,end,pos,target){
                console.log(target.state,pos);
                var x=start.x+(end.x-start.x)*pos,
                    y=start.y+(end.y-start.y)*pos;
                return {x:x,y:y};
            },
            _default:function(start,end,pos){
                return start + ((end - start) * pos);
            }
        }
    }});

    Fx.Speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

    var FxActionStep=

    //以下属性需要扩展
    Fx.Step = {
        opacity: function(fx){
            fx.target.setAlpha(fx.now);
        },
        alpha: function(fx){
            fx.target.setAlpha(fx.now);
        },
        color: function(fx){
            fx.target.setColor(fx.now);
        },
        _default: function(fx){
            fx.target['set'+ucfirst(fx.prop)](fx.now);
        }
    };

    Fx.Get = {
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
            return fx.target['get'+ucfirst(fx.prop)]();
        }
    };

    Fx.Calc = {
        position: function(start,end,pos,target){
            console.log(target.state,pos);
            var x=start.x+(end.x-start.x)*pos,
                y=start.y+(end.y-start.y)*pos;
            return {x:x,y:y};
        },
        _default:function(start,end,pos){
            return start + ((end - start) * pos);
        }
    };
    yhge.fx.Fx=Fx;
})();