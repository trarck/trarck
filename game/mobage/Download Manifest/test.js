var Download=require('./Download').Download;
var Util=require('./Util').Util;

Download.downloadFile("http://putty.sp-app.mobage.cn/login/proto_database","weProtoDb.json","binary",function(data){
	console.log("save weProtoDb.json success");
});
// var url="http://spapp-a.mobage-platform.kr/13000016/android/a525fe611e56b356d7071dc04fc2da2a/";
// console.log(Util.md5(url));
// url="http://spapp-a.mobage-platform.kr/13000016/android/a525fe611e56b356d7071dc04fc2da2a"
// console.log(Util.md5(url));