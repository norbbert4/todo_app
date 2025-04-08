<?php
$sql = "SELECT * FROM todos WHERE user_id=$userID ORDER BY date, start_time, id ASC";
?>