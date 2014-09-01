(function () {

    var KeyCode = {
        BackSpace:8,
        Tab:9,
        Clear:12,
        Enter:13,
        Shift:16,
        Control:17,
        Alt:18,
        CapeLock:20,
        Esc:27,
        Spacebar:32,
        PageUp:33,
        PageDown:34,
        End:35,
        Home:36,
        LeftArrow:37,
        UpArrow:38,
        RightArrow:39,
        DownArrow:40,
        Insert:45,
        Delete:46,

        Zero:48,
        One:49,
        Two:50,
        Three:51,
        Four:52,
        Five:53,
        Six:54,
        Seven:55,
        Eight:56,
        Nine:57,
        A:65,
        B:66,
        C:67,
        D:68,
        E:69,
        F:70,
        G:71,
        H:72,
        I:73,
        J:74,
        K:75,
        L:76,
        M:77,
        N:78,
        O:79,
        P:80,
        Q:81,
        R:82,
        S:83,
        T:84,
        U:85,
        V:86,
        W:87,
        X:88,
        Y:89,
        Z:90,

        KP0:96,
        KP1:97,
        KP2:98,
        KP3:99,
        KP4:100,
        KP5:101,
        KP6:102,
        KP7:103,
        KP8:104,
        KP9:105,
        KPMultiply:106,
        KPAdd:107,
        KPSeparator:108,
        KPSubtract:109,
        KPDecimal:110,
        KPDivide:111,

        F1:112,
        F2:113,
        F3:114,
        F4:115,
        F5:116,
        F6:117,
        F7:118,
        F8:119,
        F9:120,
        F10:121,
        F11:122,
        F12:123,
        F13:124,
        F14:125,
        F15:126,
        F16:127,
        F17:128,
        F18:129,
        F19:130,
        F20:131,
        F21:132,
        F22:133,
        F23:134,
        F24:135,
        NumLock:136,
        ScrollLock:137,

        NumLock:144

    };
    var KeyCodeName={};
    for(var name in KeyCode){
        KeyCodeName[KeyCode[name]]=name;
    }



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

    Keybord.KeyCode=KeyCode;
    Keybord.KeyCodeName=KeyCodeName;

    uikit.Keybord = Keybord;
})();