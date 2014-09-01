(function  () {
    var RE_PAIR = /\{\s*([\d.\-]+)\s*,\s*([\d.\-]+)\s*\}/,
        RE_DOUBLE_PAIR = /\{\s*(\{[\s\d,.\-]+\})\s*,\s*(\{[\s\d,.\-]+\})\s*\}/;

    Math.PI_2 = 1.57079632679489661923132169163975144     /* pi/2 */

    /** @namespace */
    var geometry={
        /**
         * @class
         * A 2D point in space
         *
         * @param {Float} x X value
         * @param {Float} y Y value
         */
        Point: function (x, y) {
            /**
             * X coordinate
             * @type Float
             */
            this.x = x;

            /**
             * Y coordinate
             * @type Float
             */
            this.y = y;
        },

        /**
         * @class
         * A 2D size
         *
         * @param {Float} w Width
         * @param {Float} h Height
         */
        Size: function (w, h) {
            /**
             * Width
             * @type Float
             */
            this.width = w;

            /**
             * Height
             * @type Float
             */
            this.height = h;
        },

        /**
         * @class
         * A rectangle
         *
         * @param {Float} x X value
         * @param {Float} y Y value
         * @param {Float} w Width
         * @param {Float} h Height
         */
        Rect: function (x, y, w, h) {
            /**
             * Coordinate in 2D space
             * @type {geometry.Point}
             */
            this.origin = new geometry.Point(x, y);

            /**
             * Size in 2D space
             * @type {geometry.Size}
             */
            this.size   = new geometry.Size(w, h);
        },

        /**
         * @returns {Float}
         */
        degreesToRadians: function (angle) {
            return angle / 180.0 * Math.PI;
        },

        /**
         * @returns {Float}
         */
        radiansToDegrees: function (angle) {
            return angle * (180.0 / Math.PI);
        },
        /**
         *srcRange是否完全包含descRange
         */
        hitTestRangeContainRange:function(srcRange,descRange) {
            return descRange.left>=srcRange.left && descRange.right<=srcRange.right && descRange.top>=srcRange.top && descRange.bottom<=srcRange.bottom;
        },
        hitTestRangeInRange:function(descRange,srcRange) {
            return descRange.left>=srcRange.left && descRange.right<=srcRange.right && descRange.top>=srcRange.top && descRange.bottom<=srcRange.bottom;
        },
        /**
         *range是否包含point
         */
        hitTestRangeContainPoint:function(range,x,y) {
            return x>=range.left && x<=range.right && y>=range.top && y<=range.bottom;
        },
        hitTestPointInRange:function(x,y,range) {
            return x>=range.left && x<=range.right && y>=range.top && y<=range.bottom;
        },
        /**
         *srcRange是否和descRange相交
         */
        hitTestRangeCrossRange:function(srcRange,descRange) {
            //TODO
            //return descRange.left<=srcRange.left && descRange.right>srcRange.left && descRange.top<=srcRange.top && descRange.bottom>srcRange.top;
        },
        /**
         * 如果inner不在outer内或相交，则返回false。
         * 再内部返回inner，相交则截取inner。
         */
        cutRange:function (outer,inner) {
            if(inner.left<outer.right && inner.right>outer.left && inner.top<outer.bottom && inner.bottom>outer.top){
                inner.left=inner.left<outer.left?outer.left:inner.left;
                inner.right=inner.right>outer.right?outer.right:inner.right;
                inner.top=inner.top<outer.top?outer.top:inner.top;
                inner.bottom=inner.bottom>outer.bottom?outer.bottom:inner.bottom;
                return inner;
            }else{
                return false;
            }
        }
    };
    
    yhge.math.geometry=yhge.geo = geometry;
})();
