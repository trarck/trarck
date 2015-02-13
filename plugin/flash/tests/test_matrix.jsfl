var doc=fl.getDocumentDOM();
var lib=doc.library;

var currentFolder=getFolder(fl.scriptURI);
fl.runScript(currentFolder+"/show_timeline.jsfl"); 

var timeline=fl.getDocumentDOM().getTimeline();

var mat={ a: 1,
  b: 0.9999999999999999,
  c: -0.5773502691896257,
  d: 1,
  tx: 0,
  ty: 0 };

var sel = fl.getDocumentDOM().selection[0];

//sel.matrix=mat;
//sel.skewX=30;

showTimelineDelta(fl.getDocumentDOM().getTimeline());

function getFolder(file){
	var dotPos=file.lastIndexOf("/");
	return file.substr(0,dotPos);
}

function degreesToRadians(angle) {
	return angle / 180.0 * Math.PI;
}

function radiansToDegrees(radians) {
	return radians * (180.0 / Math.PI);
}

function showTimelineDelta(timeline){

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
    var lastElement=null;
    var currentElement=null;

    for(var f in layer.frames){
      var frame=layer.frames[f];

      if(lastFrame==frame)
        continue;

      lastElement=currentElement;

      var frameInfo="frame:"+f+","
          +"duration:"+frame.duration+","
          +"labelType:"+frame.labelType+","
          +"elementsCount:"+frame.elements.length+","
          +"isMotionObject:"+(frame.isMotionObject()?"true":"false")+","
          +"tweenType:"+frame.tweenType+","
          +"\n";
      fl.trace(frameInfo);

      var lastE="";
      for(var e in frame.elements){
        var element=frame.elements[e];

        if(lastE==element){
          continue;
        }
        lastE=element;

        var transformationPoint=element.getTransformationPoint();
        var matrix=element.matrix;

        var elementInfo="name:"+element.name+","
            +"deep:"+element.depth+","
            +"elementType:"+element.elementType+","
            +"width:"+element.width+","
            +"height:"+element.height+","
            +"scaleX:"+element.scaleX+","
            +"scaleY:"+element.scaleY+","
            +"rotation:"+element.rotation+","
            +"skewX:"+element.skewX+","
            +"skewY:"+element.skewY+","
            +"x:"+element.x+","
            +"y:"+element.y+","
            +"matrix:("+matrix.a+","+matrix.b+","+matrix.c+","+matrix.d+","+matrix.tx+","+matrix.ty+"),"
            +"\n";

        fl.trace(elementInfo);

        currentElement=element;
      }

      if(lastElement){
        var deltaString="delta:name:"+currentElement.name+","
            +"scaleX:"+(currentElement.scaleX-lastElement.scaleX)+","
            +"scaleY:"+(currentElement.scaleY-lastElement.scaleY)+","
            +"skewX:"+(currentElement.skewX-lastElement.skewX)+","
            +"skewY:"+(currentElement.skewY-lastElement.skewY)+","
            +"rotation:"+(currentElement.rotation-lastElement.rotation)+",";
        fl.trace(deltaString);
      }
    }
  }

}