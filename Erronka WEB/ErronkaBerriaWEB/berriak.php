<?php include 'goiburua.php'; ?>

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
</main>

<script>
    let index = 0;
    function moveSlide(step, innerId) {
        const inner = document.getElementById(innerId);
        const totalItems = inner.children.length;
        index = (index + step + totalItems) % totalItems;
        inner.style.transform = `translateX(-${index * 100}%)`;
    }
</script>
</body>
</html>