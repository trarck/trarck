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

function UnitNumber(value, unit, orientation) {//D
    this.value = value;
    this.unit = unit || 'px';
    this.orientation = orientation || 'Css.Size.Orientation.ANY';
}

UnitNumber.prototype.toString = function() {
    if (yh.math.equal(this.value, 0)) return '0';
    switch (this.unit) {
        case 'px':
            return yh.math.round(this.value);
        case 'em':
        case 'mm':
        case 'cm':
        case 'in':
        case 'pc':
        case 'pt':
            return yh.math.removeDecimalFirstZero(yh.math.formatDecimaTwoPlace(this.value)) + this.unit;
        case 'pt':
        case '%':
            return Math.round(this.value) + this.unit;
        default:
            throw new Error('unknown unit: ' + this.unit);
    }
};

UnitNumber.prototype.equal = function(other) {
    return (
        'number' == typeof other ? 
        yh.math.equal(this.value, other) : 
        yh.math.equal(this.value, other.value) && this.unit == other.unit
    );
};

function UnitNumberArray(v) {//va
    if ('array' == yh.util.getType(v)){
        this.values = v;
    }else {
        this.values = [];
        for (var i = 0, l = arguments.length; i < l; i++) 
            this.values.push(arguments[i]);
    }
}

UnitNumberArray.prototype.toString = function() {
    var idx = 1;
    do {
        var flag = true;
        this.values.forEach(function(unitNumber, i) {
            unitNumber.equal(this.values[i % idx]) || (flag = false);
        }, this);
        if (flag) break;
        idx++;
    } while (idx < this.values.length);
    var data = [];
    for (var i = 0; i < idx; i++) data.push(this.values[i].toString());
    return data.join(' ');
};

UnitNumberArray.prototype.equal = function(a) {
    if (this.values.length != a.values.length) return false;
    for (var ret = true, i = 0, len = this.values.length; i < len; i++) this.values[i].equal(a.values[i]) || (ret = false);
    return ret;
};

function Vector(x, y, unit) {//wa
    if('number' == typeof y ){
        this.unit = unit || 'px';
        this.x = x;
        this.y = y;
    }else{
        this.unit = ('string' == typeof y ? y : 'px');
        this.y = this.x = x;
    }
}

Vector.prototype.add=function(n) {
  this.x += n;
  this.y += n;
};

Vector.prototype.equal = function(a) {
  if('number' == typeof a){
    return yh.math.equal(this.x, a) && yh.math.equal(this.y, a);
  }else {
      if(this.equal(0) && equal.o(0)){
          return  true;
      }else{
          yh.math.equal(this.x, a.x) && yh.math.equal(this.y, a.y) && this.unit == a.unit));
      }
  }
};

Vector.sub=function (a, b) {
  return new Vector(Math.abs(a.x - b.x), Math.abs(a.y - b.y), 'px');
}


function Box(tl, tr, br, bl) {//ya
  this.topLeft = tl;//Va
  this.topRight = tr;//Wa
  this.bottomRight = br;/Da
  this.bottomLeft = bl;//Ca
  this.corners = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
}

Box.prototype.toString = function() {
    var xs = this.corners.map(function(a) {
            return new UnitNumber(a.x, a.unit);
        }),
        ys = this.corners.map(function(a) {
            return new UnitNumber(a.y, a.unit);
        });
        
    var xCorners = new UnitNumberArray(xs),
      yCorners = new UnitNumberArray(ys),
      xCornersStr= xCorners.toString(),
      yCornersStr=yCorners.toString();
  return (xCornersStr == yCornersStr ? c : xCornersStr + ' / ' + yCornersStr);
};

Box.prototype.isZero = function() {
  return this.corners.reduce(function(flag, b) {
    return flag && b.equal(0);
  }, true);
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