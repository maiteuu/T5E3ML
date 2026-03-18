// Slider berriaren funtzionalitatearako JavaScript-a
console.log("Slider JS kargatuta - Bertsio berria");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM kargatuta - Slider berria hasieratzen");
    
    const slider = document.querySelector('.nuevo-slider');
    const slides = document.querySelectorAll('.nuevo-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.nuevo-slider-nav-dots');
    
    // Elementuak egiaztatu
    console.log("Aurkitutako elementuak:", {
        slider: !!slider,
        slides: slides.length,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
        dotsContainer: !!dotsContainer
    });
    
    if (!slider || slides.length === 0) {
        console.log("Ez da slider berririk aurkitu, ez da hasieratu behar");
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Nabigazio puntuak sortu
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        for(let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', `${i + 1}. irudira joan`);
            
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                console.log("Puntua klikatuta, indizea:", index);
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        }
        updateDots();
    }
    
    function updateDots() {
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if(index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function goToSlide(n) {
        console.log("Irudira joan:", n);
        
        // Indizea mugen barruan dagoela ziurtatu
        currentSlide = n;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        
        // Slider-a mugitu
        const translateX = -(currentSlide * 100);
        slider.style.transform = `translateX(${translateX}%)`;
        
        console.log("Slider-a mugituta hona:", translateX + "%");
        updateDots();
    }
    
    function nextSlide() {
        console.log("Hurrengo irudia");
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        console.log("Aurreko irudia");
        goToSlide(currentSlide - 1);
    }
    
    // Puntuak hasieratu
    createDots();
    
    // Gezientzako gertaera-entzuleak
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Aurreko gezia klikatuta");
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Hurrengo gezia klikatuta");
            nextSlide();
        });
    }
    
    // Erreprodukzio automatikoa (Auto-play)
    let autoPlayInterval;
    
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
        console.log("Auto-play hasieratuta");
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log("Auto-play geldituta");
        }
    }
    
    // Auto-play hasi
    startAutoPlay();
    
    // Auto-play pausatu elkarrekintzan aritzean
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Kontrolekin elkarrekintzan aritzean pausatu
    if (prevBtn) {
        prevBtn.addEventListener('mouseenter', stopAutoPlay);
        prevBtn.addEventListener('mouseleave', startAutoPlay);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('mouseenter', stopAutoPlay);
        nextBtn.addEventListener('mouseleave', startAutoPlay);
    }
    
    if (dotsContainer) {
        dotsContainer.addEventListener('mouseenter', stopAutoPlay);
        dotsContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Teklatu bidezko nabigazioa
    document.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
        } else if(e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
        }
    });
    
    console.log("Slider berria zuzen hasieratu da. Irudiak guztira:", totalSlides);
    
    // Hasierako posizioa behartu
    slider.style.transform = 'translateX(0%)';
});
