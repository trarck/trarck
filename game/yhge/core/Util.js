(function  () {
    yhge.util=yhge.util||{};

    //===============common===================//
    yhge.util.decToHex=function (n){
        return (n < 16 ? '0' : '') + n.toString(16);
    };

    yhge.util.isEmpty=function (v){
        if (v ==="" || v ===null || v===undefined) return true;
        if(v instanceof Array) return v.length==0;
        if(typeof v=='object'){
            for(var k in v){
                return false;
            }
            return true
        }
        return false;
    };

    yhge.util.deepEqual=function (a,b){
        var ret=false;
        if(typeof b!="undefined"){
            if(typeof b=="object"){
                for(var k in b){
                    if(!yhge.util.deepEqual(a[k],b[k])){
                        return false
                    }
                }
                ret=true;
            }else{
                ret=b==a;
            }
        }
        return ret;
    };

    //===============url===================//
    yhge.util.url={
        getUriParameters:function(uri){
            var parameters={};
            var data=this.parseUriString(uri);
            
            if(data.fragment){
                var fragmentParameters=this.parseUriParameter(data.fragment);
                for(var k in fragmentParameters){
                    parameters[k]=fragmentParameters[k];
                }
            }

            if(data.query){
                var queryParameters=this.parseUriParameter(data.query);
                for(var k in queryParameters){
                    parameters[k]=queryParameters[k];
                }
            }
            return parameters;
        },
        getQueryParameters:function(){
            var data=this.parseUriString(uri);
            return this.parseUriParameter(data.query);
        },
        getFragmentParameters:function(){
            var data=this.parseUriString(uri);
            return this.parseUriParameter(data.fragment);
        },
        parseUriString:function (str, checkOnly) {
            var reg = /^([^?#]*)\??([^#]*)\#?([^#]*)/i;
            var m = str.match(reg);
            var ret = null;
            if (m) {
                ret.query = m[2];
                ret.fragment = m[3];
            }
            return ret;
        },
        parseUriParameter:function (str) {
            var i;
            if (!str || typeof str !== 'string') {
                return null;
            }
            var list = str.split("&");

            var len = list.length;
            var ret = {};
            for (i = 0; i < len; i++) {
                var entry = list[i].split("=");
                ret[decodeURIComponent(entry[0])] = entry[1] ? decodeURIComponent(entry[1]) : ""
            }
            return ret;
        }
    };

    //===============color===================//
    yhge.util.color={
        colorToString:function (color){
            return color ?( color.a
                ?"rgba("+parseInt(color.r)+","+parseInt(color.g)+","+parseInt(color.b)+","+color.a+")"
                :"rgb("+parseInt(color.r)+","+parseInt(color.g)+","+parseInt(color.b)+")"
                ):"";
        },

        colorArrayToString:function (color){
            return color ?( color.a
                ?"rgba("+parseInt(color[0])+","+parseInt(color[1])+","+parseInt(color[2])+","+color[3]+")"
                :"rgb("+parseInt(color[0])+","+parseInt(color[1])+","+parseInt(color[2])+")"
                ):"";
        },

        stringToColor:function (colorString){
            if(typeof colorString!="string") return colorString;
            var color;
            if(colorString.charAt(0)=="#"){
                var r=colorString.substr(1,2);
                var g=colorString.substr(3,2);
                var b=colorString.substr(5,2);
                var a=colorString.substr(7,2);
                color={
                    r:parseInt(r,16),
                    g:parseInt(g,16),
                    b:parseInt(b,16)
                };
                if(a) color.a=parseInt(a,16);
            }else if(colorString.charAt(0)=="r"){
                var match=colorString.match(/rgba?\((\d*),(\d*),(\d*),?(\d*\.?\d*)\)/);
                color={
                    r:match[1],
                    g:match[2],
                    b:match[3],
                    a:match[4]
                };
            }else if(colorString.length==6)      {
                var r=colorString.substr(0,2);
                var g=colorString.substr(2,2);
                var b=colorString.substr(4,2);
                color={
                    r:parseInt(r,16),
                    g:parseInt(g,16),
                    b:parseInt(b,16)
                };
            }
            return color;
        }
    };

    //===============event===================//
    yhge.util.event={
        addEventListener:document.addEventListener ?
            function( elem, type, handle ) {
                if ( elem.addEventListener ) {
                    elem.addEventListener( type, handle, false );
                }
            } :
            function( elem, type, handle ) {
                if ( elem.attachEvent ) {
                    elem.attachEvent( "on" + type, handle );
                }
            },
        removeEventListener:document.removeEventListener ?
            function( elem, type, handle ) {
                if ( elem.removeEventListener ) {
                    elem.removeEventListener( type, handle, false );
                }
            } :
            function( elem, type, handle ) {
                if ( elem.detachEvent ) {
                    elem.detachEvent( "on" + type, handle );
                }
            },
        trigger:function(){

        }
    }
})();