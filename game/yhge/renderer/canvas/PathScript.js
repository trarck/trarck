(function () {
    var PathScript=yhge.core.Class({
        overrides:{
            initialize:function(context){
                this._context=context;
            }
        },
        content:{
            pathRecordsToScript:function (records){
                var out="",endLine="\n",specFillStyles=[];
                var record,action;
                for(var i= 0,l=records.length;i<l;i++){
                    record=records[i];
                    action=record[0];
                    switch (action){
                        case "fillStyle":
                        case "strokeStyle":
                            var style=record[1];
                            if(typeof style=="object" && style.type){
                                console.log(style);
                                out+="ctx."+action+"="+action+specFillStyles.length+";"+endLine;
                                specFillStyles.push(style);
                            }else{
                                out+="ctx."+action+"="+JSON.stringify(style)+";"+endLine;
                            }
                            break;

                        case "moveTo":
                        case "lineTo":
                        case "arc":
                        case "quadraticCurveTo":
                        case "bezierCurveTo":
                        case "fill":
                        case "stroke":
                        case "clip":

                        case "beginPath":
                        case "closePath":
                        case "save":
                        case "restore":
                        //变换
                        case "translate":
                        case "rotate":
                        case "scale":
                        case "transform":
                        case "setTransform":
                        case "transform":
                            out+="ctx."+action+"(";
                            for(var j=1;j<record.length;j++){
                                out+=(j==1?"":",")+JSON.stringify(record[j]);
                            }
                            out+=");"+endLine;
                            break;
                    }
                }
                return out;
            }
        }
    });

    yhge.renderer.canvas.PathScript=PathScript;

})();