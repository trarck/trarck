/*
b:name
a:description
L:stackable
j:css
q:less
t:sass
M:stylus
Qa:ms
P:moz
U:webkit
va:opera
*/
function StyleObj(obj) {
  obj.iterator(function(v, k) {
    this[k] = v;
  }, this);
}



function StyleProperty(name, type, key, value) {
  this.name = name;//O
  this.type = type;//Q
  this.key = key;//b
  this.value = value;
}

StyleProperty.prototype.empty = false;//J

var CssEmpty = new StyleProperty('Empty', 'css', '.empty', null);
CssEmpty.empty = true;
var LessEmpty = new StyleProperty('Empty', 'less', '.empty', null);
LessEmpty.empty = true;
var SassEmpty = new StyleProperty('Empty', 'sass', '.empty', null);
SassEmpty.empty = true;

function Za(name, type, key, value, e) {
  this.name = name;
  this.type = type;
  this.key = key;
  this.value = value;
  this.x = e;
  this.da = false;
};

function Content() {
  this.data = {};
}
function addStyle(a, b) {
  if ('undefined' != typeof b) {
    var c = b.l();
    c && (c instanceof Array || (c = [c]), c.forEach(function(a) {
      'array' == aa(this.data[a.b]) || (this.data[a.b] = []);
      this.data[a.b].push(a);
    }, a));
  }
}

var Properties = 'Size width height opacity border .rounded .border-radius -moz-border-radius -webkit-border-radius border-radius -moz-background-clip -webkit-background-clip background-clip color font-family font-size font-weight font-style TextDecoration background-color .drop-shadow .box-shadow .shadow -moz-box-shadow -webkit-box-shadow box-shadow text-shadow background-image background BackgroundImage'.split(' ');

function BaseDeclaration(name) {
  this.name = name;//a
};

function OpacityValue(value) {
  this.value = value;
}

OpacityValue.prototype.toString = function() {
  return removeDecimalFirstZero(formatDecimaTwoPlace(this.value));
};

