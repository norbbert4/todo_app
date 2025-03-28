<?php
include '../modules/_db.php';

$sql="UPDATE logins SET logout_date=NOW(), login_state=0 WHERE login_user_id=".$_GET['userid']." and login_state=1";
$result = $conn->query($sql);
$conn->close();
header("location:../../");
?>