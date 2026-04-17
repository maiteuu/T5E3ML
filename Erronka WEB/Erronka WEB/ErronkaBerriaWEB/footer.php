<footer>
    <div class="footer-edukia">

        <p>&copy; <?php echo date("Y"); ?> Eskubaloi Txapelketa</p>

        <div class="footer-ekintzak">
            <!-- Botón volver arriba -->
            <a href="#top" class="gorantz-botoia">
                <img src="Irudiak/Footer/Flechita.png" alt="Gora joan">
            </a>
        </div>

        <div class="footer-erabiltzailea">
            <?php
            if (isset($_SESSION['erabiltzailea'])) {
                echo "<p>👤 " . $_SESSION['erabiltzailea'] . "</p>";
            } else {
                echo "<p>Ez zaude konektatuta</p>";
            }
            ?>
        </div>

    </div>
</footer>

<!-- JavaScript -->
<script>
document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("goiburua");
    const boton = document.querySelector(".gorantz-botoia");

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    boton.classList.remove("visible");
                } else {
                    boton.classList.add("visible");
                }
            });
        },
        { threshold: 0 }
    );

    observer.observe(header);
});
</script>