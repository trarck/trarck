(function  () {
    
//    var RenderTask=function  () {
//
//    };
      render=render||{};
      //根据配置指定渲染引擎
      render.init=function  () {

      };
      //定时绘制,加入scheduler中
      render.task=function  () {
            yhge.scheduler.addTask(render.doRender,yhge.Scheduler.Render,render);
      };
      render.doRender=function  () {
          //render top scene
      }
    
})();