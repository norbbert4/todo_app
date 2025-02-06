<?php

$host="localhost";
$database="todo_app";
$sql_user="todo_app";
$sql_pw="T0d0A@ppP@ssw0rd2025";

$dsn = 'mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8';
$username = $sql_user;
$password = $sql_pw;

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Tábla létrehozása
    $sql = "
        CREATE TABLE IF NOT EXISTS todos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE
        );
    ";

    $pdo->exec($sql);
    echo "Table `todos` created successfully.\n";
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
    exit(1);
}
