(function(){
    if(typeof(yh)=="undefined"){
            yh={};
    }
    //yh=yh||{};
    yh.checkType=function(a,b){
        if( typeof a != b )
			throw Error('Expected ' + b + ', got ' + typeof a);
        return a;
    };
})();