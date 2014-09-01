/*
 * Rectangle.js
 *
 */
 
var Core = require('../../NGCore/Client/Core').Core;
var GL2 = require('../../NGCore/Client/GL2').GL2;

exports.Rectangle = GL2.Node.subclass(
{
	classname: 'Rectangle',
	
	initialize: function(frame, color)
	{
		
		frame = new Core.Rect(frame);
		
		//Set up the dimensions for drawing and picking.
		//  By setting the position of this parent Node, we can translate
		//  all child nodes in a uniform manner. This allows us to specify
		//  child node positions relative to others easily.
		this.setPosition(frame.getOrigin());
		
		//We'll keep the size around for constructing the Primitive and TouchTarget
		//  nodes. The base Node class does not inherently have any size since
		//  an empty Node cannot be picked or drawn.
		this._size = frame.getSize();
		
		//Properties for constructing our child Nodes.
		this._color = new Core.Color(color);
		 
		this._updateBox();

        //this.setColor(this._color);
	},
	
	destroy: function()
	{
        this._primitive.destroy();
		this._primitive = null;
	},
	
	setColor: function(color)
	{
		this._color = new Core.Color(color);
		this._updateBox();
	},
    setSize:function  (size) {
        this._size=new Core.Size(size);
        this._updateBox();
    },
	//This method constructs an OpenGL Primitive Node.
	_updateBox: function()
	{
		//If we have an existing primitive, just replace it.
		//  This will incur a setup and teardown, but we don't plan on doing 
		//  this very often.
		if (this._primitive != null)
		{
			this.removeChild(this._primitive);
			this._primitive.destroy();
		}
		
		//Create a new Primitive object.
		var p = new GL2.Primitive();
		//p.setColor(this._color);
		var w = this._size.getWidth();
		var h = this._size.getHeight();
		
		//Here we're putting 4 vertexes together to draw 2 triangles in a
		// triangle fan.
		p.setType(GL2.Primitive.Type.TriangleFan);
		
		v = new Array();
//		v.push(new GL2.Primitive.Vertex([0,0],[0,0]));
//		v.push(new GL2.Primitive.Vertex([w,0],[0,0]));
//		v.push(new GL2.Primitive.Vertex([w,h],[0,0]));
//		v.push(new GL2.Primitive.Vertex([0,h],[0,0]));
		
        v.push(new GL2.Primitive.Vertex([0,0],[0,0],this._color));
		v.push(new GL2.Primitive.Vertex([w,0],[0,0],this._color));
		v.push(new GL2.Primitive.Vertex([w,h],[0,0],this._color));
		v.push(new GL2.Primitive.Vertex([0,h],[0,0],this._color));

		//Insert the 4 vertexes at position 0 in the Primitive's vertex list.
		p.spliceVertexes.apply(p, ([0,0]).concat(v));
		
		//Keep a reference to the primtive so we can replace it later.
		this._primitive = p;
		
		//Add the Node as a child. Since we moved the position of the parent,
		//  we can specify all the child vertexes with respect to 0,0 and not
		//  have to worry about lining up with the other child Nodes.
		this.addChild(this._primitive);
	}
});
