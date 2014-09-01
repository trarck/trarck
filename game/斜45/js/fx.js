/**
 * 动画
 */
(function  () {
     var timerId, timers = [];

     function Fx (node, options, prop) {
        options.easing=options.easing || "swing";
		
        this.options = options;
        this.node = node;
        this.prop = prop;
		this.calcNow=this.calcNow||options.calcNow;
        
        //        if (!options.orig) {
        //            options.orig = {};
        //        }
     }

     Fx.prototype= {
        update: function(){
            if (this.options.step) {
                this.options.step.call(this.node, this.now, this);
            }
            
            (Fx.step[this.prop] || Fx.step._default)(this);
        },
        
        // Get the current size
        cur: function(){
            return (Fx.get[this.prop] || Fx.get._default)(this);
        },
        
        // Start an animation from one number to another
        custom: function(from, to, unit){
            var self = this, fx = Fx;
            
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
                timerId = setInterval(Fx.tick, Fx.interval);
            }
        },
        // Each step of an animation
        step: function(gotoEnd){
        var t = Core.Time.getRealTime(), done = true;
        
        if (gotoEnd || t >= this.options.duration + this.startTime) {
            this.now = this.end;
            this.pos = this.state = 1;
            this.update();
            
            //            this.options.curAnim[this.prop] = true;
            //            
            //            for (var i in this.options.curAnim) {
            //                if (this.options.curAnim[i] !== true) {
            //                    done = false;
            //                }
            //            }
            //            
            //            if (done) {
            //                // Execute the complete function
            //                this.options.complete.call(this.node);
            //            }
            
            return false;
            
        } else {
            var n = t - this.startTime;
            this.state = n / this.options.duration;
            
            // Perform the easing function, defaults to swing
            this.pos = Easing[this.options.easing](this.state, n, 0, 1, this.options.duration);
            //传参数更通用，利于自定义calcNow
			this.now = this.calcNow(this.start,this.end,this.pos);
			
            // Perform the next step of the animation
            this.update();
        }
        
        return true;
    },
	calcNow:function(start,end,pos){
		return start + ((end - start) * pos);
	}
        
    };

    Fx.interval = 13;

    Fx.tick = function(){
        for (var i = 0; i < timers.length; i++) {
            if (!timers[i]()) {
                timers.splice(i--, 1);
            }
        }
        
        if (!timers.length) {
            Fx.stop();
        }
    };

    Fx.stop = function(){
        clearInterval(timerId);
        timerId = null;
    };

    Fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

    Fx.step = {
        opacity: function(fx){
            fx.node.setAlpha(fx.now);
        },
        alpha: function(fx){
            fx.node.setAlpha(fx.now);
        },
        positionX: function(fx){
            var p = fx.node.getPosition();
            p.setX(fx.now);
            fx.node.setPosition(p);
        },
        positionY: function(fx){
            var p = fx.node.getPosition();
            p.setY(fx.now);
            fx.node.setPosition(p);
        },
        color: function(fx){
            fx.node.setColor(fx.now);
        },
        scale: function(){
        
        },
        rotation: function(){
        
        },
        _default: function(fx){
            if (fx.node.style && fx.node.style[fx.prop] != null) {
                fx.node.style[fx.prop] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
            } else {
                fx.node[fx.prop] = fx.now;
            }
        }
    };

    Fx.get = {
        opacity: function(fx){
            fx.node.getAlpha();
        },
        alpha: function(fx){
            fx.node.getAlpha();
        },
        positionX: function(fx){
            fx.node.setPosition().getX();
        },
        positionY: function(fx){
            fx.node.setPosition().getY();
        },
        color: function(fx){
            fx.node.setColor(fx.now);
        },
        scale: function(){
        
        },
        rotation: function(){
        
        },
        _default: function(fx){
            if (fx.node.style && fx.node.style[fx.prop] != null) {
                fx.node.style[fx.prop] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
            } else {
                fx.node[fx.prop] = fx.now;
            }
        }
    };

    Easing = {
        def: 'easeOutQuad',
        linear: function(p, n, firstNum, diff){
            return firstNum + diff * p;
        },
        jswing: function(p, n, firstNum, diff){
            return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
        },
        swing: function(x, t, b, c, d){
            return this[this.def](x, t, b, c, d);
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
            return c - this.easeOutBounce(x, d - t, 0, c, d) + b;
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
            if (t < d / 2) return this.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
            return this.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }
    window.Fx=Fx;
})();
