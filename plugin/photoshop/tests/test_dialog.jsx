var strTitle = localize( "$$$/JavaScript/ImageProcessor/Title=Image Processor" );
var dlgMain = new Window( 'dialog', strTitle,undefined,{closeButton:false} );

var d=dlgMain;

var pannel=d.add('panel',undefined,"");

pannel.btnA=pannel.add('button',undefined,"select");
pannel.closeBtn=pannel.add('button',undefined,"close");

pannel.btnA.onClick=function () {
	// var file = File.openDialog("choose dialog");
	alert("ok");
}

pannel.closeBtn.onClick=function () {
	d.close();
}

d.show();

