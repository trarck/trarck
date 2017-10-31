//require defines/Terminology
//require Log

var ActionUtils;
(function(){
    ActionUtils={};
    
    var ReferenceTypeHandle = {
        'ReferenceFormType.CLASSTYPE': function(reference) {
            return reference.getDesiredClass();
        },
        'ReferenceFormType.ENUMERATED': function(reference) {
            return {
                '@type': 'ReferenceFormType.ENUMERATED',
                value: reference.getEnumeratedValue()
            };
        },
        'ReferenceFormType.IDENTIFIER': function(reference) {
            reference.getDesiredClass();
            reference.getIdentifier();
            return {
                '@type': 'ReferenceFormType.IDENTIFIER'
            };
        },
        'ReferenceFormType.INDEX': function(reference) {
            reference.getDesiredClass();
            return reference.getIndex();
        },
        'ReferenceFormType.NAME': function(reference) {
            reference.getDesiredClass();
            return reference.getName();
        },
        'ReferenceFormType.OFFSET': function(reference) {
            reference.getDesiredClass();
            return reference.getOffset();
        },
        'ReferenceFormType.PROPERTY': function(reference) {
            reference.getDesiredClass();
            return reference.getProperty();
        }
    };
    
    var DescriptorTypeHandle=ActionUtils.DescriptorTypeHandle={
        ActionDescriptor: function(descriptor) {
            var ret = {
                '@type': 'ActionDescriptor'
            }
            for (var i = 0; i < descriptor.count; i++) {
                var key = descriptor.getKey(i),
                keyType = descriptor.getType(key);
                ret[app.typeIDToStringID(key)] = DescriptorTypeHandle[keyType](descriptor, key);
            }
            return ret;
        },
        'DescValueType.ALIASTYPE': function() {
            return {
                '@type': 'DescValueType.ALIASTYPE'
            };
        },
        'DescValueType.BOOLEANTYPE': function(descriptor, key) {
            return descriptor.getBoolean(key);
        },
        'DescValueType.CLASSTYPE': function(descriptor, key) {
            return descriptor.getClass(key);
        },
        'DescValueType.DOUBLETYPE': function(descriptor, key) {
            return descriptor.getDouble(key);
        },
        'DescValueType.ENUMERATEDTYPE': function(descriptor, key) {
            descriptor.getEnumerationType(key);
            var value = descriptor.getEnumerationValue(key);
            return typeIDToStringID(value);
        },
        'DescValueType.INTEGERTYPE': function(descriptor, key) {
            return descriptor.getInteger(key);
        },
        'DescValueType.LISTTYPE': function(descriptor, key) {
            return DescriptorTypeHandle.ActionList(descriptor, key);
        },
        'DescValueType.OBJECTTYPE': function(descriptor, key) {
            descriptor.getObjectType(key);
            var value = descriptor.getObjectValue(key);
            return DescriptorTypeHandle.ActionDescriptor(value, key);
        },
        'DescValueType.RAWTYPE': function(descriptor, key) {
            try {
                return descriptor.getData(key);
            } catch (e) {}
        },
        'DescValueType.REFERENCETYPE': function(descriptor, key) {
            DescriptorTypeHandle.ActionReference(descriptor, key);
        },
        'DescValueType.STRINGTYPE': function(descriptor, key) {
            return descriptor.getString(key);
        },
        'DescValueType.UNITDOUBLE': function(descriptor, key) {
            var type = descriptor.getUnitDoubleType(key),
                value = descriptor.getUnitDoubleValue(key);
            return {
                '@type': app.typeIDToStringID(type),
                value: value
            };
        },
        ActionList: function(descriptor, key) {
            var actionList = descriptor.getList(key),
                ret = [];
            ret['@type'] = 'ActionList';
            for (var i = 0; i < actionList.count; i++) {
                var type = actionList.getType(i);
                ret.push(DescriptorTypeHandle[type.toString()](actionList, i));
            }
            return ret;
        },
        ActionReference: function(descriptor, key) {
            var ref = descriptor.getReference(key)
            // for(var  i = 0, iter = ref;;) {
                // try {
                    // iter = iter.getContainer();
                // } catch (e) {
                    // break;
                // }
                // i++;
            // }
            var ret = [];
            ret['@type'] = 'ActionReference';
            do {
                var desiredClass=formType=undefined;
                try {
                    formType = ref.getForm(), desiredClass = ref.getDesiredClass();
                } catch (ex) {}
                if (!formType || !desiredClass) break;
                ret.push(ReferenceTypeHandle[formType.toString()](ref, desiredClass));
                try {
                    ref = ref.getContainer();
                } catch (ex) {
                    ref = null;
                }
            } while (ref);
            return ret;
        }
    };    
    
    /**
     * get active layer ActionDescriptor
     */
    ActionUtils.getActiveLayerDescriptor=function () {
        var ref = new ActionReference();
        ref.putEnumerated(classLayer, typeOrdinal, enumTarget);
        return app.executeActionGet(ref);
    };
    
    ActionUtils.getDescriptorData=function(descriptor){
        return DescriptorTypeHandle.ActionDescriptor(descriptor);
    };
    
    /**
     * get value from ActionDescriptor
     */
    ActionUtils.getPSObjectProperty=function (psObject, keyOrIndex, type) {
        try {
            switch (type) {
                case 'text':
                  var data = {
                    text: psObject.getObjectValue(keyOrIndex).getString(app.stringIDToTypeID('text'))
                  };
                  return data;
                case 'rectangle':
                  var rectangleDesc = psObject.getObjectValue(keyOrIndex);
                  return {
                    top: rectangleDesc.getUnitDoubleValue(app.stringIDToTypeID('top')),
                    bottom: rectangleDesc.getUnitDoubleValue(app.stringIDToTypeID('bottom')),
                    left: rectangleDesc.getUnitDoubleValue(app.stringIDToTypeID('left')),
                    right: rectangleDesc.getUnitDoubleValue(app.stringIDToTypeID('right'))
                  };
                case 'offset':
                  var offsetDesc = psObject.getObjectValue(keyOrIndex);
                  return {
                    horizontal: offsetDesc.getUnitDoubleValue(app.stringIDToTypeID('horizontal')),
                    vertical: offsetDesc.getUnitDoubleValue(app.stringIDToTypeID('vertical'))
                  };
                case 'color':
                  var colorDesc = psObject.getObjectValue(keyOrIndex),
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
                    text: psObject.getObjectValue(keyOrIndex).getString(app.stringIDToTypeID('text'))
                  };
                case 'object':
                  return psObject.getObjectValue(keyOrIndex);
                default:
                    switch (psObject.getType(keyOrIndex)) {
                      case DescValueType.LISTTYPE:
                        return psObject.getList(keyOrIndex);
                      case DescValueType.UNITDOUBLE:
                        return psObject.getUnitDoubleValue(keyOrIndex);
                      case DescValueType.DOUBLETYPE:
                        return psObject.getDouble(keyOrIndex);
                      case DescValueType.STRINGTYPE:
                        return psObject.getString(keyOrIndex);
                      case DescValueType.BOOLEANTYPE:
                        return psObject.getBoolean(keyOrIndex);
                      case DescValueType.ENUMERATEDTYPE:
                        return app.typeIDToStringID(psObject.getEnumerationValue(keyOrIndex));
                      case DescValueType.INTEGERTYPE:
                        return psObject.getInteger(keyOrIndex);
                      case DescValueType.CLASSTYPE:
                        return psObject.getClass(keyOrIndex);
                      case DescValueType.RAWTYPE:
                        return psObject.getData(keyOrIndex);
                      case DescValueType.REFERENCETYPE:
                        return psObject.getData(keyOrIndex);
                      default:
                        return psObject.getObjectValue(keyOrIndex);
                    }
            }
        } catch (e) {
            throw 'Failed reading: ' + typeIDToStringID(keyOrIndex);
        }
    };
    
    /**
     * get value from ActionDescriptor use key path;
     */
    ActionUtils.getPSObjectPropertyChain=function (psObject, path, type, defaultValue) {
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
              actionList = psObject.getList(app.stringIDToTypeID(itemKey));
            } catch (e) {
              throw 'Failed reading: ' + itemKey+' exception:'+e;
            }
            psObject = ActionUtils.getPSObjectProperty(actionList, idx, subType);
          } else {
            opt.push('- reading ' + key + '(' + subType + ')');
            try {
              psObject = ActionUtils.getPSObjectProperty(psObject, app.stringIDToTypeID(key), subType);
            } catch (ex) {
              psObject = null;
              //console.log(ex);
              break;
            }
          }
        }
        return psObject;
      } catch (e) {
        return defaultValue || console.log('Error in _getPsObjectPropertyChain:  path: ' + path + ', type: ' + type + ', exception: ' + e + '\n   ' + opt.join('\n   ')), false;
      }
    };       
    
   
})();