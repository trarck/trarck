<?php 
    $flag=false;
    $ticket=$_GET['ticket'];
    $data=array("items"=>array());
    if(isset($ticket)){
        while(true){
             $curr= apc_fetch("ticket");
             for(;$ticket<$curr;$ticket++){
                $ret=apc_fetch("msg{$ticket}");
                if($ret!==false){
                     $data['items'][]=$ret;
                     $flag=true;
                }
             }
             if($flag){
                 break;
             }else{
                 usleep(100);
             }
        }
        $data['ticket']= $curr;
    } else{
        $data['ticket']= apc_fetch("ticket");
    }
    echo json_encode($data);
?>