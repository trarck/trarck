function Color(r, g, b, a) {
  this.r = parseFloat(r);
  this.g = parseFloat(g);
  this.b = parseFloat(b);
  this.a = ('undefined' == typeof a ? 1 : parseFloat(a));
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

function GradientStyle(){
    this.colorStops=[];//D
    this.opacities=[];//G
}

function ColorStop(location,color){
    this.location = location;
    this.color = color;
}

function OpacityStop(location,opacity){
    this.location = location;
    this.opacity = opacity;
}