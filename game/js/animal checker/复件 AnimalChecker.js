/**
 * 事件
 *      1.选中
 *      2.取消选中
 *      3.移动
 *      4.消失
 *      5.
 * @param {Object} o
 */
function AnimalChecker(o){
    this._init(o);
}
AnimalChecker.prototype={
    _init:function(o){
        this.COL=o.col||4;//行
        this.ROW=o.row||4;//列
        this.GX = o.gx||130;//每格宽占的像素大小
        this.GY=o.gy||130;//每格高占的像素大小
        this.border=o.border||2;
        
        this.sides=[0,1];
        this._view=o.view;
        this._content = o.content;
        this.titles=[];
        this.maps=[];
        this.me=new Player();
        
        this.createContentItem();
        
        var self=this;
        this._content.onclick=function(e){
             e = e || window.event;
             self.clickEvent(e,this.parentNode);
        };
        
        this.loadData();
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
    loadData:function(){
        this.seqs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this.initContentItem();
    },
    //初始化内容
    initContentItem:function (){
        //设置一方
        var nm = this.COL * this.ROW / this.sides.length, ele, k=0, side, ind, x, y;
        for (var s = 0; s < this.sides.length; s++) {
            side = this.sides[s];
            for (ind = 1; ind <= nm; ind++) {
                m=this.seqs[k];
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
        
        if (this.me.hasSelected()) {
            if (this.doSelecting(coord)) {
                if(this.doAction(this.me.getCoord(),coord)){
                       this.me.setCoord(coord);
                }
            }
        } else {
            if (this.maps[coord[1]][coord[0]]) {
                this.me.selectTitle(coord);
                this.me.setSelect(true);
            }
        }
    },
    
   doSelecting: function (coord){
       var meCoord=this.me.getCoord(),ret=true;
       if (coord[0] == meCoord[0] && coord[1] == meCoord[1]) {
            this.me.unselectTitle(coord);
            ret=false;
        } else {
            var src = this.getMapsElement(meCoord), desc = this.getMapsElement(coord);
            if (desc) {
                //同一阵营，选中后者
                if (src.side == desc.side) {
                    this.me.selectTitle(coord);
                    ret=false;
                }
            }
        }
        return ret;
    },
    
    doAction:function (from,to){
        var ret=false;
        //相邻格子才可以移动
        if (this.moveAble(from, to)) {
            var src = this.getMapsElement(from), desc = this.getMapsElement(to);
            if (desc) {
                switch (this.compareLevel(src, desc)) {
                    case -1:
                        break;
                    case 0:
                        src.style.display = "none";
                        desc.style.display = "none";
                        this.maps[from[1]][from[0]] = null;
                        this.maps[to[1]][to[0]] = null;
                        this.doEqual();
                        this.sider.selected=false;
                        ret=true;
                        break;
                    case 1:
                        desc.style.display = "none";
                        this.maps[to[1]][to[0]] = src;
                        this.maps[from[1]][from[0]] = null;
                        this.setPosition(src,to[0],to[1]);
                        this.doBig();
                        ret=true;
                        break;
                    default:
                }
            } else {
                //目录位置为空则移动
                this.maps[to[1]][to[0]] = src;
                this.maps[from[1]][from[0]] = null;
                this.setPosition(src,to[0],to[1]);
                this.doMove();
                ret=true;
            }
        }
        return ret;
    },
    
    selectedItem:function (coord){
        //去除上次的选中项
        if (this.sider.selected) {
            this.getMapsElement(this.sider.currentCoord).style.border = "0 none";
        }
        this.getMapsElement(coord).style.border = "1px solid green";
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
    setPosition:function(ele,x,y){
        ele.style.left = this.border + x * this.GX + "px"
        ele.style.top = this.border + y * this.GY + "px"
    }
}
function Player(animalChecker){
    this.animalChecker=animalChecker;
    this.selected= false,
    this.coord=null;
}
Player.prototype={
    setSelect:function(v){
        this.selected=v;
    },
    hasSelected:function(){
        return this.selected;
    },
    selectTitle:function(coord){
        //去除上次的选中项
        if (this.selected) {
            this.animalChecker.getMapsElement(this.coord).style.border = "0 none";
        }
        this.animalChecker.getMapsElement(coord).style.border = "1px solid green";
        this.setCoord(coord);
    },
    unselectTitle:function(coord){
        this.animalChecker.getMapsElement(coord).style.border = "1px solid green";
        this.setSelect(false);
    },
    setCoord:function(coord){
        this.coord=coord;
    },
    getCoord:function(){
        return this.coord;
    }
}
