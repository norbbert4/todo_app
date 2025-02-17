<?php

function auth($conn, $userID, $token) {
    $message = false;
    $sql = "SELECT * FROM logins WHERE login_user_id = $userID and login_token = '$token' ORDER BY login_id DESC";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
    
        $row = $result->fetch_assoc();
        $sql2 = "UPDATE logins SET action_date=NOW() WHERE login_id=".$row['login_id'];
        $result2 = $conn->query($sql2);
        $message = true;   
    } else {
        $message = false;
    }
    return $message;
}

?>