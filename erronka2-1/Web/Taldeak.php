<?php
/**
 * Euskal Eskubaloi Federazioa - Taldeen Orria
 * 
 * Web guneko taldeen zerrenda bistaratzen duen orria.
 * XML fitxategitik datuak dinamikoki kargatzen ditu.
 * 
 * Funtzioak:
 * - Taldeen zerrenda bistaratzea
 * - XSLT transformatzioa erabiltzea
 * - CSS estiloak aplikatzea
 * - JavaScript interakzioak gaitzea
 * 
 * Egitura:
 * - Header: Nabigazioa eta erabiltzailearen info
 * - Section: Taldeen edukiontzia
 * - Footer: Oinarrizko informazioa
 * 
 * @author EEF
 * @version 2.0 - Euskal komentario gehituak
 */

include '../includes/header.php';
?>

    <!-- Taldeen atala nagusia -->
    <section class="teams-section">
        <div class="container-content">
            <h2 class="section-title">Taldeak</h2>
            <div id="teams-container">
                <!-- Eduki dinamikoa XML-tik kargatuko da -->
                <!-- main.js script-ak XSLT transformatzioa egiten du -->
                <!-- Taldeak.xml + Taldeak.xsl -> HTML txartelak -->
            </div>
        </div>
    </section>

    <!-- JavaScript funtzionalitateak kargatu -->
    <script src="../script/main.js"></script>

<?php include '../includes/footer.php'; ?>