var CSV={
    stringify:function(table, replacer) {
        replacer = replacer || function(r, c, v) { return v; };
        var csv = '', c, cc, r, rr = table.length, cell;
        for (r = 0; r < rr; ++r) {
            if (r) { csv += '\r\n'; }
            for (c = 0, cc = table[r].length; c < cc; ++c) {
                if (c) { csv += ','; }
                cell = replacer(r, c, table[r][c]);
                if (/[,\r\n"]/.test(cell)) { cell = '"' + cell.replace(/"/g, '""') + '"'; }
                csv += (cell || 0 === cell) ? cell : '';
            }
        }
        return csv;
    }
};

function cropOfAlpha(doc){
    //SetAlphaAsSelect();
    var alphaChannel=doc.channels.getByName ("Alpha 1" );
    doc.selection.load(alphaChannel);
    var bounds = doc.selection.bounds;
    var left= bounds[0].as("px");
    var top=bounds[1].as("px");
    var right=bounds[2].as("px");
    var bottom=bounds[3].as("px");
    //translate bound to the coordinate of left,bootom
    var width=doc.width.as("px");
    var height=doc.height.as("px");
     bottom=height-bottom;
     top=height-top;
     //normalize
     var nl=left/width;
     var nr=right/width;
     var nt=top/height;
     var nb=bottom/height;
     $.writeln(doc.name+","+ nl+","+nb+","+nr+","+nt);     
     doc.crop(bounds);
     doc.save();
     
     //save data
     var data=[];
     data.push(doc.name);
     data.push(nl);
     data.push(nb);
     data.push(nr);
     data.push(nt);
     var csvString=CSV.stringify([data]);     
     $.writeln(csvString);
}

cropOfAlpha(app.activeDocument);