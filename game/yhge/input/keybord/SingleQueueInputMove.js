(function () {
    var KeyCode = yhge.input.keybord.KeyCode;
    var EventUtil=yhge.util.event;


    var SingleQueueInputMove = function () {
        this.initialize.apply(this, arguments);
    };

    SingleQueueInputMove.prototype = {

        classname:"SingleQueueInputMove",

        initialize:function (process,processDuration) {
            this._input = [];
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
            EventUtil.addEventListener(document,"keydown",function(e){
                self.doKeyDown(e);
            });
            EventUtil.addEventListener(document,"keyup",function(e){
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
                    this.addActive(code);
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
                    this.removeActive(code);
                    break;
            }
        },

        addActive:function(keyCode) {
            //如果有复合键，则items数组中会有重复数据。
            if(this.getTopActive()!=keyCode){
                this._input.push(keyCode);
            };
        },
        removeActive:function(keyCode) {
            var l=this._input.length;
            if(l){
                for(var i=0;i<l;i++){
                    if(this._input[i]==keyCode){
                        break;
                    }
                }
                if(i<l) this._input.splice(i,1);
            }
        },
        getTopActive:function() {
            return this._input.length?this._input[this._input.length-1]:null;
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
            //define by user
        }
    };

    yhge.input.keybord.SingleQueueInputMove=SingleQueueInputMove;


})();
