<?php
include '../modules/_db.php'; 

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Hibák kikapcsolása a kimenetben, logolás bekapcsolása
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', $_SERVER['HTTP_HOST'] === 'localhost' ? 'C:/xampp/htdocs/todo_app/error.log' : '/home/norbbert4/public_html/error.log');

if (!isset($conn)) {
    echo json_encode(['success' => false, 'error' => ['message' => 'Adatbázis kapcsolat nem található']]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['success' => false, 'error' => ['message' => 'Csak POST kérések engedélyezettek']]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
if (!$data || !isset($data->token) || !isset($data->newPassword)) {
    echo json_encode(['success' => false, 'error' => ['message' => 'Érvénytelen bemenet']]);
    exit;
}

$token = $conn->real_escape_string($data->token);
$newPassword = password_hash($data->newPassword, PASSWORD_DEFAULT);

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

    if (($now - $created_at) <= 3600) {
        $update_sql = "UPDATE users SET user_pw = '$newPassword' WHERE user_email = '$email'";
        if ($conn->query($update_sql)) {
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
$conn->close();
?>