for bmt in getClassInstances bitmaptex do
(
    print bmt.filename
    pos = findString bmt.filename "Textures"
    if pos!=undefined then
    (
        bmt.filename = substring bmt.filename pos -1
    )
)