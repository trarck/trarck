tb.tile.Box=YH.extend(tb.tile.Moveable, {

    initialize: function(props) {
        props.origin=props.origin||this._calcOrigin(props.width,props.height);
        tb.tile.Box._super_.initialize.call(this,props);
        this._view.css({
            background:"url(images/"+this._path+"/"+this._code+".png) no-repeat 0  0"
        });
    },
    setDirection: function(direction) {
        if(this._direction.x==direction.x && this._direction.y==direction.y) return false;
        
        this._direction=direction;
        this._screenDirection=isometric.toScreenDirection(this._direction);
        return true;
    },
    
    _path:'box'
});

BoxShandow=YH.extend(tb.tile.Box, {
    initialize: function(props) {
        BoxShandow._super_.initialize(props);
    }

});