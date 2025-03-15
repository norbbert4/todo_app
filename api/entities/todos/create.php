<?php
$title = $conn->real_escape_string((string)$data['title']);
$date = $conn->real_escape_string((string)$data['date']);
$userID = (int)$userID;

$sql = "INSERT INTO todos SET user_id=$userID, title='$title', date='$date', completed=0";
?>