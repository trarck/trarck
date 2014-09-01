(function  () {
    /**
     * like image
     */
    var Node=yhge.renderer.Node;
    var IText=yhge.renderer.Text;

    var Text=yhge.core.Class([Node,IText],{

        classname:"Text",

        initialize:function(props){
            IText.prototype.initialize.apply(this,arguments);
            Text._super_.initialize.apply(this,arguments);
        },

        draw:function  (context) {
            context.fillStyle=this._colorString;
            context.font = this._fontSize+" "+this._fontFamily;
            context.textAlign=this._horizontalAlign;
            context.textBaseline=this._verticalAlign;
            context.lineWidth=this._weight;
            context.fillText(this._text,this._originOffset.x,this._originOffset.y);
            if(this._outlineColor){
                this.strokeStyle=this._outlineColor;
                context.fillText(this._text,0,0);
            }
        },

        drawWithMaxWidth:function(context){
            context.fillStyle=this._colorString;
            context.font = this._fontSize+" "+this._fontFamily;
            context.textAlign=this._horizontalAlign;
            context.textBaseline=this._verticalAlign;
            context.lineWidth=this._weight;
            context.fillText(this._text,this._originOffset.x,this._originOffset.y,this._maxWidth);
            if(this._outlineColor){
                this.strokeStyle=this._outlineColor;
                context.fillText(this._text,this._originOffset.x,this._originOffset.y,this._maxWidth);
            }
        }
//        setHorizontalAlign: function(horizontalAlign)
//        {
//            Text._super_.setHorizontalAlign.apply(this,arguments);
//            switch (horizontalAlign){
//                case HorizontalAlign.Left:
//                    this._originOffset.x=0;
//                    break;
//                case HorizontalAlign.Center:
//                    this._originOffset.x=-0.5;
//                    break;
//                case HorizontalAlign.Right:
//                    this._originOffset.x=-1;
//                    break;
//            }
//            return this;
//        },
//
//        setVerticalAlign:function(verticalAlign){
//            Text._super_.setVerticalAlign.apply(this,arguments);
//            switch (verticalAlign){
//                case VerticalAlign.Top:
//                    this._anchor.y=0;
//                    break;
//                case VerticalAlign.Middle:
//                    this._anchor.y=-0.5;
//                    break;
//                case VerticalAlign.Bottom:
//                    this._anchor.y=-1;
//                    break;
//            }
//            this.setAnchor(this._anchor);
//            return this;
//        }
    });

    yhge.renderer.canvas.Text=Text;
})();