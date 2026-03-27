<?php include '../includes/header.php'; ?>

    <!-- Gurutzatzeak atala -->
    <section class="standings-section">
        <div class="container-content">
            <div class="section-header-admin">
                <h2 class="section-title">Gurutzatzeak</h2>
            </div>
            
            <div class="admin-panel">
                <div class="admin-panel-title">
                    <i class="fas fa-cog"></i> Administratzailearen panela
                </div>
                <div class="admin-actions">
                    <div id="temporadaSelect" style="display:inline-block;"></div>
                    <button class="btn-admin-action" onclick="habilitarEdicionCruces()">
                        <i class="fas fa-edit"></i> Gurutzatzeak Edita Daiteke
                    </button>
                    <button class="btn-admin-action" onclick="openModal('guardarTarteakModal')">
                        <i class="fas fa-save"></i> Gorde Gurutzatzeak
                    </button>
                    <button class="btn-admin-action btn-danger" onclick="borrarTemporadaCruces()" id="borrarTemporadaBtn" style="display:none;">
                        <i class="fas fa-trash"></i> Ezabatu Denboraldia
                    </button>
                </div>
            </div>

            <div class="cruces-wrapper" id="cruces-container">
                <!-- Eduki dinamikoa XML-tik -->
            </div>

            <!-- Denboraldi kontrolak (mugitu dira admin panelera) -->

            <!-- Leenda -->
            <div class="standings-legend">
                <div class="legend-item">
                    <span class="legend-bar" style="background-color: #90EE90;"></span>
                    <span class="legend-text">GARAIPENA</span>
                </div>
                <div class="legend-item">
                    <span class="legend-bar" style="background-color: #FFB6C6;"></span>
                    <span class="legend-text">GALDUA</span>
                </div>
                <div class="legend-item">
                    <span class="legend-bar" style="background-color: #FFFFE0;"></span>
                    <span class="legend-text">BERDINKETA</span>
                </div>
            </div>

        </div>
    </section>

    <!-- Modal para guardar tarteak -->
    <div id="guardarTarteakModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Gorde Tarteak</h2>
                <button class="modal-close" onclick="closeModal('guardarTarteakModal')">&times;</button>
            </div>
            <div class="modal-body">
                <p>Tarteak eguneratu egingo dira.</p>
            </div>
            <div class="modal-footer">
                <button class="btn-modal-cancel" onclick="closeModal('guardarTarteakModal')">Utzi</button>
                <button class="btn-modal-save" onclick="guardarCrucesConfirm()">Gorde</button>
            </div>
        </div>
    </div>

    <script src="../script/gurutzatzeak-manager.js"></script>

<?php include '../includes/footer.php'; ?>