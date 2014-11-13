Math.PI_2 = 1.57079632679489661923132169163975144     /* pi/2 */

/** @namespace */
var geometry={
    
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
