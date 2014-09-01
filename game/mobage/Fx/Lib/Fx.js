var Core = require('../NGCore/Client/Core').Core;

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
var FxLinstener=new Core.MessageListener();

function tick(){
    for (var i = 0; i < timers.length; i++) {
        if (!timers[i]()) {
            timers.splice(i--, 1);
        }
    }
    
    if (!timers.length) {
        timerId = false;
        Core.UpdateEmitter.removeListener(FxLinstener,tick);
    }
}
/**
 * 动画
 * 	var e = new Fx( grid, {
			duration:1000,
			easing:"easeInOutBounce"
		}, "positionX" );
 */
var Fx=exports.Fx= Core.MessageListener.subclass({
    
    classname: 'Fx',
    
    initialize: function(node, options, prop){

		options.easing=options.easing || "swing";
		
        if(!options.curAnim){
            options.curAnim={};
            options.curAnim[prop] = false;
        }
        this.options = options;
        this.node = node;
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
            this.options.step.call(this.node, this.now, this);
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
        
        this.startTime = Core.Time.getRealTime();
        this.start = from;
        this.end = to;
        this.unit = unit || this.unit || "px";
        this.now = this.start;
        this.pos = this.state = 0;
        
        function t(gotoEnd){
            return self.step(gotoEnd);
        }
        
        t.node = this.node;
        
        if (t() && timers.push(t) && !timerId) {
            Core.UpdateEmitter.addListener(FxLinstener,tick);
            timerId=true;
        }
    },
    // Each step of an animation
    step: function(gotoEnd){
        var t = Core.Time.getRealTime(), done = true;
        
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
                this.options.complete&&this.options.complete(this.node);
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
});
//animate不能直接赋值给个某个变量再调用，要赋值使用getAnimate。
Fx.animate=function  (node,prop, speed, easing, callback) {
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
            e = new this( node, opt, name ),//animate必须做为某个Fx的方法调用，this才指向Fx
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
};
Fx.getAnimate=function(){
   var self=this;
   return function(){
       self.animate.apply(self,arguments);
   }  
};
Fx.stop=function(node,gotoEnd ) {
    // go in reverse order so anything added to the queue during the loop is ignored
    for ( var i = timers.length - 1; i >= 0; i-- ) {
        if ( timers[i].node === node ) {
            if (gotoEnd) {
                // force the next step to be the last
                timers[i](true);
            }
            timers.splice(i, 1);
        }
    }
    return this;
}

Fx.interval = 13;


Fx.Speeds = {
    slow: 600,
    fast: 200,
    // Default speed
    _default: 400
};
//以下属性需要扩展
Fx.Step = {
    opacity: function(fx){
        fx.node.setAlpha(fx.now);
    },
    alpha: function(fx){
        fx.node.setAlpha(fx.now);
    },
    color: function(fx){
        fx.node.setColor(fx.now);
    },
    _default: function(fx){
        fx.node['set'+ucfirst(fx.prop)](fx.now);
    }
};

Fx.Get = {
    opacity: function(fx){
        return fx.node.getAlpha();
    },
    alpha: function(fx){
        return fx.node.getAlpha();
    },
    _default: function(fx){
        return fx.node['get'+ucfirst(fx.prop)]();
    }
};

Fx.Calc = {
    _default:function(start,end,pos){
		return start + ((end - start) * pos);
	}
};

var Easing =Fx.Easing= {
	def: 'easeOutQuad',
    linear: function(p, n, firstNum, diff){
        return firstNum + diff * p;
    },
    jswing: function(p, n, firstNum, diff){
        return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
    },
    swing: function(x, t, b, c, d){
        return Easing[Easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d){
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d){
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d){
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d){
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d){
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d){
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d){
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d){
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d){
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d){
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d){
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d){
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d){
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d){
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d){
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d){
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d){
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d){
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d){
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d){
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d){
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d){
        var s = 1.70158, p = d * 0.3, a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d){
        var s = 1.70158, p = d * 0.3, a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(x, t, b, c, d){
        var s = 1.70158, p = d * (0.3 * 1.5), a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(x, t, b, c, d, s){
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s){
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s){
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d){
        return c - Easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d){
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    easeInOutBounce: function(x, t, b, c, d){
        if (t < d / 2) return Easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return Easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
}