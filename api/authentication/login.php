<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

include '../modules/_db.php';
require 'C:/xampp/htdocs/todo_app/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if (!isset($conn)) {
    $response = array('success' => false, 'error' => 'Adatbázis kapcsolat hiányzik');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
    exit;
}

function get_device_token() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $ua = $_SERVER['HTTP_USER_AGENT'];
    return hash('sha256', $ip . $ua);
}

function generate_2fa_code() {
    return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
}

function send_2fa_email($email, $username, $temp_code, $persistent_code) {
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
        $mail->Subject = 'Todo App - Kétfaktoros hitelesítési kódok';
        $currentDateTime = date('Y-m-d H:i:s');

        $mailBody = '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App - 2FA kódok</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #4A43C4; background: linear-gradient(135deg, #6a11cb, #2575fc);">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #1C2526; border: 2px solid #00C4FF; border-radius: 10px; color: #ffffff;">
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h2 style="margin: 0 0 20px; font-size: 24px; color: #00C4FF;">Kedves ' . htmlspecialchars($username) . '!</h2>
                            <p style="margin: 0 0 10px; font-size: 16px; color: #FF6666;">Ez egy automatikusan elküldött üzenet, kérjük ne válaszoljon rá!</p>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">Az alábbi kódokat használhatod a bejelentkezéshez:</p>
                            <p style="margin: 0 0 10px; font-size: 16px; color: #ffffff;">Egyszeri belépéshez (érvényes: egy belépésre): <strong>' . htmlspecialchars($temp_code) . '</strong></p>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">Tartós belépéshez (érvényes 30 napig): <strong>' . htmlspecialchars($persistent_code) . '</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 30px; text-align: center;">
                            <p style="margin: 20px 0 10px; font-size: 14px; color: #ffffff;">Ha nem te kezdeményezted a bejelentkezést, kérjük, változtasd meg a jelszavadat!</p>
                            <p style="margin: 0 0 10px; font-size: 14px; color: #ffffff;">' . $currentDateTime . '</p>
                            <p style="margin: 0; font-size: 14px; color: #00C4FF;">Üdvözlettel,<br>Todo App csapata</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

        $mail->Body = $mailBody;
        $mail->AltBody = "Kedves $username!\n\nEz egy automatikusan elküldött üzenet, kérjük ne válaszoljon rá!\n\nAz alábbi kódokat használhatod a bejelentkezéshez:\nEgyszeri belépéshez (érvényes 10 percig): $temp_code\nTartós belépéshez (érvényes 30 napig): $persistent_code\n\nHa nem te kezdeményezted a bejelentkezést, kérjük, változtasd meg a jelszavadat!\n\n$currentDateTime\n\nÜdvözlettel,\nTodo App csapata";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Hiba az e-mail küldése közben: " . $mail->ErrorInfo);
        return false;
    }
}

$response = array('success' => false, 'error' => 'Érvénytelen kérés');

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['token']) && isset($_GET['user_id'])) {
    $token = $conn->real_escape_string($_GET['token']);
    $user_id = $conn->real_escape_string($_GET['user_id']);

    $sql = "SELECT * FROM logins WHERE login_user_id = ? AND login_token = ? AND login_state = 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('is', $user_id, $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $login = $result->fetch_assoc();
        $sql_user = "SELECT user_name, coins FROM users WHERE user_ID = ?";
        $stmt_user = $conn->prepare($sql_user);
        $stmt_user->bind_param('i', $user_id);
        $stmt_user->execute();
        $user_result = $stmt_user->get_result();
        $user = $user_result->fetch_assoc();

        $response = array('success' => true, 'username' => $user['user_name'], 'coins' => (int)$user['coins']);
    } else {
        $response = array('success' => false, 'message' => 'Sikertelen autentikáció.');
    }

    $stmt->close();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->username) && isset($data->password)) {
        $username = $conn->real_escape_string($data->username);
        $password = $data->password;

        $sql = "SELECT * FROM users WHERE user_name = '$username'";
        $result = $conn->query($sql);

        if ($result === false) {
            error_log("SQL Error: " . $conn->error);
            $response = array('success' => false, 'error' => 'Adatbázis hiba: ' . $conn->error);
        } elseif ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            if (password_verify($password, $user['user_pw'])) {
                $user_id = $user['user_ID'];
                $two_factor_enabled = $user['two_factor_enabled'];

                if ($two_factor_enabled == 1) {
                    $device_token = get_device_token();
                    $sql_trusted = "SELECT * FROM trusted_devices WHERE user_id = $user_id AND device_token = '$device_token' AND expires_at > NOW()";
                    $result_trusted = $conn->query($sql_trusted);

                    if ($result_trusted->num_rows > 0) {
                        $token = bin2hex(random_bytes(16));
                        $insertTokenSql = "INSERT INTO logins (login_user_id, login_date, action_date, login_token, login_state) VALUES ('$user_id', NOW(), NOW(), '$token', 1)";
                        $conn->query($insertTokenSql);

                        $response = array(
                            'success' => true,
                            'userData' => array(
                                'user_ID' => $user['user_ID'],
                                'user_name' => $user['user_name'],
                                'token' => $token,
                                'coins' => (int)$user['coins']
                            )
                        );
                    } else {
                        // Mindig új kódokat generálunk, ha az eszköz nem megbízható
                        $temp_code = generate_2fa_code();
                        $persistent_code = generate_2fa_code();

                        // Töröljük a régi kódokat az adott user_id-hoz
                        $conn->query("DELETE FROM two_factor_codes WHERE user_id = '$user_id'");
                        $insert_codes_sql = "INSERT INTO two_factor_codes (user_id, temp_code, persistent_code, expires_at, persistent_expires_at) VALUES ('$user_id', '$temp_code', '$persistent_code', DATE_ADD(NOW(), INTERVAL 10 MINUTE), DATE_ADD(NOW(), INTERVAL 30 DAY))";
                        $conn->query($insert_codes_sql);

                        $session_id = bin2hex(random_bytes(16));
                        if (send_2fa_email($user['user_email'], $user['user_name'], $temp_code, $persistent_code)) {
                            $conn->query("INSERT INTO login_sessions (user_id, session_id, expires_at) VALUES ('$user_id', '$session_id', DATE_ADD(NOW(), INTERVAL 10 MINUTE))");
                            $response = array('success' => false, 'error' => '2FA required', 'session_id' => $session_id);
                        } else {
                            $response = array('success' => false, 'error' => 'Hiba az e-mail küldése közben');
                        }
                    }
                } else {
                    $token = bin2hex(random_bytes(16));
                    $insertTokenSql = "INSERT INTO logins (login_user_id, login_date, action_date, login_token, login_state) VALUES ('$user_id', NOW(), NOW(), '$token', 1)";
                    $conn->query($insertTokenSql);

                    $response = array(
                        'success' => true,
                        'userData' => array(
                            'user_ID' => $user['user_ID'],
                            'user_name' => $user['user_name'],
                            'token' => $token,
                            'coins' => (int)$user['coins']
                        )
                    );
                }
            } else {
                $response = array('success' => false, 'error' => array('message' => 'Hibás jelszó'));
            }
        } else {
            $response = array('success' => false, 'error' => array('message' => 'Hibás felhasználónév vagy jelszó'));
        }
    } elseif (isset($data->session_id) && isset($data->code)) {
        $session_id = $conn->real_escape_string($data->session_id);
        $code = $conn->real_escape_string($data->code);

        $sql_session = "SELECT * FROM login_sessions WHERE session_id = '$session_id' AND expires_at > NOW()";
        $result_session = $conn->query($sql_session);

        if ($result_session->num_rows > 0) {
            $session = $result_session->fetch_assoc();
            $user_id = $session['user_id'];

            $sql_codes = "SELECT * FROM two_factor_codes WHERE user_id = $user_id AND (expires_at > NOW() OR persistent_expires_at > NOW()) ORDER BY id DESC LIMIT 1";
            $result_codes = $conn->query($sql_codes);

            if ($result_codes->num_rows > 0) {
                $codes = $result_codes->fetch_assoc();
            
                if ($code === $codes['temp_code'] && $codes['expires_at'] > date('Y-m-d H:i:s')) {
                    $token = bin2hex(random_bytes(16));
                    $insertTokenSql = "INSERT INTO logins (login_user_id, login_date, action_date, login_token, login_state) VALUES ('$user_id', NOW(), NOW(), '$token', 1)";
                    $conn->query($insertTokenSql);
            
                    $conn->query("UPDATE two_factor_codes SET expires_at = NOW() WHERE user_id = '$user_id' AND id = " . $codes['id']);
            
                    $response = array(
                        'success' => true,
                        'userData' => array(
                            'user_ID' => $user_id,
                            'token' => $token
                        )
                    );
                } elseif ($code === $codes['persistent_code'] && $codes['persistent_expires_at'] > date('Y-m-d H:i:s')) {
                    $device_token = get_device_token();
                    $conn->query("DELETE FROM trusted_devices WHERE user_id = '$user_id' AND device_token = '$device_token'");
                    $conn->query("INSERT INTO trusted_devices (user_id, device_token, expires_at) VALUES ('$user_id', '$device_token', DATE_ADD(NOW(), INTERVAL 30 DAY))");
            
                    $token = bin2hex(random_bytes(16));
                    $insertTokenSql = "INSERT INTO logins (login_user_id, login_date, action_date, login_token, login_state) VALUES ('$user_id', NOW(), NOW(), '$token', 1)";
                    $conn->query($insertTokenSql);
            
                    $response = array(
                        'success' => true,
                        'userData' => array(
                            'user_ID' => $user_id,
                            'token' => $token
                        )
                    );
                } else {
                    $response = array('success' => false, 'error' => 'Érvénytelen 2FA kód vagy lejárt');
                }
            
                $conn->query("DELETE FROM login_sessions WHERE session_id = '$session_id'");
            } else {
                $response = array('success' => false, 'error' => 'Nincs érvényes 2FA kód');
            }
        } else {
            $response = array('success' => false, 'error' => 'A session lejárt vagy érvénytelen');
        }
    }
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($response);

$conn->close();
?>