var HALF_PI=Math.PI/2,QUARTER_PI=Math.PI/4,THREE_QUARTER_PI=3*Math.PI/4;
var CIRCLE_BEZIERCURVE=0.55191497064665766025;
var Border=yhge.core.Class(yhge.core.Accessor,{
    _top:null,
    _right:null,
    _bottom:null,
    _left:null,
    _width:0,
    _height:0,
    _radius:null,
    initialize:function(props){
        this.setAttributes(props);
        this._borderDerty=true;
    },
    initBounding:function () {
        var top=this._top,right=this._right,bottom=this._bottom,left=this._left;
        
        var outerTop=0,
            outerLeft=0,
            innerTop=outerTop+this._top.width,
            innerLeft=outerLeft+this._left.width,
            innerBottom=innerTop+this._height,
            innerRight=innerLeft+this._width,
            outerBottom=innerBottom+this._bottom.width,
            outerRight=innerRight+this._right.width;

        this._outerBounding={
            left:outerLeft,
            top:outerTop,
            right:outerRight,
            bottom:outerBottom
        };
        this._innerBounding={
            left:innerLeft,
            top:innerTop,
            right:innerRight,
            bottom:innerBottom
        };
    },
    computerInnerRadius:function () {
        this._innerRadius= {
                topLeft:{
                    height:this._radius.topLeft.height>this._top.width?this._radius.topLeft.height-this._top.width:0,
                    width:this._radius.topLeft.width>this._left.width?this._radius.topLeft.width-this._left.width:0
                },
                topRight:{
                    height:this._radius.topRight.height>this._top.width?this._radius.topRight.height-this._top.width:0,
                    width:this._radius.topRight.width>this._right.width?this._radius.topRight.width-this._right.width:0
                },
                bottomRight:{
                    height:this._radius.bottomRight.height>this._bottom.width?this._radius.bottomRight.height-this._bottom.width:0,
                    width:this._radius.bottomRight.width>this._right.width?this._radius.bottomRight.width-this._right.width:0
                },
                bottomLeft:{
                    height:this._radius.bottomLeft.height>this._bottom.width?this._radius.bottomLeft.height-this._bottom.width:0,
                    width:this._radius.bottomLeft.width>this._left.width?this._radius.bottomLeft.width-this._left.width:0
                }
        };
        return this._innerRadius;
    },
    computerCurveCenter:function () {
        this._outerCenter={
            topLeft:{x:this._outerBounding.left+this._radius.topLeft.width,y:this._outerBounding.top+this._radius.topLeft.height},
            topRight:{x:this._outerBounding.right-this._radius.topRight.width,y:this._outerBounding.top+this._radius.topRight.height},
            bottomRight:{x:this._outerBounding.right-this._radius.bottomRight.width,y:this._outerBounding.bottom-this._radius.bottomRight.height},
            bottomLeft:{x:this._outerBounding.left+this._radius.bottomLeft.width,y:this._outerBounding.bottom-this._radius.bottomLeft.height}
        };
        return this._outerCenter;
    },
    computerInnerCurveCenter:function () {
    	var top=this._top,right=this._right,bottom=this._bottom,left=this._left;
    	var radius=this._radius,
    		innerBounding=this._innerBounding,
    		outerCenter=this._outerCenter;
        this._innerCenter={
            topLeft:{
                x:0,
                y:0
            },
            topRight:{
                x:0,
                y:0
            },
            bottomRight:{
                x:0,
                y:0
            },
            bottomLeft:{
                x:0,
                y:0
            }
        };
        if(radius.topLeft.width>left.width && radius.topLeft.height>top.width){
        	this._innerCenter.topLeft.x=outerCenter.topLeft.x;
        	this._innerCenter.topLeft.y=outerCenter.topLeft.y;
        }else{
        	this._innerCenter.topLeft.x=innerBounding.left;
        	this._innerCenter.topLeft.y=innerBounding.top;
        }
        
        if(radius.topRight.width>right.width && radius.topRight.height>top.width){
        	this._innerCenter.topRight.x=outerCenter.topRight.x;
        	this._innerCenter.topRight.y=outerCenter.topRight.y;
        }else{
        	this._innerCenter.topRight.x=innerBounding.right;
        	this._innerCenter.topRight.y=innerBounding.top;
        }
        
        if(radius.bottomRight.width>right.width && radius.bottomRight.height>bottom.width){
        	this._innerCenter.bottomRight.x=outerCenter.bottomRight.x;
        	this._innerCenter.bottomRight.y=outerCenter.bottomRight.y;
        }else{
        	this._innerCenter.bottomRight.x=innerBounding.right;
        	this._innerCenter.bottomRight.y=innerBounding.bottom;
        }
        
        if(radius.bottomLeft.width>left.width && radius.bottomLeft.height>bottom.width){
        	this._innerCenter.bottomLeft.x=outerCenter.bottomLeft.x;
        	this._innerCenter.bottomLeft.y=outerCenter.bottomLeft.y;
        }else{
        	this._innerCenter.bottomLeft.x=innerBounding.left;
        	this._innerCenter.bottomLeft.y=innerBounding.bottom;
        }
        return this._innerCenter;
    },
    fixRadius:function (width,height) {
        var sTopRadius=this._radius.topLeft.x+this._radius.topRight.x,
            sRightRadius=this._radius.topRight.y+this._radius.bottomRight.y,
            sBottomRadius=this._radius.bottomLeft.x+this._radius.bottomRight.x,
            sLeftRadius=this._radius.topLeft.y+this._radius.bottomLeft.y,

            horizontalRadius=Math.max(sTopRadius,sBottomRadius),
            verticalRadius=Math.max(sLeftRadius,sRightRadius),
            horizontalRate=horizontalRadius>0?width/horizontalRadius:1,
            verticalRate=horizontalRadius>0?height/verticalRadius:1;
            rate=Math.min(verticalRate,horizontalRate);

        if(rate<1){
            this._radius.topLeft.x*=rate;
            this._radius.topLeft.y*=rate;
            this._radius.topRight.x*=rate;
            this._radius.topRight.y*=rate;
            this._radius.bottomRight.x*=rate;
            this._radius.bottomRight.y*=rate;
            this._radius.bottomLeft.x*=rate;
            this._radius.bottomLeft.y*=rate;
        }
    },
    drawPath:function(context,paths,style){
        context.save();
        //context.lineWidth=1;
        context.fillStyle=style;
        context.beginPath();
        var path=paths[0];
        context.moveTo(path[0],path[1]);
        for(var i=1,l=paths.length;i<l;i++){
            path=paths[i];
            context.lineTo(path[0],path[1]);
        }
        path=paths[0];
        context.lineTo(path[0],path[1]);
        context.fill();
        context.restore();
    },
    draw:function(context){
        //no radius
        var top=this._top,right=this._right,bottom=this._bottom,left=this._left;
        this.initBounding();
        var outerBounding=this._outerBounding,
        	innerBounding=this._innerBounding;
        
        var topPaths=[
            [outerBounding.left,outerBounding.top],
            [outerBounding.right,outerBounding.top],
            [innerBounding.right,innerBounding.top],
            [innerBounding.left,innerBounding.top]
        ];
        var RightPaths=[
            [outerBounding.right,outerBounding.top],
            [outerBounding.right,outerBounding.bottom],
            [innerBounding.right,innerBounding.bottom],
            [innerBounding.right,innerBounding.top]
        ];
        var bottomPaths=[
            [outerBounding.right,outerBounding.bottom],
            [outerBounding.left,outerBounding.bottom],
            [innerBounding.left,innerBounding.bottom],
            [innerBounding.right,innerBounding.bottom]
        ];
        var LeftPaths=[
            [outerBounding.left,outerBounding.bottom],
            [outerBounding.left,outerBounding.top],
            [innerBounding.left,innerBounding.top],
            [innerBounding.left,innerBounding.bottom]
        ];
        this.drawPath(context,topPaths,top.style);
        this.drawPath(context,RightPaths,right.style);
        this.drawPath(context,bottomPaths,bottom.style);
        this.drawPath(context,LeftPaths,left.style);
    },
    //border width is same , horizontal radius and vertical radius is same
    drawSimpleRadius:function(context){
        var top=this._top,right=this._right,bottom=this._bottom,left=this._left;
        var borderWidth=Math.min(top.width,left.width,bottom.width,right.width);
        

        this.initBounding();
        var outerBounding=this._outerBounding,
        	innerBounding=this._innerBounding;

        this.fixRadius(outerBounding.right,outerBounding.bottom);
		this.computerCurveCenter();
		var outerCenter=this._outerCenter;
        var radius=this._radius;

           
        var innerRadio=0;
        //top
        context.save();
        context.fillStyle=top.style;
        context.beginPath();
        if(radius.topLeft.width>0){
            if(radius.topLeft.width>borderWidth){
                innerRadio=radius.topLeft.width-borderWidth;
                context.moveTo(outerCenter.topLeft.x,innerBounding.top);
                context.arc(outerCenter.topLeft.x,outerCenter.topLeft.y,innerRadio,-HALF_PI,-THREE_QUARTER_PI,true);
            }else{
                context.moveTo(innerBounding.left,innerBounding.top);
            }
            context.arc(outerCenter.topLeft.x,outerCenter.topLeft.y,radius.topLeft.width,-THREE_QUARTER_PI,-HALF_PI,false);
        }else{
            context.moveTo(innerBounding.left,innerBounding.top);
            context.lineTo(outerBounding.left,outerBounding.top);
        }
        
        if(radius.topRight.width.width>0){
            context.lineTo(outerCenter.topRight.x,outerBounding.top);
            context.arc(outerCenter.topRight.x,outerCenter.topRight.y,radius.topRight.width.width,-HALF_PI,-QUARTER_PI,false);

            if(radius.topRight.width.width>borderWidth){
                innerRadio=radius.topRight.width.width-borderWidth;
                context.arc(outerCenter.topRight.x,outerCenter.topRight.y,innerRadio,-QUARTER_PI,-HALF_PI,true);
            }else{
                context.lineTo(innerBounding.right,innerBounding.top);
            }
        }else{
            context.lineTo(outerBounding.right,outerBounding.top);
            context.lineTo(innerBounding.right,innerBounding.top);
        }
        //终点会自动和起点相连，不需要再画线。
        context.fill();
        context.restore();

        //right
        context.save();
        context.fillStyle=right.style;
        context.beginPath();
        if(radius.topRight.width>0){
            if(radius.topRight.width>borderWidth){
                innerRadio=radius.topRight.width-borderWidth;
                context.moveTo(innerBounding.right,outerCenter.topRight.y);
                context.arc(outerCenter.topRight.x,outerCenter.topRight.y,innerRadio,0,-QUARTER_PI,true);
            }else{
                context.moveTo(innerBounding.right,innerBounding.top);
            }
            context.arc(outerCenter.topRight.x,outerCenter.topRight.y,radius.topRight.width,-QUARTER_PI,0,false);
        }else{
            context.moveTo(innerBounding.right,innerBounding.top);
            context.lineTo(outerBounding.right,outerBounding.top);
        }
        
        if(radius.bottomRight.width>0){
            context.lineTo(outerBounding.right,outerCenter.topRight.y);
            context.arc(outerCenter.bottomRight.x,outerCenter.bottomRight.y,radius.bottomRight.width,0,QUARTER_PI,false);

            if(radius.bottomRight.width>borderWidth){
                innerRadio=radius.bottomRight.width-borderWidth;
                context.arc(outerCenter.bottomRight.x,outerCenter.bottomRight.y,innerRadio,QUARTER_PI,0,true);
            }else{
                context.lineTo(innerBounding.right,innerBounding.bottom);
            }
        }else{
            context.lineTo(outerBounding.right,outerBounding.bottom);
            context.lineTo(innerBounding.right,innerBounding.bottom);
        }
        //终点会自动和起点相连，不需要再画线。
        context.fill();
        context.restore();

        //bottom
        context.save();
        context.fillStyle=bottom.style;
        context.beginPath();
        if(radius.bottomRight.width>0){
            if(radius.bottomRight.width>borderWidth){
                innerRadio=radius.bottomRight.width-borderWidth;
                context.moveTo(outerCenter.bottomRight.x,innerBounding.bottom);
                context.arc(outerCenter.bottomRight.x,outerCenter.bottomRight.y,innerRadio,HALF_PI,QUARTER_PI,true);
            }else{
                context.moveTo(innerBounding.right,innerBounding.bottom);
            }
            context.arc(outerCenter.bottomRight.x,outerCenter.bottomRight.y,radius.bottomRight.width,QUARTER_PI,HALF_PI,false);
        }else{
            context.moveTo(innerBounding.right,innerBounding.bottom);
            context.lineTo(outerBounding.right,outerBounding.bottom);
        }
        
        if(radius.bottomLeft.width>0){
            context.lineTo(outerCenter.bottomLeft.x,outerBounding.bottom);
            context.arc(outerCenter.bottomLeft.x,outerCenter.bottomLeft.y,radius.bottomLeft.width,HALF_PI,THREE_QUARTER_PI,false);

            if(radius.bottomLeft.width>borderWidth){
                innerRadio=radius.bottomLeft.width-borderWidth;
                context.arc(outerCenter.bottomLeft.x,outerCenter.bottomLeft.y,innerRadio,THREE_QUARTER_PI,HALF_PI,true);
            }else{
                context.lineTo(innerBounding.left,innerBounding.bottom);
            }
        }else{
            context.lineTo(outerBounding.left,outerBounding.bottom);
            context.lineTo(innerBounding.left,innerBounding.bottom);
        }
        //终点会自动和起点相连，不需要再画线。
        context.fill();
        context.restore();

        //left
        context.save();
        context.fillStyle=left.style;
        context.beginPath();
        if(radius.bottomLeft.width>0){
            if(radius.bottomLeft.width>borderWidth){
                innerRadio=radius.bottomLeft.width-borderWidth;
                context.moveTo(innerBounding.left,outerCenter.bottomLeft.y);
                context.arc(outerCenter.bottomLeft.x,outerCenter.bottomLeft.y,innerRadio,Math.PI,THREE_QUARTER_PI,true);
            }else{
                context.moveTo(innerBounding.left,innerBounding.bottom);
            }
            context.arc(outerCenter.bottomLeft.x,outerCenter.bottomLeft.y,radius.bottomLeft.width,THREE_QUARTER_PI,Math.PI,false);
        }else{
            context.moveTo(innerBounding.left,innerBounding.bottom);
            context.lineTo(outerBounding.left,outerBounding.bottom);
        }
        
        if(radius.topLeft.width>0){
            context.lineTo(outerBounding.left,outerCenter.topLeft.y);
            context.arc(outerCenter.topLeft.x,outerCenter.topLeft.y,radius.topLeft.width,-Math.PI,-THREE_QUARTER_PI,false);

            if(radius.topLeft.width>borderWidth){
                innerRadio=radius.topLeft.width-borderWidth;
                context.arc(outerCenter.topLeft.x,outerCenter.topLeft.y,innerRadio,-THREE_QUARTER_PI,-Math.PI,true);
            }else{
                context.lineTo(innerBounding.left,innerBounding.top);
            }
        }else{
            context.lineTo(outerBounding.left,outerBounding.top);
            context.lineTo(innerBounding.left,innerBounding.top);
        }
        //终点会自动和起点相连，不需要再画线。
        context.fill();
        context.restore();
    },
    /**
     * 剪切法
     */
    drawComplexRadius:function(context){
        if(this._borderDerty){
            this.initBounding();
            //this.fixRadius(this._outerBounding.right,this._outerBounding.bottom);
            this.computerCurveCenter();
            this.computerInnerRadius();
            this.computerInnerCurveCenter();
            //clip path
            this._outerClipPaths=this.getOuterClipPaths();
            this._innerClipPaths=this.getInnerClipPaths();
            //border path
            this._borderPaths=this.getBorderPaths();
            this._borderDerty=false;
        }
        context.save();
        this.drawClipPaths(context,this._outerClipPaths,this._innerClipPaths);
        //draw border paths
     	for(var path in this._borderPaths){
     		this.drawPath(context,this._borderPaths[path],this["_"+path].style);
     	}
     	context.restore();
    },
    //退化法,可保存路径
    drawClipPaths:function (context,outPaths,innerPaths) {
        //clip path
        var outerLen=outPaths.length,innerLen=innerPaths.length,i=0,path;

        context.beginPath();
        path=outPaths[i++];
        context.moveTo(path[0],path[1]);
        while(i<outerLen){
            path=outPaths[i++];
            context.bezierCurveTo(path[0],path[1],path[2],path[3],path[4],path[5]);
            path=outPaths[i++];
            context.lineTo(path[0],path[1]);
        }
        i=0;
        path=innerPaths[i++];
        context.moveTo(path[0],path[1]);
        while(i<innerLen){
            path=innerPaths[i++];
            context.lineTo(path[0],path[1]);
            path=innerPaths[i++];
            context.bezierCurveTo(path[0],path[1],path[2],path[3],path[4],path[5]);
        }
        context.clip();
        //context.fiilStyle="#F0F";
        //context.fill();
        // context.strokeStyle="#F00";
        // context.stroke();
        //console.log(innerPaths,this);
    },
    drawOuterClipPaths:function (context,clipPaths) {
        //clip path
        var l=clipPaths.length,i=0,path;

        path=clipPaths[i++];
        context.moveTo(path[0],path[1]);
        while(i<l){
            path=clipPaths[i++];
            context.bezierCurveTo(path[0],path[1],path[2],path[3],path[4],path[5]);
            path=clipPaths[i++];
            context.lineTo(path[0],path[1]);
        }
        
    },
    getOuterClipPaths:function () {
        var outerBounding=this._outerBounding,
            outerCenter=this._outerCenter,
            radius=this._radius;
        
        return [
            [outerBounding.left,outerCenter.topLeft.y],//moveTo
            [outerBounding.left,outerCenter.topLeft.y-radius.topLeft.height*CIRCLE_BEZIERCURVE,
                        outerCenter.topLeft.x-radius.topLeft.width*CIRCLE_BEZIERCURVE,outerBounding.top,
                        outerCenter.topLeft.x,outerBounding.top],//bezierCurveTo
            [outerCenter.topRight.x,outerBounding.top],//lineTo
            [outerCenter.topRight.x+radius.topRight.width*CIRCLE_BEZIERCURVE,outerBounding.top,
                        outerBounding.right,outerCenter.topRight.y-radius.topRight.height*CIRCLE_BEZIERCURVE,
                        outerBounding.right,outerCenter.topRight.y],//bezierCurveTo
            [outerBounding.right,outerCenter.bottomRight.y],//lineTo
            [outerBounding.right,outerCenter.bottomRight.y+radius.bottomRight.height*CIRCLE_BEZIERCURVE,
                        outerCenter.bottomRight.x+radius.bottomRight.width*CIRCLE_BEZIERCURVE,outerBounding.bottom,
                        outerCenter.bottomRight.x,outerBounding.bottom],//bezierCurveTo
            [outerCenter.bottomLeft.x,outerBounding.bottom],//lineTo
            [outerCenter.bottomLeft.x-radius.bottomLeft.width*CIRCLE_BEZIERCURVE,outerBounding.bottom,
                        outerBounding.left,outerCenter.bottomLeft.y+radius.bottomLeft.height*CIRCLE_BEZIERCURVE,
                        outerBounding.left,outerCenter.bottomLeft.y],//bezierCurveTo
            [outerBounding.left,outerCenter.topLeft.y]//lineTo
        ];
    },
    drawInnerClipPaths:function (context,clipPaths) {
        //clip path
        var l=clipPaths.length,i=0,path;

        path=clipPaths[i++];
        context.moveTo(path[0],path[1]);
        while(i<l){
            path=clipPaths[i++];
            context.lineTo(path[0],path[1]);
            path=clipPaths[i++];
            context.bezierCurveTo(path[0],path[1],path[2],path[3],path[4],path[5]);
        }
    },
    //TODO 优化
    /**
     * 由于inner clip中有直线和曲线二种
     * 由于使用缓存法，缓存了计算结果，必需对计算结果进行标记使用什么画法。
     * 格式：[
     *        [lineTo:[x,y]],
     * 		  [bezierCurveTo:[x1,y1,x2,y2,x,y]]
     * 		]
     *
     */
    getInnerClipPaths:function () {
        var innerBounding=this._innerBounding,
            innerCenter=this._innerCenter,
            innerRadius=this._innerRadius;
        
        return [
                [innerBounding.left,innerCenter.topLeft.y],//moveTo
                [innerBounding.left,innerCenter.bottomLeft.y],//lineTo
                [innerBounding.left,innerCenter.bottomLeft.y+innerRadius.bottomLeft.height*CIRCLE_BEZIERCURVE,
                            innerCenter.bottomLeft.x-innerRadius.bottomLeft.width*CIRCLE_BEZIERCURVE,innerBounding.bottom,
                            innerCenter.bottomLeft.x,innerBounding.bottom],//bezierCurveTo
                [innerCenter.bottomRight.x,innerBounding.bottom],//lineTo
                [innerCenter.bottomRight.x+innerRadius.bottomRight.width*CIRCLE_BEZIERCURVE,innerBounding.bottom,
                            innerBounding.right,innerCenter.bottomRight.y+innerRadius.bottomRight.height*CIRCLE_BEZIERCURVE,
                            innerBounding.right,innerCenter.bottomRight.y],//bezierCurveTo
                [innerBounding.right,innerCenter.topRight.y],//lineTo
                [innerBounding.right,innerCenter.topRight.y-innerRadius.topRight.height*CIRCLE_BEZIERCURVE,
                            innerCenter.topRight.x+innerRadius.topRight.width*CIRCLE_BEZIERCURVE,innerBounding.top,
                            innerCenter.topRight.x,innerBounding.top],//bezierCurveTo
                [innerCenter.topLeft.x,innerBounding.top],//lineTo            
                [innerCenter.topLeft.x-innerRadius.topLeft.width*CIRCLE_BEZIERCURVE,innerBounding.top,
                            innerBounding.left,innerCenter.topLeft.y-innerRadius.topLeft.height*CIRCLE_BEZIERCURVE,
                            innerBounding.left,innerCenter.topLeft.y]//bezierCurveTo
        ];
    },
    getBorderPaths:function () {
        var top=this._top,right=this._right,bottom=this._bottom,left=this._left,
        	outerBounding=this._outerBounding,
        	innerBounding=this._innerBounding,
        	outerCenter=this._outerCenter;
        var topPaths=[],rightPaths=[],bottomPaths=[],leftPaths=[];
        var a=b=0;
        var innerX,innerY;
        //top left
        if(top.width<this._radius.topLeft.height && left.width<this._radius.topLeft.width){
        	
            //优化后   
            if(top.width>left.width){
            	
            	innerX=outerBounding.left+(left.width==0?0:(this._radius.topLeft.height*left.width/top.width));
            	innerY=outerCenter.topLeft.y;
            	
            	topPaths.push([outerCenter.topLeft.x,innerBounding.top]);
	            topPaths.push([outerCenter.topLeft.x,outerCenter.topLeft.y]);
	            topPaths.push([innerX,innerY]);
	            
	            leftPaths.push([innerX,innerY]);
	            leftPaths.push([innerBounding.left,outerCenter.topLeft.y]);
            	
            }else if(top.width<left.width){
            	
            	innerX=outerCenter.topLeft.x;
            	innerY=outerBounding.top+(top.width==0?0:(this._radius.topLeft.width*top.width/left.width));
            	
            	topPaths.push([outerCenter.topLeft.x,innerBounding.top]);
	            topPaths.push([innerX,innerY]);
	            
	            leftPaths.push([innerX,innerY]);
	            leftPaths.push([outerCenter.topLeft.x,outerCenter.topLeft.y]);
	            leftPaths.push([innerBounding.left,outerCenter.topLeft.y]);
            }else{
            	//这种情况可由上面退化而来，分开处理少一些运算
            	topPaths.push([outerCenter.topLeft.x,innerBounding.top]);
            	topPaths.push([outerCenter.topLeft.x,outerCenter.topLeft.y]);
            	
            	leftPaths.push([outerCenter.topLeft.x,outerCenter.topLeft.y]);
            	leftPaths.push([innerBounding.left,outerCenter.topLeft.y]);
            }
        }else{
            topPaths.push([innerBounding.left,innerBounding.top]);
            
            leftPaths.push([innerBounding.left,innerBounding.top]);
        }
        topPaths.push([outerBounding.left,outerBounding.top]);
        topPaths.push([outerBounding.right,outerBounding.top]);
        
        //top right
        if(this._radius.topRight.height>top.width && this._radius.topRight.width>right.width){
            if(top.width>right.width){
            	innerX=outerBounding.right-(right.width==0?0:(this._radius.topRight.height*right.width/top.width));
            	innerY=outerCenter.topRight.y;
            	
            	topPaths.push([innerX,innerY]);
	            topPaths.push([outerCenter.topRight.x,outerCenter.topRight.y]);
	            topPaths.push([outerCenter.topRight.x,innerBounding.top]);
	            
	            rightPaths.push([innerBounding.right,outerCenter.topRight.y]);
	            rightPaths.push([innerX,innerY]);
            }else if(top.width<right.width){
            	innerX=outerCenter.topRight.x;
            	innerY=outerBounding.top+(top.width==0?0:(this._radius.topRight.width*top.width/right.width));
            
            	topPaths.push([innerX,innerY]);
	            topPaths.push([outerCenter.topRight.x,innerBounding.top]);
	            
	            rightPaths.push([innerBounding.right,outerCenter.topRight.y]); 
	            rightPaths.push([outerCenter.topRight.x,outerCenter.topRight.y]);
	            rightPaths.push([innerX,innerY]);
            }else{
            	topPaths.push([outerCenter.topRight.x,outerCenter.topRight.y]);
            	topPaths.push([outerCenter.topRight.x,innerBounding.top]);
            	
            	rightPaths.push([innerBounding.right,outerCenter.topRight.y]);
	            rightPaths.push([outerCenter.topRight.x,outerCenter.topRight.y]);
            }
        }else{
            topPaths.push([innerBounding.right,innerBounding.top]);
            
            rightPaths.push([innerBounding.right,innerBounding.top]);
        }
        rightPaths.push([outerBounding.right,outerBounding.top]);
        rightPaths.push([outerBounding.right,outerBounding.bottom]);
        
        
        //bottom right
        if(this._radius.bottomRight.height>bottom.width && this._radius.bottomRight.width>right.width){
            if(bottom.width>right.width){
            	innerX=outerBounding.right-(right.width==0?0:(this._radius.bottomRight.height*right.width/bottom.width));
	            innerY=outerCenter.bottomRight.y;
	            
	            rightPaths.push([innerX,innerY]);
	            rightPaths.push([innerBounding.right,outerCenter.bottomRight.y]);
	            
	            bottomPaths.push([outerCenter.bottomRight.x,innerBounding.bottom]);
	            bottomPaths.push([outerCenter.bottomRight.x,outerCenter.bottomRight.y]);
	            bottomPaths.push([innerX,innerY]);
            }else if(bottom.width<right.width){
            	innerX=outerCenter.bottomRight.x;
	            innerY=outerBounding.bottom-(bottom.width==0?0:(this._radius.bottomRight.width*bottom.width/right.width));
	            
	            rightPaths.push([innerX,innerY]);
	            rightPaths.push([outerCenter.bottomRight.x,outerCenter.bottomRight.y]);
	            rightPaths.push([innerBounding.right,outerCenter.bottomRight.y]);
	            
	            bottomPaths.push([outerCenter.bottomRight.x,innerBounding.bottom]);
	            bottomPaths.push([innerX,innerY]);
            }else{
            	rightPaths.push([outerCenter.bottomRight.x,outerCenter.bottomRight.y]);
            	rightPaths.push([innerBounding.right,outerCenter.bottomRight.y]);
            	
            	bottomPaths.push([outerCenter.bottomRight.x,innerBounding.bottom]);
            	bottomPaths.push([outerCenter.bottomRight.x,outerCenter.bottomRight.y]);
            }
        }else{
            rightPaths.push([innerBounding.right,innerBounding.bottom]);
            
            bottomPaths.push([innerBounding.right,innerBounding.bottom]);
        }
        bottomPaths.push([outerBounding.right,outerBounding.bottom]);
        bottomPaths.push([outerBounding.left,outerBounding.bottom]);
        
        //bottom left
        leftPaths.splice(0,0,[outerBounding.left,outerBounding.bottom]);
        leftPaths.splice(1,0,[outerBounding.left,outerBounding.top]);
        
        if(this._radius.bottomLeft.height>bottom.width && this._radius.bottomLeft.width>left.width){
            if(bottom.width>left.width){
            	innerX=outerBounding.left+(left.width==0?0:(this._radius.bottomLeft.height*left.width/bottom.width));
	            innerY=outerCenter.bottomLeft.y;
	            
	            bottomPaths.push([innerX,innerY]);
	            bottomPaths.push([outerCenter.bottomLeft.x,outerCenter.bottomLeft.y]);
	            bottomPaths.push([outerCenter.bottomLeft.x,innerBounding.bottom]);
	            
	            leftPaths.splice(0,0,[innerBounding.left,outerCenter.bottomLeft.y]);
	            leftPaths.splice(1,0,[innerX,innerY]);
            }else if(bottom.width<left.width){
            	innerX=outerCenter.bottomLeft.x;
	            innerY=outerBounding.bottom-(bottom.width==0?0:(this._radius.bottomLeft.width*bottom.width/left.width));
	            
	            bottomPaths.push([innerX,innerY]);
	            bottomPaths.push([outerCenter.bottomLeft.x,innerBounding.bottom]);
	            
	            leftPaths.splice(0,0,[innerBounding.left,outerCenter.bottomLeft.y]);
	            leftPaths.splice(1,0,[outerCenter.bottomLeft.x,outerCenter.bottomLeft.y]);
	            leftPaths.splice(2,0,[innerX,innerY]);
            }else{
            	bottomPaths.push([outerCenter.bottomLeft.x,outerCenter.bottomLeft.y]);
            	bottomPaths.push([outerCenter.bottomLeft.x,innerBounding.bottom]);
            	
				leftPaths.splice(0,0,[innerBounding.left,outerCenter.bottomLeft.y]);
	            leftPaths.splice(1,0,[outerCenter.bottomLeft.x,outerCenter.bottomLeft.y]);            	
            }
        }else{
            bottomPaths.push([innerBounding.left,innerBounding.bottom]);
            
            leftPaths.splice(0,0,[innerBounding.left,innerBounding.bottom]);
        }
        return {top:topPaths,right:rightPaths,bottom:bottomPaths,left:leftPaths};
    },
     
    
    /**
     * 计算二条边组成的圆角各占的弧度值。
     * 直线与圆的相交方程组的解
     * 圆角
     */
	getAdjacentSeprateDegree:function(borderWidth1,borderWidth2,radii){
        var tg=1;
        if(borderWidth1<borderWidth2){
            tg=borderWidth1/borderWidth2;
            var y0=radii*(1-tg);
        }else if(borderWidth1>borderWidth2){
            tg=borderWidth2/borderWidth1;
        }

    },
    /**
     * 计算二条边组成的圆角各占的弧度值。
     * 直线与椭圆的相交方程组的解
     * 椭圆角
     */
    getAdjacentSeprateDegreeOfEllipse:function(borderWidth1,borderWidth2,a,b){
        
    },
    ellipsePath:function(context,x,y,a,b){
        
    },
    setTop:function(top) {
        this._top = top;
        return this;
    },
    getTop:function() {
        return this._top;
    },
    setRight:function(right) {
        this._right = right;
        return this;
    },
    getRight:function() {
        return this._right;
    },
    setBottom:function(bottom) {
        this._bottom = bottom;
        return this;
    },
    getBottom:function() {
        return this._bottom;
    },
    setLeft:function(left) {
        this._left = left;
        return this;
    },
    getLeft:function() {
        return this._left;
    },
    setWidth:function(width) {
        this._width = width;
        return this;
    },
    getWidth:function() {
        return this._width;
    },
    setHeight:function(height) {
        this._height = height;
        return this;
    },
    getHeight:function() {
        return this._height;
    },
    setRadius:function(radius) {
        if(typeof radius=="number"){
        	this._radius={topLeft:{width:radius,height:radius},
        				  topRight:{width:radius,height:radius},
        				  bottomRight:{width:radius,height:radius},
        				  bottomLeft:{width:radius,height:radius}};
        }else{
            this._radius = radius;
        }
        return this;
    },
    getRadius:function() {
        return this._radius;
    }
    
});
yhge.ui.canvas.Border=Border;
