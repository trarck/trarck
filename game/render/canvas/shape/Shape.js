(function  () {
    Shape=yhge.core.Class([Node,yhge.core.Accessor],{
        /**
         * width
           height
           color
         */

        initialize:function(props){
            console.log("init shape");
            Shape._super_.initialize.apply(this,arguments);
            this.setAttributes(props);
        },
        setWidth:function(width) {
            this._width = width;
            return this;
        },
        getWidth:function() {
            return this._width;
        },
        setHeight:function(height) {
            this._height = height;
            return this;
        },
        getHeight:function() {
            return this._height;
        },
        setColor:function(color) {
            this._color = color;
            return this;
        },
        getColor:function() {
            return this._color;
        }
    });
    Shape.classname="Shape";
})();