<?php
$path = realpath(__DIR__ . '/../modules/_db.php');

if (file_exists($path)) {
    echo "A _db.php fájl létezik a megadott elérési úton: $path\n";
    require_once $path;
    echo "A _db.php fájl sikeresen betöltve.\n";
} else {
    echo "A _db.php fájl nem található a megadott elérési úton: $path\n";
}
?>
