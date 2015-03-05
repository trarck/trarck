var yh;
var console;

(function (yh){
    
    var Level={
        None:0,
        Exception:1,
        Error:2,
        Warn:3,
        Debug:4,
        Info:5
    };

    var levelMap={};

    for(var k in yh.Log.Level){
        levelMap[yh.Log.Level[k]]=k;
    }

    var currentLevel=Level.Info;

    yh.Log={

        log:function(){
           fl.trace(formatLogArg(Level.Info,Array.prototype.slice.call(arguments,0)));
        },

        info:function(){
            if(currentLevel>=Level.Info){
                fl.trace(formatLogArg(Level.Info,Array.prototype.slice.call(arguments,0)));
            }
        },

        debug:function(){
            if(currentLevel>=Level.Debug){
                fl.trace(formatLogArg(Level.Debug,Array.prototype.slice.call(arguments,0)));
            }
        },
        
        warn:function(){
            if(currentLevel>=Level.Warn){
                fl.trace(formatLogArg(Level.Warn,Array.prototype.slice.call(arguments,0)));
            }
        },

        error:function(){
            if(currentLevel>=Level.Error){
                fl.trace(formatLogArg(Level.Error,Array.prototype.slice.call(arguments,0)));
            }
        },
            
        exception:function(){
            if(currentLevel>=Level.Exception){
                fl.trace(formatLogArg(Level.Exception,Array.prototype.slice.call(arguments,0)));
            }
        },

        setLevel:function(level){
            currentLevel=level;
        }
    };

    yh.Log.Level=Level;

    console=yh.Log;

    function formatLogArg(level,args){
        return "["+levelMap[level]+"]:"+args.join("\t");
    }

})(yh);