<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//require 'C:/xampp/htdocs/todo_app/vendor/autoload.php';
require '../../vendor/autoload.php';
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
                $mail->Subject = 'Jelszó visszaállítás - Todo App';

                // Dinamikus adatok
                $resetLink = "http://localhost/todo_app/resetpassword.php?token=$token";

                
                $mail->Body = '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App - Jelszó visszaállítás</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #4A43C4; background: linear-gradient(135deg, #6a11cb, #2575fc);">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #1C2526; border: 2px solid #00C4FF; border-radius: 10px; color: #ffffff;">
                    <!-- Üzenet -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h2 style="margin: 0 0 20px; font-size: 24px; color: #00C4FF;">Kedves Felhasználó!</h2>
                            <p style="margin: 0 0 10px; font-size: 16px; color: #FF6666;">Ez egy automatikusan elküldött üzenet, kérjük ne válaszoljon rá!</p>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">Kaptunk egy kérést a jelszavad visszaállítására a Todo App fiókodhoz. Az alábbi gombra kattintva új jelszót állíthatsz be:</p>
                            <!-- Gomb -->
                            <a href="' . htmlspecialchars($resetLink) . '" style="display: inline-block; padding: 10px 20px; background-color: #2575fc; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Jelszó visszaállítás</a>
                        </td>
                    </tr>
                    <!-- Lábjegyzet -->
                    <tr>
                        <td style="padding: 0 30px 30px; text-align: center;">
                            <p style="margin: 20px 0 10px; font-size: 14px; color: #ffffff;">Ha nem te kérted a jelszó visszaállítását, kérjük, hagyd figyelmen kívül ezt az e-mailt. Ha bármilyen kérdésed van, lépj kapcsolatba velünk.</p>
                            <p style="margin: 0 0 10px; font-size: 14px; color: #ffffff;">' . $created_at . '</p>
                            <p style="margin: 0; font-size: 14px; color: #00C4FF;">Üdvözlettel,<br>Todo App csapata</p>
                            <p style="margin: 10px 0 0; font-size: 14px; color: #00C4FF;"><a href="mailto:todoapp@norbbert4.hu" style="color: #00C4FF; text-decoration: none;">todoapp@norbbert4.hu</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

                // Szöveges verzió (ha a HTML nem jelenik meg)
                $mail->AltBody = "Kedves Felhasználó!\n\nKaptunk egy kérést a jelszavad visszaállítására a Todo App fiókodhoz. Kattints az alábbi linkre az új jelszó beállításához:\n\n$resetLink\n\nHa nem te kérted a jelszó visszaállítását, kérjük, hagyd figyelmen kívül ezt az e-mailt.\n\n$created_at\n\nÜdvözlettel,\nTodo App csapata\nsupport@todoapp.hu";

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