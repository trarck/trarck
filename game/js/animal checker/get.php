<?php 
    set_time_limit(0);
    $flag=false;
    $ticket=$_GET['ticket'];
    $user=$_REQUEST['user'];

    $ut=$user.'_ticket';
    $data=array("items"=>array());
    if(isset($ticket)){
        while(true){
             $curr= apc_fetch($ut);
             for(;$ticket<$curr;$ticket++){
                $ret=apc_fetch("{$user}_msg{$ticket}");
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
        $data['ticket']= apc_fetch($ut);
    }
    echo json_encode($data);
?>