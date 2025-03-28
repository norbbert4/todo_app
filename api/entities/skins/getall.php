<?php
$sql = "SELECT * FROM skins sk LEFT JOIN unlocked_skins usk ON usk.skinID = sk.id AND usk.userID = $userID WHERE sk.listable=1";
?>