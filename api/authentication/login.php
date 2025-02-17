<?php
include '../modules/_db.php';
$activeWindow = " -2 hours";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if ($_GET['token'] && $_GET['user_id']) {
        $token = $_GET['token'];
        $userID = $_GET['user_id'];
        $aktualisDatumIdo = date("Y-m-d H:i:s");
        $aktivIdoAblak = date("Y-m-d H:i:s", strtotime($aktualisDatumIdo . $activeWindow));

        $sql_auth = "SELECT * FROM logins WHERE login_user_id = $userID and login_token = '$token' and action_date>'$aktivIdoAblak' and login_state=1 ORDER BY login_id DESC";
        $result_auth = $conn->query($sql_auth);
        if ($result_auth->num_rows > 0) {
            $response = array(
                'success' => true,
                'message' => 'Van aktív ablakod.'
            );

        } else {
            $response = array(
                'success' => false,
                'message' => 'Nincs aktív ablakod. Lépj be!'
            );
        }
    } else {
        $response = array(
            'success' => false,
            'message' => 'Nincs tokened. Lépj be!'
        );
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
}


else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // JSON adatok fogadása
    $data = json_decode(file_get_contents("php://input"));

    $username = $data->username;
    $password = $data->password;

    // Jelszó hash-elése a password_hash függvénnyel
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "SELECT * FROM users WHERE user_name = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Jelszó ellenőrzése a password_verify függvénnyel
        if (password_verify($password, $user['user_pw'])) {
            $token = bin2hex(random_bytes(16));
            $user_id = $user['user_ID'];
            $aktualisDatumIdo = date("Y-m-d H:i:s");
            // 1 óra kivonása az aktuális dátum/időből
            $aktivIdoAblak = date("Y-m-d H:i:s", strtotime($aktualisDatumIdo . $activeWindow));

            
            $sql_auth = "SELECT * FROM logins WHERE login_user_id = $user_id and action_date>'$aktivIdoAblak' and login_state=1 ORDER BY login_id DESC";
            $result_auth = $conn->query($sql_auth);
            if ($result_auth->num_rows > 0) {
                $response = array(
                    'success' => false,
                    'error' => array(
                        'message' => 'Sajnos valaki már bent van ezzel a névvel!',
                        'sql' => $sql_auth
                    )
                );
            } else {
                $insertTokenSql = "INSERT INTO logins (login_user_id, login_date, action_date, login_token, login_state) VALUES ('$user_id', NOW(), NOW(), '$token', 1)";
                $conn->query($insertTokenSql);
        
                $response = array(
                    'success' => true,
                    'userData' => array(
                        'user_ID' => $user['user_ID'],
                        'user_name' => $user['user_name'],
                        'token' => $token
                    )
                );
            }
        } else {
            $response = array(
                'success' => false,
                'error' => array(
                    'message' => 'Hibás jelszó',
                )
            );
        }
    } else {
        $response = array(
            'success' => false,
            'error' => array(
                'message' => 'Hibás felhasználónév, vagy jelszó',
            )
        );
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
}


$conn->close();
?>