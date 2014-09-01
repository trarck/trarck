(function () {
    var Node=yhge.renderer.Node;

    var Clip=yhge.core.Class([Node,yhge.core.Accessor],{

        classname:"Clip",

        initialize:function(props){
	
		},
		
		setPath:function(path) {
            this._path = path;
            return this;
        },
        getPath:function() {
            return this._path;
        },

        //剪切模式渲染
        render:function(context){
            if (!this._visible) {
                return;
            }
            //由于clip不能使用save restore 则使用transform的逆矩阵来恢复到之前状态

            this.transform(context);

            this.draw(context);

            for(var i=0,chdLen=this._children.length;i<chdLen;i++){
                this._children[i].render(context);
            }

            var invertMatrix=this.parentToNodeTransform();
            context.transform(invertMatrix.a,invertMatrix.b,invertMatrix.c,invertMatrix.d,invertMatrix.tx,invertMatrix.ty);
        },

        draw:function(context){
			this._path.draw(context);
        }

    };

    SRT.renderer.canvas.ASObject=ASObject;
    
})();