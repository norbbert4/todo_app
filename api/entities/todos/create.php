<?php
// Biztonságos adatkezelés
$title = $conn->real_escape_string((string)($data['title'] ?? ''));
$date = $conn->real_escape_string((string)($data['date'] ?? date('Y-m-d')));
$start_time = isset($data['start_time']) && !empty($data['start_time']) ? "'" . $conn->real_escape_string((string)$data['start_time']) . "'" : 'NULL';
$user_id = (int)$userID;

// Ellenőrzés, hogy a title nem üres
if (empty($title)) {
    setMessage("error", "A teendő címe nem lehet üres!", false);
    exit();
}

// SQL lekérdezés a helyes változókkal
$sql = "INSERT INTO todos (title, date, start_time, user_id) 
        VALUES ('$title', '$date', $start_time, $user_id)";
?>