<?php include '../includes/header.php'; ?>

    <!-- Sailkapenaren atala -->
    <section class="standings-section">
        <div class="container-content">
            <div class="section-header-admin">
                <h2 class="section-title">Sailkapena</h2>
            </div>
            
            <!-- Registros guardados - Disponible para todos -->
            <div class="registros-section">
                <h3>Denbordaldi Ezagunak</h3>
                <select id="registroSelect" onchange="cargarRegistro()">
                    <option value="">-- Aukeratu denboraldia --</option>
                </select>
                <button class="btn-secondary" onclick="recargarRegistros()">
                    <i class="fas fa-refresh"></i> Eguneratu
                </button>
                <button class="btn-secondary btn-danger" onclick="borrarRegistro()" style="display: none;" id="borrarBtn">
                    <i class="fas fa-trash"></i> Ezabatu
                </button>
            </div>
            
            <div class="standings-table-wrapper" id="standings-container">
                <p style="text-align: center; color: #999;">Selecciona una temporada para ver la clasificación</p>
            </div>

            <!-- Sailkapenaren legenda -->
            <div class="standings-legend">
                <div class="legend-item">
                    <span class="legend-bar champions-bar"></span>
                    <span class="legend-text">CHAMPIONS</span>
                </div>
                <div class="legend-item">
                    <span class="legend-bar beherapena-bar"></span>
                    <span class="legend-text">BEHERAPENA</span>
                </div>
            </div>

        </div>
    </section>

    <!-- Modal para guardar con nombre (Admin Only) -->
    <div id="guardarRegistroModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Gorde Denboraldia</h2>
                <button class="modal-close" onclick="closeModal('guardarRegistroModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group-modal">
                    <label for="nombreRegistro">Denboraldi izena:</label>
                    <input type="text" id="nombreRegistro" placeholder="adibidez: Denboraldia 2024-2025" autofocus>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-modal-cancel" onclick="closeModal('guardarRegistroModal')">Utzi</button>
                <button class="btn-modal-save" onclick="guardarConNombre()">Gorde</button>
            </div>
        </div>
    </div>
    
    <script src="../script/sailkapena-manager.js"></script>

<?php include '../includes/footer.php'; ?>