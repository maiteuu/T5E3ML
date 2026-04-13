<?php 
include 'goiburua.php'; 
include 'db.php'; // DB konexioa inportatu
?>

<main>
    <h2>Sailkapen Nagusia (24-25 Denboraldia)</h2>
    <p>Datuak zuzenean MySQL datu-basetik kargatzen ari dira.</p>
    
    <div class="sailkapena-lista">
        <?php
        // Kontsulta SQL sailkapena lortzeko, puntuen arabera ordenatuta
        $sql = "SELECT taldea, JP, IrP, BerP, GaP, puntuak FROM sailkapena_24_25 ORDER BY puntuak DESC";
        $emaitza = $konexioa->query($sql);
        
        // Emaitzak badaude, taula bat sortu
        if ($emaitza->num_rows > 0) {
            echo "<table>";
            echo "<tr><th>Taldea</th><th>Jokatutakoak (JP)</th><th>Irabazita (IrP)</th><th>Puntuak</th><th>Xehetasunak</th></tr>";
            
            // While begizta bat lerro guztiak irakurtzeko
            while($lerroa = $emaitza->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $lerroa["taldea"] . "</td>";
                echo "<td>" . $lerroa["JP"] . "</td>";
                echo "<td>" . $lerroa["IrP"] . "</td>";
                echo "<td><strong>" . $lerroa["puntuak"] . "</strong></td>";
                // URL-tik taldearen izena pasatzen dugu xehetasunak ikusteko
                echo "<td><a href='taldea.php?izena=" . urlencode($lerroa["taldea"]) . "'>Ikusi profila</a></td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p>Ez dago daturik sailkapen taulan.</p>";
        }
        ?>
    </div>
</main>
<?php $konexioa->close(); // Konexioa itxi beti bukaeran ?>
</body>
</html>