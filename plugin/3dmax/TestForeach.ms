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

print(classof c)
ps = getPropNames c

for p in ps do (
val = getProperty c p
format (p as string + " = % , type is % \n") val (classof val)
)