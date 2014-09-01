(function () {
    var KeyCode = uikit.KeyCode;
    var KeyCodeName = uikit.KeyCodeName;


    var MultiKeybordInput = function () {
        this.initialize.apply(this, arguments);
    };

    MultiKeybordInput.prototype = {

        classname:"MultiKeybordInput",

        initialize:function (process,processDuration) {
            this._input = {};
            this._processDuration=50;
            process && this.setProcess(process);
            processDuration && this.setProcessDuration(processDuration);
        },

        setProcessDuration:function(processDuration) {
            this._processDuration = processDuration;
            return this;
        },
        getProcessDuration:function() {
            return this._processDuration;
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
            $(document).keydown(function(e){
                self.doKeyDown(e);
            }).keyup(function(e){
                self.doKeyUp(e);
            });
        },

        doKeyDown:function (evt) {
            var code = evt.keyCode;
            switch (code) {
                case KeyCode.UpArrow:
                case KeyCode.DownArrow:
                case KeyCode.LeftArrow:
                case KeyCode.RightArrow:
                case KeyCode.Control:
                case KeyCode.Shift:
                case KeyCode.Alt:
                    this._input[code]=true;
                    this.checkProcess();
                    break;
            }
        },
        doKeyUp:function (evt) {
            var code = evt.keyCode;
            switch (code) {
                case KeyCode.UpArrow:
                case KeyCode.DownArrow:
                case KeyCode.LeftArrow:
                case KeyCode.RightArrow:
                case KeyCode.Control:
                case KeyCode.Shift:
                case KeyCode.Alt:
//                    this._input[code]=false;
                    delete this._input[code];
                    break;
            }
        },

        checkProcess:function(){
            if(!this._processTimer){
                var self=this;
                this._processTimer=setInterval(function(){
                    var k;
                    for( k in self._input) break;
                    if(k!=null){
                        self._process();
                    }else{
                        clearInterval(self._processTimer);
                        self._processTimer=null;
                    }
                },this._processDuration);
            }
        },

        _process:function(){
            $.event.trigger("process",this._input,this);
        }
    };

    uikit.MultiKeybordInput=MultiKeybordInput;


})();
