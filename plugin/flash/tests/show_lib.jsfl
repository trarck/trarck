var doc=fl.getDocumentDOM();
var lib=doc.library;

var items=lib.items;
fl.trace("==============item info==================");
for(var i=0;i<items.length;++i){

    fl.trace("==========item "+i+"================");
    var itemInfo="";
    for(var k in items[i]){
        itemInfo+=k+":"+items[i][k]+"\n";
    }
    fl.trace(itemInfo);

    //fl.trace("name="+items[i].name+",itemType="+items[i].itemType+",this="+items[i]);
    //if(items[i].itemType=="bitmap"){
	 //   fl.trace(items[i].sourceFilePath);
    //}
    fl.trace("==========item "+i+"================end");
}   