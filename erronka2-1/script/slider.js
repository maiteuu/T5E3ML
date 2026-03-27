/**
 * Slider Nagusia - Irudi-aurkezle dinamikoa
 * 
 * Sistema osoa irudiak automatikoki bistaratzeko:
 * - Auto-reprodukzioa (5 segundoko tartea)
 * - Gezien bidezko nabigazioa
 * - Puntuen bidezko nabigazioa
 * - Teklatu bidezko kontrola (geziak)
 * - Erabilerraztasun hobekuntzak (aria-labels)
 * 
 * Eragiketa logika:
 * 1. DOM-a kargatzean slider-a hasieratzen du
 * 2. Irudi guztiak kontatzen ditu
 * 3. Nabigazio puntuak sortzen ditu
 * 4. Auto-reprodukzioa aktibatzen du
 * 5. Erabiltzailearen interakzioak kudeatzen ditu
 * 
 * @author EEF
 * @version 2.0 - Euskal komentario gehituak
 */

// Slider berriaren funtzionalitatearako JavaScript-a
console.log("Slider JS kargatuta - Bertsio berria");

/**
 * DOM-a kargatzean slider-a hasieratzen du
 * 
 * Funtzio honek slider-a hasieratzen du:
 * 1. Elementu guztiak bilatzen ditu (slider, irudiak, geziak, puntuak)
 * 2. Elementuak existitzen direla egiaztatzen du
 * 3. Aldagai globalak hasieratzen ditu
 * 4. Nabigazio puntuak sortzen ditu
 * 5. Gertaera entzuleak konfiguratzen ditu
 * 6. Auto-reprodukzioa aktibatzen du
 */
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
    
    // Uneko irudiaren zenbakia eta irudi kopurua
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    /**
     * Nabigazio puntuak sortzen ditu
     * 
     * Funtzio honek irudi bakoitzerako puntu bat sortzen du:
     * 1. Aurreko puntu guztiak ezabatzen ditu
     * 2. Irudi kopuruaren arabera puntuak sortzen ditu
     * 3. Puntu bakoitzari click gertaera gehitzen dio
     * 4. Puntu aktiboa nabarmentzen du
     */
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
    
    /**
     * Puntuak eguneratzen ditu
     * 
     * Funtzio honek nabigazio puntuak eguneratzen ditu:
     * 1. Puntu guztiak lortzen ditu
     * 2. Uneko irudiaren puntuari 'active' klasea gehitzen dio
     * 3. Beste puntu guztiei 'active' klasea kendetzen die
     */
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
    
    /**
     * Irudi zehatz batera joaten da
     * 
     * @param {number} n - Joan nahi den irudiaren indizea
     * 
     * Funtzio honek slider-a mugitzen du:
     * 1. Indizea mugen barruan dagoela ziurtatzen du
     * 2. Ziklikoa egiten du (azkenetik lehenengora)
     * 3. CSS transform erabiliz mugitzen du
     * 4. Puntuak eguneratzen ditu
     */
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
    
    /**
     * Hurrengo irudira joaten da
     * 
     * Funtzio honek hurrengo irudira mugitzen du:
     * 1. Uneko indizea handitzen du
     * 2. goToSlide() funtzioari deitzen dio
     */
    function nextSlide() {
        console.log("Hurrengo irudia");
        goToSlide(currentSlide + 1);
    }
    
    /**
     * Aurreko irudira joaten da
     * 
     * Funtzio honek aurreko irudira mugitzen du:
     * 1. Uneko indizea gutxitzen du
     * 2. goToSlide() funtzioari deitzen dio
     */
    function prevSlide() {
        console.log("Aurreko irudia");
        goToSlide(currentSlide - 1);
    }
    
    // Puntuak hasieratu
    createDots();
    
    /**
     * Gezien bidezko nabigazioa
     * 
     * Geziei klik egitean:
     * 1. Gertaera lehenetsia saihesten du (preventDefault)
     * 2. Auto-reprodukzioa gelditzen du
     * 3. Hurrengo/aurreko irudira mugitzen du
     */
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
    
    /**
     * Erreprodukzio automatikoa (Auto-play)
     * 
     * Sistema honek 5 segunduro aldatzen du irudia:
     * 1. setInterval() erabiltzen du
     * 2. nextSlide() funtzioari deitzen dio
     * 3. Kontsolaren mezua bistaratzen du
     */
    let autoPlayInterval;
    
    /**
     * Erreprodukzio automatikoa hasten du
     * 
     * Funtzio honek:
     * 1. Aurreko auto-play-a gelditzen du (stopAutoPlay)
     * 2. 5 segundoko tartea ezartzen du
     * 3. setInterval() abiarazten du
     */
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
        console.log("Auto-play hasieratuta");
    }
    
    /**
     * Erreprodukzio automatikoa gelditzen du
     * 
     * Funtzio honek:
     * 1. Interval-a garbitzen du (clearInterval)
     * 2. Aldagaia null ezartzen du
     * 3. Kontsolaren mezua bistaratzen du
     */
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log("Auto-play geldituta");
        }
    }
    
    /**
     * Erabiltzailearen interakzioak kudeatzen ditu
     * 
     * Sistema honek erabiltzaileak slider-arekin
     * interakzionatzean auto-reprodukzioa pausatzen du:
     * 1. Mouse-a gainean jartzean (mouseenter) pausatzen du
     * 2. Mouse-a kentzean (mouseleave) berriro hasten du
     * 3. Erabiltzaile-kontrol guztietan aplikatzen du
     */
    
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
    
    /**
     * Teklatu bidezko nabigazioa
     * 
     * Teklatuko geziekin slider-a kontrolatzeko:
     * 1. Ezker-gezia: aurreko irudira mugitu
     * 2. Eskuin-gezia: hurrengo irudira mugitu
     * 3. Auto-reprodukzioa pausatzen du
     * 4. Erabilerraztasuna hobetzen du
     */
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
