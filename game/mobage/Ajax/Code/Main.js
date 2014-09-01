var Device = require('../NGCore/Client/Device').Device;
var Core = require('../NGCore/Client/Core').Core;
var GL2 = require('../NGCore/Client/GL2').GL2;
var UI = require('../NGCore/Client/UI').UI;

var Ajax = require('./Ajax').Ajax;

var gLabel = null;


var NgLogD_=function (v) {
    gLabel.setText(gLabel.getText()+"\n"+v);
}

function main()
{
	var glView = new UI.GLView();
	glView.onload = function()
	{
        var w = Core.Capabilities.getScreenWidth();
        var h = Core.Capabilities.getScreenHeight();
        
        var background = new GL2.Sprite();
        background.setImage('./Content/blank.png', [w, h], [0, 0]);
        GL2.Root.addChild(background);

        var label = new GL2.Text();
        label.setSize(w, h);
        label.setAnchor(0, 0);
        label.setText('requesting');
        label.setColor(0, 0, 0);
        GL2.Root.addChild(label);
        
        gLabel = label;

        Ajax.get('http://localhost/t.php',function(data){
            NgLogD_(data);
        });
        Ajax.get('http://localhost/json.php',function(data){
            NgLogD_(JSON.stringify(data));
        },'json');
        Ajax.post('http://localhost/r.php',{a:"s:post data","b":22},function(data){
            NgLogD_("post content:"+JSON.stringify(data));
        },'json');
        Ajax.post('http://dungeons.yitengku.net/api/getuserbuilding',{"uid":1},function(data){
            NgLogD_("get from dungeons :"+JSON.stringify(data));
        },"json");
	};
	glView.setAttribute('frame', [0, 0, NGWindow.outerWidth, NGWindow.outerHeight]);
	glView.setAttribute('active', true);

    // Add a back button.
	var back = new UI.Button();
	back.setNormalText('x');
	back.setTextSize(32);
	back.setTextGravity(UI.ViewGeometry.Gravity.Center);
	back.setFrame([10, 10, 64, 64]);
	back.setNormalGradient({
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		gradient: [ "FF9bd6f4 0.0", "FF0077BC 1.0" ]
	});
	back.setHighlightedGradient({
		corners: '8 8 8 8',
		outerLine: "00 1.5",
		gradient: [ "FF0077BC 0.0", "FF9bd6f4 1.0" ]
	});
	back.onclick = function() {
		var LGL = require('../NGCore/Client/Core/LocalGameList').LocalGameList;
		LGL.runUpdatedGame('/Samples/Launcher');
	};
	NGWindow.document.addChild(back);
}
