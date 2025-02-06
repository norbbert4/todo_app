<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

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
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM todos");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['title'])) {
            $stmt = $pdo->prepare("INSERT INTO todos (title) VALUES (:title)");
            $stmt->execute(['title' => $data['title']]);
            echo json_encode(['success' => true]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id'], $data['completed'])) {
            $stmt = $pdo->prepare("UPDATE todos SET completed = :completed WHERE id = :id");
            $stmt->execute(['completed' => $data['completed'], 'id' => $data['id']]);
            echo json_encode(['success' => true]);
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        if (isset($data['id'])) {
            $stmt = $pdo->prepare("DELETE FROM todos WHERE id = :id");
            $stmt->execute(['id' => $data['id']]);
            echo json_encode(['success' => true]);
        }
        break;
}
