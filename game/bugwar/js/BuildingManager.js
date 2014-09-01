(function () {
    var Building=BugWar.Building;

    var BuildingManager={

        classname:"BuildingManager",

        initialize:function(){
            this._buildings=[];
            this._selects=[];
            return this;
        },
        destroy:function(){
            for(var i= 0,l=this._buildings.length;i<l;i++){
                this._buildings[i].destroy();
            }
            this._buildings=[];
        },
        createBuilding:function (attrs) {
            var building=new Building(attrs);
            building.loadView();
            this._buildings.push(building);
            //弱连接，里面的内容不用destroy
            this._buildingContentManager.addObservable(building);
            return building;
        },
        setupBuildingEvent:function(){
            var self=this,
                  eventListenerManager=BugWar.engine.eventListenerManager,
                  directLine=this._directLine,
                  selects=this._selects;
            //选择结束
            eventListenerManager.addEventListener(this._buildingContentManager, "mouseup", function (e) {
                var targetBuilding = e.target;
                directLine.clear();

                if (targetBuilding) {
                    var total = 0;
                    for (var i = 0, l = selects.length; i < l; i++) {
                        total += selects[i].dispatchNumber();
                        selects[i].isSelected = false;
                    }
                    console.log(total,selects.length);
                    if (total) {
                        targetBuilding.addNumber(total, selects[0].getFlag());
                    }
                }
               self.clearSelects();
            });
            //进入建筑，选择取消
            eventListenerManager.addEventListener(this._buildingContentManager, "mouseover", function (e) {
                var building = e.target;
                if (building && building.isSelected) {
                    directLine.removePoint(self.getBuildingDirectPoint(building));
                    building.isSelected = false;
                    var idx = selects.indexOf(building);
                    selects.splice(idx, 1);
                }
            });
            //退出建筑，加入选择。
            eventListenerManager.addEventListener(this._buildingContentManager, "mouseout", function (e) {
                var building = e.target;
                if (building && !building.isSelected) {
                    var pos = building.getPosition();
                    //底部对齐
                    var x = pos.x + building.getWidth() / 2;
                    var y = pos.y + building.getHeight() - 10;
                    directLine.addPoint({x:x, y:y});
                    building.isSelected = true;
                    selects.push(building);
                }
            });
            //移动时，改变指向终点的位置
            eventListenerManager.addEventListener(this._buildingContentManager, "mousemove", function (e) {
                directLine.setTo({x:e.x, y:e.y});
            });
        },
        clearSelects:function(){
            for (var i in this._selects) {
                this._selects[i].isSelected = false;
            }
            this._selects=[];
        },
        getBuildingDirectPoint:function(building){
            var pos = building.getPosition();
            var x = pos.x + building.getWidth() / 2;
            var y = pos.y + building.getHeight() - 10;
            return {x:x, y:y};
        },

        setDirectLine:function(directLine){
            this._directLine=directLine;
            return this;
        },
        getDirectLine:function(){
            return this._directLine;
        },
        setBuildingContentManager:function(buildingContentManager){
            this._buildingContentManager=buildingContentManager;
            return this;
        },
        getBuildingContentManager:function(){
            return this._buildingContentManager;
        }

    };

    BugWar.BuildingFactory=BuildingManager;
})();