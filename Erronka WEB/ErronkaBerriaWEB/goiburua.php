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
<body>
    <header>
        <h1>Futbol Txapelketa</h1>
        <div class="erabiltzaile-info">
            <?php
            // Logeatuta badago, bere izena eta rola erakutsi
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
                <?php
                // ROL DESBERDINEN FUNTZIONALTASUNA: Admin-ak bakarrik ikusten du "Kudeatu"
                if (isset($_SESSION['rola']) && $_SESSION['rola'] == 'admin') {
                    echo '<li><a href="kudeatu.php">⚙️ Datuak Kudeatu (Admin)</a></li>';
                }
                ?>
            </ul>
        </nav>
    </header>