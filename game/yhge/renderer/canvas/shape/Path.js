(function () {

    var Shape = yhge.renderer.canvas.shape.Shape;
    var util = yhge.util;

    var DrawPathType = {
        Default:0,
        Normal:1,
        Script:2
    };
    var Path = yhge.core.Class(Shape, {

        classname:"Path",

        initialize:function () {
            this._drawPathType=DrawPathType.Default;
            //原始记录数据
            this._originalRecords = [];
            //处理之后的，用于直接画图
            this._records = [];
            //默认使用解析路径
            Path._super_.initialize.apply(this, arguments);

        },

        draw:function (context) {
            console.log(this.classname);
        },

        drawPathRecords:function (context) {
            var records = this._records;
            var act, args;
            for (var i = 0, len = records.length; i < len; i++) {
                //context[records[i][0]].apply(context,records[i][1]);
                act = records[i][0];
                args = records[i].slice(1);
                args.push(this);
                PathActions[act].apply(context, args);
            }
        },
        //把描述path的定义转成javascript语句，使用new Function变成一个函数，而不是现在这样，每条做处理。
        drawPathScript:function (context) {
            //必须替换为当前的，可能二个不一至。
            this._pathFuncArgs[0] = context;
            this._pathFunc.apply(this, this._pathFuncArgs);
        },

        setPathScript:function (pathFunc, pathFuncArgs) {
            this.draw = this.drawPathScript;
            this._pathFunc = pathFunc;
            this._pathFuncArgs = pathFuncArgs;
            this._drawPathType=DrawPathType.Script;
        },

        /**
         * records=[[fun,params],[fun,params]];
         */
        setRecords:function (records) {
            this.draw = this.drawPathRecords;
            this._records = records;
            this._drawPathType=DrawPathType.Normal;
            return this;
        },
        getRecords:function () {
            return this._records;
        },
        setOriginalRecords:function (originalRecords) {
            this._originalRecords = originalRecords;
            return this;
        },
        getOriginalRecords:function () {
            return this._originalRecords;
        },
        clone:function () {
            var newObj = Path._super_.clone.apply(this, arguments);
            newObj._records = this._records.slice();
            this._pathFunc && (newObj._pathFunc = this._pathFunc);
            this._pathFuncArgs && (newObj._pathFuncArgs = this._pathFuncArgs.slice());
            newObj._originalRecords = this._originalRecords;
            newObj._drawPathType=this._drawPathType;
            newObj.draw = this.draw;
            return newObj;
        },
        //TODO fillStyles,lineStyles,fillEdges,lineEdges
        setFillStyles:function (fillStyles) {
            this._fillStyles = fillStyles;
            return this;
        },
        getFillStyles:function () {
            return this._fillStyles;
        },
        setLineStyles:function (lineStyles) {
            this._lineStyles = lineStyles;
            return this;
        },
        getLineStyles:function () {
            return this._lineStyles;
        },
        setFillEdges:function (fillEdges) {
            this._fillEdges = fillEdges;
            return this;
        },
        getFillEdges:function () {
            return this._fillEdges;
        },
        setLineEdges:function (lineEdges) {
            this._lineEdges = lineEdges;
            return this;
        },
        getLineEdges:function () {
            return this._lineEdges;
        },
        assemble:function () {

        }



    });
    Path.DrawPathType=DrawPathType;

    yhge.renderer.canvas.shape.Path = Path;


    var contextProto = CanvasRenderingContext2D.prototype;

    var PathActions = {
        moveTo:contextProto.moveTo,
        lineTo:contextProto.lineTo,
        arc:contextProto.arc,
        quadraticCurveTo:contextProto.quadraticCurveTo,
        bezierCurveTo:contextProto.bezierCurveTo,
        fill:contextProto.fill,
        stroke:contextProto.stroke,
        clip:contextProto.clip,

        beginPath:contextProto.beginPath,
        closePath:contextProto.closePath,
        save:contextProto.save,
        restore:contextProto.restore,
        //变换
        translate:contextProto.translate,
        rotate:contextProto.rotate,
        scale:contextProto.scale,
        transform:contextProto.transform,
        setTransform:contextProto.setTransform,
        //可能还有补充

        //自定义
        fillStyle:function (style, path) {
            this.fillStyle = style;
        },
        strokeStyle:function (style, path) {
            this.strokeStyle = style;
        },
        fillStyleColor:function (path) {
            this.fillStyle = path._colorString;
        }
    };

    var PathRecordType = {
        VoidMethod:1,
        ValueMethod:2,
        Attribute:6,
        StyleAttribute:7,
        SelfDefineAttribute:9,
        SelfDefineVoidMethod:10,
        SelfDefineValueMethod:11
    };
    var PathRecordTypeMap = {
        //方法
        // state
        save:PathRecordType.VoidMethod,
        restore:PathRecordType.VoidMethod,
        // rects
        clearRect:PathRecordType.VoidMethod,
        fillRect:PathRecordType.VoidMethod,
        strokeRect:PathRecordType.VoidMethod,
        // shared path API methods
        beginPath:PathRecordType.VoidMethod,
        fill:PathRecordType.VoidMethod,
        stroke:PathRecordType.VoidMethod,
        clip:PathRecordType.VoidMethod,
        closePath:PathRecordType.VoidMethod,
        moveTo:PathRecordType.VoidMethod,
        lineTo:PathRecordType.VoidMethod,
        quadraticCurveTo:PathRecordType.VoidMethod,
        bezierCurveTo:PathRecordType.VoidMethod,
        arcTo:PathRecordType.VoidMethod,
        rect:PathRecordType.VoidMethod,
        arc:PathRecordType.VoidMethod,
        scrollPathIntoView:PathRecordType.VoidMethod,
        // transformations (default transform is the identity matrix)
        scale:PathRecordType.VoidMethod,
        rotate:PathRecordType.VoidMethod,
        translate:PathRecordType.VoidMethod,
        transform:PathRecordType.VoidMethod,
        setTransform:PathRecordType.VoidMethod,
        // text (see also the CanvasText interface)
        fillText:PathRecordType.VoidMethod,
        strokeText:PathRecordType.VoidMethod,
        measureText:PathRecordType.ValueMethod,
        // drawing images
        drawImage:PathRecordType.VoidMethod,
        //style
        createLinearGradient:PathRecordType.ValueMethod,
        createRadialGradient:PathRecordType.ValueMethod,
        createPattern:PathRecordType.ValueMethod,

        //属性
        // compositing
        globalAlpha:PathRecordType.Attribute,
        globalCompositeOperation:PathRecordType.Attribute,
        // shadows
        shadowOffsetX:PathRecordType.Attribute,
        shadowOffsetY:PathRecordType.Attribute,
        shadowBlur:PathRecordType.Attribute,
        shadowColor:PathRecordType.Attribute,
        // line caps/joins
        lineWidth:PathRecordType.Attribute, // (default 1)
        lineCap:PathRecordType.Attribute, // "butt", "round", "square" (default "butt")
        lineJoin:PathRecordType.Attribute, // "round", "bevel", "miter" (default "miter")
        miterLimit:PathRecordType.Attribute, // (default 10)
        // text
        font:PathRecordType.Attribute, // (default 10px sans-serif)
        textAlign:PathRecordType.Attribute, // "start", "end", "left", "right", "center" (default: "start")
        textBaseline:PathRecordType.Attribute, // "top", "hanging", "middle", "alphabetic", "ideographic", "bottom" (default: "alphabetic")
        // colors and styles
        fillStyle:PathRecordType.StyleAttribute,
        strokeStyle:PathRecordType.StyleAttribute,

        //self define
        fillStyleColor:PathRecordType.SelfDefineAttribute
    };
    var PathRecordTypeSelfAttributeMap = {
        fillStyleColor:function (ctx, act, args) {
            return ctx + ".fillStyle=this._colorString";
        }
    };

    /**
     * 处理records中的渐变
     */
    Path.parseShapeRecords = function (records, context, resMap) {
        var record;
        //需要对原始records进行拷贝，下面操作会修改。
        var newRecords = [];
        // context=context||CanvasRenderingContext2D.prototype;
        for (var i = 0, l = records.length; i < l; i++) {
            //原对象记录的拷贝
            record = records[i].slice();
            var style = record[1];
            if (record[0] == "fillStyle" && typeof style == "object" && style.type) {
                record[1] = Path.parseDrawStyle(style, context, resMap);
            }
            newRecords.push(record);
        }
        return newRecords;
    };

    Path.pathRecordsToFunction = function (records, context, resMap, parameterDefine, parameterContent) {
        var ret = Path.pathRecordsToScript(records);
        var styles = ret.styles, newStyles = [];
        var style;
        for (var i = 0, l = styles.length; i < l; i++) {
            style = styles[i];
            newStyles.push(Path.parseDrawStyle(style, context, resMap));
        }

        var funArgs = ret.funArgs;
        var args = [context, newStyles];
        if (parameterDefine) {
            funArgs = funArgs.concat(parameterDefine);
        }
        if (parameterContent) {
            args = args.concat(parameterContent);
        }
        //for debug
        var func = Function.apply(Function, funArgs.concat(ret.funBody));
        func.body = ret.funBody;
        func.args = funArgs;

        return {
//            func:Function.apply(Function, funArgs.concat(ret.funBody)),
            func:func,
            args:args
        };

//        // 利用apply
//        var args=["a","b"];
//        var body="alert(a+b);";
//        var fun=Function.apply(Function,args.concat(body));
//        fun(2,3);
//        // 另外一种利用arguments来定义参数。
//        var args="var a=arguments[0];var b=arguments[1];"
//        var body=" alert(a+b);";
//        var fun=new Function(args+body);
//        fun(2,3);
    };
    /**
     * 记录转成脚本。对于使用到的对像，则通过传参数的方式使用。
     * 对于style可以使全局变量。
     * @param records
     * @return {Object}
     */
    Path.pathRecordsToScript = function (records, config) {
        var signContext = "ctx",
            signStyles = "styles",
            endLine = "\n";
        //TODO select global style or local
        var funArgs = [signContext, signStyles], funBody = "";
        var styles = [];
        var record, act, args;
        for (var i = 0, l = records.length; i < l; i++) {
            record = records[i];
            act = record[0];
            args = record.slice(1);
            switch (PathRecordTypeMap[act]) {
                case PathRecordType.VoidMethod:
                    funBody += signContext + "." + act + "(" + generateFunctionCallParameter(args) + ");" + endLine;
                    break;
                case PathRecordType.Attribute:
                    funBody += signContext + "." + act + "=" + generateAttributeValue(args) + ";" + endLine;
                    break;
                case PathRecordType.StyleAttribute:
                    var style = args[0];
                    if (typeof style == "object" && style.type) {
                        funBody += "ctx." + act + "=" + signStyles + "[" + styles.length + "];" + endLine;
                        styles.push(style);
                    } else {
                        funBody += "ctx." + act + "=" + generateAttributeValue(args) + ";" + endLine;
                    }
                    break;
                case PathRecordType.SelfDefineAttribute:
                    var selfAct = PathRecordTypeSelfAttributeMap[act];
                    switch (typeof  selfAct) {
                        case "string":
                            funBody += signContext + "." + PathRecordTypeSelfAttributeMap[act] + "=" + generateAttributeValue(args) + ";" + endLine;
                            break;
                        case "function":
                            funBody += selfAct(signContext, act, args) + endLine;
                            break;
                    }

                    break;
            }
        }
        return {
            funArgs:funArgs,
            funBody:funBody,
            styles:styles
        };

    };

    Path.applyColorTransform = function (records, colorTransform) {
        var newRecords = [];
        var record, style, color;
        for (var i = 0, l = records.length; i < l; i++) {
            record = records[i].slice();
            style = record[1];
            if (record[0] == "fillStyle" || record[0] == "strokeStyle") {
                if (typeof style == "string") {
                    color = util.color.stringToColor(style);
                    color = colorTransform.applyColor(color);
                    record[1] = util.color.colorToString(color);
                } else {
                    if (style.stops) {
                        var newStyle = {
                            type:style.type
                        };
                        var newStops = [];
                        for (var j in style.stops) {
                            color = util.color.stringToColor(style.stops[j].color);
                            color = colorTransform.applyColor(color);
                            newStops.push({
                                position:style.stops[j].position,
                                color:util.color.colorToString(color)
                            });
                        }
                        newStyle.stops = newStops;
                        record[1] = newStyle;
                    }
                }
            }
            newRecords.push(record);
        }
        return newRecords;
    };

    Path.parseDrawStyle = function (style, context, resMap) {
        var styleObj, points;
        switch (style.type) {
            case "linear":
                points = style.points;
                styleObj = points
                    ? context.createLinearGradient(points[0], points[1], points[2], points[3])
                    : context.createLinearGradient(-16384 / 20, 0, 16384 / 20, 0);
                break;
            case "radial":
                points = style.points;
                styleObj = points
                    ? context.createRadialGradient(points[0], points[1], points[2], points[3], points[4], points[5])
                    : context.createRadialGradient(0, 0, 0, 0, 0, 16384 / 20);
                break;
            case "Pattern":
                //src可能为resId。resMap根据导出规则建立相应的键名。
                var img = resMap[style.src];
                //如果没有图片显示绿网
                styleObj = img ? context.createPattern(img, style.repeat || 'repeat') : "#0F0";
                break;
        }
        if (style.stops) {
            for (var j in style.stops) {
                styleObj.addColorStop(style.stops[j].position, style.stops[j].color);
            }
        }
        return styleObj;
    };

    function generateFunctionCallParameter(args) {
//        var out="";
//        for(var i=0;i<args.length;i++){
//            out+=i==0?"":","+JSON.stringify(args[i]);
//        }
        if (args.length == 0) return "";
        var out = JSON.stringify(args);
        return out.substr(1, out.length - 2);
    }

    function generateAttributeValue(args) {

        if (args.length == 1) return JSON.stringify(args[0]);

        //TODO Gradient pattern;
    }
})();