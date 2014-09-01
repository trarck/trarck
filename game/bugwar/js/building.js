(function () {
    var Rect=yhge.renderer.canvas.shape.Rect;
    //建筑势力颜色。TODO 不同建筑风格的图片
    var flagColors=["#999","#F00","#0F0","#00F"];
    
    var Building=yhge.core.Class(Rect,{
        classname:"Building",
        /**
         * 当前人口数量
         */
        _number:0,
        /**
         * 最大人口数
         */
        _maxNumber:0,
        /**
         * 势力
         */ 
        _flag:0,
        /**
         * 建筑里的每个人口，消耗的前来进攻的人口数
         * 比如炮台，外面3个人换里面1个人，如果，外面的人只来二个，则进行累，只再需要1个就可以消除。计进攻的人口小于
         */ 
        _numPerDeplete:1,
        /**
         * 被消耗人口的余数
         */
        _numPerDepleteMod:0,//消耗人口的余数。
        /**
         * 记录各势力消除时剩余人。
         */ 
        _flagRemain:null,

        initialize:function(){
            this._numPerDeplete=1;

            Building._super_.initialize.apply(this,arguments);
            BugWar.engine.updater.schedule(this,this.update,2000);
        },
        update:function (delta) {
            if(this._number<this._maxNumber){
                this._number++;
                this.updateNumber();
            }
        },
        loadView:function () {
            this._tipView=new BugWar.Tip({
                solid:true,
                color:"#FFF",
                fontColor:"#000",
                width:32,
                height:24
            });
            this._tipView.setPosition(0,-30);
            this.addChild(this._tipView);
            return this;
        },

        //==================逻辑====================//
        /**
         * 根据势力增加人口
         * @param num
         * @param flag
         */
        addNumber:function (num,flag) {
            if(this._flag==flag){
                this._number+=num;
            }else {
                //根据建筑的人口消耗比来计算。

                if(this._numPerDeplete==1){
                    //通常建筑的消耗比都为1，增加判断减少计算量
                    this._number-=num;
                    this._numPerDepleteMod=0;
                }else{
                    num+=this._numPerDepleteMod;
                    this._numPerDepleteMod=num %this._numPerDeplete;
                    this._number-=Math.floor(num/this._numPerDeplete);
                }
            }
            if(this._number<0){
                this._number=-this._number;
                //如果被对方占领，则余数加到当前数里面。
                this._number+=this._numPerDepleteMod;
                this._numPerDepleteMod=0;
                this.setFlag(flag);
            }else if(this._number>this._maxNumber){
                //如果大于最大值，超过部分则被忽略
                this._number=this._maxNumber;
            }
            this.updateNumber();
        },
        /**
         * 派出去的人口
         */
        dispatchNumber:function () {
            var outer=Math.floor(this._number/2);
            this._number-=outer;
            this.updateNumber();
            return outer;
        },

        updateNumber:function(){
            this._tipView.setLabel(this._number);
        },
        //===================get set==============//
        setNumber:function(number) {
            this._number = number;
            this.updateNumber();
            return this;
        },
        getNumber:function() {
            return this._number;
        },

        setMaxNumber:function(maxNumber){
            this._maxNumber=maxNumber;
            return this;
        },
        getMaxNumber:function(){
            return this._maxNumber;
        },

        setFlag:function (flag) {
            this._flag=flag;
            this._color=flagColors[flag];
            return this;
        },
        getFlag:function () {
            return this._flag;
        }
    });
    /**
     * 建筑所属势力
     */
    Building.FlagType={
        Neutrality:0,
        Bule:1,
        Red:2,
        Green:3
    };

    BugWar.Building=Building;
})();