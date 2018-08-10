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

function StyleObj(a) {
  a.iterator(function(a, c) {
    this[c] = a;
  }, this);
};

function BaseDeclaration(name) {
  this.description = description;//a
};

function OpacityValue(value) {
  this.value = value;
}
OpacityValue.prototype.toString = function() {
  return removeDecimalFirstZero(formatDecimaTwoPlace(this.value));
};


function angleToVector2(angle) {
  var angle = (angle + 360) % 360,
      s = Math.cos((45 - angle % 90) * Math.PI / 180) * Math.sqrt(2),
      angle = (angle + 90) * Math.PI / 180;
  return {
    x: s * Math.sin(angle),
    y: s * Math.cos(angle)
  };
};

function alphaBlend(a, b) {
  var c = Da(a, b, b.c);
  c.c = a.c + (1 - a.c) * b.c;
  return c;
}


function Align(a) {
  this.angle = a;
}
function alignToCss(a) {
  switch (Math.round((a.angle + 360) % 360)) {
  case 0:
    return 'left';
  case 45:
    return 'bottom left';
  case 90:
    return 'bottom';
  case 135:
    return 'bottom right';
  case 180:
    return 'right';
  case 225:
    return 'top right';
  case 270:
    return 'top';
  case 315:
    return 'top left';
  }
  return o;
};

function StyleProperty(name, type, key, value) {
  this.name = name;//O
  this.type = type;//Q
  this.key = key;//b
  this.value = value;
}
StyleProperty.prototype.empty = p;
var CssEmpty = new StyleProperty('Empty', 'css', '.empty', o);
CssEmpty.empty = m;
var LessEmpty = new StyleProperty('Empty', 'less', '.empty', o);
LessEmpty.empty = m;
var SassEmpty = new StyleProperty('Empty', 'sass', '.empty', o);
SassEmpty.empty = m;

function StyleRule(type, name, key, value, e) {
  this.name = name;
  this.type = type;
  this.key = key;
  this.value = value;
  this.x = e;
  this.da = false;
};

function StyleSheet() {
  this.data = {};
}
function addStyle(a, b) {
  if ('undefined' != typeof b) {
    var c = b.l();
    c && (c instanceof Array || (c = [c]), c.forEach(function(a) {
      'array' == aa(this.data[a.key]) || (this.data[a.key] = []);
      this.data[a.key].push(a);
    }, a));
  }
}
var Attributes = 'Size width height opacity border .rounded .border-radius -moz-border-radius -webkit-border-radius border-radius -moz-background-clip -webkit-background-clip background-clip color font-family font-size font-weight font-style TextDecoration background-color .drop-shadow .box-shadow .shadow -moz-box-shadow -webkit-box-shadow box-shadow text-shadow background-image background BackgroundImage'.split(' '),
    DefaultOptions = {
    Xa: p,
    pa: p,
    C: p
    };
	
var HtmlElements = 'nobr a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup command data datalist dd del details dfn div dl dt em embed eventsource fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link mark map menu meta meter nav noscript object ol optgroup option output p param pre progress q ruby rp rt s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ');


function cb(a) {
  return '<selector>' + a + '</selector>';
}
function db(a) {
  return '<property>' + a + '</property>';
}
function eb(a) {
  return '<propertyEnd>' + a + '</propertyEnd>';
}
function hb(a) {
  return '<value>' + a + '</value>';
}
function ib() {
  return '<valueSeparator>,</valueSeparator>';
}
function jb() {
  return '<mixinParenEnd>)</mixinParenEnd>';
}
function kb() {
  return '<valueEnd>;</valueEnd>';
}
function lb(a) {
  return '<brace>' + a + '</brace>';
}
function mb(a) {
  return '<comment>' + a + '</comment>';
}
function generateCssRule(styleSheet/*a*/, outputWhole/*b*/,selector/*c*/, styleType/*d*/, commentEnable/*e*/, vendorExtensions/*f*/) {//nb
  function g(key, type) {
    for (var c = 0, d = allRules.length; c < d; c++) if ('any' == type) {
      if (allRules[c].key == key) return allRules[c];
    } else if (allRules[c].key == key && allRules[c].type == type) return allRules[c];
  }
  var allRules = [];
  styleSheet.data.iterator(function(styleObjs) {
    var c = styleObjs.find(function(obj) {
        return 'undefined' == typeof obj.pa || obj.pa == false;
      });
    if (styleObjs.length && c) {
      var i = null;
      if('less' == styleType && 'undefined' != typeof c.less ){
		i = mixin(DefaultOptions, c.aa);
	  }else if(('sass' == styleType || 'scss' == styleType) && 'undefined' != typeof c.sass){
		i = mixin(DefaultOptions, c.oa) 
	  }else if(('stylus_plain' == styleType || 'stylus_css' == styleType) && 'undefined' != typeof c.stylus ){
		i = mixin(DefaultOptions, c.ob) 
	  }else{
		i = mixin(DefaultOptions, c.cb);
		styleType = 'css'
	  }
	  
      i.Xa && 1 < styleObjs.length && (styleType = 'css');
      var stackable = c.stackable || 'non_stackable',
          n = false;
      styleObjs.forEach(function(obj) {
        function c(stackable, type, prop, comment, i) {
          if (prop.empty) I.log('empty property');
          else if (prop.name) {
            b = {
              value: prop.value,
              description: (commentEnable ? comment : ''),
              x: i,
              type: type,
              stackable: stackable
            };
            f = o;
            switch (stackable) {
            case 'merge_same_prefixes':
              f = g(prop.key, prop.type);
              break;
            case 'stackable':
              f = g(prop.key, 'any');
              break;
            case 'non_stackable':
              break;
            default:
              I.log('Invalid value of stackable: ' + stackable);
            }
            if (f) {
              f.x = mixin(f.x, i);
              f.value.push(b);
            } else {
              f = new StyleRule(prop.type, prop.name, prop.key, [b], i);
              allRules.push(f);
            }
          } else I.log('groupKey not present for property ' + b + ' - ' + a + ':' + I.Sa(d));
        }
        var description = a.description,
            comment = a.comment,
            prop = null,
            subType = null,
            options = null;
        if (b == 'less' && typeof a.less != 'undefined') {
          prop = a.less;
          subType = 'less';
          options = mixin(DefaultOptions, a.aa);
        } else if ((b == 'sass' || b == 'scss') && typeof a.sass != 'undefined') {
          prop = a.sass;
          subType = styleType;
          options = mixin(DefaultOptions, a.oa);
        } else if ((b == 'stylus_plain' || b == 'stylus_css') && typeof a.stylus != 'undefined') {
          prop = a.stylus;
          subType = styleType;
          options = mixin(DefaultOptions, a.ob);
        } else {
          prop = a.j;
          subType = 'css';
          options = mixin(DefaultOptions, a.cb);
        }
        if (vendorExtensions && subType == 'css') {
          if(a.ms) 
			  c(stackable, 'css', a.ms, description, options);//Qa
          if(a.moz)
			  c(stackable, 'css', a.moz, description, options);//P
          if(a.opera )
			  c(stackable, 'css', a.opera, description, options);//va
          if(a.webkit)
			  c(stackable, 'css', a.webkit, description, options);//U
        }
        if(prop && prop.empty == false ){
			c(stackable, subType, prop, comment || description, options);
		}
        if(subType != 'css' && stackable == 'merge_same_prefixes' ){
			n = true;
		}
      }, this);
      if(n){
		allRules.remove(function(a) {
			if (a.name == c.name) {
			  a.value.remove(function(a) {
				if (a.type == 'css') return true;
			  });
			  return a.value.length == 0;
			}
			return false;
		});
	  }
    }
  }, styleSheet);
  var supportRules = [];
  for (var n = 0, t = Attributes.length; n < t; n++){
	  for (var attr = Attributes[n], i = 0, w = allRules.length; i < w; i++) {
		var s = allRules[i];
		if (!s.da && (s.key == attr || s.name == attr)) {
			s.da = true;
			supportRules.push(s);
		}
	  }
  }
  
  i = 0;
  for (w = allRules.length; i < w; i++){
	  s = allRules[i];
	  if(!s.da){
		  console.log('Developer: please add property \'' + s.key + '\' (or \'' + s.name + '\') into Css.Rule._propertyOrder')
	  }
	  s.da = false;
  }
  n = '';
  if(outputWhole){
	n = '\t';
  }
  var sep = n,
      result = [];
  if ('css' == styleType){
		if(outputWhole){
			result.push('' + selector + ' ' + '{' + '\n');
		}
		supportRules.forEach(function(rule) {
			result.push('' + sep + rule.key + ':' + ' ');
			var comments = [];
			rule.value.forEach(function(val, index) {
			  var last = index == rule.value.length - 1;
			  if(val.description){
				  comments.push(c.description);
			  }
			  result.push(val.value + (last ? (comments.length ? ' ' + '/* ' + comments.join() + ' */' : '') + '\n' :' '));
			}, this);
		}, styleSheet);
		
	    if(outputWhole){
		  result.push(lb('}') + '\n');
	    }
  }else if ('less' == styleType){	
	if(outputWhole){
		result.push('' + selector + ' ' + '{' + '\n');
	}
	supportRules.forEach(function(rule) {
		var b = p,
			c = (rule.x.C ? '~"' : ''),
			d = (rule.x.C ? '"' : ''),
			isLess = 'less' == rule.type,
			f = ((isLess ? jb() : '')) + kb(),
			g = (1 < rule.value.length && !rule.x.C ? '\n' + sep : '');
		result.push('' + sep + rule.key + ((isLess ? '<mixinParen>(</mixinParen>' : eb(':') + ' ')) + g);
		var i = [];
		rule.value.forEach(function(e, j) {
		  var k = 0 == j,
			  n = j == rule.value.length - 1;
		  e.description && i.push(e.description);
		  result.push(((k ? c : '')) + hb(e.value) + ((n ? d + f : ', ')) + ((n && rule.x.C && i.length ? ' ' + mb('// ' + i.join()) : '')) + ((e.description && !rule.x.C ? (n ? ' ' + mb('// ' + e.description) : ' ' + mb('/* ' + e.description + ' */')) : '')) + ((n ? '\n' : g)));
		  'background-image' == e.value && (b = m);
		}, this);
		outputWhole && I.k('NOTE: LESS Elements doesn\'t have a mixin for background image, you might want to turn vendor prefixes on.');
	  }, styleSheet);
	  if(outputWhole)
		  result.push('}' + '\n');
  else if ('sass' == styleType || 'scss' == styleType) {
    I.k('NOTE: CSS Hat generates code for ' + ob(qb, 'Compass') + ' ' + ob(rb, 'CSS3') + ' framework.');
    var v = [],
        n = ('scss' == styleType ? ' ' + lb('{') : ''),
        t = ('scss' == styleType ? lb('}') + '\n' : ''),
        C = ('scss' == styleType ? eb(';') : '');
    outputWhole && result.push('' + cb(selector) + n + '\n');
    supportRules.forEach(function(a) {
      if (0 == a.value.length) I.log('note: triple ' + a.key + ' with no values');
      else {
        var b = 'sass' == a.type,
            c = (1 < a.value.length ? ('scss' == styleType ? '\n' + sep + '\t' : ' ') : ' '),
            e = p;
        (b ? (e = a.key, result.push('' + sep + '<include>@include</include> ' + db(a.key) + '<mixinParen>(</mixinParen>')) : result.push('' + sep + db(a.key) + eb(':') + c));
        var f = [];
        a.value.forEach(function(d, g) {
          var i = g == a.value.length - 1;
          d.description && f.push(d.description);
          if (b) {
            if (d.x.qa) e = d.x.qa;
            result.push(hb(d.value) + ((i ? jb() + C + ((f.length ? ' ' + mb('// ' + f.join()) : '')) + '\n' : ib() + ' ')));
          } else result.push(hb(d.value) + ((i ? C + ((f.length ? ' ' + mb('// ' + f.join()) : '')) + '\n' : ib() + c)));
        }, this);
        e && v.push(e);
      }
    }, styleSheet);
    outputWhole && result.push(t);
  } else if ('stylus_plain' == styleType || 'stylus_css' == styleType) {
    I.k('NOTE: CSS Hat generates code for ' + ob(sb, 'Stylus nib') + ' framework.');
    var n = ('stylus_css' == styleType ? ' ' + lb('{') : ''),
        t = ('stylus_css' == styleType ? lb('}') + '\n' : ''),
        da = ('stylus_css' == styleType ? eb(':') : ''),
        C = ('stylus_css' == styleType ? kb() : '');
    outputWhole && result.push('' + cb(selector) + n + '\n');
    supportRules.forEach(function(a) {
      if (0 == a.value.length) I.log('note: triple ' + a.key + ' with no values');
      else {
        result.push('' + sep + db(a.key) + da + ' ');
        var b = [];
        a.value.forEach(function(c, d) {
          var e = d == a.value.length - 1;
          c.description && b.push(c.description);
          result.push(hb(c.value) + ((e ? C + ((b.length ? ' ' + mb('// ' + b.join()) : '')) + '\n' : ib() + ' ')));
        }, this);
      }
    }, styleSheet);
    outputWhole && result.push(t);
  }
  return result.join('');
};

function SizeDeclaration(width, height, description) {
  this.description = description;
  this.width = width;
  this.height = height;
}
extend(SizeDeclaration, BaseDeclaration);
SizeDeclaration.prototype.getProperties = function() {
  return [new StyleObj({
    name: 'Size',
    description: this.description,
    css: CssEmpty,
    less: new StyleProperty('Size', 'less', '.size', (this.width.o(this.height) ? this.width.toString() : this.width.toString() + ', ' + this.height.toString()))
  }), new StyleObj({
    name: 'Width',
    description: this.description,
    css: new StyleProperty('Width', 'css', 'width', this.width.toString()),
    less: LessEmpty
  }), new StyleObj({
    name: 'Height',
    description: this.description,
    css: new StyleProperty('Height', 'css', 'height', this.height.toString()),
    less: LessEmpty
  })];
};

function OpacityDeclaration(value, description) {
  this.description = description;
  this.value = value;
}
extend(OpacityDeclaration, BaseDeclaration);
OpacityDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'Opacity',
    description: this.description,
    css: new StyleProperty('Opacity', 'css', 'opacity', this.value.toString()),
    Oa: new StyleProperty('Opacity', 'less', '.opacity', this.value.toString()),
    sass: new StyleProperty('Opacity', 'sass', 'opacity', this.value.toString()),
    stylus: new StyleProperty('Opacity', 'stylus', 'opacity', this.value.toString())
  });
};

function BorderDeclaration(width, type, color, description) {//vb
  this.description = description;
  this.width = width;
  this.type = type;
  this.color = color;
}
extend(BorderDeclaration, BaseDeclaration);
BorderDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'Border',
    stackable: 'non_stackable',
    description: this.description,
    css: new StyleProperty('Border', 'css', 'border', this.width.toString() + ' ' + this.type + ' ' + this.color.toString())
  });
};

function BorderRadiusDeclaration(a, description) {//Eb
  this.description = description;
  this.Ta = a;
}
extend(BorderRadiusDeclaration, BaseDeclaration);
BorderRadiusDeclaration.prototype.getProperties = function() {
  var a = '',
      b, c, a = this.Ta.toString();
  b = this.Ta;
  if (0 == b.S.length) b = m;
  else {
    var d = b.S[0];
    b = b.S.reduce(function(a, b) {
      return a && b.o(d);
    }, m);
  }(b ? (b = new StyleProperty('BorderRadius', 'less', '.rounded', a), c = new StyleProperty('BorderRadius', 'less', '.border-radius', a)) : (b = new StyleProperty('BorderRadius', 'less', '.border-radius', a), c = new StyleProperty('BorderRadius', 'less', '.border-radius', '<mixinTilda>~</mixinTilda><mixinQuote>"</mixinQuote>' + a + '<mixinQuoteEnd>"</mixinQuoteEnd>')));
  var e = /\//.test(a);
  return [new StyleObj({
    name: 'BorderRadius',
    comment: this.description,
    moz: new StyleProperty('BorderRadius', 'moz', '-moz-border-radius', a),
    webkit: new StyleProperty('BorderRadius', 'webkit', '-webkit-border-radius', a),
    css: new StyleProperty('BorderRadius', 'css', 'border-radius', a),
    Oa: b,
    aa: {
      C: e
    },
    less: c,
    sass: new StyleProperty('BorderRadius', 'sass', 'border-radius', a),
    stylus: new StyleProperty('BorderRadius', 'stylus', 'border-radius', a)
  }), new StyleObj({
    name: 'BackgroundClip',
    comment: 'prevents bg color from leaking outside the border',
    moz: new StyleProperty('BackgroundClip', 'moz', '-moz-background-clip', 'padding'),
    webkit: new StyleProperty('BackgroundClip', 'webkit', '-webkit-background-clip', 'padding-box'),
    css: new StyleProperty('BackgroundClip', 'css', 'background-clip', 'padding-box'),
    sass: new StyleProperty('BackgroundClip', 'sass', 'background-clip', 'padding-box'),
    stylus: new StyleProperty('BackgroundClip', 'stylus', 'background-clip', 'padding-box'),
    less: LessEmpty
  })];
};

function ColorDeclaration(value, description) {//Fb
  this.description = description;
  this.value = value;
}
extend(ColorDeclaration, BaseDeclaration);
ColorDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'Color',
    description: this.description,
    css: new StyleProperty('Color', 'css', 'color', this.value.toString())
  });
};

function FontFamilyDeclaration(value, description) {//Gb
  this.description = description;
  this.value = value;
}
extend(FontFamilyDeclaration, BaseDeclaration);
FontFamilyDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'FontFamily',
    description: this.description,
    css: new StyleProperty('FontFamily', 'css', 'font-family', this.value)
  });
};

function FontSizeDeclaration(value, description) {//Hb
  this.description = description;
  this.value = value;
}
extend(FontSizeDeclaration, BaseDeclaration);
FontSizeDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'FontSize',
    description: this.description,
    css: new StyleProperty('FontSize', 'css', 'font-size', this.value.toString())
  });
};

function FontWeightDeclaration(value, description) {//Ib
  this.description = description;
  this.value = value;
}
extend(FontWeightDeclaration, BaseDeclaration);
FontWeightDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'FontWeight',
    description: this.description,
    css: new StyleProperty('FontWeight', 'css', 'font-weight', this.value.toString())
  });
};

function FontStyleDeclaration(value, description) {//Jb
  this.description = description;
  this.value = value;
}
extend(FontStyleDeclaration, BaseDeclaration);
FontStyleDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'FontStyle',
    description: this.description,
    css: new StyleProperty('FontStyle', 'css', 'font-style', this.value.toString())
  });
};

function TextDecorationDeclaration(value, description) {//Kb
  this.description = description;
  this.value = value;
}
extend(TextDecorationDeclaration, BaseDeclaration);
TextDecorationDeclaration.prototype.getProperties = function() {
  if ('no_decoration' != this.value) return new StyleObj({
    name: 'TextDecoration',
    description: this.description,
    css: new StyleProperty('TextDecoration', 'css', 'text-decoration', this.value.toString())
  });
};

function BackgroundColorDeclaration(value, description) {//Lb
  this.description = description;
  this.value = value;
}
extend(BackgroundColorDeclaration, BaseDeclaration);
BackgroundColorDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'BackgroundColor',
    description: this.description,
    css: new StyleProperty('BackgroundColor', 'css', 'background-color', this.value.toString())
  });
};

function Mb(a, b, c, d, e, f, g) {//Mb
  this.description = g;
  this.F = a;
  this.d = b;
  this.e = c;
  this.blur = d;
  this.g = e;
  this.color = f;
}
extend(Mb, BaseDeclaration);

function Nb(a, b) {
  var c = (a.F ? 'inset ' : ''),
      c = (a.g.o(0) ? c + a.d.toString() + ' ' + a.e.toString() + ' ' + a.blur.toString() + ' ' + a.color.toString() : c + a.d.toString() + ' ' + a.e.toString() + ' ' + a.blur.toString() + ' ' + a.g.toString() + ' ' + a.color.toString()),
      d = new StyleProperty(b, 'less', '.box-shadow', c),
      e = new StyleProperty(b, 'less', '.box-shadow', c);
  a.F == p && (1 > a.color.y && (1 > a.color.u && 1 > a.color.s) && a.g.o(0)) && (e = new StyleProperty(b, 'less', '.drop-shadow', a.d.toString() + ', ' + a.e.toString() + ', ' + a.blur.toString() + ', ' + a.color.c.toString()));
  return {
    K: c,
    kb: e,
    lb: d
  };
};

function BoxShadowDeclaration(a, b, c, d, e, f, g) {//Ob
  Mb.call(this, a, b, c, d, e, f, g);
}
extend(BoxShadowDeclaration, Mb);
BoxShadowDeclaration.prototype.getProperties = function() {
  if (0 >= this.color.c - 0.0005) return o;
  var a = Nb(this, 'BoxShadow');
  return new StyleObj({
    name: 'BoxShadow',
    stackable: 'stackable',
    description: this.description,
    moz: new StyleProperty('BoxShadow', 'moz', '-moz-box-shadow', a.K),
    webkit: new StyleProperty('BoxShadow', 'webkit', '-webkit-box-shadow', a.K),
    css: new StyleProperty('BoxShadow', 'css', 'box-shadow', a.K),
    vb: {
      Xa: true
    },
    Oa: a.kb,
    aa: {
      C: true
    },
    less: a.lb,
    sass: new StyleProperty('BoxShadow', 'sass', 'box-shadow', a.K),
    stylus: new StyleProperty('BoxShadow', 'stylus', 'box-shadow', a.K)
  });
};

function TextShadowDeclaration(a, b, c, d, e) {//Pb
  Mb.call(this, p, a, b, c, new D(0), d, e);
}
extend(TextShadowDeclaration, Mb);
TextShadowDeclaration.prototype.getProperties = function() {
  if (0 >= this.color.c - 0.0005) return o;
  var a = Nb(this, 'TextShadow');
  return new StyleObj({
    name: 'TextShadow',
    stackable: 'non_stackable',
    description: this.description,
    css: new StyleProperty('TextShadow', 'css', 'text-shadow', a.K),
    sass: new StyleProperty('TextShadow', 'sass', 'text-shadow', a.K)
  });
};

function BackgroundImageDeclaration(value, name) {//Qb
  this.description = name;
  this.value = value;
}
extend(BackgroundImageDeclaration, BaseDeclaration);
BackgroundImageDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    pa: true,
    name: 'BackgroundImage',
    stackable: 'merge_same_prefixes',
    description: this.description,
    ms: new StyleProperty('BackgroundImage', 'ms', 'background-image', '<base64>' + this.value + '</base64>'),
    less: LessEmpty,
    sass: SassEmpty
  });
};

function BackgroundImageLinearGradientDeclaration(a, b, name) {//Rb
  this.description = name;
  this.I = a;
  this.La = b;
}
extend(BackgroundImageLinearGradientDeclaration, BaseDeclaration);
BackgroundImageLinearGradientDeclaration.prototype.getProperties = function() {
  var a = ((0 == Math.round((this.I.angle + 360) % 360) % 45 ? alignToCss(this.I) : formatDecimaTwoPlace((this.I.angle + 360) % 360) + 'deg')) + ', ' + this.La,
      b = ((0 == Math.round((this.I.angle + 360) % 360) % 45 ? alignToCss(this.I) : formatDecimaTwoPlace((90 - this.I.angle + 360) % 360) + 'deg')) + ', ' + this.La,
      b = {
      name: 'BackgroundImage',
      stackable: 'merge_same_prefixes',
      description: this.description,
      moz: new StyleProperty('BackgroundImage', 'moz', 'background-image', '-moz-linear-gradient(' + a + ')'),
      opera: new StyleProperty('BackgroundImage', 'opera', 'background-image', '-o-linear-gradient(' + a + ')'),
      webkit: new StyleProperty('BackgroundImage', 'webkit', 'background-image', '-webkit-linear-gradient(' + a + ')'),
      css: new StyleProperty('BackgroundImage', 'css', 'background-image', 'linear-gradient(' + b + ')'),
      aa: {
        C: true
      },
      less: new StyleProperty('BackgroundImage', 'less', '.background-image', 'linear-gradient(' + b + ')'),
      oa: {
        qa: 'images'
      },
      sass: new StyleProperty('BackgroundImage', 'sass', 'background-image', 'linear-gradient(' + a + ')')
      };
  0 == Math.round((this.I.angle + 360) % 360) % 45 && (b.M = new StyleProperty('BackgroundImage', 'stylus', 'background', 'linear-gradient(' + a + ')'));
  return new StyleObj(b);
};

function BackgroundImageRadialGradientDeclaration(a, b, name) {//Tb
  this.description = name;
  this.Y = a;
  this.mb = b;
}
extend(BackgroundImageRadialGradientDeclaration, BaseDeclaration);
BackgroundImageRadialGradientDeclaration.prototype.getProperties = function() {
  return new StyleObj({
    name: 'BackgroundImage',
    stackable: 'merge_same_prefixes',
    description: this.description,
    moz: new StyleProperty('BackgroundImage', 'moz', 'background-image', '-moz-radial-gradient(' + this.mb + ')'),
    opera: new StyleProperty('BackgroundImage', 'opera', 'background-image', '-o-radial-gradient(' + this.Y + ')'),
    webkit: new StyleProperty('BackgroundImage', 'webkit', 'background-image', '-webkit-radial-gradient(' + this.Y + ')'),
    css: new StyleProperty('BackgroundImage', 'css', 'background-image', 'radial-gradient(' + this.Y + ')'),
    aa: {
      C: true
    },
    less: new StyleProperty('BackgroundImage', 'less', '.background-image', 'radial-gradient(' + this.Y + ')'),
    oa: {
      qa: 'images'
    },
    sass: new StyleProperty('BackgroundImage', 'sass', 'background-image', 'radial-gradient(' + this.Y + ')')
  });
};

function generateCss(options) {
  try {
    var opts = options.split(','),
        commentAble = 'true' == opts[0],//c
        vendorExtensions = 'true' == opts[1];//d
    dimensions = 'true' == opts[2];//Hc
    outputWholeRule = 'true' == opts[3];//Nc
    var genType = opts[4] || 'css';//e
    if(documents.length==0){
		throw('NoDocumentIsOpened');
	}
    var layerStyle = new LayerStyle(),
        layerId = layerStyle.layerId || '';
    console.log('LayerStyle.toCssRule');
    var styleSheet = new StyleSheet(),
        k, n, textShadow = false,
        E = 0,
        outsetFrame = 0;
    visitorLayerStyle(layerStyle, layerStyle.style.opacity, styleSheet, function(styleSheet, value, description) {
      addStyle(styleSheet, new OpacityDeclaration(new OpacityValue(value), description));
    });
    var solidFills = layerStyle.style.solidFill;
    if (0 < solidFills.length) {
      var color = solidFills[0].value.color,
          commnets = [solidFills[0].description];
      k = 1;
      for (n = solidFills.length; k < n; ++k){
		  color = Color.alphaBlend(color, solidFills[k].value.color);	
		  commnets.push(solidFills[k].description);
	  }
	  
      if (layerStyle.isText) {
        var fills = layerStyle.style.gradientFill;
        if (0 < fills.length) {
          k = 0;
          for (n = fills.length; k < n; ++k) {
			  color = alphaBlend(color, GradientStyle.reduce(fills[k].value.gradient));
			  commnets.push(fills[k].a);
		  }
        }
        addStyle(styleSheet, new ColorDeclaration(color, commnets.join(' + ')));
      } else{
		  addStyle(styleSheet, new BackgroundColorDeclaration(color, commnets.join(' + ')));
	  }
    }
    var fonts = layerStyle.style.font;
    if (0 < fonts.length) {
      var font = fonts[0].value;
      if (font.family) {
        var family = '"' + font.family + '"',
            fixFamily =null,
            weight = ('bold' == font.weight ? 'bold' : 'normal'),
            fontStyle = ('italic' == font.style ? 'italic' : 'normal');
        if(font.family.match(/sans/i)){
			a = 'sans-serif';
		}else if( font.family.match(/serif/i)){
			a = 'serif';
		}
        if(a){
			family += ', ' + a;
		}
        addStyle(styleSheet, new FontFamilyDeclaration(family));
		
        if('normal' != weight){
			addStyle(styleSheet, new FontWeightDeclaration(weight));
		}
		
        if('normal' != fontStyle){
			addStyle(styleSheet, new FontStyleDeclaration(fontStyle));
		}
		
        if(font.underline){
			addStyle(styleSheet, new TextDecorationDeclaration('underline'));
		}
      }
      if(font.size){
		  addStyle(styleSheet, new FontSizeDeclaration(new UnitNumber(font.size, 'px')));
	  }
    }
    if(!layerStyle.isText){
		visitorLayerStyle(layerStyle, layerStyle.style.stroke, styleSheet, function(styleSheet, value) {
		  switch (value.style) {
		  case 'centeredFrame':
			console.log('Stroke is centered and there is no good way to emulate this in CSS, so we render it as inner stroke.');
			break;
		  case 'insetFrame':
			insetFrame += value.size;
			break;
		  case 'outsetFrame':
			outsetFrame += value.size;
		  }
		  addStyle(styleSheet, new BorderDeclaration(new D(b.size), 'solid', b.color, 'stroke'));
		});
	}
	
    var chokeDescriptions = [];
    visitorLayerStyle(layerStyle, layerStyle.style.dropShadow, styleSheet, function(styleSheet, value, description) {
		if(this.isText){
			if(0.0005 < value.chokeMatte)
				chokeDescriptions.push(description);
			value = MakeLightEffect(value.angle, value.distance, value.blur + value.chokeMatte, 0, value.color, false, true);
			addStyle(styleSheet, new TextShadowDeclaration(value.x, value.y, value.blur, value.color, description));
			textShadow = true ;
		}else{	  
			value = MakeBoxLightEffect(value, outsetFrame);
			addStyle(styleSheet, value, description, new BoxShadowDeclaration(value.inset, value.x, value.y, value.blur, value.chokeMatte, value.color, description));
		}
    });
	
    visitorLayerStyle(layerStyle, layerStyle.style.outerGlow, styleSheet, function(styleSheet, value, description) {
      if(this.isText){
		  if(0.0005 < value.chokeMatte){
			chokeDescriptions.push(description)
		  } 
		  value = MakeLightEffect(value.angle, value.distance, value.blur + value.chokeMatte, 0, value.color, false, true);
		  addStyle(styleSheet, new TextShadowDeclaration(value.x, value.y, value.blur, value.color, description));
		  textShadow = true;
	  }else{
		  value = MakeBoxLightEffect(value, outsetFrame);
		  addStyle(styleSheet, new BoxShadowDeclaration(value.inset, value.x, value.y, value.blur, value.chokeMatte, value.color, description));
	  }
    });
	
    if(!layerStyle.isText ){ 
		visitorLayerStyle(layerStyle, layerStyle.style.innerShadow, styleSheet, function(styleSheet, value, description) {
		  value = MakeLightEffect(value.angle, value.distance, value.blur, value.chokeMatte, value.color, true, false);
		  addStyle(styleSheet, new BoxShadowDeclaration(value.inset, value.x, value.y, value.blur, value.chokeMatte, value.color, description));
		});
		
		visitorLayerStyle(layerStyle, layerStyle.style.innerGlow, styleSheet, function(styleSheet, value, description) {
		  value = MakeLightEffect(0, 0, value.blur, value.chokeMatte, value.color, true, false);
		  addStyle(styleSheet, new BoxShadowDeclaration(value.inset, value.x, value.y, value.blur, value.chokeMatte, value.color, description));
		});
	}
	
    if(chokeDescriptions.length ){
		console.log('Choke used in text layer\'s ' + chokeDescriptions.join() + ', but it is not supported in CSS, ignoring.');
	}
	
    if(layerStyle.isText && (textShadow && vendorExtensions) ){
		console.log('IE9 doesn\'t support text shadow (and known hacks are slow), skipping.');
	}
	
    if (!layerStyle.isText) {
      var width = 100,
          height = 100;
      if (layerStyle.style.dimensions.length) {
        var psWidth = layerStyle.style.dimensions[0].value.width,
            psHeight = layerStyle.style.dimensions[0].value.height;
        if(!isNaN(psWidth) && 0 < psWidth){
			width = psWidth;
		}
        
		if(!isNaN(psHeight) && 0 < psHeight){
			height = psHeight;
		}
      }
	  
      // if (vendorExtensions && layerStyle.style.gradientFill.length) {
        // var gradientFills = [],
            // description;
        // for (k = layerStyle.style.gradientFill.length - 1; 0 <= k; k--){
			// gradientFills.push(layerStyle.style.gradientFill[k].value);
			// description = layerStyle.style.gradientFill[k].description;
		// }
        // var gb;
        // a: {
          // k = width;
          // for (var da = height, K = [], za = [], ca = 0, Aa = gradientFills.length; ca < Aa; ca++) {
            // for (var B = gradientFills[ca], ia = 'hat' + ca, a = '', b = 0, L = B.colorStops.length; b < L; b++) var V = B.colorStops[b],
                // a = a + ('<stop offset="' + Math.round(V.location) + '%" stop-color="' + new G(V.color.y, V.color.u, V.color.s, 1).toString() + '" stop-opacity="' + formatDecimaTwoPlace(V.color.c) + '"/>\n');
            // var fb;
            // switch (B.type) {
            // case 'linear':
            // case 'reflected':
              // var La = Ra(B.angle),
                  // la = B.scale / 100;
              // fb = '<linearGradient id="' + ia + '" gradientUnits="objectBoundingBox" x1="' + (50 * la * -La.d + 50 + B.offset.horizontal) + '%" y1="' + (50 * la * -La.e + 50 + B.offset.vertical) + '%" x2="' + (50 * la * La.d + 50 + B.offset.horizontal) + '%" y2="' + (50 * la * La.e + 50 + B.offset.vertical) + '%">\n' + a + '   </linearGradient>\n';
              // break;
            // case 'radial':
              // var pc = 50 + B.offset.horizontal,
                  // qc = 50 + B.offset.vertical,
                  // la = Math.round(0.5 * B.scale);
              // fb = '<radialGradient id="' + ia + '" gradientUnits="userSpaceOnUse" cx="' + pc + '%" cy="' + qc + '%" r="' + la + '%" >\n' + a + '</radialGradient>\n';
              // break;
            // default:
              // var bc = 'Sorry, ' + B.type + ' gradient type is not supported for SVG export.';
              // I.k(bc);
              // gb = '/* ' + bc + ' */';
              // break a;
            // }
            // K.push(fb);
            // za.push('<rect x="0" y="0" width="' + Math.round(k) + '" height="' + Math.round(da) + '" fill="url(#' + ia + ')" />');
          // }
          // var ra = '<?xml version="1.0" ?>\n<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ' + Math.round(k) + ' ' + Math.round(da) + '" preserveAspectRatio="none">' + K.join('\n') + '\n' + za.join('\n') + '\n</svg>',
              // Aa = '',
              // wb, Sa, Ta, cc, dc, xb, Ua, B = 0,
              // yb;
          // yb = ra.replace(/\r\n/g, '\n');
          // L = '';
          // for (V = 0; V < yb.length; V++) {
            // var ga = yb.charCodeAt(V);
            // (128 > ga ? L += String.fromCharCode(ga) : ((127 < ga && 2048 > ga ? L += String.fromCharCode(ga >> 6 | 192) : (L += String.fromCharCode(ga >> 12 | 224), L += String.fromCharCode(ga >> 6 & 63 | 128))), L += String.fromCharCode(ga & 63 | 128)));
          // }
          // for (ra = L; B < ra.length;) wb = ra.charCodeAt(B++), Sa = ra.charCodeAt(B++), Ta = ra.charCodeAt(B++), cc = wb >> 2, dc = (wb & 3) << 4 | Sa >> 4, xb = (Sa & 15) << 2 | Ta >> 6, Ua = Ta & 63, (isNaN(Sa) ? xb = Ua = 64 : isNaN(Ta) && (Ua = 64)), Aa = Aa + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(cc) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(dc) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(xb) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(Ua);
          // gb = 'url(data:image/svg+xml;base64,' + Aa + ')';
        // }
        // addStyle(styleSheet, new BackgroundImageDeclaration(gb, description));
      // }
      visitorLayerStyle(layerStyle, layerStyle.style.gradientFill, styleSheet, function(styleSheet, value, description) {
        var halfHeight, halfWidth = width / 2;
        halfHeight = height / 2;
        var angle = value.angle,
            angleCoord = angleToVector2(angle),
            length = Math.sqrt((width * (angleCoord.x + 1) * 0.5 - halfWidth) * (width * (angleCoord.x + 1) * 0.5 - halfWidth) + (height * (angleCoord.y + 1) * 0.5 - halfHeight) * (height * (angleCoord.y + 1) * 0.5 - halfHeight)),
            offsetLength = Math.sqrt((mid(value.offset.horizontal) * 0.01 * width - halfWidth - 0) * (mid(value.offset.horizontal) * 0.01 * width - halfWidth - 0) + (mid(value.offset.vertical) * 0.01 * height - halfHeight - 0) * (mid(value.offset.vertical) * 0.01 * height - halfHeight - 0)),
            deltaAngle = angle - (Math.atan2(mid(value.offset.horizontal) * 0.01 * width - halfWidth, mid(value.offset.vertical) * 0.01 * height - halfHeight) / Math.PI * 180 + 360) % 360;
        deltaAngle >= 180 && (deltaAngle = deltaAngle - 360);
        var beginLocation = offsetLength * Math.cos((deltaAngle + 90) * Math.PI / 180) / length;
        for (var scale = value.scale / 100, g = [], e = [], i = 0, j = value.colorStops.length; i < j; i++) {
          g.push(value.colorStops[i].color.toString() + ' ' + formatDecimaTwoPlace((value.colorStops[i].location - 50) * scale + 50 + 100 * beginLocation) + '%');
          e.push(value.colorStops[i].color.toString() + ' ' + formatDecimaTwoPlace(value.colorStops[i].location) + '%');
        }
        d = g.join(', ');
        e = e.join(', ');
        switch (value.type) {
        case 'reflected':
        case 'linear':
          addStyle(styleSheet, new BackgroundImageLinearGradientDeclaration(new Align(value.angle), d, description));
          break;
        case 'radial':
          d = valueToPosition(mid(value.offset.horizontal), true) + ' ' + valueToPosition(mid(value.offset.vertical), false);
          f = Math.round(value.scale * 0.5);
          f = f + '% ' + f + '%';
          f = value.scale * 0.01 * Math.min(width, height);
          f = roundCss(f) + ' ' + roundCss(f);
          vendorExtensions && (!equal(value.offset.horizontal, 50) && !equal(value.offset.vertical, 50) && !equal(value.scale, 100)) && I.k('Firefox has no way to specify gradient with nonstandard scale and position - take care and test, you\'re in uncharted waters.');
          addStyle(styleSheet, new BackgroundImageRadialGradientDeclaration(d + ', ' + f + ', ' + e, d + ', circle, ' + e, description));
          break;
        default:
          I.k('We are sorry, ' + value.type + ' gradient style is currently not supported. Write us at team@csspiffle.com.');
        }
      });
   
		
		visitorLayerStyle(layerStyle, layerStyle.style.dimensions, styleSheet, function(styleSheet, value) {
		  !equal(value.width, 0) && !equal(value.height, 0) && addStyle(styleSheet, new SizeDeclaration(new D(value.width - 2 * insetFrame), new D(value.height - 2 * insetFrame)));
		});
		
		visitorLayerStyle(layerStyle, layerStyle.style.borderRadius, styleSheet, function(styleSheet, value, description) {
		  if (!value.StyleProperty()) {
			if (i > 0.0005) {
			  xa(value.Va, i);
			  xa(value.Wa, i);
			  xa(value.Ca, i);
			  xa(value.Da, i);
			}(value.source == 'radius from layer name' ? description = 'from layer name' : value.source == 'radius from shape' && (description = 'from vector shape'));
			addStyle(styleSheet, new BorderRadiusDeclaration(value, description));
		  }
		});
	}

	
    var data;
    if (outputWholeRule) {
      var layerName = layerStyle.name,
          selectorName, selectorNames = [],
          hasSelector = true;
      layerName.split(/ +/).forEach(function(a) {
        switch (a.Ia()) {
        case '.':
        case '#':
        case ':':
        case '~':
        case '=':
        case '^=':
        case '$=':
        case '*=':
          selectorNames.push(a);
          break;
        default:
          if (a == '^=' || a == '$=' || a == '*=' || a == '+') 
			  selectorNames.push(a);
          else {
            if(a.match(/,|^[0-9+]$/)){
				hasSelector = false;
			}
            var b = a.match(/\w+/);
            if (b) {
              
                for (var c = 0, d = HtmlElements.length; c < d; c++){
					if (b[0].toLowerCase() == HtmlElements[c]) {
						b = true;
						break a;
					}
					b = false;
                }
                
              if(b){
				selectorNames.push(a.toLowerCase());
			  } else{
				  hasSelector = false;
			  }
            }
          }
        }
      });
      selectorName = (hasSelector ? selectorNames.join(' ') : null);
      var Cb;
      if (selectorName != o) Cb = selectorName;
      else {
        var Db = ec.toLowerCase().replace(/^[^a-zA-Z]+/, '').replace(/([^0-9a-zA-Z]+)$/, '').replace(RegExp('[^0-9a-zA-Z]+', 'g'), '-');
        '' === Db && (Db = 'layer');
        Cb = '.' + Db;
      }
      data = generateCssRule(styleSheet, m, Cb, genType, commentAble, vendorExtensions);
    } else data = generateCssRule(styleSheet, p, l, genType, commentAble, vendorExtensions);
    return {
      response: data,
      layerId: layerId,
      error: '',
      knownError: '',
      fullError: ''

    };
  } catch (sa) {
    return {
      response: '',
      layerId: '',
      error: ('KnownError' == sa.name ? 'Known error: ' + sa.Fa + ' - ' + sa.message : I.Ga(sa)),
      knownError: ('KnownError' == sa.name ? sa.Fa : ''),
      fullError: ''
    };
  }
}

function visitorLayerStyle(layerStyle, effects, styleSheet, handle) {//Z
    for (var i = 0, len = effects.length; i < len; ++i) 
		yh.util.proxy(handle, layerStyle)(styleSheet, effects[i].value, effects[i].description);
}