(function  () {
    var UIEventListenerManager  =yhge.event.UIEventListenerManager;
    var MouseEventObject  = yhge.event.MouseEventObject;
    
    /**
     *对canvas的输入事件进行封装。
     *鼠标，触摸，键盘 
     *
     */
    var Input=function  () {
        this.initialize.apply(this,arguments);
    };

    Input.prototype={
        
        classname:"Input",
        
        initialize:function(canvas){
            this._canvas=canvas;
        },
        //mouse
        setupMouseEvent:function(){
            yhge.input.setupMouseEvent(this._canvas);
        },
        setupMouseEventWithProcessor:function(processor){
            yhge.input.setupMouseEventWithProcessor(this._canvas,processor);
        },
        setupMouseEventWithSingleProcessor:function(processor){
            yhge.input.setupMouseEventWithSingleProcessor(this._canvas,processor);
        },
        //touch
        setupTouchEvent:function(){
            yhge.input.setupTouchEvent(this._canvas);
        },
        setupTouchEventWithProcessor:function(processor){
            yhge.input.setupTouchEventWithProcessor(this._canvas,processor);
        },
        setupTouchEventWithSingleProcessor:function(processor){
            yhge.input.setupTouchEventWithSingleProcessor(this._canvas,processor);
        }
        //TODO keybord
    };
    yhge.input.Input=Input;
})();