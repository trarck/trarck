(function(){

    var Sprite=yhge.renderer.Sprite;

    var EventObject=yhge.event.EventObject;
    var UIEventListenerManager=yhge.event.UIEventListenerManager;
    var UIEventTarget=yhge.ui.UIEventTarget;
    var EventType=yhge.ui.EventType;

    var State={
        Normal: 0x00,
        Focused: 0x01,
        Selected: 0x02,
        Pressed: 0x04,//active
        Checked: 0x08,
        Hover:0x10,
        Custom: 0x00FF0000,
        Disabled: 0x40000000
    };
    
    /**
     * 任意UI组件都可以设背景
     */
    var Component=yhge.core.Class([Sprite,UIEventTarget],{
       
        classname:"Component",

        State:State,
        
        root:null,
        context:null,//上下文环境
        
        initialize: function(props){
            Component._super_.initialize.apply(this,arguments);
        },
        setParent:function  (parent) {
            if(this._parent)
                this._parent.removeChild(this);
            
            this._parent=parent;
            this.root=parent.root||this.getRoot();
            return this;
        },
        getRoot:function(){
            var p=this._parent;
            while(p._parent) p=p._parent;
            return p;
        },
        appendTo:function(parent){
            
        },
        /**
         * 初始化关键element对象
         * @param {Object} o 配置项
         */
        setElements:function(elements){
            
        },
        /**
         * 添加忽略某些事件的元素
         * @param {Object} ele
         */
        addIgnoreElement:function(ele){
            
        },
        /**
         * 删除忽略某些事件的元素
         * @param {Object} ele
         */
        removeIgnoreElement:function(ele){
            
        },
        
        show: function(opt){
            var e=EventObject.create(EventType.Show);
            UIEventListenerManager.dispatchEvent(this,e);
        },
        hide: function(opt){
            var e=EventObject.create(EventType.Hide);
            UIEventListenerManager.dispatchEvent(this,e);
        },
        //==================event target=======================//

        addEventListener: function  (type,handler,data,scope,params) {
            return UIEventListenerManager.addEventListener(this,type,handler,data,scope,params);
        },
        removeEventListener: function  (type,handler) {
            return UIEventListenerManager.removeEventListener(this,type,handler);
        },
        getEventListeners:function(type){
            return UIEventListenerManager.getEventListeners(this,type);
        },
        dispatchEvent: function(event) {
            return UIEventListenerManager.dispatchEvent(this,event);
        },
        trigger:function(type,data,bubbles){
            return UIEventListenerManager.trigger(this,type,data,bubbles);
        },
        on:function  (type,handler,data,scope,params) {
            return UIEventListenerManager.addEventListener(this,type,handler,data,scope,params);
        },
        off: function  (type,handler) {
            return UIEventListenerManager.removeEventListener(this,type,handler);
        },
        fire:function(type,data,bubbles){
            return UIEventListenerManager.trigger(this,type,data,bubbles);
        }
    },{
        State:State
    });
    yhge.ui.Component=Component;
})();
