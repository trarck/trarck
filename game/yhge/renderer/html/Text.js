(function  () {
    /**
     * like text
     */
    var Node=yhge.renderer.html.Node;
    var IText=yhge.renderer.Text;

    var HorizontalAlign=IText.HorizontalAlign;

    var VerticalAlign=IText.VerticalAlign;

    var Text=yhge.core.Class([Node,IText],{

        classname:"Text",

        HorizontalAlign:HorizontalAlign,
        VerticalAlign:VerticalAlign,
        
        initialize:function(props){

            IText.prototype.initialize.apply(this,arguments);
            Text._super_.initialize.apply(this,arguments);

        },

        draw:function  (context) {
            Text._super_.draw.apply(this,arguments);
            var css={
                width:this._contentSize.width,
                height:this._contentSize.height

            };

            var contentCss={
                textAlign: this._horizontalAlign,
                verticalAlign: this._verticalAlign,
                fontSize:this._fontSize
            };

            if(this._fontFamily) css.fontFamily=this._fontFamily;
            if(this._color) css.color=this.getColorString();

            this._view.css(css);
            this._contentView.css(contentCss);
            //show content
            var text=this._text?this._text.replace(/\n/g,"<br/>"):this._text;
            this._contentView.html(text);
        },

        setColor:function(color) {
            Text._super_.setColor.apply(this,arguments);
            this._contentView.css("color",this.getColorString());
            return this;
        },

        setText:function(text) {
            Text._super_.setText.apply(this,arguments);
			this._contentView.html(text);
            return this;
        },
        setHorizontalAlign: function(horizontalAlign)
        {
            Text._super_.setHorizontalAlign.apply(this,arguments);

			this._contentView.css("text-align",horizontalAlign);
            return this;
        },

        setVerticalAlign: function(verticalAlign)
        {
            Text._super_.setVerticalAlign.apply(this,arguments);
			this._contentView.css("vertical-align",verticalAlign);
            return this;
        },

        setFontFamily: function(fontFamily)
        {
            Text._super_.setFontFamily.apply(this,arguments);
			this._contentView.css("font-family",fontFamily);
            return this;
        },

        setFontSize: function(fontSize)
        {
            Text._super_.setFontSize.apply(this,arguments);
			this._contentView.css("font-size",fontSize);
            return this;
        },

        initView:function(){
            Text._super_.initView.apply(this,arguments);
            this._contentView=$('<span class="cnt"></span>');
            this._view.append(this._contentView);
            return this;
        },
        setView:function(view){
            Text._super_.setView.apply(this,arguments);
            var contentView=this._view.children(".cnt");
            if(contentView && contentView.length){
                this._contentView=contentView;
            }else{
                this._contentView=$('<span class="cnt"></span>');
                this._view.append(this._contentView);
            }
            return this;
        },
        _visibleType:"table"
    });
    yhge.renderer.html.Text=Text;
})();