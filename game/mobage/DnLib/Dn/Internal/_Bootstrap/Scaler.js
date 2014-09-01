//Lazy / poor man's spring system!
exports.Scale = (function() {
	var Scale = {
		screenWidth:-1,
		screenHeight:-1,
		textFactors:null,
		verifyInit:function() {
			if(Scale.screenWidth < 0) {
				Scale.screenWidth = Core.Capabilities.getScreenWidth();
			}
			if(Scale.screenHeight < 0) {
				Scale.screenHeight = Core.Capabilities.getScreenHeight();
			}
			if(!Scale.textFactors) {
				if (Core.Capabilities.getPlatformOS().toLowerCase() == 'android') {
					Scale.textFactors = {
						ios:4/3,
						droid:1
					};
				}
				else
				{
					Scale.textFactors = {
						ios:1,
						droid:3/4
					};
				}
			}
		},
		ios:{
			width:function(iPx) {
				Scale.verifyInit();
				return iPx / 320.0 * Scale.screenWidth;
			},
			height:function(iPx) {
				Scale.verifyInit();
				return iPx / 480.0 * Scale.screenHeight;
			},
			textSize:function(iTpx) {
				Scale.verifyInit();
				return iTpx * Scale.textFactors.ios;
			}
		},
		droid:{
			width:function(iPx) {
				Scale.verifyInit();
				return iPx / 480.0 * Scale.screenWidth;
			},
			height:function(iPx) {
				Scale.verifyInit();
				return iPx / 800.0 * Scale.screenHeight;
			},
			textSize:function(iTpx) {
				Scale.verifyInit();
				return iTpx * Scale.textFactors.droid;
			}
		}
	};
	return Scale;
})();

