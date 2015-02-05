var doc=fl.getDocumentDOM();
var lib=doc.library;

var longestLayer = fl.getDocumentDOM().getTimeline().frameCount;
fl.trace("The longest layer has" + longestLayer + "frames");

var testItemIndex=lib.findItemIndex("animations/idle");

if(testItemIndex==""){
    fl.trace("no item");
}else{
    var testItem=lib.items[testItemIndex];
   var fc=testItem.timeline.frameCount;
   fl.trace("frame count="+fc);

	showTimeline(testItem.timeline);
 }


function showTimeline(timeline){
    
	var info="=============timeline===================\n"
		    +"currentFrame:"+ timeline.currentFrame+"\n"
		    +"currentLayer:"+timeline.currentLayer+"\n"
		    +"frameCount:"+timeline.frameCount+"\n"
		    +"layerCount:"+timeline.layerCount+"\n"
			+"name:"+timeline.name+"\n"
			+"=======================================\n";
	fl.trace(info);

	//show layers
	for(var i in timeline.layers){
		var layer=timeline.layers[i];
		fl.trace("frame count:"+layer.frameCount);
		for(var f in layer.frames){
			var frame=layer.frames[f];

			var frameInfo="duration:"+frame.duration+","
						+"labelType:"+frame.labelType+","
						+"elementsCount:"+frame.elements.length+","	
					    +"\n";
			fl.trace(frameInfo);

			for(var e in frame.elements){
				var element=frame.elements[e];
				var transformationPoint=element.getTransformationPoint();
				var matrix=element.matrix;
				var elementInfo="name:"+element.name+","
						+"deep:"+element.depth+","
						+"elementType:"+element.elementType+","
						+"transformationPoint:("+transformationPoint.x+","+transformationPoint.y+"),"	
						+"matrix:("+matrix.a+","+matrix.b+","+matrix.c+","+matrix.d+","+matrix.tx+","+matrix.ty+"),"	
						+"x:"+element.x+","
						+"y:"+element.y+","
						+"transformX:"+element.transformX+","
						+"transformY:"+element.transformY+","
					    +"\n";

				fl.trace(elementInfo);
			}
		}
	}

}