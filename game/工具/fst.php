<?php

//$content=file_get_contents('./fst.txt');
$fp=fopen('./fst.txt','r');
$i=0;
$files=Array();
while(!feof($fp)){
    $s=trim(fgets($fp));
    if($s){
        $fileName=basename($s,".png");
        $as=explode('-',$fileName);
        $major=intval($as[0]);
        $minor=intval($as[1]);
        if(!$files[$major]) $files[$major]=Array();
        $files[$major][$minor]=$s;
    }
    //echo "b",$major>2,",",$major,".",$minor,"\n";
}
fclose($fp);
//$max=733248;
$src="./fsimgtmp/";
$dist="./fsimgs/";
$n=count($files);
$m=1;
$foldeSize=5000;
$k=0;
echo "$n\n";
$currentDir=$dist."$m/";
mkdir($currentDir);
for($i=1;$i<=$n;$i++){
    echo "do $i\n";
    foreach($files[$i] as $file){
        copy($src.$file,$currentDir.$file);
        $k++;
    }
    if($k>=5000){
        $k=0;
        $m++;
        $currentDir=$dist."$m/";
        mkdir($currentDir);
    }
}