<?php
include '../modules/_db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Csak GET kérések engedélyezettek.']);
    exit();
}

// Paraméterek ellenőrzése
$userID = isset($_GET['userid']) ? $_GET['userid'] : 0;
$token = isset($_GET['token']) ? $_GET['token'] : '';

if ($userID == 0 || empty($token)) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó felhasználó ID vagy token.']);
    $conn->close();
    exit();
}

// Autentikáció ellenőrzése
$activeWindow = "-2 hours";
$aktualisDatumIdo = date("Y-m-d H:i:s");
$aktivIdoAblak = date("Y-m-d H:i:s", strtotime($aktualisDatumIdo . $activeWindow));

$sql_auth = "SELECT * FROM logins WHERE login_user_id = $userID AND login_token = '$token' AND action_date > '$aktivIdoAblak' AND login_state = 1 ORDER BY login_id DESC";
$result_auth = $conn->query($sql_auth);

if ($result_auth->num_rows == 0) {
    echo json_encode(['success' => false, 'message' => 'Érvénytelen token vagy nincs aktív munkamenet.']);
    $conn->close();
    exit();
}

// Felhasználó adatainak lekérdezése
$sql = "SELECT user_email, user_name, user_pw FROM users WHERE user_ID = $userID";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $response = [
        'success' => true,
        'userData' => [
            'email' => $user['user_email'],
            'username' => $user['user_name'],
            'password' => $user['user_pw'] // Ez hash-elt, de nem használjuk
        ]
    ];
} else {
    $response = ['success' => false, 'message' => 'Felhasználó nem található.'];
}

echo json_encode($response);
$conn->close();