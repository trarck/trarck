(function  () {
    /**
     * frame不管显示的时间，由animation定义
     * @constructor
     */
    var Frame=function(){
        this.initialize.apply(this,arguments);
    };
    //如果width和size没指定，用sprite的大小
    Frame=yhge.core.Class({
        base:Frame,

        extend:yhge.core.Accessor,

        overrides:{
        
        classname:"Frame",
        
        _offset:null,
        _isSetSize:false,
		//1	{texture:xx,uv:xx,size:xx,offset:xx}
		//2 texture,uv,size,offset
		//3 texture,uv
		//4 texture
        initialize:function(props){
            console.log("init Frame",typeof props);
            this._size={width:0,height:0};
            this._offset={x:0,y:0};
            if(!props.texture){
                props={
                    texture:arguments[0],
                    rect:arguments[1]
                };
                arguments[2] && (props.size=arguments[2]);
                arguments[3] && (props.offset=arguments[3]);
            }
            this._isSetSize=!!props.size;
            this.setAttributes(props);
        },
        setWidth:function(width) {
            this._size.width=width;
            this._isSetSize=true;
            return this;
        },
        getWidth:function() {
            return this._size.width;
        },
        setHeight:function(height) {
            this._size.height=height;
            this._isSetSize=true;
            return this;
        },
        getHeight:function() {
            return this._size.height;
        },
        setSize:function (size) {
            if(size instanceof Array){
                this._size.width=size[0];
                this._size.height=size[1];
            }else{
                this._size.width=size.width;
                this._size.height=size.height;
            }
            this._isSetSize=true;
            return this;
        },
        getSize:function () {
            return this._size;
        },
        setRect:function(rect){
        	this._rect = rect instanceof Array?{origin:{x:rect[0],y:rect[1]},size:{width:rect[2],height:rect[3]}}:rect;
            if(!this._isSetSize){
                this._size.width=this._rect.size.width;
                this._size.height=this._rect.size.height;
            }
            return this;
        },
        getRect:function(){
        	return this._rect;
        },
        //uv is in percent
        setUv:function(uv) {
            this._uv = uv instanceof Array?{x:uv[0],y:uv[1],width:uv[2],height:uv[3]}:uv;
            return this;
        },
        getUv:function() {
            return this._uv;
        },
        setTexture:function(texture) {
            this._texture = texture;
            return this;
        },
        getTexture:function() {
            return this._texture;
        },
        setOffset:function(offset){
        	this._offset=offset instanceof Array?{x:offset[0],y:offset[1]}:offset;
        	return this;
        },
        getOffset:function(){
        	return this._offset;
        }
    }});
    yhge.renderer.Frame=Frame;
    yhge.animation.Frame=Frame;
})();