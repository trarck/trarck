(function() {
    var core=yhge.core;

    var Component=yhge.ui.Component;

    var UIEventListenerManager=yhge.event.UIEventListenerManager;

    var Button=core.Class(Component, {

        classname:"Button",

        initialize: function(props) {
            this._stateComponents= {};
            this._state=Button.State.Normal;
            Button._super_.initialize.apply(this,arguments);
            this.initEvents();
        },

        draw: function (context) {
            var stateComponent=this._stateComponents[this._state]||this._stateComponents[Button.Normal];
            stateComponent.draw(context);
        },

        initEvents: function () {
            var self=this;
            UIEventListenerManager.addEventListener(this,"mousedown", function(e) {
                self.setState(Button.State.Pressed);
                //capture mouse up
                UIEventListenerManager.addEventListener(self.root,"mouseup", capture);
            });

            //capture mouse up
            UIEventListenerManager.addEventListener(this,"mouseup", function(e) {
                if(self._state==Button.State.Pressed) {
                    self.setState(Button.State.Hover);
                } else {
                    self.setState(Button.State.Normal);
                }
                UIEventListenerManager.removeEventListener(self.root,"mouseup", capture);
            });

            UIEventListenerManager.addEventListener(this,"mouseover", function(e) {
                self.setState(Button.State.Hover);
            });

            UIEventListenerManager.addEventListener(this,"mouseout", function(e) {
                if(self._state==Button.State.Pressed){
                    self.setState(Button.State.Hover);
                }else{
                    self.setState(Button.State.Normal);
                }
            });

            function capture(e) {
                // console.log("in capture");
                if(self._state==Button.State.Pressed) {
                    self.setState(Button.State.Hover);
                } else {
                    self.setState(Button.State.Normal);
                }
                UIEventListenerManager.removeEventListener(self.root,"mouseup", capture);
            }

        },

        setState: function(state) {
            this._state = state;
            return this;
        },

        getState: function() {
            return this._state;
        },

        setStateComponent: function(stateComponent,state) {
            this._stateComponents[state||Button.State.Normal] = stateComponent;
            return this;
        },

        getStateComponent: function(state) {
            return this._stateComponents[state];
        },

        setNormal: function(normalComponent) {
            this._stateComponents[Button.State.Normal] = normalComponent;
            return this;
        },

        getNormal: function() {
            return this._stateComponents[Button.State.Normal];
        },

        setPressed: function(pressedComponent) {
            this._stateComponents[Button.State.Pressed] = pressedComponent;
            return this;
        },

        getPressed: function() {
            return this._stateComponents[Button.State.Pressed];
        },

        setHover: function(hoverComponent) {
            this._stateComponents[Button.State.Hover] = hoverComponent;
            return this;
        },

        getHover: function() {
            return this._stateComponents[Button.State.Hover];
        },

        setDisabled: function(disabledComponent) {
            this._stateComponents[Button.State.Disabled] = disabledComponent;
            return this;
        },

        getDisabled: function() {
            return this._stateComponents[Button.State.Disabled];
        }

    });

    yhge.ui.Button=Button;

})();