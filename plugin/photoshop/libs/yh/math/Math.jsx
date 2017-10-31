(function(){
    var math={
        removeDecimalFirstZero:function (n) {
          return n.toString().replace(/^[0]\./g, '.');
        },
        formatDecimaTwoPlace:function (n) {
          return Math.round(100 * n) / 100;
        }
    };
    //yh.math=math;
    yh.core.mixin(yh.math,math);
})();