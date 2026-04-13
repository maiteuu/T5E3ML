<?php 
include 'goiburua.php'; 
include 'db.php'; 
?>

<main>
    <?php
    if (isset($_GET['izena'])) {
        $talde_izena = $_GET['izena'];
        
        // 1. Taldearen informazioa lortu (SQL Injection ekiditeko prepare erabiltzen dugu)
        $stmt = $konexioa->prepare("SELECT * FROM taldea WHERE Izena = ?");
        $stmt->bind_param("s", $talde_izena);
        $stmt->execute();
        $emaitza_taldea = $stmt->get_result();

        if ($emaitza_taldea->num_rows > 0) {
            $taldea_info = $emaitza_taldea->fetch_assoc();
            
            echo "<h2>" . htmlspecialchars($taldea_info["Izena"]) . " - Profila</h2>";

            // 1. Irudiaren ibilbidea dinamikoki sortu taldearen izenarekin
            $irudi_izena = $taldea_info["Izena"] . ".jpg";
            $irudi_ruta = "Irudiak/Taldeak/" . $irudi_izena;

            // 2. Egiaztatu argazkia zerbitzarian existitzen den
            if (file_exists($irudi_ruta)) {
                $argazkia = $irudi_ruta; // Berezko argazkia badu
            } else {
                $argazkia = "img/default.jpg"; // Ez badu, argazki lehenetsia
            }

        // 3. Argazkia pantailaratu
        echo "<img src='" . htmlspecialchars($argazkia) . "' alt='Escudo de " . htmlspecialchars($taldea_info["Izena"]) . "' style='max-width:300px; border-radius: 8px;'>";
            
            echo "<ul>";
            echo "<li><strong>Kodea:</strong> " . $taldea_info["kod_taldea"] . "</li>";
            echo "<li><strong>Ekipamendua:</strong> " . $taldea_info["Ekipamendua"] . "</li>";
            echo "</ul>";

            // 2. Talde horretako jokalariak atera
            echo "<h3>Jokalariak (Jokalaria taulatik)</h3>";
            $stmt_jokalariak = $konexioa->prepare("SELECT Izen_abizena, Posizioa FROM jokalaria WHERE taldea = ?");
            $stmt_jokalariak->bind_param("s", $talde_izena);
            $stmt_jokalariak->execute();
            $emaitza_jokalariak = $stmt_jokalariak->get_result();

            if ($emaitza_jokalariak->num_rows > 0) {
                echo "<ul>";
                while($jokalari = $emaitza_jokalariak->fetch_assoc()) {
                    echo "<li>" . $jokalari["Izen_abizena"] . " - <em>" . $jokalari["Posizioa"] . "</em></li>";
                }
                echo "</ul>";
            } else {
                echo "<p>Ez da jokalaririk aurkitu datu-basean talde honentzat.</p>";
            }
            $stmt_jokalariak->close();

        } else {
            echo "<p>Taldea ez da aurkitu datu-basean.</p>";
        }
        $stmt->close();
    } else {
        echo "<p>Ez da talderik aukeratu URL-an.</p>";
    }
    ?>
    <br>
    <a href="index.php" style="text-decoration: none; color: #3498db;">⬅ Itzuli sailkapenera</a>
</main>
<?php $konexioa->close(); ?>
</body>
</html>