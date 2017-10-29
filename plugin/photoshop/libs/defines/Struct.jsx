function Color(r, g, b, a) {
  this.r = parseFloat(r);
  this.g = parseFloat(g);
  this.b = parseFloat(b);
  this.a = ('undefined' == typeof a ? 1 : parseFloat(a));
}