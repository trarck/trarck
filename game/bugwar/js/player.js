(function () {
    
    var Circle=yhge.renderer.canvas.shape.Circle;

    var Player=yhge.core.Class(Circle,{
        classname:"Player",
        
        initialize:function(){
            Player._super_.initialize.apply(this,arguments);
        },
        moveTo:function(position){
            this._endPosition= position;
            engine.timer.scheduleUpdate(this);
        },
        update:function(){
            var pos=this.getPosition();
            pos.x+=1;
            pos.y+=1;
            this.setPosition(pos);
            if(pos.x>200){
                engine.timer.unscheduleUpdate(this);
            }
        },

        setSpeed:function(speed){
            this._speed=speed;
        },
        getSpeed:function(){
            return this._speed;
        }

    });
    BugWar.Player=Player;
})();