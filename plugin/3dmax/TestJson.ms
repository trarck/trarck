(
dotNet.loadAssembly "fastJSON.dll"

MyJson = dotNetClass "fastJson.Json"

local obj = MyJson.Parse("{\"a\":1}")
Dict=dotNetClass "System.Collections.Generic.Dictionary`2[System.String, System.Object]"
d=dotnet.ValueToDotNetObject obj Dict
print d.item["a"]

d.Add "b" 2
d.Add "c" "CCCCC"

local s=MyJson.ToJSON(d)
print s

for i=10 to 1 by -1 do print i
)