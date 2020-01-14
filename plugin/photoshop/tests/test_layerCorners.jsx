function getCorners(layer) {
    var bounds = layer.bounds;
    corners = new Array();
    corners[0] = {x:bounds[0].as("px"), y:bounds[1].as("px")};
    corners[2] = {x:bounds[2].as("px"), y:bounds[3].as("px")};
    corners[1] = {x:corners[2].x,y:corners[0].y};
    corners[3] = {x:corners[0].x,y:corners[2].y};
    return corners;
}

var cs=getCorners (app.activeDocument.activeLayer);
alert(cs[0].x+","+cs[0].y+":"+cs[1].x+","+cs[1].y+":"+cs[2].x+","+cs[2].y+":"+cs[3].x+","+cs[3].y);