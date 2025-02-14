<?php
$title = (string)$data['title'];
$completed = (int)$data['completed'];

$sql = "UPDATE todos SET title = '$title', completed = $completed WHERE id = $id";
?>