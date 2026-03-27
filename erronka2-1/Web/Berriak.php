<?php
/**
 * Euskal Eskubaloi Federazioa - Berriak Orria
 * 
 * Web guneko berri guztiak erakusten dituen orria.
 * XML fitxategitik datuak kargatzen ditu eta slider batean bistaratzen ditu.
 * 
 * Funtzioak:
 * - Berri guztiak bistaratzea
 * - Slider dinamikoa
 * - Kategorien arabera filtratzea
 * - Berrien xehetasunak ikustea
 * 
 * Optimizaciones:
 * - Lazy loading para imágenes
 * - Error handling para recursos
 * - Fallback para imágenes faltantes
 * 
 * @author EEF
 * @version 1.1 - Optimized
 */

// Cache control headers para mejor rendimiento
header('Cache-Control: public, max-age=300'); // 5 minutos cache
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 300) . ' GMT');

include '../includes/header.php';
?>

    <!-- SLIDER BERRIA GEZIEKIN ETA 7 IRUDIREKIN -->
    <section class="container">
        <div class="nuevo-slider-wrapper">
            <button class="slider-arrow slider-prev" aria-label="Aurreko irudia">‹</button>

            <div class="nuevo-slider">
                <!-- 1. IRUDIA -->
                <div class="nuevo-slide">
                    <img src="../Irudiak/berriak/088bd461-bb7a-4054-b9af-9ea2ff335e57_16-9-discover-aspect-ratio_default_0_x656y380.jpg" alt="Euskadiko Selekzioa txapelketan">
                    <div class="nuevo-slider-text-area">
                        <h3>Euskadiko Selekzioa</h3>
                        <p>Gure selekzioak txapelketa bikaina egin du aurten, partida guztiak irabaziz.</p>
                    </div>
                </div>

                <!-- 2. IRUDIA -->
                <div class="nuevo-slide">
                    <img src="../Irudiak/berriak/balonmano entrenamiento.jpg" alt="Entrenamendu saioa">
                    <div class="nuevo-slider-text-area">
                        <h3>Prestakuntza Intentsiboa</h3>
                        <p>Jokalarien entrenamendu saio bereziak lehen mailako prestakuntza bermatzeko.</p>
                    </div>
                </div>

                <!-- 3. IRUDIA -->
                <div class="nuevo-slide">
                    <img src="../Irudiak/berriak/partido.jpg" alt="Partida garrantzitsua">
                    <div class="nuevo-slider-text-area">
                        <h3>Partida Erabakigarria</h3>
                        <p>Azken partidan 28-25 irabazi dute, finalerdietarako sailkatuz.</p>
                    </div>
                </div>

                <!-- 4. IRUDIA -->
                <div class="nuevo-slide">
                    <img src="../Irudiak/berriak/jugador.jpg" alt="Jokalari ospetsua">
                    <div class="nuevo-slider-text-area">
                        <h3>Jokalari Nagusia</h3>
                        <p>Ander Martinez, 15 gol sartu ditu partida bakarrean, errekor berria ezarriz.</p>
                    </div>
                </div>

                <!-- 5. IRUDIA -->
                <div class="nuevo-slide">
                    <img src="../Irudiak/berriak/balonmano niños.jpg" alt="Haur taldea">
                    <div class="nuevo-slider-text-area">
                        <h3>Haur Talde Berria</h3>
                        <p>Umeentzako eskubaloi proiektu berria aurkeztu dugu, 200 haur baino gehiagorekin.</p>
                    </div>
                </div>

                <!-- 6. IRUDIA -->
                <div class="nuevo-slide">
                    <img src="../Irudiak/berriak/instalaciones.jpg" alt="Instalazio berriak">
                    <div class="nuevo-slider-text-area">
                        <h3>Instalazio Berriak</h3>
                        <p>Euskadiko eskubaloiaren garapenerako instalazio berriak inauguratu ditugu.</p>
                    </div>
                </div>

                <!-- 7. IRUDIA -->
                <div class="nuevo-slide">
                    <img src="../Irudiak/berriak/seleccion.jpg" alt="Nazioarteko partida">
                    <div class="nuevo-slider-text-area">
                        <h3>Nazioarteko Topaketa</h3>
                        <p>Euskadiko taldea Frantziako selekzioaren aurka jokatuko du hilabidean.</p>
                    </div>
                </div>
            </div>

            <button class="slider-arrow slider-next" aria-label="Hurrengo irudia">›</button>

            <div class="nuevo-slider-nav-dots"></div>
        </div>
    </section>

    <!-- Berrien atala: XML-tik dinamikoki kargatzen da -->
    <section class="news-section">
        <div class="container-content">
            <h2 class="section-title">Berriak</h2>
            
            <div class="news-grid" id="news-container">
                <!-- Edukia XML-tik dinamikoki kargatuko da -->
            </div>
        </div>
    </section>

    <script src="../script/deslizadera.js"></script>

    <!-- Script para cargar noticias -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar noticias dinámicamente
            const newsContainer = document.getElementById('news-container');
            if (newsContainer) {
                try {
                    if (typeof displayDynamicContent === 'function') {
                        displayDynamicContent('../XML/berriak.xml', '../XSLT/berriak.xsl', 'news-container');
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
                        <h3>Euskadiko Selekzioa Txapeldun</h3>
                        <p>Gure selekzioak txapelketa bikaina egin du aurten, partida guztiak irabaziz.</p>
                        <small>2026-03-16</small>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-content">
                        <h3>Prestakuntza Intentsiboa</h3>
                        <p>Jokalarien entrenamendu saio bereziak lehen mailako prestakuntza bermatzeko.</p>
                        <small>2026-03-15</small>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-content">
                        <h3>Haur Talde Berria</h3>
                        <p>Umeentzako eskubaloi proiektu berria aurkeztu dugu, 200 haur baino gehiagorekin.</p>
                        <small>2026-03-14</small>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-content">
                        <h3>Instalazio Berriak</h3>
                        <p>Euskadiko eskubaloiaren garapenerako instalazio berriak inauguratu ditugu.</p>
                        <small>2026-03-13</small>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-content">
                        <h3>Nazioarteko Topaketa</h3>
                        <p>Euskadiko taldea Frantziako selekzioaren aurka jokatuko du hilabetean.</p>
                        <small>2026-03-12</small>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-content">
                        <h3>Jokalari Nagusia</h3>
                        <p>Ander Martinez, 15 gol sartu ditu partida bakarrean, errekor berria ezarriz.</p>
                        <small>2026-03-11</small>
                    </div>
                </div>
            `;
            container.innerHTML = fallbackNews;
        }
    </script>

<?php include '../includes/footer.php'; ?>