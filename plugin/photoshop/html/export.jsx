 var g_YHLibsFolderPath="/j/project/trarckgit/plugin/photoshop/libs/";
 $.evalFile(g_YHLibsFolderPath + "yh/index.jsx");
 $.evalFile(g_YHLibsFolderPath + "ps/actions/ActionUtils.jsx");
// visitorLayers(app.activeDocument);

$.writeln(jc(0.2));
 //test();
 
 function jc(a) {
  return 0 * (1 - (a - -50) / 100) + 100 * ((a - -50) / 100);
}
 
function visitorLayers(obj){
     showObjInfo(obj);
    for( var i = 0; i < obj.artLayers.length; i++) {
          visitorArtLayer(obj.artLayers[i]);
    }     

    for( var i = 0; i < obj.layerSets.length; i++) {
        visitorLayerSet(obj.layerSets[i]);  // recursive call
    }
 }

function visitorArtLayer(artLayer){
    showArtLayerInfo (artLayer);
    visitorLinedLayers(artLayer);
}

function visitorLayerSet(layerSet){
    showLayerSetInfo (layerSet);
    for( var i = 0; i < layerSet.artLayers.length; i++) {
          visitorArtLayer(layerSet.artLayers[i]);
    }     

    for( var i = 0; i < layerSet.layerSets.length; i++) {
        visitorLayerSet(layerSet.layerSets[i]);
    }
    visitorLinedLayers(layerSet);
}

function visitorLinedLayers(obj){
    if(obj.linkedLayers && obj.linkedLayers.length){
        for( var i = 0; i < obj.linkedLayers.length; i++) {
            var layerObj=obj.linkedLayers[i];
            switch(layerObj.typename){
                    case "ArtLayer":
                        visitorArtLayer(layerObj);
                        break;
                    case "LayerSet":
                        visitorLayerSet(layerObj);
                        break;
            }
        }
    }
 }

function showObjInfo(obj){
    var s="name:"+obj.name+"\n";
    s+="typename:"+obj.typename;    
    $.writeln(s);
}

function showArtLayerInfo(layerObj){
    var s="name:"+layerObj.name+"\n";
    s+="kind:"+layerObj.kind+"\n";
    s+="linkedLayers:"+layerObj.linkedLayers.length+"\n";
    s+="typename:"+layerObj.typename;    
    var layerEffects  = layerObj.property("Effects");
    s+="effects:"+layerEffects.lenght;
    $.writeln(s);
}

function showLayerSetInfo(layerObj){
    var s="name:"+layerObj.name+"\n";
    s+="typename:"+layerObj.typename;    
    $.writeln(s);
}

function test(){
    showObjInfo(app.activeDocument.activeLayer);
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
    var a = executeActionGet(ref);
    $.writeln(a.count,a.typename);
    var data=ActionUtils.getDescriptorData(a);
   $.writeln(JSON.stringify(data,null,4));
    //var b=ActionUtils.getPSObjectPropertyChain(a,"layerEffects.solidFill.enabled",undefined,true);
    //$.writeln(b);
    /*
    for(var i=0;i<a.count;++i){
            $.writeln (typeIDToStringID(a.getKey(i)));
    }
    var layerEffects=a.getObjectValue(stringIDToTypeID("layerEffects"));
    */
    /*
    var innerGlow=layerEffects.getObjectValue(stringIDToTypeID("innerGlow"));
    var g=innerGlow.getObjectValue(stringIDToTypeID("color"));
    
     var n = g.getDouble(charIDToTypeID('Rd  ')),
            t = g.getDouble(charIDToTypeID('Grn ')),
            E = g.getDouble(charIDToTypeID('Bl  '));
   $.writeln ("r="+n+"g="+t+"b="+E );
   */
}