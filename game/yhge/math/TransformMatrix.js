(function  () {
    //坐标原点在左下角

	/* 
	列向量。游戏一般使用列向量。列向量是右乘。
	[	a	c	tx	]
	[	b	d	ty	]
	[	0	0	1	]
	
	行向量。行向量使用左乘。不太常用。
	[	a	b	0	]
	[	c	d	0	]
	[	tx	ty	1	]
	*/
	
    //使用a,b,c,d,tx,ty,行、列向量都适用。
    var TransformMatrix=function (){
        this.initialize.apply(this,arguments);
    };
	
    TransformMatrix.prototype={
        /**
         * @class
         * Transform matrix
         *
         * @param {Float} a
         * @param {Float} b
         * @param {Float} c
         * @param {Float} d
         * @param {Float} tx
         * @param {Float} ty
         */
        initialize: function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        },
        /**
         * Translate (move) a transform matrix
         *
         * @param {Float} tx Amount to translate along X axis
         * @param {Float} ty Amount to translate along Y axis
         * @returns {geometry.TransformMatrix} A new TransformMatrix
         */
        setTranslate: function (tx, ty) {
            var newtx = this.tx + this.a * tx + this.c * ty;
            var newty = this.ty + this.b * tx + this.d * ty;
            this.tx=newtx;
            this.ty=newty;
            return this;
        },
        /**
         * Rotate a transform matrix
         *
         * @param {Float} angle Angle in radians
         * @returns {geometry.TransformMatrix} A new TransformMatrix
         */
        setRotate: function ( angle) {
            var sin = Math.sin(angle),
                cos = Math.cos(angle);
            var a=this.a,b=this.b,c=this.c,d=this.d;
            this.a=a * cos + c * sin;
            this.b=b * cos + d * sin;
            this.c=c * cos - a * sin;
            this.d=d * cos - b * sin;
            return this;
        },

        /**
         * Scale a transform matrix
         *
         * @param {Float} sx X scale factor
         * @param {Float} [sy=sx] Y scale factor
         * @returns {geometry.TransformMatrix} A new TransformMatrix
         */
        setScale: function (sx, sy) {
            if (sy === undefined) {
                sy = sx;
            }
            this.a*=sx;
            this.b*=sx;
            this.c*=sy;
            this.d*=sy;
            return this;
        },

		/**
		 * Skew a transform matrix
		 *
		 * @param {Float} skewX X skew factor in radians
		 * @param {Float} [skewY=skewX] Y skew factor in radians
		 * @returns {geometry.TransformMatrix} A new TransformMatrix
		 */
		setSkew: function (skewX, skewY) {
			if (skewY === undefined) {
				skewY = skewX;
			}
			var tanX=Math.tan(skewX),
				tanY=Math.tan(skewY);
			var a=this.a,b=this.b,c=this.c,d=this.d;
			this.a=a+c*tanY;
			this.b=b+d*tanY;
			this.c=c+a*tanX;
			this.d=d+b*tanX;
			return this;
		},
		
		setSkewX: function (skew) {
			var tan=Math.tan(skew);
			var a=this.a,b=this.b,c=this.c,d=this.d;
			this.c=c+a*tan;
			this.d=d+b*tan;
			return this;
		},
		
		setSkewY: function (skew) {
			var tan=Math.tan(skew);
			var a=this.a,b=this.b,c=this.c,d=this.d;
			this.a=a+c*tan;
			this.b=b+d*tan;
			return this;
		},

        pointApply:function(x,y){
            return {x:this.a * x + this.c * y + this.tx,y:this.b * x + this.d * y + this.ty};
        },
        rectApply:function (x,y,width,height) {
            var left=x,
                right=x+width,
                top=y,
                bottom=y+height,
                tl=this.pointApply(left,top),
                tr=this.pointApply(right,top),
                bl=this.pointApply(left,bottom),
                br=this.pointApply(right,bottom);
            left=Math.min(tl.x,tr.x,bl.x,br.x);
            right=Math.max(tl.x,tr.x,bl.x,br.x);
            top=Math.min(tl.y,tr.y,bl.y,br.y);
            bottom=Math.max(tl.y,tr.y,bl.y,br.y);
            return {x:left,y:top,width:right-left,height:bottom-top};
        },
        boundingApply:function (left,right,top,bottom) {
            var tl=this.pointApply(left,top),
                tr=this.pointApply(right,top),
                bl=this.pointApply(left,bottom),
                br=this.pointApply(right,bottom);
            left=Math.min(tl.x,tr.x,bl.x,br.x);
            right=Math.max(tl.x,tr.x,bl.x,br.x);
            top=Math.min(tl.y,tr.y,bl.y,br.y);
            bottom=Math.max(tl.y,tr.y,bl.y,br.y);
            return {left:left,right:right,top:top,bottom:bottom};
        },
        clone:function(){
            return new TransformMatrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
        },
        /**
         * Inverts a transform matrix
         *
         * @returns {geometry.TransformMatrix} New transform matrix
         */
        invert: function () {
            var determinant = 1 / (this.a * this.d - this.b * this.c);

            return new TransformMatrix(
                determinant * this.d,
                -determinant * this.b,
                -determinant * this.c,
                determinant * this.a,
                determinant * (this.c * this.ty - this.d * this.tx),
                determinant * (this.b * this.tx - this.a * this.ty)
            );
        },

        /**
         * Multiply 2 transform matrices together
         * @param {geometry.TransformMatrix} rhs Right matrix
         * @returns {geometry.TransformMatrix} New transform matrix
         */
        concat: function (rhs) {
            return new TransformMatrix(
                this.a * rhs.a + this.b * rhs.c,
                this.a * rhs.b + this.b * rhs.d,
                this.c * rhs.a + this.d * rhs.c,
                this.c * rhs.b + this.d * rhs.d,
                this.tx * rhs.a + this.ty * rhs.c + rhs.tx,
                this.tx * rhs.b + this.ty * rhs.d + rhs.ty
            );
        }
    };
    TransformMatrix.getIdentity= function () {
        return new TransformMatrix(1, 0, 0, 1, 0, 0);
    };

	TransformMatrix.create= function (matrix) {
		if(matrix instanceof Array){
			return new TransformMatrix(matrix[0], matrix[1],matrix[2], matrix[3], matrix[4], matrix[5]);
		}else if(typeof matrix =="number"){
			return new TransformMatrix(arguments[0], arguments[1],arguments[2], arguments[3], arguments[4], arguments[5]);
		}else if(typeof matrix=="object"){
			return new TransformMatrix(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx,matrix.ty);
		}
        return new TransformMatrix(1, 0, 0, 1, 0, 0);
    };
    TransformMatrix.equal= function (matrixa,matrixb) {
        return matrixa.a==matrixb.a && matrixa.b==matrixb.b && matrixa.c==matrixb.c
            && matrixa.d==matrixb.d && matrixa.tx==matrixb.tx && matrixa.ty==matrixb.ty;
    };
    yhge.math.TransformMatrix=TransformMatrix;
})();