/* 
 * yh v0.2
 */
(function($){
/*
 *定义类与部件
 */
	/*
	 *通用方法，用于继承
	 */
	$.common={
		option:function(key,value){
			var options = key;

			if ( typeof key === "string" ){
				if ( value === undefined )
					return this.options[key];
				else {
					options = {};
					options[ key ] = value;
				}
			}
			$.extend(this.options,options);
		}
	};
	/*
	 *静态方法，供全局使用
	 */
	$.My=$.YH={
		position: function(pos,ele){
			if(pos==undefined){
				pos=[0,0];
			}
			
			if (pos.constructor != Array) {
				var dom = $(pos);
				if (dom.length > 0) {
				   var  offset = dom.offset();
					offset.left += dom.outerWidth();
					return offset;
				}
			}

			var wnd = $(window), doc = $(document), pTop = doc.scrollTop(), pLeft = doc.scrollLeft(), minTop = pTop;
			if(pos.length==1){
				pos[1]="middle";
			}
			if (pos[0].constructor == Number) {
				pLeft += pos[0];
			} else {
				switch (pos[0]) {
					case 'left':
						pLeft += 0;
						break;
					case 'right':
						pLeft += wnd.width() - ele.outerWidth();
						break;
					case 'center':
					default:
						pLeft += (wnd.width() - ele.outerWidth()) / 2;
				}
			}
			if (pos[1].constructor == Number) {
				pTop += pos[1];
			} else {
				switch (pos[1]) {
					case 'top':
						pTop += 0;
						break;
					case 'bottom':
						pTop += wnd.height() - ele.outerHeight();
						break;
					case 'middle':
					default:
						pTop += (wnd.height() - ele.outerHeight()) / 2;
				}
			}
			pTop = Math.max(pTop, minTop);
			return {
				left: pLeft,
				top: pTop
			};
		},
		implement:function (){
			var l = arguments.length,target=arguments[0]||{},deep=false,i=1;
			
			if(typeof (target)=='boolean'){
				deep=target;
				target = arguments[1] || {};
				i=2;
			}
			
			for(;i<l;i++){
				var object = arguments[i];
				if (typeof(object) != 'object') continue;
				for (var key in object){
					var op = object[key], mp = target[key];

					//target存在改属性，则跳过||阻止死循环
					if(target===op){
						continue;
					}
					if(mp){
						if(deep&&typeof(op) == 'object' && typeof(mp) == 'object'){
							target[key] =  $.YH.implement(deep,mp, op);
						}
					}else{
						target[key] =op;	
					}
				}
			}
			return target;
		},
		extendOriginal:function(Class,prop,cls){
			if (typeof prop == 'object') {
				for (var name in prop) {
					if (!Class.prototype[name]) {
						Class.prototype[name] = prop[name];
					}
				}
			}
			if (typeof cls == 'object') {
				for (var p in cls) {
					if (!Class[p]) {
						Class[p] = cls[p];
					}
				}
			}
		},
		ucfirst: function(str){
			str+='';
			var f = str.charAt(0).toUpperCase();
			return f + str.substr(1);
		},
		lcfirst: function(str){
			str+='';
			var f = str.charAt(0).toLowerCase();
			return f + str.substr(1);
		},
		/*
		 *user.school.master.name
		 *obj=user,name="school.master.name";
		 */
		attr:function (obj,name) {
			var r,t
			if(name.indexOf(".")>-1){
				t=name.split(".");
				r=obj[t[0]];
				for(var i=1;i<t.length;i++){
					r=r[t[i]];
				}
			}else{
				r=obj[name];
			}
			return r;
		}
	};
	/*
	 *创建命名空间
	 */
	$.YH.createNameSpace=$.createNameSpace = function(name){
		var namespace = name.split("."), name = namespace.pop(), ns = this, p;
		for (var ii in namespace) {
			p = $.YH.ucfirst(namespace[ii]);
			ns = (p in ns ? ns[p] : ns[p] = {});
		}
		return {
			"ns": ns,
			"cName": name
		};
	};
	/*
	 *申明类
	 *name String
	 *prototype Object 原型对象
	 *content	Object 类属性
	 */
	$.YH.declare =$.declare = function(name, prototype,content){
		var nsc = $.createNameSpace(name);
		var cName=$.YH.ucfirst(nsc.cName);
		nsc.ns[cName] = function(element, options){
			//this._cs=this.constructor;
			//引用类，直接使用this.constructor
			this.widgetBaseClass=this.constructor||content;
			this.namespace = this.constructor.nameSpace;
			this.widgetName=this.className = this.constructor.className;
			//防止原型与定义函数不一致，使用BaseClass。
            this.BaseClass=nsc.ns[cName];
			//处理参数
			if(!element){
				 element=document.body;
			}else if( element!=window && typeof options=='undefined' && typeof element.nodeType=='undefined'){
				options=element;
				element=document.body;
			}
			
			this.options = $.extend({}, nsc.ns[cName].defaults, options);
			
			this.element = $(element);
			if ($.isFunction(this._init)) {
			   return this._init();
			}
		};
		//扩充自身属性
		if(typeof content!='undefined')	$.extend(nsc.ns[cName],content);
		//命名空间
		nsc.ns[cName].nameSpace = nsc.ns;
		//名称
		nsc.ns[cName].className=nsc.ns[cName].cName=cName;
		//添加 prototype
		//使用extend，对以后new 对像要快。见tests/constructora.html,tests/constructorb.html
		$.extend(nsc.ns[cName].prototype,prototype);
		//nsc.ns[cName].prototype = prototype;
		//直接赋值导致constructor的改变，必须修改过来。或不改变prototype，直接使用$.extend扩展。$.extend(nsc.ns[cName].prototype, prototype);
		//nsc.ns[cName].prototype.constructor=nsc.ns[cName];
		return nsc.ns[cName];
	};
	/*
	 *申明部件
	 */
	$.YH.widget=$.myWidget = function(name, prototype,content){
		var dec,wdName;
		if(typeof prototype=='function'){
			dec=prototype;
			wdName=$.YH.lcfirst(name)
		}else{
			dec=$.YH.declare(name, prototype,content);
			wdName=$.YH.lcfirst(dec.cName);
		}
		// create plugin method
		$.fn[wdName] = function(options){
			var isMethodCall = (typeof options == 'string'), args = Array.prototype.slice.call(arguments, 1);
			
			// @修饰的方法，返回widget的值，而不是返回jQuery对象.第二个参数（紧跟@修饰的方法的参数）为第几个dom对应的widget
			// 直接调用返回jQuery对象
			if (isMethodCall){
				switch (options.substring(0, 1)){
					case '_':
						return this;
					case '@':
						var ind=args.shift()||0;
						var dom=this[ind];
						var instance = dom&&$.data(dom, wdName);
						return (instance ? instance[options.substring(1)].apply(instance, args):undefined);
				}
			}
			
			// handle initialization and non-getter methods
			return this.each(function(){
				var instance = $.data(this, wdName);
				if (instance && isMethodCall && $.isFunction(instance[options])) {
					instance[options].apply(instance, args)
				} else if (!isMethodCall&&!instance) {
					instance = new dec(this, options);
					$.data(this, wdName, instance);
				}
			});
		};
	};
	$.YH.Class=function(){
		var name=arguments[0],prototype=arguments[1],cls;
		
        //name,prototype,content||fatherClass
		if(arguments.length==3){
			cls=arguments[2];
			if(cls.prototype!=null){
				prototype=$.extend({},cls.prototype,prototype);
			}
        //name,prototype,content,fatherClass
		}else if(arguments.length==4){
			var cnt=arguments[2];
			var fCls=arguments[3];
			cls=$.extend(true,{},cnt,fCls);
			if(fCls.prototype!=null){
				prototype=$.extend({},fCls.prototype,prototype);
			}
		}else{
			//扩展原型
			var args=[true,{}];
			for(var i=2;i<arguments.length;i++){
				if(arguments[i].prototype){
					args.push(arguments[i].prototype);
				}
			}
			args.push(prototype);
			prototype=$.extend.apply(this,args);
			//扩展自身属性
			arguments[0]=true;
			arguments[1]={};
			cls=$.extend.apply(this,arguments);
		}
		$.YH.declare(name,prototype,cls);
	};
/**
 * 阻止移动过程中选中
 * 
	IE:
	   1.设置selectstart使其返回false。(chrome下也适用)---最佳方法
	   2.设置属性unselectable为on，并设置其所月子结点的unselectable属on。(对于指定了某个元素为handle比较适用)
	   3.捕获事件(setCapture，releaseCapture)
	   4.在mousemove中调用selection.empty()
	   5.document的mousemove返回false。(preventDefault也可以)
	非IE:
	   1.设置mousedown返回false。(preventDefault也可以)---最佳方法
	   2.设置user-select样式为none。
	   3.在mousemove中调用window.getSelection().removeAllRanges()－－FF,safari,chrome
   					document.selection = null--Opera
 */
    $.YH.Mouse = {
        _mouseStarted: false,
		_mouseInit:function(){
			var self = this;
            this.handle
			.bind("mousedown",function(e){
                self._mouseDown(e);
				//return false;//选回false，jQuery自动调用 event.preventDefault();event.stopPropagation(); 
            })
            .css({ 'MozUserSelect': 'none', "KhtmlUserSelect": "none", 'UserSelect': 'none'})//阻止选中，非IE.
			.bind('selectstart.YH', function(){return false; });//阻止选中，IE.如果设置了范围
		},
        _mouseDown: function(e){
			//决断是不是不处理的元素。cancel中的设置只做用于当前dom，不代表其子元素。
			if(this._isCancel(e.target)) return;
            this._mouseDownEvent = e;
            this._mouseStarted = true;
            var self = this;
			
            $(document).bind("mousemove.YH",function(e){
                self._mouseMove(e);
				return false;//阻止选中，如果设置了范围，鼠标会超出元素。则之前设置的阻止选中无效。
            }).bind("mouseup.YH",function(e){
                self._mouseUp(e);
            });
			this._mouseStart(e);
			////阻止选中
			//($.browser.safari || e.preventDefault());
        },
        _mouseMove: function(e){
            if (!this._mouseStarted)  return;
			this._mouseDrag({x:e.pageX - this._mouseDownEvent.pageX,y:e.pageY - this._mouseDownEvent.pageY},e);
			////阻止选中
			//e.preventDefault();
        },
        _mouseUp: function(e){
            this._mouseStarted = false;
            $(document).unbind("mousemove.YH").unbind("mouseup.YH");
			this._mouseStop(e);
        },
        _position:function(){
             if ("static" == this.element.css("position")) {
				//没有设置position或为static则其初始值为0
                this.position = {
                    top: 0,
                    left: 0
                };
				this.element.css("position",'relative')
            } else {
				//无论position为relative，absolute，fixed，取当前样式的top与left,不能使用jquery的position
                var top = parseInt(this.element.css("top"));
                var left = parseInt(this.element.css("left"));
                //top = isNaN(top) ? 0 : top;
                //left = isNaN(left) ? 0 : left;
                this.position = {
                    top: top,
                    left: left
                };
            }
        },
		_mouseStart: function(e) {
			this.mouseStart(e);
			$.isFunction(this.options.start)&&this.options.start(e,this);
		},
		_mouseDrag: function(distance,e) {
			this.mouseDrag(distance);
			$.isFunction(this.options.drap)&&this.options.drap(e,this,distance);
		},
		_mouseStop: function(e) {
			this.mouseStop(e);
			$.isFunction(this.options.stop)&&this.options.stop(e,this);
		},
		_isCancel:function(ele){
			this.updateCancel();
			return this.cancel&&this.cancel.index(ele)>-1?true:false;
		},
		updateCancel:function(){
			
		}
    };
    

	$.easing.jswing = $.easing.swing;
	$.extend($.easing,{
		def: 'easeOutQuad',
		swing: function (x, t, b, c, d) {
			//alert($.easing.default);
			return $.easing[$.easing.def](x, t, b, c, d);
		},
		easeInQuad: function (x, t, b, c, d) {
			return c*(t/=d)*t + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInCubic: function (x, t, b, c, d) {
			return c*(t/=d)*t*t + b;
		},
		easeOutCubic: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOutCubic: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},
		easeInQuart: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t + b;
		},
		easeOutQuart: function (x, t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOutQuart: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		easeInQuint: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOutQuint: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},
		easeInSine: function (x, t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOutSine: function (x, t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOutSine: function (x, t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		},
		easeInExpo: function (x, t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOutExpo: function (x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOutExpo: function (x, t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function (x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOutCirc: function (x, t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOutCirc: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		},
		easeInElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},
		easeInOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		},
		easeInBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		easeInBounce: function (x, t, b, c, d) {
			return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
		},
		easeOutBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOutBounce: function (x, t, b, c, d) {
			if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
			return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	});

    $.YH.widget('YH.dragDrop', $.extend({}, $.YH.Mouse, {
        _init: function(){
			if(this.options.handle){
				this.handle =$(this.options.handle,this.element);
			}else{
            	this.handle = this.element;
			}
            
			if(this.options.cancel){
				this.cancel =$(this.options.cancel,this.element);
			}
			//x、y单方向移动
            this.axis={x:1,y:1};
			var axis=this.options.axis||'';
			switch (axis.toLowerCase()) {
				case 'x':
					this.axis.y=0;
					break;
				case 'y':
					this.axis.x=0;
					break;
				default:
					break;
			}
            this._mouseInit();
        },
        mouseStart: function(e){
           //处理初始位置。
          this._position();
        },
        mouseDrag: function(distance){
			//范围检查
			var pos=this._checkRange( this.position.left + distance.x*this.axis.x,this.position.top + distance.y*this.axis.y);
            this.element.css({
                "left": pos.x,
                "top":pos.y
            });
        },
        mouseStop: function(e){

        },
		_checkRange:function(x,y){
			var min=this.options.min,
				max=this.options.max;
				
			if(min){
				x=x<min.x?min.x:x;
				y=y<min.y?min.y:y;
			}
			if(max){
				x=x>max.x?max.x:x;
				y=y>max.y?max.y:y;
			}
			return {x:x,y:y};
		}
    }),{
        defaults:{
            cancel:":input"
        }
    });

/**
 * 
 * //ie6 下子元素的高度设为100％时，父元素只改变高度时，子元素高度不变。但如果宽度改变，子元素高度也会变化。使用overflow:hidden;来修正。
 * 只改变x，y单方向改变大小通过设定8方向实现，不用在程序中设置asix。

 */
    $.YH.widget('My.resize', $.extend({}, $.YH.Mouse, {
        _init: function(){
			
			if(this.options.handle){
				this.handle =$(this.options.handle,this.element);
			}else{
            	this.handle = this.element.find(".n,.s,.w,.e,.nw,.ne,.sw,.se");
			}
			
            this._mouseInit();
			//Fix ie6 下子元素的高度设为100％时，父元素没有定义高度，则子元素的100％不会生效。
			if($.browser.msie&&$.browser.version<"7.0"){
				this.element.css("height",this.element.height());
			}
        },
        mouseStart: function(e){
			 //处理初始位置。
            this._position();
        	this.beginWidth=this.element.width();
			this.beginHeight=this.element.height();
            //计算相对值
            this.minWR=this.beginWidth-this.options.minWidth;
            this.maxWR=this.beginWidth-this.options.maxWidth;
            this.minHR=this.beginHeight-this.options.minHeight;
            this.maxHR=this.beginHeight-this.options.maxHeight;
        },
        mouseDrag: function(distance){
			var curr=this._mouseDownEvent.target.className;
			var p={x:0,y:0},l={x:0,y:0},css={};
            switch (curr) {
                case "n":
					p.y=1;
					l.y=-1;
                    break;
                case "s":
					l.y=1;
                    break;
                case "w":
					p.x=1;
					l.x=-1;
                    break;
                case "e":
					l.x=1;
                    break;
                case "nw":
					p={x:1,y:1};
					l={x:-1,y:-1};
                    break;
                case "ne":
					p.y=1;
					l={x:1,y:-1};
                    break;
                case "sw":
					p.x=1;
					l={x:-1,y:1};
                    break;
                case "se":
					l={x:1,y:1};
                    break;
            }
			//计算大小
			var w=this.beginWidth + l.x * distance.x;
			var h= this.beginHeight + l.y * distance.y;
			var x=y=0;
            //范围检查
            var range=this._checkRange(w,h);
            if (l.x != 0) {
				css['width'] = range.w;
			}
            if(p.x!=0) 
                css['left']= this.position.left+p.x*(range.x===true?distance.x:range.x);
			if (l.y != 0) {
				css['height'] = range.h;
			}
            if(p.y!=0) 
                css['top']=this.position.top+p.y*(range.y===true?distance.y:range.y);
            this.element.css(css);
			 //执行resizing
            if($.isFunction(this.options.resizing)){
                this.options.resizing(distance,this,range);
            }
        },
        mouseStop: function(e){
			
        },
		_checkRange:function(w,h){
            var minW=this.options.minWidth,
                minH=this.options.minHeight,
                maxW=this.options.maxWidth,
                maxH=this.options.maxHeight,
                x=y=true;
                
            if(w<minW){
                w=minW;
                x=this.minWR;
            }else if(maxW&&w>maxW){
                w=maxW;
                x=this.maxWR;
            }
            
            if(h<minH){
                h=minH;
                y=this.minHR;
            }else if(maxH&&h>maxH){
                h=maxH;
                y=this.maxHR;
            }
            return {w:w,h:h,x:x,y:y};
		}
    }),{
        defaults:{
            minHeight:100,
            minWidth:100,
            maxHeight:0,
            maxWidth:0
        }
    });

/**
 * 选择
 */
    $.YH.widget('My.select', $.extend({}, $.YH.Mouse, {
        _init: function(){
			this._createSelectBox();
			this.handle=this.element;
			if(this.options.cancel){
				this.cancel =$(this.options.cancel,this.element);
			}
            this._mouseInit();
        },
        mouseStart: function(e){
			//在每次开始时，重新取得子元素，因为子元素可能被动态添加。暂不对正在拖动时的子元素增加的处理。如果要处理，在selecting中也要取得，这样失去了只取一次的优化意义。
			this._children=this.element.children();
			this.position={left:e.pageX,top:e.pageY};
			this.selectBox.show().css({width:0,height:0,top:e.pageY,left:e.pageX});
			//TODO 合并选择
			this._children.removeClass("selecting");
			//子元素触发click事件,放在后面，有可能效果被上面语句去除。解决方法不完美，寻找更好的办法。
			//$(e.target).trigger("click");
			this._beginElement=$(this._closetOfUIChild(e.target)).addClass("selecting");
        },
        mouseDrag: function(distance){
			 var t=l=0;
			 if(distance.x<0){
			 	l=-1;
				distance.x=0-distance.x;
			 }
			 if(distance.y<0){
			 	t=-1;
				distance.y=0-distance.y;
			 }
			 var left=this.position.left +l * distance.x;
			 var top=this.position.top + t * distance.y;
			 this.selectBox.css({
                "width": distance.x,
                "height":distance.y,
				"left": left,
                "top": top
            });
			this.selecting(this.createBox(left,top,distance.x,distance.y));
        },
        mouseStop: function(e){
			this.selectBox.hide();
			//$(this._beginEvent.target).trigger("click");
        },
		_createSelectBox:function(){
			this.selectBox=$('<div id="selectBox"/>').css({border:"1px dotted #666",display:"none",position:"absolute",overflow:"hidden"}).appendTo(document.body);
		},
		selecting:function(selectBox){
			var self=this,ele,currbox;
			$.each(this._children,function(){
				ele=$(this);
				currbox=self.getBox(ele);
				//TODO 优化选种方式
				if(self.checkHit(selectBox,currbox)){
					//if(!ele.data("selected")){
						ele.addClass("selecting");
					//	ele.data("selected",true);
					//}
				}else{
					//if(ele.data("selected")==true){
						ele.removeClass("selecting");
					//	ele.data("selected",false);
					//}
				}
			});
		},
		checkHit:function(a,b){
			return (a.x0<b.x1&&b.x0<a.x1&&a.y0<b.y1&&b.y0<a.y1);
		},
		createBox:function(left,top,width,height){
			return {x0:left,y0:top,x1:left+width,y1:top+height};
		},
		getBox:function(ele){
			var pos=ele.offset();
			var w=ele.outerWidth();
			var h=ele.outerHeight();
			return {x0:pos.left,y0:pos.top,x1:pos.left+w,y1:pos.top+h};
		},
		getExtBox:function(ele){//偏离原位置
			var ext={left:20,top:20};
			var pos=ele.offset();
			var w=ele.outerWidth();
			var h=ele.outerHeight();
			return {x0:pos.left+ext.left,y0:pos.top+ext.top,x1:pos.left+w,y1:pos.top+h};
		},
		_closetOfUIChild:function(obj){
			var cur = obj,parent=this.element[0],last;
			while ( cur && cur.ownerDocument ) {
				last=cur;
				cur = cur.parentNode;
				if (cur==parent) {
					return last;
				}
			}
		},
		updateCancel:function(){
			if(this.options.cancel){
				this.cancel = this.handle.find(this.options.cancel);
			}
		},
		getSelects:function(){
			return this.element.children(".selecting");
		},
		setSelects:function(){
		
		},
		selectAll:function(){
			var ret=[];
			if(this.element.children(":not(.selecting)").length>0){
				ret=this.element.children().addClass("selecting");
			}else{
				this.element.children().removeClass("selecting");
			}
			return ret;
		}
    }),{
        defaults:{
            cancel:":input",
			className:{selecting:"selecting"}
        }
	});

})(jQuery);