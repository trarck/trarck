struct JsonStringify
(
private
	CTRL= "\r\n",
	indent = "",
	gap = "",
	
	fn quote str =
	(
		return "\""+str+"\""
	),

	fn join_array arr sp =
	(
		local s=""
		for i=1 to arr.count-1 do
		(
			s+=arr[i] as string +  sp
		)
		
		s+=arr[arr.count]
		return s
	),
	
	fn color_to_str val=
	(
		return "{"+ quote("r") + ":" + val.red as string + ","+ quote("g") + ":" + val.green  as string + ","+ quote("b") + ":" + val.blue  as string + ","+ quote("a") + ":" + val.alpha  as string+"}"
	),
	
	fn vector2_to_str val=
	(
 		return "{"+quote("x")+":"+val.x as string+","+quote("y")+":"+val.y as string+"}" 
	),
	
	fn vector3_to_str val=
	(
		return "{"+quote("x")+":"+val.x as string+","+quote("y")+":"+val.y as string+","+quote("z")+":"+val.z as string+"}"
	),
	
	fn vector4_to_str val=
	(
		return "{"+quote("x")+":"+val.x as string+","+quote("y")+":"+val.y as string+","+quote("z")+":"+val.z as string+","+quote("w")+":"+val.w as string+"}"
	),
	
	fn matrix3_to_str val=
	(
		local str= "["
		--row1
		str+="["+val.row1[1] as string+","+val.row1[2] as string+","+val.row1[3] as string+"],"
		--row2
		str+="["+val.row2[1] as string+","+val.row2[2] as string+","+val.row2[3] as string+"],"
		--row3
		str+="["+val.row3[1] as string+","+val.row3[2] as string+","+val.row3[3] as string+"],"
		--row4
		str+="["+val.row4[1] as string+","+val.row4[2] as string+","+val.row4[3] as string+"]"
		str+="]"
		return str
	),
	
	fn bigMatrix_to_str val=
	(
		local mind=gap
		gap +=indent
		local str= "["+CTRL
		for i=1 to val.rows do
		(
			local strRow=gap+"["
			for j=1 to val.columns do
			(
				strRow+= val[i][j] as string
				if j!=val.columns then strRow+=","
			)
			
			strRow +="]"			
			
			str+=strRow
			if i!=val.rows then str+=","
				
			str +=CTRL			
		)
		str+=mind+"]"
		gap=mind
		return str
	),
	
	fn box2_to_str val=
	(
		return "{"+quote("x")+":"+val.x as string+","+quote("y")+":"+val.y as string+","+quote("w")+":"+val.w as string+","+quote("h")+":"+val.h as string+"}"
	),
	
	fn toStr key holder=
	(
		local val 
		local mind=gap
		
		if classof key == Integer then
		(	
			val = holder[key]
		)
		else
		(
			val = getProperty holder key
		)
		
		if val==undefined then return "null"
		
		
		local superType = SuperClassOf val
		local partial
		local k
		local v
		case superType of
		(
			Number:return val as string
			Value:
			(
				local valType= classof val
				case valType of
				(
					String : return quote val
					BooleanClass :return val as string
					Color:return color_to_str val
					Point2:return vector2_to_str val
					Point3:return vector3_to_str val
					Point4:return vector4_to_str val
					Quat:return vector4_to_str val
					EulerAngles:return vector3_to_str val
					Matrix3:return matrix3_to_str val
					BigMatrix:return bigMatrix_to_str val
					Box2:return box2_to_str val
					Array:
					(
						gap += indent
						
						partial = #()
						for i=1 to val.count do
						(
							partial[i]=toStr i val
						)
						
						if partial.count>0 then
						(
							if gap=="" then
								v= "["+(join_array partial ",")+"]"
							else
								v= "["+CTRL+gap+(join_array partial (","+CTRL+gap))+ CTRL+ mind +"]"
						)
						else
						(
							v="[]"
						)
						gap=mind
						return v
					)
				)
			)
			StructDef:
			(				
				gap += indent
				
				local props=getPropNames val		
				partial = #()
				
				for k in props do (
					k = k as string								
					v = toStr k val
					append partial (quote(k) + ":" + v) 
				)
				
				if partial.count>0 then
				(
					if gap=="" then
						v= "{"+(join_array partial ",")+"}"
					else
						v= "{"+CTRL+gap+(join_array partial (","+CTRL+gap))+ CTRL+ mind +"}"
				)
				else
				(
					v="{}"
				)
				gap = mind
				return v
			)
		)
		
		return "null"
	),

	
public
	fn stringify obj space: =
	(
		indent = ""
		gap=""
		if space!=undefined then
		(
			for i=1 to space do
			(
				indent += " "
			)
		)
		toStr 1 #(obj)
	)
)

/*
struct Item(a,b,c,d)
struct Test(a,b,c,d,m,bm)

t=Test()
t.a=1
t.b="2"
t.c=#(1,"2",3)
t.d=Item()
t.d.a=[1,1]
t.d.b=[1,1,1]
t.d.c=[1,1,1,1]
t.d.d=color 1 1 1

t.m=matrix3 1

bm1=bigmatrix 2 2
for i=1 to 2 do for j=1 to 2 do bm1[i][j]=random 0 10
t.bm=bm1

Json=JsonStringify()

s=Json.stringify t space:4
print(s)
	
animInfoFile = createfile "tst.json"

format "%" s to:animInfoFile

close animInfoFile
*/