var RelationMap;
(function () {
    RelationMap=function () {
        this._map = {};
    };

    RelationMap.prototype = {
        _setRelation: function (a, b, v) {
            if (!this._map[a]) {
                this._map[a] = {};
            }

            this._map[a][b] = v;
        },

        setRelation: function (a, b, v) {
            this._setRelation(a, b, v);
            this._setRelation(b, a, -v);
        },

        getRelation: function (a, b) {
            if (this._map[a] == null) {
                return 0;
            }

            if (this._map[a][b] == null) {
                return 0;
            }

            return this._map[a][b];
        },
        _removeRelation: function (a, b) {
            if (this._map[a] != null) {
                delete  this._map[a][b];
            }
        },
        removeRelation: function (a, b) {
            this._removeRelation(a, b);
            this._map(b, a);
        },

        /**
         * 这里的before item指的是值为负数的，即a在这些元素之前
         * @param a
         * @private
         */
        _getBeforeItems: function (a) {
            var subMap = this._map[a];
            var ret = [];
            for (var k in subMap) {
                if (subMap[k] < 0) {
                    ret.push(k);
                }
            }
            return ret;
        },

        /**
         * 这里的after item指的是值为正数的，即a在这些元素之后
         * @param a
         * @private
         */
        _getAfterItems: function (a) {
            var subMap = this._map[a];
            var ret = [];
            for (var k in subMap) {
                if (subMap[k] > 0) {
                    ret.push(k);
                }
            }
            return ret;
        },

        compareRelation: function (a, b) {
            //直接查表的二个元素
            var result = this.getRelation(a, b);
            if (result) {
                return result;
            }

            //递推查表,从A搜索到b
            var befores = this._getBeforeItems(a), afters = this._getAfterItems(a);

            //搜索前向,即向a的后面元素(底层级)
            while (befores.length) {
                var c = befores.pop();
                if (c == b) {
                    return -1;
                }
                befores = befores.concat(this._getBeforeItems(c));
            }

            while (afters.length) {
                var c = afters.pop();
                if (c == b) {
                    return 1;
                }
                afters = afters.concat(this._getAfterItems(c));
            }
            //搜索不到。a和b没有关系
            return 0;
        },

        clear: function () {
            this._map = {};
        }
    };

})();

//var rm=new RelationMap();
//
//rm.setRelation(1,2,-1);
//rm.setRelation(2,3,-1);
//rm.setRelation(3,4,-1);
//rm.setRelation(4,5,-1);
//rm.setRelation(3,6,-1);
//rm.setRelation(4,6,1);
//
//var r=rm.compareRelation(4,2);
//console.log(r);
//
//var a=[6,3,2,1,5,4];
//
//a.sort(function(i,j){
//    var r= rm.compareRelation(i,j)
//    return  r==0?1:r;
//});
//
//console.log(a);
