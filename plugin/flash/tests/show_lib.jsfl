var doc=fl.getDocumentDOM();
var lib=doc.library;

var items=lib.items;
fl.trace(items.length);
for(var i=0;i<items.length;++i){
    fl.trace("name="+items[i].name+",type="+items[i].itemType+"this="+items[i]);
    if(items[i].itemType=="bitmap"){
	fl.trace(items[i].sourceFilePath);
    }
}   