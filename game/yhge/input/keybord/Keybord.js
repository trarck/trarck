(function () {

    var shortcutsIdIndex=1;
    var hotkeyIdIndex=1;

    /**
     * shortcut 快捷键 组合 无顺序
     * hotkey 一组快速按下的键的顺序组合
     */

    var Keybord = function () {
        this.initialize.apply(this,arguments);
    };

    Keybord.prototype = {

        classname:"Keybord",

        initialize:function () {
            this._inputKey = {};
            this._shortcuts={};
            this._shortcutsLength=0;
            this._checkDelay=200;
            this._lastKeycode=0;

            this._pressKey=[];
            this._hotkeys={};
            this._hotkeysLength=0;
            this._hotkeyDelay=500;
        },

        setCheckDelay:function(checkDelay) {
            this._checkDelay = checkDelay;
            return this;
        },
        getCheckDelay:function() {
            return this._checkDelay;
        },

        setHotkeyDelay:function(hotkeyDelay) {
            this._hotkeyDelay = hotkeyDelay;
            return this;
        },
        getHotkeyDelay:function() {
            return this._hotkeyDelay;
        },


        setup:function(){
            var self=this;
            $(document).keydown(function(e){
                self.keydown(e);
            }).keyup(function(e){
                self.keyup(e);
            });
//                .keypress(function(e){
//                self.press(e)
//            });
        },

        keydown:function (e) {
            var code = e.keyCode;

//            if(this._lastKeycode==code) return;
//            this._lastKeycode=code;

            this._inputKey[code]=true;

            this.checkShortcut();
//
//            var self=this;
//
//            if(this._checkShortcutTimer) clearTimeout(this._checkShortcutTimer);
//            this._checkShortcutTimer=setTimeout(function(){
//                console.log("key")
//                self._checkShortcutTimer=0;
//                self.checkShortcutLongest();
//            },this._checkDelay);
        },



        keyup:function (e) {
            var code = e.keyCode;
//            if(this._lastKeycode==code){
//                this._lastKeycode=0;
//            }
            this._inputKey[code]=false;

            var self=this;
            this._pressKey.push(code);
            if(this._checkHotkeyTimer) clearTimeout(this._checkHotkeyTimer);
            this._checkHotkeyTimer=setTimeout(function(){
                self.checkHotkey();
            },this._hotkeyDelay);
        },

        press:function(e){

        },
        /**
         * 1 action keyCode keyCode ...
         * 2 action name keyCode keyCode ...
         * 3 action name args keyCode keyCode ...
         * 4 {
         *    name:string,
         *    action:function,
         *    keys:array,
         *    context:object,
         *    args:array
         *   }
         * @param action
         * @param name
         */
        addShortcut:function(action,name){
            var shortcut;
            if(arguments.length==1){
                shortcut=arguments[0];
            }else{
                var keys,args=[];
                if(typeof arguments[1]=="number"){
                    keys=Array.prototype.slice.apply(arguments,1);
                    name="";
                }else if(typeof arguments[2]=="number"){
                    keys=Array.prototype.slice.apply(arguments,2);
                }else{
                    keys=Array.prototype.slice.apply(arguments,3);
                    args=arguments[2];
                }
                shortcut={
                    name:name,
                    action:action,
                    keys:keys,
                    args:args
                };
            }
            shortcut.id=shortcutsIdIndex++;
            this._shortcutsLength++;
            this._shortcuts[shortcut.id]=shortcut;
            return shortcut.id;
        },
        checkShortcut:function(){
            var shortcut,keys,match;
            for(var id in this._shortcuts){
                shortcut=this._shortcuts[id];
                keys=shortcut.keys;
                match=true;
                for(var i=0,l=keys.length;i<l;i++){
                    if(!this._inputKey[keys[i]]){
                        match=false;
                        break;
                    }
                }
                if(match){
                    shortcut.action.apply(shortcut.context,shortcut.args);
                    break;
                }
            }
        },
        checkShortcutLongest:function(){

            var shortcut,keys,match;
            var longestShortcut,long=0;
            for(var id in this._shortcuts){
                shortcut=this._shortcuts[id];
                keys=shortcut.keys;
                match=true;
                for(var i=0,l=keys.length;i<l;i++){
                    if(!this._inputKey[keys[i]]){
                        match=false;
                        break;
                    }
                }
                if(match){
                    if(long<keys.length){
                        long=keys.length;
                        longestShortcut=shortcut;
                    }
                }
            }
            longestShortcut && longestShortcut.action.apply(shortcut.context,shortcut.args);
        },

        addHotkey:function(action,name){
            var hotkey;
            if(arguments.length==1){
                hotkey=arguments[0];
            }else{
                var keys,args=[];
                if(typeof arguments[1]=="number"){
                    keys=Array.prototype.slice.apply(arguments,1);
                    name="";
                }else if(typeof arguments[2]=="number"){
                    keys=Array.prototype.slice.apply(arguments,2);
                }else{
                    keys=Array.prototype.slice.apply(arguments,3);
                    args=arguments[2];
                }
                hotkey={
                    name:name,
                    action:action,
                    keys:keys,
                    args:args
                };
            }
            hotkey.id=hotkeyIdIndex++;
            this._hotkeysLength++;
            this._hotkeys[hotkey.id]=hotkey;
            return hotkey.id;
        },

        checkHotkey:function(){
//            var s="";
//            for(var i in this._pressKey)
//                s+=KeyCodeName[this._pressKey[i]];
//            console.log(s);

            var hotkey,keys,match;
            for(var id in this._hotkeys){
                hotkey=this._hotkeys[id];
                keys=hotkey.keys;
                match=true;
                for(var i=0,l=keys.length;i<l;i++){
                    if(this._pressKey[i]!=keys[i]){
                        match=false;
                        break;
                    }
                }
                if(match){
                    hotkey.action.apply(hotkey.context,hotkey.args);
                    break;
                }
            }

            this._pressKey=[];
        }
    };

    yhge.input.keybord.Keybord = Keybord;
})();