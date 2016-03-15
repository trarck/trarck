struct _JSON
(	
private
    DotNetJsonCls,
  
	fn Init=
    (
        print "Json Init"
        dotNet.loadAssembly "fastJSON.dll"
        DotNetJsonCls = dotNetClass "fastJson.Json"
    ),
	_init=Init(),
public
	DotNetDictionary = dotNetClass "System.Collections.Generic.Dictionary`2[System.String, System.Object]",
	DotNetList = dotNetClass "System.Collections.Generic.Dictionary`1[System.Object]",
	fn Parse str =
	(
		local obj= DotNetJsonCls.Parse(str)
		print(obj)
		return obj
	),
	
	fn Stringify obj beautify:False =
	(
		local str= DotNetJsonCls.ToJson(obj)
		if beautify then
		(
			str = DotNetJsonCls.Beautify(str)
		)
		return str
	),
	
	fn CreateDictionary =
	(
		return dotNetObject DotNetDictionary
	),
	
	fn CreateList =
	(
		return dotNetObject DotNetList
	)
)
JSON=_JSON()
/*
d=JSON.Parse("{\"a\":1,\"b\":2}")
--d=dotnet.ValueToDotNetObject d json.DotNetDictionary
print d.item["a"]
print(JSON.Stringify d beautify:True)

a=#(1,2,3)
print(JSON.Stringify a beautify:True)

struct Test(a=1,b=2,c=3)
t=Test()

d=JSON.CreateDictionary()
d.Add "a" 1

print(JSON.Stringify d beautify:True)
*/