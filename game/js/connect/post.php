<?php 
    $msg=$_REQUEST['msg'];
    $user=$_REQUEST['user'];
    if(!empty($msg)){
        $ticket=apc_fetch("ticket");
        apc_store("ticket",$ticket+1);

        if(apc_store("msg".$ticket,array("msg"=>$msg,"user"=>$user),200)){
            echo "true"   ;
        }else{
            echo "false";
        }
    }

?>