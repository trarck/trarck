var yh;
(function(yh){

    function log(){
        var content=Array.prototype.join.call(arguments," ");
        fl.trace(content);
    }

    var MatrixTransformer=yh.geom.MatrixTransformer;

    var geom=yh.geom||(yh.geom={});

    geom.MatrixInterpolation={
        /**
         * 由于是相临的比较，精度比较大
         * @param matrixA
         * @param matrixB
         * @param matrixC
         * @returns {boolean}
         */
        haveSameInterpolation:function (matrixA, matrixB, matrixC) {

            var aScaleX = MatrixTransformer.getScaleX(matrixA);
            var bScaleX = MatrixTransformer.getScaleX(matrixB);
            var cScaleX = MatrixTransformer.getScaleX(matrixC);

            var delta1 = bScaleX - aScaleX;
            var delta2 = cScaleX - bScaleX;

            if (!this.floatEqual(delta1, delta2)) {
                log("the interpolation scaleX not same", delta1, delta2);
                return false;
            }

            var aScaleY = MatrixTransformer.getScaleY(matrixA);
            var bScaleY = MatrixTransformer.getScaleY(matrixB);
            var cScaleY = MatrixTransformer.getScaleY(matrixC);

            delta1 = bScaleY - aScaleY;
            delta2 = cScaleY - bScaleY;

            if (!this.floatEqual(delta1, delta2)) {
                log("the interpolation scaleY not same", delta1, delta2);
                return false;
            }


            var aSkewX = MatrixTransformer.getSkewXRadians(matrixA);
            var bSkewX = MatrixTransformer.getSkewXRadians(matrixB);
            var cSkewX = MatrixTransformer.getSkewXRadians(matrixC);

            delta1 = bSkewX - aSkewX;
            delta2 = cSkewX - bSkewX;

            if (!this.floatEqual(delta1, delta2)) {
                log("the interpolation skewX not same", delta1, delta2);
                return false;
            }

            var aSkewY = MatrixTransformer.getSkewYRadians(matrixA);
            var bSkewY = MatrixTransformer.getSkewYRadians(matrixB);
            var cSkewY = MatrixTransformer.getSkewYRadians(matrixC);

            delta1 = bSkewY - aSkewY;
            delta2 = cSkewY - bSkewY;

            if (!this.floatEqual(delta1, delta2)) {
                log("the interpolation skewY not same", delta1, delta2);
                return false;
            }


            delta1 = matrixB.tx - matrixA.tx;
            delta2 = matrixC.tx - matrixB.tx;

            if (!this.floatEqual2(delta1, delta2)) {
                log("the interpolation tx not same", delta1, delta2);
                return false;
            }

            delta1 = matrixB.ty - matrixA.ty;
            delta2 = matrixC.ty - matrixB.ty;

            if (!this.floatEqual2(delta1, delta2)) {
                log("the interpolation ty not same", delta1, delta2);
                return false;
            }

            return true;
        },

        floatEqual:function (a, b) {
            return Math.abs(a - b) <= 0.001;
        },

        floatEqual2:function (a, b) {
            return Math.abs(a - b) <= 0.06;
        },

        /**
         * 如果interpolation只计算一次，则可能不精确。
         * 例。每个值相差2，浮动0.05
         *      a         b       c        d
         *      2.05     4       6       7.9
         *         1.95     2       1.9
         *      如果abc,bcd进行比较，bc,cd之前差值为0.1，不连续。如果按ab,cd之间比较，差0.05还是连续的。
         *
         *     2        4       5.95       7.85
         *          2       1.95        1.9
         *     本来是连续的，现在就不连续了。
         * @param matrixA
         * @param matrixB
         * @param interpolation
         * @returns {boolean}
         */
        haveSameInterpolation2:function (matrixA, matrixB, interpolation) {

            var aScaleX = MatrixTransformer.getScaleX(matrixA);
            var bScaleX = MatrixTransformer.getScaleX(matrixB);

            var d = bScaleX - aScaleX;

            if (!this.floatEqual(d, interpolation.scaleX)) {
                log("the interpolation scaleX not same", d, interpolation.scaleX);
                return false;
            }


            var aScaleY = MatrixTransformer.getScaleY(matrixA);
            var bScaleY = MatrixTransformer.getScaleY(matrixB);

            d = bScaleY - aScaleY;

            if (!this.floatEqual(d, interpolation.scaleY)) {
                log("the interpolation scaleY not same", d, interpolation.scaleY);
                return false;
            }


            var aSkewX = MatrixTransformer.getSkewXRadians(matrixA);
            var bSkewX = MatrixTransformer.getSkewXRadians(matrixB);

            d = bSkewX - aSkewX;

            if (!this.floatEqual(d, interpolation.skewX)) {
                log("the interpolation skewX not same", d, interpolation.skewX);
                return false;
            }

            var aSkewY = MatrixTransformer.getSkewYRadians(matrixA);
            var bSkewY = MatrixTransformer.getSkewYRadians(matrixB);

            d = bSkewY - aSkewY;

            if (!this.floatEqual(d, interpolation.skewY)) {
                log("the interpolation skewY not same", d, interpolation.skewY);
                return false;
            }


            d = matrixB.tx - matrixA.tx;

            if (!this.floatEqual2(d, interpolation.tx)) {
                log("the interpolation tx not same", d, interpolation.tx);
                return false;
            }

            d = matrixB.ty - matrixA.ty;

            if (!this.floatEqual2(d, interpolation.ty)) {
                log("the interpolation ty not same", d, interpolation.ty);
                return false;
            }

            return true;
        },

        getInterpolation:function (matrixA, matrixB) {
            var interpolation = {};

            var aScaleX = MatrixTransformer.getScaleX(matrixA);
            var bScaleX = MatrixTransformer.getScaleX(matrixB);

            interpolation.scaleX = bScaleX - aScaleX;


            var aScaleY = MatrixTransformer.getScaleY(matrixA);
            var bScaleY = MatrixTransformer.getScaleY(matrixB);

            interpolation.scaleY = bScaleY - aScaleY;

            var aSkewX = MatrixTransformer.getSkewXRadians(matrixA);
            var bSkewX = MatrixTransformer.getSkewXRadians(matrixB);

            interpolation.skewX = bSkewX - aSkewX;

            var aSkewY = MatrixTransformer.getSkewYRadians(matrixA);
            var bSkewY = MatrixTransformer.getSkewYRadians(matrixB);

            interpolation.skewY = bSkewY - aSkewY;

            interpolation.tx = matrixB.tx - matrixA.tx;

            interpolation.ty = matrixB.ty - matrixA.ty;

            return interpolation;
        }
    };

})(yh || (yh={}));