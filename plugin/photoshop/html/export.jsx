 
 visitorLayers(app.activeDocument);
 
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
    $.writeln(s);
}

function showLayerSetInfo(layerObj){
    var s="name:"+layerObj.name+"\n";
    s+="typename:"+layerObj.typename;    
    $.writeln(s);
}