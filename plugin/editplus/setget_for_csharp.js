//初始化选项
var rdashAlpha = /_([a-z])/ig;
var insertNewLine = false; //在各个项目之间插入空行.
var tab="    ";
var DefaultType="int";
//程序开始.
var input = "";

var col=0;
var prePad="";
var AccessLevel="";

//todo 前导空格
var output="";

var env = process.env || process.ENV;

process.stdin.setEncoding('utf8');

// console.log(env)

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
	if (chunk !== null) {
		input += chunk;
	}
});

process.stdin.on( 'end', function () {
    col=env.TM_INPUT_START_COLUMN-1;

    prePad=pad(col," ");

    if(input.indexOf("@")>-1)
    {
        var pos=input.indexOf("@");
        var posEnd=input.indexOf("@",pos+1);

        AccessLevel = input.substring(pos+1,posEnd)+" ";

        var prev=input.substring(0,pos);
        var next=input.substring(posEnd+1);

        input=prev+next;
    }

    var items=[];

    if(input.indexOf(";")>-1){
        items=input.split(";");
    }else{
        items=input.split(",");
    }

    output=synthesizePropertys(items);
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

function synthesizePropertyField(propName,type,initValue) {
    var caseAdjusted=ucfirst(propName);
    var lVarName = 'm_' + caseAdjusted;
    return prePad+AccessLevel+type+" "+lVarName+ (initValue? (" = "+initValue):"")+";\n";
}

function synthesizePropertyContent(propName,type) {
   
	var caseAdjusted=ucfirst(propName);
	var lVarName = 'm_' + caseAdjusted;
    
    var setter =tab+"set\n"
                +tab+"{\n"
                +tab+tab+lVarName+" = value;\n"
                +tab+"}\n";
	
	var getter=tab+"get\n"
               +tab+"{\n"
               +tab+tab+"return "+lVarName+";\n"
               +tab+"}\n";
	//bool type use IsXXX;
	if(type=="bool"){
		propName="Is"+propName;
	}
	
    return "public "+type+" "+propName+"\n{\n"
                +setter+"\n"
                +getter
            +"}\n\n";
}

function synthesizePropertys(props) {
    var funOut="",filedOut="",contentOut="";

    
    var item;
	var propParts,type,propName;
	var initValue;

    for(var i=0,l=props.length;i<l && props[i];i++) {
        item=trim(props[i]);

        //检查是否有定义赋值
        if(item.indexOf("=")>-1){
            propParts=item.split("=");
            initValue = propParts[1];
            item= trim(propParts[0]);
        }else{
            initValue="";
        }

		propParts=item.split(/\s+/);
		
		if(propParts.length==1){
			type=DefaultType;
			propName=propParts[0];
		}else{
			type=propParts.slice(0,propParts.length-1).join(" ");
			propName=propParts[propParts.length-1];
		}
	
		propName=camelCase(ucfirst(propName));
		
		filedOut+=synthesizePropertyField(propName,type,initValue)+"\n";
		contentOut+=synthesizePropertyContent(propName,type);
    }
    return filedOut
		   +"\n\n\n"
           +"//==========================generate auto==============================//\n"
		   +contentOut;
}


function pad (len,c) {
    var s="";
    for(var i=0;i<len;i++) s+=c;
    return s;
}

function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
}