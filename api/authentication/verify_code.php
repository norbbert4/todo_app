<?php
session_start();
include '../modules/_db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $code = $data->code;

    if (!isset($_SESSION['pending_user']) || !isset($_SESSION['verification_code'])) {
        $response = array('success' => false, 'error' => array('message' => 'Nincs folyamatban lévő regisztráció'));
    } elseif ($code === $_SESSION['verification_code']) {
        $pending_user = $_SESSION['pending_user'];
        $email = $pending_user['email'];
        $username = $pending_user['username'];
        $hashedPassword = $pending_user['password'];
        $two_factor_enabled = $pending_user['two_factor_enabled'];

        $sql = "INSERT INTO users (user_email, user_name, user_pw, user_state, two_factor_enabled, coins) VALUES (?, ?, ?, 1, ?, 0)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssi', $email, $username, $hashedPassword, $two_factor_enabled);
        $stmt->execute();

        $stmt->close();

        unset($_SESSION['pending_user']);
        unset($_SESSION['verification_code']);

        $response = array('success' => true, 'message' => 'Regisztráció sikeres! Most már bejelentkezhetsz.');
    } else {
        $response = array('success' => false, 'error' => array('message' => 'Érvénytelen ellenőrző kód'));
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
}

$conn->close();
?>