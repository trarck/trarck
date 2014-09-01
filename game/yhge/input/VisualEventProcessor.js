(function(){
    
    var QuatTree=yhge.math.TransformQuatTree;
    
    var UIEventListenerManager  =yhge.event.UIEventListenerManager;
    var MouseEventObject  = yhge.event.MouseEventObject;
    
    /**
     * 可以设置丢弃事件功能，比如mousemove，由于产生大量事件，可以保存上次处理时间，并和当前时间比较，如果小于一定间隔不处理。
     
     */
    var VisualEventProcessor=function(){
        this.initialize.apply(this,arguments);
    };
    
    VisualEventProcessor.prototype={
        
        initialize:function(rect,size){
            this._quatTree=new QuatTree(rect);
            this._quatTree.build(size);   
        },
        addObservable:function(observable){
            this._quatTree.add(observable);
        },
        removeObservable:function(observable){
            this._quatTree.remove(observable);
        },
        trigger:function(type,x,y){
            var e=new MouseEventObject(type,true,true,x,y);
            var top=this.filter(this._quatTree.getObjsContainPoint(x,y));
            if(top){
                e.target=top;
                UIEventListenerManager.dispatchEvent(top,e);
            }
        },
        didMouseDown:function (x,y) {
            this.trigger("mousedown",x,y);
        },
        didMouseUp:function (x,y) {
            this.trigger("mouseup",x,y);
        },
        //mouseenter, mouseleave 在应用中判断与parent的关系来实现。这里不知道parent信息无法实现。
        didMouseMove:function(x,y){
            var top=this.filter(this._quatTree.getObjsContainPoint(x,y));
            if(top){
                if(this._currentTarget==null){
                    var enterEvent=new MouseEventObject("mouseover",true,true,x,y);
                    enterEvent.target=top;
                    UIEventListenerManager.dispatchEvent(top,enterEvent);
                    this._currentTarget=top;
                }else if(this._currentTarget!=top){
                    //leave last
                    var leaveEvent=new MouseEventObject("mouseout",true,true,x,y);
                    leaveEvent.target=this._currentTarget;
                    leaveEvent.relatedTarget=top;
                    UIEventListenerManager.dispatchEvent(this._currentTarget,leaveEvent);
                    //enter current
                    var enterEvent=new MouseEventObject("mouseover",true,true,x,y);
                    enterEvent.target=top;
                    UIEventListenerManager.dispatchEvent(top,enterEvent);
                    this._currentTarget=top;
                }
                
                var e=new MouseEventObject("mousemove",true,true,x,y);
                e.target=top;
                
                UIEventListenerManager.dispatchEvent(top,e);
            }else if(this._currentTarget){
                var leaveEvent=new MouseEventObject("mouseout",true,true,x,y);
                leaveEvent.target=this._currentTarget;
                UIEventListenerManager.dispatchEvent(this._currentTarget,leaveEvent);
                this._currentTarget=null;
            }
        },
        didMouseOut:function(x,y){
            if(this._currentTarget){
                var leaveEvent=new MouseEventObject("mouseout",true,true,x,y);
                leaveEvent.target=this._currentTarget;
                UIEventListenerManager.dispatchEvent(this._currentTarget,leaveEvent);
                this._currentTarget=null;
            }
        },
        didClick:function (x,y) {
            this.trigger("click",x,y);
        },
        didTouchStart:function(x,y){
            this.trigger("touchstart",x,y);
        },
        getTop:function (x,y) {
            return this.filter(this._quatTree.getObjsContainPoint(x,y));
        },
        filter:function(items){
            // console.log(items);
            if(!items) return null;
            var maxZIndexObj=items[0];
            for(var i=1,l=items.length;i<l;i++){
                maxZIndexObj=maxZIndexObj._zOrder<items[i]._zOrder?items[i]:maxZIndexObj;
            }
            return maxZIndexObj;
        }
    };
    yhge.input.VisualEventProcessor=VisualEventProcessor;
    
})();
