<?php 
include 'goiburua.php'; 

// 1. IMPORTANTE: Usamos 'rola' que es la variable que tú tienes en tu sesión
if (!isset($_SESSION['rola']) || $_SESSION['rola'] !== 'admin') {
    echo "<main><p style='color:red; text-align:center; margin-top:50px;'>Baimenik gabe. Orrialde hau administratzaileentzat bakarrik da.</p></main>";
    include 'footer.php';
    exit();
}

// 2. Ruta al archivo XML (donde kontaktua.php guarda los datos)
$archivoXML = 'xml/xml_msg/mensajes_contacto.xml';
?>

<link rel="stylesheet" href="css/CSS.css">

<main>
    <h2 style="text-align:center; margin-top:20px;">📩 Jasotako Mezuak (Administratzailea)</h2>
    
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <?php
    if (file_exists($archivoXML)) {
        $xml = simplexml_load_file($archivoXML);
        
        // Comprobar si hay mensajes en el XML
        if (isset($xml->Mesua) && count($xml->Mesua) > 0) {
            // Recorremos cada mensaje por separado
            foreach ($xml->Mesua as $mezua) {
                echo "<div style='background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #2c3e50; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>";
                echo "<p style='color: #7f8c8d; font-size: 0.85em; float: right;'><strong>Data:</strong> " . htmlspecialchars($mezua->Data) . "</p>";
                echo "<p><strong>Izena:</strong> <span style='font-weight: bold; color: #2c3e50;'>" . htmlspecialchars($mezua->Izena) . "</span></p>";
                echo "<p><strong>Email:</strong> <a href='mailto:" . htmlspecialchars($mezua->Email) . "' style='color: #3498db;'>" . htmlspecialchars($mezua->Email) . "</a></p>";
                echo "<hr style='border: 0; border-top: 1px solid #eee; margin: 15px 0;'>";
                echo "<p style='white-space: pre-wrap;'><strong>Mezua:</strong><br>" . nl2br(htmlspecialchars($mezua->Textua)) . "</p>";
                echo "</div>";
            }
        } else {
            echo "<p style='text-align:center; background: white; padding: 20px; border-radius: 8px;'>Ez dago mezurik jasota.</p>";
        }
    } else {
        echo "<p style='text-align:center; background: white; padding: 20px; border-radius: 8px;'>Ez da XML fitxategia aurkitu (oraindik ez da mezurik bidali).</p>";
    }
    ?>
    </div>
    
    <div style="text-align: center; margin-bottom: 40px;">
        <a href="index.php" class="form-btn" style="text-decoration: none; padding: 10px 20px; display: inline-block; width: auto;">Hasierara itzuli</a>
    </div>
</main>

<?php 
include 'footer.php';
?>