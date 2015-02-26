var doc=fl.getDocumentDOM();
var lib=doc.library;

var items=lib.items;

for(var i=0;i<items.length;++i){
    fl.trace(
        "name="+items[i].name+
        ",type="+items[i].itemType+
        ",sourceFilePath="+items[i].sourceFilePath+
        ",sourceLibraryName="+items[i].sourceLibraryName+
        ",this="+items[i]

    );
    if(items[i].itemType=="graphic"){
        for(var k in items[i]){
            fl.trace(k+"="+items[i][k]);
        }
    }
}

var getItemsOfGroup=function(group) {
    var find=[];
    var libItems=this.lib.items;
    group=group+"/";
    for(var i in libItems){
        var item=libItems[i];
        if(item.name.indexOf(group)==0){
            find.push(item);
        }
    }

    return find;
};

var tt=getItemsOfGroup("images");
fl.trace(tt);

var files=FLfile.listFolder("file:///E|/tt/aa/","files");

for(var i in files){
    var file=files[i];
   fl.trace(file);

}