(function () {
    var Node = yhge.renderer.html.Node;
    var Sprite=yhge.renderer.html.Sprite;
    var Text=yhge.renderer.html.Text;
    var ColorPrototype=yhge.renderer.ColorPrototype;
    /**
     * only for transforms
     */
    var Button=yhge.core.Class([Node,ColorPrototype],{

        classname:"Button",

        initialize:function (image,text) {
            this._color={r:0,g:0,b:0};
            this._colorString="rgb(0,0,0)";

            Button._super_.initialize.apply(this,arguments);
            if(image) this.setImageFile(image);
            if(text) this.setText(text);
        },

        setImageFile: function(/**String*/image)
        {

            if(this._image==image) return this;

            this._image=image;

            if ( image )
            {
                if ( !this._imageNode )
                {
                    this._imageNode = new Sprite();
                    this._imageNode.setZOrder( 1 );
                    this.addChild( this._imageNode );
                    this._imageNode.setVisible(true);
                }
                this._imageNode.setImageFile(image);
                this._imageNode.setContentSize(this.getContentSize());
//                this._imageNode.setAnchor(this.getAnchor());
            } else {
                if ( this._imageNode )
                {
                    this.removeChild( this._imageNode );
                    this._imageNode.destroy();
                    this._imageNode = null;
                }
            }
            return this;
        },

        getImageFile:function(){
            return this._image;
        },

        getText: function()
        {
            return this._text;
        },

        setText: function(/**String*/newText)
        {
            if(this._text==newText) return this;

            this._text = newText;

            if ( this._text)
            {
                if ( !this._textNode )
                {
                    var size=this.getContentSize();
                    this._textNode = new Text();
                    this._textNode.setZOrder( 2 );
                    this.addChild( this._textNode );
                    this._textNode.setVisible(true);
                    this._textNode.setContentSize(size);
//                    this._textNode.setAnchor(0.5,0.5);
//                    this._textNode.setPosition(size.width/2, size.height/2);
                    this._textNode.setHorizontalAlign(Text.HorizontalAlign.Center);
                    this._textNode.setVerticalAlign(Text.VerticalAlign.Middle);
                }
                this._textNode.setText(this._text);
            } else {
                if ( this._textNode )
                {
                    this.removeChild( this._textNode );
                    this._textNode.destroy();
                    this._textNode = null;
                }
            }
        },
        setColor:function(){
            Button._super_.setColor.apply(this,arguments);
            this._imageNode && this._imageNode.setColor && this._imageNode.setColor.apply(this._imageNode,arguments);
            this._textNode && this._textNode.setColor.apply(this._textNode,arguments);
        },



        setMultiAsset:function(){

        },
        setFontFamily:function(fontFamily){
            this._textNode && this._textNode.setFontFamily(fontFamily);
        },
		getFontFamily:function(fontFamily){
            return this._textNode && this._textNode.getFontFamily();
        },
        setFontSize:function(fontSize){
            this._textNode && this._textNode.setFontSize(fontSize);
        },
		getFontSize:function(){
			return this._textNode && this._textNode.getFontSize();
		},
        setTextColor:function(){
            this._textNode && this._textNode.setColor.apply(this._textNode,arguments);
        },
		getTextColor:function(){
            return this._textNode && this._textNode.getColor();
        },
        setFlipX:function(v){
            this._imageNode && this._imageNode.setFlipX(v);
        },
        getFlipX:function(){
            this._imageNode && this._imageNode.getFlipX();
        },
        setFlipY:function(v){
            this._imageNode && this._imageNode.setFlipY(v);
        },
        getFlipY:function(){
            this._imageNode && this._imageNode.getFlipY();
        },
        setFlip:function(x,y){
            this._imageNode && this._imageNode.setFlip(x,y);
        },
        setWidth:function(){
            Button._super_.setWidth.apply(this,arguments);
            this._imageNode && this._imageNode.setWidth.apply(this._imageNode,arguments);
            this._textNode && this._textNode.setWidth.apply(this._textNode,arguments);
        },
        setHeight:function(){
            Button._super_.setHeight.apply(this,arguments);
            this._imageNode && this._imageNode.setHeight.apply(this._imageNode,arguments);
            this._textNode && this._textNode.setHeight.apply(this._textNode,arguments);
        },
        setContentSize:function(){
            Button._super_.setContentSize.apply(this,arguments);
            this._imageNode && this._imageNode.setContentSize.apply(this._imageNode,arguments);
            this._textNode && this._textNode.setContentSize.apply(this._textNode,arguments);
        }
    });

    uikit.Button=Button;
})();