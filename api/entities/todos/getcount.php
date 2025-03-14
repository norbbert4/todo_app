<?php
$sql = "SELECT COUNT(id) as CNT FROM todos WHERE user_id=$userID and date='$entityID' and completed=0";
?>