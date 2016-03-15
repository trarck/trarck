(
    GLOBAL SavePath= pathConfig.getCurrentProjectFolder() + "\\Models\\Heroes\\"
    GLOBAL bReplaceOldFile=false

    fn CreateNewScene =
    (
        setSaveRequired false
        
        clearUndoBuffer()

        actionMan.executeAction 0 "16"
    )

    fn HideLayer layerName =
    (
        layer = LayerManager.GetLayerFromName layerName
        if(layer != undefined) then
        (
            layer.IsHidden=true
        )
	)
    
    fn SelectAllVisibleObjects =
    (
        objs=#()

        for obj in objects do
        (
            if obj.IsHidden==false then
            (
                append objs obj
            )
        )

        if objs.count>0 then
        (
            select objs
        )

        select objs
    )

    fn IsExportFileExists filepath =
    (
        currentFilename = getFilenameFile filepath
        exportFilePath= SavePath+currentFilename+".FBX"
        return DoesFileExist exportFilePath
    )

    fn ExplodeFile filepath=
    (
        print("parse:"+filepath)

        --CreateNewScene()
        
        ClearListener()

        loadMaxFile filepath quiet:true

        --HideLayer("HitTestFuzzy")
        --HideLayer("Vol_Target")

        SelectAllVisibleObjects()
        
        currentFilename = getFilenameFile filepath
        exportFilePath= SavePath+currentFilename+".FBX"
        
        print("Save:"+exportFilePath)

        exportfile exportFilePath #noPrompt selectedOnly:true
    )

    fn ExplodeFromDir dir =
    (
        files = getFiles (dir +"/*.max")
        for file in files do
        (
            if NOT IsExportFileExists(file) OR bReplaceOldFile then
            (
                ExplodeFile file
            )
        )
    )
    
    --ExplodeFromDir "E:\3dmax\Storm\Units\Mercs"
    ExplodeFile "E:\3dmax\Storm\Units\Heroes\Storm_Hero_Artanis_Base.max"
    --loadMaxFile "E:\3dmax\Storm\Units\Heroes\Storm_Hero_Abathur_Pajamathur.max"

    /**********************************************************************************************************************************
        CREATE THE UTILITY
    **********************************************************************************************************************************/
    UTILITY HeroesOfTheStormExport "Export Storm"
    (
        Group "Model export"
        (
            EditText txtSelectedFile "From" align:#left
            Button bSelectFile "select file ..." align:#right

            EditText txtSaveFile "Save" align:#left
            Button bSelectSaveFile "select file ..." align:#right
            
            CheckBox cbReplaceOldFile "Replace old File"

            Button bGo "Export..." height:35 width:100
        )

        on HeroesOfTheStormExport OPEN DO
        (
            cbReplaceOldFile.Checked = false
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

        ON cbReplaceOldFile CHANGED theState do
        (
            if bReplaceOldFile then
            (
                bReplaceOldFile=false
            )
            else
            (
                bReplaceOldFile=true
            )
           
        )

        On bGo PRESSED do
        (
            setWaitCursor()
            SavePath = txtSaveFile.Text+ "\\"
            ExplodeFromDir txtSelectedFile.Text
            setArrowCursor()
        )
    )
)