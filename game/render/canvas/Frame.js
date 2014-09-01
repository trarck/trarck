(function  () {
    Frame=yhge.core.Class(Shape,{
        classname:"Frame",
        initialize:function(){
            console.log("init Frame");
            Frame._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            console.log("draw Frame");
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
    });
})();