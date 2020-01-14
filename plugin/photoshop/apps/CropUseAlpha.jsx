(function (){
    var sourceFolder;
    var outFolder;
    var sourceFolderText;
    var outFolderText;
    var texWidthText;
    var texHeightText;
    var channelNameText;
 
    var texSize={width:2018,height:2048};
    var usedChannelName="Alpha 1";
    var saveTable=[];
    
    var prefs = new Object();
    prefs.sourceFolder         = '/c/unity/game-avatar-code/Assets/ArtResource/Characters/Faces';  // default browse location (default: '~')
    prefs.outFolder         = '/d/temp';  // default browse location (default: '~')
    prefs.removeFileExtensions = true; // remove filename extensions for imported layers (default: true)
    prefs.savePrompt           = false; // display save prompt after import is complete (default: false)
    prefs.closeAfterSave       = false; // close import document after saving (default: fals
    
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

    function getImageFiles(sourceFolder) {
        // declare local variables
        var fileArray = new Array();
        var extReg = /\.(?:png|gif|jpg|bmp|tif|psd|tga)$/i;

        // get all files in source folder
        var files = sourceFolder.getFiles();
        for (var i = 0; i <  files.length; i++) {
            var file = files[i];

            // only match files (not folders)
            if (file instanceof File) {
                // store all recognized files into an array
                var fileName = file.name;
                if (fileName.match(extReg)) {
                    fileArray.push(file);
                }
            }
        }

        // return file array
        return fileArray;
    }

     function doCrop(){
         saveTable=[];
        if(!sourceFolder && sourceFolderText.text!=""){
                sourceFolder=new Folder(sourceFolderText.text);
        }
    
        if(!outFolder && outFolderText.text!=""){
                outFolder=new Folder(outFolderText.text);
        }
        
        if(!sourceFolder){
            sourceFolder = Folder.selectDialog('Please select the folder to be crop:', Folder(prefs.sourceFolder));
        }
    
        if(!outFolder){
                outFolder = Folder.selectDialog('Please select the folder to output', Folder(prefs.outFolder));
        }
           
        parseUI();
        
        var files=getImageFiles(sourceFolder);
        for (var i = 0; i < files.length; i++) {
            cropFile(files[i]);
        }
            
         if(saveTable.length>0){
                var csvCnt=CSV.stringify(saveTable);              
                var outFile=new File(outFolder.fullName+"/"+sourceFolder.displayName+".csv");
                outFile.open("a");
                outFile.seek(0,2);
                outFile.write(csvCnt);
                outFile.close();
         }      
    }

    function cropFile(file){
        var doc=open(file);
        var width=doc.width;
        var height=doc.height;
        if(width==texSize.width && height==texSize.height){
            var bounds=cropOfAlpha(doc);
            var data=saveBounds(doc.name,texSize.width,texSize.height,bounds);
            saveTable.push(data);
            doc.save();
        }

        doc.close();
    }

    function cropOfAlpha(doc){
        //SetAlphaAsSelect();
        var alphaChannel=doc.channels.getByName (usedChannelName );
        doc.selection.load(alphaChannel);
         var bounds = doc.selection.bounds;
         doc.crop(bounds);         
          return bounds;
    }

     function saveBounds(name,width,height,bounds){
        var left= bounds[0].as("px");
        var top=bounds[1].as("px");
        var right=bounds[2].as("px");
        var bottom=bounds[3].as("px");
        //translate bound to the coordinate of left,bootom
         bottom=height-bottom;
         top=height-top;
         //normalize
         var nl=left/width;
         var nr=right/width;
         var nt=top/height;
         var nb=bottom/height;
          //save data
         var data=[];
         data.push(name);
         data.push(nl);
         data.push(nb);
         data.push(nr);
         data.push(nt); 
          return data;
     }


    function parseUI(){
        var w=parseInt(texWidthText.text);
        var h=parseInt(texHeightText.text);
        texSize={
                "width":w,
                "height":h
        };
        usedChannelName=channelNameText.text;
    }
    
    function showUI(){
        /*
        Code for Import https://scriptui.joonas.me — (Triple click to select): 
        {"activeId":21,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Dialog","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"EditText","parentId":4,"style":{"enabled":true,"varName":"channelName","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"Alpha 1","justify":"left","preferredSize":[0,0],"alignment":"right","helpTip":null}},"item-2":{"id":2,"type":"StaticText","parentId":4,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Channel:","justify":"left","preferredSize":[0,0],"alignment":"left","helpTip":null}},"item-4":{"id":4,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-8":{"id":8,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-9":{"id":9,"type":"Button","parentId":8,"style":{"enabled":true,"varName":"cropBtn","text":"Crop","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-10":{"id":10,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-11":{"id":11,"type":"StaticText","parentId":10,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"TexSize:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-12":{"id":12,"type":"EditText","parentId":10,"style":{"enabled":true,"varName":"texWidth","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"2048","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-14":{"id":14,"type":"EditText","parentId":10,"style":{"enabled":true,"varName":"texHeight","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"2048","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-15":{"id":15,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-16":{"id":16,"type":"StaticText","parentId":15,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Source:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-17":{"id":17,"type":"Button","parentId":15,"style":{"enabled":true,"varName":"selectSourceBtn","text":"Select","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-18":{"id":18,"type":"EditText","parentId":15,"style":{"enabled":true,"varName":"sourcePath","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"left","preferredSize":[220,23],"alignment":null,"helpTip":null}},"item-19":{"id":19,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-20":{"id":20,"type":"StaticText","parentId":19,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Out:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-21":{"id":21,"type":"EditText","parentId":19,"style":{"enabled":true,"varName":"outPath","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"left","preferredSize":[220,23],"alignment":null,"helpTip":null}},"item-22":{"id":22,"type":"Button","parentId":19,"style":{"enabled":true,"varName":"selectOutBtn","text":"Select","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,10,11,12,14,4,2,1,15,16,18,17,19,20,21,22,8,9],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"itemReferenceList":"None"}}
        */ 

        // DIALOG
        // ======
        var dialog = new Window("dialog"); 
            dialog.text = "Dialog"; 
            dialog.orientation = "column"; 
            dialog.alignChildren = ["center","top"]; 
            dialog.spacing = 10; 
            dialog.margins = 16; 

        // GROUP1
        // ======
        var group1 = dialog.add("group", undefined, {name: "group1"}); 
            group1.orientation = "row"; 
            group1.alignChildren = ["left","center"]; 
            group1.spacing = 10; 
            group1.margins = 0; 

        var statictext1 = group1.add("statictext", undefined, undefined, {name: "statictext1"}); 
            statictext1.text = "TexSize:"; 

        var texWidth = group1.add('edittext {properties: {name: "texWidth"}}'); 
            texWidth.text = "2048"; 

        var texHeight = group1.add('edittext {properties: {name: "texHeight"}}'); 
            texHeight.text = "2048"; 

        // GROUP2
        // ======
        var group2 = dialog.add("group", undefined, {name: "group2"}); 
            group2.orientation = "row"; 
            group2.alignChildren = ["left","center"]; 
            group2.spacing = 10; 
            group2.margins = 0; 

        var statictext2 = group2.add("statictext", undefined, undefined, {name: "statictext2"}); 
            statictext2.text = "Channel:"; 
            statictext2.alignment = ["left","top"]; 

        var channelName = group2.add('edittext {properties: {name: "channelName"}}'); 
            channelName.text = "Alpha 1"; 
            channelName.alignment = ["left","bottom"]; 

        // GROUP3
        // ======
        var group3 = dialog.add("group", undefined, {name: "group3"}); 
            group3.orientation = "row"; 
            group3.alignChildren = ["left","center"]; 
            group3.spacing = 10; 
            group3.margins = 0; 

        var statictext3 = group3.add("statictext", undefined, undefined, {name: "statictext3"}); 
            statictext3.text = "Source:"; 

        var sourcePath = group3.add('edittext {properties: {name: "sourcePath"}}'); 
            sourcePath.preferredSize.width = 220; 
            sourcePath.preferredSize.height = 23; 

        var selectSourceBtn = group3.add("button", undefined, undefined, {name: "selectSourceBtn"}); 
            selectSourceBtn.text = "Select"; 


        // GROUP4
        // ======
        var group4 = dialog.add("group", undefined, {name: "group4"}); 
            group4.orientation = "row"; 
            group4.alignChildren = ["left","center"]; 
            group4.spacing = 10; 
            group4.margins = 0; 

        var statictext4 = group4.add("statictext", undefined, undefined, {name: "statictext4"}); 
            statictext4.text = "Out:"; 

        var outPath = group4.add('edittext {properties: {name: "outPath"}}'); 
            outPath.preferredSize.width = 220; 
            outPath.preferredSize.height = 23; 

        var selectOutBtn = group4.add("button", undefined, undefined, {name: "selectOutBtn"}); 
            selectOutBtn.text = "Select"; 

        // GROUP5
        // ======
        var group5 = dialog.add("group", undefined, {name: "group5"}); 
            group5.orientation = "row"; 
            group5.alignChildren = ["left","center"]; 
            group5.spacing = 10; 
            group5.margins = 0; 

        var cropBtn = group5.add("button", undefined, undefined, {name: "cropBtn"}); 
            cropBtn.text = "Crop"; 
        
        //bind event
        //select source
        selectSourceBtn.onClick=function () {
            sourceFolder = Folder.selectDialog('Please select the folder to be crop:', Folder(prefs.sourceFolder));
            if(sourceFolder){
                sourcePath.text=sourceFolder.fullName;
            }
        }
        //select out
        selectOutBtn.onClick=function () {
            outFolder = Folder.selectDialog('Please select the folder to output', Folder(prefs.outFolder));
            if(outFolder){
                outPath.text=outFolder.fullName;
            }
        }      
        //crop btn
        cropBtn.onClick=doCrop;
        
        //out item
        sourceFolderText=sourceFolder;
        outFolderText=outFolder;
        texWidthText=texWidth;
        texHeightText=texHeight;
        channelNameText=channelName;
        
        dialog.show();
    }
    
    function main(){
        showUI();
    }


    main();
})();