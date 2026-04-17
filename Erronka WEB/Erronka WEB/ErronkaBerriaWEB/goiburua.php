<?php
// Saioa hasi fitxategi guztietan
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="eu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DAW Proiektua</title>
    <link rel="stylesheet" href="css/CSS.css">
</head>
<body id="top">

    <header id="goiburua">
        <h1>Eskubaloi Txapelketa</h1>
        <div class="erabiltzaile-info">
            <?php
            if (isset($_SESSION['erabiltzailea'])) {
                echo "<p>👤 " . $_SESSION['erabiltzailea'] . " | Rola: " . $_SESSION['rola'] . "</p>";
                echo '<a href="logout.php">Saioa Itxi</a>';
            } else {
                echo '<a href="login.php">Saioa Hasi</a>';
            }
            ?>
        </div>
        
        <nav>
            <ul>
                <li><a href="index.php">Hasiera (Sailkapena)</a></li>
                <li><a href="berriak.php">Berriak</a></li>
                <?php
                if (isset($_SESSION['rola'])) {
                    echo '<li><a href="kontaktua.php"> Kontaktua </a></li>';
                }

                if (isset($_SESSION['rola']) && $_SESSION['rola'] == 'admin') {
                    echo '<li><a href="ikusi_mezuak.php">📩 Mezuak Ikusi (Admin)</a></li>';
                    echo '<li><a href="kudeatu.php">⚙️ Datuak Kudeatu (Admin)</a></li>';
                }

                /*if (!isset($_SESSION['rola']) || $_SESSION['rola'] !== 'epaile') {
                echo "<main><p style='color:red; text-align:center; margin-top:50px;'>Baimenik gabe. Orrialde hau epaileentzat bakarrik da.</p></main>";
                include 'footer.php';
                exit();
                }*/
                ?>
            </ul>
        </nav>
    </header>