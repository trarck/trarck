/**
 * User: trarck
 * Date: 12-8-26
 * Time: 下午12:17
 */
TcgCard.BattleManager = {

    battleSlotSize:{
        width:90,
        height:131
    },
    prepareSlotSize:{
        width:55,
        height:80
    },

    initalize:function(scene){
        this._scene=scene;
        this._slotPositions=[
            //自己
            {
                battleSlots:[],//战斗
                prepareSlots:[],//准备
                cardStack:{},//牌堆
                discardStack:{}//弃牌堆
            },
            //对方
            {
                battleSlots:[],
                prepareSlots:[],
                cardStack:{},
                discardStack:{}
            }
        ];
        this._cards=[
            //自己
            {
                battles:[],
                prepares:[],
                cardStack:[],
                discardStack:[]
            },
            //对方
            {
                battles:[],
                prepares:[],
                cardStack:[],
                discardStack:[]
            }
        ];
    },

    setupSlots:function () {
        var battleSlotSize=this.battleSlotSize;
        var prepareSlotSize=this.prepareSlotSize;
        var slotPositions=this._slotPositions;
        var x=30,y=420,margin={left:20,top:0};
        var n=6;
        //我方
        //战斗区
        for(var i=0;i<n;i++){
            this.drawSlot({x:x,y:y},battleSlotSize);
            slotPositions[0].battleSlots.push({x:x,y:y});
            x+=battleSlotSize.width+margin.left;
        }
        x=20,y=571;
        n=8;
        //准备区
        for(var i=0;i<n;i++){
            this.drawSlot({x:x,y:y},prepareSlotSize);
            slotPositions[0].prepareSlots.push({x:x,y:y});
            x+=prepareSlotSize.width+margin.left;
        }
        slotPositions[0].cardStack.x=0;
        slotPositions[0].cardStack.y=y;
        slotPositions[0].discardStack.x=200;
        slotPositions[0].discardStack.y=y+90;
        //对方
        //战斗区
        x=30,y=249;
        n=6;
        for(var i=0;i<n;i++){
            this.drawSlot({x:x,y:y},battleSlotSize);
            slotPositions[1].battleSlots.push({x:x,y:y});
            x+=battleSlotSize.width+margin.left;
        }

        x=20,y=149;
        n=8;
        //准备区
        for(var i=0;i<n;i++){
            this.drawSlot({x:x,y:y},prepareSlotSize);
            slotPositions[1].prepareSlots.push({x:x,y:y});
            x+=prepareSlotSize.width+margin.left;
        }
        slotPositions[0].cardStack.x=0;
        slotPositions[0].cardStack.y=y;
        slotPositions[0].discardStack.x=200;
        slotPositions[0].discardStack.y=y-90;
    },
    drawSlot:function(position,size){
        var slot=new Rect();
        slot.setWidth(size.width);
        slot.setHeight(size.height);
        slot.setColor("#00FFFF");
        slot.setPosition(position);
        this._scene.addChild(slot);
    },

    /**
     * 洗牌
     */
    shuffle:function (cardList) {
        var indx,leftItem=cardList.length- 1,tmp;
        for(var i= 0,l=cardList.length;i<l;i++){
            indx=parseInt(Math.random()*leftItem);
            tmp=cardList[indx];
            cardList[indx]=cardList[leftItem];
            cardList[leftItem]=tmp;
        }
        return cardList;
    },

    turn:function(playerIndex){
        //检查准备区：等待回合减一，为0的进入战斗区
        this.checkPrepareSlot(playerIndex);
        //发牌
        this.deal(playerIndex);
        //执行战斗区：
        this.doBattle(playerIndex);
    },
    /**
     * 发牌
     * 牌堆到准备区
     */
    deal:function (playerIndex) {
        //取得准备区的空位
        var index = this._cards[playerIndex].prepares.length;
        var pos = this._slotPositions[playerIndex].prepareSlots[index];
        var prepareCard = new TcgCard.Card();
        var view = prepareCard.loadView();
        view.setSolid(true);
        view.setWidth(smallSize.width);
        view.setHeight(smallSize.height);
        view.setColor("#FF0000");
        view.setPosition(this._slotPositions[playerIndex].cardStack);
        prepareCard.showWaitRound();
        scene.addChild(view);
        TcgCard.fx.animate(view, {position:{x:pos.x, y:pos.y}}, 400);
        this._cards[playerIndex].prepareSlots.push(prepareCard);
    },

    checkPrepareSlot:function(playerIndex){
        var prepares=this._cards[playerIndex].prepares;
        var card,waitRound;
        for(var i= 0,l=prepares.length;i<l;i++){
            card=prepares[i];
            //等待回合减1
            waitRound=card.getWaitRound()-1;
            //如果等待回合为0，则进入战斗区，进入后整理卡槽
            if(waitRound<=0){
                this.moveCardToBattle(card,playerIndex);
                this.orderPrepareSlot(playerIndex,i);
            }else{
                card.setWaitRound(waitRound);
            }
        }
    },

    moveCardToPrepare:function(card,playerIndex){
        //取得slot位置
        var index=this._cards[playerIndex].prepares.length;
        var slot=this._slotPositions[playerIndex].prepareSlots[index];
        //进行移动
        this.moveCardTo(card,{
            position:{
                x:slot.x,
                y:slot.y
            },
            width:this.prepareSlotSize.width,
            height:this.prepareSlotSize.height
        });
    },

    moveCardToBattle:function(card,playerIndex){
        //取得slot位置
        var index=this._cards[playerIndex].battles.length;
        var slot=this._slotPositions[playerIndex].battleSlots[index];
        //进行移动
        this.moveCardTo(card,{
            position:{
                x:slot.x,
                y:slot.y
            },
            width:this.battleSlotSize.width,
            height:this.battleSlotSize.height
        });
    },

    moveCardTo:function(card,to){
        TcgCard.fx.animate(card.getView(), to, 400);
    },

    doBattle:function(playerIndex){
        //主牌攻击

        //战斗牌
        var cards=this._cards[playerIndex].battles;
        var opponentCards=this._cards[this._opponentIndex].battles;
        var card,opponentCard;
        for(var i= 0,l=cards.length;i<l;i++){
            card=cards[i];
            opponentCard=opponentCards[i];
            if(opponentCard){
                //使用技能攻击相对位置的牌
                //使用物理攻击相对位置的牌
                this.attack(card,opponentCard);
            }else{
                //使用技能攻击其它牌
                //使用物理攻击对方的体力
            }
            //检查debuffer
        }
    },
    /**
     * a 攻击 b
     * @param a
     * @param b
     */
    attack:function(a,b){

    },

    /**
     * 整理卡槽
     */
    orderPrepareSlot:function (playerIndex,slotIndex) {
        var prepares=this._cards[playerIndex].prepares;
        var slotPositions=this._slotPositions[playerIndex];
        var card,pos;
        for(var i=slotIndex+1,l=prepares.length;i<l;i++){
            card=prepares[i];
            //空的槽的位置
            pos=slotPositions.prepareSlots[i-1];
            TcgCard.fx.animate(card.getView(),{position:pos},400);
        }
    }
};