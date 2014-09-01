var fs=require('fs');
var Download=require('./Download').Download


var cardRequestUrl="http://xj001.mengjianghu.cn/starwar_sina/public/weibo/Cn/swf/resource/cn/img/card/";
var cnt=fs.readFileSync("allcard.json");
var json=JSON.parse(cnt);
var cards=json.data;

var card;
var imageName;
for(var key in cards){
	for(var i=0;i<cards[key].length;i++){
		card=cards[key][i];
		console.log("download "+card.Id);
		for(var j=1;j<=3;j++){
			imageName=card.ImageId+"_"+j+".jpg";
			Download.downloadFile(cardRequestUrl+imageName,"card/"+imageName,"binary");
		}
	}
}
