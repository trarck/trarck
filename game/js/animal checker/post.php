<?php 
    $msg=$_REQUEST['msg'];
    $user=$_REQUEST['user'];
    if(!empty($msg)){
        $ut=$user.'_ticket';
        $ticket=apc_fetch($ut);
        apc_store($ut,$ticket+1);
        $um=$user.'_msg'.$ticket;
        if(apc_store($um,$msg,200)){
            echo "true"   ;
        }else{
            echo "false";
        }
    }

?>