<?php
$user_fullname = (string)$data['user_fullname'];
$user_name = (string)$data['user_name'];
$user_state = (int)$data['user_state'];

$sql = "UPDATE users SET
            user_fullname = '$user_fullname',
            user_name = '$user_name', 
            user_state = $user_state 
        WHERE user_ID = $id";
?>