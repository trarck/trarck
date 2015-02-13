var doc=fl.getDocumentDOM();
var lib=doc.library;

var currentFolder=getFolder(fl.scriptURI);
fl.runScript(currentFolder+"/show_timeline.jsfl"); 

var timeline=fl.getDocumentDOM().getTimeline();


lib.addNewItem("folder","testt")

var firstLayer=timeline.layers[0];
//firstLayer.name="test"

//timeline.addNewLayer("test2");

//timeline.insertKeyframe();
//lib.selectItem("bones/LArm");
//lib.addItemToDocument({x:0,y:0});

//addBoneToFrame(timeline,1,0,"bones/LArm");

//addKeyFrame(timeline,1,10,200);
//createMotionTween(timeline,1,0,10);

function addBoneToFrame(timeline,layer,frame,boneName){
    
    lib.selectItem(boneName);

    timeline.currentLayer=layer;
    timeline.currentFrame=frame;
    fl.trace(layer+","+frame+","+timeline.layers[layer].frameCount);
//    if(timeline.layers[layer].frameCount>0){
//        timeline.clearFrames(frame);
//    }else{
//        timeline.convertToBlankKeyframes(frame);
//    } 
    
    lib.addItemToDocument({x:0,y:0});
}

function addKeyFrame(timeline,layer,frame,alpha,matrix){
    timeline.currentLayer=layer;
    timeline.insertKeyframe(frame);

    timeline.currentFrame=frame;

    setElementProperty(timeline,layer,frame,alpha,matrix);
}

function convertBlankKeyFrame(timeline,iLayer, iFrame)
{	
	timeline.currentLayer = iLayer;
	timeline.currentFrame = iFrame;
    timeline.convertToBlankKeyframes(iFrame,iFrame+1);
}

function setElementProperty(timeline,layer, frame, alpha, matrix)
{	
    if(matrix){

	    timeline.layers[layer].frames[frame].elements[0].matrix = mat;
        doc.selection = timeline.layers[iLayer].frames[iFrame].elements;
	    doc.setTransformationPoint({x:0, y:0});
    }

    if(typeof(alpha)!="undefined"){
	    doc.setInstanceAlpha(alpha);	
    }
}

function createMotionTween(timeline,layer, startFrame,endFrame){
//    timeline.currentLayer = layer;
//	timeline.currentFrame = layer;
    timeline.createMotionTween(startFrame,endFrame);
}

function getFolder(file){
	var dotPos=file.lastIndexOf("/");
	return file.substr(0,dotPos);
}