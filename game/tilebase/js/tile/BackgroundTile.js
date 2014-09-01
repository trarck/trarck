tb.tile.BackgroundTile=YH.extend(tb.tile.BaseTile,{

    initialize:function  (props) {
        props.origin=props.origin||{left:-tb.unit.x,top:0};
        tb.tile.BackgroundTile._super_.initialize.call(this,props);
    },
    
    _path:'grid'
});