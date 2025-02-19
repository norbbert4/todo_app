<?php
include '../modules/_db.php';


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // JSON adatok fogadása
    $data = json_decode(file_get_contents("php://input"));

    $email = $data->email;
    $username = $data->username;
    $password = $data->password;

    // Jelszó hash-elése a password_hash függvénnyel
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "SELECT * FROM users WHERE user_name = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $response = array(
            'success' => false,
            'error' => array(
                'message' => 'Foglalt username',
            )
        );
    } else {
        $sql2 = "INSERT INTO users (user_email, user_name, user_pw, user_state) VALUES ('$email', '$username', '$hashedPassword', 1)";
        $conn->query($sql2);
        
        $response = array(
                    'success' => true,
                    'message' => 'sikeres regisztráció'
                );
        
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
}


$conn->close();
?>