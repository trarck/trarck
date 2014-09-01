(function  () {


    var F=function  () {};
    F.prototype=yhge;
    //var yhgePrototype=new F();
    var enginePrototype={

        initialize:function  (conf) {
            
            this.enable=this.initContext(conf) //init context
                && this.initRenderer(conf)      //init renderer
                && this.initTimes(conf.interval); //init times
        },

        initContext:function  (conf) {
            var context=getContext(conf.canvas);
            if(context){
                this.context=context;
                return true;
            }
            return false;
        },
        initRenderer:function (conf) {
            if(conf.renderer instanceof yhge.renderer.Renderer){
                this.renderer=conf.renderer;
            }else{
                this.renderer=this.isWebGL? new yhge.renderer.WebglRenderer(this.context):this.isCanvas?new  new yhge.renderer.CanvasRenderer(this.context):null;
                if(this.renderer==null) return false;
            }
            return true;
        },
        initTimes:function (interval) {
            var scheduler=new yhge.times.Scheduler({interval:interval}),
                timer=new yhge.times.Timer(scheduler),
                animationManager=new yhge.times.AnimationManager(scheduler);
                this.scheduler=scheduler;
                this.timer=timer;
                this.animationManager=animationManager;
                scheduler.run();
            return true;
        },
        getContext:function (canvasId) {
            var canvas=document.getElementById(canvasId);
            return initWebGL(canvas) || initCanvas(canvas);
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
        }
         
    };
    
    var webgl={
        Renderer:yhge.renderer.WebglRenderer,
        Scene:yhge.scene.WebglScene
    };

    var canvas={
        Renderer:yhge.renderer.CanvasRenderer,
        Scene:yhge.scene.CanvasScene
    }

    function getEngine (conf) {
        var Engine=function  () {
            this.initialize.apply(this,arguments);
        };
        Engine.prototype=new F();
        yhge.core.mixin(Engine.prototype,enginePrototype);


        var ret=this.initContext(conf);
        Engine.surpport=ret.type;
        Engine.context=ret.context;    

        switch(ret.type){
            case 1:
                yhge.core.mixin(Engine,webgl);
                break;
            case 2:
                yhge.core.mixin(Engine,canvas);
                break;
            default:
                break;
        }

        return Engine;
    }


       function  initContext(conf) {
            var canvas=document.getElementById(conf.canvas)
                context,type=0;

            if((context=initWebGL(canvas))){
                type=1;
            }else if( context=initCanvas(canvas)){
                type=2;
            }
            return   {type:type,context:context};
        }
        
        function initCanvas(canvas){
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
        }
        function initWebGL(canvas) {
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
        }
         
})();