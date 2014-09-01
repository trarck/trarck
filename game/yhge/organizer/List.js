(function(){
    var geo=yhge.math.geometry;

    var List=function  () {
        this.initialize.apply(this,arguments);
    };
    
    List.prototype={

        classname:"List",

        initialize:function  (rect) {
            this._items=[];
            //处理范围

            this._bounding={
                left:rect.x,
                top:rect.y,
                right:rect.x+rect.width,
                bottom:rect.y+rect.height
            };
        },
        /**
         * 对于静态语言可以使用hash保存obj与range的对应关系。
         */
        add:function(obj,dynamic) {

            var range;
            if(!dynamic){
                //每个对象只需要添加一次
                if(!obj.__range){
                    range=this.calcRange(obj);
                    if(range){
                        range.dynamic=dynamic;
                        this._items.push(range);
                    }
                }
            }else{
                range={};
                range.obj=obj;
                obj.__range=range;
                range.dynamic=dynamic;
                this._items.push(range);
            }

        },
        
        remove:function(obj){
            if(obj.__range){
                var i=this._items.indexOf(obj.__range);
                this._items.splice(i,1);
                delete obj.__range.obj;
                delete obj.__range;
            }
        },

        update:function(obj){
            if(obj.__range){
                var range
                if(!obj._dynamic){
                    //每个对象只需要添加一次
                    this.remove(obj);
                    range=this.calcRange(obj);
                    if(range){
                        range.dynamic=false;
                        this._items.push(range);
                    }
                }else{
                    this.remove(obj);
                    range={};
                    range.obj=obj;
                    obj.__range=range;
                    range.dynamic=true;
                    this._items.push(range);
                }
            }else{
                this.add(obj,obj._dynamic);
            }
        },

        indexOf:function (obj) {
            var idx=-1;
            for(var i=0,l=this._items.length;i<l;i++){
                if(this._items[i].obj==obj){
                    idx=i;
                    break;
                }
            }
            return idx;
        },
        /**
         * 取得某个范围内的物体。完全包含
         */
        getObjsInRange:function  (range) {
            var objs=[],item;
            for(var i=0,l=this._items.length;i<l;i++){
                item=this._items[i];
                if(item.dynamic){
                    item=this.calcRange(item.obj);
                    if(item && geo.hitTestRangeContainRange(range,item)){
                        objs.push(item.obj);
                    }
                }else if(geo.hitTestRangeContainRange(range,item)){
                    objs.push(item.obj);
                }
            }
            return objs;
        },
        /**
         * 取得某个范围内的物体。完全包含
         */ 
        getObjsContainPoint:function  (x,y) {
            var objs=[],item;
            for(var i=0,l=this._items.length;i<l;i++){
                item=this._items[i];
                if(item.dynamic){
                    item=this.calcRange(item.obj);
                    if(item && geo.hitTestRangeContainPoint(item,x,y)){
                        objs.push(item.obj);
                    }
                }else if(geo.hitTestRangeContainPoint(item,x,y)){
                    objs.push(item.obj);
                }
            }
            return objs;
        },

        addRange:function(range) {
            //只改变range和left,top,right,bottom属性，range还是原来的range对象。
            range=geo.cutRange(this._bounding,range);
            if(range){
                this._items.push(range);
            }
        },
        removeRange:function(range){
            var i=this.indexOfRange(range);
            if(i>-1) this._items.splice(i,1);
        },
        indexOfRange:function (range) {
            var obj=range.obj;
            if(!obj) return -1;
            var idx=-1;
            for(var i=0,l=this._items.length;i<l;i++){
                if(this._items[i].obj==obj){
                    idx=i;
                    break;
                }
            }
            return idx;
        },
        calcRange:function(obj){
            var range;
            if(obj.worldBoundingRect){
                //转换成世界坐标
                var rect=obj.worldBoundingRect();
                range={
                    left:rect.x,
                    top:rect.y,
                    right:rect.x+rect.width,
                    bottom:rect.y+rect.height
                };
            }else{
                //已经是世界坐标
                range={
                    left:obj._position.x,
                    top:obj._position.y,
                    right:obj._position.x+obj._width,
                    bottom:obj._position.y+obj._height
                };
            }
            //范围截取
            range=geo.cutRange(this._bounding,range);
            if(range){
                range.obj=obj;
            }
            return range;
        },

        setItems:function(items) {
            this._items = items;
            return this;
        },
        getItems:function() {
            return this._items;
        }
    };
    yhge.organizer.List=List;
})();