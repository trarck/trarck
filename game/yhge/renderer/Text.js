(function  () {


    var ColorPrototype = yhge.renderer.ColorPrototype;

    var util=yhge.util;

    var HorizontalAlign={
        Left: "left",
        Center:"center",
        Right: "right"
    };

    var VerticalAlign={
        Top: "top",
        Middle: "middle",
        Bottom: "bottom",
        Alphabetic:"alphabetic"
    };

    /**
     * Text的接口
     */
    var Text=yhge.core.Class([yhge.core.Accessor,ColorPrototype],{

        classname:"Text",

        initialize:function(props){
            console.log("IText init");

            this._text="";
            this._color={r:0,g:0,b:0};
            this._colorString="rgb(0,0,0)";

            this._horizontalAlign=HorizontalAlign.Center;
            this._verticalAlign=VerticalAlign.Middle;
            this._fontSize="10pt"
            this._fontFamily="Arial";
            this._weight=1;
            this._anchor={x:0,y:0};
            this._originOffset={x:0,y:0};
        },

        setFont:function(font) {
            this._font = font;
            return this;
        },
        getFont:function() {
            return this._font;
        },

        setFontSize:function(fontSize) {
            this._fontSize = fontSize;
            return this;
        },
        getFontSize:function() {
            return this._fontSize;
        },
        setFontFamily:function(fontFamily) {
            this._fontFamily = fontFamily;
            return this;
        },
        getFontFamily:function() {
            return this._fontFamily;
        },

        setTextBaseline:function(textBaseline) {
            this._verticalAlign = textBaseline;
            return this;
        },
        getTextBaseline:function() {
            return this._verticalAlign;
        },

        setHorizontalAlign: function(horizontalAlign)
        {
            this._horizontalAlign = horizontalAlign;
            return this;
        },
        getHorizontalAlign: function(){
            return this._horizontalAlign;
        },

        setVerticalAlign:function(verticalAlign){
            this._verticalAlign = verticalAlign;
            return this;
        },
        getVerticalAlign:function(){
            return this._verticalAlign;
        },

        setWeight:function(weight) {
            this._weight = weight;
            return this;
        },
        getWeight:function() {
            return this._weight;
        },

        setOutlineColor:function(outlineColor) {
            this._outlineColor = outlineColor;
            return this;
        },
        getOutlineColor:function() {
            return this._outlineColor;
        },

        setText:function(text) {
            this._text = text;
            return this;
        },
        getText:function() {
            return this._text;
        },

        setOriginOffset:function(originOffset) {
            this._originOffset = originOffset;
            return this;
        },
        getOriginOffset:function() {
            return this._originOffset;
        },

        setMaxWidth:function(maxWidth) {
            this._maxWidth = maxWidth;
            if(this._maxWidth){
                this._draw=this.draw;
                this.draw=this._drawWithMaxWidth;
            }else{
                this.draw=this._draw;
                this._draw=null;
            }
            return this;
        },
        getMaxWidth:function() {
            return this._maxWidth;
        },

        clone:function(){
            var newObj=Text._super_.clone.apply(this,arguments);
            newObj._text=this._text;
            newObj._color=this._color;
            newObj._colorString=this._colorString;

            newObj._horizontalAlign=this._horizontalAlign;
            newObj._verticalAlign=this._verticalAlign;
            newObj._fontSize=this._fontSize;
            newObj._fontFamily=this._fontFamily;
            newObj._weight=this._weight;
            newObj._anchor=this._anchor;
            newObj._originOffset=this._originOffset;
            newObj._maxWidth=this._maxWidth;
            newObj._font=this._font;
            newObj._outlineColor=this._outlineColor;

            return newObj;
        }

    });

    Text.HorizontalAlign=HorizontalAlign;
    Text.VerticalAlign=VerticalAlign;

    yhge.renderer.Text=Text;
})();