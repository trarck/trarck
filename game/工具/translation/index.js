/*
 translate flow

 en1    <-->                                     en2
 adds
 /          \
 {updates] |       diff -- updats -- increase              | [updates]
 \
 removes      | translate
 |
 zh1   ---- apply diff         |               -->zh2
 |                    |             /
 |                    |           /
 |                    |         /
 |                    |       /
 --->  zh1.5          |     /
 \       |   /
 \      | /
 merge increase
 */

var fs = require('fs');
var JsonUtil = require('./JsonUtil').JsonUtil;
var ArgParser = require('./ArgParser').ArgParser;

var opts = [
    {
        abbr:'src',
        description:"the path old json file"
    },
    {
        abbr:'dest',
        description:"the path new json file"
    },

    {
        abbr:'out',
        description:"the path for out put result file"
    },

    {
        full:'help',
        type:"boolean",
        defaultValue:true,
        description:"show this"
    }
];

var result = ArgParser.parse(opts);

var options = result.options;
var cmds = result.cmds;

//console.log(result);

if (options.help != null || cmds[0]=="help") {
    showUsage();
} else {
    if (options.src && options.dest) {

        switch (cmds[0]) {
            case "diff":
                createDiff();
                break;
            case "apply":
                applyDiff();
                break;
            case "increase":
                createIncrease();
                break;
            case "merge":
                mergeIncrease();
                break;
        }
    } else {
        showUsage();
    }

}


function showUsage() {
    var out = "Usage:node translation [options] [diff|apply|increase|merge|help]\n";
    console.log(out + "\n" + result.usage);
}

function createDiff() {
    var srcJson = JSON.parse(fs.readFileSync(options.src));
    var destJson = JSON.parse(fs.readFileSync(options.dest));

    var diff = JsonUtil.diff(srcJson, destJson);

    var diffOutFile = options.out || "en_diff.json";
    console.log("diff file to " + diffOutFile);
    fs.writeFileSync(diffOutFile, JSON.stringify(diff, null, 4));
}

function applyDiff() {
    var srcJson = JSON.parse(fs.readFileSync(options.src));
    var destJson = JSON.parse(fs.readFileSync(options.dest));

    var applyed = JsonUtil.applyDiff(srcJson, destJson);

    var applyedOutFile = options.out || "zh_apply.json";
    console.log("applyed file to " + applyedOutFile);
    fs.writeFileSync(applyedOutFile, JSON.stringify(applyed, null, 4));
}

function createIncrease() {

    var srcJson = JSON.parse(fs.readFileSync(options.src));
    var destJson = JSON.parse(fs.readFileSync(options.dest));

    var diff = JsonUtil.diff(srcJson, destJson);
    var increaseTranslationJson = JsonUtil.clone(diff.adds);
    var updates = diff.updates;
    for (var k in updates) {
        increaseTranslationJson[k] = updates[k].to;
    }
    var increaseOutFile = options.out || "en_increase.json";
    console.log("increase file to " + increaseOutFile);
    fs.writeFileSync(increaseOutFile, JSON.stringify(increaseTranslationJson, null, 4));
}

function mergeIncrease() {
    var srcJson = JSON.parse(fs.readFileSync(options.src));
    var destJson = JSON.parse(fs.readFileSync(options.dest));

    var applyed = JsonUtil.applyDiff(srcJson, destJson);

    var applyedOutFile = options.out || "zh_apply.json";
    console.log("applyed file to " + applyedOutFile);
    fs.writeFileSync(applyedOutFile, JSON.stringify(applyed, null, 4));
}