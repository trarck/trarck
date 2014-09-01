(function () {
    var TransformMatrix=yhge.math.TransformMatrix;
    var geo=yhge.geo;

    var ASObject=function  () {
        this.initialize.apply(this,arguments);
    };

    ASObject.prototype={

        _characterId:0,

        _name:"",

        _baseTransformMatrix:TransformMatrix.getIdentity(),

        setCharacterId:function(characterId) {
            this._characterId = characterId;
            return this;
        },
        getCharacterId:function() {
            return this._characterId;
        },

        setName:function(name) {
            this._name = name;
            return this;
        },
        getName:function() {
            return this._name;
        },

        setDefinition:function(definition) {
            this._definition = definition;
            return this;
        },
        getDefinition:function() {
            return this._definition;
        },


        setBaseTransformMatrix:function(baseTransformMatrix) {
            if(baseTransformMatrix!=this._baseTransformMatrix && !TransformMatrix.equal(baseTransformMatrix,this._baseTransformMatrix)){
                this._baseTransformMatrix = baseTransformMatrix;
                this._dirty |= yhge.renderer.Dirty.TRANSFORM;
                this._dirty |= yhge.renderer.Dirty.TRANSFORM_INVERSE;
            }
//            console.log(i++);
            return this;
        },
        getBaseTransformMatrix:function() {
            return this._baseTransformMatrix;
        },
        nodeToParentTransform: function () {
            if (this._dirty & yhge.renderer.Dirty.TRANSFORM) {

                var matrix = this._baseTransformMatrix.clone();//TransformMatrix.getIdentity();

                if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                    matrix.setTranslate(this._anchorPoint.x, this._anchorPoint.y);
                }

                if (this._position.x!=0 || this._position.y!=0) {
                    matrix.setTranslate(this._position.x, this._position.y);
                }

                if (this._rotation !== 0) {
                    //保持方向一致。由于canvas坐标原点在左上角，正方向为顺时针。我们的坐标系统和canvas坐标系统一致，所以方向保持一致。如果使用坐标原点在左下角，则此处为负。
                    matrix.setRotate(geo.degreesToRadians(this._rotation));
                }
                if (!(this._scaleX == 1 && this._scaleY == 1)) {
                    matrix.setScale(this._scaleX, this._scaleY);
                }

                if (this._anchorPoint.x!=0 || this._anchorPoint.y!=0) {
                    matrix.setTranslate(-this._anchorPoint.x, -this._anchorPoint.y);
                }
                this._transformMatrix=matrix;
                this._dirty &= ~yhge.renderer.Dirty.TRANSFORM;
            }
            return this._transformMatrix;
        }

    };

    yhge.renderer.canvas.swf.ASObject=ASObject;
    
})();