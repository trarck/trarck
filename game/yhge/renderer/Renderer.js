(function  () {
    /**
     * 目标：根据浏览器或全局配置决定使用的render，目前为canvas,webgl，不排除flash,siverlight等。
     *       现在还不确定canvas和wegbl的使用一样。
     *       在引擎加载前完成适配，比如，用户自定义的类要继承某个render下的Node，可以直接使用yhge.Renderer.Node。
     *       如果要指定继承canvas可写成extend yhge.renderer.canvas.Node.
     *       如果要继承webgl可写成extedn yhge.renderer.webgl.Node。
     *       这二种情况，要求游戏明确知道运行的环境。出于某些特殊需求。基本上canvas等做的，webgl都可以，返过回则不行。
     */
     
    function checkSupport() {
        //TODO check browser version
        if(true){
            support="canvas";
        }else{
            support="webgl";
        }
        return support
    }
    
    //do support
    switch (checkSupport()) {
        case "canvas":
            yhge.Renderer=yhge.renderer.canvas;
            break;
        case "webgl":
            yhge.Renderer=yhge.renderer.webgl;
            break;
    }

//    var Renderer=yhge.core.Class({overrides:{
//
//        classname:"Renderer",
//
//        initialize:function  (context) {
//            this.context=context;
//        },
//        Animation:yhge.renderer.Animation,
//        AnimationVariable:yhge.renderer.AnimationVariable,
//        Frame:yhge.renderer.Frame
//    }});
//
////    var Renderer=function  () {
////        this.initialize.apply(this,arguments);
////    }
////
////    Renderer.prototype={
////        constructor:Renderer,
////
////        classname:"Renderer",
////
////        initialize:function  (context) {
////            this.context=context;
////        },
////        Animation:yhge.renderer.Animation,
////        AnimationVariable:yhge.renderer.AnimationVariable,
////        Frame:yhge.renderer.Frame
////    }
//
//    //通用做法。直接设置属性。利于用其它语言改写。
//    var CanvasRenderer=yhge.core.Class(Renderer,{
//        initialize:function  () {
//            yhge.core.mixin(this,yhge.renderer.canvas);
//        }
//    });
//    ////原型继承。速度快，与其它语言不兼容
//    //var CanvasRenderer=yhge.core.Class(Renderer,yhge.renderer.canvas);
//    //CanvasRenderer.prototype.initialize=function(){};
//
//    var WebglRenderer=yhge.core.Class(Renderer,{
//        initialize:function  () {
//            yhge.core.mixin(this,yhge.renderer.webgl);
//        }
//    });
//
//    var getRenderer=function  (name) {
//        var renderer=null,context=null;
//        switch(name){
//            case "canvas":
//                renderer=new CanvasRenderer(context);
//                break;
//            case "webgl":
//                renderer=new WebglRenderer(context);;
//                break;
//            default:
//                var support=checkSupport();
//                if(support){
//                    renderer=getRenderer(support);
//                }
//                break;
//        }
//        return renderer;
//    };
//    function checkSupport() {
//        //TODO check browser version
//        if(true){
//            support="canvas";
//        }else{
//            support="webgl";
//        }
//        return support
//    }

//    yhge.renderer.Renderer=Renderer;
//    yhge.renderer.CanvasRenderer=CanvasRenderer;
//    yhge.renderer.WebglRenderer=WebglRenderer;
//    yhge.renderer.getRenderer=getRenderer;
})();