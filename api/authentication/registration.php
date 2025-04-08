<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../../vendor/autoload.php';
include '../modules/_db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $email = filter_var($data->email, FILTER_VALIDATE_EMAIL);
    $username = htmlspecialchars($data->username);
    $password = $data->password;
    $enable_2fa = isset($data->enable_2fa) ? (bool)$data->enable_2fa : false;

    if (!$email) {
        $response = array('success' => false, 'error' => array('message' => 'Érvénytelen e-mail cím'));
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response);
        exit;
    }

    // További validáció: felhasználónév formátuma
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        $response = array('success' => false, 'error' => array('message' => 'A felhasználónév csak betűket, számokat és aláhúzást tartalmazhat'));
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response);
        exit;
    }

    // Jelszó követelmények ellenőrzése: legalább 8 karakter, kisbetű, nagybetű, szám
    if (strlen($password) < 8 || 
        !preg_match('/[a-z]/', $password) || 
        !preg_match('/[A-Z]/', $password) || 
        !preg_match('/[0-9]/', $password)) {
        $response = array('success' => false, 'error' => array('message' => 'A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell kisbetűt, nagybetűt és számot.'));
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response);
        exit;
    }

    $sql = "SELECT * FROM users WHERE user_name = ? OR user_email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response = array('success' => false, 'error' => array('message' => 'A felhasználónév vagy e-mail már foglalt'));
    } else {
        $verificationCode = substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 6); // Hosszabb kód: 6 karakter
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $two_factor_enabled = $enable_2fa ? 1 : 0;

        $_SESSION['pending_user'] = [
            'email' => $email,
            'username' => $username,
            'password' => $hashedPassword,
            'two_factor_enabled' => $two_factor_enabled
        ];
        $_SESSION['verification_code'] = $verificationCode;

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'mail.nethely.hu';
            $mail->SMTPAuth = true;
            $mail->Username = 'todoapp@norbbert4.hu';
            $mail->Password = 'T0d0A@ppP@ssw0rd2025';
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;
            $mail->CharSet = "UTF-8";
            $mail->setFrom('todoapp@norbbert4.hu', 'Todo App');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Todo App - Regisztráció ellenőrző kód';
            $currentDateTime = date('Y-m-d H:i:s');

            $mailBody = '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App - Regisztráció ellenőrző kód</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #4A43C4; background: linear-gradient(135deg, #6a11cb, #2575fc);">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #1C2526; border: 2px solid #00C4FF; border-radius: 10px; color: #ffffff;">
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h2 style="margin: 0 0 20px; font-size: 24px; color: #00C4FF;">Kedves ' . htmlspecialchars($username) . '!</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">Véglegesítsd a regisztrációdat a TodoApp oldalon az alábbi kóddal:</p>
                            <div style="display: inline-block; padding: 10px 20px; background-color: #333; color: #ffffff; border-radius: 5px; font-size: 16px; margin: 20px 0;">
                                ' . htmlspecialchars($verificationCode) . '
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 30px; text-align: center;">
                            <p style="margin: 20px 0 10px; font-size: 14px; color: #ffffff;">Ha nem te kezdeményezted a regisztrációt, kérjük, hagyd figyelmen kívül ezt az e-mailt. Ha bármilyen kérdésed van, lépj kapcsolatba velünk.</p>
                            <p style="margin: 0; font-size: 14px; color: #00C4FF;">Üdvözlettel,<br>Todo App csapata</p>
                            <p style="margin: 10px 0 0; font-size: 14px; color: #00C4FF;"><a href="mailto:todoapp@norbert4.hu" style="color: #00C4FF; text-decoration: none;">todoapp@norbert4.hu</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

            $mail->Body = $mailBody;
            $mail->AltBody = "Kedves $username!\n\nEz egy automatikusan elküldött üzenet, kérjük ne válaszoljon rá!\n\nKaptunk egy kérést a regisztrációd véglegesítésére a Todo App fiókodhoz. Az alábbi kódot használd a regisztrációd befejezéséhez:\n\n$verificationCode\n\nHa nem te kezdeményezted a regisztrációt, kérjük, hagyd figyelmen kívül ezt az e-mailt. Ha bármilyen kérdésed van, lépj kapcsolatba velünk: todoapp@norbert4.hu\n\n$currentDateTime\n\nÜdvözlettel,\nTodo App csapata";

            $mail->send();

            $response = array('success' => true, 'message' => 'Ellenőrző kód elküldve az e-mail címedre', 'step' => 'verify_code');
        } catch (Exception $e) {
            unset($_SESSION['pending_user']);
            unset($_SESSION['verification_code']);
            $response = array('success' => false, 'error' => array('message' => 'Hiba az e-mail küldése közben: ' . $mail->ErrorInfo));
        }
    }

    $stmt->close();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
}

$conn->close();
?>