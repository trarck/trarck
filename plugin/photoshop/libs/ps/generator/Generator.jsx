function visitorLayerStyle(layerStyle, effects, c, handle) {//Z
    for (var i = 0, len = effects.length; i < len; ++i) yh.util.proxy(handle, layerStyle)(c, effects[i].value, effects[i].name);
}

function generateCss(options){
    I.bb();
  try {
    var b = a.split(','),
        c = 'true' == b[0],
        d = 'true' == b[1];
    Hc = 'true' == b[2];
    Nc = 'true' == b[3];
    var e = b[4] || 'css';
    Mc = d;
    documents.length || h(new sc('NoDocumentIsOpened'));
    var layerStyle = new LayerStyle(),
        layerId = layerStyle.layerId || '';
    I.ja('LayerStyle.toCssRule');
    var j = new $a(),
        k, n, t = p,
        E = 0,
        i = 0;
    visitorLayerStyle(layerStyle, layerStyle.style.opacity, j, function(a, b, c) {
      M(a, new ub(new pa(b), c));
    });
    var w = layerStyle.style.solidFill;
    if (0 < w.length) {
      var s = w[0].value.color,
          r = [w[0].a];
      k = 1;
      for (n = w.length; k < n; ++k) s = Ca(s, w[k].value.color), r.push(w[k].a);
      if (layerStyle.p) {
        var q = layerStyle.style.gradientFill;
        if (0 < q.length) {
          I.k('CSS cannot express gradient over text, used average gradient color instead.');
          k = 0;
          for (n = q.length; k < n; ++k) s = Ca(s, Ma(q[k].value.gradient)), r.push(q[k].a);
        }
        M(j, new Fb(s, r.join(' + ')));
      } else M(j, new Lb(s, r.join(' + ')));
    }
    var v = layerStyle.style.font;
    if (0 < v.length) {
      var C = v[0].value;
      if (C.fa) {
        var da = '<quote>"</quote>' + C.fa + '<quoteEnd>"</quoteEnd>',
            a = o,
            K = ('bold' == C.tb ? 'bold' : 'normal'),
            za = ('italic' == C.style ? 'italic' : 'normal');
        (C.fa.match(/sans/i) ? a = 'sans-serif' : C.fa.match(/serif/i) && (a = 'serif'));
        a && (da += ', ' + a);
        M(j, new Gb(da));
        'normal' != K && M(j, new Ib(K));
        'normal' != za && M(j, new Jb(za));
        C.sb && M(j, new Kb('underline'));
      }
      C.size && M(j, new Hb(new D(C.size, 'px')));
    }
    layerStyle.p || visitorLayerStyle(layerStyle, layerStyle.style.stroke, j, function(a, b) {
      switch (b.style) {
      case 'centeredFrame':
        I.k('Stroke is centered and there is no good way to emulate this in CSS, so we render it as inner stroke.');
        break;
      case 'insetFrame':
        E += b.size;
        break;
      case 'outsetFrame':
        i += b.size;
      }
      M(a, new vb(new D(b.size), 'solid', b.color, 'stroke'));
    });
    var Ka = [];
    visitorLayerStyle(layerStyle, layerStyle.style.dropShadow, j, function(a, b, c) {
      (this.p ? (0.0005 < b.g && Ka.push(c), b = nc(b.angle, b.distance, b.blur + b.g, 0, b.color, p, m), M(a, new Pb(b.d, b.e, b.blur, b.color, c)), t = m) : (b = mc(b, i), M(a, new Ob(b.F, b.d, b.e, b.blur, b.g, b.color, c))));
    });
    visitorLayerStyle(layerStyle, layerStyle.style.outerGlow, j, function(a, b, c) {
      (this.p ? (0.0005 < b.g && Ka.push(c), b = nc(b.angle, b.distance, b.blur + b.g, 0, b.color, p, m), I.Pa(b, 'shadowObj'), M(a, new Pb(b.d, b.e, b.blur, b.color, c)), t = m) : (b = mc(b, i), M(a, new Ob(b.F, b.d, b.e, b.blur, b.g, b.color, c))));
    });
    layerStyle.p || (visitorLayerStyle(layerStyle, layerStyle.style.innerShadow, j, function(a, b, c) {
      b = nc(b.angle, b.distance, b.blur, b.g, b.color, m, p);
      M(a, new Ob(b.F, b.d, b.e, b.blur, b.g, b.color, c));
    }), visitorLayerStyle(layerStyle, layerStyle.style.innerGlow, j, function(a, b, c) {
      b = nc(0, 0, b.blur, b.g, b.color, m, p);
      M(a, new Ob(b.F, b.d, b.e, b.blur, b.g, b.color, c));
    }));
    Ka.length && I.k('Choke used in text layer\'s ' + Ka.m() + ', but it is not supported in CSS, ignoring.');
    layerStyle.p && (t && Mc) && I.k('IE9 doesn\'t support text shadow (and known hacks are slow), skipping.');
    if (!layerStyle.p) {
      var S = 100,
          U = 100;
      if (layerStyle.style.dimensions.length) {
        var ca = layerStyle.style.dimensions[0].value.width,
            ia = layerStyle.style.dimensions[0].value.height;
        !isNaN(ca) && 0 < ca && (S = ca);
        !isNaN(ia) && 0 < ia && (U = ia);
      }
      if (Mc && layerStyle.style.gradientFill.length) {
        var C = [],
            Sb;
        for (k = layerStyle.style.gradientFill.length - 1; 0 <= k; k--) C.push(layerStyle.style.gradientFill[k].value), Sb = layerStyle.style.gradientFill[k].a;
        var gb;
        a: {
          k = S;
          for (var da = U, K = [], za = [], ca = 0, Aa = C.length; ca < Aa; ca++) {
            for (var B = C[ca], ia = 'hat' + ca, a = '', b = 0, L = B.i.length; b < L; b++) var V = B.i[b],
                a = a + ('<stop offset="' + Math.round(V.location) + '%" stop-color="' + new G(V.color.y, V.color.u, V.color.s, 1).toString() + '" stop-opacity="' + A(V.color.c) + '"/>\n');
            var fb;
            switch (B.type) {
            case 'linear':
            case 'reflected':
              var La = Ra(B.angle),
                  la = B.scale / 100;
              fb = '<linearGradient id="' + ia + '" gradientUnits="objectBoundingBox" x1="' + (50 * la * -La.d + 50 + B.offset.horizontal) + '%" y1="' + (50 * la * -La.e + 50 + B.offset.vertical) + '%" x2="' + (50 * la * La.d + 50 + B.offset.horizontal) + '%" y2="' + (50 * la * La.e + 50 + B.offset.vertical) + '%">\n' + a + '   </linearGradient>\n';
              break;
            case 'radial':
              var pc = 50 + B.offset.horizontal,
                  qc = 50 + B.offset.vertical,
                  la = Math.round(0.5 * B.scale);
              fb = '<radialGradient id="' + ia + '" gradientUnits="userSpaceOnUse" cx="' + pc + '%" cy="' + qc + '%" r="' + la + '%" >\n' + a + '</radialGradient>\n';
              break;
            default:
              var bc = 'Sorry, ' + B.type + ' gradient type is not supported for SVG export.';
              I.k(bc);
              gb = '/* ' + bc + ' */';
              break a;
            }
            K.push(fb);
            za.push('<rect x="0" y="0" width="' + Math.round(k) + '" height="' + Math.round(da) + '" fill="url(#' + ia + ')" />');
          }
          var ra = '<?xml version="1.0" ?>\n<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ' + Math.round(k) + ' ' + Math.round(da) + '" preserveAspectRatio="none">' + K.join('\n') + '\n' + za.join('\n') + '\n</svg>',
              Aa = '',
              wb, Sa, Ta, cc, dc, xb, Ua, B = 0,
              yb;
          yb = ra.replace(/\r\n/g, '\n');
          L = '';
          for (V = 0; V < yb.length; V++) {
            var ga = yb.charCodeAt(V);
            (128 > ga ? L += String.fromCharCode(ga) : ((127 < ga && 2048 > ga ? L += String.fromCharCode(ga >> 6 | 192) : (L += String.fromCharCode(ga >> 12 | 224), L += String.fromCharCode(ga >> 6 & 63 | 128))), L += String.fromCharCode(ga & 63 | 128)));
          }
          for (ra = L; B < ra.length;) wb = ra.charCodeAt(B++), Sa = ra.charCodeAt(B++), Ta = ra.charCodeAt(B++), cc = wb >> 2, dc = (wb & 3) << 4 | Sa >> 4, xb = (Sa & 15) << 2 | Ta >> 6, Ua = Ta & 63, (isNaN(Sa) ? xb = Ua = 64 : isNaN(Ta) && (Ua = 64)), Aa = Aa + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(cc) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(dc) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(xb) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(Ua);
          gb = 'url(data:image/svg+xml;base64,' + Aa + ')';
        }
        M(j, new Qb(gb, Sb));
      }
      visitorLayerStyle(layerStyle, layerStyle.style.gradientFill, j, function(a, b, c) {
        var d, e = S / 2;
        d = U / 2;
        var f = b.angle,
            g = Ra(f),
            g = Math.sqrt((S * (g.d + 1) * 0.5 - e) * (S * (g.d + 1) * 0.5 - e) + (U * (g.e + 1) * 0.5 - d) * (U * (g.e + 1) * 0.5 - d)),
            i = Math.sqrt((jc(b.offset.horizontal) * 0.01 * S - e - 0) * (jc(b.offset.horizontal) * 0.01 * S - e - 0) + (jc(b.offset.vertical) * 0.01 * U - d - 0) * (jc(b.offset.vertical) * 0.01 * U - d - 0)),
            e = f - (Math.atan2(jc(b.offset.horizontal) * 0.01 * S - e, jc(b.offset.vertical) * 0.01 * U - d) / Math.PI * 180 + 360) % 360;
        e >= 180 && (e = e - 360);
        d = i * Math.cos((e + 90) * Math.PI / 180) / g;
        for (var f = b.scale / 100, g = [], e = [], i = 0, j = b.i.length; i < j; i++) {
          g.push(b.i[i].color.toString() + ' ' + A((b.i[i].location - 50) * f + 50 + 100 * d) + '%');
          e.push(b.i[i].color.toString() + ' ' + A(b.i[i].location) + '%');
        }
        d = g.join(', ');
        e = e.join(', ');
        switch (b.type) {
        case 'reflected':
        case 'linear':
          M(a, new Rb(new Ga(b.angle), d, c));
          break;
        case 'radial':
          d = Jc(jc(b.offset.horizontal), m) + ' ' + Jc(jc(b.offset.vertical), p);
          f = Math.round(b.scale * 0.5);
          f = f + '% ' + f + '%';
          f = b.scale * 0.01 * Math.min(S, U);
          f = ua(f) + ' ' + ua(f);
          Mc && (!F(b.offset.horizontal, 50) && !F(b.offset.vertical, 50) && !F(b.scale, 100)) && I.k('Firefox has no way to specify gradient with nonstandard scale and position - take care and test, you\'re in uncharted waters.');
          M(a, new Tb(d + ', ' + f + ', ' + e, d + ', circle, ' + e, c));
          break;
        default:
          I.k('We are sorry, ' + b.type + ' gradient style is currently not supported. Write us at team@csspiffle.com.');
        }
      });
    }
    layerStyle.p || visitorLayerStyle(layerStyle, layerStyle.style.dimensions, j, function(a, b) {
      !F(b.width, 0) && !F(b.height, 0) && M(a, new tb(new D(b.width - 2 * E), new D(b.height - 2 * E)));
    });
    layerStyle.p || visitorLayerStyle(layerStyle, layerStyle.style.borderRadius, j, function(a, b, c) {
      if (!b.J()) {
        if (i > 0.0005) {
          xa(b.Va, i);
          xa(b.Wa, i);
          xa(b.Ca, i);
          xa(b.Da, i);
        }(b.source == 'radius from layer name' ? c = 'from layer name' : b.source == 'radius from shape' && (c = 'from vector shape'));
        M(a, new Eb(b, c));
      }
    });
    I.ka();
    var zb;
    if (Nc) {
      var ec = layerStyle.name,
          Ab, Va = [],
          Bb = m;
      ec.split(/ +/).forEach(function(a) {
        switch (a.Ia()) {
        case '.':
        case '#':
        case ':':
        case '~':
        case '=':
        case '^=':
        case '$=':
        case '*=':
          Va.push(a);
          break;
        default:
          if (a == '^=' || a == '$=' || a == '*=' || a == '+') Va.push(a);
          else {
            a.match(/,|^[0-9+]$/) && (Bb = p);
            var b = a.match(/\w+/);
            if (b) {
              a: {
                for (var c = 0, d = Lc.length; c < d; c++) if (b[0].toLowerCase() == Lc[c]) {
                  b = m;
                  break a;
                }
                b = p;
              }(b ? Va.push(a.toLowerCase()) : Bb = p);
            }
          }
        }
      });
      Ab = (Bb ? Va.join(' ') : o);
      var Cb;
      if (Ab != o) Cb = Ab;
      else {
        var Db = ec.toLowerCase().replace(/^[^a-zA-Z]+/, '').replace(/([^0-9a-zA-Z]+)$/, '').replace(RegExp('[^0-9a-zA-Z]+', 'g'), '-');
        '' === Db && (Db = 'layer');
        Cb = '.' + Db;
      }
      zb = nb(j, m, Cb, e, c, d);
    } else zb = nb(j, p, l, e, c, d);
    return {
      response: zb,
      layerId: g,
      error: '',
      knownError: '',
      fullError: '',
      log: I.Ja(),
      warn: I.Ka()
    };
  } catch (sa) {
    return {
      response: '',
      layerId: '',
      error: ('KnownError' == sa.name ? 'Known error: ' + sa.Fa + ' - ' + sa.message : I.Ga(sa)),
      knownError: ('KnownError' == sa.name ? sa.Fa : ''),
      fullError: '',
      log: I.Ja(),
      warn: I.Ka()
    };
  }
    
}