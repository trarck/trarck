(function  () {
    var Sprite=yhge.renderer.canvas.Sprite;

    var Image=yhge.core.Class([Sprite,yhge.core.Accessor],{

        initialize:function(){
            this._model =Image.Model.Normal;
            Image._super_.initialize.apply(this,arguments);
        },
       
        draw:function(context){
            var x,y;//x=0,1,2   y=0,4,8
            
            switch (this._model) {
                case 0://normal x,normal y
                    context.drawImage(this._texture,0,0,this._contentSize.width,this._contentSize.height);
                    break;
                case 1://stretch x,normal y
                    context.drawImage(this._texture,0,0,this._contentWidth,this._contentSize.height);
                    break;
                case 2://repeat x,normal y
                    this.drawRepeatX(context,false);
                    break;
                case 4://normal x,stretch y
                    context.drawImage(this._texture,0,0,this._contentSize.width,this._contentHeight);
                    break;
                case 5://stretch x,stretch y
                    context.drawImage(this._texture,0,0,this._contentWidth,this._contentHeight);
                    break;
                case 6://repeat x,stretch y
                    this.drawRepeatX(context,true);
                    break;
                case 8://normal x,repeat y
                    this.drawRepeatY(context,false);
                    break;
                case 9://stretch x,repeat y
                    this.drawRepeatX(context,true);
                    break;
                case 10://repeat x,repeat y
                    this.drawRepeat(context);
                    break;
            }
        },

        drawRepeat:function(context){
            var rightLen=this._contentWidth-this._anchorPoint.x,
                xRepeatTimes=Math.floor(rightLen/this._contentSize.width),
                rightRemainder=rightLen%this._contentSize.width,
                right=this._contentWidth-rightRemainder,

                
                
                leftRemainder=this._anchorPoint.x%this._contentSize.width,
                left=leftRemainder,
                
                bottomLen=this._contentHeight-this._anchorPoint.y,
                yRepeatTimes=Math.floor(bottomLen/this._contentSize.height),
                bottomRemainder=bottomLen%this._contentSize.height,
                bottom=this._contentSize.height-bottomRemainder,
                
                topRemainder=this._anchorPoint.y%this._contentSize.height,
                top=topRemainder;

            xRepeatTimes+=Math.floor(this._anchorPoint.x/this._contentSize.width);
            yRepeatTimes+=Math.floor(this._anchorPoint.y/this._contentSize.height);
            
            var leftBegin=this._contentSize.width-leftRemainder;
            var topBegin=this._contentSize.height-topRemainder;
            
            //draw repeat
            var positionX,positionY;
            //draw top 
            positionX=left;
            for(var i=0;i<xRepeatTimes;i++){
                context.drawImage(this._texture,0,topBegin,this._contentSize.width,top,positionX,0,this._contentSize.width,topRemainder);
                positionX+=this._contentSize.width;
            }
            
            //draw middle
            positionX=left;
            positionY=top;
            for(var i=0;i<yRepeatTimes;i++){
                
                //draw left
                context.drawImage(this._texture,leftBegin,0,leftRemainder,this._contentSize.height,0,positionY,leftRemainder,this._contentSize.height);

                //draw center
                for(var j=0;j<xRepeatTimes;j++){
                    context.drawImage(this._texture,positionX,positionY,this._contentSize.width,this._contentSize.height);
                    positionX+=this._contentSize.width;
                }
                
                //draw right
                context.drawImage(this._texture,0,0,rightRemainder,this._contentSize.height,right,positionY,rightRemainder,this._contentSize.height);

                repeatPositionY+=this._contentSize.height;
            }
            //draw bottom
            positionX=left;
            //draw bottom remainder
            for(var i=0;i<yRepeatTimes;i++){
                context.drawImage(this._texture,0,0,this._contentSize.width,bottomRemainder,positionX,bottom,this._contentSize.width,bottomRemainder);
                positionX+=this._contentSize.width;
            }
            //cornor
            //top left
            context.drawImage(this._texture,leftBegin,topBegin,leftRemainder,topRemainder,0,0,leftRemainder,topRemainder);
            //top right
            context.drawImage(this._texture,0,topBegin,rightRemainder,topRemainder,right,0,rightRemainder,topRemainder);
            //bottom left
            context.drawImage(this._texture,leftBegin,0,leftRemainder,bottomRemainder,0,bottom,leftRemainder,bottomRemainder);
            //bottom right
            context.drawImage(this._texture,0,0,rightRemainder,bottomRemainder,right,bottom,rightRemainder,bottomRemainder);
        },
        
        drawRepeatX:function(context,stretchY){
            var rightLen=this._contentWidth-this._anchorPoint.x,
                xRepeatTimes=Math.floor(rightLen/this._contentSize.width),
                rightRemainder=rightLen%this._contentSize.width,
                right=this._contentWidth-rightRemainder,

                
                
                leftRemainder=this._anchorPoint.x%this._contentSize.width,
                left=leftRemainder;

            xRepeatTimes+=Math.floor(this._anchorPoint.x/this._contentSize.width);
            
            var leftBegin=this._contentSize.width-leftRemainder;
            var height=stretchY?this._contentHeight:this._contentSize.height;
            //draw left
            context.drawImage(this._texture,leftBegin,0,leftRemainder,this._contentSize.height,0,0,leftRemainder,height);

            var positionX=left;
            //draw center
            for(var j=0;j<xRepeatTimes;j++){
                context.drawImage(this._texture,positionX,0,this._contentSize.width,height);
                positionX+=this._contentSize.width;
            }
            //draw right
            context.drawImage(this._texture,0,0,rightRemainder,this._contentSize.height,right,0,rightRemainder,height);
        },

        drawRepeatY:function(context,stretchY){
            var bottomLen=this._contentHeight-this._anchorPoint.y,
                yRepeatTimes=Math.floor(bottomLen/this._contentSize.height),
                bottomRemainder=bottomLen%this._contentSize.height,
                bottom=this._contentSize.height-bottomRemainder,
                

                
                topRemainder=this._anchorPoint.y%this._contentSize.height,
                top=topRemainder;

            yRepeatTimes+=Math.floor(this._anchorPoint.y/this._contentSize.height);
            
            var topBegin=this._contentSize.height-topRemainder;
            var width=stretchY?this._contentWidth:this._contentSize.width;

            //draw top
            context.drawImage(this._texture,0,topBegin,this._contentSize.width,topRemainder,0,0,width,topRemainder);

            var positionY=top;
            //draw middle
            for(var j=0;j<yRepeatTimes;j++){
                context.drawImage(this._texture,0,positionY,width,this._contentSize.height);
                positionY+=this._contentSize.height;
            }
            //draw bottom
            context.drawImage(this._texture,0,0,this._contentSize.width,bottomRemainder,0,bottom,width,bottomRemainder);
        },
        setModel:function(model) {
            this._model = model;
            return this;
        },
        getModel:function() {
            return this._model;
        },
        setContentWidth:function(contentWidth) {
            this._contentWidth = contentWidth;
            return this;
        },
        getContentWidth:function() {
            return this._contentWidth;
        },
        setContentHeight:function(contentHeight) {
            this._contentHeight = contentHeight;
            return this;
        },
        getContentHeight:function() {
            return this._contentHeight;
        }
    });
    Image.Model={
        Normal:0,
        XStretch:1,
        XRepeat:2,
        YStretch:1,
        YRepeat:2
    };
    yhge.renderer.canvas.Image=Image;
})();