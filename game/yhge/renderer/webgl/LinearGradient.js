(function  () {
    
    var LinearGradient=function  () {
        this.initialize.apply(this,arguments);
    };
    LinearGradient.prototype={
        initialize:function(x,y,width,height){
            this._segments=[];
            this._retainCount=0;
        },
        addColorStop:function(position,color){
            var seg;
            for(var i=0,l=this._segments.length;i<l;i++){
                seg=this._segments[i];
                if(seg.position==position){
                    this._segments.splice(i,1,{position:position,color:color});
                    break;
                }else if(seg.position>position){
                    this._segments.splice(i,0,{position:position,color:color});
                    break;
                }
            }
        },
        retain:function  () {
            this._retainCount++;
        },
        release:function  () {
            if(--this._retainCount==0){
                this.destroy();
            }
        },
        destroy:function  () {
            this._segments=[];
        }
    };
    yhge.renderer.canvas.LinearGradient=LinearGradient;
})();