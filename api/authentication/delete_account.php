<?php
session_start();

include '../modules/_db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

// Hibák kikapcsolása a kimenetben, logolás bekapcsolása
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', $_SERVER['HTTP_HOST'] === 'localhost' ? 'C:/xampp/htdocs/todo_app/error.log' : '/home/norbbert4/public_html/error.log');

require '../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if (!isset($conn)) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => ['message' => 'Adatbázis kapcsolat nem található']]);
    exit;
}

// Átirányítási útvonal meghatározása
$redirectPath = $_SERVER['HTTP_HOST'] === 'localhost' ? '/todo_app/index.html' : '/index.html';

// E-mail küldő függvény
function sendDeleteConfirmationEmail($email, $username, $delete_token, $conn) {
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
        $mail->Subject = 'Todo App - Fiók törlési kérelem';
        $currentDateTime = date('Y-m-d H:i:s');

        $deleteLink = ($_SERVER['HTTP_HOST'] === 'localhost' ? 'http://localhost/todo_app/api/' : 'https://todoapp.norbbert4.hu/api/') . "authentication/delete_account.php?token=$delete_token";

        $mailBody = '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App - Fiók törlési kérelem</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #4A43C4; background: linear-gradient(135deg, #6a11cb, #2575fc);">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #1C2526; border: 2px solid #00C4FF; border-radius: 10px; color: #ffffff;">
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h2 style="margin: 0 0 20px; font-size: 24px; color: #00C4FF;">Kedves ' . htmlspecialchars($username) . '!</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">Fiók törlési kérelmet kaptunk tőled. Kérjük, kattints az alábbi linkre a törlés véglegesítéséhez:</p>
                            <a href="' . $deleteLink . '" style="display: inline-block; padding: 10px 20px; background-color: #ff4444; color: #ffffff; text-decoration: none; border-radius: 5px;">Fiók törlése</a>
                            <p style="margin: 20px 0 10px; font-size: 14px; color: #ffffff;">A link 10 percig érvényes.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 30px; text-align: center;">
                            <p style="margin: 20px 0 10px; font-size: 14px; color: #ffffff;">Ha nem te kezdeményezted a törlést, kérjük, lépj kapcsolatba velünk azonnal!</p>
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

        $mail->Body = $mailBody;
        $mail->AltBody = "Kedves $username!\n\nFiók törlési kérelmet kaptunk tőled. Kérjük, kattints az alábbi linkre a törlés véglegesítéséhez:\n$deleteLink\n\nA link 10 percig érvényes.\n\nHa nem te kezdeményezted a törlést, kérjük, lépj kapcsolatba velünk!\n\n$currentDateTime\n\nÜdvözlettel,\nTodo App csapata";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Hiba az e-mail küldése közben: " . $mail->ErrorInfo);
        return false;
    }
}

// 1. Lépés: Felhasználónév és jelszó ellenőrzése, e-mail küldés
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->username) || !isset($data->password)) {
        echo json_encode(['success' => false, 'error' => ['message' => 'Felhasználónév és jelszó megadása kötelező']]);
        exit;
    }

    $username = $conn->real_escape_string($data->username);
    $password = $data->password;

    $sql = "SELECT * FROM users WHERE user_name = '$username'";
    $result = $conn->query($sql);

    if ($result === false) {
        echo json_encode(['success' => false, 'error' => ['message' => 'Adatbázis hiba: ' . $conn->error]]);
        exit;
    }

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['user_pw'])) {
            $user_id = $user['user_ID'];
            $email = $user['user_email'];

            // Törlési token generálása
            $delete_token = bin2hex(random_bytes(16));
            $expires_at = date('Y-m-d H:i:s', strtotime('+10 minutes'));

            // Token tárolása az adatbázisban
            $conn->query("DELETE FROM delete_requests WHERE user_id = '$user_id'");
            $insert_token_sql = "INSERT INTO delete_requests (user_id, delete_token, expires_at) VALUES ('$user_id', '$delete_token', '$expires_at')";
            $conn->query($insert_token_sql);

            // E-mail küldése
            if (sendDeleteConfirmationEmail($email, $username, $delete_token, $conn)) {
                echo json_encode(['success' => false, 'error' => 'confirmation_required']);
            } else {
                echo json_encode(['success' => false, 'error' => ['message' => 'Hiba az e-mail küldése közben']]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => ['message' => 'Hibás jelszó']]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => ['message' => 'Hibás felhasználónév']]);
    }

    $conn->close();
    exit;
}

// 2. Lépés: Megerősítő oldal megjelenítése a linkre kattintva
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['token']) && !isset($_GET['confirm']) && !isset($_GET['cancel'])) {
    header('Content-Type: text/html; charset=utf-8');
    $delete_token = $conn->real_escape_string($_GET['token']);

    $sql = "SELECT * FROM delete_requests WHERE delete_token = '$delete_token' AND expires_at > NOW()";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $request = $result->fetch_assoc();
        $user_id = $request['user_id'];

        // Megerősítő oldal megjelenítése
        echo '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Fiók törlés megerősítése</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="../../assets/css/style.css?ver=2">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <!-- Bal oldali üdvözlő szöveg -->
            <div class="col-md-5 text-center text-white">
			
                <h1 class="login_bal_text">Fiók törlése</h1>
                <p class="login_bal_text_kis">Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza!</p>
            </div>
            <!-- Jobb oldali gombok -->
			
            <div class="col-md-7">
			<form autocomplete="off" id="delete-form">
                <h2 class="login_bejel_text_cim">Fiók törlése</h2><br>
                <div class="mb-3">
                    <a href="delete_account.php?token=' . htmlspecialchars($delete_token) . '&confirm=true" class="btn btn-primary col-12">Fiók törlése</a>
                </div>
                <br>
                <p>Meggoldoltad magad?</p>
                <div class="mb-3">
                    <a href="delete_account.php?token=' . htmlspecialchars($delete_token) . '&cancel=true" class="btn btn-primary col-12">Vissza a bejelentkezéshez</a>
                </div>
            </div>
        </div>
    </div>
	
	
</body>
</html>';
    } else {
        echo '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hiba</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="../../assets/css/style.css?ver=2">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-md-5 text-center text-white">
                <h1 class="login_bal_text">Hiba</h1>
                <p class="login_bal_text_kis">Érvénytelen vagy lejárt törlési kérelem.</p>
            </div>
            <div class="col-md-7">
			 <form autocomplete="off" id="delete-form">
                <h2 class="login_bejel_text_cim">Hiba</h2><br>
                <p>Vissza a bejelentkezéshez?</p>
                <div class="mb-3">
                    <a href="' . $redirectPath . '" class="btn btn-primary col-12">Vissza a bejelentkezéshez</a>
                </div>
            </div>
        </div>
    </div>
	
	
</body>
</html>';
    }

    $conn->close();
    exit;
}

// 3. Lépés: "Nem" gomb kezelése - Mégse üzenet megjelenítése
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['token']) && isset($_GET['cancel']) && $_GET['cancel'] === 'true') {
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Törlés megszakítva</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="../../assets/css/style.css?ver=2">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-md-5 text-center text-white">
                <h1 class="login_bal_text">Mégse</h1>
                <p class="login_bal_text_kis">A fiók törlése megszakítva.</p>
            </div>
            <div class="col-md-7">
			<form autocomplete="off" id="delete-form">
                <h2 class="login_bejel_text_cim">Átirányítás...</h2><br>
                <p>Vissza a bejelentkezéshez...</p>
            </div>
        </div>
    </div>
	
    <script>
        setTimeout(() => { window.location.href = "' . $redirectPath . '"; }, 2000);
    </script>
</body>
</html>';
    $conn->close();
    exit;
}

// 4. Lépés: Törlés végrehajtása a megerősítés után
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['token']) && isset($_GET['confirm']) && $_GET['confirm'] === 'true') {
    header('Content-Type: text/html; charset=utf-8');
    $delete_token = $conn->real_escape_string($_GET['token']);

    $sql = "SELECT * FROM delete_requests WHERE delete_token = '$delete_token' AND expires_at > NOW()";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $request = $result->fetch_assoc();
        $user_id = $request['user_id'];

        try {
            // Kapcsolódó adatok törlése
            $conn->query("DELETE FROM logins WHERE login_user_id = '$user_id'");
            $conn->query("DELETE FROM trusted_devices WHERE user_id = '$user_id'");
            $conn->query("DELETE FROM two_factor_codes WHERE user_id = '$user_id'");
            $conn->query("DELETE FROM login_sessions WHERE user_id = '$user_id'");
            $conn->query("DELETE FROM delete_requests WHERE user_id = '$user_id'");

            // Felhasználó törlése
            $sql = "DELETE FROM users WHERE user_ID = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $user_id);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                // Sikeres törlés esetén kijelentkeztetjük a felhasználót
                session_destroy();
                echo '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Fiók törölve</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="../../assets/css/style.css?ver=2">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-md-5 text-center text-white">
                <h1 class="login_bal_text">Fiók sikeresen törölve!</h1>
                <p class="login_bal_text_kis">Átirányítunk a kezdőlapra...</p>
            </div>
            <div class="col-md-7">
			<form autocomplete="off" id="delete-form">
                <h2 class="login_bejel_text_cim">Fiók törölve</h2><br>
                <p>Átirányítunk a bejelentkezéshez...</p>

            </div>
        </div>
    </div>
    <script>
        setTimeout(() => { window.location.href = "' . $redirectPath . '"; }, 2000);
    </script>
</body>
</html>';
            } else {
                echo '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hiba</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="../../assets/css/style.css?ver=2">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-md-5 text-center text-white">
                <h1 class="login_bal_text">Hiba</h1>
                <p class="login_bal_text_kis">Nem sikerült a fiók törlése.</p>
            </div>
            <div class="col-md-7">
                <h2 class="login_bejel_text_cim">Hiba</h2><br>
                <p>Vissza a bejelentkezéshez?</p>
                <div class="mb-3">
                    <a href="' . $redirectPath . '" class="btn btn-primary col-12">Vissza a bejelentkezéshez</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
            }

            $stmt->close();
        } catch (Exception $e) {
            echo '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hiba</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="../../assets/css/style.css?ver=2">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-md-5 text-center text-white">
                <h1 class="login_bal_text">Hiba</h1>
                <p class="login_bal_text_kis">Hiba történt a fiók törlése során: ' . $e->getMessage() . '</p>
            </div>
            <div class="col-md-7">
                <h2 class="login_bejel_text_cim">Hiba</h2><br>
                <p>Vissza a bejelentkezéshez?</p>
                <div class="mb-3">
                    <a href="' . $redirectPath . '" class="btn btn-primary col-12">Vissza a bejelentkezéshez</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
        }
    } else {
        echo '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hiba</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="../../assets/css/style.css?ver=2">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-md-5 text-center text-white">
                <h1 class="login_bal_text">Hiba</h1>
                <p class="login_bal_text_kis">Érvénytelen vagy lejárt törlési kérelem.</p>
            </div>
            <div class="col-md-7">
                <h2 class="login_bejel_text_cim">Hiba</h2><br>
                <p>Vissza a bejelentkezéshez?</p>
                <div class="mb-3">
                    <a href="' . $redirectPath . '" class="btn btn-primary col-12">Vissza a bejelentkezéshez</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
    }

    $conn->close();
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode(['success' => false, 'error' => ['message' => 'Érvénytelen kérés']]);
$conn->close();
?>