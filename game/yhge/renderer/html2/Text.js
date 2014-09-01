(function  () {
    /**
     * like text
     */
    var Node=renderer.Node;

    var Text=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"Text",

        initialize:function(props){
            Text._super_.initialize.apply(this,arguments);

            this.setAttributes(props);
        },

        draw:function  (context) {
            Text._super_.draw.apply(this,arguments);
            this._view.css({
                width:this._width,
                height:this._height
            });
            this._contentView.html(this._text);
        },

        setText:function(text) {
            text=this._text?this._text.replace(/\n/g,"<br/>"):this._text;
            this._text = text;
            return this;
        },
        getText:function() {
            return this._text;
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

        initView:function(){
            this._view=$('<div/>').addClass(this.classname);
            this._contentView=$('<span class="cnt"></span>');
            this._view.append(this._contentView);
            return this;
        },
        setView:function(view){
            Text._super_.setView.apply(this,arguments);
            var contentView=this._view.children(".cnt");
            if(contentView && contentView.length){
                this._contentView=contentView;
            }
            return this;
        }
    });
    renderer.Text=Text;
})();