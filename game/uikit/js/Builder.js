/**
 * Created by JetBrains WebStorm.
 * User: duanhouhai
 * Date: 12-5-7
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */
(function(){
    var Node=renderer.Node;
    var Sprite=renderer.Sprite;

    var Builder=function(){
        this.initialize.apply(this,arguments);
    };
    Builder.prototype={

        calssname:"Builder",

        initialize:function(attrView){
            this._attrView=attrView;
        },
        /**
         * @private
         */
        createElements: function( def)
        {
            this.data=def;

            var elem =$("<div class='Node'/>") //;this._createElement(def,);
            //build images
            var images=def.images;
            if(images){
                for(var img,i=0,l=images.length;i<l;i++){
                    img=this.createImage(images[i]);
                    elem.append(img);
                }
            }
            //build labels
            var labels=def.labels;
            if(labels){
                for(var label,i=0,l=labels.length;i<l;i++){
                    label=this.createLabel(labels[i]);
                    elem.append(label);
                }
            }

            return elem;
        },
        createImage:function(def){
            var self=this;
            def.args=def.args||{};

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
                //return;
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
                    zIndex:parseInt(zOrder*100),
                    width:width,
                    height:height
                })
                .data("def",def).data("anchor",anchor)
                .mousedown(function(e){
                    self._attrView.setObj(sprite);

                    startX=e.pageX;
                    startY=e.pageY;
                    startPosition.x=parseInt(sprite.css("left"));
                    startPosition.y=parseInt(sprite.css("top"));
                    $(document)
                        .mousemove(didMove)
                        .mouseup(function(e){
                            $(document).unbind("mousemove",didMove).unbind("mouseup");
                            //更新位置
                            var dx=e.pageX-startX;
                            var dy=e.pageY-startY;
                            if(dx!=0 || dy!=0){
                                var data=sprite.data("def");
                                self._attrView.updatePosition(data.pos_x+dx,data.pos_y+dy);
                            }
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
        createLabel:function(def){
            var self=this;
            def.args=def.args||{};

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
                    zIndex:parseInt(zOrder*100),
                    width:width,
                    height:height,
                    fontSize:fontSize,
                    color:"rgb("+r+","+g+","+b+")"
                })
                .data("def",def).data("anchor",anchor)
                //替换换行符
                .html("<span class='cnt'>"+(text?text.replace(/\n/g,"<br/>"):"")+"</span>")
                .mousedown(function(e){
                    self._attrView.setObj(label);

                    startX=e.pageX;
                    startY=e.pageY;
                    startPosition.x=parseInt(label.css("left"));
                    startPosition.y=parseInt(label.css("top"));
                    $(document)
                        .mousemove(didMove)
                        .mouseup(function(e){
                            $(document).unbind("mousemove",didMove).unbind("mouseup");
                            //更新位置
                            var dx=e.pageX-startX;
                            var dy=e.pageY-startY;
                            if(dx!=0 || dy!=0){
                                var data=label.data("def");
                                self._attrView.updatePosition(data.pos_x+dx,data.pos_y+dy);
                            }
                        });
                    e.preventDefault();
                });

            return label;
        }
    };
})();