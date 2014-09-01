var TokenMap=require("./token_map").data;

exports.Parser=function(version){
    this._tokens=TokenMap[version];
};
exports.Parser.prototype={

    getModuleDefinePositions:function (content,from) {
        //取得名称和路径
        var posHeadBegin=content.indexOf(this._tokens.headBegin,from);
        if(posHeadBegin<0) return false;
        var posHeadBeginNext=posHeadBegin+this._tokens.headBegin.length
        var posHeadEnd=content.indexOf(this._tokens.headEnd,posHeadBeginNext);
        //取得内容
        var posCntBeginNext=content.indexOf(this._tokens.contentBegin,posHeadEnd)+this._tokens.contentBegin.length;
        var posCntEnd=content.indexOf(this._tokens.contentEnd,posCntBeginNext);
        var posCntEndNext=posCntEnd+this._tokens.contentEnd.length;
        //返回结果
        var ret={
            headBegin:posHeadBegin,
            headBeginNext:posHeadBeginNext,
            headEnd:posHeadEnd,
            contentBeginNext:posCntBeginNext,
            contentEnd:posCntEnd,
            contentEndNext:posCntEndNext
        };
        // console.log(ret);
        return ret;
    },

    getModule:function (content,from) {
        var pos=this.getModuleDefinePositions(content,from);

        if(!pos) return false;
        //取得名称和路径
        var fullname=content.substring(pos.headBeginNext,pos.headEnd);
        //取得内容
        var cnt=content.substring(pos.contentBeginNext,pos.contentEnd);
        //返回结果
        var ret={name:fullname,content:cnt,next:pos.contentEndNext};
        // console.log(ret);
        return ret;
    },
    getModuleUseCut:function (content,from) {
        var pos=this.getModuleDefinePositions(content,from);
        if(!pos) return false;
        //取得名称和路径
        var fullname=content.substring(pos.headBeginNext,pos.headEnd);
        //取得内容
        var cnt=content.substring(pos.contentBeginNext,pos.contentEnd);

        var headCnt=content.substring(0,pos.headBegin),
            endCnt=content.substring(pos.contentEndNext);
        var newContent=headCnt+endCnt;
        //返回结果
        var ret={name:fullname,content:cnt,leftContent:newContent,next:pos.headBegin};
        // console.log(ret.name,ret.next);
        return ret;
    },
    getCompressModule:function(){

    },
    parseRequireMap:function(content,encoding){
        var ret=this.getAppRequirePathMap(content,0);
        var newCnt=content.substring(ret.next);
        var map={};
        for(var path in ret.content) map[ret.content[path]]=path;
       //fs.writeFileSync("new_application.js", newCnt,encoding);
        return {map:map,content:newCnt};
    },
    getAppRequirePathMap:function (content,from) {
        var posBegin=content.indexOf(this._tokens.requireMapBegin,from);
        if(posBegin<0) return false;
        var posBeginNext=posBegin+this._tokens.requireMapBegin.length;
        var posEnd=content.indexOf(this._tokens.requireMapEnd,posBeginNext);
        //取得内容
        var cnt=content.substring(posBeginNext,posEnd);

        var map=JSON.parse("{"+cnt+"}");

        return {content:map,next:posEnd+this._tokens.requireMapEnd.length};
    },
    getModuleDefinePositionsSpec:function (content,from) {
        //取得名称和路径
        var posHeadBegin=content.indexOf(this._tokens.headBegin,from);
        if(posHeadBegin<0) return false;
        var posHeadBeginNext=posHeadBegin+this._tokens.headBegin.length
        var posHeadEnd=content.indexOf(this._tokens.headEnd,posHeadBeginNext);
        //取得内容
        var posSpecBegin=content.indexOf(this._tokens.specTokenBegin,posHeadEnd+this._tokens.headEnd.length);
        var posSpecBeginNext=posSpecBegin+this._tokens.specTokenBegin.length;
        var posSpecEnd=content.indexOf(this._tokens.specTokenEnd,posSpecBeginNext);
        var specStr=content.substring(posSpecBeginNext,posSpecEnd);
        var contentEnd=this._tokens.contentEndBegin+specStr+this._tokens.contentEndEnd;
        var posCntBeginNext=posSpecEnd+this._tokens.specTokenEnd.length;
        var posCntEnd=content.indexOf(contentEnd,posCntBeginNext);
        var posCntEndNext=posCntEnd+contentEnd.length;
        //返回结果
        var ret={
            headBegin:posHeadBegin,
            headBeginNext:posHeadBeginNext,
            headEnd:posHeadEnd,
            contentBeginNext:posCntBeginNext,
            contentEnd:posCntEnd,
            contentEndNext:posCntEndNext
        };
//        console.log(ret);
        return ret;
    }
}