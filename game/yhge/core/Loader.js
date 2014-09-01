(function  () {
    var load=function  (url,callback,scriptCharset) {
        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        var script = document.createElement("script");

        script.async = "async";
        if ( scriptCharset ) {
            script.charset = s.scriptCharset;
        }
        script.src = url;

        // Handle Script loading
        var done = false;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if ( !done && (!this.readyState ||
                    this.readyState === "loaded" || this.readyState === "complete") ) {
                done = true;
                
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if ( head && script.parentNode ) {
                    head.removeChild( script );
                }
                script = undefined;
                callback && callback();
            }
        };

        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (#2709 and #4378).
        head.insertBefore( script, head.firstChild );
    };
    var models={};
    //model path /dd/aa/cc ../dd/tt/ee
    var requrie=function  (model) {
        //if(model.indexOf(".")>-1) model=model.replace(".","/");
        if(models[model]) return models[model];
        
    };
    yhge.core.require=yhge.require=requrie;
    yhge.core.load=yhge.load=load;
})();