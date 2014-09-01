(function  () {
    var HtmlText=yhge.renderer.html.Text;

    var Text=yhge.core.Class(HtmlText,{

        nodeToParentTransform: function () {
            if (this._dirty & Dirty.TRANSFORM) {

                this._transformMatrix = TransformMatrix.getIdentity();

                if (!this._isRelativeAnchorPoint && (this._anchorPoint.x !== 0 || this._anchorPoint.y !== 0)) {
                    this._transformMatrix.setTranslate(this._anchorPoint.x, this._anchorPoint.y);
                }

                if (this._position.x!=0 || this._position.y!=0) {
                    this._transformMatrix.setTranslate(this._position.x, this._position.y);
                }

                if (this._rotation !== 0) {
                    //保持方向一致。由于canvas坐标原点在左上角，正方向为顺时针。我们的坐标系统和canvas坐标系统一致，所以方向保持一致。如果使用坐标原点在左下角，则此处为负。
                    this._transformMatrix.setRotate(geo.degreesToRadians(this._rotation));
                }
                if (!(this._scaleX == 1 && this._scaleY == 1)) {
                    this._transformMatrix.setScale(this._scaleX, this._scaleY);
                }

                if (this._anchorPoint.x!=0 || this._anchorPoint.y!=0) {
                    var anchorX=this._scaleX<0?this._anchorPoint.x:-this._anchorPoint.x,
                        anchorY=this._scaley<0?this._anchorPoint.y:-this._anchorPoint.y;
                    this._transformMatrix.setTranslate(anchorX, anchorY);
                }
                this._dirty &= ~Dirty.TRANSFORM;
            }

            return this._transformMatrix;
        }
    });
    uikit.Text=Text;
})();