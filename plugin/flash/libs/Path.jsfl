var yh;
(function(yh){
    yh.Path={
        /**
         * 取得文件基本名称
         * @param filePath
         * @returns {*}
         */
        basename:function (aPath,ext){
            var pos=aPath.lastIndexOf("/");
            if(pos!=-1){
                var basename=aPath.substr(pos+1);

                if(ext){
                    var extPos=basename.lastIndexOf(ext);
                    if(extPos!=-1){
                        basename= basename.substring(0,extPos);
                    }
                }
                return basename;
            }
            return aPath;
        },

        extname:function(aPath){
            var pos=aPath.lastIndexOf(".");
            if(pos!=-1){
                return aPath.substr(pos);
            }
            return "";
        },

        dirname:function(aPath){
            var pos=aPath.lastIndexOf("/");
            if(pos!=-1){
                return aPath.substr(0,pos);
            }
            return aPath;

        },

        checkDirPath:function(dirPath){
            if(!dirPath) return "";

            var lastChar=dirPath.charAt(dirPath.length-1);
            if(lastChar!="/"){
                dirPath=dirPath+"/";
            }
            return dirPath;
        }
    };
})(yh || (yh={}));

//var yh;
//(function(yh){
//})(yh || (yh={}));
