/**
 * Created with JetBrains WebStorm.
 * User: trarck
 * Date: 12-7-7
 * Time: 下午12:14
 * To change this template use File | Settings | File Templates.
 */

var ArgParser=exports.ArgParser=function(){
    this.shortOpts = {};
    this.longOpts = {};
};

ArgParser.prototype.setLongOpts=function(longOpts){
    this.longOpts=longOpts;
};
ArgParser.prototype.getLongOpts=function(longOpts){
    return this.longOpts;
};

ArgParser.prototype.setShortOpts=function(shortOpts){
    this.shortOpts=shortOpts;
};
ArgParser.prototype.getShortOpts=function(shortOpts){
    return this.shortOpts;
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
    this.shortOpts = {};
    this.longOpts = {};

    var item;
    for (var i = 0, ii = opts.length; i < ii; i++) {
        item = opts[i];
        if(item.abbr) this.shortOpts[item.abbr] = item;
        if(item.full) this.longOpts[item.full] = item;
    }
};

ArgParser.prototype.addOpt=function(opt){
    if(opt.abbr) this.shortOpts[opt.abbr] = opt;
    if(opt.full) this.longOpts[opt.full] = opt;
};

ArgParser.prototype.getOptValue=function(opt,value){
    if(value==null||value==undefined) return opt.default;
    var handle=this.typeHandles[opt.type];
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
            opt= this.longOpts[argItems[0].substr(2)];
            if (opt) {
                opts[opt.full] =this.getOptValue(opt,argItems[1]);
            }
            else {
                throw new Error('Unknown option "' + argItems[0] + '"');
            }
        }
        else if (arg.indexOf('-') == 0) {
            opt= this.shortOpts[arg.substr(1)];
            if (opt) {
                opts[opt.full] = this.getOptValue(opt,(!args[0] || (args[0].indexOf('-') == 0)) ? null : args.shift());
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
    return {opts:opts,cmds:cmds};
};

ArgParser.prototype.typeHandles={
    number:function(v){
        return v*1;
    },
    string:function(v){
        return v.toString();
    },
    boolean:function(v){
        return typeof v=="string"? (v=="false"?false:true):v;
    }
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