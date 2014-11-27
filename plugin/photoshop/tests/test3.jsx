// this script attempts to fit the active layer into an area defined by a 4-point-path’s points;  
// cs5 on mac;  
// 2011, use it at your own risk;  
#target photoshop  
// from adobe’s terminology.jsx;  
const classChannel = app.charIDToTypeID('Chnl');  
const classRectangle = app.charIDToTypeID('Rctn');  
const enumNone = app.charIDToTypeID('None');  
const eventSet = app.charIDToTypeID('setd');  
const eventTransform = app.charIDToTypeID('Trnf');  
const keySelection = app.charIDToTypeID('fsel');  
const krectangleStr = app.stringIDToTypeID("rectangle");  
const kquadrilateralStr = app.stringIDToTypeID("quadrilateral");  
const keyBottom = app.charIDToTypeID('Btom');  
const keyLeft = app.charIDToTypeID('Left');  
const keyNull = app.charIDToTypeID('null');  
const keyRight = app.charIDToTypeID('Rght');  
const keyTo = app.charIDToTypeID('T   ');  
const keyTop = app.charIDToTypeID('Top ');  
const typeOrdinal = app.charIDToTypeID('Ordn');  
const unitPixels = app.charIDToTypeID('#Pxl');  
// from adobe’s geometry.jsx;  
//  
// =================================== TPoint ===================================  
//  
function TPoint( x, y )  
{  
     this.fX = x;  
     this.fY = y;  
}  
// TPoint Constants  
const kTPointOrigion = new TPoint( 0, 0 );  
TPoint.kOrigin = kTPointOrigion;  
  
const kTPointInfinite = new TPoint( Infinity, Infinity );  
TPoint.kInfinite = kTPointInfinite;  
const kTPointClassname = "TPoint";  
TPoint.prototype.className = kTPointClassname;  
// Overloaded math operators  
TPoint.prototype["=="] = function( Src )  
{  
     return (this.fX == Src.fX) && (this.fY == Src.fY);  
}  
  
TPoint.prototype["+"] = function( b )  
{  
     return new TPoint( this.fX + b.fX, this.fY + b.fY );  
}  
  
TPoint.prototype["-"] = function( b, reversed )  
{  
     if (typeof(b) == "undefined")            
// unary minus  
          return new TPoint( -this.fX, -this.fY )  
     else  
     {  
          if (reversed)  
               return new TPoint( b.fX - this.fX, by.fY - this.fY );  
          else  
               return new TPoint( this.fX - b.fX, this.fY - b.fY);  
     }  
}  
//  
// Multiply and divide work with scalars as well as points  
//  
TPoint.prototype["*"] = function( b )  
{  
    if (typeof(b) == 'number')  
          return new TPoint( this.fX * b, this.fY * b );  
     else  
          return new TPoint( this.fX * b.fX, this.fY * b.fY );  
}  
TPoint.prototype["/"] = function( b, reversed )  
{  
     if (reversed)  
     {  
          if (typeof(b) == "number")  
               debugger;  
// Can't divide a number by a point  
          else  
               return new TPoint( b.fX / this.fX, b.fY / this.fY );  
     }  
     else  
     {  
          if (typeof(b) == 'number')  
               return new TPoint( this.fX / b, this.fY / b );  
          else  
               return new TPoint( this.fX / b.fX, this.fY / b.fY );  
     }  
}  
TPoint.prototype.toString = function()  
{  
     return "[" + this.fX.toString() + "," + this.fY.toString() + "]";  
}  
TPoint.prototype.vectorLength = function()  
{  
    return Math.sqrt( this.fX * this.fX + this.fY * this.fY );  
}  
////////////////////////////////////  
var myDocument = app.activeDocument;  
// deselect;  
try {  
myDocument.selection.deselect();  
// =======================================================  
var idDslc = charIDToTypeID( "Dslc" );  
    var desc4 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref2 = new ActionReference();  
        var idPath = charIDToTypeID( "Path" );  
        ref2.putClass( idPath );  
    desc4.putReference( idnull, ref2 );  
executeAction( idDslc, desc4, DialogModes.NO );  
}   
catch (e) {};  
// switch units to pixels;  
app.preferences.rulerUnits = Units.PIXELS;  
// verify document has paths;  
var thePathList = new Array;  
// create list of possible paths;  
for (var g = 0; g < myDocument.pathItems.length; g++) {  
     var checkPath = myDocument.pathItems[g];  
     if (checkPath.subPathItems.length == 1 && checkPath.subPathItems[0].pathPoints.length == 4) {                      
          thePathList.push(checkPath);  
          }  
     };  
// get path;  
switch (thePathList.length) {  
     case 0:  
     break;  
     case 1:  
     var aPath = thePathList[0];  
     break;  
     default:  
     var aPath = selectAPath (thePathList);  
     break;  
     };  
//////////// transformation ////////////  
if (aPath) {  
try {  
// paste the image into the document;  
var theScreenImage = myDocument.activeLayer;  
//////////// corners ////////////  
// get the horicontal and vertical coordinates in pixels;  
var hor1 = Number(aPath.subPathItems[0].pathPoints[0].anchor[0]);  
var hor2 = Number(aPath.subPathItems[0].pathPoints[1].anchor[0]);  
var hor3 = Number(aPath.subPathItems[0].pathPoints[2].anchor[0]);  
var hor4 = Number(aPath.subPathItems[0].pathPoints[3].anchor[0]);  
var ver1 = Number(aPath.subPathItems[0].pathPoints[0].anchor[1]);  
var ver2 = Number(aPath.subPathItems[0].pathPoints[1].anchor[1]);  
var ver3 = Number(aPath.subPathItems[0].pathPoints[2].anchor[1]);  
var ver4 = Number(aPath.subPathItems[0].pathPoints[3].anchor[1]);  
// order the horicontal and vertical coordinates;  
var horList = [hor1, hor2, hor3, hor4];  
var verList = [ver1, ver2, ver3, ver4];  
horList.sort(sortNumber);  
verList.sort(sortNumber);  
// check the horicontal value;  
var leftPoints = new Array;  
var rightPoints = new Array;  
for (var k=0; k<aPath.subPathItems[0].pathPoints.length; k++) {  
     if (aPath.subPathItems[0].pathPoints[k].anchor[0] == horList[0]   
     ||  aPath.subPathItems[0].pathPoints[k].anchor[0] == horList[1]) {  
          leftPoints = leftPoints.concat(aPath.subPathItems[0].pathPoints[k].anchor)  
          }  
     else {  
          rightPoints = rightPoints.concat(aPath.subPathItems[0].pathPoints[k].anchor)  
          }  
     };  
// define the four cornerpoints;  
if (leftPoints[1] <= leftPoints[3]) {  
     var aTopLeft = [leftPoints[0], leftPoints[1]]  
     var aBottomLeft = [leftPoints[2], leftPoints[3]];  
     }  
else {  
     var aTopLeft = [leftPoints[2], leftPoints[3]]  
     var aBottomLeft = [leftPoints[0], leftPoints[1]];  
     };  
if (rightPoints[1] <= rightPoints[3]) {  
     var aTopRight = [rightPoints[0], rightPoints[1]]  
     var aBottomRight = [rightPoints[2], rightPoints[3]];  
     }  
else {  
     var aTopRight = [rightPoints[2], rightPoints[3]]  
     var aBottomRight = [rightPoints[0], rightPoints[1]];  
     }  
//////////// transform to the new corners ////////////  
transformActiveLayer( [new TPoint(aTopLeft[0], aTopLeft[1]), new TPoint(aTopRight[0], aTopRight[1]), new TPoint(aBottomRight[0], aBottomRight[1]), new TPoint(aBottomLeft[0], aBottomLeft[1])]);  
// resets the preferences units;  
app.preferences.rulerUnits = originalUnits;  
}  
catch (e) {}  
};  
////////////////////////////////////  
////////////////////////////////////  
////////////////////////////////////  
//////////// the  functions ////////////  
// the dialog for multiple possible paths;  
function selectAPath (thePathList) {  
     var dlg = new Window('dialog', "Select a path to use for the perspective", [500,300,800,400])            
     dlg.pathSel = dlg.add('dropdownlist', [12,13,288,35]);  
     for (var m = 0; m < thePathList.length; m++) {  
          dlg.pathSel.add("item", thePathList[m].name)  
          };  
     dlg.pathSel.selection = dlg.pathSel[0];  
     dlg.pathSel.active = true;  
     dlg.buildBtn = dlg.add('button', [13,42,145,62], 'OK', {name:'ok'});  
     dlg.cancelBtn = dlg.add('button', [155,42,288,62], 'Cancel', {name:'cancel'});  
     var myReturn = dlg.show ();  
     if (myReturn == true) {  
          var aPath = app.activeDocument.pathItems.getByName(dlg.pathSel.selection);  
          return aPath  
          }  
     };  
// sort numbers, found at www.w3schools.com;  
function sortNumber(a,b) {  
     return a - b;  
     };  
// from adobe’s stacksupport.jsx;  
// Apply a perspective transform to the current layer, with the  
// corner TPoints given in newCorners (starts at top left, in clockwise order)  
// Potential DOM fix  
function transformActiveLayer( newCorners )  
{  
     function pxToNumber( px )  
     {  
          return px.as("px");  
     }  
     var saveUnits = app.preferences.rulerUnits;  
     app.preferences.rulerUnits = Units.PIXELS;  
     var i;  
     var setArgs = new ActionDescriptor();  
     var chanArg = new ActionReference();  
     chanArg.putProperty( classChannel, keySelection );  
//     setArgs.putReference( keyNull, chanArg );  
     var boundsDesc = new ActionDescriptor();  
     var layerBounds = app.activeDocument.activeLayer.bounds;  
     boundsDesc.putUnitDouble( keyTop, unitPixels, pxToNumber( layerBounds[1] ) );  
     boundsDesc.putUnitDouble( keyLeft, unitPixels, pxToNumber( layerBounds[0] ) );  
     boundsDesc.putUnitDouble( keyRight, unitPixels, pxToNumber( layerBounds[2] ) );  
     boundsDesc.putUnitDouble( keyBottom, unitPixels, pxToNumber( layerBounds[3] ) );  
//     setArgs.putObject( keyTo, classRectangle, boundsDesc );  
//     executeAction( eventSet, setArgs );  
     var result = new ActionDescriptor();  
     var args = new ActionDescriptor();  
     var quadRect = new ActionList();  
     quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[0] ) );  
// ActionList put is different from ActionDescriptor put  
     quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[1] ) );  
     quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[2] ) );  
     quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[3] ) );       
     var quadCorners = new ActionList();  
     for (i = 0; i < 4; ++i)  
     {  
          quadCorners.putUnitDouble( unitPixels, newCorners[i].fX );  
          quadCorners.putUnitDouble( unitPixels, newCorners[i].fY );  
     }  
     args.putList( krectangleStr, quadRect );  
     args.putList( kquadrilateralStr, quadCorners );  
     executeAction( eventTransform, args );       
// Deselect  
     deselArgs = new ActionDescriptor();  
     deselRef = new ActionReference();  
     deselRef.putProperty( classChannel, keySelection );  
     deselArgs.putReference( keyNull, deselRef );  
     deselArgs.putEnumerated( keyTo, typeOrdinal, enumNone );  
     executeAction( eventSet, deselArgs );  
     app.preferences.rulerUnits = saveUnits;  
};  