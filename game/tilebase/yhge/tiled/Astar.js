/**
 *适合tile base的A星算法
 */
yhge.tiled.AStar=yhge.core.extend(yhge.isometric.AStar,{

    initialize: function  () {
        yhge.tiled.AStar._super_.initialize.apply(this,arguments);
    },

    /**
     * 判断斜对角二边是否为障碍物
     * @param {Object} x
     * @param {Object} y
     * @param {Object} stepX
     * @param {Object} stepY
     */
    isBarrierOfCrossSide: function(x,y,stepX,stepY) {
        return stepX != 0 && stepY != 0 && (this.barriers[y - stepY] && this.barriers[y - stepY][x] != null && this.barriers[y - stepY][x].barrier || this.barriers[y] && this.barriers[y][x - stepX] != null && this.barriers[y][x - stepX].barrier);
    },

    /**
     * 判断是不是障碍点
     * @param {Object} x
     * @param {Object} y
     * @param {Object} stepX
     * @param {Object} stepY
     */
    isBarrier: function(x, y, stepX, stepY) {
        var ret = this.barriers[y]!=null && this.barriers[y][x] != null && this.barriers[y][x].barrier;
        //对斜角旁边的点进行判断
        ret=ret||this.isBarrierOfCrossSide(x,y,stepX,stepY);
        return ret;
    },
    testBarrier:function(x,y){
        return this.barriers[y]!=null && this.barriers[y][x] != null && this.barriers[y][x].barrier;
    }
});