(function () {
    var Node = yhge.renderer.html.Node;

    var Group=yhge.core.Class(Node,{

        classname:"Group",

        initialize:function () {

            this._lock=true;
            Group._super_.initialize.apply(this,arguments);
        },

        /**
         * for modify children
         * if locked can't modify children
         */
        isLock:function(){
            return this._lock;
        },
        setLock:function(lock){
            this._lock=lock;
        }


    });

    uikit.Group=Group;
})();