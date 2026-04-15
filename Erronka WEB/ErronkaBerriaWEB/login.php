<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$erabiltzaileak_probak = [
    "admin" => [
        "pasahitza" => "1234",
        "rola" => "admin"
    ],
    "ikasle" => [
        "pasahitza" => "daw1",
        "rola" => "erabiltzaile_arrunta"
    ],
    "epaile" => [
        "pasahitza" => "partida",
        "rola" => "erabiltzaile_arrunta"
    ]
];

$errorea = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $erab = strtolower(trim($_POST['erabiltzailea']));
    $pas = trim($_POST['pasahitza']);

    // 🕵️‍♂️ MODO DETECTIVE: Hau pantailan agertuko da ikusteko zer iristen den zerbitzarira
    echo "<div style='background: black; color: #00ff00; padding: 15px; margin: 20px; font-family: monospace; border-radius: 5px;'>";
    echo "<strong>ZERBITZARIAK JASO DUENA:</strong><br>";
    echo "Erabiltzailea: [" . $erab . "]<br>";
    echo "Pasahitza: [" . $pas . "]<br>";
    echo "</div>";

    if (isset($erabiltzaileak_probak[$erab]) && $erabiltzaileak_probak[$erab]['pasahitza'] == $pas) {
        
        $_SESSION['erabiltzailea'] = $erab;
        $_SESSION['rola'] = $erabiltzaileak_probak[$erab]['rola'];
        
        echo "<script>window.location.href = 'index.php';</script>";
        exit();
    } else {
        $errorea = "Erabiltzaile edo pasahitz okerra. Saiatu berriro.";
    }
}

include 'goiburua.php'; 
?>

<main>
    <h2>Sistemara Sartu</h2>
    
    <!--<div style="background-color: #e8f4f8; border-left: 4px solid #3498db; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <h4 style="margin-top: 0; color: #2c3e50;">🧪 Probetarako Erabiltzaileak:</h4>
        <ul style="margin-bottom: 0;">
            <li><strong>Erabiltzailea:</strong> admin | <strong>Pasahitza:</strong> 1234 <em>(Kudeatzeko baimenarekin)</em></li>
            <li><strong>Erabiltzailea:</strong> ikasle | <strong>Pasahitza:</strong> daw1 <em>(Baimen barik)</em></li>
            <li><strong>Erabiltzailea:</strong> epaile | <strong>Pasahitza:</strong> partida <em>(Baimen barik)</em></li>
        </ul>
    </div>-->

    <?php
    // Errorea badago, CSS klasea erabiliz erakutsi
    if ($errorea != "") {
        echo "<div class='error-message' style='padding: 15px; margin-bottom: 20px;'>";
        echo "<p style='color: #dc3545; font-weight: bold; margin: 0;'>⚠️ " . $errorea . "</p>";
        echo "</div>";
    }
    ?>

    <form action="login.php" method="POST">
        <label for="erabiltzailea">Erabiltzailea:</label>
        <input type="text" id="erabiltzailea" name="erabiltzailea" placeholder="Idatzi zure erabiltzailea..." required>
        
        <label for="pasahitza">Pasahitza:</label>
        <input type="password" id="pasahitza" name="pasahitza" placeholder="Idatzi pasahitza..." required>
        
        <button type="submit" class="btn-primary" style="background-color: #990000; width: 100%;">Sartu</button>
    </form>
</main>
</body>
</html>