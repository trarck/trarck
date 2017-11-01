function Color(r, g, b, a) {
  this.r = parseFloat(r);//y
  this.g = parseFloat(g);//u
  this.b = parseFloat(b);//s
  this.a = ('undefined' == typeof a ? 1 : parseFloat(a));//c
}

Color.prototype.toString = function() {
  if (0.995 < this.a) {
    var a = '#' + (16777216 + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    return (a[1] == a[2] && a[3] == a[4] && a[5] == a[6] ? '#' + a[1] + a[3] + a[5] : a);
  }
  return 'rgba(' + yh.math.removeDecimalFirstZero(Math.round(this.r)) + ',' 
                 + yh.math.removeDecimalFirstZero(Math.round(this.g)) + ','
                 + yh.math.removeDecimalFirstZero(Math.round(this.b)) + ',' 
                 + yh.math.removeDecimalFirstZero(yh.math.formatDecimaTwoPlace(this.a)) + ')';
};

Color.clone=function(c) {
    return new Color(c.r, c.g, c.b, c.a);
}

Color.alphaBlend=function (a, b) {
    var c = Color.lerp(a, b, b.a);
    c.a = a.a + (1 - a.a) * b.a;
    return c;
};

Color.lerp=function (a, b, delta) {
    return new Color(
        Math.max(Math.min(a.r * (1 - delta) + b.r * delta, 255), 0), 
        Math.max(Math.min(a.g * (1 - delta) + b.g * delta, 255), 0), 
        Math.max(Math.min(a.b * (1 - delta) + b.b * delta, 255), 0), 
        Math.max(Math.min(a.a * (1 - delta) + b.a * delta, 1), 0)
    );
};

function GradientStyle(){
    this.colorStops=[];//D
    this.opacityStops=[];//G
}

function ColorStop(location,color){
    this.location = location;
    this.color = color;
}

function OpacityStop(location,opacity){
    this.location = location;
    this.opacity = opacity;
}

GradientStyle.getStopValue=function (location, stops, type) {
    if (0 === stops.length) return ('color' == type ? new G(0, 0, 0, 0) : 0);
    if (1 == stops.length || location <= stops[0].location) return ('color' == type ? Color.clone(stops[0].color) : stops[0].opacity);
    if (location >= stops[stops.length - 1].location) return ('color' == type ? Color.clone(stops[stops.length - 1].color) : stops[stops.length - 1].opacity);
    for (var i = 0, len = stops.length - 1; i < len; i++){ 
        if (location >= stops[i].location && location < stops[i + 1].location) {
            var percent = (location - stops[i].location) / (stops[i + 1].location - stops[i].location);
            return ('color' == type ? Color.lerp(stops[i].color, stops[i + 1].color, percent) : stops[i].opacity * (1 - percent) + stops[i + 1].opacity * percent);
        }
    }
    //'valueAtLocation passed through'
    return ('color' == type ? new G(0, 0, 0, 0) : 0);
};

GradientStyle.reduce=function (gradientStyle) {
    function getDistance(stop, index) {
        var current = stop[index],
            prev = (0 < b ? stop[index - 1] : null),
            next = (index < stop.length - 1 ? stop[index + 1] : null),
            k = 0;
        if(prev){
            k += (current.location - prev.location) / 2;
        }
        if(next){
            k += (next.location - current.location) / 2;
        }
        return k / 100;
    }
    
    var reduceColor = gradientStyle.colorStops.reduce(function(current, item, index, colorStops) {
        var distance = getDistance(colorStops, index);
        var c = item.color;
        current.r += c.r * distance;
        current.g += c.g * distance;
        current.b += c.b * distance;
        return current;
    }, new G(0, 0, 0, 0));
  
    var reduceOpacity = gradientStyle.opacityStops.reduce(function(current, item, index, opacityStops) {
        return current += item.opacity * getDistance(opacityStops, index);
    }, 0);
    reduceColor.a = reduceOpacity;
    return reduceColor;
};