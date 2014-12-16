var ls=eachLayers(app.activeDocument);
alert(ls.length);
var s="";
for(var i=0 ;i<ls.length;i++){
	s+=ls[i].name+";";
}

alert(s);

function eachLayers(layer){
	var ret=[];
	var artLayers=layer.artLayers;

	for(var i=0;i<artLayers.length;i++){
		ret.push(artLayers[i]);
	}

	var layerSets=layer.layerSets;

	for(var i=0;i<layerSets.length;++i){
		ret=ret.concat(eachLayers(layerSets[i]));
	}

	return ret;
}