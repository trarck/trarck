/**
 * Created by JetBrains WebStorm.
 * User: yang
 * Date: 12-6-12
 * Time: 下午11:54
 * To change this template use File | Settings | File Templates.
 */

var DataWriter=function(){
    this.initialize.apply(this,arguments);
};

DataWriter.prototype={

    childContainer:{
        Sprite:"images",
        Text:"labels",
        Button:"buttons",
        TFButton:"tfbuttons",
        Group:"groups"

    },
    initialize:function(screen){
        screen && (this._screen=screen);
    },
    getData:function(node){
        var data={},def,children=node.getChildren();

        var container,containerName;
        for(var i=0,l=children.length,chd;i<l;i++){
            chd=children[i];
            def=DataWriter.getDataCommon(chd,AttrType[chd.classname]);
            containerName=this.childContainer[chd.classname];
            if(!containerName) continue;

            container=data[containerName];
            if(!container) container=data[containerName]=[];
            container.push(def);

            if(chd.classname=="Group"){
                if(node._elementDefine && node._elementDefine.groupDefinitions){
                    node._elementDefine.groupDefinitions[def.groupDefinition]=this.getData(chd);
                }
            }
        }
        return data;
    },

    getScreenData:function(){
        return this.getData(this._screen);
    },

    getNodeData:function(node){
        var ret=data.def;
        var pos=node.getPosition();
        ret.pos_x=pos.x;
        ret.pos_y=pos.y;
        ret.pos_z=node.getZOrder();
        return ret;
    },
    getSpriteData:function(sprite){
        var ret=this.getNodeData(sprite);
        ret.size_x=sprite.getWidth();
        ret.size_y=sprite.getHeight();
        ret.pos_origin=this._anchorToString(sprite.getAnchorPoint(),sprite.getWidth(),sprite.getHeight());
        ret.asset=sprite.getTexture();
        return ret;
    },
    getTextData:function(text){
        var ret=this.getNodeData(text);
        ret.size_x=text.getWidth();
        ret.size_y=text.getHeight();
        ret.pos_origin=this._anchorToString(text.getAnchorPoint(),text.getWidth(),text.getHeight());
        return ret;
    },
    _anchorToString:function(anchor,width,height){
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
    },

    setScreen:function(screen){
        this._screen=screen;
    },
    getScreen:function(){
        return this._screen;
    }
};
DataWriter.getDataCommon=function(obj,kind){
    var ret=obj.def,getter,value;
    for(var name in DefObjMap){
        if(DefObjMap[name].kind & kind){
            getter=DefObjMap[name].getter;
            if(getter){
                value=typeof getter=="function"?
                      getter(obj):
                      obj[getter]();
                if(!isEmpty(value)){
                    ret[name]=value;
                }else{
                    delete ret[name];
                }
            }
        }
    }
    //skip default value
    for(var k in ret){
        if(isDefaultValue(ret[k],k)){
            delete ret[k];
        }
    }
    //skip info
    if(isEmpty(ret.info)) delete ret.info;
    return ret;
};

function isEmpty(v){
    if (v ==="" || v ===null || v===undefined) return true;
    if(v instanceof Array) return v.length==0;
    if(typeof v=='object'){
        for(var k in v){
            return false;
        }
        return true
    }
    return false;
}

function deepEqual(a,b){
    var ret=false;
    if(typeof b!="undefined"){
        if(typeof b=="object"){
            for(var k in b){
                if(!deepEqual(a[k],b[k])){
                    return false
                }
            }
            ret=true;
        }else{
            ret=b==a;
        }
    }
    return ret;
}

function isDefaultValue(value,name){
//    console.log(name,value,DefObjMap[name]&& DefObjMap[name].defaultValue,deepEqual(value,DefObjMap[name]&& DefObjMap[name].defaultValue));
    return deepEqual(value,DefObjMap[name]&& DefObjMap[name].defaultValue);
}