<?php include 'goiburua.php'; ?>

<link rel="stylesheet" href="css/CSS.css">

<main>
    <h2 style="text-align: center; margin-top: 20px;">Azken Berriak</h2>

    <article class="noticia-container">
        <h3>Garaipen historikoa torneoan</h3>
        <p>Atzo bizitako topaketa zirraragarriaren laburpena, non parte-hartzaileen maila handia agerian geratu zen.</p>
        
        <div class="carousel" id="carousel1">
            <div class="carousel-inner" id="inner1">
                <div class="carousel-item"><img src="Irudiak/berriak/jugador.jpg" alt="Foto 1"></div>
                <div class="carousel-item"><img src="Irudiak/berriak/Taldeaimg.jpg" alt="Foto 2"></div>
                <div class="carousel-item"><img src="Irudiak/berriak/ttrofeo.jpg" alt="Foto 3"></div>
            </div>
            <button class="carousel-btn prev" onclick="moveSlide(-1, 'inner1')">&#10094;</button>
            <button class="carousel-btn next" onclick="moveSlide(1, 'inner1')">&#10095;</button>
        </div>
    </article>

    <article class="noticia-container">
        <h3>Entrenamendu saio berezia</h3>
        <p>Jokalari gazteek aukera izan dute gure entrenatzaile onenekin ikasteko gaurko saio intentsiboan.</p>
        
        <div class="carousel" id="carousel2">
            <div class="carousel-inner" id="inner2">
                <div class="carousel-item"><img src="Irudiak/berriak/Entrenamenduak.jpg" alt="Entrenamiento 1"></div>
                <div class="carousel-item"><img src="Irudiak/berriak/entrenamentttt.jpg" alt="Entrenamiento 2"></div>
                <div class="carousel-item"><img src="Irudiak/berriak/entrenamento-chill.jpg" alt="Entrenamiento 3"></div>
            </div>
            <button class="carousel-btn prev" onclick="moveSlide(-1, 'inner2')">&#10094;</button>
            <button class="carousel-btn next" onclick="moveSlide(1, 'inner2')">&#10095;</button>
        </div>
    </article>

    <article class="noticia-container">
        <h3>Babesle berriaren aurkezpena</h3>
        <p>Denboraldi honetarako akordio garrantzitsua sinatu dugu gure babesle nagusiarekin.</p>
        
        <div class="carousel" id="carousel3">
            <div class="carousel-inner" id="inner3">
                <div class="carousel-item"><img src="Irudiak/Sponsor/DAZN_Logo_Master.svg.png" alt="Patrocinador 1"></div>
                <div class="carousel-item"><img src="Irudiak/Sponsor/hummel.svg" alt="Patrocinador 2"></div>
                <div class="carousel-item"><img src="Irudiak/Sponsor/Nike-0.png" alt="Patrocinador 3"></div>
            </div>
            <button class="carousel-btn prev" onclick="moveSlide(-1, 'inner3')">&#10094;</button>
            <button class="carousel-btn next" onclick="moveSlide(1, 'inner3')">&#10095;</button>
        </div>
    </article>

    <article class="noticia-container">
        <h3>Azken partidako jokaldirik onenak</h3>
        <p>Ikusi nola lortu genuen azken minutuko garaipena. Hemen dituzue argazki onenak.</p>

        <div class="carousel" id="carousel4">
            <div class="carousel-inner" id="inner4">
                <div class="carousel-item"><img src="Irudiak/Taldeak/San Adrian.jpg" alt="Jugada 1"></div>
                <div class="carousel-item"><img src="Irudiak/Taldeak/Kukullaga Etxebarri.jpg" alt="Jugada 2"></div>

                <div class="carousel-item">
                    <video 
                        class="lazy-video"
                        style="width: 100%; height: 100%; object-fit: contain; background: #000;" 
                        controls
                        preload="none"
                        poster="Irudiak/Videoa/hq720.jpg">
                        <source data-src="Irudiak/Videoa/videoa_3V6Dpz1g.mp4" type="video/mp4">
                        Zure nabigatzaileak ez du bideoa onartzen.
                    </video>
                </div>

            </div>
            <button class="carousel-btn prev" onclick="moveSlide(-1, 'inner4')">&#10094;</button>
            <button class="carousel-btn next" onclick="moveSlide(1, 'inner4')">&#10095;</button>
        </div>
    </article>
</main>

<script>
/**
 * CARRUSEL LOGIC
 */
const carouselIndices = {};

function moveSlide(step, innerId) {
    if (!(innerId in carouselIndices)) {
        carouselIndices[innerId] = 0;
    }

    const inner = document.getElementById(innerId);
    const totalItems = inner.children.length;

    carouselIndices[innerId] = (carouselIndices[innerId] + step + totalItems) % totalItems;

    inner.style.transform = `translateX(-${carouselIndices[innerId] * 100}%)`;
}


/**
 * VIDEO LAZY LOAD
 */
document.addEventListener("DOMContentLoaded", function () {
    const videos = document.querySelectorAll(".lazy-video");

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector("source");

                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    video.load();
                }

                obs.unobserve(video);
            }
        });
    }, {
        threshold: 0.5
    });

    videos.forEach(video => {
        observer.observe(video);
    });
});
</script>

<?php include 'footer.php'; ?>

</body>
</html>