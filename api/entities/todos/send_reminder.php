<?php
// Helyes elérési út a vendor/autoload.php-hez
require_once 'C:/xampp/htdocs/todo_app/vendor/autoload.php'; // Abszolút elérési út

// Adatbázis kapcsolat betöltése
require_once 'C:/xampp/htdocs/todo_app/api/modules/_db.php'; // Abszolút elérési út a helyes mappához (api/modules)

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Ellenőrizzük, hogy a $conn létezik-e
if (!isset($conn) || $conn->connect_error) {
    die("Adatbázis kapcsolódási hiba: " . ($conn ? $conn->connect_error : "A kapcsolat nem jött létre."));
}

// Időzóna beállítása
date_default_timezone_set('Europe/Budapest');

// Hibakeresés: Nézzük meg az összes felhasználót az adatbázisban
$allUsersQuery = "SELECT user_ID, user_email, user_name FROM users";
$allUsersResult = $conn->query($allUsersQuery);
$allUsers = $allUsersResult->fetch_all(MYSQLI_ASSOC);
echo "Összes felhasználó az adatbázisban:\n";
var_dump($allUsers);

// Holnap dátumának meghatározása
$tomorrow = date('Y-m-d', strtotime('+1 day'));

// Hibakeresés: Nézzük meg az összes holnapi teendőt
$allTodosQuery = "
    SELECT t.id, t.title, t.date, t.start_time, t.user_id, u.user_email, u.user_name
    FROM todos t
    INNER JOIN users u ON t.user_id = u.user_ID
    WHERE DATE(t.date) = ?
    AND t.completed = 0
";
$allTodosStmt = $conn->prepare($allTodosQuery);
$allTodosStmt->bind_param('s', $tomorrow);
$allTodosStmt->execute();
$allTodosResult = $allTodosStmt->get_result();
$allTodos = $allTodosResult->fetch_all(MYSQLI_ASSOC);
$allTodosStmt->close();
echo "Holnapi teendők az adatbázisban:\n";
var_dump($allTodos);

// Lekérdezzük azokat a felhasználókat, akiknek holnapra van teendőjük (még nem teljesített teendők)
$query = "
    SELECT DISTINCT u.user_ID, u.user_email, u.user_name 
    FROM users u
    INNER JOIN todos t ON u.user_ID = t.user_id
    WHERE DATE(t.date) = ?
    AND t.completed = 0
";
$stmt = $conn->prepare($query);
if (!$stmt) {
    die("Lekérdezési hiba: " . $conn->error);
}
$stmt->bind_param('s', $tomorrow);
$stmt->execute();
$result = $stmt->get_result();
$usersWithTodos = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Hibakeresés: Nézzük meg, mit tartalmaz a $usersWithTodos
echo "Lekérdezett felhasználók (akiknek holnapra van teendőjük):\n";
var_dump($usersWithTodos);

// Ha vannak felhasználók holnapi teendőkkel, küldünk e-mailt
if (!empty($usersWithTodos)) {
    foreach ($usersWithTodos as $user) {
        $userID = $user['user_ID'];
        $userEmail = $user['user_email'];
        $userName = $user['user_name'];

        // Hibakeresés: Nézzük meg, mit tartalmaz a $userEmail
        echo "Felhasználó: $userName (ID: $userID), E-mail: $userEmail\n";

        // Ellenőrizzük, hogy az e-mail cím érvényes-e
        if (empty($userEmail) || !filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
            echo "Érvénytelen e-mail cím a következő felhasználónál: $userName (ID: $userID). E-mail: $userEmail\n";
            continue; // Ugrunk a következő felhasználóra
        }

        // Az adott felhasználó holnapi teendőinek lekérdezése
        $sql = "SELECT * FROM todos WHERE user_id = ? AND DATE(date) = ? AND completed = 0 ORDER BY date, start_time, id ASC";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            die("Lekérdezési hiba: " . $conn->error);
        }
        $stmt->bind_param('is', $userID, $tomorrow);
        $stmt->execute();
        $result = $stmt->get_result();
        $todos = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        // HTML e-mail tartalom összeállítása
        $currentDateTime = date("Y-m-d H:i:s"); // Aktuális dátum és idő
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

        // Szöveges verzió (ha a HTML nem jelenik meg)
        $emailAltBody = "Kedves $userName,\n\nHolnapra a következő teendőid vannak:\n\n";
        foreach ($todos as $todo) {
            $startTime = $todo['start_time'] ? $todo['start_time'] : 'Nincs megadva időpont';
            $emailAltBody .= "- " . $todo['title'] . "\n  Esedékes: " . $todo['date'] . " " . $startTime . "\n\n";
        }
        $emailAltBody .= "\nÜdv,\nToDo App\n\nHa bármilyen kérdésed van, lépj kapcsolatba velünk: todoapp@norbbert4.hu\n\n$currentDateTime";

        // PHPMailer beállítása
        $mail = new PHPMailer(true);
        try {
            // Szerver beállítások
            $mail->isSMTP();
            $mail->Host = 'mail.nethely.hu';
            $mail->SMTPAuth = true;
            $mail->Username = 'todoapp@norbbert4.hu';
            $mail->Password = 'T0d0A@ppP@ssw0rd2025'; // Add meg a jelszót
            $mail->SMTPSecure = 'ssl'; // SSL használata
            $mail->Port = 465; // Nethely port SSL-lel

            // Feladó és címzett
            $mail->setFrom('todoapp@norbbert4.hu', 'Todo App');
            $mail->addAddress($userEmail); // A helyes változó: $userEmail

            // E-mail tartalom
            $mail->isHTML(true); // HTML formátumú e-mail
            $mail->Subject = 'Holnapi teendők emlékeztető';
            $mail->Body = $emailBody;
            $mail->AltBody = $emailAltBody; // Szöveges verzió

            // E-mail küldése
            $mail->send();
            echo "E-mail sikeresen elküldve a következőnek: $userEmail\n";
        } catch (Exception $e) {
            echo "Hiba történt az e-mail küldése közben a következőnek: $userEmail. Hiba: {$mail->ErrorInfo}\n";
        }
    }
} else {
    echo "Nincsenek holnapi teendők egyetlen felhasználónak sem.\n";
}

// Kapcsolat bezárása
$conn->close();
?>