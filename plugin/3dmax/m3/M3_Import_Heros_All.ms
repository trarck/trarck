include  "M3_Import_Heros_Lib.ms"

GLOBAL SavePath= pathConfig.getCurrentProjectFolder() + "\\Units\\Heroes\\"
GLOBAL CurrentPath=""
GLOBAL bReplaceOldFile = false
GLOBAL bIgnoreDeath = false

fn CreateNewScene =
(
    actionMan.executeAction 0 "16"
)

fn IsHero filename =
(
    return findString filename "Storm_Hero" != undefined
)

fn IsAnimation filename =
(
    return findString filename "Anims" != undefined
)

fn IsDeath filename=
(
    parts=filterString  filename "_"

    return parts[parts.count] == "Death"
)

fn GetSkinName filename=
(
    parts=filterString  filename "_"

    return parts[parts.count]
)

fn GetParentRequiredAnimsName filename=
(
    parts=filterString  filename "_"

    animsName=""
    for i = 1 to parts.count-1 do
    (
        animsName+=parts[i]+"_"
    )
    return animsName+"RequiredAnims"
)

fn GetBaseRequiredAnimsName filename=
(
    return filename+"_RequiredAnims"
)

fn GetRequiredAnimsName filename=
(
    requiredAnims = GetBaseRequiredAnimsName filename
    requiredAnimsPath= pathConfig.appendPath CurrentPath requiredAnims

    if (DoesFileExist requiredAnimsPath) then
    (
        return requiredAnimsPath
    )  

    requiredAnims = GetParentRequiredAnimsName filename
    requiredAnimsPath= pathConfig.appendPath CurrentPath requiredAnims
    if (DoesFileExist requiredAnimsPath) then
    (
       return requiredAnimsPath
    )    
    
    return undefined   
)

fn SaveToUnitFile filename =
(
    filepath = SavePath + filename +".max"
    SaveMaxFile(filepath)
)

fn IsUnitFileExists filename=
(
    filepath = SavePath + filename +".max"
    return DoesFileExist filepath
)

fn GetModleFile modelDir =
(
    files = getFiles (modelDir+"/*.m3")

    --if(files.count>1) then
    --   print files

    /*
    afiles = getFiles (modelDir+"/*.m3a")

    if(afiles.count>0) then
        print afiles
    */

    return files[1]
)

fn GetAnimsFile animsDir =
(
    files = getFiles (animsDir +"/*.m3a")

    --if(files.count>1) then
   --     print files

    if files.count==0 then return undefined
    
    --version anims
    for i=files.count to 1 by -1 do
    (
        if (findString files[i] "_v")!=undefined then
        (
            return files[i]
        )
    )

    --name as folder
    folderName=getFilenameFile animsDir
    for i= 1 to files.count do
    (
        if (getFilenameFile files[i]) == folderName then
        (
            return files[i]
        )
    )

    return files[1]
)

fn FixMaterialPath =
(
    for bmt in getClassInstances bitmaptex do
    (
        -- print bmt.filename
        pos = findString bmt.filename "Textures"
        if pos!=undefined then
        (
            bmt.filename = substring bmt.filename pos -1
        )
    )
)

fn ImportM3 filename=
(
    CreateNewScene()

    modelPath=pathConfig.appendPath CurrentPath filename
    
    modelFile=GetModleFile(modelPath)
    --import model
    ImportModel modelFile

    --import anims
    --death not import Required animations
    if( NOT (bIgnoreDeath AND IsDeath(filename)) ) then
    (
        requiredAnimsPath= GetRequiredAnimsName filename
        if (requiredAnimsPath!=undefined) then
        (
           animsFile=GetAnimsFile(requiredAnimsPath)
           print("filename:"+filename+"->anims:" + animsFile)
           ImportAnimations animsFile
        )  
        else
        (
            print ("no ext anims perhaps in model file:"+filename)
        )
    )
    --fix path 
    FixMaterialPath()
    
    --save to max file
    SaveToUnitFile filename
)

fn ImportM3FromDir dir=
(
    CurrentPath=dir

    print("parse:"+CurrentPath)

    dirArray=GetDirectories(dir+"/*")

    for d in dirArray do
    (
        filename=trimRight (filenameFromPath  d) "/\\"

        if NOT IsAnimation(filename) AND  ((findString d "DeathRagdoll")==undefined) then
        (
            if NOT IsUnitFileExists(filename) OR bReplaceOldFile then
            (
                ImportM3(filename)
            )
        )
    )
)

--ImportM3FromDir("E:/cascview-en64/Heros/mods/heroes.stormmod/base.stormassets/Assets/Units/Heroes")

/**********************************************************************************************************************************
	CREATE THE UTILITY
**********************************************************************************************************************************/
UTILITY HeroesOfTheStormImport "TM's M3 Import All (v2.1)"
(
	Group "Model Import"
	(
		Label lbl1 "Supports" align:#left
		Label lbl2 "- StarCraft 2" align:#left
		Label lbl3 "- Heroes of the Storm" align:#left
		Label lbl20
		Label lbl30 "?015 by Taylor Mouse"
		Label lbl10 "v2.1"

		CheckBox cbUseSC2ArtTools "Use SC2 Art Tools"

		EditText txtSelectedFile "From" align:#left
		Button bSelectFile "select file ..." align:#right

        EditText txtSaveFile "Save" align:#left
		Button bSelectSaveFile "select file ..." align:#right

		Label lbl100 "Import:" align:#left
		CheckBox cbBuildMat "Materials"
		CheckBox cbBuildBones "Bones" tooltip:"Unchecking this will uncheck all depending checkboxes aswell"
		CheckBox cbBuildVolTarget "Volume Targets"
		CheckBox cbBuildHitTest "Hit Tests"
		CheckBox cbBuildAtt "Attachments"
		CheckBox cbBuildAnim "Animations"
		CheckBox cbBuildSkin "Skin"
		CheckBox cbSaveAnimInfo "Save Animation Info"
        CheckBox cbReplaceOldFile "Replace old File"
        CheckBox cbIgnoreDeath "Ignore Death"

		Button bGo "Import..." height:35 width:100

	)

	on HeroesOfTheStormImport OPEN DO
	(
		cbBuildBones.Checked = true
		cbBuildVolTarget.Checked = true
		cbBuildHitTest.Checked = true
		cbBuildAtt.Checked = true
		cbBuildAnim.Checked = true
		cbBuildMat.Checked = true
		cbBuildSkin.Checked = true
		cbUseSC2ArtTools.Checked = false
		cbSaveAnimInfo.Checked = true

        cbReplaceOldFile.Checked = false
        cbIgnoreDeath.Checked = false
	)

	on cbBuildBones CHANGED theState do
	(
		if(bBuildBones) then
		(
			bBuildBones = false
			bBuildHitTest = false
			bBuildAtt = false
			bBuildAnim = false
			bBuildVolTarget = false
			bBuildSkin = false

			cbBuildVolTarget.Checked = false
			cbBuildHitTest.Checked = false
			cbBuildAtt.Checked = false
			cbBuildAnim.Checked = false
			cbBuildSkin.Checked = false
		)
		else
		(
			bBuildBones = true
		)

	)

	on cbUseSC2ArtTools CHANGED theState do
	(
		if ( bUseSC2ArtTools == true ) then
		(	bUseSC2ArtTools = false )
		else
		(	bUseSC2ArtTools = true )


	)

	on cbBuildSkin CHANGED theState do
	(
		if( bBuildBones == true ) then
		(
			if(bBuildSkin) then bBuildSkin = false else bBuildSkin = true
		)
		else
		( cbBuildSkin.Checked = false )
	)


	on cbBuildHitTest CHANGED theState do
	(
		if( bBuildBones == true ) then
		(
			if(bBuildHitTest) then bBuildHitTest = false else bBuildHitTest = true
		)
		else
		( cbBuildHitTest.Checked = false )
	)


	on cbBuildAtt CHANGED theState do
	(
		if( bBuildBones == true ) then
		(
			if(bBuildAtt) then bBuildAtt = false else bBuildAtt = true
		)
		else
		( cbBuildAtt.Checked = false )
	)

	on cbBuildAnim CHANGED theState do
	(
		if( bBuildBones == true ) then
		(
			if(bBuildAnim) then bBuildAnim = false else bBuildAnim = true
		)
		else
		( cbBuildAnim.Checked = false )
	)

	on cbBuildVolTarget CHANGED theState do
	(
		if( bBuildBones == true ) then
		(
			if(bBuildVolTarget) then bBuildVolTarget = false else bBuildVolTarget = true
		)
		else
		( cbBuildVolTarget.Checked = false )
	)

	on cbSaveAnimInfo CHANGED theState do
	(

		if(bSaveAnimationInfo) then 
		(	
			bSaveAnimationInfo = false
		)
		else 
		(
			bSaveAnimationInfo = true
		)

	)


	ON bSelectFile PRESSED DO
	(

		local path = getSavePath \
			caption:"Heroes of the Storm" \
            initialDir:"E:\cascview-en64\Heros\mods\heroes.stormmod\base.stormassets\Assets\Units\Heroes"

        try
        ( 
            x = SC2_Standard_Material()
        )
        catch
        (
            bUseSC2ArtTools = false
            cbUseSC2ArtTools.Checked = false
        )
                
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
		setWaitCursor()
		if(txtSelectedFile.Text != undefined and (DoesFileExist txtSelectedFile.Text )) then
		(
            SavePath = txtSaveFile.Text+ "/"

			ImportM3FromDir txtSelectedFile.Text

			--enableSceneRedraw()
			--redrawViews()

			PRINT "DONE"
		)
		enableSceneRedraw()
		RedrawViews()
		setArrowCursor()
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

    ON cbIgnoreDeath CHANGED theState do
    (
        if bIgnoreDeath then
        (
            bIgnoreDeath=false
        )
        else
        (
            bIgnoreDeath=true
        )
       
    )
    
)

