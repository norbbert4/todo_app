<?php
$sql = "SELECT sk.css_file FROM skins sk LEFT JOIN selected_skins sks ON(sk.id=sks.skinID) WHERE sks.userID=$userID";
?>