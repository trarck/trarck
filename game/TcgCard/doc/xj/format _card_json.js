var fs=require('fs');

var cnt=fs.readFileSync("allcards.json");
var json=JSON.parse(cnt);
fs.writeFileSync("allcard2.json",JSON.stringify(json,null,4));
