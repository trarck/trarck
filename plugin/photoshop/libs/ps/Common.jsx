(function(){
    yh=yh||{};
    yh.checkType=function(a,b){
        typeof a != b && throw Error('Expected ' + b + ', got ' + typeof a);
        return a;
    };
})();