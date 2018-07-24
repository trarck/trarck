var g_LibsScriptFolderPath="/d/projects/trarck/plugin/photoshop/libs/";

$.evalFile(g_LibsScriptFolderPath + "ps/Common.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/Log.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/defines/Terminology.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/defines/Struct.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/actions/ActionUtils.jsx");
$.evalFile(g_LibsScriptFolderPath + "ps/layers/LayerStyle.jsx");

var doc=app.activeDocument;
var layer=doc.activeLayer;
var ls=new LayerStyle(layer);
ls.initialize();
var i=0;