rollout rolloutAnimProps "Anim Props" width:200 height:600
(
    dotNetControl lv "System.Windows.Forms.ListView" width:180 height:320 align:#center
    checkbox cbUpdateTimeLine "Update timeline"
    local bUpdateTimeLine = true

    group "Properties"
    (
        label lblStartFrame "Start " align:#left
        label lblEndFrame "End " align:#left
        label lblProperty "" align:#left height:40
    )

    group "Anim Info"
    (
        label lblAnimInfo "Info " align:#left
        button btnSaveAnimInfo "Save" across:2
        button btnLoadAnimInfo "Load"
    )

    fn GetAnimInfoTrack=
    (
        local animInfoTrack = undefined
        local nNoteTracks = numNoteTracks rootNode
        if(  nNoteTracks > 0 ) then
        (
            for n=1 to nNoteTracks do 
            (
                animInfoTrack=getNoteTrack rootNode n
                if animInfoTrack.name =="AnimInfoTrack" then return animInfoTrack			
            )
            
	    )

	    return animInfoTrack

    )

    fn GetAnimInfoContent=
    (
        local animInfoTrack = GetAnimInfoTrack()
        if(animInfoTrack!=undefined) then
        (
            return animInfoTrack.Keys[1].value 
        )

        return ""

    )

    fn Initialize lv=
    (
        ClearListener()
        local items = #()

        lv.View = (dotNetClass "System.Windows.Forms.View").Details
        lv.FullRowSelect = true
        lv.Columns.Add "Animation Name" -2

        lv.Sorting = (dotNetClass "System.Windows.Forms.SortOrder").Ascending

        /* Check if there is a note track */
        local nNoteTracks = numNoteTracks rootNode

        if(nNoteTracks > 0) then
        (
            local track = getNoteTrack rootNode 1

            keys = track.Keys
            for i=1 to keys.count by 2 do
            (
                note = keys[i].value
                pos = (findString note "\n") - 2
                if (pos != undefined) then
                (
                    animationName = substring note 1 pos
                    item = dotNetObject "System.Windows.Forms.ListViewItem"
                    item.Text = animationName
                    append items item
                )
            )

            lv.Items.AddRange items
        )

        lblAnimInfo.Text= GetAnimInfoContent()
    )


    on cbUpdateTimeLine changed theState do
    (
        if(bUpdateTimeLine) then bUpdateTimeLine = false else bUpdateTimeLine= true
    )

    on rolloutAnimProps open do
    (
        Initialize lv
        cbUpdateTimeLine.Checked = true
    )

    on lv ItemSelectionChanged arg do
    (
        selectedAnimation = arg.Item
        track = getNoteTrack rootNode 1
        keys = track.Keys

        for i=1 to keys.count by 2 do
        (
            local note = keys[i].value
            local pos = (findString note "\n") - 2
            local animationName = substring note 1 pos
            if( animationName == selectedAnimation.Text) then
            (
                startTime = getNoteKeyTime track i
                endTime = getNoteKeyTime track (i + 1)

                if( bUpdateTimeLine) then
                (
                    animationrange = interval startTime endTime
                    slidertime = startTime
                )

                startLbl = "Start " + startTime as string
                endLbl = "End " + endTime as string
                startLen = startLbl.count-1
                endLen = endLbl.count-1

                lblStartFrame.Text = substring startlbl 1 startLen
                lblEndFrame.Text = substring endLbl 1 endLen
                lblProperty.Text = substring note (pos+3) -1
            )
        )
    )

    on btnSaveAnimInfo pressed  do
    (
        animInfoFile = getSaveFileName  \
			caption:"Animation Info" \
			types:"*.*" \
			historyCategory:"AnimInfoFolder"

        outStream = createfile animInfoFile
        local cnt = GetAnimInfoContent()
        format "%" cnt to:outStream

        close outStream
    )

    on btnLoadAnimInfo pressed  do
    (
        animInfoFile = getOpenFileName \
			caption:"Animation Info" \
			types:"*.*" \
			historyCategory:"AnimInfoFolder"

        if animInfoFile != undefined then
        (
            fileStream = openFile animInfoFile
                
            local content=""
            while not eof fileStream do
            (
                content+=readLine fileStream
            )

            local animInfoTrack = GetAnimInfoTrack()
            if(animInfoTrack == undefined) then
            (
                animInfoTrack = notetrack "AnimInfoTrack"
                addNoteTrack rootNode animInfoTrack

                local animInfoNote = AddNewNoteKey animInfoTrack 1
                animInfoNote.value=content
            )
            else
            (
                animInfoTrack.Keys[1].value = content	
            )

            lblAnimInfo.Text=content
        
         )
     )
)

macroscript AnimationProperties category:"Taylor Mouse's Tools" ( CreateDialog rolloutAnimProps )