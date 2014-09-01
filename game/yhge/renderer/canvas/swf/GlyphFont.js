(function () {
    var GlyphShape=yhge.renderer.canvas.swf.GlyphShape;
    var ASObject=yhge.renderer.canvas.swf.ASObject;

    var GlyphFont=yhge.core.Class([ASObject,yhge.core.Accessor],{

        classname:"GlyphFont",

        initialize: function() {
            this._fontName="";
            this._glyphShapes=[];
            this._codes={};
        },

        setFontName:function(fontName) {
            this._fontName = fontName;
            return this;
        },
        getFontName:function() {
            return this._fontName;
        },


        setGlyphShapeTable:function(glyphShapeTable) {
            this._glyphShapeTable = glyphShapeTable;
            return this;
        },
        getGlyphShapeTable:function() {
            return this._glyphShapeTable;
        },
        setGlyphShapeCount:function(glyphShapeCount) {
            this._glyphShapeCount = glyphShapeCount;
            return this;
        },
        getGlyphShapeCount:function() {
            return this._glyphShapeCount;
        },
        addGlyphShape:function(code,glyphShape){
            if(!this._codes[code]){
                this._codes[code]=this._glyphShapes.length;
                this._glyphShapes.push(glyphShape);
            }
        },
        addGlyphShapes:function(glyphShape){
            this._glyphShapes.push(glyphShape);
        },
        addGlyphShapes2:function(codes,glyphShapes){
            for(var i= 0,l=codes.length;i<l;i++){
                this.addGlyphShape(codes[i],glyphShapes[i]);
            }
            return this;
        },
        getGlyphShape:function(index){
            return this._glyphShapes[index];
        },
        getGlyphShapeByCharCode:function(charCode){
            var index=this._codes[charCode];
            return this.getGlyphShape(index);
        },
        clone:function(){
            return this;
        }
    });

    GlyphFont.create=function(context,definition,resMap){
        var font=new GlyphFont();
        font.setAttributes({characterId:definition.characterId,fontName:definition.fontName});
        var glyphShapes=definition.glyphShapes;
        var glyphShape;
        for(var i=0;i<glyphShapes.length;i++){
            glyphShape=GlyphShape.create(context,glyphShapes[i],resMap);
            //default color is black;
            glyphShape.setColor("#000");
            font.addGlyphShapes(glyphShape);
        }
        return font;
    };

    yhge.renderer.canvas.swf.GlyphFont=GlyphFont;
    
})();