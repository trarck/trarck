/**
 * Created with JetBrains WebStorm.
 * User: trarck
 * Date: 12-7-7
 * Time: 下午12:14
 * To change this template use File | Settings | File Templates.
 */

var ArgParser=exports.ArgParser=function(){
    this.shortOptions = {};
    this.longOptions = {};

    this._optionDisplayStartColumn=2;
    this._betweenShortAndLongDisplayColumn=1;
    this._betweenCmdAndDescriptionDisplayColumn=1;
};

//ArgParser.prototype.setLongOpts=function(longOptions){
//    this.longOptions=longOptions;
//};
//ArgParser.prototype.getLongOpts=function(){
//    return this.longOptions;
//};
//
//ArgParser.prototype.setShortOpts=function(shortOptions){
//    this.shortOptions=shortOptions;
//};
//ArgParser.prototype.getShortOpts=function(){
//    return this.shortOptions;
//};

ArgParser.prototype.setOptionDisplayStartColumn=function(optionDisplayStartColumn) {
    this._optionDisplayStartColumn = optionDisplayStartColumn;
    return this;
};
ArgParser.prototype.getOptionDisplayStartColumn=function() {
    return this._optionDisplayStartColumn;
};

ArgParser.prototype.setBetweenShortAndLongDisplayColumn=function(betweenShortAndLongDisplayColumn) {
    this._betweenShortAndLongDisplayColumn = betweenShortAndLongDisplayColumn;
    return this;
};

ArgParser.prototype.getBetweenShortAndLongDisplayColumn=function() {
    return this._betweenShortAndLongDisplayColumn;
};

ArgParser.prototype.setBetweenCmdAndDescriptionDisplayColumn=function(betweenCmdAndDescriptionDisplayColumn) {
    this._betweenCmdAndDescriptionDisplayColumn = betweenCmdAndDescriptionDisplayColumn;
    return this;
};
ArgParser.prototype.getBetweenCmdAndDescriptionDisplayColumn=function() {
    return this._betweenCmdAndDescriptionDisplayColumn;
};



/**
 * {
 *      full:
 *      abbr:
 *      type:string|boolean|number|date|
 *      default:
 * }
 * @param opts
 */
ArgParser.prototype.setOpts=function(opts){
    this.shortOptions = {};
    this.longOptions = {};

    var item;
    for (var i = 0, ii = opts.length; i < ii; i++) {
        item = opts[i];
        this.addOpt(item);
    }
};

ArgParser.prototype.addOpt=function(opt){
    //check item name
    opt.name=opt.name||opt.full||opt.abbr;

    if(opt.abbr) this.shortOptions[opt.abbr] = opt;
    if(opt.full) this.longOptions[opt.full] = opt;
};

ArgParser.prototype.getOptValue=function(opt,value){
    if(value==null||value==undefined) return opt.defaultValue;
    var handle=this.typeHandles[opt.type+"Handle"];
    if(handle){
        value=handle(value,opt);
    }
    return value;
//    switch (opt.type){
//        case "string":
//            return value.toString();
//        case "number":
//            return value*1;
//        case "boolean":
//            return typeof value=="string"? (value=="false"?false:true):value;
//        default :
//            return value;
//    }
};

ArgParser.prototype.parse=function(args) {
    var cmds = [],
        opts = {},
        opt,
        arg,argName,argItems;
    while (args.length) {
        arg = args.shift();
        if (arg.indexOf('--') == 0) {
            argItems = arg.split('=');
            opt= this.longOptions[argItems[0].substr(2)];
            if (opt) {
                opts[opt.name] =this.getOptValue(opt,argItems[1]);
            }
            else {
                throw new Error('Unknown option "' + argItems[0] + '"');
            }
        }
        else if (arg.indexOf('-') == 0) {
            opt= this.shortOptions[arg.substr(1)];
            if (opt) {
                opts[opt.name] = this.getOptValue(opt,(!args[0] || (args[0].indexOf('-') == 0)) ? null : args.shift());
            }
            else {
                throw new Error('Unknown option "' + arg + '"');
            }
        }
        else {
            cmds.push(arg);
        }
    }
    this.cmds = cmds;
    this.opts = opts;
    return {opts:opts,cmds:cmds,options:opts};
};

ArgParser.prototype.getDefaultArgs=function(){
    return process.argv.slice(2);
};

ArgParser.prototype.typeHandles={
    numberHandle:function(v){
        return v*1;
    },
    stringHandle:function(v){
        return v.toString();
    },
    booleanHandle:function(v){
        return typeof v=="string"? (v=="false"?false:true):v;
    }
};

//===========for usage=============//

ArgParser.prototype.createUsageOptions=function(){
    var showed={};
    var out="Options:\n";
    var option;

    var descriptionStart=this.getMaxOptionCmdDisplayLength()+this._optionDisplayStartColumn+this._betweenCmdAndDescriptionDisplayColumn;//two cmd pre space,two descrition pre space
    //check short
    for(var key in this.shortOptions){
        option=this.shortOptions[key];
        out+=this.formatOptionOut(option,descriptionStart,this._optionDisplayStartColumn);
        showed[option.name]=true;
    }

    //check long
    for(var key in this.longOptions){
        option=this.longOptions[key];
        if(!showed[option.name]){
            out+=this.formatOptionOut(option,descriptionStart,this._optionDisplayStartColumn);
            showed[option.name]=true;
        }
    }
    return out;
};

ArgParser.prototype.formatOptionOut=function(option,descriptionStart,cmdStart){
    var out=ArgParser.repeat(" ",cmdStart);
    if(option.abbr){
        out+="-"+option.abbr;
    }
    if(option.full){
        if(option.abbr){
            out+=","+ArgParser.repeat(" ",this._betweenShortAndLongDisplayColumn);
        }
        out+="--"+option.full;
    }
    out+=ArgParser.repeat(" ",descriptionStart-out.length+1);

    out+=option.description||"";
    out+="\n";

    return out;
};


//get max cmd out length
ArgParser.prototype.getMaxOptionCmdDisplayLength=function(){
    var showed={};
    var maxLength=0;
    var option;
    var len=0;
    //check short
    for(var key in this.shortOptions){
        option=this.shortOptions[key];
        len=this.getOptionCmdDisplayLength(option);
        maxLength=maxLength<len?len:maxLength;
        showed[option.name]=true;
    }

    //check long
    for(var key in this.longOptions){
        option=this.longOptions[key];
        if(!showed[option.name]){
            len=this.getOptionCmdDisplayLength(option);
            maxLength=maxLength<len?len:maxLength;
            showed[option.name]=true;
        }
    }
    return maxLength;
};

ArgParser.prototype.getOptionCmdDisplayLength=function(option){
    var len=0;
    if(option.abbr) len+=option.abbr.length+1;//cmd length+sign length
    if(option.full) len+=option.full.length+2+this._betweenShortAndLongDisplayColumn;//cmd length+sign length+seprat length(default 1 space)
    return len;
};

ArgParser.parse=function(options){
    var argParser = new ArgParser();
    argParser.setOpts(options);
    var ret=argParser.parse(argParser.getDefaultArgs());
    ret.usage=argParser.createUsageOptions();
    return ret;
};

ArgParser.repeat=function(c,len){
   return new Array(len+1).join(c);
};

//=====test====//
//
//var args=process.argv.slice(2);
//console.log(args);
//
//var opts= [
//    { full: 'directory'
//        , abbr: 'C'
//    }
//    , { full: 'jakefile'
//        , abbr: 'f'
//    }
//    , { full: 'tasks'
//        , abbr: 'T'
//    }
//    , { full: 'help'
//        , abbr: 'h'
//    }
//    , { full: 'version'
//        , abbr: 'V'
//    }         ,
//    { full: 'aaa'
//        , abbr: 'a'
//    }   ,
//    { full: 'b',
//      type:"number"
//    },
//    { full: 'dd',
//        abbr: 'd',
//        type:"boolean"
//    }
//];
//var argParser=new ArgParser();
//argParser.setOpts(opts);
//console.log(argParser.parse(args));