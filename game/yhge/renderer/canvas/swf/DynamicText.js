(function () {
    var Text=yhge.renderer.canvas.Text;
    var ASObject=yhge.renderer.canvas.swf.ASObject;

    var DynamicText=yhge.core.Class([ASObject,Text],{

        classname:"DynamicText",

        initialize: function() {
            DynamicText._super_.initialize.apply(this,arguments);
        },
        render:function(context){
            DynamicText._super_.render.apply(this,arguments);
        },
        draw:function(context){
//            context.fillStyle="#FCC";
//            context.fillRect(this._originOffset.x,this._originOffset.y,this._contentSize.width,this._contentSize.height);
            DynamicText._super_.draw.apply(this,arguments);
        },
        setAnchorPoint:function(){
            DynamicText._super_.setAnchorPoint.apply(this,arguments);
        },
        setAnchor:function(){
            DynamicText._super_.setAnchor.apply(this,arguments);
        },
        clone:function(newObj){
            var newObj=DynamicText._super_.clone.apply(this,arguments);
            newObj._characterId=this._characterId;
            return newObj;
        }
    });

    DynamicText.Align={
        Left:0,
        Right:1,
        Center:2,
        Justify:3,
        "0":"left",
        "1":"right",
        "2":"center",
        "3":"justify"
    }


    DynamicText.create=function(context,definition,resMap){
        var font=resMap[definition.fontId];

        var text=new DynamicText();
        text.setAttributes({
            characterId:definition.characterId,
            width:definition.width,
            height:definition.height,
            originOffset:definition.originOffset,
            text:definition.text,
            color:definition.color,
            horizontalAlign:DynamicText.Align[definition.align],
            verticalAlign:"middle",//default middle
            fontSize:definition.fontHeight,
            fontFamily:font.fontName
        });

        return text;
    };

    yhge.renderer.canvas.swf.DynamicText=DynamicText;
})();