<?php
// Datu-baseko konexioaren datuak (XAMPP defektuzko datuak)
$zerbitzaria = "localhost";
$erabiltzailea = "root";
$pasahitza = ""; 
$db_izena = "eskubaloi"; // Zure datu-basearen izena

// Konexioa sortu mysqli erabiliz (Ikasle moduan ohikoena)
$konexioa = new mysqli($zerbitzaria, $erabiltzailea, $pasahitza, $db_izena);

// Konexioak huts egiten badu, errorea erakutsi eta gelditu
if ($konexioa->connect_error) {
    die("Errorea datu-basera konektatzean: " . $konexioa->connect_error);
}

// Euskarazko karaktereak (ñ, tildes) ondo ikusteko
$konexioa->set_charset("utf8mb4");
?>