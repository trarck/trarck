#!/usr/bin/env node

//初始化选项
var rdashAlpha = /_([a-z])/ig;
var insertNewLine = false; //在各个项目之间插入空行.
var tab="    ";
var DefaultType="int";
//程序开始.
var input = "";

var col=0;
var prePad="";

//todo 前导空格
var output="";

var env = process.env || process.ENV;

process.stdin.resume();

// console.log(env)

process.stdin.on( 'data', function ( chunk ) {
    input += chunk;
});

process.stdin.on( 'end', function () {
    col=env.TM_INPUT_START_COLUMN-1;

    prePad=pad(col," ");
	
	var inputParts=input.split("@");
	
	var propInput="",cls="";
	
	if(inputParts.length==1){
		
		propInput=input;
		
	}else if(inputParts.length==2){
		
		cls=inputParts[0];
		propInput=inputParts[1];
		
	}

    output=synthesizePropertys(propInput.split(","),cls);
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

function lcfirst (str) {
    str += '';
    var f = str.charAt(0).toLowerCase();
    return f + str.substr(1);
}

function synthesizePropertyField(propName,type) {
    var lVarName = 'm_' + propName;
    return prePad+type+" "+lVarName+";\n";
}

function synthesizePropertyFunction(propName,type,firstLine) {
   
	var caseAdjusted=ucfirst(propName);

    var setter =(firstLine?"":prePad)+"virtual void set"+caseAdjusted+"("+type+" "+propName+");\n";

	var getter=prePad+"virtual "+type+" get"+caseAdjusted+"();\n";
	
    return setter+getter;
}

function synthesizePropertyContent(propName,type,cls) {
   
	var caseAdjusted=ucfirst(propName);
	var lVarName = 'm_' + propName;
	
	var preCls=(cls?cls+"::":"");

    var setter ="void "+preCls+"set"+caseAdjusted+"("+type+" "+propName+")\n{\n";
	if(type.indexOf("*")>-1){
		setter+=tab+"CC_SAFE_RETAIN("+propName+");\n"
			  +tab+"CC_SAFE_RELEASE("+lVarName+");\n";
	}
	setter+= tab+lVarName+" = "+propName+";\n";
	
	setter+="}\n";

	var getter=type+" "+preCls+"get"+caseAdjusted+"()\n{\n"
	          + tab+"return "+lVarName+";\n"
	          +"}\n";
	
    return setter+"\n"+getter+"\n";
}

function synthesizePropertys(props,cls) {
    var funOut="",filedOut="",contentOut="";

	var propParts,type,propName;
	

    for(var i=0,l=props.length;i<l && props[i];i++) {
		propParts=props[i].split(/\s+/);
		
		if(propParts.length==1){
			type=DefaultType;
			propName=propParts[0];
		}else{
			type=propParts.slice(0,propParts.length-1).join(" ");
			propName=propParts[propParts.length-1];
		}
	
		propName=camelCase(lcfirst(propName));
		
        funOut+=synthesizePropertyFunction(propName,type);
		filedOut+=synthesizePropertyField(propName,type);
		contentOut+=synthesizePropertyContent(propName,type,cls);
    }
    return "public:\n"
           +funOut
		   +"\n\n"
		   +prePad+"protected:\n"
		   +filedOut
		   +"\n\n\n"
		   +contentOut;
}
function pad (len,c) {
    var s="";
    for(var i=0;i<len;i++) s+=c;
    return s;
}