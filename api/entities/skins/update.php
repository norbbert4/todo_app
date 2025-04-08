<?php
$sql = "";

$price = isset($data['price']) ? (int)$data['price'] : null;
if ($price!=null) {
    $sql_c = "SELECT coins FROM users WHERE user_ID=$userID";
    $result_c = $conn->query($sql_c);       
    if ($result_c->num_rows > 0) {
        $row_c = $result_c->fetch_assoc();
        if ((int)$row_c['coins'] >= $price) {
            $newCoins = (int)$row_c['coins'] - $price;
            $sql_u = "UPDATE users SET coins = $newCoins WHERE user_ID = $userID";
            $result_u = $conn->query($sql_u);
            $sql = "INSERT unlocked_skins SET userID=$userID, skinID=$id, unlock_date=NOW()";
        }
    }
}

?>