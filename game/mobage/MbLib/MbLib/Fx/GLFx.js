var Core = require('../../NGCore/Client/Core').Core;
var FxBase=require('./Fx').Fx;

var GLFx=exports.GLFx=FxBase.subclass({
    classname: 'GLFx',
});

GLFx.Step = {
    opacity: function(fx){
        fx.node.setAlpha(fx.now);
    },
    alpha: function(fx){
        fx.node.setAlpha(fx.now);
    },
    positionX: function(fx){
        var p = fx.node.getPosition();
        p.setX(fx.now);
        fx.node.setPosition(p);
    },
    positionY: function(fx){
        var p = fx.node.getPosition();
        p.setY(fx.now);
        fx.node.setPosition(p);
    },
    position: function(fx){
        fx.node.setPosition(fx.now);
    },
    scaleX: function(fx){
        var s = fx.node.getScale();
        s.setX(fx.now);
        fx.node.setScale(s);
    },
    scaleY: function(fx){
        var s = fx.node.getScale();
        s.setY(fx.now);
        fx.node.setScale(s);
    },
    scale: function(fx){
        fx.node.setScale(fx.now);
    },
    rotation: function(fx){
        fx.node.setRotation(fx.now);
    },
    color: function(fx){
        fx.node.setColor(fx.now);
    },
    _default: function(fx){
        if (fx.node.style && fx.node.style[fx.prop] != null) {
            fx.node.style[fx.prop] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
        } else {
            fx.node[fx.prop] = fx.now;
        }
    }
};
GLFx.Get = {
    opacity: function(fx){
        return fx.node.getAlpha();
    },
    alpha: function(fx){
        return fx.node.getAlpha();
    },
    position: function(fx){
        return fx.node.getPosition();
    },
    positionX: function(fx){
        return fx.node.getPosition().getX();
    },
    positionY: function(fx){
        return fx.node.getPosition().getY();
    },
    scale: function(fx){
    	return fx.node.getScale();
    },
	scaleX: function(fx){
    	return fx.node.getScale().getX();
    },
	scaleY: function(fx){
    	return fx.node.getScale().getY();
    },
    rotation: function(fx){
        return fx.node.getRotation();
    },
    color: function(fx){
        return fx.node.getColor();
    },
    _default: function(fx){
        
    }
};
GLFx.Calc = {
    position: function(start,end,pos){
        var x=start.getX()+(end.getX()-start.getX())*pos,
            y=start.getY()+(end.getY()-start.getY())*pos;
        return new Core.Vector(x,y);
    },
	scale: function(start,end,pos){
    	var x=start.getX()+(end.getX()-start.getX())*pos,
            y=start.getY()+(end.getY()-start.getY())*pos;
        return new Core.Vector(x,y);
    },
    color: function(start,end,pos){
        var r=start.getRed()+(end.getRed()-start.getRed())*pos,
            g=start.getGreen()+(end.getGreen()-start.getGreen())*pos,
            b=start.getBlue()+(end.getBlue()-start.getBlue())*pos;
        return new Core.Color(r,g,b);
    },
    _default:function(start,end,pos){
		return start + ((end - start) * pos);
	}
}
