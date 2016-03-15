struct JsonStringify
(
private
	CTRL= "\r\n",
	indent = "",
	mind = "",	
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

	fn toStr key holder=
	(
		local val 

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
					Array:
					(
						mind=gap
						gap += indent
						
						partial = #()
						for i=1 to val.count do
						(
							partial[i]=toStr i val
						)
						if gap=="" then
							v= "["+(join_array partial ",")+"]"
						else
							v= "["+CTRL+gap+(join_array partial (","+CTRL+gap))+ CTRL+ mind +"]"
						gap=mind
						return v
					)
				)
			)
			StructDef:
			(
				mind=gap
				
				gap += indent
				
				local props=getPropNames val		
				partial = #()
				
				for k in props do (
					k = k as string								
					v = toStr k val
					append partial (quote(k) + ":" +v) 
				)
				
				if gap=="" then
					v= "{"+(join_array partial ",")+"}"
				else
					v= "{"+CTRL+gap+(join_array partial (","+CTRL+gap))+ CTRL+ mind +"}"
				
				gap=mind
				return v
			)
		)
		
		return ""
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



struct Test(a,b,c,d)

t=Test()
t.a=1
t.b="2"
t.c=3 --#(1,"2",3)
t.d=4

/*Test()
t.d.a=11
t.d.b=22
t.d.c=33
t.d.d=44
*/
Json=JsonStringify()

s=Json.stringify t space:4
print(s)
	
animInfoFile = createfile "tst.json"

format "%" s to:animInfoFile

close animInfoFile