<?php
$title = (string)$data['title'];
$date = (string)$data['date'];

$sql = "INSERT todos SET user_id=$userID, title='$title', date='$date'";
?>