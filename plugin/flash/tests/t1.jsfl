var doc=fl.getDocumentDOM();
var lib=doc.library;

doc.importFile("file:///D|/temp/CW/Image/Head.png",true);

showLib();
lib.selectItem("Head.png");
lib.moveToFolder("images");
showLib();

lib.selectItem("Head.png");
lib.addItemToDocument({x:0, y:0});
doc.convertToSymbol('movie clip', "test", "center");

function showLib(){
    var items=lib.items;
     fl.trace(items.length);
    for(var i=0;i<items.length;++i){
            fl.trace("name="+items[i].name+",type="+items[i].itemType+"this="+items[i]);
            if(items[i].itemType=="bitmap"){
                    fl.trace(items[i].sourceFilePath);
            }
     }   
 }