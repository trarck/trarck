/**
 把屏幕坐标向正方向移动一个单位
 设置元件left的时候，不需要减去一个x单位值
 但是在捕获鼠标事件的时候，x方向的偏移量要减去一个x单位大小
 
 mx=sx/w+sy/h
 my=sy/h-sx/w
 
 sx=(mx-my)*w/2=(mx-my)*xUnit
 sy=(mx+my)*h/2=(mx+my)*yUnit
 */
(function() {
    var  isometric= yhge.isometric;

    isometric.Coord= function (o) {
        this.initialize.apply(this,arguments);
    };

    isometric.Coord.prototype= {
        initialize: function (o) {

            this.setCoordUnit(o.xUnit,o.yUnit,o.zUnit);

            //地图中原点坐标在屏幕中的位置。
            //这个不是必须的，会导致多余的运算
//            ////一、在斜45中确定。斜45中的原点坐标默认和屏幕坐标一起，为了实际需要，要对原点坐标进行平移。originCoord就是平移的大小。
//            //this.originCoord=o.originCoord||{x:1,y:0};
//            //二、在屏幕坐标中设定。
//            this.originPosition=o.originPosition|| {
//                x:this.xUnit,
//                y:0
//            };//{x:350,y:0}//{x:this.xUnit*2,y:0};
        },

        setColAndRow: function (col,row) {
            this._col=col;
            this._row=row;
        },

        setCoordUnit: function(xUnit,yUnit,zUnit) {
            this.xUnit=xUnit;
            this.yUnit=yUnit;
            this.zUnit=zUnit||yUnit*2;
            
            this._tileWidth=this.xUnit*2;
            this._tileHeight=this.yUnit*2;
        },
//
//        setOriginPosition: function  (op) {
//            this.originPosition=op;
//        },
//
//        getOriginPosition: function  () {
//            return this.originPosition;
//        },

        screenToMapCoord: function (x,y) {
            //使用tileWidth和tileHeight少二次除法。
            x=x/this._tileWidth;
            y=y/this._tileHeight;
            return {
                x:x+y,
                y:y-x
            };
        },

        positionToMapCoord: function (p) {
            return this.screenToMapCoord(p.x, p.y);
        },

        screenToMapGrid: function (x,y) {
            var coord=this.screenToMapCoord(x, y);
            coord.x=Math.floor(coord.x);
            coord.y=Math.floor(coord.y);
            return coord;
        },

        positionToMapGrid: function (p) {
            var coord=this.screenToMapCoord(p.x, p.y);
            coord.x=Math.floor(coord.x);
            coord.y=Math.floor(coord.y);
            return coord;
        },

        mapToScreenCoord: function (x,y,z) {
            var sx=x-y,
                sy=x+y;
            //使用xUnit和yUnit少二次除法
            var nx=sx*this.xUnit,
                ny=z?sy*this.yUnit-z*this.zUnit:sy*this.yUnit;

            return {
                x:nx,
                y:ny
            };
        },
        mapPositionToScreenCoord: function (p) {
            return this.mapToScreenCoord(p.x, p.y, p.z);
        },
        mapToScreenCoord2: function (x,y) {
            var sx=x-y,
                sy=x+y;
            //使用xUnit和yUnit少二次除法
            return {
                x:sx*this.xUnit,
                y:sy*this.yUnit
            };
        },
        mapPositionToScreenCoord2: function (p) {
            return this.mapToScreenCoord2(p.x, p.y);
        },

        mapSizeToScreenSize: function(l,b,h) {
            var s=l+b,
            w=s*this.xUnit,
            h=s*this.yUnit+h*zUnit;
            return {
                width:w,
                height:h
            };
        },

        /**
         * 物体的原点，转换成屏幕坐标的位置。
         * 这里屏幕坐村的原点在左上角。
         * @param l
         * @param b
         * @param h
         * @return {Object}
         */
        calcScreenAnchor: function (l,b,h) {
            return {
                x:b*this.xUnit,
                y:h*this.zUnit
            };
        }

    };
})();