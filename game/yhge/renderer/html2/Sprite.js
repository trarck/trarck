(function  () {
    /**
     * like image
     */
    var Node=yhge.renderer.html.Node;

    var Sprite=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"Sprite",

        initialize:function(props){
            Sprite._super_.initialize.apply(this,arguments);

            this.setAttributes(props);
        },

        draw:function  (context) {
            Sprite._super_.draw.apply(this,arguments);
            this._view.css({
                width:this._width,
                height:this._height,
                backgroundImage:"url("+this._texture+")",
                backgroundSize:this._width+"px "+this._height+"px"
            });
        },
        
        setTexture:function(texture) {
            this._texture = texture;
            return this;
        },
        getTexture:function() {
            return this._texture;
        },
        setUv:function(uv){
            this._uv=uv;
            return this;
        },
        getUv:function(){
            return this._uv;
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
        }
    });
    renderer.Sprite=Sprite;
})();