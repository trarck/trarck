(function  () {
    var UIEventListenerManager  =yhge.event.UIEventListenerManager;
    var MouseEventObject  = yhge.event.MouseEventObject;
    
    /**
     * 对canvas的鼠标事件进行封装。
     * 只要对坐标计算一次。也可以直接给canvas添加事件，但坐标到canvas坐标要计算多次。
     * 不过实际中很少有需要对cnavas进行多次事件处理。
     *
     * 使用对象好像没有必要
     *
     */
    var Mouse=yhge.input.Mouse=function  () {
        this.initialize.apply(this,arguments);
    };

    Mouse.prototype={
        
        classname:"Mouse",
        
        initialize:function(canvas,processor){
            this._canvas=canvas;
            this._processor=processor;
        },
        setupEvent:function(canvas){
            canvas=canvas||this._canvas;
            yhge.input.setupMouseEvent(canvas);
        },
        setupEventWithProcessor:function(canvas,processor){
            canvas=canvas||this._canvas;
            processor=processor||this._processor;
            yhge.input.setupMouseEventWithProcessor(canvas,processor);
        },
        setupEventWithSingleProcessor:function(canvas,processor){
            canvas=canvas||this._canvas;
            processor=processor||this._processor;
            yhge.input.setupMouseEventWithSingleProcessor(canvas,processor);
        }
    };
    /**
     *使用自定义事件管理器处理canvas事件
     */
    yhge.input.setupMouseEvent=function(canvas){
        canvas=canvas;
        var offset=yhge.input.getOffset(canvas);
        //canvas 事件 可由最底层的scene事件代替。
        canvas.onmousedown=function(e){
            var e=new MouseEventObject(e.type,true,true,e.pageX-offset.left,e.pageY-offset.top);
            UIEventListenerManager.handleEvent(canvas,e);
        };
        canvas.onmouseup=function(e){
            var e=new MouseEventObject(e.type,true,true,e.pageX-offset.left,e.pageY-offset.top);
            UIEventListenerManager.handleEvent(canvas,e);
        };
        //TODO 省略一些move事件
        canvas.onmousemove=function(e){
            var e=new MouseEventObject(e.type,true,true,e.pageX-offset.left,e.pageY-offset.top);
            UIEventListenerManager.handleEvent(canvas,e);            
        };
        canvas.onmouseout=function(e){
            var e=new MouseEventObject(e.type,true,true,e.pageX-offset.left,e.pageY-offset.top);
            UIEventListenerManager.handleEvent(canvas,e);
        };
        canvas.onclick=function(e){
            var e=new MouseEventObject(e.type,true,true,e.pageX-offset.left,e.pageY-offset.top);
            UIEventListenerManager.handleEvent(canvas,e);
        };
    };
    /**
     *使用代理方式处理canvas事件，支持多个代理者
     */
    yhge.input.setupMouseEventWithProcessor=function(canvas,processor){
        canvas=canvas;
        processor=processor;

        var offset=yhge.input.getOffset(canvas);
        //canvas 事件 可由最底层的scene事件代替。
        processor.didMouseDown &&
        canvas.addEventListener("mousedown",function(e){
            processor.didMouseDown(e.pageX-offset.left,e.pageY-offset.top);
        });

        processor.didMouseUp &&    
        canvas.addEventListener("mouseup",function(e){
            processor.didMouseUp(e.pageX-offset.left,e.pageY-offset.top);
        });
        //TODO 省略一些move事件
        processor.didMouseMove &&
        canvas.addEventListener("mousemove",function(e){
            processor.didMouseMove(e.pageX-offset.left,e.pageY-offset.top);           
        });

        processor.didMouseOut &&
        canvas.addEventListener("mouseout",function(e){
            processor.didMouseOut(e.pageX-offset.left,e.pageY-offset.top);
        });

        processor.didClick &&
        canvas.addEventListener("click",function(e){
            processor.didClick(e.pageX-offset.left,e.pageY-offset.top);
        });
    };
    /**
     *使用代理方式处理canvas事件，支持单个代理者
     */
    yhge.input.setupMouseEventWithSingleProcessor=function(canvas,processor){
        canvas=canvas;
        processor=processor;

        var offset=yhge.input.getOffset(canvas);
        //canvas 事件 可由最底层的scene事件代替。
        
        if(processor.didMouseDown)
        canvas.onmousedown=function(e){
            processor.didMouseDown(e.pageX-offset.left,e.pageY-offset.top);
        };

        if(processor.didMouseUp)
        canvas.onmouseup=function(e){
            processor.didMouseUp(e.pageX-offset.left,e.pageY-offset.top);
        };
        //TODO 省略一些move事件
        if(processor.didMouseMove)
        canvas.onmousemove=function(e){
            processor.didMouseMove(e.pageX-offset.left,e.pageY-offset.top);           
        };

        if(processor.didMouseOut)
        canvas.onmouseout=function(e){
            processor.didMouseOut(e.pageX-offset.left,e.pageY-offset.top);
        };

        if(processor.didClick)
        canvas.onclick=function(e){
            processor.didClick(e.pageX-offset.left,e.pageY-offset.top);
        };
    };
})();