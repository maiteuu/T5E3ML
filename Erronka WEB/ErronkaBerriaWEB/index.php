<?php 
include 'goiburua.php'; 
include 'db.php'; // DB konexioa inportatu

$denboraldia = isset($_GET['denboraldia']) ? $_GET['denboraldia'] : '24-25';

$taulak = [
    '24-25' => 'sailkapena_24_25',
    '25-26' => 'sailkapena_25_26'
];

if (!array_key_exists($denboraldia, $taulak)) {
    $denboraldia = '24-25';
}

$taula_izena = $taulak[$denboraldia];
?>

<main>
    <h2>Sailkapen Nagusia (<?php echo htmlspecialchars($denboraldia); ?> Denboraldia)</h2>
    <p>Datuak zuzenean MySQL datu-basetik kargatzen ari dira.</p>

    <div style="margin-bottom: 20px; text-align: center;">
        <form action="index.php" method="GET">
            <label for="denboraldia">Aukeratu denboraldia:</label>
            <select name="denboraldia" id="denboraldia" onchange="this.form.submit()" style="padding: 5px; font-size: 16px;">
                <option value="24-25" <?php if($denboraldia == '24-25') echo 'selected'; ?>>24-25 Denboraldia</option>
                <option value="25-26" <?php if($denboraldia == '25-26') echo 'selected'; ?>>25-26 Denboraldia</option>
            </select>
        </form>
    </div>
    
    <div class="sailkapena-lista">
        <?php
        $sql = "SELECT taldea, JP, IrP, BerP, GaP, puntuak FROM $taula_izena ORDER BY puntuak DESC";
        $emaitza = $konexioa->query($sql);
        
        if ($emaitza && $emaitza->num_rows > 0) {
            echo "<table>";
            echo "<tr><th>Taldea</th><th>Jokatutakoak (JP)</th><th>Irabazita (IrP)</th><th>Puntuak</th><th>Xehetasunak</th></tr>";
            
            while($lerroa = $emaitza->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $lerroa["taldea"] . "</td>";
                echo "<td>" . $lerroa["JP"] . "</td>";
                echo "<td>" . $lerroa["IrP"] . "</td>";
                echo "<td><strong>" . $lerroa["puntuak"] . "</strong></td>";
                echo "<td><a href='taldea.php?izena=" . urlencode($lerroa["taldea"]) . "'>Ikusi profila</a></td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p style='text-align: center; color: #e74c3c;'><strong>Ez dago daturik sailkapen taulan denboraldi honetarako.</strong></p>";
        }
        ?>
    </div>
</main>

<?php 
$konexioa->close(); // Konexioa itxi
include 'footer.php';
?>
</body>
</html>