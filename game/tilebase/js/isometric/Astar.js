(function() {
    if(typeof isometric=="undefined")
        isometric= {};
    /**
     *定义A星
     *A星搜索的是整数的单元格。如果不是单元格，转换成单元格。(也就是坐标为整数,通常使用Math.floor)
     */
    function AStar() {
        this.initialize.apply(this,arguments);
    }

    isometric.AStar=AStar;

    AStar.prototype = {
        nearNodes:[
        [-1 ,-1],[0 ,-1],[1,-1],
        [-1 , 0],        [1, 0],
        [-1 , 1],[0 , 1],[1, 1]
        ],
        /**
         * 初始化
         * @param {Object} o
         */
        initialize: function(o) {
            //this.maps = o.maps;//地图信息二维
            this.barriers = o.barriers||[];//障碍物信息二维
            this.openSeq = [];//开启队列，存放每个结点。结点属性,parent 父结点，x,y地图坐,f,g,h路径评分
            this.opens = [];//开起列表,设置地图上的坐标，表示开启状态
            this.closes = [];//关闭列表,存放已经到达过的点
            //设置搜索范围
            this.setRange(o.range||o);

            o.start&&this.setStart(o.start);
            o.end&&this.setEnd(o.end);

            this.succeed=o.succeed;
            this.fail=o.fail;

            if (o.auto) {
                //执行结果
                var result = this.search();
                if (result === false) {
                    this.doFail();
                } else {
                    this.doSucceed(result);
                }
            }
            // }
        },

        reset: function () {
            this.openSeq = [];
            this.opens = [];
            this.closes = [];
        },

        setStart: function (start) {
            this.startNode = {
                parent: null,
                x: start.x,
                y: start.y,
                g: 0
            };
            this.addToOpen(this.startNode);
        },

        setEnd: function (end) {
            this.endNode = {
                parent: null,
                x: end.x,
                y: end.y
            };
        },

        setRange: function (range) {
            this.minX=range.minX==null?Number.NEGATIVE_INFINITY:range.minX;//地图的最小模坐标
            this.minY=range.minY==null?Number.NEGATIVE_INFINITY:range.minY;//地图的最小纵坐标
            this.maxX=range.maxX==null?Number.POSITIVE_INFINITY:range.maxX;//地图的最大模坐标
            this.maxY=range.maxY==null?Number.POSITIVE_INFINITY:range.maxY;//地图的最大纵坐标
        },

        setBarriers: function (barriers) {
            this.barriers=barriers;
        },

        addBarriers: function (barriers) {
            for(var i=0,l=barriers.length;i<l;i++) {
                this.addBarrier(barriers[i]);
            }
        },

        addBarrier: function (barrier) {
            if(!this.barriers[barrier.y]) {
                this.barriers[barrier.y]=[];
            }
            barriers[barrier.y][barrier.x]=barrier;
        },

        /**
         * 查找路径，直到打开列表为空
         */
        search: function () {
            //对起点和终点为同一点的判断
            if(this.isEnd(this.startNode.x, this.startNode.y)) {
                return false;
            };
            var ret=false;
            while (this.openSeq.length > 0) {
                //从开起列表中取出F值最小的结点。
                this.currentNode = this.getNext();
                //当前结点添加到关闭列表
                this.addToClose(this.currentNode);
                //处理相邻结点
                if(ret=this.checkNearby()) {
                    return ret;
                }
            }
            return ret;
        },

        checkNearby: function () {
            var i,j,x, y, near,node, tmpNode;
            for(var k=0,l=this.nearNodes.length;k<l;k++) {
                near=this.nearNodes[k];
                i=near[0];
                j=near[1];
                y = this.currentNode.y + j;
                x = this.currentNode.x + i;
                //结束提前，可对目标是障碍物进行寻路。(例:人物要对某个建筑进行操作，比如攻击，要走到建筑旁边才可以)
                if (this.isEnd(x, y,i,j)) {//如果是斜着寻路，则要对旁边是否有障碍物进行判断。
                    return this.currentNode;//返回靠近终点的结点
                }
                if (!this.isOut(x, y) && !this.isBarrier(x, y, i, j)) {
                    if (this.isNotInClose(x, y)) {//TODO 优化。先不创建node，而是计算G，再进行处理。
                        //没有在关闭结点中，计算F，G,H值。
                        node = this.createNode(x, y, i == 0 || j == 0);
                        if (this.isInOpen(x, y)) {
                            //在开起列表中，比较G值
                            tmpNode = this.opens[y][x];
                            if (node.g < tmpNode.g) {
                                //有最小F值，重新排序
                                this.removeFromOpen(tmpNode);
                                this.addToOpen(node);
                            }
                        } else {
                            //直接添加到开起列表中
                            this.addToOpen(node);
                        }
                    }
                }
            }
            return false;
        },

        /**
         * 取得下一个搜索点
         */
        getNext: function() {
            var node = this.openSeq.shift();
            this.opens[node.y][node.x] = null;

            //调试使用
            //this.options.addClass(this.maps[node.y][node.x], "step");
            //this.showSeq();

            return node;
        },

        /**
         * 创建搜索点
         *
         * parent   父结点
         * x,y  地图坐
         * f    路径评分
         * g    移动耗费
         * h    预估移动耗费
         * @param {Object} x
         * @param {Object} y
         * @param {Object} notCross 是否是对角线
         */
        createNode: function(x, y, notCross) {
            var node = {
                parent: this.currentNode,
                x: x,
                y: y,
                g: this.currentNode.g + (notCross ? 10 : 14),
                h: this.getH(x, y)
            };
            node.f = node.g + node.h;
            return node;
        },

        /**
         * 结点添加到开起列表中
         * @param {Object} node
         */
        addToOpen: function(node) {
            var i = 0,l=this.openSeq.length;
            while (i < l && node.f > this.openSeq[i].f) {
                i++;
            }
            this.openSeq.splice(i, 0, node);
            if(!this.opens[node.y])
                this.opens[node.y]=[];
            this.opens[node.y][node.x] = node;

            //调试使用
            //this.options.addClass(this.maps[node.y][node.x], "searching");
            //this.maps[node.y][node.x].innerHTML = '<p class="f">' + node.f + '</p><p class="g">' + node.g + '</p><p class="h">' + node.h + '</p>';
            //this.showSeq();
        },

        /**
         * 结点从开起列表中删除
         * @param {Object} node
         */
        removeFromOpen: function(node) {
            var i = 0,l=this.openSeq.length;
            for(;i<l;i++) {
                if(node == this.openSeq[i]) {
                    break;
                }
            }
            this.openSeq.splice(i, 1);
            this.opens[node.y][node.x] = null;

            //this.showSeq();
        },

        /**
         * 判断结点是否在开起列表中
         * @param {Object} x
         * @param {Object} y
         */
        isInOpen: function(x, y) {
            return this.opens[y] && this.opens[y][x] != null;
        },

        sortOpenSeq: function() {

        },

        /**
         * 把结点添加到关闭列表中
         * @param {Object} node
         */
        addToClose: function(node) {
            if(!this.closes[node.y])
                this.closes[node.y]=[];
            this.closes[node.y][node.x] = node;
        },

        /**
         * 判断是否在关闭列表中
         * @param {Object} x
         * @param {Object} y
         */
        isNotInClose: function(x, y) {
            return this.closes[y]==null || this.closes[y][x] == null;
        },

        /**
         * 估算H值
         * @param {Object} x
         * @param {Object} y
         */
        getH: function(x, y) {
            return Math.abs(this.endNode.x - x) * 10 + Math.abs(this.endNode.y - y) * 10;
        },

        /**
         * 边界判断
         * @param {Object} x
         * @param {Object} y
         */
        isOut: function(x, y) {
            return y < this.minY || y >= this.maxY || x < this.minX || x >= this.maxX;
        },

        /**
         * 判断斜对角二边是否为障碍物
         * @param {Object} x
         * @param {Object} y
         * @param {Object} stepX
         * @param {Object} stepY
         */
        isBarrierOfCrossSide: function(x,y,stepX,stepY) {
            return stepX != 0 && stepY != 0 && (this.barriers[y - stepY] && this.barriers[y - stepY][x] != null || this.barriers[y] && this.barriers[y][x - stepX] != null);
        },

        /**
         * 判断是不是障碍点
         * @param {Object} x
         * @param {Object} y
         * @param {Object} stepX
         * @param {Object} stepY
         */
        isBarrier: function(x, y, stepX, stepY) {
            var ret = this.barriers[y]!=null && this.barriers[y][x] != null;
            //加入对斜角旁边的点进行判断
            ret=ret||this.isBarrierOfCrossSide(x,y,stepX,stepY);
            return ret;
        },

        /**
         * 判断是否结束
         * @param {Object} x
         * @param {Object} y
         */
        isEnd: function(x, y,stepX, stepY) {
            return this.endNode.x == x &&
            this.endNode.y == y &&
            !this.isBarrierOfCrossSide(x,y,stepX,stepY);//加入对斜角旁边的点进行判断
        },

        /**
         * 查找成功
         * @param {Object} node
         */
        doSucceed: function(node) {
            if(this.succeed)
                this.succeed(node);
            //this.getPath(node);
        },

        /**
         * 查找失败
         */
        doFail: function() {
            if(this.fail)
                this.fail();
        },

        /**
         * 取得路径
         * 路径是反向的，从终点到结点
         * @param {Object} node
         */
        getPath: function(node) {
            var ret=this.getPathWithoutEnd(node);
            ret.unshift({
                x:this.endNode.x,
                y:this.endNode.y
            });
            return ret;
        },

        getPathWithoutEnd: function(node) {
            var node=node||this.currentNode,p = node, ret = [];
            while (p) {
                ret.push({
                    x: p.x,
                    y: p.y
                });
                //调试使用
                //this.options.addClass(this.maps[p.y][p.x], "path");
                p = p.parent;
            }
            return ret;
        },

        /**
         * 显示开起队列
         */
        showSeq: function() {
            var html = "<p>" + this.openSeq.length + "</p>";
            for (var i = 0; i < this.openSeq.length; i++) {
                var node = this.openSeq[i];
                html += '<p>F=' + node.f + ',x=' + node.x + ',y=' + node.y + '</p>'
            }
            this.options.info.innerHTML = html;
        }

    };
    //========================以下是对A星扩展的例子=========================//
    /**
     * 直线搜索
     */
    var LineAStar= function (o) {
        this.init(o);
    }

    LineAStar.prototype= {
        nearNodes:[
        [0 ,-1],
        [-1 , 0],        [1, 0],
        [0 , 1]
        ],
        getPolygon: function () {

        }

    }
    for(var p in AStar.prototype) {
        if(!LineAStar.prototype[p]) {
            LineAStar.prototype[p]= AStar.prototype[p]
        }
    }
    /**
     * 改进搜索过程
     * 提供扩展A星的思路
     */
    var ExtAStar= function (o) {
        this.init(o);
    }

    ExtAStar.prototype= {
        /**
         * 查找路径，直到打开列表为空
         * 理论上来搜索的更快，更实际效果并不明显
         */
        search: function() {
            var x, y, node, tmpNode;
            while (this.openSeq.length > 0) {
                //从开起列表中取出F值最小的结点。
                this.currentNode = this.getNext();
                //当前结点添加到关闭列表
                this.addToClose(this.currentNode);
                //处理相邻结点
                for (var i = -1; i < 2; i++) {
                    y = this.currentNode.y + i;
                    for (var j = -1; j < 2; j++) {
                        if(i==0&&j==0)
                            continue;
                        x = this.currentNode.x + j;
                        //没有超出边界，没有被阻挡
                        if (!this.isOut(x, y) && !this.isBarrier(x, y, j, i)) {
                            //检查是否完成
                            if (this.isEnd(x, y)) {
                                return this.currentNode;//返回靠近终点的结点
                            } else if (this.isNotInClose(x, y)) {//TODO 优化。先不创建node，而是计算G，再进行处理。
                                //没有在关闭结点中，计算F，G,H值。
                                node = this.createNode(x, y, i == 0 || j == 0);
                                if (this.isInOpen(x, y)) {
                                    //在开起列表中，比较G值
                                    tmpNode = this.opens[y][x];
                                    if (node.g < tmpNode.g) {
                                        //有最小F值，重新排序
                                        this.removeFromOpen(tmpNode);
                                        this.addToOpen(node);
                                    }
                                } else {
                                    //直接添加到开起列表中
                                    this.addToOpen(node);
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }

    }
    for(var p in AStar.prototype) {
        if(!ExtAStar.prototype[p]) {
            ExtAStar.prototype[p]= AStar.prototype[p]
        }
    }
})();