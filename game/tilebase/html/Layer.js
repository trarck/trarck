function Layer () {
	this.initialize.apply(this,arguments);
}

Layer.Background=0;
Layer.Intermediate=10;
Layer.Foreground=20;

Layer.prototype= {

    initialize : function(props) {
        this._view=$("<div style='position:relative;'/>");
        this.setAttributes(props);
    },

    setLevel: function(level) {
        this._level=level;
        this._view.css("zIndex",level);
        return this;
    },

    getLevel: function() {
        return this._level;
    },

    getChildCount : function() {

    },

    getChildren : function() {

    },

    addChild : function(child) {
        this._view.append(child._view);
    },

    removeChild : function(child) {
        //this._view.remove(child._view[0]);
        child._view.remove();
    },
    render:function(parent){
        if(parent) this._view.appendTo(parent._view||parent);
        return this;
    }

};
yhge.core.accessor.mixinTo(Layer);