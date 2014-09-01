<?php
define('USE_FILTER',0);
define('BEGIN','(function($){');
define('END','})(jQuery);');
define('BEGIN_REGEXP','/\s*\(\s*function\s*\(\$\)\s*\{/');
define('END_REGEXP','/\}\)\s*\(jQuery\)\s*;*/');

$appName='ytksrt';
$appPrefix='yh';
$version=getVersion();
$desDir="dist/$version/";
$src="..";
//目标目录不存在则建立
mkdirs($desDir);
//core

//$core=buildCore();
//$util=buildUtil();
//$data=buildData();
//$widget=buildWidget();
$builds=array(
    "root"=>array(
        "dir"=>"$src/",
        "files"=>array(
            "ns.js"
        )
    ),
    "core"=>array(
        "files"=>array("Base.js","Accessor.js","Loader.js")
    ),
    "math"=>array(
        "files"=>array("Geometry.js","QuatTree.js","TransformMatrix.js","TransformQuatTree.js")
    ),
    "times"=>array(
        "files"=>array("Scheduler.js","Timer.js","AnimationManager.js")
    ),
    "animation"=>array(
        "files"=>array("Animation.js","AnimationVariable.js","Frame.js","ActionAnimation.js","AnimationGroup.js")
    ),
//    "event"=>array(
//        "files"=>array(
//            "EventObject.js","MouseEventObject.js","EventListenerManager.js",
//            "EventListenerManagerAdaptable.js",//"IEventTarget.js",
//            //"UIEventObject.js","UIEventListenerManager.js","UIEventObjectManager.js",
//            "WebEventListenerManager.js"
//           // "TouchActions.js","TouchHandler.js"
//        )
//    ),
    "input"=>array(
        "files"=>array("Mouse.js","VisualEventProcessor.js")
    ),
    "renderer"=>array(
        "files"=>array("Node.js")
    ),
    "renderer.canvas"=>array(
        "dir"=>"$src/renderer/canvas/",
        "files"=>array(
            "Sprite.js","AnimateSprite.js","AvatarSprite.js",
           // "Image.js","LinearGradient.js","RadialGradient.js",
            "shape/Shape.js","shape/Rect.js","shape/RoundRect.js",
            "shape/Arc.js","shape/Circle.js",
            "shape/Path.js",
            "shape/SolidShape.js","shape/SolidArc.js","shape/SolidCircle.js",
            "shape/SolidRect.js","shape/SolidRoundRect.js"
        )
    ),
    // "renderer.canvas.swf"=>array(
    //     "dir"=>"$src/renderer/canvas/swf/",
    //     "files"=>array(
    //         "Shape.js",
    //         //"MorphShape.js",
    //         "MovieClip.js"
    //     )
    // ),

    "scene"=>array(
        "files"=>array(
            "Director.js","Scene.js","SceneUpdater.js","SingleSceneUpdater.js","VisualEventProcessor.js"
        )
    ),
    "engine"=>array(
        "dir"=>"$src/",
        "files"=>array(
            "Engine.js"
        )
    )
);
foreach($builds as $modle=>$item){
    $dir=$item["dir"]?$item["dir"]:"$src/$modle/";
	$allCnt.=build($modle,$item["files"],$dir);
}
//$allCnt=$core.$util.$data.$widget;
//$allCnt=filter($allCnt);
//创建所有
$srcAll=$desDir.'yhge.js';
$minAll=$desDir.'yhge.min.js';

file_put_contents($srcAll,$allCnt);
jsmin($srcAll,$minAll);
//buildCss();
//给文件加版本号
$versionHead=<<<EOM
/* 
 * yhge v$version
 */

EOM;
addVersionHeadToDir($desDir);

function buildCss(){
	global 	 $desDir,$versionHead;
	$dir="../css/";
	$files =  array("common.css","icon.css",
                    "container.css","panel.css",
                    "paging.css",
                    "toolbar.css","tip.css",
                    "form.css","button.css","validation.css",
                    "window.css","menu.css","tree.css","grid.css","tabs.css","calendar.css","accordion.css"
                    //,"layout.css"
    ); 
	foreach($files as $f){
        if(strpos($f,".css")!==false){
		    $content.=file_get_contents($dir.$f);
        }
    }
	file_put_contents($desDir.'yh.css',$versionHead.$content);
}

function build($model,$files,$dir) {
    global $desDir,$appPrefix;
    $min=$appPrefix?"{$desDir}$appPrefix.$model.min.js":"{$desDir}$model.min.js";
    $src=$appPrefix?"{$desDir}$appPrefix.$model.js":"{$desDir}$model.js";
    //先merge后min
    $content=merge($files,$dir);
    file_put_contents($src,$content);
    jsmin($src,$min);
    return $content;
}

function merge($files,$dir) {
    foreach($files as $f){
        if($f{0}!="."){
            $content.=file_get_contents($dir.$f);
        }
    }
    return filter($content);
}

function jsmin($src,$dec){
    echo exec("java -jar compiler.jar --js $src --js_output_file $dec "); //--compilation_level ADVANCED_OPTIMIZATIONS
    //addVersionHeadToFile($src);
    //addVersionHeadToFile($dec);
}

function addVersionHeadToFile($file) {
    global $versionHead;
    $content=file_get_contents($file);
    file_put_contents($file,$versionHead.$content);
}
function addVersionHeadToDir($dir) {
    global $versionHead;
    $files=scandir($dir);
    foreach($files as $filename){
        if($filename{0}!="."){
            $file=$dir.$filename;
            $content=file_get_contents($file);
            file_put_contents($file,$versionHead.$content);
        }
    }
}
function getVersion() {
    return file_get_contents('../version.txt');
}

function mkdirs($dir){
   // $dir=strpos(basename($file),'.')===FALSE?$file:dirname($file);
    $path=array();
    while(!is_dir($dir)){
        $path[]=$dir;
        $dir=dirname($dir);
    }
    while($p=array_pop($path)){
        mkdir($p);
    }
}

function filter($cnt) {
	return USE_FILTER?BEGIN."\r\n".preg_replace(array(BEGIN_REGEXP,END_REGEXP),array('',''),$cnt).END:$cnt;
}
?>
