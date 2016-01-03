(
    GLOBAL SavePath= "E:\unity\Storm\Assets\Textures"


    fn CollectMaxFile filepath=
    (       
        loadMaxFile filepath
        
        for bmt in getClassInstances bitmaptex do
        (
            --print bmt.filename
            
            -- copy to dest

            textureFile=pathConfig.appendPath (pathConfig.getCurrentProjectFolder()) (bmt.filename)
            
            textureName= currentFilename = filenameFromPath bmt.filename

            destTextureFile = pathConfig.appendPath SavePath textureName
            
            print("copy:"+textureFile+"->"+destTextureFile)

            copyFile textureFile destTextureFile
         )
    )

    fn CollectFromDir dir =
    (
        files = getFiles (dir +"/*.max")
        for file in files do
        (
            CollectMaxFile file
        )
    )
    
    --CollectMaxFile "E:\3dmax\Storm\Units\Heroes\Storm_Hero_Abathur_Base.max"

    /**********************************************************************************************************************************
        CREATE THE UTILITY
    **********************************************************************************************************************************/
    UTILITY CollectTexture "Collect Texture"
    (
        Group "Model export"
        (
            EditText txtSelectedFile "From" align:#left
            Button bSelectFile "select file ..." align:#right

            EditText txtSaveFile "Save" align:#left
            Button bSelectSaveFile "select file ..." align:#right
            
            Button bGo "Collect..." height:35 width:100
        )

        on HeroesOfTheStormExport OPEN DO
        (

        )

        ON bSelectFile PRESSED DO
        (

            local path = getSavePath \
                caption:"Heroes of the Storm" \
                initialDir:"E:\3dmax\Storm\Units\Heroes"

            if(path!=undefined ) then txtSelectedFile.Text = path
        )

        ON bSelectSaveFile PRESSED DO
        (

            local path = getSavePath \
                caption:"Heroes of the Storm" \
                initialDir:SavePath
                    
            if(path!=undefined ) then txtSaveFile.Text = path
        )

        On bGo PRESSED do
        (
            SavePath = txtSaveFile.Text+ "/"
            CollectFromDir txtSelectedFile.Text
        )
    )
)