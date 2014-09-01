
var engine = new yhge.Engine({
    canvas:"canvas",
    renderer:"canvas",
    timeTask:yhge.Engine.TimeTaskType.All,
    interval:30,
    forceInterval:false
});
//可以使用
if (engine.enable) {
    TcgCard.engine = engine;
    //设置缓动动画库，将来放入Engine里
    TcgCard.fx=new YHFx(engine.scheduler);
    //创建动画主时间线
    var mainTimeLine = new AnimationGroup({
        duration:1000 / 30
    });
    engine.animationManager.add(mainTimeLine);
    TcgCard.mainTimeLine = mainTimeLine;
    //创建场景
    var singleSceneUpdater = SingleSceneUpdater.getInstance(engine.scheduler, engine.context);
    var scene = new Scene({
        width:TcgCard.config.width,
        height:TcgCard.config.height
    });
    singleSceneUpdater.setScene(scene);

    //大90x131
    //小55x80
    var bigSize={
        width:90,
        height:131
    };
    var smallSize={
        width:55,
        height:80
    };
    var slotPositions=[
        //my prepare slot
        [],
        //my battle slot
        [],
        //other prepare slot
        [],
        //other battle slot
        []
    ];
    var slots=[
        [],
        [],
        [],
        []
    ];
    //准备卡槽
    prepareSlot();
    //发牌
    deal();
    setTimeout(function(){
        deal();
        setTimeout(function(){
            deal();
            setTimeout(function(){
                deal();
            },2000);
        },2000);
    },2000);
    //animation
//    var prepareCard=new TcgCard.Card();
//    var view=prepareCard.loadView();
//    view.setSolid(true);
//    view.setWidth(smallSize.width);
//    view.setHeight(smallSize.height);
//    view.setColor("#FF0000");
//    view.setPosition(slotPositions[0][0][0],slotPositions[0][0][1]);
//    scene.addChild(view);
//
//    var start={
//        x:slotPositions[0][0][0],
//        y:slotPositions[0][0][1]
//    }
//    var end={
//        x:slotPositions[1][0][0],
//        y:slotPositions[1][0][1]
//    };
//    view.setPosition(start);
//    TcgCard.fx.animate(view,{position:end,width:bigSize.width,height:bigSize.height},400);
//    var tx=slotPositions[0][0][0],ty=slotPositions[0][0][1];
//    var speedX= 1,speedY=1;
//    var doAnimation=function(){
//        tx+=speedX;
//        ty+=speedY;
//        if(tx>slotPositions[1][0][0]){
//            tx=slotPositions[1][0][0];
//        }
//        if(ty>slotPositions[1][0][1]){
//            ty=slotPositions[1][0][1];
//        }
//        if(!(tx==slotPositions[1][0][0] && ty==slotPositions[1][0][1])){
//            setTimeout(doAnimation,1000/30);
//        }
//        prepareCard.setPosition(tx,ty);
//    };
//    setTimeout(doAnimation,1000/30);
} else {
    alert("engine init failure!");
}


function prepareSlot(){
    var x=30,y=420,margin={left:20,top:0};
    var n=6;
    //战斗区
    for(var i=0;i<n;i++){
        var card=new Rect();
        card.setWidth(bigSize.width);
        card.setHeight(bigSize.height);
        card.setColor("#00FF00");
        card.setPosition(x,y);
        scene.addChild(card);
        slotPositions[1].push([x,y]);
        x+=bigSize.width+margin.left;
    }
    x=20,y=571;
    n=8;
    //prepare area
    for(var i=0;i<n;i++){
        var card=new Rect();
        card.setWidth(smallSize.width);
        card.setHeight(smallSize.height);
        card.setColor("#00FF00");
        card.setPosition(x,y);
        scene.addChild(card);
        slotPositions[0].push([x,y]);
        x+=smallSize.width+margin.left;
    }
    //对方
    x=30,y=249;
    n=6;
    for(var i=0;i<n;i++){
        var card=new Rect();
        card.setWidth(bigSize.width);
        card.setHeight(bigSize.height);
        card.setColor("#00FFFF");
        card.setPosition(x,y);
        scene.addChild(card);
        slotPositions[3].push([x,y]);
        x+=bigSize.width+margin.left;
    }

    x=20,y=149;
    n=8;
    //prepare area
    for(var i=0;i<n;i++){
        var card=new Rect();
        card.setWidth(smallSize.width);
        card.setHeight(smallSize.height);
        card.setColor("#00FFFF");
        card.setPosition(x,y);
        scene.addChild(card);
        slotPositions[2].push([x,y]);
        x+=smallSize.width+margin.left;
    }
}

/**
 * 洗牌
 */
function shuffle(){

}

/**
 * 发牌
 */
function deal(){
    //牌堆到准备区
    //取得准备区的空位
    var index=slots[0].length;
    var pos=slotPositions[0][index];
    var prepareCard=new TcgCard.Card();
    var view=prepareCard.loadView();
    view.setSolid(true);
    view.setWidth(smallSize.width);
    view.setHeight(smallSize.height);
    view.setColor("#FF0000");
    view.setPosition(0,pos[1]);
    prepareCard.showWaitRound();
    scene.addChild(view);
    TcgCard.fx.animate(view,{position:{x:pos[0],y:pos[1]}},400);
    slots[0].push(prepareCard);
}
/**
 * 整理卡槽
 */
function orderSlot(){

}