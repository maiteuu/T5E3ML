<?php
/**
 * Euskal Eskubaloi Federazioa - Goiburuko Nabigazioa
 * 
 * Fitxategi hau web guneko goiburuko nabigazioa definitzen du.
 * Logoa, nabigazio-menua eta estiloak kargatzen ditu.
 * 
 * Optimizaciones:
 * - Cache control
 * - Preload de recursos críticos
 * - Minificación de output
 * 
 * @author EEF
 * @version 1.1 - Optimized
 */

// Cache control headers
header('Cache-Control: public, max-age=3600'); // 1 hora cache
header('Vary: Accept-Encoding');

// Saioa hasi (etorkizunean saio-kudeaketa erabiltzeko)
session_start();

// Comprimir output para mejor rendimiento
ob_start('ob_gzhandler');
?>
<!DOCTYPE html>
<html lang="eu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EEF - Euskal Eskubaloi Federazioa</title>
    
    <!-- Preload de recursos críticos para mejor rendimiento -->
    <link rel="preload" href="../CSS/CSS.css" as="style">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style">
    
    <link rel="stylesheet" href="../CSS/CSS.css">
    <link rel="icon" href="../Irudiak/Logo Actualizado.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- DNS prefetch para recursos externos -->
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
</head>
<body>
    <!-- Orriaren goiburua -->
    <header class="header">
        <div class="header-top">
            <div class="logo">
                <a href="Hasiera.php"><img src="../Irudiak/Logo Actualizado.png" alt="EEF logoa"></a>
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="Hasiera.php">Hasiera</a></li>
                    <li><a href="Berriak.php">Berriak</a></li>
                    <li><a href="Sailkapena.php">Sailkapena</a></li>
                    <li><a href="Gurutzatzeak.php">Gurutzatzeak</a></li>
                    <li><a href="Egutegia.php">Egutegia</a></li>
                    <li><a href="Partidak.php">Fitxaketak</a></li>
                </ul>
            </nav>
            <a href="Zioak.php" onclick="irAQuejas(event)" class="btn"><button type="button">Zioak</button></a>
        </div>
    </header>