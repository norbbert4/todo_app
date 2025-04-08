<?php
function auth($conn, $userID, $token) {
    $activeWindow = " -2 hours";
    $aktualisDatumIdo = date("Y-m-d H:i:s");
    $aktivIdoAblak = date("Y-m-d H:i:s", strtotime($aktualisDatumIdo . $activeWindow));

    $token = $conn->real_escape_string($token);
    $userID = (int)$userID;

    $sql = "SELECT * FROM logins WHERE login_user_id = $userID AND login_token = '$token' AND action_date > '$aktivIdoAblak' AND login_state = 1 ORDER BY login_id DESC";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        // Frissítjük az action_date-et, hogy az ablak ne járjon le
        $update_sql = "UPDATE logins SET action_date = NOW() WHERE login_user_id = $userID AND login_token = '$token'";
        $conn->query($update_sql);
        return true;
    }
    return false;
}
?>