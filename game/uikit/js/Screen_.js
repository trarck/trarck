var Screen=function(){
	this.initialize.apply(this,arguments);
};
Screen.prototype={

    calssname:"Screen",

	initialize:function(attrView){
		this._view=$("<div class='Screen'/>");
		//属性列表视图
		this._attrView=attrView;
		//王国使用的4大内容
		this._images=[];
		this._labels=[];
		this._composites=[];
		//TODO 对items的支持
		
	},
	/**
     * @private
     */
    createElements: function( def)
    {
        this.data=def;
        
        //var elem =$("<div class='Node'/>"); //;this._createElement(def,);
        //build images
        var images=def.images;
        if(images){
            for(var img,i=0,l=images.length;i<l;i++){
                img=this._createImage(images[i]);
                elem.append(img);
            }
        }
        //build labels
        var labels=def.labels;
        if(labels){
            for(var label,i=0,l=labels.length;i<l;i++){
                label=this._createLabel(labels[i]);
                elem.append(label);
            }
        }
        
        return elem;
    },
    _createImage:function(def){
        var self=this;
        
        var name=def.name,
            imageName=def.asset,
            x=def.pos_x,
            y=def.pos_y,
            zOrder=def.pos_z,
            width=def.size_x,
            height=def.size_y,
            tag=def.tag;
        if(!imageName){
            //TODO 使用边框
            return;
        }
        var src=config.contentRoot+imageName;
        //if(src.indexOf("Event")>-1) src=src.replace("Content","ContentSecondary");
        var pos_origin=def.pos_origin;
        var anchor=this._calcAnchor(pos_origin);
        var anchorPointInPixels=[
            anchor[0]*width,
            anchor[1]*height
        ];
        var sprite;
        
        var startPosition={x:0,y:0},startX=0,startY=0;
        
        var didMove=function(e){
            var dx=e.pageX-startX;
            var dy=e.pageY-startY;
            sprite.css({
                left:startPosition.x+dx,
                top:startPosition.y+dy
            });
        };
        
        sprite=$("<img class='Sprite'/>")
            .attr({
                src:src
            })
            .css({
                left:x-anchorPointInPixels[0],
                top:y-anchorPointInPixels[1],
                zIndex:zOrder,
                width:width,
                height:height    
            })
            .data("def",def)
            .mousedown(function(e){
                self._attrView.setObj(sprite);
                
                startX=e.pageX;
                startY=e.pageY;
                startPosition.x=sprite[0].offsetLeft;
                startPosition.y=sprite[0].offsetTop;
                $(document)
                    .mousemove(didMove)
                    .mouseup(function(){
                        $(document).unbind("mousemove",didMove).unbind("mouseup");
                        self._attrView.updatePosition(sprite[0].offsetLeft,sprite[0].offsetTop);
                });
                e.preventDefault();
            });
        return sprite;
    },
    _calcAnchor:function(anchorDef){
        var anchor=[0.5,0.5];
        if(anchorDef){
            if (anchorDef.indexOf("l") >= 0){
                // left
                anchor[0]=[0];
            }else if (anchorDef.indexOf("r") >= 0){
                // right
                anchor[0]=[1];
            }
            
            if (anchorDef.indexOf("t") >= 0){
                // left
                anchor[1]=[0];
            }else if (anchorDef.indexOf("b") >= 0) {
                // right
                anchor[1]=[1];
            }
        }
        return anchor;
    },
    _createLabel:function(def){
        var name=def.name,
            imageName=def.asset,
            x=def.pos_x,
            y=def.pos_y,
            zOrder=def.pos_z,
            width=def.size_x,
            height=def.size_y,
            tag=def.tag,
            fontSize=def.font_size,
            r=def.color_r,
            g=def.color_g,
            b=def.color_b,
            text=def.text;
            
        var pos_origin=def.pos_origin;
        var anchor=this._calcAnchor(pos_origin);
        var anchorPointInPixels=[
            anchor[0]*width,
            anchor[1]*height
        ];
        
        var label;
        var startPosition={x:0,y:0},startX=0,startY=0;
        
        var didMove=function(e){
            var dx=e.pageX-startX;
            var dy=e.pageY-startY;
            label.css({
                left:startPosition.x+dx,
                top:startPosition.y+dy
            });
        }
        
        label=$("<span class='Text'/>")
            .css({
                left:x-anchorPointInPixels[0],
                top:y-anchorPointInPixels[1],
                zIndex:zOrder,
                width:width,
                height:height,
                fontSize:fontSize,
                color:"rgb("+r+","+g+","+b+")"    
            })
            .data("def",def)
            //替换换行符
            .html("<span class='cnt'>"+text.replace(/\n/g,"<br/>")+"</span>")
            .mousedown(function(e){
                self._attrView.setObj(label);
                
                startX=e.pageX;
                startY=e.pageY;
                startPosition.x=label[0].offsetLeft;
                startPosition.y=label[0].offsetTop;
                $(document)
                    .mousemove(didMove)
                    .mouseup(function(){
                        $(document).unbind("mousemove",didMove).unbind("mouseup");
                        self._attrView.updatePosition(label[0].offsetLeft,label[0].offsetTop);
                });
                e.preventDefault();
            });
        
        return label;
    }
};