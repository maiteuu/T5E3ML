<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['rola']) || $_SESSION['rola'] !== 'epailea') {
    echo "<h2 style='color:red; text-align:center;'>Sarbide ukatua / Acceso denegado.</h2>";
    echo "<p style='text-align:center;'>Epaileek bakarrik sar ditzakete emaitzak. (Solo los árbitros pueden meter resultados).</p>";
    echo "<p style='text-align:center;'><a href='index.php'>Hasierara itzuli</a></p>";
    exit();
}

$zerbitzaria = "localhost";
$erabiltzailea = "root";
$pasahitza = "";
$datubasea = "eskubaloi";

$konexioa = new mysqli($zerbitzaria, $erabiltzailea, $pasahitza, $datubasea);

if ($konexioa->connect_error) {
    die("Konexioak huts egin du (Error de conexión): " . $konexioa->connect_error);
}


$mezua = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id_auto = $_POST['partidua_id']; 
    $golak_lokala = $_POST['golak_lokala'];
    $golak_kanpokoak = $_POST['golak_kanpokoak'];

    // Usamos sentencias preparadas para evitar inyección SQL
    $sql = "UPDATE partidua SET Golak_lokala = ?, Golak_kanpokoak = ? WHERE id_auto = ?";
    $stmt = $konexioa->prepare($sql);
    $stmt->bind_param("iii", $golak_lokala, $golak_kanpokoak, $id_auto);

    if ($stmt->execute()) {
        $mezua = "<div class='mensaje-exito'>Emaitza ondo gorde da! / ¡Resultado guardado correctamente!</div>";
    } else {
        $mezua = "<div style='color:red;'>Errorea emaitza gordetzean: " . $konexioa->error . "</div>";
    }
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="eu">
<head>
    <meta charset="UTF-8">
    <title>Emaitzak Sartu - Epailea</title>
    <link rel="stylesheet" href="CSS.css"> <style>
        .form-container {
            max-width: 500px;
            margin: 40px auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group select, .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <?php 
    // Incluimos tu menú de navegación
    include 'goiburua.php'; 
    ?>

    <main>
        <div class="form-container">
            <h2 style="text-align: center;">Emaitzak Sartu (Epailea)</h2>
            
            <?php echo $mezua; // Muestra si se ha guardado bien o ha habido error ?>

            <form method="POST" action="">
                
                <div class="form-group">
                    <label for="partidua_id">Aukeratu partidua (Elige el partido):</label>
                    <select name="partidua_id" id="partidua_id" required>
                        <option value="">-- Aukeratu partidua --</option>
                        <?php
                        // Consulta para obtener SOLO los partidos que NO tienen resultado aún (NULL)
                        $sql_partiduak = "SELECT id_auto, Talde_lokala, Kampoko_taldea, Data 
                                          FROM partidua 
                                          WHERE Golak_lokala IS NULL OR Golak_kanpokoak IS NULL 
                                          ORDER BY Data ASC";
                        
                        $emaitza = $konexioa->query($sql_partiduak);

                        if ($emaitza->num_rows > 0) {
                            while($row = $emaitza->fetch_assoc()) {
                                // Mostramos la fecha y los equipos enfrentados
                                echo "<option value='" . $row['id_auto'] . "'>";
                                echo date("Y-m-d", strtotime($row['Data'])) . " | " . $row['Talde_lokala'] . " vs " . $row['Kampoko_taldea'];
                                echo "</option>";
                            }
                        } else {
                            echo "<option value=''>Ez dago partidurik emaitzarik gabe (No hay partidos pendientes)</option>";
                        }
                        ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="golak_lokala">Etxeko taldearen golak (Goles Local):</label>
                    <input type="number" name="golak_lokala" id="golak_lokala" min="0" required>
                </div>

                <div class="form-group">
                    <label for="golak_kanpokoak">Kanpoko taldearen golak (Goles Visitante):</label>
                    <input type="number" name="golak_kanpokoak" id="golak_kanpokoak" min="0" required>
                </div>

                <button type="submit" class="form-btn" style="width: 100%; padding: 10px;">Emaitza Gorde (Guardar)</button>
            </form>
        </div>
    </main>

</body>
</html>
<?php
$konexioa->close();
?>