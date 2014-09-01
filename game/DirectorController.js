var Core  = require('../../NGCore/Client/Core').Core;
var GL2   = require('../../NGCore/Client/GL2').GL2;

var Resolution = require('../Model/Resolution').Resolution;
var SpriteFactory = require('../Model/SpriteFactory').SpriteFactory;
var Fx = require('../Model/GLFx').Fx;
var EventFactory=require('../Model/EventFactory').EventFactory;
var Position=require('../Model/Position').Position;
var UserInfo=require('../Model/UserInfo').UserInfo;
var Position = require('../Model/Position').Position;
var Map=require('../Model/Map').Map;

var MysticalTip = require('../View/MysticalTip').MysticalTip;
var DirectorView = require('../View/DirectorView').DirectorView;

var DataManager = require('../Util/DataManager').DataManager;
var UtilBase = require('../Util/UtilBase').UtilBase;

var Sound = require('./SoundController').SoundController;
var BackgroundController = require('./SceneController').SceneController.getCurrnetScene();
var BuildingController = require('./BuildingController').BuildingController;
var FunctionalController = require('./FunctionalController').FunctionalController;
var MapController = require('./MapController').MapController;

exports.DirectorController = Core.MessageListener.singleton({

    classname: 'DirectorController',

    initialize: function() {
        this._taskIndex=UserInfo.getUserTutrial();
    },

    destroy: function($super) {
        GL2.removeChild(this._view);
        this._view.destroy();
        $super();
    },

    createView: function(position,goNext,touchInHoleAble) {
        //if(!this._view) {
        touchInHoleAble=typeof touchInHoleAble=="undefined"?true:touchInHoleAble;
        var scale=Resolution.getScale();
        var view=new DirectorView(position,scale,goNext && this.nextStep.bind(this),touchInHoleAble);
        //on top
        view.setDepth(999999);
        GL2.Root.addChild(view);

        //this._view=view;
        return view;
        //}
        //return this._view;
    },

    deleteView: function() {
        this._view.destroy();
        this._view=null;
    },

    createMessage: function(text) {
        if(!this._msg) {
            var msg=new MysticalTip(text,[Core.Capabilities.getScreenHeight()/2,Core.Capabilities.getScreenWidth()-400*Resolution.getScale()]);
            msg.setScale(Resolution.getScale(),Resolution.getScale());
            //on top
            msg.setDepth(999999);
            GL2.Root.addChild(msg);
            this._msg=msg;
        }
        return this._msg;
    },

    loadQueue: function() {
        var queue=DataManager.getSync("task.json")[this._taskIndex];
        if(queue) {
            this._stepQueue=this.parseQueue(queue);
            return true;
        } else {
            return false;
        }
    },

    parseQueue: function(queue) {
        var item,action;
        for(var i=0,l=queue.length;i<l;i++) {
            item=queue[i];
            switch (typeof item) {
                case "string":
                    if(!/^\d/.test(item)) {
                        //action call
                        action= {
                            run:this[item]
                        };
                        break;
                    } else {
                        item=parseInt(item);
                    }
                case "number":
                    //wait
                    action= {
                        run:this.wait,
                        args:item
                    };
                    break;
                case "object":
                    //支持多个action
                    action=[];
                    for(var act in item) {
                        action.push({
                            run:this[act],
                            args:item[act]
                        });
                    }
            }
            queue[i]=action;
        }
        return queue;
    },

    start: function() {
        if(this.loadQueue()) {
            //劫持菜单
            this._proxyFunctionStartMoive();
            //隐藏跳转点
            this._hideJumpPoints();
            this.stepIndex=0;
            this.nextStep();
        }else{
            this._restoreFunctionStartMoive();
            this._showJumpPoints();
            this._restoreLifeTree();
            this.saveTask();
        }
    },

    nextStep: function() {
        var action=this._stepQueue[this.stepIndex++];//this._stepQueue.shift();
        if(action) {
            if(action instanceof Array) {
                var actions=action;
                for(var i=0,l=actions.length;i<l;i++) {
                    action=actions[i];
                    action.run.call(this,action.args);
                }
            } else {
                action.run.call(this,action.args);
            }
        }
    },

    doEnd: function() {
        this._taskIndex++;
        UserInfo.setUserTutrial(this._taskIndex);
        //下一个任务
        setTimeout( function() {
            this.start();
        }.bind(this),3000);

    },

    saveTask: function() {
        UtilBase.post(UtilBase.Action.UserTutrial, {});
    },

    //actions
    wait: function(delay) {
        var self=this;
        setTimeout( function() {
            self._msg.hide();
            self.nextStep();
        },delay);

    },

    say: function(words) {
        var self=this;
        words=this._parseWords(words);
        var msg=this.createMessage();
        var i=0,word;
        saying();
        function saying() {
            if(word=words[i++]) {
                msg[word.sayer+"Say"](word.content,saying);
            } else {
                self.nextStep();
            }
        }

    },

    direct: function(args) {
        var pos=args[0],next=args[1],scale=Resolution.getScale();
        var x=pos[0]*scale,y=pos[1]*scale;
        //小于0，底部对齐。
        x+=x<0?Core.Capabilities.getScreenHeight():0;
        y+=y<0?Core.Capabilities.getScreenWidth():0;
        this._directView=this.createView([x,y],next,args[2]);
    },
    deleteDirect:function(next){
        if(this._directView && Core.ObjectRegistry.isObjectRegistered(this._directView)){
            this._directView.destroy();
            next && this.nextStep();
        }
    },
    directToNewBuilding:function(next){
        var BuildingController=require('../Controller/BuildingController').BuildingController;
        //取得最新建筑的建筑
        var building=BuildingController.newset;
        
        var Camera=require('../Model/Camera').Camera;
        var pos=Camera.getCenter(building.getNode().getParent(),building.getPosition());
        this.moveTo([[pos.getX()/Resolution.getScale(),pos.getY()/Resolution.getScale()],false]);
        
        this.createView([Core.Capabilities.getScreenHeight()/2,Core.Capabilities.getScreenWidth()/2],next);
    },
    addEvent: function(args) {
        var event=args[0];
        var onFun=args[1];
        var param=args[2];
        var next=args[3];
        var self=this;
        EventFactory.addListener(event,this,function(){
           var eventArgs=Array.prototype.slice.call(arguments, 0);
           //args=args.concat(param);
           if(self[onFun] && self[onFun](param,eventArgs)!==false){
               EventFactory.removeListener(event,self,self[onFun]);
           }
        });
        next && this.nextStep();
    },
    onEvent:function(param,args){
          
    },
    onBuildingEvent: function(param,args) {
        if(param==args[0]) {
            EventFactory.removeListener("Building",this);
            this._building=args[1];
            this.nextStep();
        }
    },
    addGold: function(gold) {
        FunctionalController.updateUserGold(gold);
        FunctionalController.tip( 'Gold',gold);
        this.nextStep();
    },

    moveTo: function(args) {
        var scale=Resolution.getScale();
        var pos=args[0],next=args[1];
        pos[0]*=scale;
        pos[1]*=scale;
        Fx.animate(BackgroundController.getNode(), {
            position:new Core.Point(pos)
        },500,next && this.nextStep.bind(this));
    },

    moveToCell: function(args) {
        args[0]=Position.getPosition(args[0]);
        this.moveTo(args);
    },

    end: function(delay) {
        var self=this;
        delay=typeof delay=="undefined"?1000:delay;
        //end
        setTimeout( function() {
            self._msg.destroy();
            self._msg=null;
            self.doEnd();
        },delay);

    },
    message:function(param){
        var text=param[0];
        var next=param[1];
        var MessageController = require('./MessageController').MessageController;
        MessageController.showSimple(text);
        next && this.nextStep();
    },
    showFunctionMenu:function(next){
        FunctionalController.showFunctionMenu();
        next && this.nextStep();
    },
    hideFunctionMenu:function(next){
        FunctionalController.hideFunctionMenu();
        next && this.nextStep();
    },
    waitForShopOpen:function(){
        var self=this;
        
        var BuildingListController = require('./BuildingListController').BuildingListController;
        
        //proxy display
        this._proxyDisplay(BuildingListController);
    },
    checkReduce:function(param,eventArgs){
        var mining=eventArgs[0];
        if(mining.getTimesLeft()==param[0]){
            this.nextStep();
            return true;
        }else{
            this.direct([param[1],false,false]);
            this.addEvent(["Tile.Touch","deleteDirect",false,false]);
        }
        return false;
    }, 
    // createLifeTree: function(args) {
        // //show director
        // var x=args[0],y=args[1];
        // this.createView([x*Resolution.getScale(),y*Resolution.getScale()]);
        // EventFactory.addListener(EventFactory.Building.Event,this,this.onBuildingEvent);
        // this._event=EventFactory.Building.Event;
        // this._param=EventFactory.Building.Touch;
    // },
    createJumpPoint:function(args){
        this._showMiningHoleJumpPoint(args[0]);
        args[1] && this.nextStep();
    },
    // confirm: function() {
    // this.createView([320*Resolution.getScale(),384*Resolution.getScale()],true);
    // },
    // showPray: function() {
        // EventFactory.addListener(EventFactory.Building.Event,this,this.onBuildingEvent);
        // this._event=EventFactory.Building.Event;
        // this._param=EventFactory.Building.Pray;
    // },
    levelUp:function(){
        //升级动画
        BackgroundController._lifeTree.upgrade(); 
        var treeExpUpdate = require('../Controller/FunctionalController').treeExpUpdate;
        treeExpUpdate.start(1);
    },
    farmMove:function(){
        var self=this;
        
        EventFactory.addListener(EventFactory.Building.Move.Event,this,function(action,building){
            if(action==EventFactory.Building.Move.End){
                if(building.canPlaceable()){
                    EventFactory.removeListener(EventFactory.Building.Move.Event,self);
                    self._building=building;
                    self.nextStep();
                }
            }
        });
    },
    directorToOk:function(){
        var BuildingController=require('../Controller/BuildingController').BuildingController;
        //取得最新建筑的建筑
        var building=BuildingController.newset;
        
        var pos=building.getNode().getPosition();
        var okPos=building._ok.getPosition();
        pos=building.getNode().getParent().localToScreen(new Core.Point(pos.getX()+okPos.getX(),pos.getY()+okPos.getY()));
        this.createView([pos.getX(),pos.getY()],false);
    },
    //建造生成建筑
    farmPlace: function() {
        EventFactory.addListener(EventFactory.Building.Place,this,this.onFarmPlace);
        this._event=EventFactory.Building.Place;
        
    },
    
    onFarmPlace: function(building) {
        EventFactory.removeListener(this._event,this,this.onFarmPlace);
        EventFactory.removeListener("Building",this);
        this._building=building;
        this.nextStep();
    },
    onFarmCancel: function(param,args){
        if(args[0]==param[0]){
            EventFactory.removeListener("Building.Place",this);
            var decoration=UserInfo.getUserDecoration();
            this.stepIndex=param[1];
            this.nextStep();
        }
    },
    //挖矿
    moveToMining: function(params) {
        var self=this;
        
        this._showMiningHoleJumpPoint();
        
        var pos=params[0];//[1024,192];
        this.moveTo([pos,false]);

        var screenPos=params[1];//[137,267];
        this.createView([screenPos[0]*Resolution.getScale(),screenPos[1]*Resolution.getScale()]);
        
        //character
        var cell=params[2];//[-3,6];
        var pos=Position.getPosition(cell[0],cell[1]);
        var CharacterController = require('./CharacterController').CharacterController;
        CharacterController.getNode().setPosition(pos);
        
        var MineHoleController = require('./MineHoleController').MineHoleController;
        //proxy display
        this._proxyDisplay(MineHoleController);
    },
    miningBack:function(args){
        var self=this;
        var cell=args[0];
        var mining=Map.getTile(cell[1],cell[0]);
        
        if(mining){
            mining.oldReduceTimes=mining.reduceTimes;
            mining.reduceTimes=function(){
                mining.reduceTimes=mining.oldReduceTimes;
                mining.reduceTimes();
                self.nextStep();
            }
        }else{
            self.nextStep();
        }
    },
   
    backToFirstFloor:function(){
        var self=this;
        var FirstFloorController = require('./FirstFloorController').FirstFloorController;
        //proxy display
        this._proxyDisplay(FirstFloorController);
    },
    //建筑装饰建筑
    checkDecorationTab:function(){
        
    },
    addDecoration: function(param,args) {
        EventFactory.removeListener("Building",this);
        var decoration=UserInfo.getUserDecoration();
        if(decoration<param) {
            this.say({
                "secret": "现在装饰度是"+decoration+"。\n还要继续努力哟！"
            });
            this.stepIndex=23;
        }else{
            this.stepIndex=35;
            this.nextStep();
        }
    },
    checkDecoration:function(param,args){
        if(args[0]==param[0]){
            EventFactory.removeListener("Building.Place",this);
            var decoration=UserInfo.getUserDecoration();
            if(decoration<param[1]) {
                this.stepIndex=6;
            }else{
                this.stepIndex=34;
            }
            this.nextStep();
        }
    },
    //大树升级
    createFarmGold: function(args) {
        var BuildingController=require('../Controller/BuildingController').BuildingController;
        var buildings=BuildingController.buildings;
        //取得建造的农田
        var farm;
        for(var i=0,l=buildings.length;i<l;i++){
            farm=buildings[i];
            if(farm.getBid()==800){
                break;
            }
        }
        var Camera=require('../Model/Camera').Camera;
        var pos=Camera.getCenter(farm.getNode().getParent(),farm.getNode().getPosition());
        this.moveTo([[pos.getX()/Resolution.getScale(),pos.getY()/Resolution.getScale()],false]);
        
        this._lastLeftReapTime=farm.getLeftReapTime();
        farm.increase(100);
        farm.setLeftReapTime(0);
        farm.showOperation();
        this._farm=farm;
        this.nextStep();
    },
    getFarmGold:function(){
        var pos=this._farm.getPosition();
        var x=pos.getX()*Resolution.getScale(),y=pos.getY()*Resolution.getScale();
        pos=this._farm.getNode().getParent().localToScreen(pos);
        this.createView([pos.getX(),pos.getY()],false);
        EventFactory.addListener(EventFactory.Building.Event,this,this.onGetFarmGold);
        this._event=EventFactory.Building.Event;
        this._param=EventFactory.Building.Produce;
    },
    onGetFarmGold: function(action,building) {
        if(action==EventFactory.Building.Produce && this._farm==building) {
            EventFactory.removeListener(this._event,this,this.onGetFarmGold);
            
            var ObtainArticle=require('../Model/ObtainArticle').ObtainArticle;
            var Dn = require('../../DnLib/Dn').Dn;
            
            var item={};
            item.gold=ObtainArticle.spliteGold(100);
            item.exp=ObtainArticle.spliteExp(20);
            var Mining = require('../Model/Mining').Mining;
            Mining.makeArticles(ObtainArticle.createArticles(item),building.getPosition());
            this._farm.setInbornGold(0);
            this._farm.setLeftReapTime(this._lastLeftReapTime);
            delete this._lastLeftReapTime;       
            delete this._farm;
            this.nextStep();
        }
    },
    catchLeveupClose:function(){
        var self=this;
        var updateUserLevel=FunctionalController.updateUserLevel;
        var updateUIInfo=FunctionalController.updateUIInfo;
        
        FunctionalController.updateUserLevel=function(){
            FunctionalController.updateUserLevel=updateUserLevel;
            FunctionalController.updateUserLevel.apply(FunctionalController,arguments);
            
            FunctionalController.levelUpView.onHide=function(){
                self.nextStep();
            }
        };
        FunctionalController.updateUIInfo=function(user){
            this._mineralText.setText( user.crystal);
            this._goldText.setText(user.gold );
            this._starText.setText( user.energy + '/' + user.max_energy);
            this._treeExp.setText(0 + '/' + 100);
            FunctionalController.updateUIInfo=updateUIInfo;
        }
    },
    treeUpgradeAnimation: function() {
        this.nextStep();
    },

    // clickShop:function(){
    // this.createView([794*Resolution.getScale(),715*Resolution.getScale()]);
    // EventFactory.addListener(EventFactory.Building.Event,this,this.onBuildingEvent);
    // },
    // clickShop:function(){
    // this.createView([120*Resolution.getScale(),496*Resolution.getScale()]);
    // EventFactory.addListener(EventFactory.Building.Event,this,this.onBuildingEvent);
    // },
    //util
    _parseWords: function(words) {
        var ret=[];
        if(words instanceof Array) {
            //数组形式
            for(var i=0,l=words.length;i<l;i++) {
                ret.push(this._formatWord(words[i]));
            }
        } else if(typeof words=="string") {
            //对字符串组成的words的支持.";"做为分割符，":"，前的为说话者，后面是内容。
            var seg=words.split(";"),word;
            for(var i=0,l=seg.length;i<l;i++) {
                word=seq[i].split(":");
                if(word.length>1) {
                    word[1]=word.slice(1).join("");
                }
                ret.push({
                    sayer:word[0],
                    content:word[1]
                });
            }
        } else {
            //通常是一句话
            ret.push(this._formatWord(words));
        }
        return ret;
    },

    _formatWord: function(word) {
        if(word.sayer==null) {
            //只有一组键值对
            for(var sayer in word) {
                word= {
                    sayer:sayer,
                    content:word[sayer]
                };
            }
        }
        return word;
    },
    _getSingletonPrototype:function(singleton){
        //fix instantiate
        var oldConstructor=singleton.constructor;
        delete singleton.constructor;
        var p=singleton.constructor.prototype;
        singleton.constructor=oldConstructor;
        return p;
    },
    _proxyDisplay:function(singleton){
        var self=this;
        var p=this._getSingletonPrototype(singleton);
        var oldDisplay=p.display;
        
        p.display=function(){
            p.display=oldDisplay;
            singleton.display();
            self.nextStep();
        }
    },
    _proxyFunctionStartMoive:function(){
        if(this._isProxyFunctionStartMoive) return
        this._isProxyFunctionStartMoive=true;
        FunctionalController._startMoive_=FunctionalController.startMoive;
        FunctionalController.startMoive=function(){
            FunctionalController._startMoive_(true);//hide menu
        }
    },
    _restoreFunctionStartMoive:function(){
        if(!this._isProxyFunctionStartMoive) return
        this._isProxyFunctionStartMoive=false;
        FunctionalController.startMoive=FunctionalController._startMoive_;
        delete FunctionalController._startMoive_;
        FunctionalController.startMoive();
    },
    _hideJumpPoints:function(){
        if(this._jumpPointsPosition) return;
        this._jumpPointsPosition=[];
        var self=this;
        MapController._initJumpPoints_=MapController.initJumpPoints;
        
        MapController.initJumpPoints=function(jumpPoints){
            
        }
    },
    _showJumpPoints:function(){
        if(this._jumpPointsPosition && MapController._initJumpPoints_){
            MapController.initJumpPoints=MapController._initJumpPoints_;
            delete MapController._initJumpPoints_;
            var MapData = require('../Util/MapData').MapData;
            MapController.initJumpPoints(MapData.getStatic(1).jumpPoint);
        }
    },
    _showMiningHoleJumpPoint:function(jumpPoints){
        var MapData = require('../Util/MapData').MapData;
        MapController._initJumpPoints_(jumpPoints);
    },
    _proxyLifeTree:function(){
        var FirstFloorController = require('./FirstFloorController').FirstFloorController;
        FirstFloorController._lifeTree._doTouch_=FirstFloorController._lifeTree.doTouch;
        FirstFloorController._lifeTree.doTouch=function(){
            
        };
    },
    _restoreLifeTree:function(){
        var FirstFloorController = require('./FirstFloorController').FirstFloorController;
        FirstFloorController._lifeTree.doTouch=FirstFloorController._lifeTree._doTouch_;
    }
});