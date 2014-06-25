//初始化选项
var rdashAlpha = /_([a-z])/ig;
var insertNewLine = false; //在各个项目之间插入空行.
var tab="    ";
//程序开始.
var input = "";

var col=0;
var prePad="";

//todo 前导空格
var output="";

var env = process.env || process.ENV;

process.stdin.resume();

//console.log(env)

process.stdin.on( 'data', function ( chunk ) {
    input += chunk;
});

process.stdin.on( 'end', function () {
    col=env.TM_INPUT_START_COLUMN-1;
    prePad=pad(col," ");
    output=synthesizePropertys(input.split(","));
    process.stdout.write(output);
});

function fcamelCase( all, letter ) {
    return letter.toUpperCase();
}

function camelCase( string ) {
    return string.replace( rdashAlpha, fcamelCase );
}

function ucfirst (str) {
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}

function registerAccessors(propName, getterFn, setterFn) {
    var out="",caseAdjusted=ucfirst(propName);
    
    if(setterFn) {
        out+='set'+caseAdjusted+":"+setterFn+",\n"+prePad;
    }
    if(getterFn) {
        out+='get'+caseAdjusted+":"+getterFn+",\n"+prePad;;
    }
    return out;
}

function synthesizeProperty(propName, CommandsFn) {
    propName=camelCase(propName);
    var lVarName = '_' + propName;
    var setterFn;
    if (CommandsFn) {
        // Optional args are still passed through, even though only the first arg is assigned.
        setterFn = "function("+propName+") {\n"+prePad+tab+"this."+lVarName+" = "+propName+";\n"+prePad+""+CommandsFn+".apply(this, arguments);\n"+prePad+tab+"return this;\n"+prePad+"}"
    } else {
        setterFn = "function("+propName+") {\n"+prePad+tab+"this."+lVarName+" = "+propName+";\n"+prePad+tab+"return this;\n"+prePad+"}"
    }
    return registerAccessors(propName, "function() {\n"+prePad+tab+"return this."+lVarName+";\n"+prePad+"}" , setterFn);
}

function synthesizePropertys(props) {
    var out="";
    for(var i=0,l=props.length;i<l && props[i];i++) {
        out+=synthesizeProperty(props[i]);
    }
    return out;
}

function pad (len,c) {
    var s="";
    for(var i=0;i<len;i++) s+=c;
    return s;
}