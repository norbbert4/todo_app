<?php
$title = isset($data['title']) ? $conn->real_escape_string((string)$data['title']) : null;
$completed = (int)$data['completed'];

$sql = "UPDATE todos SET completed = $completed" . ($title ? ", title = '$title'" : "") . " WHERE id = $id AND user_id = $userID";
?>