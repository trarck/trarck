var yh;
(function(yh){
	function getScaleX(matrix)	{
		return Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
	}

	function setScaleX(matrix, scaleX)	{
		var currentScaleX = getScaleX(matrix);
		if (currentScaleX)
		{
			var rate = scaleX / currentScaleX;
			matrix.a = matrix.a * rate;
			matrix.b = matrix.b * rate;
		}
		else
		{
			var radians = getSkewYRadians(matrix);
			matrix.a = Math.cos(radians) * scaleX;
			matrix.b = Math.sin(radians) * scaleX;
		}
	}

	function getScaleY(matrix){
		return Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
	}

	function setScaleY(matrix, scaleY){
		var currentScaleY = getScaleY(matrix);
		if (currentScaleY)
		{
			var rate = scaleY / currentScaleY;
			matrix.c = matrix.c * rate;
			matrix.d = matrix.d * rate;
		}
		else
		{
			var radians = getSkewXRadians(matrix);
			matrix.c = (-Math.sin(radians)) * scaleY;
			matrix.d = Math.cos(radians) * scaleY;
		}
	}

	function getSkewXRadians(matrix){
		return Math.atan2(-matrix.c, matrix.d);
	}

	function setSkewXRadians(matrix, skewX){
		var scaleY= getScaleY(matrix);
		matrix.c = (-scaleY) * Math.sin(skewX);
		matrix.d = scaleY * Math.cos(skewX);
	}

	function getSkewYRadians(matrix) {
		return Math.atan2(matrix.b, matrix.a);
	}

	function setSkewYRadians(matrix, skewY){
		var scaleX = getScaleX(matrix);
		matrix.a = scaleX * Math.cos(skewY);
		matrix.b = scaleX * Math.sin(skewY);
	}

	function getSkewX(matrix) {
		return Math.atan2(-matrix.c, matrix.d) * (180 / Math.PI);
	}

	function setSkewX(matrix, skewX) {
		setSkewXRadians(matrix, skewX * (Math.PI / 180));
	}

	function getSkewY(matrix) 	{
		return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
	}

	function setSkewY(matrix, skewY){
		setSkewYRadians(matrix, skewY * (Math.PI / 180));
	}

	function getRotationRadians(matrix) {
		return getSkewYRadians(matrix);
	}

	function setRotationRadians(matrix, rotation) 	{
		var currentRotation = getRotationRadians(matrix);
		var skewX = getSkewXRadians(matrix);
		setSkewXRadians(matrix, skewX + rotation - currentRotation);
		setSkewYRadians(matrix, rotation);
	}

	function getRotation(matrix){
		return getRotationRadians(matrix) * (180 / Math.PI);
	}

	function setRotation(matrix, rotation) {
		setRotationRadians(matrix, rotation * (Math.PI / 180));
	}

	var geom=yh.geom||(yh.geom={});

	var MatrixTransformer=geom.MatrixTransformer={};

	MatrixTransformer.getScaleX=getScaleX;
	MatrixTransformer.setScaleX=setScaleX;
	MatrixTransformer.getScaleY=getScaleY;
	MatrixTransformer.setScaleY=setScaleY;
	MatrixTransformer.getSkewXRadians=getSkewXRadians;
	MatrixTransformer.setSkewXRadians=setSkewXRadians;
	MatrixTransformer.getSkewYRadians=getSkewYRadians;
	MatrixTransformer.setSkewYRadians=setSkewYRadians;
	MatrixTransformer.getSkewX=getSkewX;
	MatrixTransformer.setSkewX=setSkewX;
	MatrixTransformer.getSkewY=getSkewY;
	MatrixTransformer.setSkewY=setSkewY;
	MatrixTransformer.getRotationRadians=getRotationRadians;
	MatrixTransformer.setRotationRadians=setRotationRadians;
	MatrixTransformer.getRotation=getRotation;
	MatrixTransformer.setRotation=setRotation;

})(yh || (yh={}));