<?php
// API ENDPOINT

error_reporting(1);
//header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
//header("Access-Control-Allow-Headers: Authorization, Content-Type");
//header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];


// hiányzó paraméterek listája
    $missingParams = [];

// entitás
    if (isset($_GET['entity'])) {
        $entity = $_GET['entity'];
    } else {
        $entity = '';
        $missingParams[] = 'entity';
    }
// rekord id
    if (isset($_GET['entityid'])) {
        $entityID = $_GET['entityid'];
    } else {
        $entityID = 0;
        //$missingParams[] = 'entityid';
    }
// felhasználó azonosító
    if (isset($_GET['userid'])) {
        $userID = $_GET['userid'];
    } else {
        $userID = 0;
        $missingParams[] = 'userid';
    }
// user token
    if (isset($_GET['token'])) {
        $token = $_GET['token'];
    } else {
        $token = '';
        $missingParams[] = 'token';
    }

// üres kérés paraméter
    if (isset($_GET['empty'])) {
        $empty = $_GET['empty'];
    } else {
        $empty = false;
    }

include './entities/entities.php';
include './modules/_setmessage.php';
include './modules/_auth.php';
include './modules/_db.php';

if (count($missingParams) > 0) {
    setMessage("error", "Hiányzó paraméter(ek)!", false);
    $conn->close();
    exit();
}


$authResult = auth($conn, $userID, $token);
    
if ($authResult === true) {
    // sikeres autentikáció
} else {
    setMessage("error", "Sikertelen autentikáció.", false);
    $conn->close();
    exit();
}

// --- GET EMPTY ------------------------------------------------------------
function getEmpty() {
    setMessage("result", "Nincs válasz.", false);
}

// --- GET ALL --------------------------------------------------------------
function getAll() {
    global $conn;
    global $entity;
    global $entityName;
    include './entities/'.$entity.'/getall.php';
    $result = $conn->query($sql);       
    if ($result->num_rows > 0) {
        $entities = array();
        while ($row = $result->fetch_assoc()) {
            $entities[] = $row;
        }
        setMessage("result", $entityName[1], $entities);
    } else {
        setMessage("error", "Nincs elérhető ".$entityName[0].".", false);
    }
}

// --- GET ONE --------------------------------------------------------------
function getOneByID($entityID) {
    global $conn;
    global $entity;
    global $entityName;
    include './entities/'.$entity.'/getone.php';
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $entities = array();
        while ($row = $result->fetch_assoc()) {
            $entities[] = $row;
        }
        setMessage("result", $entityName[0].": #".$entityID, $entities);
    } else {
        setMessage("error", "Nincs ilyen azonosítójú ".$entityName[0].": #".$entityID, false);
    }
}

// --- CREATE ---------------------------------------------------------------
function create($data) {
    global $conn;
    global $entity;
    global $entityName;
    include './entities/'.$entity.'/create.php';
    if ($conn->query($sql) === TRUE) {
        setMessage("result", "Sikeres ".$entityName[0]." rögzítés.", $data);
    } else {
        setMessage("error", "Sikertelen ".$entityName[0]." rögzítés.", false);
    }
}

// --- UPDATE ---------------------------------------------------------------
function updateByID($id, $data) {
    global $conn;
    global $entity;
    global $entityName;
    include './entities/'.$entity.'/update.php';
    if ($conn->query($sql) === TRUE) {
        setMessage("result", $entityName[0].": #".$id, $data);
    } else {
        setMessage("error", "Nincs ilyen azonosítójú ".$entityName[1].": #".$id, false);
    }
}

// --- DELETE ---------------------------------------------------------------
function deleteByID($id) {
    global $conn;
    global $entity;
    global $entityName;
    include './entities/'.$entity.'/delete.php';
    if ($conn->query($sql) === TRUE) {
        setMessage("result", "Sikeres törlés", false);
    } else {
        setMessage("error", "Nincs ilyen azonosítójú ".$entityName[0].": #".$id, false);
    }
}



switch ($method) {

        //  GET = CRUD -> READ
        case 'GET':
            if (!$empty) {
                if ($entityID !== 0) {
                    getOneByID($entityID);
                } else {
                    getAll();
                }
            } else {
                getEmpty();
            }
            break;

        //  POST = CRUD -> CREATE
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            create($data);
            break;

        //  PATCH = CRUD -> UPDATE
        case 'PATCH':
            if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
                $data = json_decode(file_get_contents('php://input'), true);
                updateByID($entityID, $data);
            } else {
                http_response_code(415);
                echo json_encode(array('message' => 'A támogatott "Content-Type" header típus "application/json".'));
            }
            break;

        //  DELETE = CRUD -> DELETE
        case 'DELETE':
            deleteByID($entityID);
            break;

        //  DEFAULT
        default:
            http_response_code(400);
            echo json_encode(array('message' => 'Érvénytelen kérés.'));
            break;
}

$conn->close();