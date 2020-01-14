// =======================================================
// ColorReaderRaw.jsx
//
// Copyright (c) 2006 Rags Gardner.  All Rights Reserved.
// www.rags-int-inc.com
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided the following conditions are met:
//
// 1. Redistribution in source code must contain the above copyright notice,
//    this list of conditions and the following disclaimer.
// 2. Redistribution in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other matereials provided with the distribution.
// 3. The name of the author may not be used to promote or endorse products
//    derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
// LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Adapted from: ColourPicker_Raw2 V2 by fazstp at ps-scripts.com
// ================================================================
// For usage information, run this script with no PS document open.
// ================================================================

// =======================================================
// Change History
// 11/30/06 V1.0 Initial Release
// 12/02/06 V1.1 Support multiple path selections
//               Remove global references in ColorReader()
//               Lab mode 16-bit improvements
// 12/05/06 V1.2 Support ColorChecker PenPath
// =======================================================
var scriptVersion = "V1.2";                 // this script version

// =======================================================================
// debug and other custom tailoring
// level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// =======================================================================
    /// $.level = 1;
    /// debugger; // launch debugger on next line

// =======================================================
// Color Reader Object and Methods
// =======================================================

// -------------------------------------------------------
// ColorReader()
// Constructor: create a raw buffer of pixel values
// -------------------------------------------------------
function ColorReader(rawFile, docRef) {
    var startTime = new Date();
    this.docWidth;                 // image width
    this.docHeight;                // image height
    this.doc16Bit = false;         // bit depth
    this.labMode = false;          // document mode
    this.rawFileName = rawFile;    // the RAW file name
    this.inFile;                   // the RAW file handle
    this.rawFileBuffer;            // RAW data as a string
    this.rawSize;                  // count of raw pixle values
    this.initializeTime;           // startup time
    this.pixelCount = 0.0;         // total pixels accessed
    this.callCount = 0.0;          // total patch read calls
    this.diagMsgs = new Array();   // for diagnostic messages only

    if (docRef.bitsPerChannel == BitsPerChannelType.SIXTEEN)
        this.doc16Bit = true;
    if (docRef.mode == DocumentMode.LAB)
        this.labMode = true;
    this.docWidth = Math.round(docRef.width.value);
    this.docHeight = Math.round(docRef.height.value);
    this.saveRaw();                             // save a PS RAW image
    this.inFile = new File(this.rawFileName);   // open as a binary file
    this.inFile.encoding = "BINARY";
    this.inFile.open("r:");
    this.rawFileBuffer = this.inFile.read();    // save file buffer
    this.inFile.close();
    this.rawSize = Math.round(this.rawFileBuffer.length);
    this.initializeTime = getElapsedTime(startTime);
    return;
}

// ----------------------------------------
// ColorReader.saveRaw()
// create a deocument copy in PS RAW format
// this is a simple array of binary pixel values
// ----------------------------------------
ColorReader.prototype["saveRaw"] = function() {
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();

    desc1.putBoolean(stringIDToTypeID("channelsInterleaved"), true);
    desc2.putObject(stringIDToTypeID("as"), stringIDToTypeID("rawFormat"), desc1);
    desc2.putPath(stringIDToTypeID("in"), new File(this.rawFileName));
    desc2.putBoolean(stringIDToTypeID("copy"), true);
    desc2.putBoolean(stringIDToTypeID("lowerCase"), true);
    executeAction(stringIDToTypeID("save"), desc2, DialogModes.NO);
    return;
}

// -------------------------------------------------------
// ColorReader.getColor()
// get average pixel values from RAW file selection area
// returns RGBColor or LabColor
// -------------------------------------------------------
ColorReader.prototype["getColor"] = function(x, y, xWidth, yHeight, name) {
    var i, j, pixLoc;
    var ch1, ch2, ch3;                        // color channels
    var ch1Accum, ch2Accum, ch3Accum;         // channel total/average
    var colorAverage;                         // return value (RGB or Lab)
    var bufSize = this.rawFileBuffer.length;  // image buffer size
    var count = 0;                            // pixel count

    //--------------------------
    // validate selection bounds
    //--------------------------
    if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x > this.docWidth || y > this.docHeight
        || x != parseInt(x) || y != parseInt(y))
        throw("getColor(" + x + ", " + y + ") doc " + this.docWidth + "x" + this.docHeight +
              " " + name + " Invalid xy values");
    if (isNaN(xWidth) || isNaN(yHeight) || xWidth < 1.0 || yHeight < 1.0
        || xWidth != parseInt(xWidth) || yHeight != parseInt(yHeight)
        || x+xWidth > this.docWidth || y+yHeight > this.docHeight)
        throw("getColor(" + x + ", " + y + ", " + xWidth + ", " + yHeight + ") " + name +
              " Invalid selection size");
    ch1Accum = ch2Accum = ch3Accum = 0.0;
    //---------------------
    // get the color values
    //---------------------
    for  (i=y; i<y+yHeight; i++) {      // each row
        for (j=x; j<x+xWidth; j++) {    // each column
            pixLoc = (y * this.docWidth) + x;
            if (this.doc16Bit) {
                //------------------------------------------
                // these are saved as true 16-bit integers
                // they have to be converted to Adobe 15-bit
                //------------------------------------------
                pixLoc *= 6.0;
                if (pixLoc+5 > bufSize)
                    throw("getColor(" + x + ", "+ y + ") " + name + " Invalid 16-bit pixel location");
                ch1  = this.rawFileBuffer.charCodeAt(pixLoc+0) << 8;
                ch1 += this.rawFileBuffer.charCodeAt(pixLoc+1);
                ch2  = this.rawFileBuffer.charCodeAt(pixLoc+2) << 8;
                ch2 += this.rawFileBuffer.charCodeAt(pixLoc+3);
                ch3  = this.rawFileBuffer.charCodeAt(pixLoc+4) << 8;
                ch3 += this.rawFileBuffer.charCodeAt(pixLoc+5);
                /// if (i==y && j==x) this.showPixel(ch1, ch2, ch3, pixLoc, i, j, name); /// show first only
            } else {
                //---------------------------------------
                // these are saved as true 8-bit integers
                //---------------------------------------
                pixLoc *= 3.0;
                if (pixLoc+2 > bufSize)
                    throw("getColor(" + x + ", "+ y + ") " + name + " Invalid 8-bit pixel location");
                ch1 = this.rawFileBuffer.charCodeAt(pixLoc+0);
                ch2 = this.rawFileBuffer.charCodeAt(pixLoc+1);
                ch3 = this.rawFileBuffer.charCodeAt(pixLoc+2);
                /// if (i==y && j==x) this.showPixel(ch1, ch2, ch3, pixLoc, i, j, name); /// show first only
            }
            //----------------------------
            // add this pixel to the total
            //----------------------------
            ch1Accum += ch1;
            ch2Accum += ch2;
            ch3Accum += ch3;
            count++;
        }
    }
    //---------------------------
    // Finished, get the averages
    //---------------------------
    ch1Accum /= count;
    ch2Accum /= count;
    ch3Accum /= count;
    if (this.doc16Bit) {
        //-----------------------------
        // adjust to Adobe quasi 15-bit
        // fix values > the mid-point
        // and round to 15 bit integer
        //-----------------------------
        if (ch1Accum > 32768) ch1Accum = Math.round(ch1Accum += 1);
        else ch1Accum = Math.round(ch1Accum);
        if (ch2Accum > 32768) ch2Accum = Math.round(ch2Accum += 1);
        else ch2Accum = Math.round(ch2Accum);
        if (ch3Accum > 32768) ch3Accum = Math.round(ch3Accum += 1);
        else ch3Accum = Math.round(ch3Accum);
        //------------------------------------------
        // then, scale to 0.0 - 255.0 decimal values
        //------------------------------------------
        ch1Accum /= 327680.0 / 1275.0;
        ch2Accum /= 327680.0 / 1275.0;
        ch3Accum /= 327680.0 / 1275.0;
    }
    //---------------------------
    // Are we in Lab or RGB mode?
    //---------------------------
    if (this.labMode) {
        //---------------------
        // scale to Lab metrics
        //---------------------
        ch1Accum *= 100.0/255.0;                  // L channel 0-100
        if (this.doc16Bit) {
            ch2Accum -= (128.0 - (ch2Accum/256.0));   // a channel -128 to +127
            ch3Accum -= (128.0 - (ch3Accum/256.0));   // b channel -128 to +127
        } else {
            ch2Accum -= 128.0;                        // a channel -128 to +127
            ch3Accum -= 128.0;                        // b channel -128 to +127
        }
        if (ch1Accum > 100.0 || ch2Accum > 127.0 || ch3Accum > 127.0
            || ch1Accum < 0 || ch2Accum < -128 || ch3Accum < -128)
            throw("getColor(" + x + ", "+ y + ") " + name + " Invalid Lab Color values[" +
                ch1Accum + ", " + ch2Accum + ", " + ch3Accum + "]");
        colorAverage = new (LabColor);
        //--------------------------
        // round to 15-bit precision
        //--------------------------
        colorAverage.l = Math.round(ch1Accum*128)/128;
        colorAverage.a = Math.round(ch2Accum*128)/128;
        colorAverage.b = Math.round(ch3Accum*128)/128;
    } else {
        //---------------------
        // RGB = 0-255
        //---------------------
        if (ch1Accum > 255.0 || ch2Accum > 255.0 || ch3Accum > 255.0
            || ch1Accum < 0 || ch2Accum < 0 || ch3Accum < 0)
            throw("getColor(" + x + ", "+ y + ") " + name + " Invalid RGB Color values[" +
                ch1Accum + ", " + ch2Accum + ", " + ch3Accum + "]");
        colorAverage = new (RGBColor);
        //--------------------------
        // round to 15-bit precision
        //--------------------------
        colorAverage.red = Math.round(ch1Accum*128)/128;
        colorAverage.green = Math.round(ch2Accum*128)/128;
        colorAverage.blue = Math.round(ch3Accum*128)/128;
    }
    this.pixelCount += count;
    this.callCount += 1;
    return(colorAverage);
}

// -------------------------------------------------------
// ColorReader.showPixel()
// Diagnostic display of pixel color values
// -------------------------------------------------------
ColorReader.prototype["showPixel"] = function(int1, int2, int3, bufIdx, row, col, name) {
    var msgStr;                               // diagnostics message line

    msgStr  = name + " [" + row + ", " + col + "]";
    msgStr += ", Int" + (this.doc16Bit ? "16":"8") + ": [" + int1 + ", " + int2 +", "  + int3 + "]";
    if (this.doc16Bit) {
        msgStr += "\n  Hex: [" + Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+0));
        msgStr += Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+1));
        msgStr += ", " + Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+2));
        msgStr += Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+3));
        msgStr += ", " + Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+4));
        msgStr += Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+5)) + "]";
        msgStr += ", Unicode: [" + this.rawFileBuffer.charCodeAt(bufIdx+0);
        msgStr += ":" + this.rawFileBuffer.charCodeAt(bufIdx+1);
        msgStr += ", " + this.rawFileBuffer.charCodeAt(bufIdx+2);
        msgStr += ":" + this.rawFileBuffer.charCodeAt(bufIdx+3);
        msgStr += ", " + this.rawFileBuffer.charCodeAt(bufIdx+4);
        msgStr += ":" + this.rawFileBuffer.charCodeAt(bufIdx+5) + "]";
    } else {
        msgStr += "\n  Hex: [" + Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+0));
        msgStr += ", " + Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+1));
        msgStr += ", " + Hex.binToHex(this.rawFileBuffer.charAt(bufIdx+2)) + "]";
        msgStr += ", Unicode: [" + this.rawFileBuffer.charCodeAt(bufIdx+0);
        msgStr += ", " + this.rawFileBuffer.charCodeAt(bufIdx+1);
        msgStr += ", " + this.rawFileBuffer.charCodeAt(bufIdx+2) + "]";
    }
    //----------------------------------------
    // save the diagnostics to be shown at EOJ
    //----------------------------------------
    this.diagMsgs[this.diagMsgs.length] = "showPixel() " + msgStr;
    return;
}

// =======================================================
// Hex Utility Functions
// =======================================================

// -------------------------------------------------------
// Hex object definition
// -------------------------------------------------------
Hex = function() {};

// -------------------------------------------------------
// Hex.binToHex() convert binary to hex string
// -------------------------------------------------------
Hex.binToHex = function(s) {
    function hexDigit(d) {
      if (d < 10) return d.toString();
      d -= 10;
      return String.fromCharCode("A".charCodeAt(0) + d);
    }
    var i, ch;
    var str = "";

    s = s.toString();
    for (i=0; i<s.length; i++) {
        ch = s.charCodeAt(i);
        str += hexDigit(ch >> 4) + hexDigit(ch & 0xF);
    }
    if (str == "") str = "00";
    return(str);
}

// =======================================================
// Static Functions
// =======================================================

// -------------------------------------------------------
// findPaths()
// find pen paths in document
// -------------------------------------------------------
function findPaths(docRef) {
    var paths = new Array();
    var i;

    if (docRef.pathItems.length == 1) {               // document contains a single path
        if (docRef.pathItems[0].name == "PenPath") {  // from Build CC Target?
            FindCCPenPath(docRef);
            ccImageFound = true;                      // Main() will use these points
            return(paths);
        }
    }
    for (i=0; i<docRef.pathItems.length; i++) {
        paths[paths.length] = docRef.pathItems[i];
    }
    return(paths);
}

// -------------------------------------------------------
// FindCCPenPath()
// Reads X,Y coordinates from a four-corner pen path
// in active document and computes color checker patch
// coordinates.
// -------------------------------------------------------
function FindCCPenPath(penDocRef) {
    var tlX, tlY, blX, blY, brX, brY, trX, trY;
    var penPathRef = null;

    penPathRef = penDocRef.pathItems.getByName("PenPath");
    if (penPathRef == null)
        throw("FindCCPenPath() Pen Path named \"PenPath\" not found");
    if (penPathRef.subPathItems[0].pathPoints.length == 4) {  // path has exactly four points
        tlX = penPathRef.subPathItems[0].pathPoints[0].anchor[0];
        tlY = penPathRef.subPathItems[0].pathPoints[0].anchor[1];
        blX = penPathRef.subPathItems[0].pathPoints[1].anchor[0];
        blY = penPathRef.subPathItems[0].pathPoints[1].anchor[1];
        brX = penPathRef.subPathItems[0].pathPoints[2].anchor[0];
        brY = penPathRef.subPathItems[0].pathPoints[2].anchor[1];
        trX = penPathRef.subPathItems[0].pathPoints[3].anchor[0];
        trY = penPathRef.subPathItems[0].pathPoints[3].anchor[1];
    } else {
        throw("FindCCPenPath() Pen Path must have exactly four points");
    }
    // X,Y coords of corner patches (tl, bl, br, tr)
    ComputePatchCoordinates(tlX,tlY, blX,blY, brX,brY, trX,trY);
    return;
}

// -------------------------------------------------------
// ComputePatchCoordinates()
// Compute patch locations based on corner X,Y coordinates
// -------------------------------------------------------
function ComputePatchCoordinates(tlX,tlY, blX,blY, brX,brY, trX,trY) {
    var row, col, idx;
    var a, b, c, d, p, q, K;
    var maxMarqueeSize;
    var x = new Array();                 // save these arrays
    var y = new Array();                 // save these arrays
    var i;

    for (row=0; row<4; row++) {
        for (col=0; col<6; col++) {
            idx = row * 6 + col;                    // patch index
            lX = row * (blX - tlX) / 3 + tlX;       // left x coord of row
            rX = row * (brX - trX) / 3 + trX;       // right x coord of row
            x[idx] = col * (rX - lX) / 5 + lX;      // x coord of patch
            x[idx] = Math.round(x[idx]);
            tY = col * (trY - tlY) / 5 + tlY;       // top y coord of col
            bY = col * (brY - blY) / 5 + blY;       // top y coord of col
            y[idx] = row * (bY - tY) / 3 + tY;      // y coord of patch
            y[idx] = Math.round(y[idx]);
        }
    }
    // Compute area (K) of quadrilateral abcd with diagonals p,q using Bretschneider's formula
    a = Math.sqrt(Math.pow(x[18]-x[ 0], 2) + Math.pow(y[18]-y[ 0], 2));
    b = Math.sqrt(Math.pow(x[ 0]-x[ 5], 2) + Math.pow(y[ 0]-y[ 5], 2));
    c = Math.sqrt(Math.pow(x[ 5]-x[23], 2) + Math.pow(y[ 5]-y[23], 2));
    d = Math.sqrt(Math.pow(x[23]-x[18], 2) + Math.pow(y[23]-y[18], 2));
    p = Math.sqrt(Math.pow(x[ 0]-x[23], 2) + Math.pow(y[ 0]-y[23], 2));
    q = Math.sqrt(Math.pow(x[18]-x[ 5], 2) + Math.pow(y[18]-y[ 5], 2));
    K = Math.sqrt(4*p*p*q*q - Math.pow((b*b + d*d - a*a - c*c), 2)) / 4;
    // Set max marquee size as fraction of quadrilateral area (K)
    maxMarqueeSize = Math.round(Math.sqrt(K/16));
    //------------------------------------
    // save the patch coordinates and size
    // in a global references
    //------------------------------------
    sampleSize = Math.round(maxMarqueeSize/6);
    if (sampleSize < 2)   // 4x4 minimum sample size
        throw("ComputePatchCoordinates() Patch sample size(" + sampleSize + ") is too small");
    ccPatchesX = new Array();
    ccPatchesY = new Array()
    for (i=0; i<x.length; i++) {
        ccPatchesX[i] = x[i];
        ccPatchesY[i] = y[i];
    }
    return;
}

// -------------------------------------------------------
// findPathsBounds()
// returns array[x, y, w, h, name] of path bounds
// -------------------------------------------------------
function findPathsBounds(docRef, penPathRef) {
    var tlX, tlY, blX, blY, brX, brY, trX, trY;
    var i;
    var pathValid = true;
    var bounds = new Array();

    if (penPathRef.subPathItems.length != 1) {
        alert("findPathsBounds() Path [" + penPathRef.name + "] has multiple subpaths");
        return(bounds);
    }
    for (i=0; i<penPathRef.subPathItems[0].pathPoints.length; i++) {
       if (penPathRef.subPathItems[0].pathPoints[i].kind != PointKind.CORNERPOINT) {
           pathValid = false;  // not a rectangle
           break;
       }
    }
    if (pathValid && penPathRef.subPathItems[0].pathPoints.length == 4) {
        //-----------------------------
        // path has exactly four points
        //-----------------------------
        tlX = penPathRef.subPathItems[0].pathPoints[0].anchor[0];
        tlY = penPathRef.subPathItems[0].pathPoints[0].anchor[1];
        blX = penPathRef.subPathItems[0].pathPoints[1].anchor[0];
        blY = penPathRef.subPathItems[0].pathPoints[1].anchor[1];
        brX = penPathRef.subPathItems[0].pathPoints[2].anchor[0];
        brY = penPathRef.subPathItems[0].pathPoints[2].anchor[1];
        trX = penPathRef.subPathItems[0].pathPoints[3].anchor[0];
        trY = penPathRef.subPathItems[0].pathPoints[3].anchor[1];
        bounds[0] = Math.round(tlX);           // X
        bounds[1] = Math.round(tlY);           // Y
        bounds[2] = Math.round(brX - tlX);     // W
        bounds[3] = Math.round(brY - tlY);     // H
        bounds[4] = penPathRef.name;              // name
    } else {
        alert("findPathsBounds() Path [" + penPathRef.name + "] is not a rectangle");
    }
    return(bounds);
}

// -----------------------------------------
// showUsage()
// -----------------------------------------
function showUsage(reason) {
    var msgStr = "";

    msgStr += "\nThis is a testing utility to read color values from an area or single pixel.";
    msgStr += "\nİ 2006 Rags Int., Inc. Rags Gardner: www.rags-int-inc.com";
    msgStr += "\nIt operates on the current active document.";
    msgStr += "\nThe image may be in Lab or RGB mode and 8 or 16 bit";
    msgStr += "\n\nTo define a sample area, make a rectangle selection then save it as a path.";
    msgStr += "\nMultiple paths (with unique names) may be defined.";
    msgStr += "\nThe color values for each will be shown in the finished message.";
    msgStr += "\n\nThis script saves the current document as a Photoshop RAW file in:";
    msgStr += "\n   " + Folder.temp.fsName + " as ColorPicker.raw";
    msgStr += "\nIt then reads this as a binary file to extract the color values.";
    msgStr += "\n\nThis will read a Macbeth Color Checker image (24 patches)";
    msgStr += "\nif you create a single path named \"PenPath\" as described";
    msgStr += "\nin the ReadMatbethPatches script elsewhere on this site";
    msgStr += "\n\nPerformance will vary based on the size of the sampled area.";
    msgStr += "\nThe one time initialization should run in well under under a second.";
    msgStr += "\nSample areas under 100x100 will also be very fast.";
    msgStr += "\nBut sampling an entire large image may take over a minute or more.";
    alert(scriptName + " " + reason + msgStr);
    return;
}

// ---------------------------------------------
// padNumStr()
// pads number to decimal string at fixed length
// right justified for tabular display
// ---------------------------------------------
function padNumStr(decimal, newLth, num) {
    var i, j;
    var dP;
    var newStr;

    dP = Math.pow(10, decimal);                 // Decimal precision Base 10
    newStr = new String(Math.round(num*dP)/dP); // round input
    // ---------------------------
    // pad decimal places to right
    // ---------------------------
    if (decimal > 0) {
        if (newStr.indexOf(".") < 0)   // is it already decimal precision?
            newStr += ".0";            // no, add the first decimal
        if (decimal > 1) {             // do we need more decimal positions?
            j = (decimal + 1) - (newStr.length - newStr.indexOf("."));
            for (i=0; i<j; i++)
                newStr += "0";
        }
    }
    // -------------------------
    // pad string length to left
    // -------------------------
    j = newLth - newStr.length;
    for (i=0; i<j; i++)
        newStr = " " + newStr;
    return(newStr);
}

// -----------------------------------------
// setTestValues()
// match to mode and CCT (and RGB profile)
// -----------------------------------------
function setTestValues() {
    var testValues = new Array();

    if (labMode) {
        testValues[ 0] = new Array(37.984,  13.555,  14.063, "dark skin");
        testValues[ 1] = new Array(65.711,  18.133,  17.813, "light skin");
        testValues[ 2] = new Array(49.930,  -4.883, -21.922, "blue sky");
        testValues[ 3] = new Array(43.141, -13.094,  21.906, "foliage");
        testValues[ 4] = new Array(55.109,   8.844, -25.398, "blue flower");
        testValues[ 5] = new Array(70.719, -33.398,  -0.195, "bluish green");
        testValues[ 6] = new Array(62.664,  36.039,  57.094, "orange");
        testValues[ 7] = new Array(40.023,  10.406, -45.961, "purplish blue");
        testValues[ 8] = new Array(51.125,  48.242,  16.250, "moderate red");
        testValues[ 9] = new Array(30.328,  22.977, -21.586, "purple");
        testValues[10] = new Array(72.531, -23.711,  57.258, "yellow green");
        testValues[11] = new Array(71.938,  19.359,  67.859, "orange yellow");
        testValues[12] = new Array(28.781,  14.180, -50.297, "blue");
        testValues[13] = new Array(55.258, -38.344,  31.367, "green");
        testValues[14] = new Array(42.102,  53.375,  28.188, "red");
        testValues[15] = new Array(81.734,   4.039,  79.820, "yellow");
        testValues[16] = new Array(51.938,  49.984, -14.570, "magenta");
        testValues[17] = new Array(51.039, -28.633, -28.641, "cyan");
        testValues[18] = new Array(96.539,   0.000,   0.000, "white");
        testValues[19] = new Array(81.258,   0.000,   0.000, "neutral 8");
        testValues[20] = new Array(66.766,   0.000,   0.000, "neutral 6.5");
        testValues[21] = new Array(50.867,   0.000,   0.000, "neutral 5");
        testValues[22] = new Array(35.656,   0.000,   0.000, "neutral 3.5");
        testValues[23] = new Array(20.461,   0.000,   0.000, "black");
    } else {
        testValues[ 0] = new Array( 80.859,  66.984,  54.117, "dark skin"); 
        testValues[ 1] = new Array(158.984, 134.805, 113.453, "light skin");
        testValues[ 2] = new Array( 93.945, 101.414, 133.258, "blue sky");
        testValues[ 3] = new Array( 74.891,  85.898,  55.375, "foliage");
        testValues[ 4] = new Array(117.938, 110.547, 154.383, "blue flower");
        testValues[ 5] = new Array(126.953, 167.813, 157.258, "bluish green");
        testValues[ 6] = new Array(166.602, 117.953,  53.539, "orange");
        testValues[ 7] = new Array( 79.133,  74.336, 144.883, "purplish blue");
        testValues[ 8] = new Array(140.938,  82.898,  79.453, "moderate red");
        testValues[ 9] = new Array( 68.016,  49.133,  82.281, "purple");
        testValues[10] = new Array(144.016, 169.398,  74.227, "yellow green");
        testValues[11] = new Array(181.305, 151.672,  59.617, "orange yellow");
        testValues[12] = new Array( 56.617,  50.094, 120.367, "blue");
        testValues[13] = new Array( 84.836, 123.047,  69.234, "green");
        testValues[14] = new Array(119.844,  59.328,  46.445, "red");
        testValues[15] = new Array(199.367, 188.328,  65.641, "yellow");
        testValues[16] = new Array(143.297,  84.891, 127.109, "magenta");
        testValues[17] = new Array( 77.656, 110.742, 147.680, "cyan");
        testValues[18] = new Array(242.313, 242.313, 242.313, "white");
        testValues[19] = new Array(190.008, 190.008, 190.008, "neutral 8");
        testValues[20] = new Array(145.172, 145.172, 145.172, "neutral 6.5");
        testValues[21] = new Array(101.672, 101.672, 101.672, "neutral 5");
        testValues[22] = new Array( 66.211,  66.211,  66.211, "neutral 3.5");
        testValues[23] = new Array( 36.953,  36.953,  36.953, "black");
    }
    return(testValues);
}

// -----------------------------------------
// compareTestValues()
// -----------------------------------------
function compareTestValues(patch, colorTest, testValues) {
    var msgStr = "";
    var t1, t2, t3;
    var e1 = 0, e2 = 0, e3 = 0;
    var errorThreshold = 1/128;  // 15 bit integer rounding

    /// errorThreshold = 0.00832;  ///
    if (labMode) {
        t1 = colorTest.l;
        t2 = colorTest.a;
        t3 = colorTest.b;
    } else {
        t1 = colorTest.red;
        t2 = colorTest.green;
        t3 = colorTest.blue;
    }
    if (Math.round(t1*1000)/1000 != testValues[patch][0])
        e1 = testValues[patch][0] - t1;
    if (Math.round(t2*1000)/1000 != testValues[patch][1])
        e2 = testValues[patch][1] - t2;
    if (Math.round(t3*1000)/1000 != testValues[patch][2])
        e3 = testValues[patch][2] - t3;
    t1 = Math.round(t1*1000)/1000;
    t2 = Math.round(t2*1000)/1000;
    t3 = Math.round(t3*1000)/1000;
    if (Math.abs(e1) <= errorThreshold) e1 = 0;
    if (Math.abs(e2) <= errorThreshold) e2 = 0;
    if (Math.abs(e3) <= errorThreshold) e3 = 0;
    if (e1 != 0 || e2 != 0 || e3 != 0) {
        msgStr += "  t1[" + testValues[patch][0] + ", " + t1 + ", " + e1 + "]";
        msgStr += ", t2[" + testValues[patch][1] + ", " + t2 + ", " + e2 + "]";
        msgStr += ", t3[" + testValues[patch][2] + ", " + t3 + ", " + e3 + "]";
    }
    if (msgStr != "")
        msgStr = "Patch(" + (patch+1) + ") " + msgStr;
    return(msgStr);
}

// -----------------------------------------
// getElapsedTime()
// -----------------------------------------
function getElapsedTime(startTime) {
    var now = new Date();
    var timeDiff = Number(0.0);
    var timeString = new String("");

    timeDiff = (now - startTime) / 1000;
    if (timeDiff > 3600) {
        timeString = Math.round(timeDiff / 3600) + " hours ";
        timeDiff = Math.round(timeDiff % 3600);
    }
    if (timeDiff > 60) {
        timeString = timeString + Math.round(timeDiff / 60) + " minutes ";
        timeDiff = Math.round(timeDiff % 60);
    } else if (timeString.length > 0) {
        timeString = timeString + "0 minutes ";
    }
    timeString = timeString + (Math.round(timeDiff*1000)/1000) + " seconds";
    return(timeString);
}

// -----------------------------------------
// getScriptInfo()
// get it from the exception data
// -----------------------------------------
function getScriptInfo() {
    var ex, fn, dbLevel;
    var fInfo = null;

    dbLevel = $.level;  // save
    $.level = 0;        // debug off
    try {
        undefined_variable1 = undefined_variable2;
    } catch(ex) {
        fInfo = ex.fileName;
    }
    $.level = dbLevel;  // restore
    fn = fInfo.substring(fInfo.lastIndexOf("/")+1, fInfo.lastIndexOf("."));
    if (fn != null && fn != "") {
        scriptName = fn;
    }
    return;
}

// -----------------------------------------
// Cleanup()
// -----------------------------------------
function Cleanup() {
    app.preferences.rulerUnits = initRulerUnits;
    app.DisplayDialogs = initDisplayDialogs;
    return;
}

// =======================================================
// =======================================================
// MainFunction():      The Driver
// =======================================================
// =======================================================
function MainFunction() {
    var startTime;            // for elapsed time
    var colorTest;            // final color objects
    var pathsFound;           // array of pen paths found
    var pathItems;            // array of path coordinates
    var pathBounds;           // array of pen path boundries
    var ccPatchName;          // CC Image patch
    var colorTestMsg = "";
    var finishMsg = "";
    var testValues;
    var valMsg = "";
    var i;

    //---------------------
    // save app preferences
    //---------------------
    initRulerUnits = app.preferences.rulerUnits;
    initDisplayDialogs = app.DisplayDialogs;
    //--------------------
    // Is a document open?
    //--------------------
    if (documents.length > 0) {
        docRefBase = app.activeDocument;  // base document
    } else {
        showUsage("No document found!");
        return;
    }
    if (docRefBase.mode != DocumentMode.RGB && docRefBase.mode != DocumentMode.LAB) {
        alert(scriptName + " Error: document mode is not RGB or LAB! [" +  docRefBase.mode + "]");
        return;
    }
    app.preferences.rulerUnits = Units.PIXELS;
    app.DisplayDialogs = DialogModes.NO;
    //--------------------
    // Setup
    //--------------------
    if (docRefBase.mode == DocumentMode.LAB)
        labMode = true;
    if (docRefBase.bitsPerChannel == BitsPerChannelType.SIXTEEN) {
        doc16Bit = true;
    } else if (docRefBase.bitsPerChannel != BitsPerChannelType.EIGHT) {
        alert(scriptName + " Error: document bit depth is not 8 or 16! [" +  docRefBase.bitsPerChannel + "]");
        return;
    }
    docName = docRefBase.name;
    docWidth = Math.round(docRefBase.width.value);
    docHeight = Math.round(docRefBase.height.value);
    rawFile = Folder.temp.fsName + "/ColorPicker.raw";
    //---------------------------
    // are there any saved paths?
    //---------------------------
    pathsFound = findPaths(docRefBase);
    if (pathsFound.length > 24) {
        if (!confirm(scriptName + " Found " + pathsFound.length + " paths.\nDo you want to continue?"))
            return;
    }
    pathItems = new Array();
    for (i=0; i<pathsFound.length; i++) {
        pathBounds = findPathsBounds(docRefBase, pathsFound[i]);
        if (pathBounds.length == 5)
            pathItems[pathItems.length] = pathBounds; // save it
    }
    //---------------------------------
    // Ready: find the requested colors
    //---------------------------------
    startTime = new Date();
    cr = new ColorReader(rawFile, docRefBase);     // ColorReader object
    for (i=0; i<pathItems.length; i++) {
        pathBounds = pathItems[i];
        if (pathBounds[2] * pathBounds[3] > 1000000) {
            if (!confirm(scriptName + " Path(" + (i+1) + ") " + pathBounds[4] + " includes " +
                pathBounds[2] * pathBounds[3] + " pixels." + 
                "\nThis may impact performance!\nDo you want to continue?"))
                break;
        }
        //---------------------
        // get the color values
        //---------------------
        colorTest = cr.getColor(pathBounds[0], pathBounds[1], pathBounds[2], pathBounds[3], pathBounds[4]);
        colorTestMsg += "\n   [" + (i+1) + "] "  + pathBounds[4] + " xy[" + pathBounds[0] + ", ";
        colorTestMsg += pathBounds[1] + "], size[" + pathBounds[2] + ", " + pathBounds[3] + "]  ";
        if (labMode) {
            colorTestMsg += "Lab [" + padNumStr(3, 7, colorTest.l) + ", ";
            colorTestMsg += padNumStr(3, 7, colorTest.a) + ", ";
            colorTestMsg += padNumStr(3, 7, colorTest.b) + "]";
        } else {
            colorTestMsg += "RGB [" + padNumStr(3, 7, colorTest.red) + ", ";
            colorTestMsg += padNumStr(3, 7, colorTest.green) + ", ";
            colorTestMsg += padNumStr(3, 7, colorTest.blue) + "]";
        }
    }
    //----------------------------------------------
    // special routine to emulate ReadMacbethPatches
    // if path name was "PenPath"
    // this assumes a valid ColorChecker iamge layout
    //-----------------------------------------------
    if (ccImageFound) {
        /// testValues = setTestValues(); ///
        for (i=0; i<24; i++) {
            //---------------------------
            // get the patch color values
            //---------------------------
            ccPatchName = "CC Patch " + padNumStr(0, 2, (i+1));
            colorTest = cr.getColor(ccPatchesX[i]-sampleSize, ccPatchesY[i]-sampleSize,
                                    sampleSize*2, sampleSize*2, ccPatchName);
            colorTestMsg += "\n   " + ccPatchName + " xy[" + ccPatchesY[i] + ", ";
            colorTestMsg += ccPatchesX[i] + "], size[" + sampleSize + ", " + sampleSize + "]  ";
            if (labMode) {
                colorTestMsg += "Lab [" + padNumStr(3, 7, colorTest.l) + ", ";
                colorTestMsg += padNumStr(3, 7, colorTest.a) + ", ";
                colorTestMsg += padNumStr(3, 7, colorTest.b) + "]  ";
            } else {
                colorTestMsg += "RGB [" + padNumStr(3, 7, colorTest.red) + ", ";
                colorTestMsg += padNumStr(3, 7, colorTest.green) + ", ";
                colorTestMsg += padNumStr(3, 7, colorTest.blue) + "]  ";
            }
            ///------------------------------------
            /// testing, validate D50 Lab and ppRGB
            ///------------------------------------
            /// if (doc16Bit) valMsg = compareTestValues(i, colorTest, testValues);
            /// if (valMsg != "") alert(valMsg);
        }
    }
    if (cr.callCount < 1) {
        showUsage("No usable paths for selection areas were found");
        return;
    }
    //-----------------------------------
    // Prepare a finished message
    //-----------------------------------
    finishMsg += "\n" + docName + " [" + docWidth + "x" + docHeight + "], "
    finishMsg += (labMode ? "Lab":"RGB") + " @ " + (doc16Bit ? "16":"8") + " bits";
    finishMsg += colorTestMsg;
    for (i=0; i<cr.diagMsgs.length; i++) {    // any diagnostics?
        finishMsg += "\n" + cr.diagMsgs[i];
    }
    finishMsg += "\nElapsed Time: " + getElapsedTime(startTime);
    finishMsg += ", Init: " + cr.initializeTime;
    finishMsg += ", Patches(" + cr.callCount + ")";
    finishMsg += ", Pixels(" + cr.pixelCount + ")";
    alert(scriptName + " finished! " + finishMsg);
    return;
}

//--------------------------------------
// Initialize Global Variables & Objects
//--------------------------------------
var scriptName = "ColorReaderRaw";               // default script name
var initRulerUnits;                              // save ruler units
var initDisplayDialogs;                          // save dialog settings
var docRefBase;                                  // document handle
var docName;                                     // document name
var docWidth;                                    // document width
var docHeight;                                   // document height
var doc16Bit = false;                            // document is 16-bit mode
var labMode = false;                             // mode Lab | RGB
var ccImageFound = false;                        // found PenPath from CC Image
var sampleSize;                                  // CC Image
var ccPatchesX;                                  // CC Image X coordinates array
var ccPatchesY;                                  // CC Image X coordinates array
var rawFile;                                     // temporary RAW file path and name
var cr;                                          // ColorReader object
var e;                                           // exception data
var eLine = "";                                  // exception line number

// =======================================================
// Dispatch Main
// =======================================================
getScriptInfo();
scriptName += " " + scriptVersion;
try {
    MainFunction();   // run it
} catch(e) {
    if (e.line != undefined) eLine = "line[" + e.line + "]: ";
    alert(scriptName + " MainFunction() " + eLine + "Exception:\n" + e); // show errors
}
Cleanup();            // restore user defaults
// end JavaScript