<?php
$sql = "SELECT sk.*, usk.userID, usk.skinID, usk.unlock_date FROM skins sk LEFT JOIN unlocked_skins usk ON usk.skinID = sk.id AND usk.userID = $userID WHERE sk.listable=1";
?>
