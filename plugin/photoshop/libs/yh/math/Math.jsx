(function(){
    var math={
        removeDecimalFirstZero:function (n) {
          return n.toString().replace(/^[0]\./g, '.');
        },
        formatDecimaTwoPlace:function (n) {
          return Math.round(100 * n) / 100;
        },
        round:function (n) {
            return (0.5 < Math.abs(n) ? Math.round(n): 0);
        },
        equal:function (a, b) {
            return 0.0005 > Math.abs(a - b);
        },
        mid:function (a) {
            return 0 * (1 - (a - -50) / 100) + 100 * ((a - -50) / 100);
        }
    };
    //yh.math=math;
    yh.core.mixin(yh.math,math);
})();