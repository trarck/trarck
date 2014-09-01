(function () {
    var util = yhge.util;

    var ColorPrototype = function () {
        this.initialize.apply(this, arguments);
    };

    ColorPrototype.prototype = {

        setColor:function (color) {

            if (arguments.length > 1) {
                this._color = {
                    r:arguments[0],
                    g:arguments[1],
                    b:arguments[2],
                    a:arguments[3]
                };
                this._colorString = util.color.colorToString(this._color);
            } else if (color instanceof Array) {
                this._color = {
                    r:color[0],
                    g:color[1],
                    b:color[2],
                    a:color[3]
                };
                this._colorString = util.color.colorToString(this._color);
            } else if (typeof color == "string") {
                this._colorString = color;
                this._color = util.color.stringToColor(color);
            } else {
                this._color = color;
                this._colorString = util.color.colorToString(this._color);
            }
            return this;
        },

        setColorObject:function (colorObject) {
            this._color = colorObject;
            this._colorString = util.color.colorToString(colorObject);
            return this;
        },

        setColor3b:function (r, g,b) {
            this._color = {
                r:r,
                g:g,
                b:b
            };
            this._colorString = util.color.colorToString(this._color);
            return this;
        },

        setColor4b:function (r, g, b, a) {
            this._color = {
                r:r,
                g:g,
                b:b,
                a:a
            };
            this._colorString = util.color.colorToString(this._color);
            return this;
        },

        setColorArray:function (color) {
            this._color = {
                r:color[0],
                g:color[1],
                b:color[2],
                a:color[3]
            };
            this._colorString = util.color.colorToString(this._color);
            return this;
        },

        getColor:function () {
            return this._color;
        },

        setColorString:function (colorString) {
            this._colorString = colorString;
            this._color = util.color.stringToColor(colorString);
            return this;
        },
        getColorString:function () {
            return this._colorString;
        }
    };

    yhge.renderer.ColorPrototype = ColorPrototype;
})();