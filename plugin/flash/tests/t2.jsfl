var doc=fl.getDocumentDOM();
var lib=doc.library;

lib.selectItem("images/Tulips.jpg");
lib.addItemToDocument({x:0, y:0});
//doc.selectAll();
doc.convertToSymbol('movie clip', "testTT", "center");

lib.selectItem("testTT");
lib.moveToFolder("abc");