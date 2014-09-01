/**
 * @author gogo365
 */
/**
 * 拼图的图片
 */
var picture='';

/**
 * 行，列数
 */
var COL = ROW = 0;
/**
 * 单格的宽
 */
var WIDTH = 0;
/**
 * 单格的高
 */
var HEIGHT = 0;
/**
 * 元素数
 */
var N = 0;
//var beginTime = endTime = 0;
/**
 * 计时器的分,秒
 */
var minutes = seconds = 0;
/**
 * 打乱次数
 */
var RANDOMTIME = 30;
/**
 * 外框元素
 */
var oWrap = null;
/**
 * 计时器
 */
var clockHand = null;
/**
 * 拼图数组
 */
var map = [];
/**
 * 存放各单元格内容
 */
var items = new Array();
/**
 * 当前活动,空格对象
 */
var currObj = new Object();
/**
 * 游戏标志
 */
var play=true;

/**
 * 初始化
 */
function init(){
    oWrap = $('wrap');
    for (var i = 0; i < N; i++) {
        map[i] = i;
    }
    //打乱位置
    randomMap(RANDOMTIME);
    //初始化各元素
    for (var i = 0; i < N; i++) {
        var obj = document.createElement("div");
        var ost = obj.style;
        ost.width = WIDTH + "px";
        ost.height = HEIGHT + "px";
        ost.styleFloat = "left";
        ost.cssFloat = "left";
        ost.border = "1px solid #FFF";
        obj.index = i;
        
        //最后一个元素不显示
        if (map[i] == N - 1) {
            currObj = obj;
            currObj.style.background = "#000";
        }
        else {
            ost.background = "transparent url("+picture+") no-repeat " + (map[i] % COL) * -WIDTH + "px " + Math.floor(map[i] / COL) * -HEIGHT + "px";
        }
        
        oWrap.appendChild(obj);
        items[i] = obj;
    }
}

/**
 * 通过ID取得对象
 * @param {string} sid
 * @return Object
 */
function $(sid){
    return document.getElementById(sid);
}

/**
 * 游戏开始
 */
function beginGame(){
    if(play){
        beginTime = new Date();
        //设置事件
        oWrap.onclick = myClick;
        clock();
    }
}

/**
 * 游戏结束
 */
function completeGame(){
    //显示最后一个图片
    currObj.style.background = "transparent url("+picture+") no-repeat " + ((N - 1) % COL) * -WIDTH + "px " + Math.floor((N - 1) / COL) * -HEIGHT + "px";
    //停止移动
    oWrap.onclick = null;
    //停止计时
    clearTimeout(clockHand);
    //去除边框
    for (var i = 0; i < N; i++) {
        items[i].style.border = "0";
    }
    play=false;
    //提交到服务端
}
/**
 * 检查拼图是否完成
 */
function checkSuccess(){
    for (i = 0; i < N - 1; i++) {
        if (map[i] != i) 
            return false;
    }
    return true;
}
/**
 * 计时器
 */
function clock(){
    minutes = seconds == 59 ? ++minutes : minutes;
    seconds = (++seconds) == 60 ? 0 : seconds;
    $("usetime").innerHTML = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    clockHand = setTimeout("clock()", 1000);
}

/**
 * 交换位置
 * @param {Object} srcObj
 * @param {Object} decObj
 * @return boolean 交换是否成功
 */
function swap(srcObj, decObj){
    if (!checkSwap(srcObj.index, decObj.index)) 
        return false;//没有通过检查
    //交换值
    var tmp = map[srcObj.index];
    map[srcObj.index] = map[decObj.index];
    map[decObj.index] = tmp;
    //交换图片
    tmp = srcObj.style.background;
    srcObj.style.background = decObj.style.background;
    decObj.style.background = tmp;
    return true;
}

/**
 * 检查能否交换
 *
 * 上下左右一格位置才可以交换
 *
 * @param {int} sind 源索引
 * @param {int} dind 目标索引
 * @return boolean true,可以交换；false,不能交换
 */
function checkSwap(sind, dind){
    if (sind >= N || dind >= N || sind < 0 || dind < 0) 
        return false;
    var sx = Math.floor(sind / COL);
    var sy = sind % COL;
    
    var dx = Math.floor(dind / COL);
    var dy = dind % COL;
    return ((dx - sx) == 0 && Math.abs(dy - sy) == 1) || ((dy - sy) == 0 && Math.abs(dx - sx) == 1);
}

/**
 * 事件处理
 *
 * 移动,检查完成
 * @param {Object} e
 */
function myClick(e){
    e = e || window.event;
    var srcObj = e.srcElement || e.target;
    if (srcObj != currObj) {
        if (swap(srcObj, currObj)) {
            currObj = srcObj;
            //完成检查
            if (checkSuccess()) {
                completeGame();
            }
        }
    }
}

/**
 * 打乱数组顺序
 * @param {int} times
 */
function randomMap(times){
    var mapping = [-1, 1, -COL, COL];
    var currInd = N - 1;
    var i = 0;
    while (i < times) {
        var rdm = Math.round(Math.random() * 3);
        var newInd = currInd + mapping[rdm];
        if (checkSwap(currInd, newInd)) {
            var tmp = map[currInd];
            map[currInd] = map[newInd];
            map[newInd] = tmp;
            currInd = newInd;
        }
        i++;
    }
}
