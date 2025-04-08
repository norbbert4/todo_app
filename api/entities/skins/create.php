<?php
$userID = (int)$userID;
$skinID = (int)$data['skinID'];

$sql = "DELETE FROM selected_skins WHERE userID = $userID";
$result = $conn->query($sql);

$sql = "INSERT selected_skins SET
            userID = $userID,
            skinID = $skinID,
            select_date = NOW()";
?>