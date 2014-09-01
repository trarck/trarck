/**
 * User: trarck
 * Date: 12-8-25
 * Time: 上午10:37
 */
(function  () {
    var Entity=TcgCard.Entity;
    var Rect=yhge.renderer.canvas.shape.Rect;
    var Card=yhge.core.Class(Entity,{

        classname:"Card",

        initialize:function(props){
            Card._super_.initialize.apply(this,arguments);
            this.setAttributes(props);
        },
        
        loadView:function(){
            this._view=new Rect();
            this._view._addedToParent=function(){
                //didLoadView
            };
//            this._view.setWidth(this._width);
//            this._view.setHeight(this._height);
            return this._view;
        },

        showWaitRound:function(){
            this._waitRoundBg=new Rect();
            this._waitRoundBg.setWidth(20);
            this._waitRoundBg.setHeight(20);
            this._waitRoundBg.setAnchor(0.5,0.5);
            this._waitRoundBg.setSolid(true);
            this._waitRoundBg.setColor("#CCC");
            this._waitRoundBg.setPosition(10,this._view._height-10);
            this._view.addChild(this._waitRoundBg);

            this._waitRoundTxt=new Text();
            this._waitRoundTxt.setColor("#0C0");
            this._waitRoundTxt.setText(2);
            this._waitRoundTxt.setTextBaseline("middle");
            this._waitRoundTxt.setPosition(10,this._view._height-10);

            this._view.addChild(this._waitRoundTxt);
        },



        //=====logic property=========//
        setHp:function(hp) {
            this._hp = hp;
            return this;
        },
        getHp:function() {
            return this._hp;
        },
        setAttack:function(attack) {
            this._attack = attack;
            return this;
        },
        getAttack:function() {
            return this._attack;
        },
        setWaitRound:function(waitRound) {
            this._waitRound = waitRound;
            return this;
        },
        getWaitRound:function() {
            return this._waitRound;
        },
        setPopulation:function(population) {
            this._population = population;
            return this;
        },
        getPopulation:function() {
            return this._population;
        },
        setCategory:function(category) {
            this._category = category;
            return this;
        },
        getCategory:function() {
            return this._category;
        },
        setElement:function(element) {
            this._element = element;
            return this;
        },
        getElement:function() {
            return this._element;
        },
        setType:function(type) {
            this._type = type;
            return this;
        },
        getType:function() {
            return this._type;
        }
    });
    TcgCard.Card=Card;
})();