(function () {
    var KeyCode = yhge.input.keybord.KeyCode;
    var EventUtil=yhge.util.event;

    var SingleInputMove = function () {
        this.initialize.apply(this, arguments);
    };

    SingleInputMove.prototype = {

        classname:"SingleInputMove",

        initialize:function (process) {
            this._input = {};
            process && this.setProcess(process);
        },

        setProcess:function(process) {
            this._process = process;
            return this;
        },
        getProcess:function() {
            return this._process;
        },

        setup:function(){
            var self=this;

            EventUtil.addEventListener(document,"keydown",function(e){
                self.doKeyDown(e);
            });
            EventUtil.addEventListener(document,"keyup",function(e){
                self.doKeyUp(e);
            });
        },

        doKeyDown:function (e) {
            var code = e.keyCode;
            switch (code) {
                case KeyCode.UpArrow:
                case KeyCode.DownArrow:
                case KeyCode.LeftArrow:
                case KeyCode.RightArrow:
                    e.preventDefault();
                    this._process(code);
                    break;
                case KeyCode.Control:
                case KeyCode.Shift:
                case KeyCode.Alt:
                    this._input[code]=true;
                    break;
            }
        },

        doKeyUp:function (e) {
            var code = e.keyCode;
            switch (code) {
                case KeyCode.Control:
                case KeyCode.Shift:
                case KeyCode.Alt:
                    this._input[code]=false;
                    break;
            }
        },

        _process:function(code){
            //define by user
        }
    };

    yhge.input.keybord.SingleInputMove=SingleInputMove;


})();
