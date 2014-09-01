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

    isometric.Coordinate= function (o) {
        this.initialize.apply(this,arguments);
    };

    isometric.Coordinate.prototype= {
        initialize: function (o) {

            this.setCoordinateUnit(o.xUnit,o.yUnit,o.zUnit);

            //地图中原点坐标在屏幕中的位置。
            ////一、在斜45中确定。斜45中的原点坐标默认和屏幕坐标一起，为了实际需要，要对原点坐标进行平移。originCoordinate就是平移的大小。
            //this.originCoordinate=o.originCoordinate||{x:1,y:0};
            //二、在屏幕坐标中设定。
            this.originPosition=o.originPosition|| {
                x:this.xUnit,
                y:0
            };//{x:350,y:0}//{x:this.xUnit*2,y:0};
        },


        setColAndRow: function (col,row) {
            this._col=col;
            this._row=row;
        },

        setCoordinateUnit: function(xUnit,yUnit,zUnit) {
            this.xUnit=xUnit;
            this.yUnit=yUnit;
            this.zUnit=zUnit||yUnit*2;
            
            this._tileWidth=this.xUnit*2;
            this._tileHeight=this.yUnit*2;
        },

        setOriginPosition: function  (op) {
            this.originPosition=op;
        },

        getOriginPosition: function  () {
            return this.originPosition;
        },

        screenToMapCoord: function (x,y) {
            if(typeof y=="undefined") {
                y=x.y;
                x=x.x;
            }
            x-=this.originPosition.x;
            y-=this.originPosition.y;
            //使用tileWidth和tileHeight少二次除法。
            x=x/this._tileWidth;
            y=y/this._tileHeight;
            return {
                x:x+y,
                y:y-x
            };
        },

        positionToMapCoord: function (x,y) {
            return this.screenToMapCoord(x,y);
        },
        
        positionToMapGrid: function (x,y) {
            var coord=this.screenToMapCoord(x,y);
            coord.x=Math.floor(coord.x);
            coord.y=Math.floor(coord.y);
            return coord;
        },

        mapToScreenCoord: function (x,y,z) {
            if(typeof y=="undefined") {
                if(x instanceof Array) {
                    z=x[2];
                    y=x[1];
                    x=x[0];
                } else {
                    z=x.z;
                    y=x.y;
                    x=x.x;
                }
            }
            z=z||0;
            var sx=x-y,
                sy=x+y;
            //使用xUnit和yUnit少二次除法
            return {
                x:sx*this.xUnit+this.originPosition.x,
                y:sy*this.yUnit+this.originPosition.y-z*this.zUnit
            };
        },

        mapToScreenPosition: function (x,y,z) {
            return this.mapToScreenCoord(x,y,z);
        },

        mapToScreenSize: function(l,b,h) {
            var s=l+b,
            w=s*this.xUnit,
            h=s*this.yUnit+h*zUnit;
            return {
                width:w,
                height:h
            };
        },

        mapToScreenAnchor: function (l,b,h) {
            return {
                x:b*this.xUnit,
                y:h*this.zUnit
            };
        }

    };
})();