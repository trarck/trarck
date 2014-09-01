function SpriteManage(options){
   this._init(options);
}

SpriteManage.prototype = {
    _init: function(options){
        this.childNodes=[];
        this.fps=options.fps;
        this.duration=parseInt(1000/this.fps);
    },
    run: function(){
        var self=this;
        this._timer=setInterval(function(){
            for (var i = 0; i < self.childNodes.length; i++) {
                var p=self.childNodes[i];
                p.draw();
                p.enable && p.nextFrame();
            }
        }, this.duration);
    },
    stop:function(){
        clearInterval(this._timer);
    },
    addChild:function(sprite){
        this.childNodes.push(sprite)
    }
}