/**
 * User: trarck
 * Date: 12-8-25
 * Time: 上午10:37
 */
(function  () {
    var Node=yhge.renderer.Node;
    var Entity=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"Entity",

        initialize:function(props){
            Entity._super_.initialize.apply(this,arguments);
        },
        
        loadView:function(){
            //overrite buy subclass
            //or
            this.loadViewWithFile(this.classname+".json");
        },
        loadViewWithFile:function(file){
//            var def=ViewDataManager.getViewDefine(file);
//            this._view=Builder.create(def);
        },
        loadViewWithData:function (data) {
            
        },

        setView:function(view) {
            this._view = view;
            return this;
        },
        getView:function() {
            return this._view;
        }
    });
    TcgCard.Entity=Entity;
})();