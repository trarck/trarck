(
    GLOBAL SavePath= pathConfig.getCurrentProjectFolder() + "\\Models\\Heroes\\"

    fn CreateNewScene =
    (
        actionMan.executeAction 0 "16"
    )

    fn FixMaterialPath =
    (
        for bmt in getClassInstances bitmaptex do
        (
			--print bmt.filename
            pos = findString bmt.filename "Textures"
            if pos!=undefined AND pos!=1 then
            (
                bmt.filename = substring bmt.filename pos -1
            )
        )
    )


    fn FixTextureInFile filepath=
    (
        CreateNewScene()
        
        loadMaxFile filepath

        FixMaterialPath()

        checkForSave() 
        --saveMaxFile(maxFilePath + maxFileName)
    )

    fn FixFromDir dir =
    (
        files = getFiles (dir +"/*.max")
        for file in files do
        (
            FixTextureInFile file
        )

        --sub dir
        dirs= getDirectories(dir+"/*")
        for subDir in dirs do
        (
            FixFromDir subDir
        )    
    )

    --FixTextureInFile "dd"
    /**********************************************************************************************************************************
        CREATE THE UTILITY
    **********************************************************************************************************************************/
    UTILITY FixTexturePath "Fix Texture Path"
    (
        Group "Model Fix"
        (
            EditText txtSelectedFile "From" align:#left
            Button bSelectFile "select file ..." align:#right


            Button bGo "Fix..." height:35 width:100
        )

        ON bSelectFile PRESSED DO
        (

            local path = getSavePath \
                caption:"Heroes of the Storm" \
                initialDir:"E:\3dmax\Storm\Units\Heroes"

            if(path!=undefined ) then txtSelectedFile.Text = path
        )

        On bGo PRESSED do
        (
            FixFromDir txtSelectedFile.Text
        )
    )
)