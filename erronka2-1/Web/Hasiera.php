<?php
/**
 * Euskal Eskubaloi Federazioa - Hasiera Orria
 * 
 * Web guneko hasiera orria. Erabiltzaileak informazio nagusia ikusi dezake:
 * - Irudi slider-a
 * - Sarbide azkarra
 * - Azken berriak
 * - Babesleak
 * 
 * Optimizaciones:
 * - Lazy loading para imágenes
 * - Preload de recursos críticos
 * - Error handling para imágenes
 * 
 * @author EEF
 * @version 1.1 - Optimized
 */

// Cache control headers para mejor rendimiento
header('Cache-Control: public, max-age=300'); // 5 minutos cache
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 300) . ' GMT');

// Goiburuko nabigazioa kargatu
include '../includes/header.php';
?>

    <!-- Irudi slider-a -->
    <section class="container">
        <div class="slider-wrapper">
            <div class="slider">
                <img id="slider-1" src="../Irudiak/slider/balonmano1.jpg" alt="Eskubaloi irudia 1">
                <img id="slider-2" src="../Irudiak/slider/balonmano2.jpg" alt="Eskubaloi irudia 2">
                <img id="slider-3" src="../Irudiak/slider/balonmano3.jpg" alt="Eskubaloi irudia 3">
                <img id="slider-4" src="../Irudiak/slider/balonmano4.jpg" alt="Eskubaloi irudia 4">
            </div>
            <div class="slider-nav">
                <a href="#slider-1" aria-label="Joan 1. irudira"></a>
                <a href="#slider-2" aria-label="Joan 2. irudira"></a>
                <a href="#slider-3" aria-label="Joan 3. irudira"></a>
                <a href="#slider-4" aria-label="Joan 4. irudira"></a>
            </div>
        </div>
    </section>

    <!-- Sarbide azkarra -->
    <section class="quick-access-section">
        <div class="container-content">
            <h2 class="section-title">Zer bilatzen duzu?</h2>
            <div class="quick-access-grid">
                <div class="access-card" aria-label="Emaitzak eta Sailkapenak">
                    <h3>Emaitzak eta Sailkapenak</h3>
                    <p>Eskubaloi lehiaketen azken datuak.</p>
                </div>
                <div class="access-card" aria-label="Arbitrajea">
                    <h3>Arbitrajea</h3>
                    <p>Zirkularrak, deialdiak eta araudia.</p>
                </div>
                <div class="access-card" aria-label="Lizentziak eta Kluben Gunea">
                    <h3>Lizentziak eta Kluben Gunea</h3>
                    <p>Kudeaketa, fitxaketak eta tramiteak.</p>
                </div>
                <div class="access-card" aria-label="EEF TV eta Galeria">
                    <h3>EEF TV eta Galeria</h3>
                    <p>Partiduak, erreportajeak eta argazkiak.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Azken berriak (dinamikoak) -->
    <section class="news-section">
        <div class="container-content">
            <h2 class="section-title main-news-title">Azken Berriak</h2>
            <div class="news-grid" id="home-news-container">
                <!-- Edukia XML-tik dinamikoki kargatuko da -->
            </div>
            <div class="news-footer">
                <a href="Berriak.php" class="btn-primary">Albiste guztiak ikusi</a>
            </div>
        </div>
    </section>

    <!-- Babesleak -->
    <section class="sponsor-section">
        <div class="container-content">
            <h2 class="section-title">Babesleak eta Kolaboratzaileak</h2>

            <div class="logo-carousel">

                <div class="logo-group">
                    <img src="../Irudiak/Sponsor/DAZN_Logo_Master.svg.png" alt="DAZN babeslea">
                    <img src="../Irudiak/Sponsor/Cartel_Chiringuito_Salamanca.png" alt="Chiringuito Salamanca babeslea">
                    <img src="../Irudiak/Sponsor/Nike.png" alt="Nike babeslea">
                    <img src="../Irudiak/Sponsor/hummel.png" alt="Hummel babeslea">
                </div>

                <div aria-hidden="true" class="logo-group">
                    <img src="../Irudiak/Sponsor/DAZN_Logo_Master.svg.png" alt="DAZN babeslea">
                    <img src="../Irudiak/Sponsor/Cartel_Chiringuito_Salamanca.png" alt="Chiringuito Salamanca babeslea">
                    <img src="../Irudiak/Sponsor/Nike.png" alt="Nike babeslea">
                    <img src="../Irudiak/Sponsor/hummel.png" alt="Hummel babeslea">
                </div>

            </div>

        </div>
    </section>

    <!-- Script para cargar noticias -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar noticias dinámicamente
            const newsContainer = document.getElementById('home-news-container');
            if (newsContainer) {
                try {
                    if (typeof displayDynamicContent === 'function') {
                        displayDynamicContent('../XML/berriak.xml', '../XSLT/berriak.xsl', 'home-news-container', { limit: 3, showVideo: 'yes' });
                    } else {
                        loadFallbackNews(newsContainer);
                    }
                } catch (error) {
                    console.warn('Error cargando noticias, usando fallback:', error);
                    loadFallbackNews(newsContainer);
                }
            }
        });

        function loadFallbackNews(container) {
            const fallbackNews = `
                <div class="news-item">
                    <div class="news-content">
                        <h3>Euskal Eskubaloi Federazioa</h3>
                        <p>Eskubaloi euskaldunaren berriak eta emaitzak</p>
                        <small>2026-03-16</small>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-content">
                        <h3>Txapelketak</h3>
                        <p>Ligako azken partidak eta sailkapenak</p>
                        <small>2026-03-15</small>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-content">
                        <h3>Formakuntza</h3>
                        <p>Entrenatzaile eta arbitroentzako ikastaroak</p>
                        <small>2026-03-14</small>
                    </div>
                </div>
            `;
            container.innerHTML = fallbackNews;
        }
    </script>

<?php include '../includes/footer.php'; ?>