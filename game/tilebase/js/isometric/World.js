(function($) {
	if(typeof isometric=="undefined") isometric={};

    function World() {
        this.initialize.apply(this,arguments);
    }
	
	isometric.World=World;
	

    World.prototype= {
        initialize: function(o) {
            this._map=[];
            this._layers={};
            this._isoUtil=o.isoUtil;
            this.initLayers(o);
        },

        /**
         * layers
         * background 地面
         * intermediate
         * foreground sprite--
         */
        initLayers: function  (o) {
          
        },
        getLayer:function  (level) {
            //if not exist create new
        },
        removeLayer:function(layer) {
            
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

        worldEvent: function () {
          

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
        initIntermediate:function(){
            
        },
        initForeGround:function(){

        },
        placeItem: function(x,y,type) {
           
        }

    }

})(jQuery);