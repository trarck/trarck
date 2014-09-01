(function  () {
    /**
     * Scene
     */
    var Node=yhge.renderer.Node;

    var Scene=yhge.scene.Scene=yhge.core.Class([Node,yhge.core.Accessor],{
        
        classname:"Scene",
        
        _width:0,
        _height:0,
        _background:null,
        _children:null,
        
        initialize:function(props){
            //console.log("init Scene");
            this._children=[];
            this._position={x:0,y:0};
            this._background="#000";
            this.setAttributes(props);
        },
        render:function  (context) {
            context.fillStyle=this._background;
            context.fillRect(0,0,this._width,this._height);
            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
                this._children[i].render(context);
            }
        },
        setWidth:function(width) {
            this._width = width;
            return this;
        },
        getWidth:function() {
            return this._width;
        },
        setHeight:function(height) {
            this._height = height;
            return this;
        },
        getHeight:function() {
            return this._height;
        },
        setBackground:function(background) {
            this._background = background;
            return this;
        },
        getBackground:function() {
            return this._background;
        },
                  
        addChild: function (child) {
            Scene._super_.addChild.call(this,child);
        },

        removeChild: function (child) {
            Scene._super_.removeChild.call(this,child);
        }
    });
    //TODO
    var CanvasScene=yhge.core.Class(yhge.renderer.canvas.Node,{
        
        classname:"CanvasScene",
        
        initialize:function(props){
            console.log("init CanvasScene");
            //this.root=this;
            CanvasScene._super_.initialize.apply(this,arguments);
            this._isRelativeAnchorPoint=false;
        },
        renderer:function (context) {
            context.clearRect(this._position.x,this._position.y,this._width,this._height);
            CanvasScene._super_.renderer.apply(this,arguments);
        }
    });
    yhge.scene.CanvasScene=CanvasScene;
})();