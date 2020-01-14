(function (){
    var texWidth,texHeight;
    var rectX,rectY,rectW,rectH;
    var targetFolder;
    var targetPath;
      
     var texSize;
     var rect;
    
    var prefs = new Object();
    prefs.sourceFolder         = '/d/temp/Elelines';  // default browse location (default: '~')
    prefs.removeFileExtensions = true; // remove filename extensions for imported layers (default: true)
    prefs.savePrompt           = false; // display save prompt after import is complete (default: false)
    prefs.closeAfterSave       = false; // close import document after saving (default: false)

    function getFiles(sourceFolder) {
        // declare local variables
        var fileArray = new Array();
        var extRE = /\.(?:png|gif|jpg|bmp|tif|psd|tga)$/i;

        // get all files in source folder
        var files = sourceFolder.getFiles();
        for (var i = 0; i <  files.length; i++) {
            var file = files[i];

            // only match files (not folders)
            if (file instanceof File) {
                // store all recognized files into an array
                var fileName = file.name;
                if (fileName.match(extRE)) {
                    fileArray.push(file);
                }
            }
        }

        // return file array
        return fileArray;
    }
    
    function cropRect(doc,x,y,w,h){
        doc.crop([x,y,x+w,y+h ]);  
    }
    

    function doCrop(){
        if(targetFolder){
            if(targetFolder.fullName!=targetPath.text){
                targetFolder=new Folder(targetPath.text);
            }
            
            parseUI();
            var files=getFiles(targetFolder);
            for (var i = 0; i < files.length; i++) {
                cropFile(files[i]);
            }
        }
    }
    
    function cropFile(file){
        var doc=open(file);
        var width=doc.width;
        var height=doc.height;
        if(width!=texSize.width||height!=texSize.height){
            doc.resizeImage (texSize.width, texSize.height);
        }
        cropRect(doc,rect.x,rect.y,rect.width,rect.height);
        doc.save();
        doc.close();
    }
    
    function parseUI(){
        var w=parseInt(texWidth.text);
        var h=parseInt(texHeight.text);
        texSize={
                "width":w,
                "height":h
        };
    
        var x=parseFloat(rectX.text);
        var y=parseFloat(rectY.text);
        w=parseFloat(rectW.text);
        h=parseFloat(rectH.text);
        rect={
                "x":x,
                "y":y,
                "width":w,
                "height":h
        };
        
        
    }
    
    function showUI(){
        /*
        Code for Import https://scriptui.joonas.me — (Triple click to select): 
        {"activeId":9,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Dialog","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"EditText","parentId":4,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"x","justify":"left","preferredSize":[0,0],"alignment":"right","helpTip":null}},"item-2":{"id":2,"type":"StaticText","parentId":4,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Range:","justify":"left","preferredSize":[0,0],"alignment":"left","helpTip":null}},"item-3":{"id":3,"type":"EditText","parentId":4,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"y","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-4":{"id":4,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-5":{"id":5,"type":"EditText","parentId":4,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"w","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-6":{"id":6,"type":"EditText","parentId":4,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"h","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-7":{"id":7,"type":"Button","parentId":8,"style":{"enabled":true,"varName":null,"text":"Select","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-8":{"id":8,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-9":{"id":9,"type":"Button","parentId":8,"style":{"enabled":true,"varName":null,"text":"Crop","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,4,2,1,3,5,6,8,7,9],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"itemReferenceList":"None"}}
        */ 

        // DIALOG
        // ======
        var dialog = new Window("dialog"); 
            dialog.text = "Crop"; 
            dialog.orientation = "column"; 
            dialog.alignChildren = ["center","top"]; 
            dialog.spacing = 10; 
            dialog.margins = 16; 
        //Texture Size
        //=======
        var group0 = dialog.add("group", undefined, {name: "group0"}); 
            group0.orientation = "row"; 
            group0.alignChildren = ["left","center"]; 
            group0.spacing = 10; 
            group0.margins = 0; 

        group0.add("statictext", undefined, "TexSize:", {name: "statictext1"}); 
        texWidth = group0.add('edittext {size: [50,23], properties: {name: "texWidth", multiline: true}}'); 
        texWidth.text = "2048"; 
        texHeight = group0.add('edittext {size: [50,23], properties: {name: "texHeight", multiline: true}}'); 
        texHeight.text = "2048"; 


        // Crop Range
        // ======
        var group1 = dialog.add("group", undefined, {name: "group1"}); 
            group1.orientation = "row"; 
            group1.alignChildren = ["left","center"]; 
            group1.spacing = 10; 
            group1.margins = 0; 

         group1.add("statictext", undefined, "Range:", {name: "statictext1"}); 

        rectX = group1.add('edittext {size: [50,23], properties: {name: "rectX", multiline: true}}'); 
            rectX.text = "459"; 

        rectY = group1.add('edittext {size: [50,23], properties: {name: "rectY", multiline: true}}'); 
            rectY.text = "779"; 

        rectW = group1.add('edittext {size: [50,23], properties: {name: "rectW", multiline: true}}'); 
            rectW.text = "799"; 

        rectH = group1.add('edittext {size: [50,23], properties: {name: "rectH", multiline: true}}'); 
            rectH.text = "217"; 

        // Target
        // ======
        var group2 = dialog.add("group", undefined, {name: "group2"}); 
            group2.orientation = "row"; 
            group2.alignChildren = ["left","center"]; 
            group2.spacing = 10; 
            group2.margins = 0; 
        group2.add("statictext", undefined, "Target:", {name: "target"}); 

        targetPath=group2.add('edittext {size: [220,23], properties: {name: "targetPath", multiline: true}}'); 
        targetPath.text = ""; 
            
        var selectBtn= group2.add("button", undefined, undefined, {name: "selectBtn"}); 
            selectBtn.text = "Select"; 
        
        selectBtn.onClick=function () {
            targetFolder = Folder.selectDialog('Please select the folder to be crop:', Folder(prefs.sourceFolder));
            targetPath.text=targetFolder.fullName;
        }

        var group3 = dialog.add("group", undefined, {name: "group3"}); 
            group3.orientation = "row"; 
            group3.alignChildren = ["left","center"]; 
            group3.spacing = 10; 
            group3.margins = 0; 
        var cropBtn = group3.add("button", undefined, undefined, {name: "cropBtn"}); 
            cropBtn.text = "Crop"; 

        cropBtn.onClick=doCrop;
        
        dialog.show();
        
        return {
            "rectX":rectX,
            "rectY":rectY,
            "rectW":rectW,
            "rectH":rectH,
        }
    }

    
    function main(){
        showUI();
    }

main();
})();



