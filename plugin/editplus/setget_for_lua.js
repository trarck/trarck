//初始化选项
var rdashAlpha = /_([a-z])/ig;
var insertNewLine = false; //在各个项目之间插入空行.
var tab="    ";
var DefaultType="int";
//成员变量的前导字符
var ClassMemberVarPrefix="_";
//程序开始.
var input = "";

var col=0;
var prePad="";

//todo 前导空格
var output="";


var env = process.env || process.ENV;

process.stdin.resume();

// console.log(env)

//parseInput("t@tt,ee",4)

process.stdin.on( 'data', function ( chunk ) {
    input += chunk;
});

process.stdin.on( 'end', function () {
    col=env.TM_INPUT_START_COLUMN-1;

    parseInput(input,col)
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

function parseInput(input,col){
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
}

function synthesizePropertyField(propName) {
    var lVarName =ClassMemberVarPrefix+ propName;
    return prePad+"self."+lVarName+"=nil\n";
}

function synthesizePropertyContent(propName,cls) {
   
	var caseAdjusted=ucfirst(propName);
	var lVarName = "self."+ClassMemberVarPrefix+ propName;
	
	var preCls=(cls?cls+":":"");

    var setter ="function "+preCls+"set"+caseAdjusted+"("+propName+")\n";

	setter+= tab+lVarName+" = "+propName+"\n";
	
	setter+="end\n";

	var getter="function "+preCls+"get"+caseAdjusted+"()\n"
	          + tab+"return "+lVarName+"\n"
	          +"end\n";
	
    return setter+"\n"+getter+"\n";
}

function synthesizePropertys(props,cls) {
    var filedOut="",contentOut="";

	var propParts,propName;
	

    for(var i=0,l=props.length;i<l && props[i];i++) {
		propParts=props[i].split(/\s+/);
		
		if(propParts.length==1){
			propName=propParts[0];
		}else{
			propName=propParts[propParts.length-1];
		}
	
		propName=camelCase(lcfirst(propName));

        filedOut+=synthesizePropertyField(propName);
		contentOut+=synthesizePropertyContent(propName,cls);
    }
    return  filedOut
		   +"\n\n\n"
            +contentOut;
}
function pad (len,c) {
    var s="";
    for(var i=0;i<len;i++) s+=c;
    return s;
}