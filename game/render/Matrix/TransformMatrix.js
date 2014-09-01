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
    pointApply:function(x,y){
        return (x:this.a * x + this.c * y + this.tx,y:this.b * x + this.d * y + this.ty);
    },
//    doTranslate: function (tx, ty) {
//        this.tx+=tx;
//        this.ty+=ty;
//        return this;
//    },
//    doRotate: function ( angle) {
//        var sin = Math.sin(angle),
//            cos = Math.cos(angle);
//        var a=this.a,b=this.b,c=this.c,d=this.d,tx=this.tx,ty=this.ty;
//        this.a=a * cos - b * sin;
//        this.b=a * sin + b * cos;
//        this.c=c * cos - d * sin;
//        this.d=c * sin - d * cos;
//        this.tx=tx * cos-ty * sin;
//        this.ty=tx * sin+ty * cos;
//        return this;
//    },
//    doScale:function (sx, sy) {
//        if (sy === undefined) {
//            sy = sx;
//        }
//        this.a*=sx;
//        this.b*=sy;
//        this.c*=sx;
//        this.d*=sy;
//        this.tx*=sx;
//        this.ty*=sy;
//        return this;
//    },
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
TransformMatrix.getIdentity: function () {
    return new TransformMatrix(1, 0, 0, 1, 0, 0);
},