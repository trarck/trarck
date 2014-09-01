(function(){
    //如果用数组表示。左中右、上中下都是0,1,2。勇于计算时减去1，变成-1,0,1可以直接代入算式。
	var  isometric= yhge.isometric;
    
    /**
     * 二维方向对应的名称
     * [y][x]
     */
	isometric.Direction={
	    "-1":{
	        "-1":"wn",
	        "0":"n",
	        "1":"en"
	    },
	    "0":{
            "-1":"w",
            "0":null,
            "1":"e"
        },
        "1":{
            "-1":"ws",
            "0":"s",
            "1":"es"
        }
	};
	isometric.DirectionIndex={
        "-1":{
            "-1":3,
            "0":7,
            "1":2
        },
        "0":{
            "-1":6,
            "0":0,
            "1":5
        },
        "1":{
            "-1":1,
            "0":4,
            "1":0
        }
    };
	/**
	 * 地图名称的二维映射关系
	 */
	isometric.DirectionMap={
	    n:{x:0,y:-1},
		s:{x:0,y:1},
		w:{x:-1,y:0},
		e:{x:1,y:0},
		wn:{x:-1,y:-1},
		ws:{x:-1,y:1},
		en:{x:1,y:-1},
		es:{x:1,y:1}
	};
	/**
	 * 地图和屏幕的方向关系
	 * map direction to screendirection mapping
	 * [y][x]
	 */
	isometric.MapToScreenDirectionMapping={
        "-1":{
            "-1":{x:0,y:-1},
            "0":{x:1,y:-1},
            "1":{x:1,y:0}
        },
        "0":{
            "-1":{x:-1,y:-1},
            "0":{x:0,y:0},
            "1":{x:1,y:1}
        },
        "1":{
            "-1":{x:-1,y:0},
            "0":{x:-1,y:1},
            "1":{x:0,y:1}
        }
    };
    isometric.ScreenToMapDirectionMapping={
        "-1":{
            "-1":{x:-1,y:0},
            "0":{x:-1,y:-1},
            "1":{x:0,y:-1}
        },
        "0":{
            "-1":{x:-1,y:1},
            "0":{x:0,y:0},
            "1":{x:1,y:-1}
        },
        "1":{
            "-1":{x:0,y:1},
            "0":{x:1,y:1},
            "1":{x:1,y:0}
        }
    };
    /**
     * 角度法
     * 每个方向占45度，起始和结束方向要各偏移22.5(45/2)
     * tan(22.5)=0.4142
     * tan(67.5)=2.4142
     * 
     * var tests=[
            [{x:1,y:1},[1,1]],
            [{x:1,y:-1},[1,-1]],
            [{x:-1,y:1},[-1,1]],
            [{x:-1,y:-1},[-1,-1]],
            [{x:0,y:1},[0,1]],
            [{x:0,y:-1},[0,-1]],
            [{x:1,y:0},[1,0]],
            [{x:-1,y:0},[-1,0]],
    
            [{x:1,y:3},[0,1]],
            [{x:-1,y:3},[0,1]],
            [{x:3,y:1},[1,0]],
            [{x:3,y:-1},[1,0]],
    
            [{x:-3,y:1},[-1,0]],
            [{x:-3,y:-1},[-1,0]],
            [{x:1,y:-3},[0,-1]],
            [{x:-1,y:-3},[0,-1]],
    
            [{x:1,y:2},[1,1]],
            [{x:2,y:1},[1,1]],
    
            [{x:1,y:-2},[1,-1]],
            [{x:2,y:-1},[1,-1]],
    
            [{x:-1,y:2},[-1,1]],
            [{x:-2,y:1},[-1,1]],
    
            [{x:-1,y:-2},[-1,-1]],
            [{x:-2,y:-1},[-1,-1]]
        ];
        for(var i in tests){
            var to=tests[i][0],
                accert=tests[i][1];
            var ret=ma({x:0,y:0},to);
            
            if(ret.x!=accert[0] || ret.y!=accert[1]){
                 alert(to.x+","+to.y+"---failed");
            }
        }
     */
    isometric.calcDirection=function(src, desc){
        var x, y,
            dx=desc.x-src.x,
            dy=desc.y-src.y;
         
         if(dx==0){
            x=0;
            y=dy>0?1:dy<0?-1:0;
         }else{
             
             //-2.4142 <tan<-0.4142,0.4142<tan<2.4142
             x=dx>0?1:-1;
             if(dy==0){
                 y=0;
             }else{
                 y=dy>0?1:-1;
                 var tan=dy/dx;
                 if(tan<-2.4142 || tan>2.4142){
                     x=0;
                 }else if(tan>-0.4142 && tan<0.4142){//-0.4142<tan<0.4142
                     y=0;
                 }
            }
        }
        return {x:x,y:y};
    };
    // isometric.calcDirection=function(src, desc){
        // var x, y,
            // dx=desc.x-src.x,
            // dy=desc.y-src.y;
//          
         // if(dx==0){
            // x=0;
            // y=dy>0?1:-1;
         // }else{
// 
             // var  tan=dy/dx;
// 
             // if(tan<-2.4142){
                 // x=0;
                 // y=dy>0?1:-1;
             // }else if(tan<-0.4142){ //-2.4142 <tan<-0.4142
                 // if(dx>0){
                     // x=1;
                     // y=-1;
                 // }else{
                     // x=-1;
                     // y=1
                 // }
             // }else if(tan<0.4142){//-0.4142<tan<0.4142
                 // y=0;
                 // x=dx>0?1:-1;
             // }else if(tan<2.4142){//0.4142<tan<2.4142
                 // if(dx>0){
                     // x=1;
                     // y=1;
                 // }else{
                     // x=-1;
                     // y=-1
                 // }
             // }else{//tan<2.4142
                 // x=0;
                 // y=dy>0?1:-1;
             // }
        // }
        // return {x:x,y:y};
    // };
	/**
	 * 方格法不太准确
	 * 确定方格坐标之间的位置关系
	 * 由于每个方格有固定大小，可以直接按定位点的坐标来判断。
	 */
	// isometric.calcDirection=function(src, desc){
        // var x, y;
        // if (desc.x > src.x) {
            // //右
            // x = 1;
        // }else if(desc.x<src.x){
            // //左
            // x = -1;
        // } else  {
            // //中
            // x = 0;
        // }
// 
        // if (desc.y > src.y) {
            // //下
            // y = 1;
        // } else if (desc.y < src.y) {
            // //上
            // y = -1;
        // } else {
            // //中
            // y = 0;
        // }
        // return {x:x,y:y};
    // };
    isometric.calcDirectionE=function(src, desc){
        var x, y;
        if (desc.x > src.x) {
            //右
            x = 2;
        }else if(desc.x<src.x){
            //左
            x = 8;
        } else  {
            //中
            x = 0;
        }

        if (desc.y > src.y) {
            //下
            y = 4;
        } else if (desc.y < src.y) {
            //上
            y = 1;
        } else {
            //中
            y = 0;
        }
        return x+y;
    };
    /**
     * 矩形块之间的位置关系
     */
    isometric.calcSide= function(src, desc){
        var x, y;
        if (desc.left >= src.right) {
            //右
            x = 1;
        }else if(desc.right<=src.left){
            //左
            x = -1;
        } else  {//desc.right<=src.right && desc.left>=src.left(内中),desc.right>=src.right && desc.left<=src.left(外中) 都算中
            //中
            x = 0;
        }

        if (desc.top >= src.bottom) {
            //下
            y = 1;
        } else if (desc.bottom <= src.top) {
            //上
            y = -1;
        } else {
            //中
            y = 0;
        }
        return {x:x,y:y};
    };
    /**
     * 地图方位转成屏幕方位
     * 地图是一个区块的，容易计算之间的方位关系。
     * 屏幕要转换成区间，再计算方位关系。
     */
    isometric.toScreenDirection=function(direction){
        return isometric.MapToScreenDirectionMapping[direction.y][direction.x];
    };
    isometric.toMapDirection=function(direction){
        return isometric.ScreenToMapDirectionMapping[direction.y][direction.x];
    };
})();