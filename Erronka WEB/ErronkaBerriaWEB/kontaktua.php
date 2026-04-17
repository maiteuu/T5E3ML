<?php 
include 'goiburua.php'; 
$mezua = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $izena = htmlspecialchars($_POST['izena']);
    $email = htmlspecialchars($_POST['email']);
    $testua = htmlspecialchars($_POST['testua']);

    $directorio = 'xml/xml_msg/';
    $archivoXML = $directorio . 'mensajes_contacto.xml';

    if (!is_dir($directorio)) {
        mkdir($directorio, 0777, true); 
    }

    if (file_exists($archivoXML)) {
        $xml = new DOMDocument();
        $xml->preserveWhiteSpace = false;
        $xml->formatOutput = true;
        $xml->load($archivoXML);
        $root = $xml->documentElement;
    } else {
        $xml = new DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;
        $root = $xml->createElement('Kontaktua');
        $xml->appendChild($root);
    }

    $nuevoMensaje = $xml->createElement('Mesua');
    $nuevoMensaje->appendChild($xml->createElement('Izena', $izena));
    $nuevoMensaje->appendChild($xml->createElement('Email', $email));
    $nuevoMensaje->appendChild($xml->createElement('Textua', $testua));
    $nuevoMensaje->appendChild($xml->createElement('Data', date('Y-m-d H:i:s')));
    $root->appendChild($nuevoMensaje);

    if ($xml->save($archivoXML)) {
        $mezua = "<div class='mensaje-exito'>Mezua ondo bidali da. Laster jarriko gara zurekin harremanetan! :)</div>";
    } else {
        $mezua = "<div class='mensaje-error'>Errorea XML fitxategia idazterakoan. Ziurtatu direktorioak baimenak dituela.</div>";
    }
}
?>

<link rel="stylesheet" href="css/CSS.css">

<main>
    <section class="contacto-section">
        <h2>Kontaktua</h2>
        
        <?php echo $mezua; ?>

        <form method="POST" action="kontaktua.php" class="contacto-form">
            <div class="form-group">
                <label for="izena">Izena:</label>
                <input type="text" id="izena" name="izena" class="form-input" placeholder="Zure izena" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" class="form-input" placeholder="adibidea@email.com" required>
            </div>
            
            <div class="form-group">
                <label for="testua">Mezua:</label>
                <textarea id="testua" name="testua" class="form-textarea" placeholder="Idatzi zure mezua hemen..." required></textarea>
            </div>
            
            <button type="submit" class="form-btn">Bidali Mezua</button>
        </form>
    </section>
</main>

<?php 
include 'footer.php';
?>

</body>
</html> 