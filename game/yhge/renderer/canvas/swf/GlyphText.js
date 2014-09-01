(function () {
    var Text=yhge.renderer.canvas.Text;
	var TransformMatrix=yhge.math.TransformMatrix;
    var ASObject=yhge.renderer.canvas.swf.ASObject;

    var GLYPH_DIRTY=2>>8;

    var GlyphText=yhge.core.Class([ASObject,Text],{

        classname:"GlyphText",

        initialize: function() {
            this._textEntries=[];
            GlyphText._super_.initialize.apply(this,arguments);
        },

        setTextEntries:function(textEntries) {
            this._textEntries = textEntries;
            return this;
        },
        getTextEntries:function() {
            return this._textEntries;
        },

        setText:function(text){
            if(this._text!==text){
                this._text=text;
                this.updateGlyph();
//                this._dirty|=GLYPH_DIRTY;
            }
            return this;
        },

        updateGlyph:function(){
//            if(this._dirty& GLYPH_DIRTY){
            var font=this._font;
            //TODO 根据文字生成shape

//            }
        },

        draw:function (context) {
//            context.fillStyle="#f00";
//            context.fillRect(this._originOffset.x,this._originOffset.y,this._contentSize.width,this._contentSize.height);
//            var textEntry;
//            for(var i= 0,l=this._textEntries.length;i<l;i++){
//                textEntry=this._textEntries[i];
//                //console.log(textEntry.getPosition());
//                textEntry.render(context);
//            }
        },
        clone:function(newObj){
            var newObj=GlyphText._super_.clone.apply(this,arguments);
            newObj._characterId=this._characterId;
            newObj._textEntries=this._textEntries;
            newObj._children=this._children;
            return newObj;
        }
    });
    GlyphText.create=function(context,definition,resMap){
        var glyphText=new GlyphText();
        glyphText.setAttributes({
            characterId:definition.characterId,
            transformMatrix:new TransformMatrix(definition.transform.a,definition.transform.b,definition.transform.c,definition.transform.d,definition.transform.tx,definition.transform.ty),
            width:definition.width,
            height:definition.height,
            anchorPoint:{x:-definition.originOffset.x,y:-definition.originOffset.y}
            //originOffset:definition.originOffset
        });
        var entries=[];
        var textEntries=definition.textEntries;

        var font,textEntry,glyphShape;
        for(var i= 0,l=textEntries.length;i<l;i++){
            textEntry=textEntries[i];
            font=resMap[textEntry.fontId];
            glyphShape=font.getGlyphShape(textEntry.glyphIndex).clone();
            glyphShape.setColor(textEntry.color);
            glyphShape.setScale(textEntry.scale, textEntry.scale);
            glyphShape.setPosition(textEntry.x,textEntry.y);
//            entries.push(glyphShape);
            glyphText.addChild(glyphShape);
        }

//        glyphText.setTextEntries(entries);
        return glyphText;
    };

    yhge.renderer.canvas.swf.GlyphText=GlyphText;
})();