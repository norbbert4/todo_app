<?php
$title = $conn->real_escape_string((string)$data['title']);
$date = $conn->real_escape_string((string)$data['date']);
$start_time = isset($data['start_time']) ? "'" . $conn->real_escape_string((string)$data['start_time']) . "'" : 'NULL';
$userID = (int)$userID;

$sql = "INSERT INTO todos SET user_id=$userID, title='$title', date='$date', start_time=$start_time, completed=0";
?>