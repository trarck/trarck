(function($) {

    var coordUint=window.coordUnit;

    var LayerZindex= {
        Background:0,
        Intermediate:10,
        Foreground:20
    };

    function World() {
        this.initialize.apply(this,arguments);
    }

    World.prototype= {
        initialize: function(o) {
            this._map=[];
            this.initLayers(o);
            this.setWorldPosition(o.mapPosition);
        },

        /**
         * layers
         * background 地面
         * intermediate
         * foreground sprite--
         */
        initLayers: function  (o) {
            this._world=$(o.world);
            this._background=$(o.background).css({
                zIndex:LayerZindex.Background
            });
            this._intermediate=$(o.intermediate).css({
                zIndex:LayerZindex.Intermediate
            });
            this._foreground=$(o.foreground).css({
                zIndex:LayerZindex.Foreground
            });
            return this;
        },

        getWorld: function () {
            return this._world;
        },

        getBackground: function () {
            return this._background;
        },

        getIntermediate: function () {
            return this._intermediate;
        },

        getForeground: function () {
            return this._foreground;
        },

        setWorldPosition: function (pos) {
            if(pos) {
                this._world.css(pos);
                this._worldPosition=pos;
            } else {
                this._worldPosition=this._world.offset();
            }
        },

        getWorldPosition: function () {
            return this._worldPosition;
        },

        worldEvent: function () {
            var self=this;
            this._world.click( function (e) {
                var x=e.pageX,y=e.pageY;
                x-=self._worldPosition.left;
                y-=self._worldPosition.top;

                $.event.trigger('click',coordUnit.positionToMapCoord(x,y),self);
                e.preventDefault();
                return false;
            });

        },

        mapToScreenCoord: function (x,y) {
            coordUnit.mapToScreenCoord(x,y);
        },

        mapToScreenPosition: function (x,y) {
            coordUnit.mapToScreenPosition(x,y);
        },

        screenToMapCoord: function (x,y) {
            coordUnit.screenToMapCoord(x,y);
        },

        positionToMapCoord: function (left,top) {
            coordUnit.positionToMapCoord(left,top);
        },

        load: function(id) {
            var data= {
                grounds:[{
                    type:1,
                    x:1,
                    y:1
                }]
            };
            this.initGround(data.grounds);
        },

        /**
         * type:
         * x:
         * y:
         */
        initGround: function(grounds) {
            var it=null;
            for(var i=0,l=grounds.length;i<l;i++) {
                it=grounds[i];
                this.placeItem(x,y,type);
            }
        },

        placeItem: function(x,y,type) {
            var pos=coordUint.mapToScreenPosition(x,y);
            this._map[y][x]=$('<img src="images/ground/'+type+'.png"/>')
            .css(pos)
            .appendTo(this._background);
        }

    }

})(jQuery);