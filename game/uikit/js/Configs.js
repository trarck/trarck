var AttrType={
    All:255,
    Element:15,
    Sprite:1,
    Text:2,
    Button:4,
    TFButton:8,
    Node:16,
    Group:32,
    Screen:128
};
var DataType={
    INT:1,
    FLOAT:2,
    STRING:3,
    BOOLEAN:4
};

/**
            name                setter
 def                 =>                      obj

             getter                 name
 obj                 =>                      def

            getter                name
 obj                 =>                      view

             name                setter
 view               =>                      obj

 规则要简单。
 复杂的规则使用代码（符合脚本语言特性）
 */
var BaseAttr={
    name:AttrType.All,
    size_x:AttrType.All,
    size_y:AttrType.All,
    pos_x:AttrType.All,
    pos_y:AttrType.All,
    depth:AttrType.All,
    scale_x:AttrType.All,
    scale_y:AttrType.All,
    anchor_x:AttrType.All,
    anchor_y:AttrType.All,
//    tag:AttrType.All,
    visible:AttrType.All,
//    color:AttrType.All,//自定义。sprite图片的颜色，text字体颜色
    alpha:AttrType.All,//透明,
    color_a:AttrType.Element,
    color_r:AttrType.Element,
    color_g:AttrType.Element,
    color_b:AttrType.Element,
    rotation:AttrType.All,

    flip_x:AttrType.Sprite,
    flip_y:AttrType.Sprite,
    asset:AttrType.Sprite|AttrType.Button,
//    anchor:AttrType.Sprite,


    text:AttrType.Text|AttrType.Button|AttrType.TFButton,
    font_size:AttrType.Text|AttrType.Button|AttrType.TFButton,
    horizontalAlign:AttrType.Text,
    verticalAlign:AttrType.Text,
    fontType:AttrType.Text,
    text_key:AttrType.Text,
    action:AttrType.Button|AttrType.TFButton,
    type:AttrType.TFButton
};

/**
 *  map item
 *  {
 *      name:string,    obj的属性名
 *      kind:int,           类型。Sprite,Text等
 *      setter:string||function,    obj属性的setter方法  || 参数为obj,value,
 *      getter:string||function,   obj属性的getter方法 || 参数为obj，返回值为obj的相关属性或属性组合
 *      value:function, 参数为def，取得def或AttrView Element的属性
 *      handle:function 参数为def,value。设置def或AttrView Element的属性
 *  }
 */
var DefObjMap={

    color:{
        name:"color",
        kind:AttrType.Element,
        dataType:DataType.INT,
        getter:function(obj){
            var color=obj.getColor();
            return color && [color.r,color.g,color.b];
        },
        setter:function(obj,color,def){
            obj.setColor(color[0],color[1],color[2]);
        },
        defaultValue:[255,255,255]

    },

    asset:{
        name:"texture",
        kind:AttrType.Sprite|AttrType.Button,
        getter:function(obj){
            return obj.getImageFile() && obj.getImageFile().replace(config.contentRoot,"").replace("Images2x","Images8x");

        },
        setter:function(obj,value){
            return obj.setImageFile(config.contentRoot+value.replace("Images8x","Images2x"));
        }
    }

};

var ViewObjMap={

    color_r:{
        name:"colorR",
        kind:AttrType.Element,
        dataType:DataType.INT,
        getter:function(obj){
            var color=obj.getColor();
            return color && color.r;
        },
        setter:function(obj,value){
            var color=obj.getColor();
            color.r=value;
            obj.setColor(color);
        }
    },
    color_g:{
        name:"colorG",
        kind:AttrType.Element,
        dataType:DataType.INT,
        getter:function(obj){
            var color=obj.getColor();
            return color && color.g;
        },
        setter:function(obj,value){
            var color=obj.getColor();
            color.g=value;
            obj.setColor(color);
        }
    },
    color_b:{
        name:"colorB",
        kind:AttrType.Element,
        dataType:DataType.INT,
        getter:function(obj){
            var color=obj.getColor();
            return color && color.b;
        },
        setter:function(obj,value){
            var color=obj.getColor();
            color.b=value;
            obj.setColor(color);
        }
    },

    asset:{
        name:"texture",
        kind:AttrType.Sprite|AttrType.Button,
        getter:function(obj){
            return obj.getImageFile() && obj.getImageFile().replace(config.contentRoot,"").replace("Images2x","Images8x");
        },
        setter:function(obj,value){
            return obj.setImageFile(config.contentRoot+value.replace("Images8x","Images2x"));
        }
    },
    name:{
        name:"name",
        kind:AttrType.All,
        getter:function(obj){
            return obj.getName?obj.getName():obj.def.name;
        },
        setter:function(obj,value,attrView){
            obj.setName?obj.setName(value):(obj.def.name=value);
            $.event.trigger("namechange",[value,obj],attrView);
        }
    },
    type:{
        name:"type",
        kind:AttrType.TFButton,
        setter:function(obj,value,attrView){
            obj.setType(value);
            obj._createImage();
            obj.setContentSize(obj._contentSize);
        }
    }
};

var _AttrMap={
    size_x:{
        name:"width",
        dataType:DataType.FLOAT,
        defaultValue:0
    },
    size_y:{
        name:"height",
        dataType:DataType.FLOAT,
        defaultValue:0
    },
    pos_x:{
        name:"positionX",
        dataType:DataType.FLOAT
    },
    pos_y:{
        name:"positionY",
        dataType:DataType.FLOAT
    },
    scale_x:{
        name:"scaleX",
        dataType:DataType.FLOAT,
        defaultValue:1
    },
    scale_y:{
        name:"scaleY",
        dataType:DataType.FLOAT,
        defaultValue:1
    },
    anchor_x:{
        name:"anchorX",
        dataType:DataType.FLOAT,
        defaultValue:0
    },
    anchor_y:{
        name:"anchorY",
        dataType:DataType.FLOAT,
        defaultValue:0
    },
    rotation:{
        name:"rotation",
        dataType:DataType.FLOAT,
        defaultValue:0
    },
    depth:{
        name:"zOrder",
        dataType:DataType.FLOAT,
        defaultValue:0
    },
    alpha:{
        name:"opacity",
        dataType:DataType.FLOAT,
        defaultValue:1
    },
    visible:{
        name:"visible",
        dataType:DataType.BOOLEAN,
        defaultValue:true
    },
    flip_x:{
        name:"flipX",
        kind:AttrType.Sprite|AttrType.Button,
        dataType:DataType.BOOLEAN,
        defaultValue:false
    },
    flip_y:{
        name:"flipY",
        kind:AttrType.Sprite|AttrType.Button,
        dataType:DataType.BOOLEAN,
        defaultValue:false
    },
//    asset:["texture",AttrType.Sprite],
    text:["text",AttrType.Text|AttrType.Button|AttrType.TFButton],
    font_size:["fontSize",AttrType.Text|AttrType.Button|AttrType.TFButton],
    horizontalAlign:{
        name:"horizontalAlign",
        kind:AttrType.Text,
        defaultValue:"center"
    },
    verticalAlign:{
        name:"verticalAlign",
        kind:AttrType.Text,
        defaultValue:"middle"
    },
    type:{
        name:"type",
        kind:AttrType.TFButton
    }

};

for(var name in _AttrMap){
    var rule={
        kind:AttrType.All
    };

    var attr=_AttrMap[name];

    if( attr instanceof Array){
        rule.kind=attr[1];
        rule.name=attr[0];
    }else if(typeof attr=="string"){
        rule.name=attr;
    }else if(typeof attr=="object"){
        for(var k in attr){
            rule[k]=attr[k];
        }
    }

    var p=yhge.core.ucfirst(rule.name);
    var setter="set"+p,getter="get"+p;
    rule.setter=setter;
    rule.getter=getter;
    mixifMapRule(DefObjMap,rule,name);
    mixifMapRule(ViewObjMap,rule,name);
}

function mixifMapRule(map,rule,name){
    if(map[name]){
        for(var k in rule){
            if(!map[name][k]){
                map[name][k]=rule[k];
            }
        }
    }else{
        map[name]=rule;
    }
}

function calcAnchor(anchorDef){
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
};
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
    return color ?( color.a
        ?"#"+decHex(color.r)+decHex(color.g)+decHex(color.b)+decHex(color.a)
        :"#"+decHex(color.r)+decHex(color.g)+decHex(color.b)
        ):"";
}

function stringToColor(colorString){
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
    }else if(colorString.length==6)      {
        var r=colorString.substr(0,2);
        var g=colorString.substr(2,2);
        var b=colorString.substr(4,2);
        color={
            r:parseInt(r,16),
            g:parseInt(g,16),
            b:parseInt(b,16)
        };
    }
    return color;
}

function decHex(n){
    return (n < 16 ? '0' : '') + n.toString(16)
}