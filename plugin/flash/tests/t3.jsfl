var doc=fl.getDocumentDOM();
var lib=doc.library;

var longestLayer = fl.getDocumentDOM().getTimeline().frameCount;
fl.trace("The longest layer has" + longestLayer + "frames");
showTimeline(fl.getDocumentDOM().getTimeline());
//var testItemIndex=lib.findItemIndex("animations/idle");

//if(testItemIndex==""){
//    fl.trace("no item");
//}else{
//    var testItem=lib.items[testItemIndex];
//   var fc=testItem.timeline.frameCount;
//   fl.trace("frame count="+fc);
//
//	showTimeline(testItem.timeline);
// }


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
		var lastFrame="";

		for(var f in layer.frames){
			var frame=layer.frames[f];

			if(lastFrame==frame)
				continue;

			lastFrame=frame;

			var frameInfo="frame:"+f+","
						+"duration:"+frame.duration+","
						+"labelType:"+frame.labelType+","
						+"elementsCount:"+frame.elements.length+","	
						+"isMotion:"+(frame.isMotionObject()?"true":"false")+","
						+"tweenType:"+frame.tweenType+","	
					    +"\n";
			fl.trace(frameInfo);

			var lastE="";
			for(var e in frame.elements){
				var element=frame.elements[e];

				if(lastE==e){
					continue;
				}

				lastE=e;

				var transformationPoint=element.getTransformationPoint();
				var matrix=element.matrix;
				var elementInfo="name:"+element.name+","
						+"deep:"+element.depth+","
						+"elementType:"+element.elementType+","
						+"transformationPoint:("+transformationPoint.x+","+transformationPoint.y+"),"	
						+"matrix:("+matrix.a+","+matrix.b+","+matrix.c+","+matrix.d+","+matrix.tx+","+matrix.ty+"),"	
						+"x:"+element.x+","
						+"y:"+element.y+","
						+"rotation:"+element.rotation+","
						+"scaleX:"+element.scaleX+","
						+"scaleY:"+element.scaleY+","
						+"skewX:"+element.skewX+","
						+"skewY:"+element.skewY+","
						+"transformX:"+element.transformX+","
						+"transformY:"+element.transformY+","
					    +"\n";

				fl.trace(elementInfo);
			}
		}
	}

}