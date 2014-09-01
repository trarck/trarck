(function  () {
    /**
     * Scene
     */
    var Scene=yhge.scene.Scene;
    
    var SceneHaveBackground=yhge.scene.SceneHaveBackground=yhge.core.Class(Scene,{
        classname:"SceneHaveBackground",
        
        _background:null,
        
        initialize:function(props){
            console.log("init SceneHaveBackground");
            SceneHaveBackground._super_.initialize.apply(this,arguments);
        },
        render:function  (context) {
            this._background.render(context);
            
            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
                this._children[i].render(context);
            }
        }
    });
})();