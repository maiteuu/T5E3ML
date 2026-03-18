<?php
/**
 * Euskal Eskubaloi Federazioa - Saio Hasiera Orria
 * 
 * Administratzaileen saio-hasiera orria.
 * Erabiltzaile-izenak eta pasahitzak balidatzen ditu XML fitxategitik.
 * 
 * Funtzioak:
 * - Saioa hastea
 * - Erabiltzaileak balidatzea
 * - Kudeaketa panelera sartzea
 * - Segurtasuna
 * 
 * @author EEF
 * @version 1.0
 */

include '../includes/header.php';
?>

    <!-- Saioa hasteko atalak -->
    <div class="login-page">
        <div class="login-container">
            <h1>Saioa Hasi</h1>
            <p>EEF webgunearen kudeaketa panela</p>

            <form id="loginForm" onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label for="username">Erabiltzailea</label>
                    <input type="text" id="username" name="username" required placeholder="Idatzi zure erabiltzailea">
                </div>

                <div class="form-group">
                    <label for="password">Pasahitza</label>
                    <input type="password" id="password" name="password" required placeholder="Idatzi zure pasahitza">
                </div>

                <div class="form-buttons">
                    <button type="submit" class="btn-login btn-primary">
                        Saioa Hasi
                    </button>
                </div>
            </form>

            <div class="login-note">
                <strong>Kontu besteakoak:</strong><br>
                Admin: username: admin | password: admin<br>
                Moderador: username: moderador | password: moderador<br>
                Bisitaria: username: guest | password: guest
            </div>
        </div>
    </div>

<?php include '../includes/footer.php'; ?>