/**
 * Created by JetBrains WebStorm.
 * User: yang
 * Date: 12-6-13
 * Time: 上午12:38
 * To change this template use File | Settings | File Templates.
 */
var BaseAttr={
    name:3,
    size_x:3,
    size_y:3,
    pos_x:3,
    pos_y:3,
    pos_z:3,
    scaling:3,
    pos_origin:3,
    tag:3,
    hide_idle:3,
    color:3,//自定义。sprite图片的颜色，text字体颜色
    alpha:3,//透明
    asset:1,
    anchor:1,
    text:2,
    font_size:2,
    justify:2,
    v_align:2,
    weight:2,
    text_key:2
};
var AttrType={
    Sprite:1,
    Text:2
};
/*
            name                setter
    def                 =>                      obj

            getter                 name
    obj                 =>                      def

             getter                name
    obj                 =>                      view

              name                setter
    view               =>                      obj

    规则要简单。
    另外不使用规则，直接在代码里（符合脚本语言）
 */


var ObjToDefMap={//obj属性转成def值
        //for color
        color_r:function(obj){
            return obj.getColor().r;
        },
        color_g:function(obj){
            return obj.getColor().g;
        },
        color_b:function(obj){
            return obj.getColor().b;
        },
        color_a:function(obj){
            return obj.getOpacity();
        },
        pos_origin:function(obj){
            return anchorToString(obj.getAnchorPoint(),obj.getWidth(),obj.getHeight());
        },
        pos_z:function(obj){
            return obj.getZOrder()/100;
        }
    },
    //def值到obj属性
    //使用属性
    DefToObjMap={
        color:function(def){
            return {r:def.color_r,g:def.color_g,b:def.color_b};
        },
        zOrder:function(def){
            return def*100;
        }
    },
    //使用set器
    DefToObjSetterMap={
        setColor:function(def){
            return {r:def.color_r,g:def.color_g,b:def.color_b};
        },
        setZOrder:function(def){
            return def*100;
        }
    },
    ObjToAttrViewMap={
        color:function(obj){
            return colorToString(obj.getColor());
        },
        pos_z:function(obj){
            return obj.getZOrder()/100;
        },
        assert:function(obj){
            return obj.getTexture().replace(config.contentRoot,"");
        }
    },
    ObjSetterToAttrViewMap={
        color:function(obj,value){
            obj.setColor(stringToColor(value))
        },
        pos_origin:function(obj,value){
            var anchor=HTMLBuilder.calcAnchor(value);
            obj.setAnchorPoint({x:anchor[0]*obj.getWidth(),y:anchor[1]*obj.getHeight()});
        },
        pos_z:function(obj,value){
            obj.setZOrder(value*100);
        }
    },
    AttrViewToObjMap={
        zOrder:function(value){
            return value*100;
        }
    },
    AttrViewToObjSetterMap={
        setZOrder:function(obj,value){
            obj.setZOrder(value*100)
        }
    };

var _AttrMap={
    size_x:"width",
    size_y:"height",
    pos_x:"positionX",
    pos_y:"positionY",
//    pos_z:"zOrder",
    color_a:"opacity",
    asset:"texture",
    text:"text"
};
for(var k in _AttrMap){
    DefToObjMap[_AttrMap[k]]=k;
    AttrViewToObjMap[_AttrMap[k]]=k;
}

//in attr view use alpha replace color_a
//ObjToAttrViewMap.alpha=ObjToAttrViewMap.color_a;
AttrViewToObjMap.opacity="alpha";
//delete ObjToAttrViewMap.color_a;

//for setter
for(var k in DefToObjMap){
    var p=yhge.core.ucfirst(k);
    var v=DefToObjMap[k];
    var setter="set"+p,getter="get"+p;
    !ObjToDefMap[v] && (ObjToDefMap[v]=getter);
    !DefToObjSetterMap[setter] && (DefToObjSetterMap[setter]=v);
}

for(var k in AttrViewToObjMap){
    var p=yhge.core.ucfirst(k);
    var v=AttrViewToObjMap[k];
    var setter="set"+p,getter="get"+p;
    !ObjToAttrViewMap[v] &&(ObjToAttrViewMap[v]=getter);
    !ObjSetterToAttrViewMap[v] &&( ObjSetterToAttrViewMap[v]=setter);
}

function anchorToString(anchor,width,height){
    var pos_origin="";
    switch(parseInt(100*anchor.x/width)){
        case 0:
            pos_origin+="l";
            break
        case 50:
            break;
        case 100:
            pos_origin+="r"
            break;
    }
    switch(parseInt(100*anchor.y/height)){
        case 0:
            pos_origin+="t";
            break
        case 50:
            break;
        case 100:
            pos_origin+="m"
            break;
    }
    return pos_origin;
}

function colorToString(color){
    return color.a
        ?"#"+decHex(color.r)+decHex(color.g)+decHex(color.b)+decHex(color.a)
        :"#"+decHex(color.r)+decHex(color.g)+decHex(color.b);
}

function stringToColor(str){
    var color;
    if(colorString.charAt(0)=="#"){
        var r=colorString.substr(1,2);
        var g=colorString.substr(3,2);
        var b=colorString.substr(5,2);
        var a=colorString.substr(7,2);
        color={
            r:parseInt(r,16),
            g:parseInt(g,16),
            b:parseInt(b,16)
        };
        if(a) color.a=parseInt(a,16);
    }
    return color;
}

function decHex(n){
    return (n < 16 ? '0' : '') + n.toString(16)
}

AttrView.Handle={
    xxxxr:function(obj,value){
        obj.xxx=value;
        obj.yyy=value+100;
    }
};
AttrView.Value={
    color:function(){

    }
};