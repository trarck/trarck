(function() {
    YH = typeof YH=="undefined"?{}:YH;
    
    YH.Range= {
        setRange: function (range) {
            this.minX=range.minX==null?Number.NEGATIVE_INFINITY:range.minX;
            this.minY=range.minY==null?Number.NEGATIVE_INFINITY:range.minY;
            this.maxX=range.maxX==null?Number.POSITIVE_INFINITY:range.maxX;
            this.maxY=range.maxY==null?Number.POSITIVE_INFINITY:range.maxY;
            this._world.setRange({
                minX:-this.maxX,
                minY:-this.maxY,
                maxX:-this.minX,
                maxY:-this.minY
            });
        },
        /**
         * 不含边界
         */
        inSide:function(x,y){
            x=x>this.minX&&x<this.maxX;
            y=y>this.minY&&y<this.maxY;
            return {x:x,y:y};
        },
        /**
         * 含边界
         */
        inRange:function(x,y){
            x=x>=this.minX&&x<=this.maxX;
            y=y>=this.minY&&y<=this.maxY;
            return {x:x,y:y};
        },
        checkRange:function(x,y){
            x=x<this.minX?this.minX:x>this.maxX?this.maxX:x;
            y=y<this.minY?this.minY:y>this.maxY?this.maxY:y;
            return {x:x,y:y};
        }
    }
})();