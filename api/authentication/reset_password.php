<?php
// Abszolút útvonal az _db.php fájlhoz
//$include_path = 'C:/xampp/htdocs/todo_app/api/modules/_db.php';
$include_path = '../../modules/_db.php';
if (!file_exists($include_path)) {
    die(json_encode(['success' => false, 'error' => ['message' => 'Az _db.php fájl nem található: ' . $include_path]]));
}

include $include_path;

// CORS engedélyezése
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Ellenőrizzük, hogy a $conn létezik-e
if (!isset($conn)) {
    echo json_encode(['success' => false, 'error' => ['message' => 'Adatbázis kapcsolat nem található']]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (!$data || !isset($data->token) || !isset($data->newPassword)) {
        echo json_encode(['success' => false, 'error' => ['message' => 'Érvénytelen bemenet']]);
        exit;
    }

    $token = $conn->real_escape_string($data->token);
    $newPassword = password_hash($data->newPassword, PASSWORD_DEFAULT);

    // Token ellenőrzése
    $sql = "SELECT * FROM password_resets WHERE token = '$token'";
    $result = $conn->query($sql);

    if ($result === false) {
        echo json_encode(['success' => false, 'error' => ['message' => 'Adatbázis hiba: ' . $conn->error]]);
        exit;
    }

    if ($result->num_rows > 0) {
        $reset = $result->fetch_assoc();
        $email = $reset['email'];
        $created_at = strtotime($reset['created_at']);
        $now = time();

        // Ellenőrizzük, hogy a token nem lejárt-e (pl. 1 óra)
        if (($now - $created_at) <= 3600) {
            // Jelszó frissítése
            $update_sql = "UPDATE users SET user_pw = '$newPassword' WHERE user_email = '$email'";
            if ($conn->query($update_sql)) {
                // Token törlése
                $delete_sql = "DELETE FROM password_resets WHERE token = '$token'";
                $conn->query($delete_sql);
                $response = ['success' => true];
            } else {
                $response = ['success' => false, 'error' => ['message' => 'Hiba a jelszó frissítésekor: ' . $conn->error]];
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