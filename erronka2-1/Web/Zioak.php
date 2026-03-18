<?php include '../includes/header.php'; ?>

    <!-- Zioak eta Iradokienak atala -->
    <section class="standings-section">
        <div class="container-content">
            <div class="section-header-admin">
                <h2 class="section-title">Zioak eta Iradokienak</h2>
                <p>Zure zioak, iradokienak eta iritzia eman dezan aukera ematen dugu</p>
            </div>

            <!-- Formulario para enviar zioak -->
            <div class="zioak-form-container">
                <form id="zioakForm" onsubmit="handleZioaSend(event)">
                    <div class="form-group">
                        <label for="nombre">Izena *</label>
                        <input type="text" id="nombre" name="nombre" required placeholder="Sartzen duzun izena" maxlength="50">
                    </div>

                    <div class="form-group">
                        <label for="apellido">Abizena *</label>
                        <input type="text" id="apellido" name="apellido" required placeholder="Sartzen duzun abizena" maxlength="50">
                    </div>

                    <div class="form-group">
                        <label for="telefono">Telefonoa *</label>
                        <input type="tel" id="telefono" name="telefono" required placeholder="+34 6XX XXX XXX" pattern="[0-9+\s\-]+" maxlength="20">
                    </div>

                    <div class="form-group">
                        <label for="motibo">Motibo (Zioa/Iradokiera) *</label>
                        <textarea id="motibo" name="motibo" required placeholder="Zure zioa edo iradokiera idatzi" rows="6" maxlength="500"></textarea>
                        <small id="charCount">0/500</small>
                    </div>

                    <div class="form-buttons">
                        <button type="submit" class="btn-login btn-primary">
                            <i class="fas fa-paper-plane"></i> Bidali
                        </button>
                        <button type="reset" class="btn-login btn-secondary">
                            <i class="fas fa-redo"></i> Garbitu
                        </button>
                    </div>
                </form>

                <div id="successMessage" class="success-message" style="display: none;">
                    <i class="fas fa-check-circle"></i>
                    <p>Zure zioa/iradokiera ongi bidali da. Eskerrik asko!</p>
                </div>
            </div>

            <!-- Información sobre privacidad -->
            <div class="zioak-info-box">
                <h3><i class="fas fa-shield-alt"></i> Pribatutasuna</h3>
                <p>Zure datu pertsonalak ez dira hirugarrenei emango. Soilik administración bakarrik ikus dezake. Zioaren erantzun bat jasotuko duzu beranduago.</p>
            </div>

        </div>
    </section>

    <script src="../script/zioak-manager.js"></script>

<?php include '../includes/footer.php'; ?>