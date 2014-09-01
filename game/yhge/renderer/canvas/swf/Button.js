(function () {

    var Sprite=yhge.renderer.canvas.Sprite;
    var MovieClip=yhge.renderer.canvas.swf.MovieClip;
    var UIEventListenerManager=yhge.event.UIEventListenerManager;

    var ASObject=yhge.renderer.canvas.swf.ASObject;
    
    var ButtonState={
        Up:"Up",//default normal state . whenever the mouse is outside the button
        Over:"Over", //The over state is displayed when the mouse is moved inside the button
        Down:"Down",//It is displayed when the mouse is clicked inside the button
        Hit:"Hit"  //defines the active area of the button.This is an invisible state and is never displayed. It defines the area of the button that reacts to mouse clicks
    };

    var Button=yhge.core.Class([ASObject,Sprite],{

        classname:"Button",

        initialize: function(props) {
            this._currentState=ButtonState.Up;
            this._states={};
            this._actions=[];
            Button._super_.initialize.apply(this,arguments);
        },

        update: function(delta,deltaFrame) {
            var stateFrame=this._states[this._currentState];
            var it;
            for(var zOrder in stateFrame){
                it=stateFrame[zOrder];
                if(it.character.classname=="MovieClip" || it.character.classname=="Button"){
                    it.character.update(delta,deltaFrame);
                }
            }
        },

        setStates:function(states) {
            this._states = states;
            return this;
        },
        getStates:function() {
            return this._states;
        },

        setStateFrame:function(state,stateFrame){
            this._states[state]=stateFrame;
        },
        getStateFrame:function(state){
            return this._states[state];
        },

        setState:function(state) {
            this._currentState = state;
            return this;
        },

        getState:function() {
            return this._currentState;
        },

        setActions:function(actions) {
            this._actions = actions;
            return this;
        },
        getActions:function() {
            return this._actions;
        },

        initEvents: function () {
            switch(yhge.input.inputType){
                case yhge.input.InputType.Mouse:
                    this.initMouseEvents();
                    break;
                case yhge.input.InputType.Touch:
                    this.initTouchEvents();
                    break;
            }
        },

        initMouseEvents: function () {

            var self=this;
            UIEventListenerManager.addEventListener(this,"mousedown", function(e) {
                self.setState(ButtonState.Down);
            });

            //capture mouse up
            UIEventListenerManager.addEventListener(this,"mouseup", function(e) {
                self.setState(ButtonState.Up);
            });

            UIEventListenerManager.addEventListener(this,"mouseover", function(e) {
                self.setState(ButtonState.Over);
            });

            UIEventListenerManager.addEventListener(this,"mouseout", function(e) {
                self.setState(ButtonState.Up);
            });

        },

        initTouchEvents: function () {

            var self=this;

            UIEventListenerManager.addEventListener(this,"touchstart", function(e) {
                self.setState(ButtonState.Down);
            });

            //capture touch end
            UIEventListenerManager.addEventListener(this,"touchend", function(e) {
                self.setState(ButtonState.Up);
            });

            UIEventListenerManager.addEventListener(this,"touchover", function(e) {
                self.setState(ButtonState.Over);
            });

            UIEventListenerManager.addEventListener(this,"toucheout", function(e) {
                self.setState(ButtonState.Up);
            });

        },

        render: function (context) {
            if (!this._visible) {
                return;
            }

            context.save();

            this.transform(context);

            // Set alpha value (global only for now)
            context.globalAlpha = this._opacity;
            
            var stateFrame=this._states[this._currentState];
            var it;
            for(var zOrder in stateFrame){
                it=stateFrame[zOrder];
                //为了保持对像的数量最少，这里把属性的改变保存在frame中。
                //如果内存够大，把每一帧的对象建立一个拷贝，属性变化直接设置到拷贝的对象中。
                it.character.setTransformMatrix(it.transform);
                it.character.render(context);
            }

            context.restore();
        },
//        /**
//         * 只负责画自己。render中处理子元素。
//         * 另外一种方案。帧中的每层对象都是资源的clone，然后把数据直接设置在clone的对象上。这样每帧都不需要计算数据。
//         * 目前只对transform进行处理，所以改进不大。
//         */
//        draw:function (context) {
//            var stateFrame=this._states[this._currentState];
//            stateFrame.character.setTransformMatrix(ele.transform);
//            stateFrame.character.render(context);
//        },

        setTransformMatrix:function(transformMatrix) {
           this._transformMatrix = transformMatrix;
           this._dirty=0;
           return this;
        },

        getTransformMatrix:function() {
           return this._transformMatrix;
        },
        
        clone:function () {
            var newBtn=Button._super_.clone.apply(this,arguments);
            newBtn._characterId=this._characterId;
            newBtn._currentState=this._currentState;
            newBtn._states=this._states;
            return newBtn;
        }
    });

    Button.ButtonState=ButtonState;

    //直接生成MovieClip
    Button.create=function(context,def,resMap,config){
        console.log("createButton:"+def.characterId);
        var frameLayer,ele,character,
            stateFrames=def.stateFrames;
		//MovieClip通常以固定的帧率更新，可以省去duration
        var btn=new Button({characterId:def.characterId});
        var usedCharacters={};
        for(var state in stateFrames){
            frameLayer=MovieClip.parseElements(state,MovieClip.sortElements(stateFrames[state]),context,resMap,btn,usedCharacters,config);
            btn.setStateFrame(state,frameLayer);
        }
        var hitStateFrmae=btn.getStateFrame("Hit");
        //now support one area TODO support more
        for(var depth in hitStateFrmae){
            var character=hitStateFrmae[depth].character;
            btn.setWidth(character.getWidth());
            btn.setHeight(character.getHeight());
            break;
        }

        btn.setActions(def.actions);
        btn.initEvents();
        return btn;
    };

    yhge.renderer.canvas.swf.Button=Button;
})();