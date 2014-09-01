(function($) {
    var isometric=yhge.isometric;
    
    var LayerZindex= {
        Background:0,
        Intermediate:10,
        Foreground:20
    };

    World=yhge.core.extend(isometric.World, {

        initialize: function(o) {
            this._map=[];
            this._layers= {};
            this._isoUtil=o.isoUtil;
            
            
            this._world=$(o.world);
            
            var offset=this._world.offset();
            this._position={x:offset.left,y:offset.top};
            
            this._worldEvent();
            this._initLayers();
        },
        
        /**
         * layers
         * background 地面
         * intermediate
         * foreground sprite--
         */
        _initLayers: function  () {
            this._background=this.getLayer(LayerZindex.Background);
            this._intermediate=this.getLayer(LayerZindex.Intermediate);
            this._foreground=this.getLayer(LayerZindex.Foreground);
            return this;
        },

        getLayer: function  (level) {
            var layer=this._layers[level];
            if(!layer) {
                layer=this._layers[level] = new Layer({
                    level:level || 0
                });
                layer.render(this._world);
            }
            return layer;
        },
        getWorldPosition:function(x,y){
            x-=tb.screenOffset.left+this._position.x;
            y-=tb.screenOffset.top+this._position.y;
            return {x:x,y:y};
        },
        _worldEvent: function () {
            var self=this;
            this._world.click( eventProcess)
            .mousedown( eventProcess)
            .mousemove( eventProcess)
            .mouseup( eventProcess)
            
            function eventProcess(e){
                var x=e.pageX,y=e.pageY,
                    worldPosition=self.getWorldPosition(x,y);
                $.event.trigger(e.type,worldPosition,self);
                e.preventDefault();
            }
            //.dragDrop();
        },
        
        
        
        addToBackground: function(tile) {
            this._background.addChild(tile);
            return this.setMapData(tile,LayerZindex.Background);
        },
        
        getBackground: function(x,y) {
            return this.getMapData(x,y,LayerZindex.Background);
        },

        addToIntermediate: function(tile) {
            this._intermediate.addChild(tile);
            return this.setMapData(tile,LayerZindex.Intermediate);
        },

        getIntermediate: function(x,y) {
            return this.getMapData(x,y,LayerZindex.Intermediate);
        },

        addToForeground: function  (tile) {
            this._foreground.addChild(tile);
            return this.setMapData(tile,LayerZindex.Foreground);
        },
        removeFromForeground: function(tile) {
            this._foreground.removeChild(tile);
            return this.removeMapData(tile,LayerZindex.Foreground);
        },
        getForeground: function(x,y) {
            return this.getMapData(x,y,LayerZindex.Foreground);
        },

        addTile: function(tile,layer) {
            layer=this.getLayer(layer);
            layer.addChild(tile);
            return this.setMapData(tile,layer);
        },

        setMapData: function(tile,layer) {
            var items=this._map[tile.my];
            if(!items) {
                items=this._map[tile.my]=[];
            }
            var item=items[tile.mx];
            if(!item) {
                item=items[tile.mx]= {
                    barrier:0
                };
            }
            var layerItem=item[layer];
            if(!layerItem){
                layerItem=item[layer]={length:0}
            }
            layerItem[tile.mz]=tile;
            layerItem.length++;
            item.barrier+=tile.barrier;
			return this;
        },
        removeMapData: function(tile,layer) {
            var items=this._map[tile.my];
            if(items) {
                var item=items[tile.mx];
                var layerItem=item && item[layer];
                if(layerItem) {
                    item.barrier-=item.barrier;
                    layerItem.length--;
                    delete layerItem[tile.mz];
                    if(!layerItem.length) {
                        delete item[layer];
                    }
                }
            }
			return this;
        },
        getMapData: function(x,y,layer) {
            var items=this._map[y];
            if(items) {
                var item=items[x];
                return layer?(item && item[layer]):item;
            }
            return null;
        },

        

        load: function(id) {
            var data= {
                background:[{
                    type:1,
                    x:1,
                    y:1
                }],
                foreground:[]
            };
            //init background
            this.initBackground(data.background);
            //init intermediate
            this.initForeground(data.foreground);
            //init foreground
        },

        initBackground: function(grounds) {
            var it=null;
            for(var i=0,l=grounds.length;i<l;i++) {
                it=grounds[i];
                var ground=new tb.tile.BackgroundTile(it);
                this._background.addChild(ground);
            }
        },

        initIntermediate: function() {

        },

        initForeground: function(items) {
            var it=null,tile;
            for(var i=0,l=items.length;i<l;i++) {
                it=items[i];
                switch (it.type) {
                    case 1:
                        //box
                        tile=new tb.tile.Box(it);
                        break;
                }

                this._foreground.addChild(tile);
            }
        },
        setRange: function (range) {
            this.minX=range.minX==null?Number.NEGATIVE_INFINITY:range.minX;
            this.minY=range.minY==null?Number.NEGATIVE_INFINITY:range.minY;
            this.maxX=range.maxX==null?Number.POSITIVE_INFINITY:range.maxX;
            this.maxY=range.maxY==null?Number.POSITIVE_INFINITY:range.maxY;
        },
        checkRange:function(x,y){
            x=x<this.minX?this.minX:x>this.maxX?this.maxX:x;
            y=y<this.minY?this.minY:y>this.maxY?this.maxY:y;
            return {x:x,y:y};
        },
        setPosition:function(x,y){
            x=x<this.minX?this.minX:x>this.maxX?this.maxX:x;
            y=y<this.minY?this.minY:y>this.maxY?this.maxY:y;
            
            this._position={x:x,y:y};
            this._world.css({left:x,top:y});
            return this;
        },
        getPosition:function(){
            return this._position;
        },
        getSize:function(){
            return {width:this._world.width(),height:this._world.height()};
        }
    });
})(jQuery);