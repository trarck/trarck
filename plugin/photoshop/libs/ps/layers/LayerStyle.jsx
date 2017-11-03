//require defines/Terminology
//require Log

var LayerStyle;
(function(){
    var xc=true;
    
    var DefaultColorStops = [new ColorStop(0, new Corlor(0, 0, 0)), new ColorStop(100, new Corlor(255, 255, 255))],
    DefaultOpacities = [new OpacityStop(0, 1), new OpacityStop(100, 1)];
    
    LayerStyle=function(layer){
        this.layer=layer;
        
        this.style = {};
        this.style.dropShadow = [];
        this.style.innerShadow = [];
        this.style.outerGlow = [];
        this.style.innerGlow = [];
        this.style.stroke = [];
        this.style.solidFill = [];
        this.style.gradientFill = [];
        this.style.opacity = [];
        this.style.borderRadius = [];
        this.style.dimensions = [];
        this.style.font = [];
        
        this.na = [];
        this.Z = [];
        this.ba = [];
    };     
    
    LayerStyle.prototype={
        active:function(){
            if(this.layer.parent.activeLayer!=this.layer){
                this.layer.parent.activeLayer=this.layer;
            }
        },
         
        readActiveValue:function(path, type, defaultValue){
            if(!this.layerDescriptor){
                this.layerDescriptor=ActionUtils.getActiveLayerDescriptor();
            }
            
            ActionUtils.getPSObjectPropertyChain(this.layerDescriptor,path, type, defaultValue);
        },
        
        initialize:function(){
            this.active();
            var layerDescriptor=ActionUtils.getActiveLayerDescriptor();
            this.layerDescriptor=layerDescriptor;
            var key=layerDescriptor.typename + 'Object';
            this.descriptorData=ActionUtils.DescriptorTypeHandle[layerDescriptor.typename](layerDescriptor,key);//Ra
            this.resolution=72;
            
            //layerSection
            this.layerSection=this.descriptorData.layerSection;
            if('layerSectionStart' == this.layerSection || 'layerSectionEnd' == this.layerSection){
                throw 'LayerGroupSelected';
            }
            if('layerSectionContent' != this.layerSection){
                throw 'Unexpected layer type: ' + this.layerSection;
            }
             
            //read id
            this.layerId=yh.checkType(layerDescriptor.getInteger(charIDToTypeID('LyrI')),'number').toString();
            this.name=yh.checkType(ActionUtils.getPSObjectPropertyChain(layerDescriptor,'name'),'string');
            this.checkLayerEffectMode(this, '', 'layer');
            
            this.la=false;
            this.kind=this.layer.kind.toString();//ta
            //isText
            this.isText = 'LayerKind.TEXT' === this.kind;
            this.opacity = yh.checkType(this.readActiveValue('opacity') / 255, 'number');
            this.fillOpacity = yh.checkType(this.readActiveValue('fillOpacity') / 255, 'number');
            this.globalAngle = yh.checkType(this.readActiveValue('globalAngle'), 'number');
            1 > this.opacity && this.style.opacity.push({
                value: this.opacity,
                name: 'layer alpha'
            });
            if (this.isText && xc) {
                var color, textItem = this.layer.textItem;
                textItem.contents || throw 'NoContentsTextLayer';
                var face = textItem.font,
                    size = textItem && textItem.size || 20,
                    family, font, underline = UnderlineType.UNDERLINEOFF;
                try {
                    underline = textItem && textItem.underline || UnderlineType.UNDERLINEOFF;
                } catch (ex) {}
                var k = 'normal',
                    style = 'normal';
                try {
                    font = app.fonts[face];
                } catch (t) {}
                var fontName,fontFamily,fontStyle;
                if(font){
                    fontName = font.name, fontFamily = font.family, fontStyle = font.style
                }else{
                    console.log('Font ' + fontName + ' is not available on your computer and because of that, we cannot get it\'s family and style :(.');
                    fontName = fontFamily = fontStyle = face;
                }

                var check= [];
                fontStyle.match(/bold/i) && (fontWeight = 'bold', check.push('font weight (' + fontWeight + ')'));
                fontStyle.match(/italic/i) && (style = 'italic', check.push('font style (' + style + ')'));
                
                try {
                    color = new Corlor(this.layer.textItem.color.rgb.red, this.layer.textItem.color.rgb.green, this.layer.textItem.color.rgb.blue, 1);
                } catch (ex) {
                    color = new Corlor(0, 0, 0, 1);
                }
                var fontData = {
                    color: {
                        color: color
                    },
                    name: fontName || null,
                    family: fontFamily || null,
                    weight: fontWeight || null,
                    style: style || null,
                    size: size || null,
                    underline: (underline ? (underline == UnderlineType.UNDERLINEOFF ? false : true) : null)
                };
                this.style.solidFill.push({
                    value: fontData.color,
                    name: 'text color'
                });
                this.style.font.push({
                    value: fontData,
                    name: 'font'
                });
                
            } else if('LayerKind.SOLIDFILL' == this.kind && 0.01 < this.fillOpacity){ 
                this.style.solidFill.push({
                    value: this.getAdjustment(),
                    name: 'layer fill content'
                });
            }
            //'layerFxEnabled'
            if (this.readActiveValue('layerFXVisible', undefined, true)) {
                //'solidFillFx';
                var color = null;
                if(this.isLayerEffectEnable('solidFill') ){ 
                    this.checkLayerEffectMode( 'solidFill', 'solid fill');
                    var solidFill = {
                        color: this.getLayerEffectObjectProperty('solidFill.color', 'color')
                    };
                    var opacity = this.getLayerEffectObjectProperty('solidFill.opacity') / 100;
                    solidFill.color.a = opacity;
                    color = solidFill.color;
                    this.style.solidFill.push({
                        value: solidFill,
                        name: 'color overlay'
                    });
                }
                //'gradientFillFx'
                if(this.isLayerEffectEnable('gradientFill') ){ 
                    this.checkLayerEffectMode( 'gradientFill', 'gradient fill');
                    var gradientFill = this.getLayerEffectObjectProperty('gradientFill');
                    var gradientFillData = this.getGradientFillData(gradientFill, false, color);
                    var name = 'gradient overlay';
                    if(color){ 
                        name = this.style.solidFill[this.style.solidFill.length-1].name + ' + ' + name;
                        this.style.solidFill.pop();                        
                    }
                    this.style.gradientFill.push({
                        value: gradientFillData,
                        name: name
                    });
                }
                //'frameFX'
                var strokeData;
                if(this.isLayerEffectEnable('frameFX')){ 
                    this.checkLayerEffectMode( 'frameFX', 'stroke');
                    var color;
                    if('solidColor' == this.getLayerEffectObjectProperty('frameFX.paintType')){
                        color = this.getLayerEffectObjectProperty('frameFX.color', 'color');
                    }else{
                        this.Z.push('stroke');
                        color = GradientStyle.reduce(this.getGradientData(this.getLayerEffectObjectProperty('frameFX')).gradient);
                    }               
                    strokeData = {
                        size: parseFloat(this.getLayerEffectObjectProperty('frameFX.size')),
                        color: color,
                        style: this.getLayerEffectObjectProperty('frameFX.style')
                    };
                    c = this.getLayerEffectObjectProperty('frameFX.opacity') / 100;
                    strokeData.color.c = c;
                    this.style.stroke.push({
                        value: strokeData,
                        name: 'stroke'
                    });
                }
                //'dropShadow'
                if(this.isLayerEffectEnable('dropShadow')){ 
                    this.checkLayerEffectMode( 'dropShadow', 'drop shadow');
                    var dropShadow = this.getLightEffectData('dropShadow', 'drop shadow', true);
                    this.style.dropShadow.push({
                        value: dropShadow,
                        name: 'drop shadow'
                    });
                }
                //'innerShadow'
                if(this.isLayerEffectEnable('innerShadow')){
                    this.style.innerShadow.push({
                        value: this.getInnerShadowData(),
                        name: 'inner shadow'
                    });
                }
                //'innerGlow'
                if(this.isLayerEffectEnable('innerGlow')){
                    if(this.getLayerEffectObjectProperty('innerGlow.color', 'color') || this.getGradientData(this.getLayerEffectObjectProperty('innerGlow'))){
                        this.style.innerGlow.push({
                            value: this.getInnerGlowData(),
                            name: 'inner glow'
                        });
                    }else{ 
                        this.ba.push('inner glow'));
                    }
                }
                //'outerGlow'
                if(this.isLayerEffectEnable('outerGlow')){
                    if(this.getLayerEffectObjectProperty('outerGlow.color', 'color') || this.getGradientData(this.getLayerEffectObjectProperty('outerGlow'))){
                        this.style.outerGlow.push({
                            value: this.getOuterGlowData(),
                            name: 'outer glow'
                        });
                    }else{ 
                        this.ba.push('outer glow');
                    }
                }
    
                if (!this.isText && 'undefined' != typeof strokeData && ('insetFrame' == strokeData.style || 'centeredFrame' == strokeData.style)) {
                    var parseChokeMatte = function(item) {
                        var size = strokeData.size;
                        if (item.value.chokeMatte > 0) {
                            var chokeMatte = item.value.chokeMatte;
                            item.value.chokeMatte = Math.max(item.value.chokeMatte - size, 0);
                            size = size - (chokeMatte - item.value.chokeMatte);
                        }
                        if (size > 0 && item.value.distance > 0) item.value.distance = Math.max(item.value.distance - size, 0);
                        return item;
                    };
                    this.style.innerShadow = this.style.innerShadow.map(parseChokeMatte);
                    this.style.innerGlow = this.style.innerGlow.map(parseChokeMatte);
                }
            }
            //'gradientFill'
            if('LayerKind.GRADIENTFILL' == this.kind && 0.01 < this.fillOpacity ){
                this.style.gradientFill.push({
                    value: this.getAdjustmentData(),
                    name: 'layer fill content'
                });
            }
            //'borderRadius'
            i = this.descriptorData;
            ((c = Gc()) ? i = c : ((i = i.name.match(/(\d+)px/i)) && i[1] ? (i = parseFloat(i[1]), i = {
                source: 'radius from layer name',
                X: new ya(new wa(i), new wa(i), new wa(i), new wa(i)),
                bounds: o
            }) : i = {
                X: o,
                bounds: o
            }));
  i.X && this.style.borderRadius.push({
    value: i.X,
    name: 'border radius'
  });
  Hc && (I.f('bounds'), (i.bounds ? this.style.dimensions.push({
    value: {
      top: i.bounds.w,
      left: i.bounds.v,
      width: i.bounds.z - i.bounds.v,
      height: i.bounds.A - i.bounds.w
    },
    name: 'dimensions'
  }) : this.style.dimensions.push({
    value: Ic(),
    name: 'dimensions'
  })));
  I.f('effectsWeCannotRender');
  i = [];
  this.isLayerEffectEnable('bevelEmboss') && i.push('bevel & emboss');
  this.isLayerEffectEnable('chromeFX') && i.push('satin');
  this.isLayerEffectEnable('patternFill') && i.push('pattern overlay');
  i.length && (I.k('Note: CSS Hat currently cannot render ' + i.m() + ', as it is hard to express in CSS.'), this.la = m);
  this.na.length && (I.k('Blending modes are used in ' + this.na.m() + ', but they are impossible to realistically transfer to CSS.'), this.la = m);
  this.Z.length && (I.k(this.Z.m().ea() + ' ' + ((1 < this.Z.length ? 'have' : 'has')) + ' a gradient fill type, but there is no way to express that in CSS, writing the average color instead.'), this.la = m);
  this.ba.length && (I.k(this.ba.m().ea() + ' ' + ((1 < this.ba.length ? 'have' : 'has')) + ' a noise gradient fill type, but there is no way to express that in CSS.'), this.la = m);
  I.ka();
        },

        
        
        getGradientFillData:function(gradientFill,useLayerFillOpacity,color){
            
        },      
        
        findStopItem:function(arr, localtion, start) {
            if (0 == arr.length) return null;
            for (var i = Math.max(-1, start), len = arr.length - 1; i < len; i++){ 
                if (0 > i) {
                    if (localtion <= arr[0].location){ 
                        return {
                            value: arr[0],
                            index: 0
                        };
                    }
                } else if (arr[i].location <= localtion && localtion <= arr[i + 1].location){ 
                    return {
                        value: arr[i + 1],
                        index: i + 1
                    };
                }
            }
            return null;
        },
        nextStop:function (colorStops, opacityStops, location, colorStart, opacityStart) {
            //'nextStop'
            var color;
            var colorItem = this.findStopItem(colorStops, location, colorStart),
                opacityItem = this.findStopItem(opacityStops, location, opacityStart);
            if (colorItem === null && opacityItem === null) return null;
            if (colorItem === null || opacityItem.value.location < colorItem.value.location){
                 color = GradientStyle.getStopValue(opacityItem.value.location, colorStops, 'color'), color.a *= opacityItem.value.opacity;
                 return {
                    colorStart: colorStart,
                    opacityStart: opacityItem.index,
                    colorStop: new ColorStop(opacityItem.value.location, color)
                };
            }
            if (opacityItem === null || colorItem.value.location < opacityItem.value.location){
                color = Color.clone(colorItem.value.color);
                var opacity = GradientStyle.getStopValue(colorItem.value.location, opacityStops, 'opacity');
                color.a *= opacity;
                return {
                    colorStart: colorItem.index,
                    opacityStart: opacityStart,
                    colorStop: new ColorStop(colorItem.value.location, color)
                };
            }
            if (colorItem.value.location == opacityItem.value.location) {
                color = Color.clone(colorItem.value.color);
                color.a *= opacityItem.value.opacity;
                return {
                    colorStart: colorItem.index,
                    opacityStart: opacityItem.index,
                    colorStop: new ColorStop(colorItem.value.location, color)
            };
            //'nextStop: no path was successful;
            return null;
        },
        getLayerEffectObjectProperty:function(key, type) {
            return this.readActiveValue('layerEffects.' + key, type);
        },
        isLayerEffectEnable:function(effect) {
            var path = 'layerEffects.' + effect + '.enabled',
            return this.readActiveValue(path, undefined, true) && this.readActiveValue('layerEffects.' + effect + '.enabled');
        },
        
        checkLayerEffectMode:function(key,name){
           'normal' != this.readActiveValue(((key ? 'layerEffects.' + key + '.' : '')) + 'mode') && this.na.push(name);
        },
        
        getAdjustmentColor:function() {
            var ret = {
                color: readActiveValue('adjustment[0].color', 'color')
            };
            ret.color.a = this.fillOpacity;
            return ret;
        },
        getAdjustmentData:function () {
          var b = lc().getList(charIDToTypeID('Adjs')).getObjectValue(0);
          return this.getGradientData(b, true);
        },
        getInnerShadowData:function (a) {
          wc(a, 'innerShadow', 'inner shadow');
          return getLightEffectData(a, 'innerShadow', 'inner shadow', m, m);
        },
        getInnerGlowData:function (a) {
          wc(a, 'innerGlow', 'inner glow');
          return getLightEffectData(a, 'innerGlow', 'inner glow', p, m);
        },
        getOuterGlowData:function (a) {
          wc(a, 'outerGlow', 'outer glow');
          return getLightEffectData(a, 'outerGlow', 'outer glow');
        },
        getLightEffectData:function (key, name, d, inset) {
            var chokeMatte = this.getLayerEffectObjectProperty(key + '.chokeMatte') / 100,
                blur = this.getLayerEffectObjectProperty(key + '.blur'),
                ret = {
                    blur: blur * (1 - chokeMatte),
                    chokeMatte: blur * chokeMatte,//g
                    color: this.getLayerEffectObjectProperty(key + '.color', 'color'),
                    inset: !(!inset)//F
                };
            if(ret.color == null) {
                this.Z.push(name);
                var gradientData = this.getGradientData(this.getLayerEffectObjectProperty(key)),
                ret.color = GradientStyle.reduce(gradientData.gradient));
            }
            var opacity = this.getLayerEffectObjectProperty(key + '.opacity') / 100;
            ret.color.a = opacity;
            ret.distance = (d ? this.getLayerEffectObjectProperty(key + '.distance') : 0);
            ret.angle = (d ? (this.getLayerEffectObjectProperty(key + '.useGlobalAngle') ? this.globalAngle : this.getLayerEffectObjectProperty(key + '.localLightingAngle')) : 0);
            return ret;
        },
        
        getGradientData:function (gradientObject, useLayerFillOpacity, color) {
            if (!gradientObject){
                console.log('Gradient object is missing even though gradient fill is enabled.');
                return false;
            }
            //'_readPsGradient'
            //'get gradient'
            var gradientDesc = ActionUtils.getPSObjectPropertyChain(gradientObject, 'gradient', 'object'),
                opacity = (useLayerFillOpacity ? this.fillOpacity : ActionUtils.getPSObjectPropertyChain(gradientObject, 'opacity', 'double') / 100),
                gradientStyle = new GradientStyle();
            try {
                var colors = gradientDesc.getList(stringIDToTypeID('colors'));
            } catch (ex) {
                return false;
            }
            //'get color stops';
            var len, desc, idx = 0;
            for (len = colors.count; idx < len; ++idx) {
                desc = colors.getObjectValue(idx);
                var colorData = ActionUtils.getPSObjectPropertyChain(desc, 'color', 'color');
                var colorStop = new ColorStop(100 * desc.getInteger(stringIDToTypeID('location')) / 4096, colorData);
                gradientStyle.colorStops.push(colorStop);
            }
            //'get opacities';
            var transparency = gradientDesc.getList(stringIDToTypeID('transparency'));
            idx = 0;
            for (len = transparency.count; idx < len; ++idx){
                var transparencyDesc = transparency.getObjectValue(idx);
                var opacityStop = new OpacityStop(
                                    100 * transparencyDesc.getInteger(stringIDToTypeID('location')) / 4096,
                                    ActionUtils.getPSObjectPropertyChain(transparencyDesc, 'opacity', 'double') / 100 * opacity);
                gradientStyle.opacityStops.push(opacityStop);
            } 
            //'overlay with color'
            if (color) {
                idx = 0;
                var averageColor;
                for (len = gradientStyle.colorStops.length; idx < len; idx++) {
                    averageColor = Color.alphaBlend(gradientStyle.colorStops[idx].color, color);
                    gradientStyle.colorStops[idx].color = averageColor;
                }
                idx = 0;
                for (len = gradientStyle.opacityStops.length; idx < len; idx++){
                    opacity = gradientStyle.opacityStops[idx].opacity;
                    opacity += (1 - opacity) * color.a;
                    gradientStyle.opacityStops[idx].opacity = opacity;
                }
            }
            //'position, scale ...'
            var offset = ActionUtils.getPSObjectPropertyChain(gradientObject, 'offset', 'offset', true) || {
                horizontal: 0,
                vertical: 0
            };
            var scale = ActionUtils.getPSObjectPropertyChain(gradientObject, 'scale', l, true) || 100;
            var type = ActionUtils.getPSObjectPropertyChain(gradientObject, 'type') || 'linear';
            var reverse = ActionUtils.getPSObjectPropertyChain(gradientObject, 'reverse', l, true);
            //'gradientObj'
            //'mergeColorAndOpacity'
            //'sort'
            gradientStyle.sort();
            var opacityStops = (0 == gradientStyle.opacityStops.length ? DefaultOpacities : gradientStyle.opacityStops);
            var colorStops = (0 == gradientStyle.colorStops.length ? DefaultColorStops : gradientStyle.colorStops);
            for (var location = opacityStart = colorStart = -1, mergedColors = [], iter;
            (iter = this.nextStop(colorStops, opacityStops, location, colorStart, opacityStart)) !== null;){ 
                colorStart = iter.colorStart;
                opacityStart = iter.opacityStart;
                location = iter.colorStop.location;
                mergedColors.push(iter.colorStop)
            }
   
            var ret = {
                gradient: gradientStyle,
                mergedColors: mergedColors,
                type: type,
                reverse: reverse,
                offset: offset,
                scale: scale
            };
            //'invert'
            if (ret.reverse) {
                var len = ret.mergedColors.length;
                for (var i= 0; i < len; i++){
                    ret.mergedColors[i].location = 100 - ret.mergedColors[i].location;
                }
                ret.mergedColors.sort(function(a, b) {
                    return a.location - b.location;
                });
            }
            switch (type) {
                case 'linear':
                    //'type = linear'
                    ret.angle = ActionUtils.getPSObjectPropertyChain(gradientObject, 'angle');
                    break;
                case 'reflected':
                    //'type = reflected'
                    ret.angle = ActionUtils.getPSObjectPropertyChain(gradientObject, 'angle');
                    var len = ret.mergedColors.length;
                    for (var i = 0; i < len; i++) ret.mergedColors[i].location = 50 + ret.mergedColors[i].location / 2;
                    for (var j = 0; j < len; j++){
                        if(50.0005 < ret.mergedColors[j].location){
                            ret.mergedColors.unshift({
                                color: ret.mergedColors[j].color,
                                location: 100 - ret.mergedColors[j].location
                            });
                        }
                    }
                break;
                case 'radial':
                    //'type = radial'
            }
            //'angle'
            gradientStyle.angle && (gradientStyle.angle = (gradientStyle.angle + 360) % 360);
            
            return ret;
        }
    };
})();