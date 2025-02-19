<?php
$title = (string)$data['title'];

$sql = "INSERT todos SET user_id=$userID, title = '$title'";
?>