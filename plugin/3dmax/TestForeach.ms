fn showProps obj =
(
    ps = getPropNames obj

    for p in ps do (
        val = getProperty obj p
        format (p as string + " = % , type is % \n") val (classof val)
    )
)

struct HEROES_CAMERA    
( 
    CamRef,
    BoneRefId,
    fn M =(),
private
    A=1

)

c=HEROES_CAMERA()
c.CamRef="a"
c.BoneRefId=2


showProps c

showProps([1,1,1])