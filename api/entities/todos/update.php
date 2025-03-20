<?php
// Biztosítjuk, hogy ne legyen semmilyen kimenet a JSON előtt
ob_start(); // Kimenet pufferelése

// Biztonságos adatkezelés
$title = isset($data['title']) ? $conn->real_escape_string((string)$data['title']) : null;
$completed = isset($data['completed']) ? (int)$data['completed'] : 0;
$user_id = (int)$userID;

// Először lekérdezzük a teendő aktuális állapotát
$check_sql = "SELECT completed, rewarded FROM todos WHERE id = $id AND user_id = $user_id";
$result = $conn->query($check_sql);
if (!$result || $result->num_rows === 0) {
    $response = ['success' => false, 'message' => 'Teendő nem található'];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
    ob_end_flush(); // Puffer kiürítése
    exit();
}
$todo = $result->fetch_assoc();

// Értékek konvertálása integerré
$previous_completed = (int)$todo['completed'];
$rewarded = (int)$todo['rewarded'];

// Naplózás a hibakereséshez
error_log("Todo állapot: completed=$completed, previous_completed=$previous_completed, rewarded=$rewarded");

// Teendő állapotának frissítése
$sql = "UPDATE todos SET completed = $completed" . ($title ? ", title = '$title'" : "") . " WHERE id = $id AND user_id = $user_id";
if (!$conn->query($sql)) {
    $response = ['success' => false, 'message' => 'Hiba a teendő frissítésekor: ' . $conn->error];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
    ob_end_flush();
    exit();
}

// Ha a teendő most lett kipipálva (completed = 1), és még nem kapott érte coint, adjunk 1 coint
if ($completed === 1 && $previous_completed === 0 && $rewarded === 0) {
    // Naplózás
    error_log("Coin hozzáadása: user_id=$user_id, todo_id=$id");

    // 1. Jelöljük, hogy a teendőért kapott coint
    $update_reward_sql = "UPDATE todos SET rewarded = 1 WHERE id = $id AND user_id = $user_id";
    if (!$conn->query($update_reward_sql)) {
        error_log("Hiba a rewarded frissítésekor: " . $conn->error);
    }

    // 2. Növeljük a felhasználó coinjait
    $update_coins_sql = "UPDATE users SET coins = coins + 1 WHERE user_ID = $user_id";
    if (!$conn->query($update_coins_sql)) {
        error_log("Hiba a coins frissítésekor: " . $conn->error);
    }
}

// Visszaküldjük az új coin értéket
$coins_sql = "SELECT coins FROM users WHERE user_ID = $user_id";
$coins_result = $conn->query($coins_sql);
if (!$coins_result || $coins_result->num_rows === 0) {
    $response = ['success' => false, 'message' => 'Felhasználó nem található'];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
    ob_end_flush();
    exit();
}
$coins_row = $coins_result->fetch_assoc();

// Visszaküldjük a frissített teendő adatait is
$updated_todo_sql = "SELECT * FROM todos WHERE id = $id AND user_id = $user_id";
$updated_todo_result = $conn->query($updated_todo_sql);
if (!$updated_todo_result || $updated_todo_result->num_rows === 0) {
    $response = ['success' => false, 'message' => 'Frissített teendő nem található'];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
    ob_end_flush();
    exit();
}
$updated_todo = $updated_todo_result->fetch_assoc();

// Válasz összeállítása
$response = [
    'success' => true,
    'coins' => (int)$coins_row['coins'],
    'todo' => $updated_todo
];

// Biztosítjuk, hogy csak a JSON válasz kerüljön a kimenetre
header('Content-Type: application/json; charset=utf-8');
echo json_encode($response);
ob_end_flush(); // Puffer kiürítése
exit();
?>