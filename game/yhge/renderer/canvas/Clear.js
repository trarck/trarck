(function  () {
    
    var Clear=yhge.renderer.canvas.Clear=function  () {
        this.initialize.apply(this,arguments);
    };
    
    Clear.prototype={
        
        initialize:function(width,height){
            this._contentSize.width=width;
            this._contentSize.height=height;
        },
        render:function(context){
            context.clearRect(0,0,this._contentSize.width,this._contentSize.height);
        }
    };
})();