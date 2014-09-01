var Core = require('../../NGCore/Client/Core').Core;
var FxBase=require('./Fx').Fx;

var UIFx=exports.UIFx=FxBase.subclass({
    
    classname:"UIFx"
});

UIFx.Step = {
    opacity: function(fx){
        fx.node.setAlpha(fx.now);
    },
    alpha: function(fx){
        fx.node.setAlpha(fx.now);
    },
    frame: function(fx){
        fx.node.setFrame(fx.now);
    },
    x: function(fx){
        //console.log("x",fx.now);
        var frame = fx.node.getFrame();
        frame[0]=fx.now;
        fx.node.setFrame(frame);
    },
    y: function(fx){
        //console.log("y",fx.now);
        var frame = fx.node.getFrame();
        frame[1]=fx.now;
        fx.node.setFrame(frame);
    },
    width:function  (fx) {
        var frame = fx.node.getFrame();
        frame[2]=fx.now;
        fx.node.setFrame(frame);
    },
    height:function  (fx) {
        var frame = fx.node.getFrame();
        frame[3]=fx.now;
        fx.node.setFrame(frame);
    },
    rotation: function(fx){
        fx.node.setRotation(fx.now);
    },
    color: function(fx){
        fx.node.setColor(fx.now);
    },
    _default: function(fx){
        fx.node[fx.prop] = fx.now;
    }
};
UIFx.Get = {
    opacity: function(fx){
        return fx.node.getAlpha();
    },
    alpha: function(fx){
        return fx.node.getAlpha();
    },
    frame: function(fx){
        return fx.node.getFrame();
    },
    x: function(fx){
        var frame=fx.node.getFrame();
        return frame[0];
    },
    y: function(fx){
        var frame=fx.node.getFrame();
        return frame[1];
    },
    width: function(fx){
        var frame=fx.node.getFrame();
        return frame[2];
    },
    height: function(fx){
        var frame=fx.node.getFrame();
        return frame[3];
    },
    color: function(fx){
        return fx.node.getColor();
    },
    _default: function(fx){
        
    }
};
UIFx.Calc = {
    frame: function(start,end,pos){
        var ret=[];
        for (var i=0,l=start.length;i<l;i++){
            ret[i]=start[i]+(end[i]-start[i])*pos
        }
        return ret;
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
};