var Core = require('../NGCore/Client/Core').Core;

exports.Gesture=Core.MessageListener.subclass({
    classname:"Gesture",
    $FORWARDS:[['W','N'],['S','E']],

    initialize: function  () {
        this._grid=15;
        this._lastPosition=null;
        this._lastMove='';
        this._strokes=[];
        this._delayTimer=null;
    },
    getLastPosition: function() {
        return this._lastPosition;
    },
    setLastPosition: function(position) {
        this._lastPosition=position;
        return this;
    },
    setGrid: function  (grid) {
        this._grid=grid;
        return this;
    },
    getGrid: function  () {
        return this._grid;
    },
    setLastMove:function  (move) {
        this._lastMove=move;
        return this;
    },
    getLastMove:function  () {
        return this._lastMove;
    },
    gestMove: function (position) {
        var dx=position.getX()-this._lastPosition.getX(),
        dy=position.getY()-this._lastPosition.getY(),
        absX = Math.abs(dx),
        absY = Math.abs(dy);
        var tempMove;
        if (absX < this._grid && absY < this._grid)
            return;

        var pente = absY <= 5 ? 100 : absX / absY; // 5 should be grid/tangent(60)

        if (pente < 0.58 || pente > 1.73) { //between 30?& 60? wait
            if (pente < 0.58)
                tempMove = dy > 0 ? "D" : "U";
            else
                tempMove = dx > 0 ? "R" : "L";
        } else {
            tempMove=this.FORWARDS[dy>0?1:0][dx>0?1:0];
        }
        if (this._lastMove != tempMove) {
            this._strokes.push(tempMove);
            this._lastMove=tempMove;
        }
        this._lastPosition=position;
    },
    reset: function() {
        this._lastPosition=null;
        this._lastMove='';
        this._strokes=[];
        return this;
    },
    setStrokes:function  (strokes) {
        this._strokes=strokes;
        return this;
    },
    resetStrokes:function  () {
        this._strokes=[];
    },
    getStrokes: function() {
        return this._strokes;
    },
    output: function() {
        return this._strokes.join("");
    },
    translate:function(inputs){
        if(inputs.length<2) return '';
        this.reset();
        this.setLastPosiiont(inputs[0]);
        for(var i=1,l=inputs.length;i<l;i++){
            this.gestMove(inputs[i]);
        }
        return this.output();
    }
});
