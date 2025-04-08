<?php
if ($_SERVER['HTTP_HOST'] === 'localhost') {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "todo_app";
} else {
    $servername = "localhost";
    $username = "todo_app";
    $password = "T0d0A@ppP@ssw0rd2025";
    $dbname = "todo_app";
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>