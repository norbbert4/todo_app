<?php
// Kapcsolódás az adatbázishoz
$servername= "localhost";
$username= "todo_user";
$password = "todopassword";
$dbname = "todo_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
