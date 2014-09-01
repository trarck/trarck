(function  () {
	/**
	 * FxNode是原子的，对特定属性进行变换
	 */
    var Easing=yhge.fx.Easing;
    var Fx=yhge.fx.Fx;
    var setActions=Fx.StepUpdate;
    var getActions=Fx.Get;
    var calcActions=Fx.Calc;


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
        
        initialize: function(target, options, prop,delegate){

            this.target = target;
            this.prop = prop;
            this._delegate=delegate;
			this.duration= options.duration;
            //easing 在这里处理，step不用处理。一个效果，在step阶段改变easing的可能性不大。
            this.easing = options.specialEasing && options.specialEasing[this.prop] || options.easing || "swing";
            this.easingFunction=Easing[this.easing];

			//更新。每步更新target的属性的方法
			if(options.step){
				this.step=options.step;
                if(setActions[prop]){
                    this.updateProp=setActions[prop];
                }else{
                    this.updateProp=false;//setActions._default;
                    this.setPropName="set"+ucfirst(prop);
                }
			}else{
                if(setActions[prop]){
                    this.update=setActions[prop];
                }else{
                    this.update=setActions._default;
                    this.setPropName="set"+ucfirst(prop);
                }
			}
            //加入special calc。支持每个属性有自己的calc。可以在animate属性处定义，也可以在配置中定义。
            this.calcNow=calcActions[prop]||calcActions._default; //options.calcNow;
            if(getActions[prop]){
                this.getProp=getActions[prop];
            }else{
                this.getProp=getActions._default;
                this.getPropNmae="get"+ucfirst(prop);
            }

            this.complete=options.complete;
        },
		custom: function(from, to, unit){
            var self = this;
            
//            this.startTime = (new Date()).getTime();
            this.passTime=0;
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;

            //delegate is set by initialze or setter
            this._delegate.start(this,this._run);
			//FxManager.start(this,this._run);

        },
     
      
        // Start an animation from one number to another
        
        // Each step of an animation
        _run: function(delta,gotoEnd){
            this.passTime+=delta;
            
            if (gotoEnd || this.passTime >= this.duration) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update(this.now, this);;
                
				this.complete&&this.complete(this);

                //delegate is set in
                this._delegate.stop(this);
//				FxManager.stop(this);

                return false;
                
            } else {
                var n = this.passTime;
                this.state = n / this.duration;
                //如果使用this.constructor.Easing[this.easing](this.state, n, 0, 1, this.options.duration)
                //则可以使easing函数的this指向其所在的对象
                this.pos = this.easingFunction(this.state, n, 0, 1, this.duration);
                //传参数更通用，利于自定义calcNow
                this.now = this.calcNow(this.start,this.end,this.pos,this);
                
                // Perform the next step of the animation
                this.update(this.now, this);
            }
            
            return true;
        },
		/**
		 * 带step的update
		 */
		update: function(){
            if (this.step) {
                this.step( this.now, this);
            }
            //这里优化，少调一层函数
//            this.updateProp(this.now, this);
            this.updateProp?
                this.updateProp(this.now, this):
                this.target[this.setPropName](this.now);
        },
        calcNow:function(start,end,pos){
            return start + ((end - start) * pos);
        },
		cur: function(){
            return this.getProp(this);
        }
    }});
    yhge.fx.FxNode=FxNode;

    function ucfirst (str) {
        str += '';
        return  str.charAt(0).toUpperCase()+str.substr(1);
    }
})();