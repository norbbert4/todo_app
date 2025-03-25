<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'C:/xampp/htdocs/todo_app/vendor/autoload.php';
include '../modules/_db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (!$data || !isset($data->email)) {
        echo json_encode(['success' => false, 'error' => ['message' => 'Érvénytelen bemenet']]);
        exit;
    }

    $email = $conn->real_escape_string($data->email);

    $sql = "SELECT * FROM users WHERE user_email = '$email'";
    $result = $conn->query($sql);

    if ($result === false) {
        echo json_encode(['success' => false, 'error' => ['message' => 'Adatbázis hiba: ' . $conn->error]]);
        exit;
    }

    if ($result->num_rows > 0) {
        $token = bin2hex(random_bytes(16));
        $created_at = date("Y-m-d H:i:s");

        $insert_sql = "INSERT INTO password_resets (email, token, created_at) VALUES ('$email', '$token', '$created_at')";
        if ($conn->query($insert_sql)) {
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host = 'mail.nethely.hu';
                $mail->SMTPAuth = true;
                $mail->Username = 'todoapp@norbbert4.hu';
                $mail->Password = 'T0d0A@ppP@ssw0rd2025';
                $mail->SMTPSecure = 'ssl'; // SSL használata
                $mail->Port = 465; // Nethely port SSL-lel

                $mail->setFrom('todoapp@norbbert4.hu', 'Todo App');
                $mail->addAddress($email);
                $mail->isHTML(true);
                $mail->Subject = 'Jelszo visszaallitas';
                $mail->Body = "Kattints ide a jelszo visszaallitasahoz: <br> <a href='http://localhost/todo_app/resetpassword.php?token=$token'>Jelszó visszaállítás</a>";

                $mail->send();
                $response = ['success' => true, 'message' => 'Email elküldve'];
            } catch (Exception $e) {
                $response = ['success' => false, 'error' => ['message' => 'Az email küldése sikertelen: ' . $mail->ErrorInfo]];
            }
        } else {
            $response = ['success' => false, 'error' => ['message' => 'Hiba a token tárolása során: ' . $conn->error]];
        }
    } else {
        $response = ['success' => false, 'error' => ['message' => 'Nincs ilyen email cím regisztrálva']];
    }

    echo json_encode($response);
}

$conn->close();
?>