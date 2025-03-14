<?php
include '../modules/_db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_GET['newpw'])) {

        // ÚJ JELSZÓ KÜLDÉS
        $data = json_decode(file_get_contents("php://input"));
        $password = $data->password;
        $userid = $data->user_ID;

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "UPDATE users SET user_pw='".$hashedPassword."' WHERE user_ID=".$userid;
        $conn->query($sql);
            
            $response = array(
                        'success' => true,
                        'message' => 'sikeres jelszó módosítás'
                    );
            
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response);
        
        
    } else {

        // ÚJ JELSZÓ KÉRÉS
        $data = json_decode(file_get_contents("php://input"));
        
        $username = $data->username;
        $email = $data->email;
        
        $sql = "SELECT * FROM users WHERE user_name = '$username' and user_email='$email'" ;
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            $response = array(
                'success' => true,
                'userData' => array(
                    'user_ID' => $user['user_ID']
                    )
                );
                
            } else {
                $response = array(
                    'success' => false,
                    'error' => array(
                        'message' => 'Nincs ilyen felhasználónév és/vagy email cím regisztrálva.',
                        )
                    );
            }
                
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($response);
        
    }
}


$conn->close();
?>