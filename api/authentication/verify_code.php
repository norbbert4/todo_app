<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../api/modules/_db.php'; // Adatbázis kapcsolat

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $code = htmlspecialchars($data->code);

    if (!isset($_SESSION['verification_code']) || !isset($_SESSION['pending_user'])) {
        $response = array(
            'success' => false,
            'error' => array(
                'message' => 'Nincs folyamatban lévő regisztráció'
            )
        );
    } elseif ($code === $_SESSION['verification_code']) {
        // Helyes kód, mentsük az adatbázisba
        $pendingUser = $_SESSION['pending_user'];
        $email = $pendingUser['email'];
        $username = $pendingUser['username'];
        $hashedPassword = $pendingUser['password'];

        $sql = "INSERT INTO users (user_email, user_name, user_pw, user_state, coins) 
                VALUES (?, ?, ?, 1, 0)"; // user_state = 1, mert már ellenőrzött
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sss', $email, $username, $hashedPassword);
        
        if ($stmt->execute()) {
            $response = array(
                'success' => true,
                'message' => 'Regisztráció sikeresen befejezve!'
            );
            // Töröljük a session adatait
            unset($_SESSION['verification_code']);
            unset($_SESSION['pending_user']);
        } else {
            $response = array(
                'success' => false,
                'error' => array(
                    'message' => 'Hiba történt a regisztráció mentésekor'
                )
            );
        }
        $stmt->close();
    } else {
        $response = array(
            'success' => false,
            'error' => array(
                'message' => 'Helytelen ellenőrző kód'
            )
        );
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
}

$conn->close();
?>