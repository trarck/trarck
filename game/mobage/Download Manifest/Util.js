var crypto = require('crypto');

exports.Util={
	md5:function(str){
		// utils.info("MD5: " + fname);
		var hash = crypto.createHash ( "md5" );
		var data = hash.update ( str);
		var out = hash.digest ( "hex" );
		return out;
	},
	checkDirEndChar:function(dirStr){
		return dirStr.charAt(dirStr.length-1)=="/"?dirStr:dirStr+"/";
	}
}