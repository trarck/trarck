//初始化选项
var rdashAlpha = /_([a-z])/ig;
var insertNewLine = false; //在各个项目之间插入空行.
//程序开始.
var input = "";
while (!WScript.StdIn.AtEndOfStream) {
	input += WScript.StdIn.ReadAll();
}
var col=WScript.arguments(0)-input.length-1;
var prePad=pad(col," ");
var tab="    ";
//todo 前导空格
var output=synthesizePropertys(input.split(","));
//var output = input.replace(/ {2,}|[\f\n\r\t\v]+/g, "");
//output = output.replace(/(\*\/|})/g, '$1\r\n');
//output = output.replace(/( )?(:|}|{|;)( )?/g, '$2');
//if (insertNewLine) output = output.replace(/(\*\/|})/g, '$1\r\n');
WScript.StdOut.Write(output);


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