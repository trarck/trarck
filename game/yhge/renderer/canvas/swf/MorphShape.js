(function () {
    var Node=yhge.renderer.Node;
    var Shape=yhge.renderer.canvas.swf.Shape;
    var ASObject=yhge.renderer.canvas.swf.ASObject;
    

    var MorphShape=yhge.core.Class([ASObject,Node,yhge.core.Accessor],{

        classname:"MorphShape",

        initialize:function(props){
            this._shapes={};
            MorphShape._super_.initialize.apply(this,arguments);
            this.setAttributes(props);
        },

        draw:function (context) {
            this._records=this._startRecords;
            MorphShape._super_.draw.call(this,context);
            this._records=this._endRecords;
            context.translate(this._startSize.width,0);
            MorphShape._super_.draw.call(this,context);
            //context.strokeStyle="#F00";
            //context.strokeRect(-this._contentSize.width*this._anchorPoint.x,-this._contentSize.height*this._anchorPoint.y,this._contentSize.width,this._contentSize.height);
        },
//        setStartRecords:function(startRecords) {
//            this._startRecords = startRecords;
//            return this;
//        },
//        getStartRecords:function() {
//            return this._startRecords;
//        },
//        setEndRecords:function(endRecords) {
//            this._endRecords = endRecords;
//            return this;
//        },
//        getEndRecords:function() {
//            return this._endRecords;
//        },
        setStartAnchorPoint:function(startAnchorPoint) {
            this._startAnchorPoint = startAnchorPoint;
            return this;
        },
        getStartAnchorPoint:function() {
            return this._startAnchorPoint;
        },
        setEndAnchorPoint:function(endAnchorPoint) {
            this._endAnchorPoint = endAnchorPoint;
            return this;
        },
        getEndAnchorPoint:function() {
            return this._endAnchorPoint;
        },
        setStartSize:function(startSize) {
            this._startSize = startSize;
            return this;
        },
        getStartSize:function() {
            return this._startSize;
        },
        setEndSize:function(endSize) {
            this._endSize = endSize;
            return this;
        },
        getEndSize:function() {
            return this._endSize;
        },
        setRatio:function (ratio) {
            this._ratio=ratio;
            return this;
        },
        getRatio:function () {
            return this._ratio;
        },
        setStartBounds:function(startBounds) {
            this._startBounds = startBounds;
            return this;
        },
        getStartBounds:function() {
            return this._startBounds;
        },
        setEndBounds:function(endBounds) {
            this._endBounds = endBounds;
            return this;
        },
        getEndBounds:function() {
            return this._endBounds;
        },
        setFillStyles:function(fillStyles) {
            this._fillStyles = fillStyles;
            return this;
        },
        getFillStyles:function() {
            return this._fillStyles;
        },
        setLineStyles:function(lineStyles) {
            this._lineStyles = lineStyles;
            return this;
        },
        getLineStyles:function() {
            return this._lineStyles;
        },
        setStartRecords:function(startRecords) {
            this._startRecords = startRecords;
            return this;
        },
        getStartRecords:function() {
            return this._startRecords;
        },
        setEndRecords:function(endRecords) {
            this._endRecords = endRecords;
            return this;
        },
        getEndRecords:function() {
            return this._endRecords;
        },
        clone:function () {
            var newObj = MorphShape._super_.clone.apply(this, arguments);
            newObj._characterId = this._characterId;
            newObj._startBounds=this._startBounds,
            newObj._endBounds=this._endBounds,
            newObj._fillStyles=this._fillStyles,
            newObj._lineStyles=this._lineStyles,
            newObj._startRecords=this._startRecords,
            newObj._endRecords=this._endRecords
            return newObj;
        },
        createShape:function (context,resMap, config,ratio) {

            var shape=this._shapes[ratio];
            if(!shape){
                var def={
                    characterId:this._characterId,
                    startBounds:this._startBounds,
                    endBounds:this._endBounds,
                    fillStyles:this._fillStyles,
                    lineStyles:this._lineStyles,
                    startRecords:this._startRecords,
                    endRecords:this._endRecords
                };

                var shapeDef=SRT.analyzer.MorphShape.interpolateShape(def,ratio);
                shape=Shape.createShape(context,SRT.analyzer.Shape.analyzeShape(shapeDef,context),resMap,config);
                this._shapes[ratio]=shape;
            }

            return shape;
        }
    });
    
    MorphShape.crateMorphShape=function(context, definition, resMap, config){
        var morphShape = new this();
        morphShape.setAttributes({
            characterId:definition.characterId,
              fillStyles:definition.fillStyles,
              lineStyles:definition.lineStyles,
            startRecords:definition.startRecords,
              endRecords:definition.endRecords,
             startBounds:definition.startBounds,
               endBounds:definition.endBounds
        });
        return morphShape;
    };

    var shapesChace={};
//    MorphShape.createShape=function(context,definition,ratio){
//        var shapes=shapesChace[definition.characterId];
//        if(!shapes){
//            shapesChace[definition.characterId]=shapes={};
//        }
//        var shape=shapes[ratio];
//        if(!shape){
//            var shapeDef=SRT.analyzer.interpolateShape(definition,ratio);
//            shape=Shape.createShape(context,SRT.analyzer.shape(shapeDef));
//            shapes[ratio]=shape;
//        }
//        return shape;
//    };

    yhge.renderer.canvas.swf.MorphShape=MorphShape;
})();