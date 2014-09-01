exports.Date = {
    defaultFormat:"Y-m-d H:i:s",
    /**
     * php风格的日期格式化
     * 实现常用格式
     * @param {String} format
     * @param {Date} date
     * @return String
     */
    format: function(date,format) {
        var c = sOutput = '', l = 1,format=format||this.defaultFormat;
        for (var i = 0; i < format.length; i++) {
            c = format.charAt(i);
            l = 1;
            switch (c) {
                case "y":
                    c = date.getFullYear().toString().substr(2, 2);
                    l=2;
                    break;
                case "Y":
                    c = date.getFullYear();
                    l=4;
                    break;
                case "m":
                    c = date.getMonth() + 1;
                    l=2;
                    break;
                case "n":
                    c = date.getMonth() + 1;
                    l=0;
                    break;
                case "d":
                    c = date.getDate();
                    l=2;
                    break;
                case "j":
                    c = date.getDate();
                    l=0;
                    break;
                case "w":
                    c = date.getDay();
                    l = 0;
                    break;
                case "h":
                    c = date.getHours() % 12;
                    l=2;
                    break;
                case "H":
                    c = date.getHours();
                    l=2;
                    break;
                case "i":
                    c = date.getMinutes();
                    l=2;
                    break;
                case "s":
                    c = date.getSeconds();
                    l=2;
                    break;
                case "S":
                    c = date.getMilliseconds();
                    l = 3;
                    break;
                default:
                    l=0;
                    break;
            }
            sOutput +=l==0?c:this.pad(c,l);
        }
        return sOutput;
    },

    /**
     * php风格的字段串生成日期
     *
     * @param {String} format
     * @param {String} sDate
     * @return Date
     */
    parse: function(sDate,format) {
        var ret = [1970, 0, 1, 0, 0, 0, 0],format=format||this.defaultFormat;
        var data= {
            v: sDate,
            i: 0
        };
        for (var iFormat = 0; iFormat < format.length; iFormat++) {
            switch (format.charAt(iFormat)) {
                case 'd':
                    ret[2] = this.getNumber('d', data);
                    break;
                case 'm':
                    ret[1] = this.getNumber('m', data) - 1;
                    break;
                case 'y':
                    ret[0] = this.getNumber('y', data);
                    break;
                case 'Y':
                    ret[0] = this.getNumber('Y', data);
                    break;
                case 'h':
                case 'H':
                    ret[3] = this.getNumber('y', data);
                    break;
                case 'i':
                    ret[4] = this.getNumber('y', data);
                    break;
                case 's':
                    ret[5] = this.getNumber('y', data);
                    break;
                case 'S':
                    ret[6] = this.getNumber('y', data);
                    break;
                default:
                    data.i++;
                    break;
            }
        }
        return new Date(ret[0], ret[1], ret[2], ret[3], ret[4], ret[5], ret[6]);
    },
    /**
     * 倒计时
     * format 秒，分，时，天
     */
    countDown:function  (sec,format,showPrefix) {
        var data=this.getCountDownTimes(sec),sOutput="",highIsShow=false;
        format=format||[{sep:"",pad:2,padChar:"0"},{sep:":",pad:2,padChar:"0"},{sep:":",pad:1,padChar:"0"},{sep:" "}];
        //prefix
        if(showPrefix){
            if(data.length<format.length){
                for(var j=format.length-1;j>=format.length;j--){
                    if(format[j].pad){
                        break;
                    }
                }
                for(var i=0,k=j-data.length;i<=k;i++){
                    data.push(0);
                }
            }
        }
        
        for(var i=data.length-1;i>=0;i--){
            if(highIsShow||data[i]||(showPrefix && format[i].pad)){
                sOutput+=(format[i].pad?this.pad(data[i],format[i].pad,format[i].padChar):data[i])+format[i].sep;
                highIsShow=true;
            }
        }
        return sOutput;
    },
    getCountDownTimes:function(sec){
        var divisors=[24,60,60],ret=[],divisor,s="";
        while(divisors.length){
            divisor=divisors.pop();
            ret.push(sec%divisor);
            sec=Math.floor(sec/divisor);
        }
        ret.push(sec);
        return ret;
    },
    /**
     * php日期格式化中取值
     * @param {String} match
     * @param {Number} ind
     */
    getNumber: function(match, data) {
        var origSize = match == 'Y' ? 4 : 2;
        var size = origSize;
        var num = 0;
        var value = data.v;
        var iValue = data.i;
        while (size > 0 && iValue < value.length && value.charAt(iValue) >= '0' && value.charAt(iValue) <= '9') {
            num = num * 10 + parseInt(value.charAt(iValue++), 10);
            size--;
        }
        data.i = iValue;
        return num;
    },

    /**
     * 补0
     * @param {Object} s
     * @param {Object} len
     */
    pad: function(s, len,c) {
        s = s.toString();
        c=c||'0';
        while (s.length < len)
            s = c + s;
        return s;
    }
};