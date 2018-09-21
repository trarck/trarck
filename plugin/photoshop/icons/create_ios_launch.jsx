var g_LibsScriptFolderPath="/d/projects/trarck/plugin/photoshop/libs/";

$.evalFile(g_LibsScriptFolderPath + "ps/Common.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/Log.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/defines/Constants.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/utils/DocumentUtil.jsx");

var IosLaunchCreator;
(function(){
    var LaunchSizes=[ [1125,2436]
    ,[2436,1125],[1242,2208],[750,1334],[2208,1242],[640,960],[640,1136],[768,1024],[1536,2048],[1024,768],[2048,1536],
       [320,480],[960,640],[768,1004],[1536,2008],[1024,748],[2048,1496]
    ];
    var LaunchType={
        Portrait:1,
        Landscape:2
    };

    IosLaunchCreator=function(options){
        this.options=options;
    };

    IosLaunchCreator.LaunchType=LaunchType;
    
    IosLaunchCreator.prototype={
         generate:function(){
            if(!this.options.inputFile){
                inputFile=File.openDialog('Please select icon file:');
                //inputFile=inputFile.fullName
            }else{
                    inputFile=new File(this.options.inputFile);
            }
        
            if(!this.options.outDir){
                outDir=Folder.selectDialog('Please select out folder:');
                this.options.outDir=outDir.fullName
            }
        
            var doc=app.open(inputFile)
            
            for(var i=0;i<LaunchSizes.length;i++){
                this.createLaunch(doc,LaunchSizes[i][0],LaunchSizes[i][1]);
            }            
        },
        
        getLanunchType:function(width,height){
            return width>height?LaunchType.Landscape:LaunchType.Portrait;
        },
        
        createLaunch:function(doc,width,height){
            app.activeDocument = doc;
            var duppedDocument = doc.duplicate();
            
            //检查输入图片方向
            var inputLaunchType=this.options.launchType || LaunchType.Landscape;
            var outLaunchType=this.getLanunchType(width,height)
            if (inputLaunchType!=outLaunchType){
                duppedDocument.rotateCanvas(90)
            }
            
            //duppedDocument.resizeCanvas(UnitValue(width,"px"),UnitValue(height,"px"),AnchorPosition.MIDDLECENTER);
            duppedDocument.resizeImage(UnitValue(width,"px"),UnitValue(height,"px"),null,ResampleMethod.BICUBIC);
            var fileName=this.options.baseName+"-"+width+"x"+height;
            var saveOptions={
                fileType:FileType.Png24,
                transparency:true,
                interlaced:true,
                destination:this.options.outDir
            }
            DocumentUtil.saveFile(duppedDocument, fileName, saveOptions);
            duppedDocument.close( SaveOptions.DONOTSAVECHANGES );
        },
        createUseCut:function(doc,width,height){
            app.activeDocument = doc;
            var duppedDocument = doc.duplicate();
            //检查输入图片方向
            var inputLaunchType=this.options.launchType || LaunchType.Landscape;
            
            //duppedDocument.resizeCanvas(UnitValue(width,"px"),UnitValue(height,"px"),AnchorPosition.MIDDLECENTER);
            duppedDocument.resizeImage(UnitValue(width,"px"),UnitValue(height,"px"),null,ResampleMethod.BICUBIC);
            var fileName=this.options.baseName+"-"+width+"x"+height;
            var saveOptions={
                fileType:FileType.Png24,
                transparency:true,
                interlaced:true,
                destination:this.options.outDir
            }
            DocumentUtil.saveFile(duppedDocument, fileName, saveOptions);
            duppedDocument.close( SaveOptions.DONOTSAVECHANGES );
        },
        createUseScale:function(doc,width,height){
            app.activeDocument = doc;
            var duppedDocument = doc.duplicate();
            //检查输入图片方向
            var inputLaunchType=this.options.launchType || LaunchType.Landscape;
            
            //duppedDocument.resizeCanvas(UnitValue(width,"px"),UnitValue(height,"px"),AnchorPosition.MIDDLECENTER);
            duppedDocument.resizeImage(UnitValue(width,"px"),UnitValue(height,"px"),null,ResampleMethod.BICUBIC);
            var fileName=this.options.baseName+"-"+width+"x"+height;
            var saveOptions={
                fileType:FileType.Png24,
                transparency:true,
                interlaced:true,
                destination:this.options.outDir
            }
            DocumentUtil.saveFile(duppedDocument, fileName, saveOptions);
            duppedDocument.close( SaveOptions.DONOTSAVECHANGES );
        },
		
    };    
})();
var ic=new IosLaunchCreator({
    //inputFile:"/d/t/1.png",
    //outDir:"d:\\t",
    baseName:"zz"
    });
ic.generate();

