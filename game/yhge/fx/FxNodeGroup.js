(function  () {
	/**
	 * 一组属性的动画结点
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
    var FxNodeGroup=yhge.core.Class({
        overrides:{

        classname: 'FxNodeGroup',
        
        initialize: function(target, options,props,delegate){

            this.target = target;

            this._delegate=delegate;

			this.duration= options.duration;
            //更新。每步更新target的属性的方法
			if(options.step){
				this.step=options.step;
                this.update=this.updateProp;
			}

            this.complete=options.complete;


            var specialEasing=options.specialEasing;
            var propEasing,easing,sameEasing=true;

            this.props={};
            for(var p in props){
                propEasing=specialEasing && specialEasing[p];
                if(propEasing  && easing && propEasing!=easing ){
                    sameEasing=false;
                }
                easing=propEasing||options.easing || "swing";
                this.props[p]={
                    easing:easing,
                    easingFunction:Easing[easing],
                    calcNow:calcActions[p]||calcActions._default
                };
                if(setActions[p]){
                    this.props[p].setProp=setActions[p];
                }else{
                    this.props[p].setProp=false;
                    this.props[p].setPropName="set"+ucfirst(p);
                }

                if(getActions[p]){
                    this.props[p].getProp=getActions[p];
                }else{
                    this.props[p].getProp=false;
                    this.props[p].getPropNmae="get"+ucfirst(p);
                }
            }
            this.sameEasing=sameEasing;
            if(sameEasing){
                this.easingFunction=Easing[easing];
            }

            //             this.updateStep=YHFx.StepUpdate[this.prop] || YHFx.StepUpdate._default;
            //             //加入special calc。支持每个属性有自己的calc。可以在animate属性处定义，也可以在配置中定义。
            //             this.calcNow=YHFx.Calc[options.specialCalc && options.specialCalc[this.prop] || options.calc || this.prop ] || this.constructor.Calc._default;
            //             this.getProp=YHFx.Get[this.prop] || this.constructor.Get._default;

            //        if (!options.orig) {
            //            options.orig = {};
            //        }
        },
		custom: function(from, to){
            var self = this;

            this.passTime=0;
            this.start = from;
            this.end = to;
            this.now = this.start;
            this.pos = this.state = 0;
            

            this._delegate.start(this,this._run);
        },

        // Each step of an animation
        _run: function(delta,gotoEnd){

            this.passTime+=delta;

            if (gotoEnd || this.passTime >= this.duration ) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update(this.now,this);
                
				this.complete&&this.complete(this);

                this._delegate.stop(this);

                return false;
                
            } else {
                var n = this.passTime;
                this.state = n / this.duration;
                //如果使用this.constructor.Easing[this.easing](this.state, n, 0, 1, this.options.duration)
                //则可以使easing函数的this指向其所在的对象
                this.now={};
                var prop;
                if(this.sameEasing){
                    var pos = this.easingFunction(this.state, n, 0, 1, this.duration);
                    for(var p in this.props){
                        prop=this.props[p];
                        prop.pos=pos;
                        this.now[p]=prop.calcNow(this.start[p],this.end[p],pos,this);
                    }
                }else{
                    var easingResult={};
                    for(var p in this.props){
                        prop=this.props[p];
                        if(easingResult[prop.easing]){
                            prop.pos=easingResult[prop.easing];
                        }else{
                            prop.pos=prop.easingFunction(this.state, n, 0, 1, this.duration);
                            easingResult[prop.easing]=prop.pos;
                        }
                        this.now[p]=prop.calcNow(this.start[p],this.end[p],prop.pos,this);
                    }
                }
                // Perform the next step of the animation
                this.update(this.now,this);
            }
            
            return true;
        },
		/**
		 * 带step的update
		 */
		update: function(){
            if (this.step) {
                this.step(this.now, this);
            }
            this.updateProp();
        },
        //不使用default，直接对target进行操作
        updateProp:function(){
            var prop;
            for(var p in this.props){
                prop=this.props[p];
                //prop.setProp(this.now[p],this,prop);
                prop.setProp ?
                    prop.setProp(this.now[p],this,prop):
                    this.target[prop.setPropName](this.now[p]);
            }
        },
        calcNow:function(start,end,pos){
            return start + ((end - start) * pos);
        },
		cur: function(){
            var now={},prop;
            for(var p in this.props){
                prop=this.props[p];
//                now[p]=prop.getProp(this);
                now[p]= prop.getProp ?
                    prop.getProp(this):
                    this.target[prop.getPropNmae];
            }
            return now;
        }
    }});

    yhge.fx.FxNodeGroup=FxNodeGroup;

    function ucfirst (str) {
        str += '';
        return  str.charAt(0).toUpperCase()+str.substr(1);
    }
})();