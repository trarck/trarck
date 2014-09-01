//layer 默认大小测试
   var overlayBtn=new UI.Button({
		frame: [480,100,64,64],
		text: 'overlay',
		textSize: 24,
		textGravity: UI.ViewGeometry.Gravity.Center,
		gradient: {
			corners: '8 8 8 8',
			outerLine: "00 1.5",
			gradient: [ "FF9bd6f4 0.0", "FF0077BC 1.0" ]
		},
		highlightedGradient: {
			corners: '8 8 8 8',
			outerLine: "00 1.5",
			gradient: [ "FF0077BC 0.0", "FF9bd6f4 1.0" ]
		},
		disabledGradient: {
			corners: '0 8 8 8',
			gradient: [ "FF55 0.0", "FF00 1.0"],
		},
		onClick: function  () {
            console.log("do click");
            UI.Window.getLayer(UI.Window.Layer.Overlay).removeChild(overlayBtn);
            UI.Window.getLayer(UI.Window.Layer.Overlay).addChild(new UI.Button({
                frame:[480,200,64,64],
                text:"new",
                onClick:function  () {
                     UI.Window.getLayer(UI.Window.Layer.Overlay).addChild(new UI.Button({
                        frame:[580,200,64,64],
                        text:"new",
                        onClick:function  () {
                            var chds=UI.Window.getLayer(UI.Window.Layer.Overlay).getChildren();
                            for(var i in chds){
                                UI.Window.getLayer(UI.Window.Layer.Overlay).removeChild(chds[i]);
                            }
                        }
                    }));
                }
            }));
//            if(overlay.getVisible()){
//                overlay.hide();
//            }else {
//                overlay.show();
//            }
        }
	});
    UI.Window.getLayer(UI.Window.Layer.Overlay).addChild(overlayBtn);