    var Matrix3=function (){
        this.initialize.apply(this,arguments);
    };
    Matrix3.prototype={
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
        this.a11 = a1;
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
    doTranslate: function (tx, ty) {
        this.tx+=tx;
        this.ty+=ty;
        return this;
    },
    doRotate: function ( angle) {
        var sin = Math.sin(angle),
            cos = Math.cos(angle);
        var a=this.a,b=this.b,c=this.c,d=this.d,tx=this.tx,ty=this.ty;
        this.a=a * cos - b * sin;
        this.b=a * sin + b * cos;
        this.c=c * cos - d * sin;
        this.d=c * sin - d * cos;
        this.tx=tx * cos-ty * sin;
        this.ty=tx * sin+ty * cos;
        return this;
    },
    doScale:function (sx, sy) {
        if (sy === undefined) {
            sy = sx;
        }
        this.a*=sx;
        this.b*=sy;
        this.c*=sx;
        this.d*=sy;
        this.tx*=sx;
        this.ty*=sy;
        return this;
    },
    clone:function(){
        return new TransformMatrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
    }
};
Matrix3.getIdentity: function () {
    return new Matrix3(1, 0, 0, 1, 0, 0);
},