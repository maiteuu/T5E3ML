<?php 
include 'goiburua.php'; 
include 'db.php'; 
?>

<main>
    <h2>Datuak Eguneratu (Admin bakarrik)</h2>
    
    <?php
    // Sarbide kontrola
    if (!isset($_SESSION['rola']) || $_SESSION['rola'] != 'admin') {
        echo "<div class='error-message'>"; // CSS-ko klasea erabiliz
        echo "<h3>Errorea</h3><p>Ez daukazu baimenik orrialde hau ikusteko.</p>";
        echo "</div></main></body></html>";
        exit();
    }

    // Formularioa bidali bada
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $kod_taldea = $_POST['kod_taldea'];
        $ekipamendu_berria = $_POST['ekipamendua'];
        
        // Datu-basean UPDATE egin
        $stmt = $konexioa->prepare("UPDATE taldea SET Ekipamendua = ? WHERE kod_taldea = ?");
        $stmt->bind_param("ss", $ekipamendu_berria, $kod_taldea);
        
        if ($stmt->execute()) {
            echo "<p style='color:green; font-weight:bold; text-align:center;'>✅ Ekipamendua ondo eguneratu da DB-an!</p>";
        } else {
            echo "<p style='color:red; text-align:center;'>Errorea: " . $konexioa->error . "</p>";
        }
        $stmt->close();
    }
    ?>

    <form action="kudeatu.php" method="POST">
        <label for="kod_taldea">Aukeratu taldea:</label>
        <select name="kod_taldea" id="kod_taldea" required>
            <?php
            // Select-a datu-basetik bete
            $sql = "SELECT kod_taldea, Izena FROM taldea";
            $emaitza = $konexioa->query($sql);
            
            if ($emaitza->num_rows > 0) {
                while($lerroa = $emaitza->fetch_assoc()) {
                    echo "<option value='" . $lerroa["kod_taldea"] . "'>" . $lerroa["Izena"] . "</option>";
                }
            }
            ?>
        </select>
        
        <label for="ekipamendua">Ekipamendu berria (Koloreak):</label>
        <input type="text" name="ekipamendua" placeholder="Adib: Urdina eta Zuria" required>
        
        <button type="submit" class="btn-primary">Eguneratu DB-a</button>
    </form>
</main>
<?php $konexioa->close(); ?>
</body>
</html>