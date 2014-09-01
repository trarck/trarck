(function  () {
    //坐标原点在左下角

    //使用a,b,c,d,tx,ty,行、列向量都适用。
    var ColorTransform=function (){
        this.initialize.apply(this,arguments);
    };
    ColorTransform.prototype={

        initialize: function (redMultiplier, greenMultiplier,blueMultiplier, alphaMultiplier, redOffset, greenOffset,blueOffset,alphaOffset) {
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaMultiplier = alphaMultiplier;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset=blueOffset;
            this.alphaOffset=alphaOffset;
        },

        getCcolor:function(){
            return this.redOffset << 16 | this.greenOffset << 8 || this.blueOffset;
        },

        /**
         * @private
         */
        setColor:function(value){
            this.redOffset = value >> 16 & 0xF;
            this.greenOffset = value >> 8 & 0xF;
            this.blueOffset = value & 0xF;
            this.redMultiplier = this.greenMultiplier =this.blueMultiplier = 01;
        },
        /**
         * Multiply 2 transform matrices together
         * @param {geometry.TransformMatrix} rhs Right matrix
         * @returns {geometry.TransformMatrix} New transform matrix
         */
        concat: function (rhs) {
            this.redMultiplier *= rhs.redMultiplier;
            this.greenMultiplier *= rhs.greenMultiplier;
            this.blueMultiplier *= rhs.blueMultiplier;
            this.alphaMultiplier *= rhs.alphaMultiplier;
            this.redOffset += rhs.redOffset;
            this.greenOffset += rhs.greenOffset;
            this.blueOffset += rhs.blueOffset;
            this.alphaOffset += rhs.alphaOffset;
        },
        applyColor:function(color){
            if(color instanceof Array){
                return this.applyColorObject({
                    r:color[0],
                    g:color[1],
                    b:color[2],
                    a:color[3]
                });
            }else if(typeof color =="number"){
                return this.applyColorObject({
                    r:arguments[0],
                    g:arguments[1],
                    b:arguments[2],
                    a:arguments[3]
                });
            }else if(typeof color=="object"){
                return this.applyColorObject(color);
            }
        },

        applyColorObject:function(color){
            var newColor={};
            newColor.r=Math.max(0, Math.min(color.r * this.redMultiplier  + this.redOffset, 255));
            newColor.g=Math.max(0, Math.min(color.g * this.greenMultiplier  + this.greenOffset, 255));
            newColor.b=Math.max(0, Math.min(color.b * this.blueMultiplier  + this.blueOffset, 255));

            newColor.r=parseInt(newColor.r);
            newColor.g=parseInt(newColor.g);
            newColor.b=parseInt(newColor.b);

            if(color.a!=null){
                newColor.a=Math.max(0, Math.min(color.a * this.alphaMultiplier  + this.alphaOffset, 1));
            }
            return newColor;
        },

        clone:function(){
            return new ColorTransform(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier,
                this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset);
        },
        toString:function(){
            return "[ColorTransform(" + [this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier,
                this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset].join(", ") + ")]";
        }
    };
    ColorTransform.getIdentity= function () {
        return new ColorTransform(1, 1, 1, 1, 0, 0,0,0);
    };

    ColorTransform.create= function (matrix) {
		if(matrix instanceof Array){
			return new ColorTransform(matrix[0], matrix[1],matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7]);
		}else if(typeof matrix =="number"){
			return new ColorTransform(arguments[0], arguments[1],arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
		}else if(typeof matrix=="object"){
			return new ColorTransform(
                matrix.redMultiplier, matrix.greenMultiplier,matrix.blueMultiplier, matrix.alphaMultiplier,
                matrix.redOffset, matrix.greenOffset,matrix.blueOffset,matrix.alphaOffset);
		}
        return new ColorTransform(1, 1, 1, 1, 0, 0,0,0);
    };

    ColorTransform.isOnlyAlpha=function(colorTransform){
        return colorTransform.redMultiplier==1 && colorTransform.greenMultiplier==1&&colorTransform.blueMultiplier==1
            && colorTransform.redOffset==0 && colorTransform.greenOffset==0 && colorTransform.blueOffset==0;
    };
    yhge.math.ColorTransform=ColorTransform;
})();