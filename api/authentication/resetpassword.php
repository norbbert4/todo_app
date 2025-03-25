<?php
include '../../modules/_db.php'; // Adatbázis kapcsolat fájl elérési útja

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $token = $conn->real_escape_string($data->token);
    $newPassword = password_hash($data->newPassword, PASSWORD_DEFAULT);

    // Token ellenőrzése az adatbázisban
    $sql = "SELECT * FROM password_resets WHERE token = '$token'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $reset = $result->fetch_assoc();
        $email = $reset['email'];
        $created_at = strtotime($reset['created_at']);
        $now = time();

        // Token lejárati idejének ellenőrzése (pl. 1 óra)
        if (($now - $created_at) <= 3600) {
            // Jelszó frissítése a users táblában
            $update_sql = "UPDATE users SET user_pw = '$newPassword' WHERE user_email = '$email'";
            if ($conn->query($update_sql)) {
                // Token törlése a password_resets táblából
                $delete_sql = "DELETE FROM password_resets WHERE token = '$token'";
                $conn->query($delete_sql);
                $response = ['success' => true];
            } else {
                $response = ['success' => false, 'error' => ['message' => 'Hiba a jelszó frissítésekor']];
            }
        } else {
            $response = ['success' => false, 'error' => ['message' => 'A token lejárt']];
        }
    } else {
        $response = ['success' => false, 'error' => ['message' => 'Érvénytelen token']];
    }

    echo json_encode($response);
}

$conn->close();
?>