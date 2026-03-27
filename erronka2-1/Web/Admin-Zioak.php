<?php
/**
 * Euskal Eskubaloi Federazioa - Zioaken Kudeaketa Orria
 * 
 * Administratzaileen kexen kudeaketa panela.
 * Kexak ikusi, ezabatu eta kudeatzeko interfazea.
 * 
 * Funtzioak:
 * - Kexen zerrenda bistaratzea
 * - Kexen xehetasunak ikustea
 * - Kexak ezabatzea
 * - Estatistikak erakustea
 * 
 * @author EEF
 * @version 1.1 - Optimized
 */

// Cache control headers for better performance
header('Cache-Control: public, max-age=300'); // 5 minutes cache
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 300) . ' GMT');

include '../includes/header.php';
?>

    <!-- Zioaken Kudeaketa atala -->
    <section class="standings-section">
        <div class="container-content">
            <div class="section-header-admin">
                <h2 class="section-title">Zioaken Kudeaketa</h2>
                <p>Bisitarien zioak eta iradokieak</p>
            </div>

            <!-- Panel de estadísticas -->
            <div class="admin-panel">
                <div class="admin-panel-title">
                    <i class="fas fa-inbox"></i> Sarrera kutxa
                </div>
                <div class="admin-actions">
                    <div class="stats-container">
                        <div class="stat-box">
                            <span class="stat-label">Guztira:</span>
                            <span class="stat-value" id="totalCount">0</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Irakurri gabe:</span>
                            <span class="stat-value unread" id="unreadCount">0</span>
                        </div>
                    </div>
                    <button class="btn-admin-action" onclick="recargarZioak()">
                        <i class="fas fa-sync"></i> Eguneratu
                    </button>
                    <button class="btn-admin-action btn-danger" onclick="borrarTodoZioak()">
                        <i class="fas fa-trash"></i> Guztia Ezabatu
                    </button>
                </div>
            </div>

            <!-- Lista de zioak -->
            <div class="zioak-list-container">
                <div id="zioakList" class="zioak-list">
                    <p style="text-align: center; color: #999;">Zioarik ez dago oraindik...</p>
                </div>
            </div>

            <!-- Modal para ver zioa en detalle -->
            <div id="zioaDetailModal" class="modal">
                <div class="modal-content modal-large">
                    <div class="modal-header">
                        <h2>Zioaren Xehetasunak</h2>
                        <button class="modal-close" onclick="closeModal('zioaDetailModal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="zioa-detail">
                            <div class="detail-row">
                                <span class="detail-label">Izena:</span>
                                <span class="detail-value" id="detailNombre"></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Abizena:</span>
                                <span class="detail-value" id="detailAbizena"></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Telefonoa:</span>
                                <span class="detail-value" id="detailTelefono"></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Data:</span>
                                <span class="detail-value" id="detailData"></span>
                            </div>
                            <div class="detail-row full-width">
                                <span class="detail-label">Motibo:</span>
                                <p class="detail-text" id="detailMotibo"></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-modal-cancel" onclick="closeModal('zioaDetailModal')">Itxi</button>
                        <button class="btn-modal-danger" onclick="borrarZioaActual()">
                            <i class="fas fa-trash"></i> Ezabatu
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- Inicializar datos de prueba si no existen (antes de cargar los scripts) -->
    <script>
        // Optimización: Lazy initialization y prevención de duplicados
        (function() {
            'use strict';
            
            // Solo inicializar si no existen datos
            if (!localStorage.getItem('eef_zioak')) {
                const testData = [
                    {
                        id: 'test_1',
                        izena: 'Jon',
                        abizena: 'Etxeburu',
                        telefonoa: '+34 666 123 456',
                        motibo: 'Nire iritzia da auzo bat gehitu behar dugula espazioa hobetzeko.',
                        data: '2026-03-10',
                        ordua: '14:30:00',
                        irakurrita: false
                    }
                ];
                localStorage.setItem('eef_zioak', JSON.stringify(testData));
                console.log('Datos de prueba inicializados');
            }
            
            // Preload del script para mejor rendimiento
            const script = document.createElement('script');
            script.src = '../script/zioak-manager.js';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        })();
    </script>

<?php include '../includes/footer.php'; ?>