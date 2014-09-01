function getTimes (interval) {
    var scheduler=new yhge.times.Scheduler({interval:interval}),
        timer=new yhge.times.Timer(scheduler),
        animationManager=new yhge.times.AnimationManger(scheduler);
    return {
        scheduler:scheduler,
        timer:timer,
        animationManager:animationManager
    }
};

var times=getTimes();
yhge.scheduler=times.scheduler;
yhge.timer=times.timer;
yhge.animationManager=times.animationManager;