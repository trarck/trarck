(function  () {

     //每个game都有一个Engine对象。
    //Engine初始化时钟，调置调度任务，设置renderer的content。
    var Engine=function  () {
        this.initialize.apply(this,arguments);
    };

    var F=function  () {};
    F.prototype=yhge;

    Engine.prototype=new F();

    yhge.core.mixin(Engine.prototype,{

        initialize:function  (conf) {
            //init context
            this.enable=this.initContext(conf);
            //init times
            if(!conf.noTimer){
                conf.singleton?this.initTimesSingleton(conf):this.initTimes(conf); 
            }
            //init input
            this.initInput();
            //init plugins
            this.initPlugins(conf);
            //init event manager
            this.eventListenerManager=new yhge.event.EventListenerManager();
        },

        initContext:function  (conf) {
            this.canvas=typeof (conf.canvas)=="string"?document.getElementById(conf.canvas):conf.canvas;
            var context=this.getContext(this.canvas,conf.renderer);
            if(context){
                this.context=context;
                return true;
            }
            return false;
        },
        /**
         *使用二种配置来使用其它任务
         *1.位标记。可并列
         *2.键值对，键作为名称，值是要加载的类。
         */
        initTimes:function (conf) {
            var scheduler=new yhge.times.Scheduler(conf);
            this.scheduler=scheduler;

            var flag=conf.timeTask;
            if(flag){
                if(typeof (flag)=="number"){
                    if(flag&Engine.TimeTaskType.Timer)
                        this.timer=new yhge.times.Timer(scheduler);
                    if(flag&Engine.TimeTaskType.Updater)
                        this.updater=new yhge.times.Updater(scheduler);
                    if(flag&Engine.TimeTaskType.AnimationManager)
                        this.animationManager=new yhge.times.AnimationManager(scheduler);
                }else{
                    for(var name in flag){
                        this[name]=new flag[name](scheduler);
                    }
                }
            }
            scheduler.run();
            return true;
        },
        initTimesSingleton:function (conf) {
            var scheduler=yhge.times.Scheduler.getInstance(conf);
            this.scheduler=scheduler;

            var flag=conf.timeTask;
            if(flag){
                if(typeof (flag)=="number"){
                    if(flag&Engine.TimeTaskType.Timer)
                        this.timer=yhge.times.Timer.getInstance(scheduler);
                    if(flag&Engine.TimeTaskType.Updater)
                        this.updater=yhge.times.Updater.getInstance(scheduler);
                    if(flag&Engine.TimeTaskType.AnimationManager)
                        this.animationManager=yhge.times.AnimationManager.getInstance(scheduler);
                }else{
                    for(var name in flag){
                        this[name]=flag[name].getInstance(scheduler);
                    }
                }
            }
            scheduler.run();
            return true;
        },
        initCanvas:function(canvas){
            var context = null;
        
            try {
              context = canvas.getContext("2d");
              this.isCanvas=true;
            }
            catch(e) {}
            
            
            if (!context) {
              alert("Unable to initialize canvas2d. Your browser may not support it.");
            }
            return context;
        },
        initWebGL:function (canvas) {
            var gl = null;
            
            try {
              gl = canvas.getContext("experimental-webgl");
              this.isWebGL=true;
            }
            catch(e) {}
            
            // If we don't have a GL context, give up now
            
            if (!gl) {
              alert("Unable to initialize WebGL. Your browser may not support it.");
            }
            return gl;
        },
        initPlugins:function (conf) {
            var plugins=conf.plugins;
            if(plugins){
                for(var i=0,l=plugins.length;i<l;i++){
                    plugins[i].init(this,conf);
                }
            }
        },
        /**
         * 处理输入鼠标、触摸和键盘
         */
        initInput:function () {
            this.input=new yhge.input.Input(this.canvas);
        },
        //事件相关
        addEventListener:function (obj,type,fun,scope,data) {
            this.eventListenerManager.addEventListener(obj,type,fun,data,scope);
        },
        removeEventListener:function (obj,type,fun) {
            this.eventListenerManager.removeEventListener(obj,type,fun);
        },
        bind:function (obj,type,fun,scope,data) {
            this.eventListenerManager.addEventListener(obj,type,fun,data,scope);
        },
        unbind:function (obj,type,fun) {
            this.eventListenerManager.removeEventListener(obj,type,fun);
        },
        dispatchEvent:function(obj,event){
            this.eventListenerManager.dispatchEvent(obj,event);
        },
        /**
         * 默认使用webgl，如果不支持则使用canvas。
         */
        getContext:function (canvas,renderer) {
            if(renderer=="canvas"){
                return this.initCanvas(canvas);
            }
            return this.initWebGL(canvas) || this.initCanvas(canvas);
        }
    });
    Engine.TimeTaskType={
        Timer:1,
        Updater:2,
        AnimationManager:4,
        All:255
    };
    yhge.Engine=Engine;
})();