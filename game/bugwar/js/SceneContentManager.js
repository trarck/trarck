(function(){
    var MouseEventObject  = yhge.event.MouseEventObject;

    var ListProcessor=yhge.scene.ListProcessor;
    
    /**
     * 游戏内容管理
     * 使用集中管理方式。由于每个物体都相同，使用集中管理比较方便。就像dom事件模型中的冒泡机制，可以把事件监听放在父类中，统一对各子元素进行处理。
     * 可以设置丢弃事件功能，比如mousemove，由于产生大量事件，可以保存上次处理时间，并和当前时间比较，如果小于一定间隔不处理。
     */
    var SceneContentManager=function(){
        this.initialize.apply(this,arguments);
    };
    SceneContentManager.prototype={
        
        initialize:function(conf){
            this._processor=new ListProcessor(conf.rect);
        },
        addObservable:function(observable){
            this._processor.add(observable);
        },
        removeObservable:function(observable){
            this._processor.remove(observable);
        },
        trigger:function(type,x,y){
            var e=new MouseEventObject(type,true,true,x,y);
            var top=this.filter(this._processor.getObjsContainPoint(x,y));
            e.target=top;
            BugWar.engine.eventListenerManager.dispatchEvent(this,e);
        },
        didMouseDown:function (x,y) {
            this.trigger("mousedown",x,y);
        },
        didMouseUp:function (x,y) {
            this.trigger("mouseup",x,y);
        },
        //mouseenter, mouseleave 在应用中判断与parent的关系来实现。这里不知道parent信息无法实现。
        didMouseMove:function(x,y){
            var top=this.filter(this._processor.getObjsContainPoint(x,y));
            if(top){
                if(this._currentTarget==null){
                    //mouseover
                    var enterEvent=new MouseEventObject("mouseover",true,true,x,y);
                    enterEvent.target=top;
                    BugWar.engine.eventListenerManager.dispatchEvent(this,enterEvent);
                    this._currentTarget=top;
                }else if(this._currentTarget!=top){
                    //leave last
                    var leaveEvent=new MouseEventObject("mouseout",true,true,x,y);
                    leaveEvent.target=this._currentTarget;
                    leaveEvent.relatedTarget=top;
                    BugWar.engine.eventListenerManager.dispatchEvent(this,leaveEvent);
                    //enter current
                    var enterEvent=new MouseEventObject("mouseover",true,true,x,y);
                    enterEvent.target=top;
                    BugWar.engine.eventListenerManager.dispatchEvent(this,enterEvent);
                    this._currentTarget=top;
                }
            }else if(this._currentTarget){
                //mouseout
                var leaveEvent=new MouseEventObject("mouseout",true,true,x,y);
                leaveEvent.target=this._currentTarget;
                BugWar.engine.eventListenerManager.dispatchEvent(this,leaveEvent);
                this._currentTarget=null;
            }
            //mousemove
            var e=new MouseEventObject("mousemove",true,true,x,y);
            e.target=top;
            BugWar.engine.eventListenerManager.dispatchEvent(this,e);
        },
        didMouseOut:function(x,y){

        },
        didClick:function (x,y) {
            this.trigger("click",x,y);
        },
        didTouchStart:function(x,y){
            this.trigger("touchstart",x,y);
        },
        getTop:function (x,y) {
            return this.filter(this._processor.getObjsContainPoint(x,y));
        },
        filter:function(items){
            // console.log(items);
            if(!items) return null;
            var maxZIndexObj=items[0];
            for(var i=1,l=items.length;i<l;i++){
                maxZIndexObj=maxZIndexObj._zOrder<items[i]._zOrder?items[i]:maxZIndexObj;
            }
            return maxZIndexObj;
       },
       setProcessor:function(processor) {
            this._processor = processor;
            return this;
       },
       getProcessor:function() {
           return this._processor;
       }
    };
    BugWar.SceneContentManager=SceneContentManager;

    var BuildingContentManager=yhge.core.Class(SceneContentManager,{
        classname:"BuildingContentManager",

        initialize:function(conf){
            BuildingContentManager._super_.initialize.apply(this,arguments);
            this._enableMove=false;
            this._selectBuildings=[];
        },
        didMouseDown:function (x,y) {
            this._enableMove=true;
            this.trigger("mousedown",x,y);
        },
        didMouseUp:function (x,y) {
            this._enableMove=false;
            this._currentTarget=null;
            this.trigger("mouseup",x,y);
        },
        //mouseenter, mouseleave 在应用中判断与parent的关系来实现。这里不知道parent信息无法实现。
        didMouseMove:function(x,y){
            if(this._enableMove){
                BuildingContentManager._super_.didMouseMove.apply(this,arguments);
            }
        }
    });
    BugWar.BuildingContentManager=BuildingContentManager;
})();
