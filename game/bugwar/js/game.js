//初始化引擎
var engine = new yhge.Engine({
    canvas:"canvas",
    renderer:"canvas",
    timeTask:yhge.Engine.TimeTaskType.All,
    interval:30,
    forceInterval:false
});
//可以使用
if (engine.enable) {
    BugWar.engine = engine;
    //创建动画主时间线
    var mainTimeLine = new AnimationGroup({
        duration:1000 / 30
    });
    engine.animationManager.add(mainTimeLine);
    BugWar.mainTimeLine = mainTimeLine;
    //创建场景
    var singleSceneUpdater = SingleSceneUpdater.getInstance(engine.scheduler, engine.context);
    var scene = new Scene({
        width:BugWar.config.width,
        height:BugWar.config.height
    });
    singleSceneUpdater.setScene(scene);


    //创建背景
    var bgImg = new Image();
    bgImg.src = "images/bg.jpg";

    var bg = new Sprite({
        texture:bgImg,
        width:BugWar.config.width,
        height:BugWar.config.height
    });
    scene.addChild(bg);
    //创建人物
    var player = new BugWar.Player({
        radius:12,
        solid:true,
        zOrder:11,
        color:"#c00"
    });
    player.setPosition(50, 50);
    scene.addChild(player);
    //engine.timer.scheduleUpdate(player);


    //创建建筑
    var building = new BugWar.Building({
        solid:true,
        width:32,
        height:64,
        zOrder:10,
        flag:1,
        maxNumber:100
    });
    building.loadView().setPosition(200, 200).setNumber(4);
    scene.addChild(building);

    engine.timer.setTimeout(function () {
        building.addNumber(10, 0);
    }, 4000);

    var building1 = new BugWar.Building({
        solid:true,
        width:32,
        height:64,
        zOrder:10,
        flag:1,
        maxNumber:100
    });
    building1.loadView();
    building1.setPosition(300, 100);
    building1.setNumber(19);
    scene.addChild(building1);

    building2 = new BugWar.Building({
        solid:true,
        width:32,
        height:64,
        zOrder:10,
        flag:1,
        maxNumber:100
    });
    building2.loadView();
    building2.setPosition(500, 200);
    building2.setNumber(19);
    scene.addChild(building2);

    building3 = new BugWar.Building({
        solid:true,
        width:32,
        height:64,
        zOrder:10,
        flag:1,
        maxNumber:30
    });
    building3.loadView();
    building3.setPosition(400, 300);
    building3.setNumber(19);
    scene.addChild(building3);

    building4 = new BugWar.Building({
        solid:true,
        width:32,
        height:64,
        zOrder:10,
        flag:1,
        maxNumber:100
    });
    building4.loadView();
    building4.setPosition(300, 400);
    building4.setNumber(19);
    scene.addChild(building4);

    //TODO move point lines to building manager
    var objInPointLines = [];
    var pointLines = new BugWar.Line({color:"rgba(255,0,0,0.5)"});
    pointLines.setZOrder(1);
    scene.addChild(pointLines);

    var rect = {
        x:0,
        y:0,
        width:BugWar.config.width,
        height:BugWar.config.height
    };

    var buildingContentManager = new BugWar.BuildingContentManager({rect:rect});

    engine.eventListenerManager.addEventListener(buildingContentManager, "mouseup", function (e) {
        var targetBuilding = e.target;
        pointLines.clear();

        if (targetBuilding) {
            var total = 0;
            for (var i = 0, l = objInPointLines.length; i < l; i++) {
                total += objInPointLines[i].dispatchNumber();
                objInPointLines[i].isInLines = false;
            }
            console.log(total,objInPointLines.length);
            if (total) {
                targetBuilding.addNumber(total, objInPointLines[0].getFlag());
            }

        } else {
            for (var i in objInPointLines) {
                objInPointLines[i].isInLines = false;
            }
        }
        objInPointLines=[];
    });
    engine.eventListenerManager.addEventListener(buildingContentManager, "mouseover", function (e) {
        var building = e.target;
        if (building && building.isInLines) {
            pointLines.removePoint(building.getPosition());
            building.isInLines = false;
            var idx = objInPointLines.indexOf(building);
            objInPointLines.splice(idx, 1);
        }
    });
    engine.eventListenerManager.addEventListener(buildingContentManager, "mouseout", function (e) {
        var building = e.target;
        if (building && !building.isInLines) {
            var pos = building.getPosition();
            //底部对齐
            var x = pos.x + building.getWidth() / 2;
            var y = pos.y + building.getHeight() - 10;
            pointLines.addPoint({x:x, y:y});
            building.isInLines = true;
            objInPointLines.push(building);
        }
    });
    engine.eventListenerManager.addEventListener(buildingContentManager, "mousemove", function (e) {
        pointLines.setTo({x:e.x, y:e.y});
    });

    engine.input.setupMouseEventWithProcessor(buildingContentManager);

    buildingContentManager.addObservable(building);
    buildingContentManager.addObservable(building1);
    buildingContentManager.addObservable(building2);
    buildingContentManager.addObservable(building3);
    buildingContentManager.addObservable(building4);

} else {
    alert("engine init failure!");
}


function getOffset(ele) {
    var left = ele.offsetLeft, top = ele.offsetTop;
    var p = ele.offsetParent;
    while (p) {
        left += p.offsetLeft;
        top += p.offsetTop;
        p = p.offsetParent;
    }
    return {left:left, top:top};
}


var n = singleSceneUpdater.updateTimes;
var fps = document.getElementById("fps");
setInterval(function () {
    fps.innerHTML = singleSceneUpdater.updateTimes - n;
    n = singleSceneUpdater.updateTimes;
}, 1000);

