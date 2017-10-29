//require defines/Terminology
var LayerStyle;
(function(){
    LayerStyle=function(){
        
    };
    

    
    LayerStyle.prototype={
        getActiveLayerDescriptor:function () {
            var ref = new ActionReference();
            ref.putEnumerated(classLayer, typeOrdinal, enumTarget);
            return app.executeActionGet(ref);
        },
        getValueFromDescriptor:function (descriptor, keyOrIndex, type) {
          try {
            switch (type) {
            case 'text':
              var data = {
                text: descriptor.getObjectValue(keyOrIndex).getString(app.stringIDToTypeID('text'))
              };
              return data;
            case 'rectangle':
              var rectangleDesc = descriptor.getObjectValue(keyOrIndex);
              return {
                top: rectangleDesc.getUnitDoubleValue(app.stringIDToTypeID('top')),
                bottom: rectangleDesc.getUnitDoubleValue(app.stringIDToTypeID('bottom')),
                left: rectangleDesc.getUnitDoubleValue(app.stringIDToTypeID('left')),
                right: rectangleDesc.getUnitDoubleValue(app.stringIDToTypeID('right'))
              };
            case 'offset':
              var offsetDesc = descriptor.getObjectValue(keyOrIndex);
              return {
                horizontal: offsetDesc.getUnitDoubleValue(app.stringIDToTypeID('horizontal')),
                vertical: offsetDesc.getUnitDoubleValue(app.stringIDToTypeID('vertical'))
              };
            case 'color':
              var colorDesc = descriptor.getObjectValue(keyOrIndex),
                  color;
              switch (app.activeDocument.mode) {
                  case DocumentMode.GRAYSCALE:
                    var gray = colorDesc.getDouble(enumGray);
                    color = new Color(gray, gray, gray, 1);
                    break;
                  case DocumentMode.RGB:
                    var r = colorDesc.getDouble(enumRed),
                        g = colorDesc.getDouble(enumGreen),
                        b = colorDesc.getDouble(enumBlue);
                    color = new Color(r, g, b, 1);
                    break;
                  case DocumentMode.CMYK:
                    var c = colorDesc.getDouble(app.charIDToTypeID('Cyn ')),
                        m = colorDesc.getDouble(app.charIDToTypeID('Mgnt')),
                        y = colorDesc.getDouble(app.charIDToTypeID('Ylw ')),
                        k = colorDesc.getDouble(app.charIDToTypeID('Blck')),
                        c = Math.min(255, c + k),
                        m = Math.min(255, m + k),
                        y = Math.min(255, y + k);
                    color = new Color(255 - c, 255 - m, 255 - y, 1);
                    break;
                  case DocumentMode.LAB:
                    colorDesc.getDouble(app.charIDToTypeID('Lmnc'));
                    colorDesc.getDouble(app.charIDToTypeID('A   '));
                    colorDesc.getDouble(app.charIDToTypeID('B   '));
                    console.log('LAB color is not supported yet.');
                    color = new Color(1, 0, 1, 1);
                    break;
                  default:
                    console.log('Unknown color mode: ' + app.activeDocument.mode);
              }
              return color;
            case 'textLayer':
              return {
                text: descriptor.getObjectValue(keyOrIndex).getString(app.stringIDToTypeID('text'))
              };
            case 'object':
              return descriptor.getObjectValue(keyOrIndex);
            default:
              switch (descriptor.getType(keyOrIndex)) {
                  case DescValueType.LISTTYPE:
                    return descriptor.getList(keyOrIndex);
                  case DescValueType.UNITDOUBLE:
                    return descriptor.getUnitDoubleValue(keyOrIndex);
                  case DescValueType.DOUBLETYPE:
                    return descriptor.getDouble(keyOrIndex);
                  case DescValueType.STRINGTYPE:
                    return descriptor.getString(keyOrIndex);
                  case DescValueType.BOOLEANTYPE:
                    return descriptor.getBoolean(keyOrIndex);
                  case DescValueType.ENUMERATEDTYPE:
                    return Yb(descriptor.getEnumerationValue(keyOrIndex));
                  case DescValueType.INTEGERTYPE:
                    return descriptor.getInteger(keyOrIndex);
                  case DescValueType.CLASSTYPE:
                    return descriptor.getClass(keyOrIndex);
                  case DescValueType.RAWTYPE:
                    return descriptor.getData(keyOrIndex);
                  case DescValueType.REFERENCETYPE:
                    return descriptor.getData(keyOrIndex);
                  default:
                    return descriptor.getObjectValue(keyOrIndex);
              }
            }
          } catch (e) {
            throw 'Failed reading: ' + typeIDToStringID(keyOrIndex);
          }
        },
        
        getValue:function (descriptor, path, type, notShowErrorLog) {
          var opt = [];
          try {
            opt.push('_get: ' + path + '(' + type + ')');
            for (var keys = path.split('.'), index = 0, len = keys.length; index < len; ++index) {
              var key = keys[index],
                  subType = (index == keys.length - 1 ? type : 'object'),
                  m;
              if (m = key.match(/([^\[]+)\[([0-9+])\]/)) {
                var itemKey = m[1],
                    idx = parseInt(m[2], 10);
                opt.push('- reading ' + itemKey + '[' + idx + '](' + subType + ')');
                var actionList;
                try {
                  actionList = descriptor.getList(app.stringIDToTypeID(itemKey));
                } catch (e) {
                  throw 'Failed reading: ' + itemKey+' exception:'+e;
                }
                descriptor = getValueFromDescriptor(actionList, idx, subType);
              } else {
                opt.push('- reading ' + key + '(' + subType + ')');
                try {
                  descriptor = getValueFromDescriptor(descriptor, app.stringIDToTypeID(key), subType);
                } catch (s) {
                  descriptor = null;
                }
              }
            }
            return descriptor;
          } catch (e) {
            return notShowErrorLog || console.log('Error in _getPsObjectPropertyChain:  path: ' + path + ', type: ' + type + ', exception: ' + e + '\n   ' + opt.join('\n   ')), false;
          }
        }        
    }
})();