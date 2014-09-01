(function  () {
   
    var Node=yhge.renderer.canvas.Node;

    var AttrProcessor=yhge.core.Class(yhge.core.Accessor,{

        classname:"AttrProcessor",

        initialize:function(props){
            this._renderList=[];
            this.setAttributes(props);
        },

        draw:function  (context) {
            this._background.draw(context);
            this._border.draw(context);
        },
        drawBackground:function(context){
        	this._background.draw(context);
        },
        drawBorder:function(context){
        	this._border.draw(context);
        },
        setBackgroundColor:function (color) {
            
        },
        setBackgroundImage:function(){
            
        },
        setBackground:function(){
        	
        },
        /**
         * border:width type color
         */
        setBorder:function(border){
            this._border=border;
        }
        
    });
    yhge.renderer.canvas.AttrProcessor=AttrProcessor;
})();