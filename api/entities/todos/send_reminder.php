<?php
//require_once 'C:/xampp/htdocs/todo_app/vendor/autoload.php'; nemkell localhostos
//require_once 'C:/xampp/htdocs/todo_app/api/modules/_db.php';
require_once '../../../vendor/autoload.php';
require_once '../../modules/_db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Naplófájl mappa és fájl elérési útja
//$logDir = 'C:/xampp/htdocs/todo_app/logs';
$logDir = '../../../logs';
$logFile = $logDir . '/email_log.txt';

// Ellenőrizzük, hogy a logs mappa létezik-e, ha nem, létrehozzuk
if (!file_exists($logDir)) {
    mkdir($logDir, 0777, true);
}

// Naplóírás függvény
function logMessage($message, $file) {
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($file, "[$timestamp] $message\n", FILE_APPEND);
}

if (!isset($conn) || $conn->connect_error) {
    logMessage("Adatbázis kapcsolódási hiba: " . ($conn ? $conn->connect_error : "A kapcsolat nem jött létre."), $logFile);
    die();
}

date_default_timezone_set('Europe/Budapest');

$tomorrow = date('Y-m-d', strtotime('+1 day'));

$query = "
    SELECT DISTINCT u.user_ID, u.user_email, u.user_name 
    FROM users u
    INNER JOIN todos t ON u.user_ID = t.user_id
    WHERE DATE(t.date) = ?
    AND t.completed = 0
";
$stmt = $conn->prepare($query);
if (!$stmt) {
    logMessage("Lekérdezési hiba: " . $conn->error, $logFile);
    die();
}
$stmt->bind_param('s', $tomorrow);
$stmt->execute();
$result = $stmt->get_result();
$usersWithTodos = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();

if (!empty($usersWithTodos)) {
    foreach ($usersWithTodos as $user) {
        $userID = $user['user_ID'];
        $userEmail = $user['user_email'];
        $userName = $user['user_name'];

        if (empty($userEmail) || !filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
            logMessage("Érvénytelen e-mail cím: $userName (ID: $userID) - $userEmail", $logFile);
            continue;
        }

        $sql = "SELECT * FROM todos WHERE user_id = ? AND DATE(date) = ? AND completed = 0 ORDER BY date, start_time, id ASC";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            logMessage("Lekérdezési hiba: " . $conn->error, $logFile);
            continue;
        }
        $stmt->bind_param('is', $userID, $tomorrow);
        $stmt->execute();
        $result = $stmt->get_result();
        $todos = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        // Aktuális dátum és idő definiálása
        $currentDateTime = date("Y-m-d H:i:s");

        // HTML e-mail tartalom összeállítása
        $todoListHtml = '';
        foreach ($todos as $todo) {
            $startTime = $todo['start_time'] ? $todo['start_time'] : 'Nincs megadva időpont';
            $todoListHtml .= '
                <li style="margin-bottom: 20px; padding: 10px; background-color: #2A3435; border-radius: 5px; border-left: 4px solid #00C4FF;">
                    <div style="font-size: 16px; color: #ffffff; font-weight: bold;">' . htmlspecialchars($todo['title']) . '</div>
                    <div style="font-size: 14px; color: #A0A0A0;">Esedékes: ' . $todo['date'] . ' ' . $startTime . '</div>
                </li>';
        }

        $emailBody = '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App - Holnapi teendők emlékeztető</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #4A43C4; background: linear-gradient(135deg, #6a11cb, #2575fc);">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #1C2526; border: 2px solid #00C4FF; border-radius: 10px; color: #ffffff;">
                    <!-- Üzenet -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h2 style="margin: 0 0 20px; font-size: 24px; color: #00C4FF;">Kedves ' . htmlspecialchars($userName) . '!</h2>
                            <p style="margin: 0 0 10px; font-size: 16px; color: #FF6666;">Ez egy automatikusan elküldött üzenet, kérjük ne válaszoljon rá!</p>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">Holnapra a következő teendőid vannak:</p>
                            <ul style="list-style-type: none; padding: 0; margin: 0 0 20px; font-size: 16px; color: #ffffff; text-align: left;">
                                ' . $todoListHtml . '
                            </ul>
                        </td>
                    </tr>
                    <!-- Lábjegyzet -->
                    <tr>
                        <td style="padding: 0 30px 30px; text-align: center;">
                            <p style="margin: 20px 0 10px; font-size: 14px; color: #ffffff;">Ha bármilyen kérdésed van, lépj kapcsolatba velünk.</p>
                            <p style="margin: 0 0 10px; font-size: 14px; color: #ffffff;">' . $currentDateTime . '</p>
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

        // Szöveges verzió
        $emailAltBody = "Kedves $userName,\n\nHolnapra a következő teendőid vannak:\n\n";
        foreach ($todos as $todo) {
            $startTime = $todo['start_time'] ? $todo['start_time'] : 'Nincs megadva időpont';
            $emailAltBody .= "- " . $todo['title'] . "\n  Esedékes: " . $todo['date'] . " " . $startTime . "\n\n";
        }
        $emailAltBody .= "\nÜdv,\nToDo App\n\nHa bármilyen kérdésed van, lépj kapcsolatba velünk: todoapp@norbbert4.hu\n\n$currentDateTime";

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'mail.nethely.hu';
            $mail->SMTPAuth = true;
            $mail->Username = 'todoapp@norbbert4.hu';
            $mail->Password = 'T0d0A@ppP@ssw0rd2025';
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;
            $mail->CharSet= "UTF-8";
            $mail->setFrom('todoapp@norbbert4.hu', 'Todo App');
            $mail->addAddress($userEmail);
            $mail->isHTML(true);
            $mail->Subject = 'Holnapi teendők emlékeztető';
            $mail->Body = $emailBody;
            $mail->AltBody = $emailAltBody;

            $mail->send();
            logMessage("E-mail sikeresen elküldve: $userEmail", $logFile);
        } catch (Exception $e) {
            logMessage("E-mail küldési hiba: $userEmail - {$mail->ErrorInfo}", $logFile);
        }
    }
} else {
    logMessage("Nincsenek holnapi teendők egyetlen felhasználónak sem.", $logFile);
}

$conn->close();
?>