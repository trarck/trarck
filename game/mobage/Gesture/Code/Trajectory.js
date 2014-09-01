var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;

exports.Trajectory=Core.MessageListener.subclass({

    classname:"Trajectory",

	// @param {dn.globalTouchEmitter} [emitter]
	// @param {Number} [length] the number of the vertices of the primitive.
	//--------------------------------------------------------------------------
	initialize: function( emitter, length ) {
        console.log(emitter);
		this.node = new GL2.Node();
		Core.UpdateEmitter.addListener( this, this.onUpdate );
		this.emitter = emitter;
		this.emitter.addListener( this, this.onTouch );
		
		this.maxLength  = length || 20;
		this.vertexList = [];
		this.moveCount  = 0;
		this.isMoving   = false;
		this.isTouching = false;
		
		var p = new GL2.Primitive();
		p.setType( GL2.Primitive.Type.TriangleStrip );
		for (var i=0;  i < this.maxLength * 2;  i++) {
			p.pushVertex( new GL2.Primitive.Vertex([0, 0], [0, 0], [1, 0, 0]) );
		}
		this.node.prim = p;
		this.node.addChild( this.node.prim );
		this.node.setDepth( 1 );
		this.tapCount = 0;
		
		this.x = 0;
		this.y = 0;
		this.prevTouchId = null;
		
		var conf = {
			bladeDecrement  : 0.05, 
			bladeRecoverTime: 1.0,  
			ninjaStarMax    : 3 
		};
		this.bladePower       = 1.0 ; // 1.0 が MAX. 刀を折り返すたびに威力が減って軌跡が細くなる
		this.bladePowerMin    = 0.1 ; // 最後は細い線で止まる
		this.bladeDecrement   = conf.bladeDecrement;   // 折り返すときに減る刀の威力
		this.bladeRecoverTime = conf.bladeRecoverTime; // bladePower が何秒で Min から 1 まで回復するか
		
		this.remainNinjastar = conf.ninjaStarMax; //一画面に打てる手裏剣の数
		this._isRemainingNinjastar = true;
		this.onNextUpdate = null;
	},
	
	//--------------------------------------------------------------------------
	destroy: function() {
		this.emitter.removeListener( this );
	},
	
	//--------------------------------------------------------------------------
	getLength: function() {
		return this.vertexList.length;
	},
	isRemainingNinjastar: function() {
		return this._isRemainingNinjastar;
	},
	isUsingBlade: function() {
		return (this.moveCount > 5);
	},
	isBladeTooShort: function() {
		return (this.getLength() < 3);
	},
	
	//--------------------------------------------------------------------------
	onUpdate: function( delta ) {
		
		var v = this.vertexList;
		var p = this.node.prim;
		if (v.length >= 2) {
			p.setVisible( true );
           
			var bladeWidth = 10 * this.bladePower;
			for (var i=0;  i < v.length - 1;  i++) {
				var g  = 1 - (i / v.length); //----- gradation
				var w  = (i < 4) ? (i * 0.22) : g;
				var bw = w * bladeWidth;
				
				var vx  = v[i  ].x;
				var vpx = v[i+1].x;
				var vy  = v[i  ].y;
				var vpy = v[i+1].y;
				
				//----- 進行方向と直角に軌跡の太さの方向を算出
				if (! v[i].dx) {
					var theta = Math.atan2( vy - vpy, vx - vpx ) * 180 / Math.PI;
                    var degree=(theta + 90)/ 180 * Math.PI;
					v[i].dx =Math.cos( degree );
					v[i].dy =Math.sin( degree );
				}
				
				p.setVertex( i*2+0, new GL2.Primitive.Vertex(
					[v[i].x - v[i].dx * bw, v[i].y - v[i].dy * bw], [0, 0], [1.0, g, 0]
				));
				p.setVertex( i*2+1, new GL2.Primitive.Vertex(
					[v[i].x + v[i].dx * bw, v[i].y + v[i].dy * bw], [0, 0], [1.0, g, 0]
				));
			}
			
			//----- 余った頂点は末尾にまとめる
			var lastVertex = new GL2.Primitive.Vertex(
				[v[ v.length - 1 ].x, v[ v.length - 1 ].y], [0, 0], [0, 0, 0]
			);
			for (var i = v.length - 1;  i < this.maxLength;  i++) {
				p.setVertex( i*2+0, lastVertex );
				p.setVertex( i*2+1, lastVertex );
			}
		}
		else {
			p.setVisible( false );
		}
		
		//----- 刀を振っていないときは刀の威力が回復
//		if (! this.isMoving) {
//			//this.bladePower += dn.Timekeeper.getDelta( 1.0, this.bladeRecoverTime );
//			//if (this.bladePower > 1.0) { this.bladePower = 1.0; }
//            var self=this;
//            setTimeout(function(){
//                self.bladePower = 1.0;
//            },1000);
//		}
		
		if (this.remainNinjastar > 0) { this._isRemainingNinjastar = true; }
		if (this.onNextUpdate) {
			this.onNextUpdate();
			this.onNextUpdate = null;
		}
		if (v.length > 0  &&  !this.isMoving) {
			v.pop();
		} else {
			this.isMoving = false;
		}
		if (this.isTouching) {
			this.isTouching = false;
		} else {
			this.tapCount = 0;
		}
	},
	
	//--------------------------------------------------------------------------
	onTouch: function( touch ) {
		//ToDo: これダサいので何とかしたい
		//var scale = 320 / Core.Capabilities.getScreenWidth();
		//var x = touch.getPosition().getX() * scale;
		//var y = touch.getPosition().getY() * scale;
        var x=touch.getPosition().getX();
        var y=touch.getPosition().getY();
		this.x = x;
		this.y = y;
		this.isMoving   = false;
		this.isTouching = true;
		
		var vList = this.vertexList;
		
		switch (touch.getAction()) {
		//----------------------------------------
		case touch.Action.Start:
			//this.vertexList = [ {x:x, y:y} ];
			//----- GALAXY S とか NEXUS S は５本指まで対応しているらしいが、３本指以上だと START と END の
			//----- 数が合わなくなる場合があるみたいなので仕方なく２本までをカウントしてる。
			//----- ２本以上押したときに刀を判定させなくするため。
			this.tapCount++;
			if (this.tapCount > 2) { this.tapCount = 2; }
			break;
			
		//----------------------------------------
		case touch.Action.End:
			this.tapCount--;
			if (this.tapCount < 0) { this.tapCount = 0; }
			if (this.prevTouchId === touch.getId()) { this.prevTouchId = null; }
			this.moveCount = 0;
			break;
			
		//----------------------------------------
		case touch.Action.Move:
			//----- 前回と違う ID なら指が２本以上触れている
			//----- ３本以上の START と END の整合性が保証されないのでこんなチェックをしてる
			if (this.prevTouchId  &&  this.prevTouchId !== touch.getId()) {
				if (this.tapCount < 2) { this.tapCount = 2; }
			}
			this.prevTouchId = touch.getId();
			
			if (this.tapCount > 1) {
				vList = [ {x:x, y:y} ];
			} else {
				vList.unshift( {x:x, y:y} );
				this.isMoving = true;
				++this.moveCount;
			}
			
//			//----- 振りかぶり時に play sound
//			if (vList.length === 3) {
//				//this.countBlade();
//			}
//			//----- 刀を返す時にも play sound
//			if (vList.length > 10) {
//				var diffX = (vList[0].x - vList[1].x) * (vList[1].x - vList[2].x);
//				var diffY = (vList[0].y - vList[1].y) * (vList[1].y - vList[2].y);
//				if (diffX < 0  ||  diffY < 0) {
//					//this.countBlade();
//					
//					// 折り返すと刀の威力が弱まる
//					this.bladePower -= this.bladeDecrement;
//					if (this.bladePower < this.bladePowerMin) {
//						this.bladePower = this.bladePowerMin;
//					}
//				}
//			}
			break;
		}
		
		if (vList.length > this.maxLength) {
			vList.pop();
		}
	},
	
	//--------------------------------------------------------------------------
	countNinjastar: function() {
		if (nj.battle.common.currentSceneName === 'main') {
			++nj.battle.Result.ninjastarCount;
		}
	},
	
	countBlade: function() {
	}
});