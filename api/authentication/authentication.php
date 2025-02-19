<?php
include '../modules/_db.php';

// JSON adatok fogadása
$data = json_decode(file_get_contents("php://input"));

$userID = $data->user_ID;
$token = $data->token;

$sql = "SELECT * FROM logins WHERE login_user_id = $userID and login_token = '$token'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $response = array('success' => true);
} else {
    $response = array('success' => false);
}
header('Content-Type: application/json; charset=utf-8');
echo json_encode($response);

$conn->close();
?>