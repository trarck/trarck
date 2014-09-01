/**
 * User: trarck
 * Date: 12-7-16
 * Time: 下午11:54
 */
//配置文件
//全局数据
var TcgCard={
    //使用竖版。便于显示，便于手提。
    config:{
        width:480,
        height:800
    },
    engine:null,//引擎初始化后，再赋值到这个地方。对于此值的引用必须在函数内容，不能在定义的闭包中使用。相当于一个单例对象。
    resources:null,
    mainTimeLine:null
};
//库变量
var UIEventListenerManager=yhge.event.UIEventListenerManager;
var Scheduler=yhge.times.Scheduler;
var AnimationGroup=yhge.animation.AnimationGroup;
var SingleSceneUpdater=yhge.scene.SingleSceneUpdater;
var Scene=yhge.scene.Scene;
var Sprite=yhge.renderer.canvas.Sprite;
var Circle=yhge.renderer.canvas.shape.Circle;
var Rect=yhge.renderer.canvas.shape.Rect;
var Text=yhge.renderer.canvas.Text;
var Shape=yhge.renderer.canvas.swf.Shape;
var MovieClip=yhge.renderer.canvas.swf.MovieClip;
var MorphShape=yhge.renderer.canvas.swf.MorphShape;
var VisualEventProcessor=yhge.scene.VisualEventProcessor;
var YHFx=yhge.fx.Fx;