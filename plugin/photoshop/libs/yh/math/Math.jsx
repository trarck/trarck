(function(){
    yh.math={
        removeDecimalFirstZero:function (n) {
          return n.toString().replace(/^[0]\./g, '.');
        },
        formatDecimaTwoPlace:function (n) {
          return Math.round(100 * n) / 100;
        }
    };
})();