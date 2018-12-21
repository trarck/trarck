var g_LibsScriptFolderPath="/d/projects/trarck/plugin/photoshop/libs/";

$.evalFile(g_LibsScriptFolderPath + "ps/Common.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/Log.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/defines/Constants.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/utils/DocumentUtil.jsx");

var IosIconCreator;
(function(){
    var IconSizes=[1024,180,167,152,144,120,114,100,87,80,76,72,60,58,57,50,40,29,20];
    IosIconCreator=function(options){
        this.options=options;
    };

    IosIconCreator.prototype={
         generate:function(){
            if(!this.options.inputFile){
                inputFile=File.openDialog('Please select icon file:');
                //inputFile=inputFile.fullName
            }else{
                    inputFile=new File(this.options.inputFile);
            }
                
            if(!this.options.baseName){
                this.options.baseName=inputFile.name;
            }
            
            if(!this.options.outDir){
                outDir=Folder.selectDialog('Please select out folder:');
                this.options.outDir=outDir.fullName
            }
        
            var doc=app.open(inputFile)
            
            for(var i=0;i<IconSizes.length;i++){
                this.createIcon(doc,IconSizes[i],IconSizes[i]);
            }            
        },
    
        createIcon:function(doc,width,height){
            app.activeDocument = doc;
            var duppedDocument = doc.duplicate();
            duppedDocument.resizeImage(UnitValue(width,"px"),UnitValue(height,"px"),null,ResampleMethod.BICUBIC);
            
            var fileName=this.options.baseName+"-"+width;
            var saveOptions={
                fileType:FileType.Png24,
                transparency:true,
                interlaced:true,
                destination:this.options.outDir
            }
            DocumentUtil.saveFile(duppedDocument, fileName, saveOptions);
            duppedDocument.close( SaveOptions.DONOTSAVECHANGES );
        }
		
    };    
})();
var ic=new IosIconCreator({
    //inputFile:"/d/t/1.png",
    //outDir:"d:\\t",
    baseName:null
    });
ic.generate();

