(function  () {
    var UIEventListenerManager  =yhge.event.UIEventListenerManager;
    var MouseEventObject  = yhge.event.MouseEventObject;
    
    var Mouse=yhge.input.Mouse=function  () {
        this.initialize.apply(this,arguments);
    };

    Mouse.prototype={
        
        classname:"Mouse",
        
        initialize:function(context,processor){
            this._context=context;
            this._processor=processor;
            this.initEvent();
        },
        initEvent:function(){
            var self=this;
            var context=this._context;
            var processor=this._processor;
            var offset=this._getOffset(this._context);
            //context 事件 可由最底层的scene事件代替。
            context.onmousedown=defaultAction;
            context.onmouseup=defaultAction;
            context.onclick=defaultAction;

            context.onmousemove=function(e){
                 
                self.onMousemove(e.pageX-offset.left,e.pageY-offset.top);
            
            };
            context.onmouseout=function(e){
                 self.onMouseout(e.pageX-offset.left,e.pageY-offset.to);
            };
            
            function defaultAction (e) {
               var mouseEvent=new MouseEventObject(e.type,true,true,e.pageX-offset.left,e.pageY-offset.top);
               var obj=processor.getTop(mouseEvent.x,mouseEvent.y);
               if(obj){
                    mouseEvent.target=obj;
                    UIEventListenerManager.dispatchEvent(obj,mouseEvent);
                }
            }
        },
        //mouseenter, mouseleave 在应用中判断与parent的关系来实现。这里不知道parent信息无法实现。
        onMousemove:function(x,y){
            var top=this._processor.getTop(x,y);
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
        onMouseout:function(x,y){
            if(this._currentTarget){
                var leaveEvent=new MouseEventObject("mouseout",true,true,x,y);
                leaveEvent.target=this._currentTarget;
                UIEventListenerManager.dispatchEvent(this._currentTarget,leaveEvent);
                this._currentTarget=null;
            }
        },
        _getOffset:function(ele){
            var left=ele.offsetLeft,top=ele.offsetTop;
            var p=ele.offsetParent;
            while(p){
                left+=p.offsetLeft;
                top+=p.offsetTop;
                p=p.offsetParent;
            }
            return {left:left,top:top};
        }
    }
})();