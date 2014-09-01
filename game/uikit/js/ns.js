var uikit={

};
(function(){
    var nodeIdMap={};

    var HtmlNodeInit=yhge.renderer.html.Node.prototype.initialize;

    yhge.renderer.html.Node.prototype.initialize=function(){
        HtmlNodeInit.apply(this,arguments);
        nodeIdMap[this._id]=this;
    };

    uikit.getNodeById=function(id){
        return nodeIdMap[id];
    };
})();

