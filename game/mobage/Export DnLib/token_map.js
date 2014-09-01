/**
 * Created by JetBrains WebStorm.
 * User: yang
 * Date: 12-5-27
 * Time: 上午7:39
 * To change this template use File | Settings | File Templates.
 */
exports.data={
    //before 1.6
    "v1":{
        headBegin:"$MODULE_FACTORY_REGISTRY['",
        headEnd:"']",
        contentBegin:"= exports; ",
        contentEnd:"; return exports;};"
    },
    //1.6 or later
    "v2":{
        headBegin:"$MODULE_FACTORY_REGISTRY['",
        headEnd:"']",
        contentBegin:"= exports;",
        contentEnd:"; return exports;};",
        requireMapBegin:"$APP_REQUIREPATHMAP = {",
        requireMapEnd:"};"
    },
    //1.6 or later with compress
    "v3":{
        headBegin:'$MODULE_FACTORY_REGISTRY["',
        headEnd:'"]',
        specTokenBegin:']=',
        specTokenEnd:";",
        contentEndBegin:"return ",
        contentEndEnd:"};",
        requireMapBegin:"$APP_REQUIREPATHMAP={",
        requireMapEnd:"};"
    },
    "v4":{
        headBegin:'$MODULE_FACTORY_REGISTRY["',
        headEnd:'"]',
        specTokenBegin:'] = ',
        specTokenEnd:";",
        contentEndBegin:"return ",
        contentEndEnd:"\n};",
        requireMapBegin:"$APP_REQUIREPATHMAP = {",
        requireMapEnd:"};"
    },
    "compress":{

    }
};
