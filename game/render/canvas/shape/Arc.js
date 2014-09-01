(function  () {
    Arc=yhge.core.Class(Shape,{
        classname:"Arc",
        initialize:function(){
            console.log("init Arc");
            this._radius=0;
            this._startAngle=0;
            this._endAngle=0;
            this._anticlockwise=true;

            Arc._super_.initialize.apply(this,arguments);
        },
        draw: function (context) {
            console.log("Arc draw:",this._color);
            context.strokeStyle=this._color;
            context.beginPath();
            context.arc(0,0,this._radius,this._startAngle,this._endAngle,this._anticlockwise);
            context.stroke();
        },
        setRadius:function(radius) {
            this._radius = radius;
            return this;
        },
        getRadius:function() {
            return this._radius;
        },
        setStartAngle:function(startAngle) {
            this._startAngle = startAngle;
            return this;
        },
        getStartAngle:function() {
            return this._startAngle;
        },
        setEndAngle:function(endAngle) {
            this._endAngle = endAngle;
            return this;
        },
        getEndAngle:function() {
            return this._endAngle;
        },
        setAnticlockwise:function(anticlockwise) {
            this._anticlockwise = anticlockwise;
            return this;
        },
        getAnticlockwise:function() {
            return this._anticlockwise;
        }

    });
})();