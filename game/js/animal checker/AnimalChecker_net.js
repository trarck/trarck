function AnimalChecker(o){
    this._init(o);
}
AnimalChecker.prototype={
    _init:function(o){
        this.COL=o.col||4;//行
        this.ROW=o.row||4;//列
        
                
        this.sides=[0,1];
        this.players=[new Player({side:0,name:"蓝方"}),new Player({side:1,name:"红方"})];
        this.activePlayer=this.players[0];

        this.maps=[];
               
        this.createContentItem();
        
        var self=this;
                
        this.initContentItem();
    },
    //建立，显示的方格
   createContentItem: function (){
        for (var i = 0; i < this.COL; i++) {
            this.maps[i] = [];
            for (var j = 0; j < this.ROW; j++) {
                this.maps[i][j] = null;
            }
        }
    },
    makeSeqs:function () {
        this.seqs=[0, 1, 2,12, 4, 9, 6, 7, 8, 5, 10, 11, 3, 13, 14, 15];
    },
    getSeqs:function () {
        return this.seqs;
    },
    //初始化内容
    initContentItem:function (){
        this.makeSeqs();
        var nm = this.COL * this.ROW / this.sides.length, ele, k=0, side, ind, x, y;
        for (var s = 0; s < this.sides.length; s++) {
            side = this.sides[s];
            for (ind = 1; ind <= nm; ind++) {
                m=this.seqs[k];
                y = Math.floor(m/this.COL);
                x = m % this.COL;
                this.maps[y][x] = {level:ind,side:side};
                k++;
            }
        }
    },
   cmd:function (coord) {
        if (this.doSelecting(coord)) {
            if(this.doMove(this.activePlayer.selectedCoord,coord)){
                this.unselectedItem(coord,true);
                this.activePlayer=this.getNextPlayer(this.activePlayer);
                this.isEnd();
            }
        }
   },  
   doSelecting: function (coord){
        var moveAble=false;
        if (!this.activePlayer.selectedCoord) {
            var ele=this.getMapsElement(coord);
            //只能选择自己方的棋子
            if (ele && ele.side==this.activePlayer.side) {
                this.selectedItem(coord);
            }
        }else if (coord[0] == this.activePlayer.selectedCoord[0] && coord[1] == this.activePlayer.selectedCoord[1]) {
            this.unselectedItem(coord);
        } else {
            var src = this.getMapsElement(this.activePlayer.selectedCoord), desc = this.getMapsElement(coord);
            if (desc && src.side == desc.side) { //同一阵营，选中后者
                this.unselectedItem(this.activePlayer.selectedCoord);
                this.selectedItem(coord);
            }else{
                moveAble=true;
            }
        }
        return moveAble;
    },
    
    doMove:function (from,to){
        var ret=false;
        //相邻格子才可以移动
        if (this.moveAble(from, to)) {
            var src = this.getMapsElement(from), desc = this.getMapsElement(to);
            if (desc) {
                switch (this.compareLevel(src, desc)) {
                    case -1:
                        return false;
                    case 0:
                        this.removeItem(from);
                        this.removeItem(to);
                        ret=true;
                        this.activePlayer.selected = false;
                        break;
                    case 1:
                        this.removeItem(to);
                        this.moveItem(from,to);
                        ret=true;
                        break;
                    default:
                }
            } else {
                //目录位置为空则移动
                this.moveItem(from,to);
                ret=true;
            }
        }
        return ret;
    },
    selectedItem:function (coord){
        this.activePlayer.selectedCoord = coord;
        this.send("selectedItem",coord);
    },
    unselectedItem:function (coord){
        this.activePlayer.selectedCoord = null;
        this.send("unselectedItem",coord);
    },
    removeItem:function (coord) {
        this.maps[coord[1]][coord[0]] = null;
        this.send("removeItem",coord);
    },
    moveItem:function (from,to) {
        var ele = this.getMapsElement(from);
        this.maps[to[1]][to[0]] = ele;
        this.maps[from[1]][from[0]] = null;
        this.send("moveItem",[from,to]);
    },
    getMapsElement:function(coord){
        return this.maps[coord[1]][coord[0]];
    },
    getCoord:function (x, y){
        x = Math.floor(x / this.GX);
        y = Math.floor(y / this.GY);
        return [x, y];
    },
    
    moveAble:function (srcCoord, descCoord){
        return (Math.abs(descCoord[0] - srcCoord[0]) + Math.abs(descCoord[1] - srcCoord[1])) == 1;
    },
    
    compareLevel:function (src, desc){
        if (src.level == 8 && desc.level == 1) {
            return -1;
        }
        if (src.level == 1 && desc.level == 8) {
            return 1;
        }
        if (src.level == desc.level) {
            return 0;
        } else if (src.level < desc.level) {
            return -1;
        } else {
            return 1;
        }
    },
    send:function (name,data) {
        var msg={};
        msg[name]=data;
        player1.getData(msg);
        player2.getData(msg);
    },
    post:function(msg){
       if(this.activePlayer.side==msg.side){
            console.log(msg);
            this.cmd(msg.click);
            if(!this.logs) this.logs=[];
            this.logs.push(msg.select);
       }
    },
    getNextPlayer:function (player) {
        if(player.side==0){
            return this.players[1];
        }else{
            return this.players[0];
        }
    },
    isEnd:function () {
        var side=[false,false],ele;
        for(var i=0;i<this.COL;i++){
            for(var j=0;j<this.ROW;j++){
                ele=this.maps[i][j];
                if(ele){
                    side[ele.side]=true;
                }
            }
        }
        if(side[0]==true && side[1]==false){
            alert(this.players[0].name+" wine");
        }else if(side[0]==false && side[1]==true){
            alert(this.players[1].name+" wine");
        }else if(side[0]==false && side[1]==false){
            alert("平手");
        }
    }
}

function Player(o) {
    this.init(o);
}
Player.prototype={
    init:function (o) {
        this.selectedCoord=null;
        this.side=o.side;
        this.name=o.name;
    }
}


function AnimalCheckerClient(o){
    this._init(o);
}
AnimalCheckerClient.prototype={
    _init:function(o){
        this.COL=o.col||4;//行
        this.ROW=o.row||4;//列
        this.GX = o.gx||130;//每格宽占的像素大小
        this.GY=o.gy||130;//每格高占的像素大小
        this.border=o.border||2;
        
        this.user=o.user;
        this.side=o.side;

        this._view=o.view;
        this._content = o.content;
        this.titles=[];
        this.maps=[];
               
        this.createContentItem();
        
        var self=this;
        this._content.onclick=function(e){
             e = e || window.event;
             self.clickEvent(e,this.parentNode);
        };
    },
    //建立，显示的方格
   createContentItem: function (n, m){
        for (var i = 0; i < this.COL; i++) {
            this.maps[i] = [];
            for (var j = 0; j < this.ROW; j++) {
                var img = document.createElement("img");
                this.setPosition(img,j,i);
                this._content.appendChild(img);
                this.maps[i][j] = img;
                this.titles.push(img);
            }
        }
    },
    connect:function(){
        this.initContentItem([0, 1, 2,12, 4, 9, 6, 7, 8, 5, 10, 11, 3, 13, 14, 15],[0,1]);
    },
    //初始化内容
    initContentItem:function (seqs,sides){
        //设置一方
        var nm = this.COL * this.ROW / sides.length, ele, k=0, side, ind, x, y;
        for (var s = 0; s < sides.length; s++) {
            side = sides[s];
            for (ind = 1; ind <= nm; ind++) {
                m=seqs[k];
                y = Math.floor(m/this.COL);
                x = m % this.COL;
                ele = this.titles[m];
                this.maps[y][x] = ele;
                ele.src = "item/" + side + "_" + ind + ".png";
                ele.level = ind;
                ele.side = side;
                k++;
            }
        }
    },
    //点击事件
   clickEvent: function (e,ele){
        var x = y = 0;
        if (e.pageX) {
            x = e.pageX - ele.offsetLeft;
            y = e.pageY - ele.offsetTop;
        } else {
            x = e.x;
            y = e.y;
        }
        var coord = this.getCoord(x, y);
        this.send({'click':coord});
    },
    selectedItem:function (coord){
        this.getMapsElement(coord).style.backgroundColor = "green";
    },
    unselectedItem:function (coord){
        var ele=this.getMapsElement(coord);
        if(ele) ele.style.backgroundColor = "#FFFF00";
    },
    removeItem:function (coord) {
        var ele = this.getMapsElement(coord);
        ele.style.display="none";
        this.maps[coord[1]][coord[0]] = null;
    },
    moveItem:function (data) {
        var from=data[0],to=data[1];
        var ele = this.getMapsElement(from);
        this.setPosition(ele,to[0],to[1]);
        this.maps[to[1]][to[0]] = ele;
        this.maps[from[1]][from[0]] = null;
    },
    setPosition:function(ele,x,y){
        ele.style.left = this.border + x * this.GX + "px"
        ele.style.top = this.border + y * this.GY + "px"
    },
    getMapsElement:function(coord){
        return this.maps[coord[1]][coord[0]];
    },
    getCoord:function (x, y){
        x = Math.floor(x / this.GX);
        y = Math.floor(y / this.GY);
        return [x, y];
    },
    send:function(msg){
        msg.user=this.user;
        msg.side=this.side;
        server.post(msg);
    },
    getData:function (msg) {
        console.log(this.user+" recive:",msg);
        var action;
        for(action in msg);
        this[action](msg[action]);
    }
}